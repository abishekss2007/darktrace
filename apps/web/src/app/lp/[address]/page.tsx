import Link from "next/link";
import { MOCK_RECEIPTS } from "@/data/mockData";
import { HashDisplay } from "@/components/ui/HashDisplay";
import { StatusPill } from "@/components/ui/StatusPill";
import { ArrowLeft, Wallet, CheckCircle } from "lucide-react";

interface LPPageProps {
  params: {
    address: string;
  };
}

export default function LPPage({ params }: LPPageProps) {
  const lpReceipts = MOCK_RECEIPTS.filter(
    (r) => r.victim.toLowerCase() === params.address.toLowerCase()
  );

  const totalSuffered = lpReceipts
    .reduce((acc, r) => acc + parseFloat(r.extractedUSDC), 0)
    .toFixed(2);

  const totalRebated = lpReceipts
    .filter((r) => r.status === "REBATED")
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

      {/* LP Header */}
      <div className="border border-border bg-surface p-6 rounded space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-accent uppercase tracking-wider flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-good" />
              Liquidity Provider Restitution Account
            </div>
            <h1 className="text-xl font-bold font-mono text-text mt-1">
              LP Forensics & Restitution
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs font-mono text-muted">LP Address:</span>
              <HashDisplay hash={params.address} truncate={false} className="text-xs" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/demo"
              className="px-3 py-1.5 bg-accent text-bg font-mono text-xs font-semibold rounded hover:opacity-90 transition-opacity"
            >
              Open Claim Portal
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border text-xs font-mono">
          <div className="p-3 border border-border rounded bg-bg">
            <div className="text-muted text-[11px]">Extractions Suffered</div>
            <div className="text-text font-bold mt-1 tabular-nums">{lpReceipts.length || 1}</div>
          </div>
          <div className="p-3 border border-border rounded bg-bg">
            <div className="text-muted text-[11px]">Total Value Extracted</div>
            <div className="text-danger font-bold mt-1 tabular-nums">${totalSuffered}</div>
          </div>
          <div className="p-3 border border-border rounded bg-bg">
            <div className="text-muted text-[11px]">Total Rebates Claimed</div>
            <div className="text-good font-bold mt-1 tabular-nums">${totalRebated} USDC</div>
          </div>
          <div className="p-3 border border-border rounded bg-bg">
            <div className="text-muted text-[11px]">Settlement Network</div>
            <div className="text-accent font-bold mt-1">Arc Testnet (Circle)</div>
          </div>
        </div>
      </div>

      {/* Extractions Suffered Table */}
      <div className="space-y-3">
        <div className="text-xs font-mono font-semibold text-text uppercase tracking-wider">
          Observed Extractions on this Account ({lpReceipts.length})
        </div>

        <div className="border border-border rounded bg-surface overflow-x-auto">
          <table className="w-full text-xs font-mono text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-muted bg-[#15181E] select-none">
                <th className="py-2.5 px-3 font-semibold">Receipt Hash</th>
                <th className="py-2.5 px-3 font-semibold">Pool</th>
                <th className="py-2.5 px-3 font-semibold">Searcher</th>
                <th className="py-2.5 px-3 font-semibold text-right">Extracted USDC</th>
                <th className="py-2.5 px-3 font-semibold text-right">Injected Slippage</th>
                <th className="py-2.5 px-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lpReceipts.map((r) => (
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
                    <Link href={`/searcher/${r.searcher}`}>
                      <HashDisplay hash={r.searcher} className="text-muted hover:text-text" />
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

