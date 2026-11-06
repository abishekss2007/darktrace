import { NextResponse } from "next/server";
import { fromArkiv, sumUSDC } from "@/lib/arkiv";
import { getVaultReserveUSDC } from "@/lib/arc";

export const dynamic = "force-dynamic";

const CACHE_TTL_MS = 10_000;

interface StatsPayload {
  namespace: string;
  liveReceiptsCount: number;
  liveExtractedUSDC: string;
  vaultReserveUSDC: string | null;
  arkivSource: "rabdi" | "unreachable";
  arkivError?: string;
  cachedAt: string;
}

let cachedStats: { data: StatsPayload; expiresAt: number } | null = null;

export async function GET() {
  const now = Date.now();
  if (cachedStats && now < cachedStats.expiresAt) {
    return NextResponse.json(cachedStats.data, {
      headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=10" },
    });
  }

  let liveReceiptsCount = 0;
  let liveExtractedUSDC = "0.00";

  // 1. Live on-chain RebateVault USDC balance on Arc Testnet (null if Arc can't be read; no fake fallback)
  const vaultReserveUSDC = await getVaultReserveUSDC();

  // 2. Live Arkiv aggregation via @arkiv-network/sdk (receipts owned by the DarkTrace writer)
  const arkivRes = await fromArkiv((sdk) => sdk.listRecentReceipts(100));
  if (arkivRes.ok) {
    liveReceiptsCount = arkivRes.data.length;
    liveExtractedUSDC = sumUSDC(arkivRes.data);
  }

  const data: StatsPayload = {
    namespace: "darktrace.v1",
    liveReceiptsCount,
    liveExtractedUSDC,
    vaultReserveUSDC,
    arkivSource: arkivRes.ok ? "rabdi" : "unreachable",
    arkivError: arkivRes.ok ? undefined : arkivRes.error,
    cachedAt: new Date(now).toISOString(),
  };

  cachedStats = { data, expiresAt: now + CACHE_TTL_MS };

  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=10" },
  });
}

