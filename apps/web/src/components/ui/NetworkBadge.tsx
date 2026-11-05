/**
 * Global network indicator displayed in the application header.
 * Always shows "BASE SEPOLIA · ARC TESTNET" in small monospace type.
 */
export function NetworkBadge() {
  return (
    <div
      className="flex items-center gap-2 px-2.5 py-1 border border-border rounded bg-bg text-[11px] font-mono select-none"
      data-testid="network-badge"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-good"></span>
      <span className="text-text tracking-wider uppercase">
        BASE SEPOLIA · ARC TESTNET
      </span>
    </div>
  );
}

