// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {IHooks} from "v4-core/interfaces/IHooks.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "v4-core/types/PoolId.sol";
import {Currency} from "v4-core/types/Currency.sol";
import {BalanceDelta} from "v4-core/types/BalanceDelta.sol";
import {TickMath} from "v4-core/libraries/TickMath.sol";
import {StateLibrary} from "v4-core/libraries/StateLibrary.sol";
import {PoolSwapTest} from "v4-core/test/PoolSwapTest.sol";
import {PoolModifyLiquidityTest} from "v4-core/test/PoolModifyLiquidityTest.sol";

/// @notice Minimal mintable ERC-20 with configurable decimals (test tokens only).
contract E2EToken {
    string public name;
    string public symbol;
    uint8 public immutable decimals;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(string memory _name, string memory _symbol, uint8 _decimals, address to, uint256 amount) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = amount;
        balanceOf[to] = amount;
        emit Transfer(address(0), to, amount);
    }

    function approve(address spender, uint256 value) external returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transfer(address to, uint256 value) external returns (bool) {
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        if (allowed != type(uint256).max) allowance[from][msg.sender] = allowed - value;
        balanceOf[from] -= value;
        balanceOf[to] += value;
        emit Transfer(from, to, value);
        return true;
    }
}

/// @notice Executes frontrun -> victim -> backrun as three real PoolManager swaps in ONE transaction.
/// @dev The searcher and the victim swap through two different router contracts, so DarkTraceHook
///      sees two distinct `sender`s (in Uniswap v4 the hook's sender is the contract that called
///      PoolManager.swap). One transaction guarantees same-block ordering. Both sides are controlled
///      by the operator: this is a scripted, real on-chain sandwich for end-to-end verification.
contract SandwichBundle {
    PoolSwapTest public immutable searcherRouter;
    PoolSwapTest public immutable victimRouter;
    address public immutable operator;

    event BundleExecuted(PoolId indexed poolId, uint256 frontrunIn, uint256 victimIn, uint256 backrunIn, int256 searcherPnl0);

    constructor(IPoolManager manager) {
        searcherRouter = new PoolSwapTest(manager);
        victimRouter = new PoolSwapTest(manager);
        operator = msg.sender;
    }

    function execute(PoolKey calldata key, uint256 frontrunIn, uint256 victimIn) external returns (int256 pnl0) {
        require(msg.sender == operator, "operator only");
        address t0 = Currency.unwrap(key.currency0);
        address t1 = Currency.unwrap(key.currency1);
        E2EToken(t0).approve(address(searcherRouter), type(uint256).max);
        E2EToken(t1).approve(address(searcherRouter), type(uint256).max);
        E2EToken(t0).approve(address(victimRouter), type(uint256).max);
        E2EToken(t1).approve(address(victimRouter), type(uint256).max);

        PoolSwapTest.TestSettings memory s = PoolSwapTest.TestSettings({takeClaims: false, settleUsingBurn: false});

        // 1. Frontrun: searcher sells token0 (pushes the price down / tick down).
        BalanceDelta d1 = searcherRouter.swap(key, _exactIn(true, frontrunIn), s, "");
        // 2. Victim: same direction, executes at the worse, pushed price.
        victimRouter.swap(key, _exactIn(true, victimIn), s, "");
        // 3. Backrun: searcher sells back exactly the token1 it bought (tick reverses).
        uint256 backrunIn = uint256(uint128(d1.amount1()));
        BalanceDelta d3 = searcherRouter.swap(key, _exactIn(false, backrunIn), s, "");

        pnl0 = int256(d3.amount0()) + int256(d1.amount0()); // token0 out of backrun minus token0 into frontrun
        emit BundleExecuted(key.toId(), frontrunIn, victimIn, backrunIn, pnl0);
    }

    function _exactIn(bool zeroForOne, uint256 amountIn) private pure returns (IPoolManager.SwapParams memory) {
        return IPoolManager.SwapParams({
            zeroForOne: zeroForOne,
            amountSpecified: -int256(amountIn), // negative = exact input in v4
            sqrtPriceLimitX96: zeroForOne ? TickMath.MIN_SQRT_PRICE + 1 : TickMath.MAX_SQRT_PRICE - 1
        });
    }

    function sweep(address token, address to) external {
        require(msg.sender == operator, "operator only");
        E2EToken(token).transfer(to, E2EToken(token).balanceOf(address(this)));
    }
}

using PoolIdLibrary for PoolKey;

/**
 * @title E2ESandwichScript
 * @notice Real end-to-end run against the deployed DarkTraceHook on Base Sepolia.
 *   setup():    deploys tUSDC (token0, 6 dp) + tWETH (token1, 18 dp), routers and the bundle,
 *               initializes a WETH/USDC-priced v4 pool on DarkTraceHook and adds liquidity.
 *   sandwich(): runs one frontrun -> victim -> backrun bundle; the hook emits ExtractionDetected.
 * Addresses are persisted to deployments/e2e-base-sepolia.json between the two steps.
 */
