# DarkTrace — Arc Simulator & Rebate Vault Specification

## 1. Overview

The Arc settlement layer operates on Circle's USDC-native Layer-1 blockchain (Arc Testnet). It comprises:
1. **The Counterfactual Engine (`/lib/simulator/counterfactual.ts`)**: An off-chain deterministic viem replay engine that recreates clean pool execution and computes exact extracted value and slippage breakdown.
2. **SimulationRegistry (`/contracts/src/SimulationRegistry.sol`)**: An on-chain registry recording cryptographic attestations of simulation results.
3. **RebateVault (`/contracts/src/RebateVault.sol`)**: A secure, non-reentrant USDC vault where affected LPs claim restitution against verified `receiptHash` attestations.

---

## 2. Arc USDC Mechanics: Dual Interface Model

On Arc, Circle implements a dual-interface architecture:
- **Native Asset**: USDC is the native gas token.
- **ERC-20 Interface**: Standard 6-decimal USDC contract (`0x3600000000000000000000000000000000000000`) managing standard ERC-20 allowances and programmatic transfers.

`RebateVault.sol` targets the standard ERC-20 USDC interface, enabling seamless balance transfers, accounting, and multi-vault liquidity routing.

---

## 3. Mathematical Counterfactual Engine

Given an observed sandwich attack at block $N$ with transactions $\{T_{\text{frontrun}}, T_{\text{victim}}, T_{\text{backrun}}\}$:

### 3.1 State Snapshots
- Let $R_0 = (\text{reserve}_0, \text{reserve}_1, \text{tick}_0)$ be the pool reserves prior to $T_{\text{frontrun}}$.
- Let $R_{\text{actual}}$ be the reserves experienced by $T_{\text{victim}}$ after $T_{\text{frontrun}}$ executed.

### 3.2 Counterfactual Execution
The simulator computes what $T_{\text{victim}}$ would have received if $T_{\text{frontrun}}$ never occurred:
$$P_{\text{pre}} = \text{SpotPrice}(R_0)$$
$$P_{\text{clean}} = \text{SimulatedPrice}(R_0, T_{\text{victim}})$$
$$P_{\text{actual}} = \text{ObservedExecutionPrice}(R_{\text{actual}}, T_{\text{victim}})$$

### 3.3 Slippage Breakdown
1. **Legitimate Slippage**:
   $$\text{legitSlippageBps} = \left\lfloor \frac{|P_{\text{clean}} - P_{\text{pre}}|}{P_{\text{pre}}} \times 10{,}000 \right\rfloor$$
2. **Injected MEV Slippage**:
   $$\text{injectedSlippageBps} = \left\lfloor \frac{|P_{\text{actual}} - P_{\text{clean}}|}{P_{\text{clean}}} \times 10{,}000 \right\rfloor$$
3. **Extracted USDC**:
   $$\text{extractedUSDC} = \text{Volume}_{\text{victim}} \times \frac{\text{injectedSlippageBps}}{10{,}000}$$
4. **Deterministic Simulation Hash**:
   $$\text{simulationHash} = \text{keccak256}(\text{abi.encode}(R_0, T_{\text{victim}}, P_{\text{clean}}, P_{\text{actual}}))$$

---

## 4. Contract Specifications

### 4.1 SimulationRegistry.sol
```solidity
struct Attestation {
    bytes32 simulationHash;
    uint256 extractedUSDC; // 6 decimals
    uint64 blockNumber;
    bool exists;
}
```
- `recordSimulation(bytes32 simulationHash, bytes32 receiptHash, uint256 extractedUSDC)`: Admin/worker callable.
- `getAttestation(bytes32 receiptHash)`: Returns `(bool verified, uint256 amount)`.

### 4.2 RebateVault.sol
```solidity
function claimRebate(
    bytes32 receiptHash,
    address recipient,
    uint256 amountUSDC,
    bytes calldata proofBundle
) external nonReentrant;
```
- Replay protection: `mapping(bytes32 => bool) public claimedReceipts`.
- Attestation verification: Queries `SimulationRegistry.getAttestation(receiptHash)`.
- Reentrancy protection via OpenZeppelin `ReentrancyGuard`.
- Zero-address prevention and balance safety checks.

### 4.3 Testnet Vault Funding & Per-Attack Rebate Cap
- **Live Funded Balance**: `RebateVault` (`0x2ab745F51002Ce236A9A2dA81cDaA553B87f28CD`) is pre-funded on Arc Testnet with **`5.00 USDC`** (`5,000,000` units, 6 decimals) via transaction `0x4289870dba2b919eac9e654e853ff45f38a03bb9a66e0be3d6da8d8e07deab9d`.
- **Per-Receipt Rebate Cap**: The testnet demo vault caps rebates at **`2.00 USDC` per receipt** (with the canonical demo sandwich attack paying **`1.25 USDC`** and the three seeded historical receipts totaling **`3.75 USDC`**, summing to the exact `5.00 USDC` vault reserve); production caps TBD via pool governance.
