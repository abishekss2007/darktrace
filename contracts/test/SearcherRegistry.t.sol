// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test} from "forge-std/Test.sol";
import {SearcherRegistry} from "../src/SearcherRegistry.sol";

contract SearcherRegistryTest is Test {
    SearcherRegistry public registry;
    address public admin = address(0xAA);
    address public searcher = address(0xBB);
    address public rebateVault = address(0xCC);

    function setUp() public {
        vm.deal(searcher, 10 ether);
        registry = new SearcherRegistry(admin);
    }

    function test_DepositAndWithdrawBond() public {
        vm.startPrank(searcher);
        registry.depositBond{value: 2 ether}();
        assertEq(registry.bonds(searcher), 2 ether);

        registry.withdrawBond(1 ether);
        assertEq(registry.bonds(searcher), 1 ether);
        assertEq(searcher.balance, 9 ether);
        vm.stopPrank();
    }

    function test_SlashBond() public {
        vm.prank(searcher);
        registry.depositBond{value: 5 ether}();

        vm.prank(admin);
        registry.slashBond(searcher, rebateVault, 3 ether);

        assertEq(registry.bonds(searcher), 2 ether);
        assertEq(registry.totalSlashed(searcher), 3 ether);
        assertEq(rebateVault.balance, 3 ether);
    }

    function test_RevertWhen_NonOwnerSlashes() public {
        vm.prank(searcher);
        registry.depositBond{value: 2 ether}();

        vm.prank(address(0xDEAD));
        vm.expectRevert(SearcherRegistry.Unauthorized.selector);
        registry.slashBond(searcher, rebateVault, 1 ether);
    }

    function test_RevertWhen_SlashExceedsBond() public {
        vm.prank(searcher);
        registry.depositBond{value: 1 ether}();

        vm.prank(admin);
        vm.expectRevert(SearcherRegistry.InsufficientBond.selector);
        registry.slashBond(searcher, rebateVault, 2 ether);
    }
}
