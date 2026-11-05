import Link from "next/link";
import { MOCK_RECEIPTS } from "@/data/mockData";
import { HashDisplay } from "@/components/ui/HashDisplay";
import { StatusPill } from "@/components/ui/StatusPill";
import { DemoData } from "@/components/ui/DemoData";
import { ArrowLeft, ExternalLink, ShieldCheck, Database } from "lucide-react";

interface ReceiptPageProps {
  params: {
    hash: string;
  };
}

export default function ReceiptPage({ params }: ReceiptPageProps) {
  const receipt = MOCK_RECEIPTS.find(
    (r) => r.receiptHash.toLowerCase() === params.hash.toLowerCase()
  ) || {
    receiptHash: params.hash,
    poolId: "0x835c24ae58a98118715d7541b2c5f0df8f11ca328b8e9c9c3850441c632e8d21",
    poolName: "WETH / USDC",
    searcher: "0x1111111111111111111111111111111111111111",
    victim: "0x2222222222222222222222222222222222222222",
    lp: "0x3333333333333333333333333333333333333333",
    blockNumber: 12489201,
    extractedUSDC: "1.25",
    injectedSlippageBps: 187,
    legitSlippageBps: 12,
    lpLvrDelta: "-$1.21",
    simulationHash: "0xc9ddedeba69e600924875d3ce6c3e2cd554170c510cec4bfd5016182dc156309",
    arkivURI: `arkiv://darktrace.v1/receipt/${params.hash}`,
    status: "ARCHIVED" as const,
    txHashes: [
      "0xaaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111",
      "0xbbbb2222bbbb2222bbbb2222bbbb2222bbbb2222bbbb2222bbbb2222bbbb2222",
      "0xcccc3333cccc3333cccc3333cccc3333cccc3333cccc3333cccc3333cccc3333",
    ],
    createdAt: Date.now() - 3600000,
  };

  const netToxicSlippage = receipt.injectedSlippageBps - receipt.legitSlippageBps;

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-6">
      {/* Back Link */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Surveillance Matrix
        </Link>
      </div>

      {/* Main Forensic Header */}
      <div className="border border-border bg-surface p-6 rounded space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-accent uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-good" />
              Arkiv Attested Forensic Receipt
            </div>
            <h1 className="text-xl font-bold font-mono text-text mt-1">
              Extraction Receipt
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs font-mono text-muted">Receipt Hash:</span>
              <HashDisplay hash={receipt.receiptHash} truncate={false} className="text-xs" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill status={receipt.status} />
          </div>
        </div>

        {/* Highlighted Slippage Insight Box */}
        <div className="p-4 border border-border rounded bg-bg space-y-2">
          <div className="text-xs font-mono text-text font-semibold flex items-center justify-between">
            <span>Counterfactual Slippage Decomposition</span>
            <DemoData>
              <span className="text-danger font-mono font-bold tabular-nums">
                ${receipt.extractedUSDC} USDC Lost
              </span>
            </DemoData>
          </div>
          <p className="text-xs font-mono text-muted leading-relaxed">
            Victim suffered <span className="text-danger font-semibold">+{receipt.injectedSlippageBps} bps</span> of realized slippage. 
            Counterfactual simulation proves clean market slippage was only <span className="text-good font-semibold">{receipt.legitSlippageBps} bps</span>. 
            The remaining <span className="text-accent font-semibold">{netToxicSlippage} bps</span> was artificially injected by the searcher's frontrun.
          </p>
        </div>

        {/* Forensic Core Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-2">
          <div className="p-3 border border-border rounded bg-bg">
            <div className="text-muted text-[11px]">Extracted USDC</div>
            <div className="text-danger font-bold mt-1 text-base tabular-nums">
              <DemoData>${receipt.extractedUSDC}</DemoData>
            </div>
          </div>
          <div className="p-3 border border-border rounded bg-bg">
            <div className="text-muted text-[11px]">Injected Slippage</div>
            <div className="text-accent font-bold mt-1 text-base tabular-nums">
              <DemoData>+{receipt.injectedSlippageBps} bps</DemoData>
            </div>
          </div>
          <div className="p-3 border border-border rounded bg-bg">
            <div className="text-muted text-[11px]">Legit Slippage</div>
            <div className="text-good font-bold mt-1 text-base tabular-nums">
              <DemoData>{receipt.legitSlippageBps} bps</DemoData>
            </div>
          </div>
          <div className="p-3 border border-border rounded bg-bg">
            <div className="text-muted text-[11px]">LP LVR Impact</div>
            <div className="text-danger font-bold mt-1 text-base tabular-nums">
              <DemoData>{receipt.lpLvrDelta}</DemoData>
            </div>
          </div>
        </div>
      </div>

      {/* Cryptographic Proof Details */}
      <div className="border border-border bg-surface p-5 rounded space-y-4 text-xs font-mono">
        <div className="font-semibold text-text uppercase tracking-wider">
          Cryptographic Attestation & Settlement Proofs
        </div>

        <div className="space-y-3 divide-y divide-border">
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-muted">Target Pool:</span>
            <Link href={`/pool/${receipt.poolId}`} className="text-text hover:underline flex items-center gap-1">
              <span>{receipt.poolName}</span>
              <span className="text-muted">({receipt.poolId.slice(0, 10)}…)</span>
            </Link>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-muted">Searcher Address:</span>
            <Link href={`/searcher/${receipt.searcher}`} className="hover:underline">
              <HashDisplay hash={receipt.searcher} truncate={false} />
            </Link>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-muted">Victim Address:</span>
            <Link href={`/lp/${receipt.victim}`} className="hover:underline">
              <HashDisplay hash={receipt.victim} truncate={false} />
            </Link>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-muted">Simulation Hash (CPMM counterfactual):</span>
            <HashDisplay hash={receipt.simulationHash} truncate={false} />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-muted">Arkiv Record URI:</span>
            <span className="text-accent flex items-center gap-1">
              <Database className="w-3.5 h-3.5" />
              {receipt.arkivURI}
            </span>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-muted">Base Sepolia Block:</span>
            <span className="text-text tabular-nums">#{receipt.blockNumber}</span>
          </div>
        </div>
      </div>

      {/* Transaction Sequence Breakdown */}
      <div className="border border-border bg-surface p-5 rounded space-y-3 text-xs font-mono">
        <div className="font-semibold text-text uppercase tracking-wider">
          Observed Same-Block Transaction Sandwich
        </div>
        <div className="space-y-2">
          {receipt.txHashes.map((tx, idx) => {
            const role = idx === 0 ? "1. Frontrun Swap (Searcher)" : idx === 1 ? "2. Victim Swap (User)" : "3. Backrun Swap (Searcher)";
            const roleColor = idx === 1 ? "text-accent" : "text-muted";
            return (
              <div key={tx} className="p-3 border border-border rounded bg-bg flex items-center justify-between">
                <div>
                  <span className={`font-semibold ${roleColor}`}>{role}</span>
                </div>
                <div className="flex items-center gap-2">
                  <HashDisplay hash={tx} />
                  <a
                    href={`https://sepolia.basescan.org/tx/${tx}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted hover:text-text"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Independent On-Chain Flows: Base Sepolia vs Arc Testnet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="border border-border bg-surface p-4 rounded space-y-1.5">
          <div className="text-accent font-bold uppercase">
            Flow 1 · Base Sepolia (SearcherRegistry)
          </div>
          <div className="text-text font-semibold">
            bond reduced (Base Sepolia, forensic only):{" "}
            <DemoData>
              <span className="text-danger tabular-nums">${receipt.extractedUSDC}</span>
            </DemoData>
          </div>
          <div className="text-muted text-[11px] leading-relaxed">
            Local forensic reputation decrement on Base Sepolia (`0x24A2…3551`). No USDC leaves Base Sepolia.
          </div>
        </div>

        <div className="border border-border bg-[#15191E] p-4 rounded flex flex-col justify-between gap-3">
          <div>
            <div className="text-good font-bold uppercase">
              Flow 2 · Arc Testnet (Pre-Funded RebateVault)
            </div>
            <div className="text-muted text-[11px] mt-1 leading-relaxed">
              {receipt.status === "REBATED"
                ? `Rebate of $${receipt.extractedUSDC} USDC settled from pre-funded Arc vault (0x2ab7…28CD).`
                : `Eligible for $${receipt.extractedUSDC} USDC rebate drawn from pre-funded RebateVault.sol on Arc Testnet.`}
            </div>
          </div>
          <div>
            {receipt.status === "REBATED" ? (
              <div className="px-3 py-1.5 border border-good/40 bg-good/10 text-good rounded font-semibold text-[11px] inline-block">
                CLAIMED & SETTLED (ARC TESTNET)
              </div>
            ) : (
              <Link
                href="/demo"
                className="px-3 py-1.5 bg-good text-bg rounded font-semibold text-[11px] hover:opacity-90 transition-opacity inline-block"
              >
                Claim Rebate on Arc
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

