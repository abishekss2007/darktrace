"use client";

import { useState } from "react";
import { HashDisplay } from "@/components/ui/HashDisplay";
import { StatusPill } from "@/components/ui/StatusPill";
import { Play, Check, ShieldCheck, Database, ArrowRight, Zap, RefreshCw } from "lucide-react";

interface LiveFeedItem {
  id: string;
  timestamp: string;
  poolId: string;
  poolName: string;
  searcher: string;
  victim: string;
  extractedUSDC: string;
  injectedSlippageBps: number;
  legitSlippageBps: number;
  lpLvrDelta: string;
  status: "DETECTED" | "SIMULATED" | "ARCHIVED" | "REBATED";
  receiptHash: string;
  simulationHash: string;
  arkivURI: string;
}

const INITIAL_FEED: LiveFeedItem[] = [
  {
    id: "feed-1",
    timestamp: "22:48:12.190",
    poolId: "0x835c24ae58a98118715d7541b2c5f0df8f11ca328b8e9c9c3850441c632e8d21",
    poolName: "WETH / USDC",
    searcher: "0x1111111111111111111111111111111111111111",
    victim: "0x2222222222222222222222222222222222222222",
    extractedUSDC: "142.50",
    injectedSlippageBps: 185,
    legitSlippageBps: 12,
    lpLvrDelta: "-$138.90",
    status: "ARCHIVED",
    receiptHash: "0x9c8d1f2b3e4a5061728394a5b6c7d8e9f01234567890abcdef1234567890abcd",
    simulationHash: "0xc9ddedeba69e600924875d3ce6c3e2cd554170c510cec4bfd5016182dc156309",
    arkivURI: "arkiv://darktrace.v1/receipt/0x9c8d1f2b3e4a5061728394a5b6c7d8e9f01234567890abcdef1234567890abcd",
  },
  {
    id: "feed-2",
    timestamp: "22:45:04.821",
    poolId: "0x2a1b9487c02b8510fbc282901928014810294821092830192830192830192831",
    poolName: "cbBTC / USDC",
    searcher: "0x4444444444444444444444444444444444444444",
    victim: "0x8888888888888888888888888888888888888888",
    extractedUSDC: "310.20",
    injectedSlippageBps: 240,
    legitSlippageBps: 18,
    lpLvrDelta: "-$295.40",
    status: "REBATED",
    receiptHash: "0x4a5b6c7d8e9f01234567890abcdef1234567890abcd9c8d1f2b3e4a506172839",
    simulationHash: "0xa1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0",
    arkivURI: "arkiv://darktrace.v1/receipt/0x4a5b6c7d8e9f01234567890abcdef1234567890abcd9c8d1f2b3e4a506172839",
  },
];

