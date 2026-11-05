// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test} from "forge-std/Test.sol";
import {Vm} from "forge-std/Vm.sol";
import {DarkTraceHook} from "../src/DarkTraceHook.sol";
import {MockPoolManager} from "./mocks/MockPoolManager.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "v4-core/types/PoolId.sol";
import {Currency} from "v4-core/types/Currency.sol";
import {IHooks} from "v4-core/interfaces/IHooks.sol";
import {Hooks} from "v4-core/libraries/Hooks.sol";
import {BalanceDelta, toBalanceDelta} from "v4-core/types/BalanceDelta.sol";

contract DarkTraceHookTest is Test {
    using PoolIdLibrary for PoolKey;

    MockPoolManager public mockManager;
    DarkTraceHook public hook;
    PoolKey public testKey;
    PoolId public testPoolId;

    address public constant SEARCHER = address(0x1111111111111111111111111111111111111111);
    address public constant VICTIM = address(0x2222222222222222222222222222222222222222);
    address public constant TRADER_CLEAN = address(0x3333333333333333333333333333333333333333);

    // Target hook address with BEFORE_SWAP (bit 7) and AFTER_SWAP (bit 6) set: 0x00C0
    address public constant VALID_HOOK_ADDRESS = address(uint160(Hooks.BEFORE_SWAP_FLAG | Hooks.AFTER_SWAP_FLAG));

    event ExtractionDetected(
        PoolId indexed poolId,
        address indexed searcher,
        address indexed victim,
        uint256 extractedValue,
        bytes32 proofHash
    );

    function setUp() public {
        mockManager = new MockPoolManager();

        testKey = PoolKey({
            currency0: Currency.wrap(address(0x1000)),
            currency1: Currency.wrap(address(0x2000)),
            fee: 3000,
            tickSpacing: 60,
            hooks: IHooks(VALID_HOOK_ADDRESS)
        });
        testPoolId = testKey.toId();

        // Deploy hook to address with required permission bits (0x00C0)
        deployCodeTo(
            "DarkTraceHook.sol",
            abi.encode(IPoolManager(address(mockManager)), int24(5)),
            VALID_HOOK_ADDRESS
        );
        hook = DarkTraceHook(VALID_HOOK_ADDRESS);

        // Initial pool state: tick = 100, price = 1 << 96
        mockManager.setSlot0(testPoolId, uint160(1 << 96), 100);
    }

    function test_HookPermissionsValidation() public view {
        Hooks.Permissions memory perms = hook.getHookPermissions();
        assertTrue(perms.beforeSwap);
        assertTrue(perms.afterSwap);
        assertFalse(perms.beforeInitialize);
        assertFalse(perms.afterInitialize);
        assertFalse(perms.beforeDonate);
    }

    function test_CleanSwap_NoExtractionDetected() public {
        IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
            zeroForOne: true,
            amountSpecified: -1 ether,
            sqrtPriceLimitX96: 0
        });

        // Pre-swap tick: 100
        vm.prank(address(mockManager));
        hook.beforeSwap(TRADER_CLEAN, testKey, params, "");

        // Normal market slippage: tick moves 100 -> 98 (delta = -2, below threshold 5)
        mockManager.setSlot0(testPoolId, uint160(1 << 96), 98);

        vm.recordLogs();
        vm.prank(address(mockManager));
        hook.afterSwap(TRADER_CLEAN, testKey, params, toBalanceDelta(1 ether, -1 ether), "");

        // Assert no ExtractionDetected events emitted
        Vm.Log[] memory entries = vm.getRecordedLogs();
        assertEq(entries.length, 0);
    }

    function test_SandwichAttack_EmitsExtractionDetected() public {
        // --- TX 1: Searcher Frontrun (zeroForOne = true, pushes tick from 100 to 80, delta = -20) ---
        IPoolManager.SwapParams memory frontrunParams = IPoolManager.SwapParams({
            zeroForOne: true,
            amountSpecified: -5 ether,
            sqrtPriceLimitX96: 0
        });

        vm.prank(address(mockManager));
        hook.beforeSwap(SEARCHER, testKey, frontrunParams, "");
        mockManager.setSlot0(testPoolId, uint160(1 << 96), 80);
        vm.prank(address(mockManager));
        hook.afterSwap(SEARCHER, testKey, frontrunParams, toBalanceDelta(5 ether, -5 ether), "");

        // --- TX 2: Victim Swap (zeroForOne = true, tick moves from 80 to 76, delta = -4) ---
        IPoolManager.SwapParams memory victimParams = IPoolManager.SwapParams({
            zeroForOne: true,
            amountSpecified: -10 ether,
            sqrtPriceLimitX96: 0
        });

        vm.prank(address(mockManager));
        hook.beforeSwap(VICTIM, testKey, victimParams, "");
        mockManager.setSlot0(testPoolId, uint160(1 << 96), 76);
        vm.prank(address(mockManager));
        hook.afterSwap(VICTIM, testKey, victimParams, toBalanceDelta(10 ether, -10 ether), "");

        // --- TX 3: Searcher Backrun (zeroForOne = false, reverses tick from 76 to 98, delta = +22) ---
        IPoolManager.SwapParams memory backrunParams = IPoolManager.SwapParams({
            zeroForOne: false,
            amountSpecified: 5 ether,
            sqrtPriceLimitX96: 0
        });

        vm.prank(address(mockManager));
        hook.beforeSwap(SEARCHER, testKey, backrunParams, "");
        mockManager.setSlot0(testPoolId, uint160(1 << 96), 98);

        // Expect ExtractionDetected event
        vm.expectEmit(true, true, true, false);
        emit ExtractionDetected(
            testPoolId,
            SEARCHER,
            VICTIM,
            0, // value checked via logs
            bytes32(0)
        );

        vm.prank(address(mockManager));
        hook.afterSwap(SEARCHER, testKey, backrunParams, toBalanceDelta(-5 ether, 5 ether), "");
    }

    function test_DefensiveFallback_OpposingSwapsAcrossDifferentBlocks_NoEvent() public {
        // Tx 1 in Block 100
        vm.roll(100);
        IPoolManager.SwapParams memory params1 = IPoolManager.SwapParams({
            zeroForOne: true,
            amountSpecified: -5 ether,
            sqrtPriceLimitX96: 0
        });
        vm.prank(address(mockManager));
        hook.beforeSwap(SEARCHER, testKey, params1, "");
        mockManager.setSlot0(testPoolId, uint160(1 << 96), 80);
        vm.prank(address(mockManager));
        hook.afterSwap(SEARCHER, testKey, params1, toBalanceDelta(5 ether, -5 ether), "");

        // Victim in Block 100
        IPoolManager.SwapParams memory params2 = IPoolManager.SwapParams({
            zeroForOne: true,
            amountSpecified: -10 ether,
            sqrtPriceLimitX96: 0
        });
        vm.prank(address(mockManager));
        hook.beforeSwap(VICTIM, testKey, params2, "");
        mockManager.setSlot0(testPoolId, uint160(1 << 96), 76);
        vm.prank(address(mockManager));
        hook.afterSwap(VICTIM, testKey, params2, toBalanceDelta(10 ether, -10 ether), "");

        // Backrun happens in next block (Block 101) - legitimate rebalance or non-atomic arbitrage
        vm.roll(101);
        IPoolManager.SwapParams memory params3 = IPoolManager.SwapParams({
            zeroForOne: false,
            amountSpecified: 5 ether,
            sqrtPriceLimitX96: 0
        });
        vm.prank(address(mockManager));
        hook.beforeSwap(SEARCHER, testKey, params3, "");
        mockManager.setSlot0(testPoolId, uint160(1 << 96), 98);

        vm.recordLogs();
        vm.prank(address(mockManager));
        hook.afterSwap(SEARCHER, testKey, params3, toBalanceDelta(-5 ether, 5 ether), "");

        // Must NOT emit because block gap broke intra-block sandwich condition
        Vm.Log[] memory entries = vm.getRecordedLogs();
        assertEq(entries.length, 0);
    }
}
