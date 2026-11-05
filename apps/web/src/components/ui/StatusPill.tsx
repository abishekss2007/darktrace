interface StatusPillProps {
  status: "DETECTED" | "SIMULATED" | "ARCHIVED" | "REBATED" | "CLEAN";
  className?: string;
}

export function StatusPill({ status, className = "" }: StatusPillProps) {
  let style = "border-border text-muted";

  switch (status) {
    case "DETECTED":
      style = "border-accent/40 bg-accent/10 text-accent";
      break;
    case "SIMULATED":
      style = "border-[#388BFD]/40 bg-[#388BFD]/10 text-[#58A6FF]";
      break;
    case "ARCHIVED":
      style = "border-[#A371F7]/40 bg-[#A371F7]/10 text-[#BC8CFF]";
      break;
    case "REBATED":
      style = "border-good/40 bg-good/10 text-good";
      break;
    case "CLEAN":
      style = "border-border bg-surface text-muted";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium border rounded uppercase tracking-wider select-none ${style} ${className}`}
    >
      {status}
    </span>
  );
}

