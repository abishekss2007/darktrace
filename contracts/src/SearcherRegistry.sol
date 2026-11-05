// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

/**
 * @title SearcherRegistry
 * @notice Manages voluntary MEV searcher collateral bonds and governance slashing.
 * @dev Slashed searcher bonds are routed directly to the RebateVault to compensate LPs.
 */
contract SearcherRegistry {
    address public owner;
    
    mapping(address => uint256) public bonds;
    mapping(address => uint256) public totalSlashed;

    event BondDeposited(address indexed searcher, uint256 amount);
    event BondWithdrawn(address indexed searcher, uint256 amount);
    event BondSlashed(address indexed searcher, address indexed recipient, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    error Unauthorized();
    error InsufficientBond();
    error TransferFailed();
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
     * @notice Searchers deposit native collateral bond to establish reputation.
     */
    function depositBond() external payable {
        bonds[msg.sender] += msg.value;
        emit BondDeposited(msg.sender, msg.value);
    }

    /**
     * @notice Searcher withdraws un-slashed bond.
     */
    function withdrawBond(uint256 amount) external {
        if (bonds[msg.sender] < amount) revert InsufficientBond();
        bonds[msg.sender] -= amount;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) revert TransferFailed();

        emit BondWithdrawn(msg.sender, amount);
    }

    /**
     * @notice Governance/admin slashes a toxic searcher's bond and forwards it to the Rebate Vault.
     * @param searcher Address of the offending searcher bot.
     * @param recipient Target rebate vault or compensation address.
     * @param amount Slashed bond amount.
     */
    function slashBond(address searcher, address recipient, uint256 amount) external onlyOwner {
        if (recipient == address(0)) revert ZeroAddress();
        if (bonds[searcher] < amount) revert InsufficientBond();

        bonds[searcher] -= amount;
        totalSlashed[searcher] += amount;

        (bool success, ) = payable(recipient).call{value: amount}("");
        if (!success) revert TransferFailed();

        emit BondSlashed(searcher, recipient, amount);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
