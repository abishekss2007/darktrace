# Arc Studio prompt — DarkTrace RebateVault + SimulationRegistry

Please generate two Solidity smart contracts and comprehensive Foundry unit tests for an MEV restitution protocol on Arc Testnet (Chain ID 5042002):

---

## 1. Contract Specifications

### Contract 1: `SimulationRegistry`
An on-chain attestation registry that stores cryptographic commitments of off-chain counterfactual MEV simulations.
- **Compiler Version:** `pragma solidity 0.8.26;`
- **Ownership:** Ownable with an `owner` address set via constructor. Provide `transferOwnership(address newOwner) external onlyOwner`.
- **Data Model:**
  ```solidity
  struct Attestation {
      bytes32 simulationHash;
      uint256 extractedUSDC; // 6 decimals
      uint64 blockNumber;
      bool exists;
  }
  mapping(bytes32 => Attestation) public attestations;
  ```
- **Events:**
  - `event Attested(bytes32 indexed receiptHash, bytes32 simulationHash, uint256 extractedUSDC, uint64 blockNumber);`
  - `event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);`
- **Public API:**
  - `function attest(bytes32 receiptHash, bytes32 simulationHash, uint256 extractedUSDC, uint64 blockNumber) external onlyOwner;`
    - Reverts with `ZeroHash()` if `receiptHash == bytes32(0)` or `simulationHash == bytes32(0)`.
    - Reverts with `AlreadyAttested()` if `attestations[receiptHash].exists` is true.
    - Emits `Attested(receiptHash, simulationHash, extractedUSDC, blockNumber)`.
  - `function receiptOf(bytes32 receiptHash) external view returns (bool exists, uint256 amountUSDC, bytes32 simHash);`
    - Returns `(attestations[receiptHash].exists, attestations[receiptHash].extractedUSDC, attestations[receiptHash].simulationHash)`.

---

### Contract 2: `RebateVault`
A collateral vault on Arc holding native USDC and distributing restitution to affected liquidity providers against verified attestations.
- **Compiler Version:** `pragma solidity 0.8.26;`
- **Native USDC Token Interface on Arc:**
  - Contract Address: `0x3600000000000000000000000000000000000000` (Native 6-decimal ERC-20 interface).
  - Use a minimal `IERC20Minimal` interface (`transfer`, `transferFrom`, `balanceOf`).
- **Security & Reentrancy:**
  - Must include a `ReentrancyGuard` modifier on all state-mutating claim and fund extraction functions.
  - Follow strict Checks-Effects-Interactions (CEI) to prevent reentrancy and replay exploits.
- **Constructor Parameters:**
  `constructor(address _usdc, address _simulationRegistry, address _initialOwner)`
- **Data Model:**
  ```solidity
  mapping(bytes32 => bool) public claimedReceipts;
  ```
- **Events:**
  - `event RebateClaimed(bytes32 indexed receiptHash, address indexed recipient, uint256 amountUSDC);`
  - `event VaultFunded(address indexed sender, uint256 amountUSDC);`
- **Public API:**
  - `function claimRebate(bytes32 receiptHash, address recipient, uint256 amountUSDC) external nonReentrant;`
    - Validates `recipient != address(0)` and `recipient != address(this)`.
    - Reverts with `AlreadyClaimed()` if `claimedReceipts[receiptHash]` is true.
    - Queries `simulationRegistry.receiptOf(receiptHash)`:
      - Reverts with `UnverifiedReceipt()` if attestation does not exist.
      - Reverts with `AmountExceedsAttestation()` if `amountUSDC > attestedAmount`.
    - Reverts with `InsufficientVaultBalance()` if `usdc.balanceOf(address(this)) < amountUSDC`.
    - Sets `claimedReceipts[receiptHash] = true` BEFORE making the external ERC-20 transfer.
    - Transfers `amountUSDC` to `recipient` using `usdc.transfer(recipient, amountUSDC)`.
    - Emits `RebateClaimed(receiptHash, recipient, amountUSDC)`.
  - `function fund(uint256 amountUSDC) external;`
    - Calls `usdc.transferFrom(msg.sender, address(this), amountUSDC)`.
    - Emits `VaultFunded(msg.sender, amountUSDC)`.
  - `function emergencyWithdraw(address to, uint256 amountUSDC) external onlyOwner nonReentrant;`
    - Allows the owner to recover unused USDC.

---

## 2. Test Suite Requirements
Generate full Foundry unit tests covering:
1. **Successful Attestation & Rebate Claim:** End-to-end flow with simulated 6-decimal USDC (`1.25 USDC`).
2. **Double-Claim Prevention:** Ensure calling `claimRebate()` twice with the same `receiptHash` reverts with `AlreadyClaimed()`.
3. **Unauthorized Attestation:** Ensure non-owner cannot call `attest()` on `SimulationRegistry`.
4. **Amount Cap Enforcement:** Ensure attempting to claim more USDC than the attested value reverts with `AmountExceedsAttestation()`.
5. **Reentrancy Protection:** Verify `nonReentrant` modifier prevents reentrant token callbacks.

