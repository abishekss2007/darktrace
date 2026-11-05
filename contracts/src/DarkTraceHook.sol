// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {IHooks} from "v4-core/interfaces/IHooks.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "v4-core/types/PoolId.sol";
import {BalanceDelta} from "v4-core/types/BalanceDelta.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "v4-core/types/BeforeSwapDelta.sol";
import {Hooks} from "v4-core/libraries/Hooks.sol";
import {StateLibrary} from "v4-core/libraries/StateLibrary.sol";

/**
 * @title DarkTraceHook
 * @notice Uniswap v4 Hook that detects MEV sandwich extraction footprints via transient storage.
 * @dev Emits ExtractionDetected events without modifying swap execution or balances.
 */
contract DarkTraceHook is IHooks {
    using PoolIdLibrary for PoolKey;
    using Hooks for IHooks;
    using StateLibrary for IPoolManager;

    IPoolManager public immutable poolManager;
    address public owner;
    
    // Dynamic minimum tick delta threshold (defensive check to ignore normal micro-volatility)
    int24 public minTickDeltaThreshold;

    struct PoolTransientState {
        uint64 lastBlock;
        uint8 lastDirection; // 1 = zeroForOne, 2 = oneForZero
        int24 lastTickDelta;
        int24 frontrunTickDelta;
        address lastSender;
        address victimCandidate;
    }

    // ExtractionDetected event specification
    event ExtractionDetected(
        PoolId indexed poolId,
        address indexed searcher,
        address indexed victim,
        uint256 extractedValue,
        bytes32 proofHash
    );

    event ThresholdUpdated(int24 oldThreshold, int24 newThreshold);

    error NotPoolManager();
    error Unauthorized();
    error HookNotImplemented();

    modifier onlyPoolManager() {
        if (msg.sender != address(poolManager)) revert NotPoolManager();
        _;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    constructor(IPoolManager _poolManager, int24 _minTickDeltaThreshold) {
        poolManager = _poolManager;
        owner = msg.sender;
        minTickDeltaThreshold = _minTickDeltaThreshold;

        // Enforce that deployed address has valid BEFORE_SWAP and AFTER_SWAP flags
        Hooks.validateHookPermissions(IHooks(address(this)), getHookPermissions());
    }

    function getHookPermissions() public pure returns (Hooks.Permissions memory) {
        return Hooks.Permissions({
            beforeInitialize: false,
            afterInitialize: false,
            beforeAddLiquidity: false,
            afterAddLiquidity: false,
            beforeRemoveLiquidity: false,
            afterRemoveLiquidity: false,
            beforeSwap: true,
            afterSwap: true,
            beforeDonate: false,
            afterDonate: false,
            beforeSwapReturnDelta: false,
            afterSwapReturnDelta: false,
            afterAddLiquidityReturnDelta: false,
            afterRemoveLiquidityReturnDelta: false
        });
    }

    function setMinTickDeltaThreshold(int24 newThreshold) external onlyOwner {
        emit ThresholdUpdated(minTickDeltaThreshold, newThreshold);
        minTickDeltaThreshold = newThreshold;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // SWAP HOOKS (Transient Storage Tracking)
    // ─────────────────────────────────────────────────────────────────────────────

    /**
     * @notice Records pre-swap tick into transient storage (tstore).
     */
    function beforeSwap(
        address,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata,
        bytes calldata
    ) external override onlyPoolManager returns (bytes4, BeforeSwapDelta, uint24) {
        PoolId poolId = key.toId();
        (, int24 currentTick,,) = poolManager.getSlot0(poolId);

        bytes32 preTickSlot = _getPreTickSlot(poolId);
        bytes32 packedTick = bytes32(uint256(uint24(currentTick)) | (1 << 24));
        assembly {
            tstore(preTickSlot, packedTick)
            sstore(preTickSlot, packedTick)
        }

        return (IHooks.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, 0);
    }

    /**
     * @notice Compares realized tick impact against prior intra-block swaps to detect sandwich patterns.
     */
    function afterSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        BalanceDelta,
        bytes calldata
    ) external override onlyPoolManager returns (bytes4, int128) {
        PoolId poolId = key.toId();
        (, int24 postTick,,) = poolManager.getSlot0(poolId);

        bytes32 preTickSlot = _getPreTickSlot(poolId);
        bytes32 rawPreTick;
        assembly {
            rawPreTick := tload(preTickSlot)
            if iszero(rawPreTick) {
                rawPreTick := sload(preTickSlot)
            }
        }
        int24 preTick = int24(int256(uint256(rawPreTick) & 0x00FFFFFF));

        int24 tickDelta = postTick - preTick;
        PoolTransientState memory s = _loadTransientState(poolId);
        uint8 currentDirection = params.zeroForOne ? 1 : 2;

        if (s.lastBlock == uint64(block.number)) {
            // Case A: Backrun detected closing an open sandwich sequence
            if (
                s.victimCandidate != address(0) &&
                s.victimCandidate != sender &&
                currentDirection != s.lastDirection &&
                _isInversionSignificant(s.frontrunTickDelta, tickDelta)
            ) {
                uint256 estimatedExtracted = _estimateExtractedValue(params.amountSpecified, s.frontrunTickDelta, tickDelta);
                bytes32 proofHash = keccak256(
                    abi.encodePacked(
                        poolId,
                        sender,
                        s.victimCandidate,
                        block.number,
                        preTick,
                        postTick,
                        block.timestamp
                    )
                );

                emit ExtractionDetected(
                    poolId,
                    sender, // Backrunning searcher
                    s.victimCandidate, // Victim swapper
                    estimatedExtracted,
                    proofHash
                );

                s.victimCandidate = address(0);
                s.frontrunTickDelta = 0;
            } 
            // Case B: Victim swap observed following a potential frontrun push
            else if (
                s.lastSender != sender &&
                currentDirection == s.lastDirection &&
                _isPushSignificant(s.lastTickDelta)
            ) {
                s.victimCandidate = sender;
                s.frontrunTickDelta = s.lastTickDelta;
            }
        } else {
            // New block context: reset candidate
            s.victimCandidate = address(0);
            s.frontrunTickDelta = 0;
        }

        // Update state
        s.lastBlock = uint64(block.number);
        s.lastSender = sender;
        s.lastDirection = currentDirection;
        s.lastTickDelta = tickDelta;

        _storeTransientState(poolId, s);

        return (IHooks.afterSwap.selector, 0);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // DETECTION HEURISTICS (Pure / View)
    // ─────────────────────────────────────────────────────────────────────────────

    function _isPushSignificant(int24 tickDelta) internal view returns (bool) {
        int24 absDelta = tickDelta < 0 ? -tickDelta : tickDelta;
        return absDelta >= minTickDeltaThreshold;
    }

    function _isInversionSignificant(int24 pushDelta, int24 pullDelta) internal view returns (bool) {
        if ((pushDelta > 0 && pullDelta > 0) || (pushDelta < 0 && pullDelta < 0)) return false;

        int24 absPush = pushDelta < 0 ? -pushDelta : pushDelta;
        int24 absPull = pullDelta < 0 ? -pullDelta : pullDelta;

        if (absPush < minTickDeltaThreshold || absPull < minTickDeltaThreshold) return false;
        return (absPull * 100) / absPush >= 30;
    }

    function _estimateExtractedValue(
        int256 amountSpecified,
        int24 pushDelta,
        int24 pullDelta
    ) internal pure returns (uint256) {
        uint256 volume = amountSpecified < 0 ? uint256(-amountSpecified) : uint256(amountSpecified);
        int24 absPush = pushDelta < 0 ? -pushDelta : pushDelta;
        int24 absPull = pullDelta < 0 ? -pullDelta : pullDelta;
        
        uint256 impactBps = uint256(uint24(absPush < absPull ? absPush : absPull)) * 2;
        if (impactBps > 1000) impactBps = 1000;

        return (volume * impactBps) / 10000;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // TRANSIENT STORAGE MANAGEMENT
    // ─────────────────────────────────────────────────────────────────────────────

    function _getPreTickSlot(PoolId poolId) internal pure returns (bytes32) {
        return keccak256(abi.encode(poolId, "darktrace.tstore.pretick"));
    }

    function _getStateSlotA(PoolId poolId) internal pure returns (bytes32) {
        return keccak256(abi.encode(poolId, "darktrace.tstore.stateA"));
    }

    function _getStateSlotB(PoolId poolId) internal pure returns (bytes32) {
        return keccak256(abi.encode(poolId, "darktrace.tstore.stateB"));
    }

    function _loadTransientState(PoolId poolId) internal view returns (PoolTransientState memory s) {
        bytes32 slotA = _getStateSlotA(poolId);
        bytes32 slotB = _getStateSlotB(poolId);

        bytes32 valA;
        bytes32 valB;
        assembly {
            valA := tload(slotA)
            if iszero(valA) {
                valA := sload(slotA)
            }
            valB := tload(slotB)
            if iszero(valB) {
                valB := sload(slotB)
            }
        }

        s.lastBlock = uint64(uint256(valA));
        s.lastDirection = uint8(uint256(valA >> 64));
        s.lastTickDelta = int24(int256(uint256(valA >> 72)));
        s.frontrunTickDelta = int24(int256(uint256(valA >> 96)));
        s.lastSender = address(uint160(uint256(valA >> 120)));
        s.victimCandidate = address(uint160(uint256(valB)));
    }

    function _storeTransientState(PoolId poolId, PoolTransientState memory s) internal {
        bytes32 slotA = _getStateSlotA(poolId);
        bytes32 slotB = _getStateSlotB(poolId);

        bytes32 valA = bytes32(
            uint256(s.lastBlock) |
            (uint256(s.lastDirection) << 64) |
            (uint256(uint24(s.lastTickDelta)) << 72) |
            (uint256(uint24(s.frontrunTickDelta)) << 96) |
            (uint256(uint160(s.lastSender)) << 120)
        );
        bytes32 valB = bytes32(uint256(uint160(s.victimCandidate)));

        assembly {
            tstore(slotA, valA)
            sstore(slotA, valA)
            tstore(slotB, valB)
            sstore(slotB, valB)
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // UNUSED HOOKS
    // ─────────────────────────────────────────────────────────────────────────────

    function beforeInitialize(address, PoolKey calldata, uint160) external pure override returns (bytes4) {
        revert HookNotImplemented();
    }

    function afterInitialize(address, PoolKey calldata, uint160, int24) external pure override returns (bytes4) {
        revert HookNotImplemented();
    }

    function beforeAddLiquidity(address, PoolKey calldata, IPoolManager.ModifyLiquidityParams calldata, bytes calldata) external pure override returns (bytes4) {
        revert HookNotImplemented();
    }

    function afterAddLiquidity(address, PoolKey calldata, IPoolManager.ModifyLiquidityParams calldata, BalanceDelta, BalanceDelta, bytes calldata) external pure override returns (bytes4, BalanceDelta) {
        revert HookNotImplemented();
    }

    function beforeRemoveLiquidity(address, PoolKey calldata, IPoolManager.ModifyLiquidityParams calldata, bytes calldata) external pure override returns (bytes4) {
        revert HookNotImplemented();
    }

    function afterRemoveLiquidity(address, PoolKey calldata, IPoolManager.ModifyLiquidityParams calldata, BalanceDelta, BalanceDelta, bytes calldata) external pure override returns (bytes4, BalanceDelta) {
        revert HookNotImplemented();
    }

    function beforeDonate(address, PoolKey calldata, uint256, uint256, bytes calldata) external pure override returns (bytes4) {
        revert HookNotImplemented();
    }

    function afterDonate(address, PoolKey calldata, uint256, uint256, bytes calldata) external pure override returns (bytes4) {
        revert HookNotImplemented();
    }
}
