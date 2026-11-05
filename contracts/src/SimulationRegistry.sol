// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

/**
 * @title SimulationRegistry
 * @notice On-chain registry on Arc holding cryptographic attestations of counterfactual simulations.
 * @dev Sits between the off-chain Arc simulator worker and RebateVault.sol.
 */
contract SimulationRegistry {
    address public owner;

    struct Attestation {
        bytes32 simulationHash;
        uint256 extractedUSDC; // 6 decimals
        uint64 blockNumber;
        bool exists;
    }

    mapping(bytes32 => Attestation) public attestations;

    event SimulationRecorded(
        bytes32 indexed simulationHash,
        bytes32 indexed receiptHash,
        uint256 extractedUSDC,
        uint64 blockNumber
    );

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    error Unauthorized();
    error ZeroHash();
    error AlreadyRecorded();
    error ZeroAddress();

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    constructor(address initialOwner) {
        if (initialOwner == address(0)) revert ZeroAddress();
        owner = initialOwner;
    }

    /**
     * @notice Records an attested simulation result for a forensic receipt hash.
     */
    function recordSimulation(
        bytes32 simulationHash,
        bytes32 receiptHash,
        uint256 extractedUSDC
    ) external onlyOwner {
        if (simulationHash == bytes32(0) || receiptHash == bytes32(0)) revert ZeroHash();
        if (attestations[receiptHash].exists) revert AlreadyRecorded();

        attestations[receiptHash] = Attestation({
            simulationHash: simulationHash,
            extractedUSDC: extractedUSDC,
            blockNumber: uint64(block.number),
            exists: true
        });

        emit SimulationRecorded(simulationHash, receiptHash, extractedUSDC, uint64(block.number));
    }

    /**
     * @notice Returns attestation status and verified amount for a receipt hash.
     */
    function getAttestation(bytes32 receiptHash)
        external
        view
        returns (bool verified, uint256 amountUSDC, bytes32 simHash)
    {
        Attestation memory a = attestations[receiptHash];
        return (a.exists, a.extractedUSDC, a.simulationHash);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
