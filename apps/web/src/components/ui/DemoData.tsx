import { ReactNode } from "react";

interface DemoDataProps {
  children?: ReactNode;
  label?: string;
  className?: string;
}

/**
 * Inline wrapper and visible badge for seeded / illustrative testnet figures.
 * Ensures judges can immediately distinguish live on-chain reads from seeded demo records.
 */
export function DemoData({
  children,
  label = "DEMO",
  className = "",
}: DemoDataProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {children}
      <span className="px-1.5 py-0.5 text-[9px] leading-none font-mono font-normal tracking-wider uppercase text-muted bg-bg border border-border rounded select-none">
        [{label}]
      </span>
    </span>
  );
}

export function DemoDataBadge({
  children,
  label = "DEMO",
  className = "",
}: DemoDataProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {children}
      <span className="px-1.5 py-0.5 text-[9px] leading-none font-mono font-normal tracking-wider uppercase text-muted bg-bg border border-border rounded select-none">
        [{label}]
      </span>
    </span>
  );
}

