import Link from "next/link";
import { MOCK_POOLS, MOCK_RECEIPTS } from "@/data/mockData";
import { HashDisplay } from "@/components/ui/HashDisplay";
import { StatusPill } from "@/components/ui/StatusPill";

export default function DashboardPage() {
  const totalExtracted = MOCK_RECEIPTS.reduce(
    (acc, r) => acc + parseFloat(r.extractedUSDC),
    0
  ).toFixed(2);

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-3">
        <div>
          <h1 className="text-lg font-mono font-bold text-text uppercase tracking-wider">
            Surveillance & Detection Matrix
          </h1>
          <p className="text-xs text-muted font-mono mt-0.5">
            Active surveillance of Uniswap v4 pools on Base Sepolia • Arc Testnet Settlement
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 border border-border bg-surface rounded text-xs font-mono">
            <span className="text-muted">Extracted (24h): </span>
            <span className="text-danger font-bold tabular-nums">${totalExtracted}</span>
          </div>
          <div className="px-3 py-1 border border-border bg-surface rounded text-xs font-mono">
            <span className="text-muted">Monitored Pools: </span>
            <span className="text-accent font-bold tabular-nums">{MOCK_POOLS.length}</span>
          </div>
        </div>
      </div>

      {/* Monitored Pools Table */}
      <div className="space-y-2">
        <div className="text-xs font-mono font-semibold text-text uppercase tracking-wider">
          Monitored Uniswap v4 Pools
        </div>
        <div className="border border-border rounded bg-surface overflow-x-auto">
          <table className="w-full text-xs font-mono text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-muted bg-[#15181E] select-none">
                <th className="py-2.5 px-3 font-semibold">Pool Pair</th>
                <th className="py-2.5 px-3 font-semibold">Fee</th>
                <th className="py-2.5 px-3 font-semibold text-right">TVL</th>
                <th className="py-2.5 px-3 font-semibold text-right">24h Volume</th>
                <th className="py-2.5 px-3 font-semibold text-right">24h Extracted</th>
                <th className="py-2.5 px-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_POOLS.map((pool) => (
                <tr
                  key={pool.id}
                  className="hover:bg-[#181B20] transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 px-3">
                    <Link href={`/pool/${pool.id}`} className="flex items-center gap-2 group-hover:text-accent">
                      <span className="font-bold text-text">{pool.name}</span>
                      <span className="text-muted text-[11px] font-normal">
                        ({pool.id.slice(0, 8)}…)
                      </span>
                    </Link>
                  </td>
                  <td className="py-2.5 px-3 text-muted">{pool.feeTier}</td>
                  <td className="py-2.5 px-3 text-right text-text tabular-nums">{pool.tvl}</td>
                  <td className="py-2.5 px-3 text-right text-muted tabular-nums">{pool.volume24h}</td>
                  <td className="py-2.5 px-3 text-right font-semibold tabular-nums text-danger">
                    {pool.extracted24h}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <StatusPill status={pool.status === "ACTIVE" ? "DETECTED" : "CLEAN"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forensic Receipts Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono font-semibold text-text uppercase tracking-wider">
            Recent Forensic Extraction Receipts
          </div>
          <div className="text-[11px] font-mono text-muted">Click row for full cryptographic receipt</div>
        </div>
        <div className="border border-border rounded bg-surface overflow-x-auto">
          <table className="w-full text-xs font-mono text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-muted bg-[#15181E] select-none">
                <th className="py-2.5 px-3 font-semibold">Receipt Hash</th>
                <th className="py-2.5 px-3 font-semibold">Pool</th>
                <th className="py-2.5 px-3 font-semibold">Searcher</th>
                <th className="py-2.5 px-3 font-semibold">Victim</th>
                <th className="py-2.5 px-3 font-semibold text-right">Extracted USDC</th>
                <th className="py-2.5 px-3 font-semibold text-right">Injected Slippage</th>
                <th className="py-2.5 px-3 font-semibold text-center">Pipeline Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_RECEIPTS.map((r) => (
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
