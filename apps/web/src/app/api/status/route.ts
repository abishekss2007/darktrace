import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  let indexerStatus: Record<string, unknown> | null = null;
  const indexerUrl = process.env.INDEXER_URL;

  if (indexerUrl) {
    try {
      const res = await fetch(new URL("/health", indexerUrl), {
        next: { revalidate: 0 },
      });
      if (res.ok) {
        indexerStatus = await res.json();
      } else {
        indexerStatus = { status: "error", httpStatus: res.status };
      }
    } catch (err: unknown) {
      indexerStatus = {
        status: "unreachable",
        message: err instanceof Error ? err.message : String(err),
      };
    }
  }

  return NextResponse.json({
    status: "ok",
    service: "web",
    timestamp: new Date().toISOString(),
    indexer: indexerStatus || { status: "not_configured" },
  });
}
