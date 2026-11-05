// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {SimulationRegistry} from "../src/SimulationRegistry.sol";
import {RebateVault} from "../src/RebateVault.sol";

/**
 * @title DeployArcTestnetScript
 * @notice Deploys SimulationRegistry and RebateVault on Arc Testnet (Circle USDC-native L1).
 */
contract DeployArcTestnetScript is Script {
    // Standard Arc native USDC ERC-20 contract address (6 decimals)
    address public constant ARC_USDC_ERC20 = 0x3600000000000000000000000000000000000000;

    function run() external returns (address simRegistryAddress, address rebateVaultAddress) {
        uint256 deployerPrivateKey = vm.envOr(
            "DEPLOYER_PRIVATE_KEY",
            uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80)
        );
        address deployer = vm.addr(deployerPrivateKey);

        console.log("=== DarkTrace Arc Testnet Deployment ===");
        console.log("Deployer:", deployer);
        console.log("Arc USDC Token:", ARC_USDC_ERC20);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy SimulationRegistry
        SimulationRegistry simRegistry = new SimulationRegistry(deployer);
        simRegistryAddress = address(simRegistry);
        console.log("SimulationRegistry deployed at:", simRegistryAddress);

        // 2. Deploy RebateVault
        RebateVault rebateVault = new RebateVault(
            ARC_USDC_ERC20,
            simRegistryAddress,
            deployer
        );
        rebateVaultAddress = address(rebateVault);
        console.log("RebateVault deployed at:", rebateVaultAddress);

        vm.stopBroadcast();

        console.log("==========================================");
        console.log("Deployment verified on Arc Testnet.");
    }
}

