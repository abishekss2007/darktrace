export default function DemoPage() {
  return (
    <div className="flex-1 p-4 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Left Column: Live Event Stream */}
      <div className="border border-border rounded bg-surface p-4 flex flex-col space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="font-mono text-xs font-bold text-text uppercase">
            Live Forensic Event Stream
          </span>
          <span className="text-[11px] font-mono text-accent">MONITORING</span>
        </div>
        <div className="flex-1 min-h-[300px] border border-border rounded bg-bg p-4 flex items-center justify-center text-xs font-mono text-muted">
          Waiting for sandwich event... Trigger simulation to observe forensic pipeline.
        </div>
      </div>

      {/* Right Column: Receipt Inspector */}
      <div className="border border-border rounded bg-surface p-4 flex flex-col space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="font-mono text-xs font-bold text-text uppercase">
            Forensic Receipt Inspector
          </span>
          <span className="text-[11px] font-mono text-muted">READY</span>
        </div>
        <div className="flex-1 min-h-[300px] border border-border rounded bg-bg p-4 flex items-center justify-center text-xs font-mono text-muted">
          No receipt selected. Select an extraction from the event stream.
        </div>
      </div>
    </div>
  );
}

