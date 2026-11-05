export function Footer() {
  const contracts = [
    {
      name: "v4 PoolManager",
      network: "Base Sepolia",
      address: "0x05FF2B0E24E15B20C9Ed8704337ca525Bc3095F6",
      explorerUrl: "https://sepolia.basescan.org/address/0x05FF2B0E24E15B20C9Ed8704337ca525Bc3095F6",
    },
    {
      name: "DarkTraceHook",
      network: "Base Sepolia",
      address: "0x4000...hook",
      explorerUrl: "https://sepolia.basescan.org",
    },
    {
      name: "RebateVault",
      network: "Arc Testnet",
      address: "0xArc...vault",
      explorerUrl: "https://explorer.testnet.arc.network",
    },
  ];

  return (
    <footer className="w-full border-t border-border bg-surface px-4 py-2 text-[11px] font-mono text-muted flex flex-col sm:flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-4">
        <span className="text-text font-semibold">DARKTRACE FORENSICS</span>
        <span>•</span>
        <span>ETHGlobal Mumbai 2026</span>
        <span>•</span>
        <span>Uniswap v4 + Arc + Arkiv</span>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto">
        {contracts.map((c) => (
          <a
            key={c.name}
            href={c.explorerUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-text transition-colors flex items-center gap-1"
          >
            <span className="text-muted">{c.name}:</span>
            <span className="text-text underline decoration-border hover:decoration-accent">
              {c.address.slice(0, 6)}...{c.address.slice(-4)}
            </span>
          </a>
        ))}
      </div>
    </footer>
  );
}

