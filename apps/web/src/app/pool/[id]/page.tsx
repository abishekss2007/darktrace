import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_POOLS, MOCK_RECEIPTS } from "@/data/mockData";
import { HashDisplay } from "@/components/ui/HashDisplay";
import { StatusPill } from "@/components/ui/StatusPill";
import { ArrowLeft } from "lucide-react";

interface PoolPageProps {
  params: {
    id: string;
  };
}

export default function PoolPage({ params }: PoolPageProps) {
  const pool = MOCK_POOLS.find((p) => p.id.toLowerCase() === params.id.toLowerCase()) || {
    id: params.id,
    name: "Custom Uniswap v4 Pool",
    feeTier: "0.05%",
    tvl: "$4,200,000",
    volume24h: "$890,000",
    extracted24h: "$0.00",
    status: "CLEAN" as const,
    token0: "0x4200000000000000000000000000000000000006",
    token1: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  };

  const poolReceipts = MOCK_RECEIPTS.filter(
    (r) => r.poolId.toLowerCase() === params.id.toLowerCase()
  );

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Surveillance Matrix
        </Link>
      </div>

      {/* Pool Header */}
      <div className="border border-border bg-surface p-6 rounded space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-accent uppercase tracking-wider">
              Uniswap v4 Pool Inspector
            </div>
            <h1 className="text-xl font-bold font-mono text-text mt-1">{pool.name}</h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs font-mono text-muted">Pool ID:</span>
              <HashDisplay hash={pool.id} truncate={false} className="text-xs" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill status={pool.status === "ACTIVE" ? "DETECTED" : "CLEAN"} />
          </div>
        </div>

        {/* Pool Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border text-xs font-mono">
          <div className="p-3 border border-border rounded bg-bg">
            <div className="text-muted text-[11px]">Fee Tier</div>
            <div className="text-text font-bold mt-1">{pool.feeTier}</div>
          </div>
          <div className="p-3 border border-border rounded bg-bg">
            <div className="text-muted text-[11px]">Pool TVL</div>
            <div className="text-text font-bold mt-1 tabular-nums">{pool.tvl}</div>
          </div>
          <div className="p-3 border border-border rounded bg-bg">
            <div className="text-muted text-[11px]">24h Volume</div>
            <div className="text-muted font-bold mt-1 tabular-nums">{pool.volume24h}</div>
          </div>
          <div className="p-3 border border-border rounded bg-bg">
            <div className="text-muted text-[11px]">24h Extracted</div>
            <div className="text-danger font-bold mt-1 tabular-nums">{pool.extracted24h}</div>
          </div>
        </div>
      </div>

      {/* Receipts in this Pool */}
      <div className="space-y-3">
        <div className="text-xs font-mono font-semibold text-text uppercase tracking-wider">
          Detected Extractions in this Pool ({poolReceipts.length})
        </div>

        {poolReceipts.length === 0 ? (
          <div className="border border-border rounded bg-surface p-8 text-center text-xs font-mono text-muted">
            No extractions in this pool. The last 200 swaps were clean.
          </div>
        ) : (
          <div className="border border-border rounded bg-surface overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-muted bg-[#15181E] select-none">
                  <th className="py-2.5 px-3 font-semibold">Receipt Hash</th>
                  <th className="py-2.5 px-3 font-semibold">Searcher</th>
                  <th className="py-2.5 px-3 font-semibold">Victim</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Extracted USDC</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Injected Slippage</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {poolReceipts.map((r) => (
                  <tr
                    key={r.receiptHash}
                    className="hover:bg-[#181B20] transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3">
                      <Link href={`/receipt/${r.receiptHash}`}>
                        <HashDisplay hash={r.receiptHash} className="group-hover:text-accent" />
                      </Link>
                    </td>
                    <td className="py-2.5 px-3">
                      <Link href={`/searcher/${r.searcher}`}>
                        <HashDisplay hash={r.searcher} className="text-muted hover:text-text" />
                      </Link>
                    </td>
                    <td className="py-2.5 px-3">
                      <Link href={`/lp/${r.victim}`}>
                        <HashDisplay hash={r.victim} className="text-muted hover:text-text" />
                      </Link>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-danger tabular-nums">
                      ${r.extractedUSDC}
                    </td>
                    <td className="py-2.5 px-3 text-right text-accent tabular-nums">
                      +{r.injectedSlippageBps} bps
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <StatusPill status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

