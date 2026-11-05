import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

const files = [
  "README.md",
  "FEEDBACK.md",
  "arkiv/README.md",
  "arkiv/schema.md",
  "arkiv/friction.md",
  "arkiv/reach.md",
  "arkiv/why-arkiv.md",
  "arkiv/how-you-use-arkiv.md",
  "arc-studio/README.md",
  "arc-studio/prompt.md",
  "arc-studio/report.md",
  "specs/submission/FINAL-SUBMISSION-CHECKLIST.md",
  "specs/submission/partner-feedback.md",
  "specs/submission/qa-prep.md",
  "specs/submission/demo-checklist.md",
  "specs/submission/booth-strategy.md",
  "apps/web/src/components/layout/Footer.tsx"
];

const urlRegex = /(https?:\/\/[^\s\)\`\]\"\'<>]+)/g;
const links: { file: string; url: string }[] = [];

const rootDir = path.resolve(__dirname, "..");
files.forEach((f) => {
  const p = path.join(rootDir, f);
  if (fs.existsSync(p)) {
    const content = fs.readFileSync(p, "utf-8");
    let match: RegExpExecArray | null;
    while ((match = urlRegex.exec(content)) !== null) {
      let cleanUrl = match[1];
      if (cleanUrl.endsWith(".") || cleanUrl.endsWith(",")) cleanUrl = cleanUrl.slice(0, -1);
      links.push({ file: f, url: cleanUrl });
    }
  }
});

async function checkUrl(targetUrl: string): Promise<{ status: number | string; finalUrl: string; note: string }> {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(targetUrl);
      const transport = parsed.protocol === "https:" ? https : http;
      const req = transport.request(
        targetUrl,
        {
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          },
          timeout: 8000
        },
        (res) => {
          const code = res.statusCode || 0;
          const loc = res.headers.location || "";
          if (code >= 300 && code < 400 && loc) {
            resolve({ status: code, finalUrl: loc, note: `Redirected to ${loc}` });
          } else {
            resolve({ status: code, finalUrl: targetUrl, note: `HTTP ${code}` });
          }
        }
      );
      req.on("error", (err) => resolve({ status: "ERR", finalUrl: targetUrl, note: err.message }));
      req.on("timeout", () => {
        req.destroy();
        resolve({ status: "TIMEOUT", finalUrl: targetUrl, note: "Request timed out after 8s" });
      });
      req.end();
    } catch (err: any) {
      resolve({ status: "ERR", finalUrl: targetUrl, note: err.message });
    }
  });
}

async function run() {
  console.log(`Extracted ${links.length} total link instances.`);
  const unique = Array.from(new Set(links.map((l) => l.url)));
  console.log(`Checking ${unique.length} unique URLs...`);

  const results: Record<string, { status: number | string; finalUrl: string; note: string }> = {};
  for (const u of unique) {
    const res = await checkUrl(u);
    results[u] = res;
    console.log(`[${res.status}] ${u} -> ${res.note}`);
  }

  // Print markdown table
  console.log("\n### Audited Link Table\n");
  console.log("| Source File | Target URL | HTTP / Status | Result | Notes |");
  console.log("| :--- | :--- | :--- | :--- | :--- |");
  links.forEach((l) => {
    const r = results[l.url];
    let classification = "INCONCLUSIVE";
    if (r.status === 200) classification = "PASS";
    else if (r.status === 401 || r.status === 403) classification = "AUTH_REQUIRED";
    else if (r.status === 429) classification = "RATE_LIMITED";
    else if (typeof r.status === "number" && r.status >= 400) classification = "FAIL";
    else if (r.status === "TIMEOUT" || r.status === "ERR") classification = "FAIL";

    console.log(`| \`${l.file}\` | \`${l.url}\` | ${r.status} | \`${classification}\` | ${r.note} |`);
  });
}

run();
