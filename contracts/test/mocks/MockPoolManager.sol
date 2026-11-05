// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolId} from "v4-core/types/PoolId.sol";

contract MockPoolManager {
    bytes32 constant POOLS_SLOT = bytes32(uint256(6)); // standard mapping slot
    mapping(bytes32 => bytes32) public slots;

    function setSlot0(PoolId poolId, uint160 sqrtPriceX96, int24 tick) external {
        bytes32 stateSlot = keccak256(abi.encodePacked(PoolId.unwrap(poolId), bytes32(uint256(6))));
        
        // Pack: tick in bits [160..183], sqrtPriceX96 in bits [0..159]
        bytes32 packedData = bytes32((uint256(uint24(tick)) << 160) | uint256(sqrtPriceX96));
        slots[stateSlot] = packedData;
    }

    function extsload(bytes32 slot) external view returns (bytes32) {
        return slots[slot];
    }

    function extsload(bytes32 startSlot, uint256 nSlots) external view returns (bytes32[] memory res) {
        res = new bytes32[](nSlots);
        for (uint256 i = 0; i < nSlots; i++) {
            res[i] = slots[bytes32(uint256(startSlot) + i)];
        }
    }
}
