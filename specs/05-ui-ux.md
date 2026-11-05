# DarkTrace — UI / UX Forensic Terminal Specification

## 1. Design Philosophy: Anti-Slop & Forensic Density

DarkTrace is designed for institutional liquidity providers, protocol risk teams, and MEV researchers. The interface draws inspiration from Bloomberg terminals, Wireshark, and high-frequency trading diagnostics.

### Strict Negative Constraints
- **NO Gradients**: Absolutely zero purple, indigo, or aurora background radial gradients.
- **NO Glassmorphism**: No backdrop blur, no translucent floating cards.
- **NO Emojis**: Headings and copy must be technical, clinical, and precise.
- **NO Rounded-2xl**: Corner radii are pinned strictly to 6px (`rounded-md`).
- **NO Box Shadows**: Visual hierarchy is created entirely with single-pixel `#1F2328` borders and high-contrast typography.

---

## 2. Color Palette & Typography Tokens

| Token | Hex Value | Semantic Role |
| :--- | :--- | :--- |
| `bg` | `#0A0B0D` | Primary deep black background |
| `surface` | `#121418` | Elevated container and table header background |
| `border` | `#1F2328` | 1px separator lines and table borders |
| `text` | `#E6E8EB` | Primary legible foreground text |
| `muted` | `#8B929B` | Secondary labels, descriptions, and metadata |
| `accent` | `#F0B429` | Amber — active extractions, monitoring alerts, key actions |
| `danger` | `#E5484D` | Crimson — extracted value, LP losses, toxic slippage |
| `good` | `#3DD68C` | Mint — rebate settled, clean pool states, verified hashes |

### Typography
- **Body & Headings**: Geist Sans / clean system-ui (`sans-serif`).
- **Data, Hashes, Numbers**: JetBrains Mono (`monospace`).
- **Numerical Formatting**: Strict `tabular-nums`, right-aligned in all table columns.

---

## 3. UI Component Standards

### 3.1 Hash Shortener Component (`HashShortener`)
- Format: `0x1234...abcd`
- Monospace font with subtle hover underline.
- Integrated 1-click copy button with temporary `COPIED` pill confirmation.

### 3.2 Data-Dense Table Patterns
- Table rows act as direct navigation links.
- Hover state: subtle background highlight (`hover:bg-[#181B20]`).
- Numeric values: right-aligned, color-coded (`danger` for extracted loss, `good` for rebate paid).

### 3.3 State Indicators
- **Status Pills**:
  - `DETECTED`: Amber text with 1px border.
  - `SIMULATED`: Blue text with 1px border.
  - `ARCHIVED`: Purple text with 1px border.
  - `REBATED`: Mint green text with 1px border.
- **Error States**: Left border accent in crimson (`border-l-2 border-danger`) with monospace error code (`ERR_SIMULATION_FAILED`).
- **Empty States**: Explicit descriptive copy: *"No extractions in this pool. The last 200 swaps were clean."*

---

## 4. Testnet & Demo Data Policy

1. **Always-Visible Network Badge (`<NetworkBadge />`)**:
   - The top header bar renders a persistent monospace pill displaying `BASE SEPOLIA · ARC TESTNET` regardless of wallet connection state.
2. **Inline Seeded Data Badge (`<DemoData />` / `<DemoDataBadge />`)**:
   - Every seeded or illustrative figure not read directly from on-chain state or live Arkiv entities renders inside an inline wrapper displaying a muted `[DEMO]` pill by default (never hidden behind a tooltip).
3. **Hero Metrics & Live `/api/stats` Aggregation**:
   - Live on-chain metrics (such as the `RebateVault` `$5.00 USDC` reserve on Arc Testnet and live `darktrace.v1` entity counts exposed via `/api/stats`, cached 10s) render without a `[DEMO]` badge.
   - Any view combining illustrative or seeded counters displays the explicit muted disclaimer: `"Illustrative data. Live counters reflect only on-chain activity."`

