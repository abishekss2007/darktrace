import Link from "next/link";
import { MOCK_RECEIPTS } from "@/data/mockData";
import { HashDisplay } from "@/components/ui/HashDisplay";
import { StatusPill } from "@/components/ui/StatusPill";
import { ArrowLeft, AlertTriangle } from "lucide-react";

interface SearcherPageProps {
  params: {
    address: string;
  };
}

export default function SearcherPage({ params }: SearcherPageProps) {
  const searcherReceipts = MOCK_RECEIPTS.filter(
    (r) => r.searcher.toLowerCase() === params.address.toLowerCase()
  );

  const totalExtracted = searcherReceipts
    .reduce((acc, r) => acc + parseFloat(r.extractedUSDC), 0)
    .toFixed(2);

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Surveillance Matrix
        </Link>
      </div>

      {/* Searcher Header */}
      <div className="border border-border bg-surface p-6 rounded space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-accent uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-accent" />
              Searcher Reputation & Bond Ledger
            </div>
            <h1 className="text-xl font-bold font-mono text-text mt-1">
              Searcher Profile
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs font-mono text-muted">Bot Address:</span>
              <HashDisplay hash={params.address} truncate={false} className="text-xs" />
            </div>
          </div>
          <div className="px-3 py-1 border border-danger/40 bg-danger/10 text-danger rounded text-xs font-mono font-semibold">
            TOXIC ARBITRAGE PROFILE
          </div>
        </div>

        {/* Reputation Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border text-xs font-mono">
          <div className="p-3 border border-border rounded bg-bg">
            <div className="text-muted text-[11px]">Total Extractions</div>
            <div className="text-text font-bold mt-1 tabular-nums">{searcherReceipts.length || 1}</div>
          </div>
          <div className="p-3 border border-border rounded bg-bg">
            <div className="text-muted text-[11px]">Total Extracted</div>
            <div className="text-danger font-bold mt-1 tabular-nums">${totalExtracted}</div>
          </div>
          <div className="p-3 border border-border rounded bg-bg">
            <div className="text-muted text-[11px]">Collateral Bond</div>
            <div className="text-good font-bold mt-1 tabular-nums">$10,000.00 USDC</div>
          </div>
          <div className="p-3 border border-border rounded bg-bg">
            <div className="text-muted text-[11px]">Slashed by Protocol</div>
            <div className="text-danger font-bold mt-1 tabular-nums">$5,000.00 USDC</div>
          </div>
        </div>
      </div>

      {/* Observed Extractions */}
      <div className="space-y-3">
        <div className="text-xs font-mono font-semibold text-text uppercase tracking-wider">
          Observed Sandwich Attacks ({searcherReceipts.length})
        </div>

        <div className="border border-border rounded bg-surface overflow-x-auto">
          <table className="w-full text-xs font-mono text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-muted bg-[#15181E] select-none">
                <th className="py-2.5 px-3 font-semibold">Receipt Hash</th>
                <th className="py-2.5 px-3 font-semibold">Target Pool</th>
                <th className="py-2.5 px-3 font-semibold">Victim</th>
                <th className="py-2.5 px-3 font-semibold text-right">Extracted USDC</th>
                <th className="py-2.5 px-3 font-semibold text-right">Injected Slippage</th>
                <th className="py-2.5 px-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {searcherReceipts.map((r) => (
                <tr
                  key={r.receiptHash}
                  className="hover:bg-[#181B20] transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 px-3">
                    <Link href={`/receipt/${r.receiptHash}`}>
                      <HashDisplay hash={r.receiptHash} className="group-hover:text-accent" />
                    </Link>
                  </td>
                  <td className="py-2.5 px-3 text-text">
                    <Link href={`/pool/${r.poolId}`} className="hover:underline">
                      {r.poolName}
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
      </div>
    </div>
  );
}

