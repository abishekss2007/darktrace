// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test} from "forge-std/Test.sol";
import {RebateVault} from "../src/RebateVault.sol";
import {SimulationRegistry} from "../src/SimulationRegistry.sol";
import {MockUSDC} from "./mocks/MockUSDC.sol";

contract RebateVaultTest is Test {
    MockUSDC public usdc;
    SimulationRegistry public registry;
    RebateVault public vault;

    address public admin = address(0xAA);
    address public victimLP = address(0xBB);
    address public funder = address(0xCC);

    bytes32 public constant SAMPLE_SIM_HASH = keccak256("simulation.sample.123");
    bytes32 public constant SAMPLE_RECEIPT_HASH = keccak256("receipt.sample.456");
    uint256 public constant ATTESTED_USDC = 142_500_000; // 142.50 USDC (6 decimals)

    function setUp() public {
        usdc = new MockUSDC();
        registry = new SimulationRegistry(admin);
        vault = new RebateVault(address(usdc), address(registry), admin);

        // Fund vault with 10,000 USDC
        usdc.mint(address(vault), 10_000_000_000);
    }

    function test_HappyPathClaim() public {
        // 1. Admin records verified simulation in registry
        vm.prank(admin);
        registry.recordSimulation(SAMPLE_SIM_HASH, SAMPLE_RECEIPT_HASH, ATTESTED_USDC);

        // 2. LP claims rebate
        vm.prank(victimLP);
        vault.claimRebate(SAMPLE_RECEIPT_HASH, victimLP, ATTESTED_USDC, "");

        // 3. Verify state changes
        assertEq(usdc.balanceOf(victimLP), ATTESTED_USDC);
        assertTrue(vault.claimedReceipts(SAMPLE_RECEIPT_HASH));
    }

    function test_RevertWhen_ReplayClaim() public {
        vm.prank(admin);
        registry.recordSimulation(SAMPLE_SIM_HASH, SAMPLE_RECEIPT_HASH, ATTESTED_USDC);

        // First claim succeeds
        vm.prank(victimLP);
        vault.claimRebate(SAMPLE_RECEIPT_HASH, victimLP, ATTESTED_USDC, "");

        // Replay attempt must revert
        vm.prank(victimLP);
        vm.expectRevert(RebateVault.AlreadyClaimed.selector);
        vault.claimRebate(SAMPLE_RECEIPT_HASH, victimLP, ATTESTED_USDC, "");
    }

    function test_RevertWhen_SelfPayout() public {
        vm.prank(admin);
        registry.recordSimulation(SAMPLE_SIM_HASH, SAMPLE_RECEIPT_HASH, ATTESTED_USDC);

        vm.prank(victimLP);
        vm.expectRevert(RebateVault.SelfPayoutBlocked.selector);
        vault.claimRebate(SAMPLE_RECEIPT_HASH, address(vault), ATTESTED_USDC, "");
    }

    function test_RevertWhen_UnverifiedReceipt() public {
        bytes32 unverifiedHash = keccak256("fake.receipt.hash");

        vm.prank(victimLP);
        vm.expectRevert(RebateVault.UnverifiedReceipt.selector);
        vault.claimRebate(unverifiedHash, victimLP, ATTESTED_USDC, "");
    }

    function test_RevertWhen_ClaimExceedsAttestation() public {
        vm.prank(admin);
        registry.recordSimulation(SAMPLE_SIM_HASH, SAMPLE_RECEIPT_HASH, ATTESTED_USDC);

        // Attempt to claim more than attested
        vm.prank(victimLP);
        vm.expectRevert(RebateVault.AmountExceedsAttestation.selector);
        vault.claimRebate(SAMPLE_RECEIPT_HASH, victimLP, ATTESTED_USDC + 1, "");
    }
}