export default function DemoPage() {
  const [feed, setFeed] = useState<LiveFeedItem[]>(INITIAL_FEED);
  const [selectedItem, setSelectedItem] = useState<LiveFeedItem>(INITIAL_FEED[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimedSuccess, setClaimedSuccess] = useState(false);

  // Trigger simulated sandwich attack sequence
  const handleTriggerSandwich = () => {
    setIsSimulating(true);

    const newItemId = `feed-${Date.now()}`;
    const newProofHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const newSimHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}.${String(now.getMilliseconds()).padStart(3, "0")}`;

    // Step 1: DETECTED
    const initialItem: LiveFeedItem = {
      id: newItemId,
      timestamp: timeStr,
      poolId: "0x835c24ae58a98118715d7541b2c5f0df8f11ca328b8e9c9c3850441c632e8d21",
      poolName: "WETH / USDC",
      searcher: "0x1111111111111111111111111111111111111111",
      victim: "0x2222222222222222222222222222222222222222",
      extractedUSDC: "174.80",
      injectedSlippageBps: 187,
      legitSlippageBps: 12,
      lpLvrDelta: "-$169.50",
      status: "DETECTED",
      receiptHash: newProofHash,
      simulationHash: newSimHash,
      arkivURI: `arkiv://darktrace.v1/receipt/${newProofHash}`,
    };

    setFeed((prev) => [initialItem, ...prev]);
    setSelectedItem(initialItem);

    // Step 2: SIMULATED (after 800ms)
    setTimeout(() => {
      setFeed((prev) =>
        prev.map((item) => (item.id === newItemId ? { ...item, status: "SIMULATED" } : item))
      );
      setSelectedItem((curr) => (curr.id === newItemId ? { ...curr, status: "SIMULATED" } : curr));
    }, 900);

    // Step 3: ARCHIVED (after 1800ms)
    setTimeout(() => {
      setFeed((prev) =>
        prev.map((item) => (item.id === newItemId ? { ...item, status: "ARCHIVED" } : item))
      );
      setSelectedItem((curr) => (curr.id === newItemId ? { ...curr, status: "ARCHIVED" } : curr));
      setIsSimulating(false);
    }, 1900);
  };

  // Claim Rebate on Arc
  const handleClaimRebate = () => {
    setIsClaiming(true);
    setTimeout(() => {
      setIsClaiming(false);
      setClaimedSuccess(true);
      setFeed((prev) =>
        prev.map((item) => (item.id === selectedItem.id ? { ...item, status: "REBATED" } : item))
      );
      setSelectedItem((curr) => ({ ...curr, status: "REBATED" }));
    }, 1200);
  };

  return (
    <div className="flex-1 p-4 max-w-7xl mx-auto w-full flex flex-col space-y-3">
      {/* Terminal Command Strip */}
      <div className="h-10 border border-border bg-surface px-4 rounded flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-muted">TERMINAL:</span>
          <span className="text-text font-bold">FORENSIC RADAR</span>
          <span className="text-border">|</span>
          <span className="text-good flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-good animate-pulse"></span>
            LIVE MONITORING
          </span>
        </div>

        <button
          onClick={handleTriggerSandwich}
          disabled={isSimulating}
          type="button"
          className="px-3 py-1 bg-accent hover:opacity-90 disabled:opacity-50 text-bg font-bold rounded flex items-center gap-1.5 transition-opacity"
        >
          {isSimulating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Simulating Sandwich...</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5" />
              <span>Trigger Test Sandwich</span>
            </>
          )}
        </button>
      </div>

      {/* Two-Column Terminal Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-[580px]">
        {/* LEFT COLUMN: Live Event Feed (7 Cols) */}
        <div className="lg:col-span-7 border border-border rounded bg-surface flex flex-col overflow-hidden">
          <div className="px-3 py-2 border-b border-border bg-[#15181E] flex items-center justify-between text-xs font-mono">
            <span className="font-semibold text-text uppercase tracking-wider">
              Live Extraction Stream
            </span>
            <span className="text-[11px] text-muted tabular-nums">
              {feed.length} EVENTS RECORDED
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border font-mono text-xs">
            {feed.map((item) => {
              const isSelected = selectedItem.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    setClaimedSuccess(item.status === "REBATED");
                  }}
                  className={`p-3 transition-colors cursor-pointer select-none flex items-center justify-between gap-2 ${
                    isSelected ? "bg-[#181C22] border-l-2 border-accent" : "hover:bg-[#14161B]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-muted text-[11px] tabular-nums">{item.timestamp}</span>
                    <span className="text-text font-bold">{item.poolName}</span>
                    <span className="text-muted text-[11px]">
                      Victim: {item.victim.slice(0, 6)}…
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-danger font-bold tabular-nums">
                      ${item.extractedUSDC}
                    </span>
                    <StatusPill status={item.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Receipt Inspector (5 Cols) */}
        <div className="lg:col-span-5 border border-border rounded bg-surface flex flex-col overflow-hidden">
          <div className="px-3 py-2 border-b border-border bg-[#15181E] flex items-center justify-between text-xs font-mono">
            <span className="font-semibold text-text uppercase tracking-wider">
              Forensic Receipt Detail
            </span>
            <StatusPill status={selectedItem.status} />
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-4 font-mono text-xs">
            {/* Loss Banner */}
            <div className="p-3 border border-border rounded bg-bg space-y-1">
              <div className="text-[11px] text-muted uppercase">Extracted USDC Loss</div>
              <div className="text-2xl font-bold text-danger tabular-nums">
                ${selectedItem.extractedUSDC}
              </div>
              <div className="text-[11px] text-muted">
                LP LVR Impact: <span className="text-danger font-semibold">{selectedItem.lpLvrDelta}</span>
              </div>
            </div>

            {/* Slippage Decomposition */}
            <div className="p-3 border border-border rounded bg-bg space-y-2">
              <div className="text-xs font-semibold text-text">Slippage Decomposition</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 border border-border rounded bg-surface">
                  <div className="text-muted text-[10px]">INJECTED SLIPPAGE</div>
                  <div className="text-accent font-bold mt-0.5 tabular-nums">
                    +{selectedItem.injectedSlippageBps} bps
                  </div>
                </div>
                <div className="p-2 border border-border rounded bg-surface">
                  <div className="text-muted text-[10px]">LEGIT SLIPPAGE</div>
                  <div className="text-good font-bold mt-0.5 tabular-nums">
                    {selectedItem.legitSlippageBps} bps
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-muted leading-tight">
                {selectedItem.injectedSlippageBps - selectedItem.legitSlippageBps} bps was toxic extraction, not price discovery.
              </div>
            </div>

            {/* Cryptographic Hashes */}
            <div className="space-y-2 pt-1 border-t border-border">
              <div>
                <div className="text-[10px] text-muted uppercase">Receipt Hash</div>
                <HashDisplay hash={selectedItem.receiptHash} truncate={true} prefixLength={10} suffixLength={8} />
              </div>

              <div>
                <div className="text-[10px] text-muted uppercase">Simulation Hash (Arc)</div>
                <HashDisplay hash={selectedItem.simulationHash} truncate={true} prefixLength={10} suffixLength={8} />
              </div>

              <div>
                <div className="text-[10px] text-muted uppercase">Arkiv Proof Record</div>
                <div className="text-accent text-[11px] flex items-center gap-1 mt-0.5">
                  <Database className="w-3 h-3" />
                  <span className="truncate">{selectedItem.arkivURI}</span>
                </div>
              </div>
            </div>

            {/* Restitution Claim Action */}
            <div className="pt-2 border-t border-border">
              {selectedItem.status === "REBATED" || claimedSuccess ? (
                <div className="p-3 border border-good/40 bg-good/10 rounded flex items-center gap-2 text-good">
                  <Check className="w-4 h-4" />
                  <div>
                    <div className="font-bold">USDC Rebate Claimed</div>
                    <div className="text-[10px] text-muted">Settled on Arc Testnet RebateVault.sol</div>
                  </div>
                </div>
              ) : selectedItem.status === "ARCHIVED" ? (
                <button
                  onClick={handleClaimRebate}
                  disabled={isClaiming}
                  type="button"
                  className="w-full py-2.5 bg-good hover:opacity-90 disabled:opacity-50 text-bg font-bold rounded flex items-center justify-center gap-2 transition-opacity"
                >
                  {isClaiming ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Settling USDC Rebate on Arc...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Claim ${selectedItem.extractedUSDC} USDC Rebate</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="p-3 border border-border rounded bg-bg text-center text-muted text-[11px]">
                  Pipeline in progress ({selectedItem.status}). Proof sealing to Arkiv...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
