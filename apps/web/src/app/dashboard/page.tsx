export default function DashboardPage() {
  return (
    <div className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h1 className="text-base font-mono font-bold text-text uppercase">
            Forensic Surveillance Dashboard
          </h1>
          <p className="text-xs text-muted font-mono mt-0.5">
            Real-time feed of detected Uniswap v4 extractions and pool metrics
          </p>
        </div>
        <div className="text-xs font-mono px-2 py-1 border border-border rounded bg-surface text-muted">
          Active Pools: <span className="text-accent font-semibold">6</span>
        </div>
      </div>

      <div className="border border-border rounded bg-surface p-8 text-center text-xs font-mono text-muted">
        No extractions in this pool. The last 200 swaps were clean.
      </div>
    </div>
  );
}