contract E2ESandwichScript is Script {
    using StateLibrary for IPoolManager;

    IPoolManager constant MANAGER = IPoolManager(0x05E73354cFDd6745C338b50BcFDfA3Aa6fA03408);
    IHooks constant HOOK = IHooks(0xBCC9e1C474Ed195b3791f2c41EdAC2a25c5b80c0);

    uint24 constant FEE = 3000; // 0.30%
    int24 constant TICK_SPACING = 60;
    int24 constant START_TICK = 196260; // ~3,000 tUSDC per tWETH (token0 = 6 dp, token1 = 18 dp)
    int24 constant RANGE = 1200; // +/- ~12.7% around the start price
    uint128 constant LIQUIDITY = 2e15;

    uint256 constant FRONTRUN_IN = 200e6; // 200 tUSDC
    uint256 constant VICTIM_IN = 1_000e6; // 1,000 tUSDC: big enough that the sandwich is profitable after 2x 0.30% fees,
    // small enough that the ~3.6 USDC loss is fully repayable from the 5 USDC RebateVault reserve on Arc

    string constant OUT = "deployments/e2e-base-sepolia.json";

    function setup() external {
        vm.startBroadcast();
        address me = msg.sender;

        // tWETH first, then mine a CREATE2 salt so tUSDC sorts below it (simulator expects token0 = USDC).
        E2EToken weth = new E2EToken("DarkTrace Test WETH", "tWETH", 18, me, 10_000e18);
        bytes memory usdcInit = abi.encodePacked(
            type(E2EToken).creationCode, abi.encode("DarkTrace Test USDC", "tUSDC", uint8(6), me, uint256(10_000_000e6))
        );
        bytes32 salt;
        for (uint256 i = 0; i < 10_000; i++) {
            if (vm.computeCreate2Address(bytes32(i), keccak256(usdcInit)) < address(weth)) {
                salt = bytes32(i);
                break;
            }
            require(i < 9_999, "no salt");
        }
        E2EToken usdc = new E2EToken{salt: salt}("DarkTrace Test USDC", "tUSDC", 6, me, 10_000_000e6);
        require(address(usdc) < address(weth), "token order");

        PoolKey memory key = PoolKey({
            currency0: Currency.wrap(address(usdc)),
            currency1: Currency.wrap(address(weth)),
            fee: FEE,
            tickSpacing: TICK_SPACING,
            hooks: HOOK
        });
        MANAGER.initialize(key, TickMath.getSqrtPriceAtTick(START_TICK));

        PoolModifyLiquidityTest lpRouter = new PoolModifyLiquidityTest(MANAGER);
        usdc.approve(address(lpRouter), type(uint256).max);
        weth.approve(address(lpRouter), type(uint256).max);
        lpRouter.modifyLiquidity(
            key,
            IPoolManager.ModifyLiquidityParams({
                tickLower: START_TICK - RANGE,
                tickUpper: START_TICK + RANGE,
                liquidityDelta: int256(uint256(LIQUIDITY)),
                salt: bytes32(0)
            }),
            ""
        );

        SandwichBundle bundle = new SandwichBundle(MANAGER);
        usdc.transfer(address(bundle), 100_000e6);
        weth.transfer(address(bundle), 10e18);
        vm.stopBroadcast();

        PoolId id = key.toId();
        console.log("tUSDC (token0):  ", address(usdc));
        console.log("tWETH (token1):  ", address(weth));
        console.log("LP router:       ", address(lpRouter));
        console.log("Bundle:          ", address(bundle));
        console.log("Searcher router: ", address(bundle.searcherRouter()));
        console.log("Victim router:   ", address(bundle.victimRouter()));
        console.log("PoolId:");
        console.logBytes32(PoolId.unwrap(id));

        string memory j = "e2e";
        vm.serializeAddress(j, "token0", address(usdc));
        vm.serializeAddress(j, "token1", address(weth));
        vm.serializeAddress(j, "lpRouter", address(lpRouter));
        vm.serializeAddress(j, "searcherRouter", address(bundle.searcherRouter()));
        vm.serializeAddress(j, "victimRouter", address(bundle.victimRouter()));
        vm.serializeBytes32(j, "poolId", PoolId.unwrap(id));
        string memory json = vm.serializeAddress(j, "bundle", address(bundle));
        vm.writeJson(json, OUT);
    }

    function sandwich() external {
        string memory json = vm.readFile(OUT);
        SandwichBundle bundle = SandwichBundle(vm.parseJsonAddress(json, ".bundle"));
        PoolKey memory key = PoolKey({
            currency0: Currency.wrap(vm.parseJsonAddress(json, ".token0")),
            currency1: Currency.wrap(vm.parseJsonAddress(json, ".token1")),
            fee: FEE,
            tickSpacing: TICK_SPACING,
            hooks: HOOK
        });
        (, int24 tickBefore,,) = MANAGER.getSlot0(key.toId());

        vm.startBroadcast();
        int256 pnl0 = bundle.execute(key, FRONTRUN_IN, VICTIM_IN);
        vm.stopBroadcast();

        (, int24 tickAfter,,) = MANAGER.getSlot0(key.toId());
        console.log("tick before:", tickBefore);
        console.log("tick after: ", tickAfter);
        console.log("searcher PnL (tUSDC raw):", pnl0);
    }
}
