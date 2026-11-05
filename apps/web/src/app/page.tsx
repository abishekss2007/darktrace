import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col p-6 max-w-6xl mx-auto w-full space-y-6">
      {/* Top Banner */}
      <div className="border border-border bg-surface p-6 rounded">
        <div className="font-mono text-xs text-accent uppercase tracking-wider mb-2">
          Forensic Protocol • Uniswap v4 Hook • Arc Testnet • Arkiv
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text font-mono mb-3">
          DARKTRACE MEV FORENSICS
        </h1>
        <p className="text-muted text-sm max-w-2xl leading-relaxed">
          LPs are losing $1.2B to MEV. DarkTrace gives it back, and proves it on-chain.
          Transient-storage hooks detect extraction footprints on Base Sepolia,
          Arkiv seals immutable forensic receipts, and affected LPs claim USDC rebates on Arc.
        </p>
        <div className="mt-5 flex items-center gap-3">
          <Link
            href="/demo"
            className="px-4 py-2 bg-accent text-bg font-mono text-xs font-semibold rounded hover:opacity-90 transition-opacity"
          >
            Launch Terminal Demo
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 border border-border bg-bg text-text font-mono text-xs hover:border-muted transition-colors rounded"
          >
            Forensic Explorer
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="border border-border bg-surface p-4 rounded">
          <div className="text-[11px] font-mono text-muted uppercase">Detected Extractions</div>
          <div className="text-xl font-mono font-bold text-accent mt-1 tabular-nums">482</div>
          <div className="text-[10px] font-mono text-muted mt-1">Across 6 monitored v4 pools</div>
        </div>
        <div className="border border-border bg-surface p-4 rounded">
          <div className="text-[11px] font-mono text-muted uppercase">Extracted Volume</div>
          <div className="text-xl font-mono font-bold text-danger mt-1 tabular-nums">$148,920.40</div>
          <div className="text-[10px] font-mono text-muted mt-1">Past 7 days on Base Sepolia</div>
        </div>
        <div className="border border-border bg-surface p-4 rounded">
          <div className="text-[11px] font-mono text-muted uppercase">Rebates Paid (Arc)</div>
          <div className="text-xl font-mono font-bold text-good mt-1 tabular-nums">$112,450.00</div>
          <div className="text-[10px] font-mono text-muted mt-1">Settled in USDC to LP Vaults</div>
        </div>
        <div className="border border-border bg-surface p-4 rounded">
          <div className="text-[11px] font-mono text-muted uppercase">Arkiv Sealed Proofs</div>
          <div className="text-xl font-mono font-bold text-text mt-1 tabular-nums">100.0%</div>
          <div className="text-[10px] font-mono text-muted mt-1">Cryptographically immutable</div>
        </div>
      </div>

      {/* System Architecture Matrix */}
      <div className="border border-border bg-surface rounded p-4 space-y-3">
        <div className="font-mono text-xs font-semibold text-text uppercase tracking-wider">
          System Core Verification
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 border border-border rounded bg-bg space-y-1.5">
            <div className="text-accent font-semibold">1. Uniswap v4 Hook</div>
            <div className="text-muted text-[11px] leading-relaxed">
              Base Sepolia contract measuring tick inversion and volume deltas using Cancun transient storage (`tstore`). Emits `ExtractionDetected`.
            </div>
          </div>
          <div className="p-3 border border-border rounded bg-bg space-y-1.5">
            <div className="text-accent font-semibold">2. Arc Settlement</div>
            <div className="text-muted text-[11px] leading-relaxed">
              Circle USDC L1 hosting `RebateVault.sol` and `SimulationRegistry.sol`. Replays counterfactual execution and issues USDC restitution.
            </div>
          </div>
          <div className="p-3 border border-border rounded bg-bg space-y-1.5">
            <div className="text-accent font-semibold">3. Arkiv Proof Ledger</div>
            <div className="text-muted text-[11px] leading-relaxed">
              Permanent queryable audit trail for `ExtractionReceipt`, searcher reputation scores, and verified LP claim history.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

