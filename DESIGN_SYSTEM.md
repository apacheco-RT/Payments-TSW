# Design System — Ripple Treasury

**Last updated:** 2026-03-05
**Status:** Living document — update as decisions are made

This is the single source of truth for design direction, tokens, and components across all Ripple Treasury prototype modules: TSW, GSmart Anti Fraud, and the Netting / Intercompany Settlement module.

---

## Table of Contents

1. [Design Direction](#1-design-direction)
2. [Token Reference](#2-token-reference)
3. [Typography](#3-typography)
4. [Component Registry](#4-component-registry)
5. [Page Layout](#5-page-layout)
6. [WCAG 2.2 Requirements](#6-wcag-22-requirements)
7. [Decisions Log](#7-decisions-log)

> **Module coverage:**
> - `/prototype` — Transaction Status Workflow (TSW redesign, dark theme)
> - `/fraud-rules` — GSmart Fraud Protection Config (dark theme, orange accent)
> - `/fraud-reports` — GSmart Audit Logs & Reporting (dark theme, orange accent)
> - `/netting` — Intercompany Settlement Command Center (light theme, `TreasuryShell`, purple accent)

---

## 1. Design Direction

### Research Foundation

All design decisions are grounded in two sources:

**TSW_Research.pdf (UX evaluation):**
- **10 Heuristic violations** (H1–H10) from Nielsen evaluation
- **7 Customer backlog items** from direct feedback
- **15 Design requirements** (REQ-01–REQ-15)
- **10 Annotated specs** (P1–P10) with before/after rationale

**Pendo product analytics (30-day feature events):**
- Filter By / Date Type: **7,455 + 3,279 events** — dominant user behaviour
- Start Date / End Date: **2,229 + 1,241 events** — date range is the #1 workflow
- Transaction Type: **363 events** — important but secondary
- Show Only Items I Can Approve: **244 events** — daily workflow shortcut
- Enable Filters: **100 events** — high count indicates friction in old expand-to-access pattern
- Rows per Page: **42 events** — low priority; table footer is sufficient
- Netting: **2 events each** — de-prioritised behind Advanced accordion

### Core Principles

| Principle | Applied behaviour |
|-----------|-------------------|
| **One screen, full context** | Filter + results on a single page — no separate search screen. Eliminates H7 (navigation overhead). |
| **Surface what users actually use** | Pendo data drives filter layout. Date controls and My Items toggle are always visible — never gated behind an expand. |
| **Progressive disclosure** | Secondary filters (Status, Type, Legal Entity, Beneficiary) are behind "More Filters". Netting is behind "Advanced". Fraud Spotlight and Process Flow are collapsible panels. |
| **Urgency first** | Default sort is urgency-weighted (risk score + value date proximity). High-risk items surface automatically. |
| **Fraud awareness throughout** | Risk scoring is visible at every decision point — table row, bulk action gate, spotlight. Addresses C1, C2 (customer backlog). |
| **Terminology for humans** | All internal jargon replaced with plain language (see terminology table in §4.4). Addresses H1. |
| **WCAG 2.2 AA** | Every interactive element meets target size, contrast, focus visibility, and keyboard nav requirements. |

### Visual Language

- **Always-visible filter bar** — date controls never hidden; no "enable filters" step
- **Collapsible panels** — consistent header treatment with chevron toggle for Fraud Spotlight, Process Flow, and More Filters secondary panel
- **Pill badges** for Ripple brand CTAs (100px radius)
- **Compact chips** for status, risk level, process stage — rounded-sm (4px)
- **Gradient accent** (rose→orange) reserved exclusively for the Fraud Spotlight header
- **No hardcoded colours** — all values from CSS custom properties or design token constants
- **Light/Dark mode** — toggle in page footer; preference stored in `localStorage` key `tsw-theme`

---

## 2. Token Reference

### Where tokens live

| Layer | File | Purpose |
|-------|------|---------|
| **TypeScript** | `client/src/lib/design-tokens.ts` | Typed constants — import in components for programmatic use (e.g. badge colours, risk maps) |
| **CSS custom properties** | `client/src/index.css` | Runtime variables — theming, light/dark overrides |
| **Tailwind config** | `tailwind.config.ts` | Utility class generation — use `text-risk-critical`, `bg-stage-create`, `rounded-pill` etc. |

### Ripple Brand — nav_v2 Confirmed Tokens

> Source: extracted from `nav_v2_export.html` `:root` CSS block. These are the authoritative values for any screen using `TreasuryShell`.

| CSS var | Value | Use |
|---------|-------|-----|
| `--ripple-blue-50` | `#006aff` | Primary action, active nav, links |
| `--ripple-blue-70` | `#0045c6` | Hover state on blue elements |
| `--ripple-blue-90` | `#001b66` | Header / solution tab bar background |
| `--ripple-purple-50` | `#9c47ff` | **Netting module accent** — buttons, active tabs, CTA |
| `--sidebar` | `#fafafa` | Left sidebar background |
| `--sidebar-border` | `#e5e5e5` | Sidebar border |

**Tailwind equivalents used in code:**
| Role | Tailwind class | Hex |
|------|----------------|-----|
| Header / nav bg | `bg-[#001B66]` | `#001b66` |
| Nav hover underline | `bg-[#4D9AFF]/60` | 60% opacity blue |
| Sidebar bg | `bg-[#f8f9fa]` | matches `--sidebar` |
| Sidebar border | `border-[#e5e5e5]` | matches `--sidebar-border` |
| Content bg | `bg-[#f8fafc]` | page area (slightly off-white) |
| Card bg | `bg-white` | panel cards |
| Card border | `border-[#e2e8f0]` | standard card separator |
| Netting purple | `text-[#9c47ff]` / `bg-[#9c47ff]` | matches `--ripple-purple-50` |
| Netting purple hover | `bg-[#6417bf]` | darker purple for button hover |
| Body text | `text-[#0f172a]` | slate-900 equivalent |
| Secondary text | `text-[#475569]` | slate-600 |
| Tertiary / meta | `text-[#64748b]` | slate-500 |
| Disabled / label | `text-[#94a3b8]` | slate-400 |

### Ripple Brand — TSW / AppNav Tokens (dark-theme pages)

> Used by Prototype.tsx, FraudRulesConfig.tsx, FraudReports.tsx — pages that use `AppNav` on a dark background.

| Token | Value | Use |
|-------|-------|-----|
| `--ripple-blue` | `#1E90FF` | Links, focus rings, active nav items |
| `--ripple-blue-dark` | `#0071E5` | Primary CTA button default |
| `--ripple-blue-deeper` | `#0043A7` | Primary CTA hover/pressed |
| `--ripple-success` | `#53C922` | Positive confirmation |
| `--ripple-error` | `#ED346A` | Destructive / error state |
| `--ripple-warning` | `#F9731C` | Caution / warning |

### Risk Level Tokens

| Level | Trigger | Background | Text | Solid |
|-------|---------|------------|------|-------|
| `critical` | Score ≥ 90 or AML flag | `#fef2f2` | `#dc2626` | `#ef4444` |
| `high` | Score 70–89 | `#fff7ed` | `#c2410c` | `#f97316` |
| `medium` | Score 40–69 | `#fffbeb` | `#b45309` | `#f59e0b` |
| `low` | Score < 40 | `#f0fdf4` | `#166534` | `#22c55e` |
| `none` | No score | `#f8fafc` | `#475569` | `#94a3b8` |

**Fraud gate threshold:** `FRAUD_GATE_THRESHOLD = 70` — bulk approve is intercepted if any selected row has score ≥ 70.

### Process Stage Colours

| Stage | Colour | Bg | Tailwind |
|-------|--------|----|----------|
| Create | `#6366f1` (indigo) | `#eef2ff` | `text-stage-create` |
| Anti Fraud | `#f97316` (orange) | `#fff7ed` | `text-stage-antifraud` |
| Approvals | `#8b5cf6` (purple) | `#f5f3ff` | `text-stage-approvals` |
| Status | `#0ea5e9` (sky) | `#f0f9ff` | `text-stage-status` |
| History | `#64748b` (slate) | `#f8fafc` | `text-stage-history` |

### Light Mode Implementation

Light mode is activated by adding the `light-mode` class to the `<html>` element. The CSS overrides live in `client/src/index.css`.

#### How overrides work

All surface overrides use substring attribute selectors to match Tailwind's hex background classes:

```css
html.light-mode [class*="bg-[#0f1e35]"] { background-color: #f1f5f9 !important; }
html.light-mode [class*="bg-[#162a47]"] { background-color: #ffffff  !important; }
html.light-mode [class*="bg-[#0d1c30]"] { background-color: #f3f4f6 !important; }
```

The class attribute **stays unchanged** on the element; only the rendered background changes. This means any selector keyed on the class name (not the computed style) still fires in light mode.

#### Known pitfalls — rules every dev must know

| Pitfall | Root cause | Rule |
|---------|-----------|------|
| **`text-white/50` stays white in light mode** | Tailwind opacity variants generate separate CSS classes (`text-white\/50`) not matched by `.text-white` | Use `breadcrumb-bar` class on any nav whose children use `text-white/X` variants, OR replace opacity variants with explicit slate classes |
| **`bg-white/5` is invisible on light bg** | 5% white overlay on a white surface = barely visible | All `bg-white/N` selected-state backgrounds need a light-mode CSS override: `rgba(0,0,0,0.04)` |
| **`color-scheme: dark` persists in light mode** | The base rule `[class*="bg-[#0f1e35]"] input { color-scheme: dark }` keys on the class name, which stays even after the background is overridden | The light mode override `html.light-mode [class*="bg-[#0f1e35]"] input { color-scheme: light }` must immediately follow the base rule |
| **Gradient container text stays white** | `.text-white` rule overrides too broadly | Elements with `text-white` inside gradient containers (`.fraud-gradient-header`, `.nav-dark`, gradient `from-*` buttons) have explicit restoration rules that must be maintained |

#### Breadcrumb bar requirement

Every breadcrumb `<nav>` **must** have the `breadcrumb-bar` class. This class is the hook for light mode text overrides:

```css
html.light-mode .breadcrumb-bar span          { color: #6b7280; }
html.light-mode .breadcrumb-bar span[aria-current="page"] { color: #1e293b; }
html.light-mode .breadcrumb-bar a             { color: #6b7280 !important; }
html.light-mode .breadcrumb-bar svg           { color: #9ca3af; }
```

Without `breadcrumb-bar`, `text-white/50`, `text-white/30`, and `text-white/90` are not overridden and render as invisible white-on-white text in light mode.

#### Light mode colour remapping

All accent colours are darkened in light mode to achieve ≥4.5:1 on white (`#ffffff`):

| Token | Dark mode | Light mode | Ratio on white |
|-------|-----------|------------|----------------|
| `text-teal-400` | `#2dd4bf` (1.5:1) | `#0d9488` | ~5:1 ✅ |
| `text-amber-400` | `#fbbf24` (1.8:1) | `#b45309` | ~6:1 ✅ |
| `text-orange-400` | `#fb923c` (2.0:1) | `#c2410c` | ~5:1 ✅ |
| `text-rose-400` | `#fb7185` (3.7:1) | `#e11d48` | ~6:1 ✅ |
| `text-emerald-400` | `#34d399` (2.5:1) | `#047857` | ~5:1 ✅ |
| `text-blue-400` | `#60a5fa` (3.0:1) | `#1d4ed8` | ~5:1 ✅ |
| `text-red-400` | `#f87171` (3.2:1) | `#dc2626` | ~5:1 ✅ |

---

### Contrast Minimums (dark theme)

All body text must meet WCAG 1.4.3 AA (4.5:1). The following colour usage is enforced:

| Use | Class | Ratio on `#0d1f36` |
|-----|-------|--------------------|
| Primary text / labels | `text-slate-200` | ~9.5:1 ✅ |
| Secondary text | `text-slate-300` | ~7.2:1 ✅ |
| Tertiary / hints | `text-slate-400` | ~4.6:1 ✅ |
| **Do not use** for body text | `text-slate-500` | ~3.8:1 ❌ |
| **Do not use** for body text | `text-slate-600` | ~2.6:1 ❌ |
| Decorative / aria-hidden only | `text-slate-500` or lower | exempt |
| Placeholders (inputs) | `placeholder:text-slate-500` | exempt (WCAG 1.4.3 note 1) |

---

## 3. Typography

**Primary font:** TT Ripple (self-hosted — supply font files to activate)
**Substitute:** Space Grotesk (Google Fonts — loaded now as baseline)
**Monospace:** JetBrains Mono (table IDs, codes)

```css
--font-sans: "TT Ripple", "Space Grotesk", Inter, -apple-system, sans-serif;
--font-mono: "JetBrains Mono", Menlo, monospace;
```

### Scale used in TSW

| Usage | Size | Weight | Class |
|-------|------|--------|-------|
| Page title | 24px / 1.5rem | 700 | `text-2xl font-bold` |
| Section header | 14px / 0.875rem | 600 | `text-sm font-semibold` |
| Table header | 11px / 0.6875rem | 700, uppercase, +0.06em | custom `.th-label` |
| Table cell | 13px / 0.8125rem | 400 | `text-[0.8125rem]` |
| Badge / chip | 11px / 0.6875rem | 600 | `text-[0.6875rem] font-semibold` |
| Button | 13px / 0.8125rem | 500 | `text-[0.8125rem] font-medium` |

---

## 4. Component Registry

### 4.1 Filter Panel

**File:** `client/src/pages/Prototype.tsx` → `FilterPanel` function
**State owner:** `Prototype` page component (passed down as `filters` + `setFilters`)

#### Layout — driven by Pendo usage data

The filter bar is split into two tiers based on Pendo event frequency:

**Tier 1 — Always visible bar (never hidden):**
```
[🔍 Search ID or beneficiary…] | [Trn. Date ▼] [02/24] → [02/24] [Preset… ▼] | [My Items ⬛] | [More filters ▼ (N)] [Clear ×]
```

Controls in the always-visible bar, in order:
1. **Quick Search** — ID prefix match or beneficiary substring (7,455 + 2,229 + 1,241 events combined)
2. **Date Type select** — Trn. Date / Value Date / Entry Date (7,455 events, #1 feature)
3. **Start Date + End Date** — date pickers with arrow between (2,229 + 1,241 events, #3–4)
4. **Quick-date preset select** — "Preset…" `<select>` with Today / This Week / This Month / This Quarter options. Selecting calls `quickDate()` which sets both date fields and `preset` in state. Manual edits to either date field clear `preset: ""` so the dropdown reverts to placeholder. The active preset name is shown as the select value — a UX improvement over icon-only buttons. Replaced 4 individual buttons to reduce filter bar density (was 12 controls, now ~9).
5. **My Items toggle** — `role="switch"` — "Show only items I can approve" (244 events, #6)
6. **More Filters button** — badge shows count of active secondary filters (teal pill)
7. **Clear button** — shown when any filter deviates from default

**Tier 2 — More Filters panel (AnimatePresence expand/collapse):**

Secondary filters in a 5-column grid, ordered by usage:
1. Status
2. Payment Type (363 events, #5)
3. Legal Entity
4. Trn. Number
5. Beneficiary

**Advanced accordion** (inside More Filters, collapsed by default):
- Netting: All / Not Netted / Netted Only (2 events each — de-prioritised)

**Removed from filter panel:**
- Rows per Page — 42 events; moved to table footer only

#### Filter wiring

All filter state is immediately applied to `ResultsTable` — no "Apply" button required for primary results. The "Apply" button in the More Filters footer closes the panel only.

Filter fields applied to table:
- `quickSearch` — matches `id` and `payee` (case-insensitive substring)
- `status` — exact status match
- `txnType` — exact type match
- `legalEntity` — exact entity match
- `payee` — payee substring match
- `txnNum` — ID substring match
- `tray` — `overdue` or `high-risk` pre-filter

**Props:**
```ts
interface FilterPanelProps {
  filters: Filters;
  setFilters: (f: Filters) => void;
}
```

**Filters type:**
```ts
type Filters = {
  dateType: string;       // "Trn. Date" | "Value Date" | "Entry Date"
  dateFrom: string;       // ISO date string
  dateTo: string;         // ISO date string
  quickSearch: string;
  txnNum: string;
  payee: string;
  status: string;
  txnType: string;
  legalEntity: string;
  netting: string;        // "All" | "Not Netted" | "Netted Only"
  showMyItems: boolean;
  rowsPerPage: string;    // "25" | "50" | "100"
  preset: string;   // shared: date presets = "today"|"week"|"month"|"qtr"; saved searches = "daily"|"overdue"; values are non-overlapping
}
```

**Research refs:** REQ-01 (unified filter entry), REQ-02 (filter state visibility), REQ-03 (preset persistence), H7 (separate screens), Pendo 30-day feature event data

---

### 4.2 Fraud Spotlight

**File:** `client/src/pages/Prototype.tsx` → `FraudSpotlight` function

**Behaviour:**
- Collapsible section — collapsed by default
- Hidden entirely when no transactions have risk ≥ 70 and no actions have been taken
- **Collapsed state:** Gradient (rose→orange) header bar — shows `N transactions flagged for review` + total exposure amount
- **Expanded state:** Two-column layout (left: scrollable flagged list, right: selected transaction detail)
  - Left list: `role="listbox"` — each item is a `role="option"` button with `aria-selected`
  - Arrow key navigation (↑↓) between items in list
  - After actioning (Approve/Reject/Escalate/Skip), auto-advances `selectedId` to the next item
  - `selectedId` resets via `useEffect` if the selected transaction is actioned and removed from list
- **All cleared state:** Green header — "All flagged transactions reviewed"

**Props:**
```ts
interface FraudSpotlightProps {
  txns: Txn[];  // full transaction list; component filters for risk >= 70 internally
}
```

**Research refs:** REQ-06 (fraud visibility), REQ-07 (streamlined triage), C1 (AML flags not surfaced), C2 (fraud interceptions)

---

### 4.3 Process Flow

**File:** `client/src/pages/Prototype.tsx` → `ProcessFlow` function

**Behaviour:**
- Collapsible horizontal pipeline — open by default
- 5 stages: Create → Anti Fraud → Approvals → Status → History
- **Collapsed state:** Horizontal progress chips — stage name + count only
- **Expanded state:** Each stage card shows stage name, transaction count, 1-line description, and primary CTA (where applicable)
- **Counts always reflect the active filter** — shows `*filtered` footnote when a non-default filter is active
- Stage colours from `PROCESS_STAGES` constant (mirrors `processStage` tokens)

**Props:**
```ts
interface ProcessFlowProps {
  txns: Txn[];        // filtered transaction list — counts derived internally
  isFiltered: boolean; // controls *filtered footnote visibility
}
```

**Research refs:** REQ-08 (pipeline visibility), REQ-09 (stage context), C4 (where is my transaction?)

---

### 4.4 Results Table

**File:** `client/src/pages/Prototype.tsx` → `ResultsTable` function

**Terminology (renamed from internal jargon):**

| Old term | New term | Rationale |
|----------|----------|-----------|
| Ready to Extract | Ready to Approve | Action-oriented; matches user mental model |
| Anti Fraud queue | Fraud Review | Clearer intent |
| Batch ID | Payment Batch | Less technical |
| Value Date | Value Date | ✓ Keep as-is — confirmed treasury standard term |
| BENE | Beneficiary | Spell it out |

**Default columns (8 defined, 7 visible by default):**

| Column key | Label | Default visible | Sortable |
|------------|-------|-----------------|----------|
| `risk` | Risk | ✅ | ✅ |
| `trnNum` | Trn. Number | ✅ | — |
| `payee` | Beneficiary | ✅ | — |
| `instType` | Type | ✅ | — |
| `amount` | Amount | ✅ | ✅ |
| `trnDate` | Trn. Date | ✅ | — |
| `valDate` | Value Date | ❌ | — |
| `status` | Status | ✅ | — |

**Behaviour:**
- Default sort: urgency-weighted `((overdue ? 200 : 0) + risk)` — "Reset to urgency sort" link appears after manual sort
- Row expansion: `tabIndex={0}` + `onKeyDown` (Enter/Space) — expands inline accordion with full transaction detail
- `aria-expanded` on each row; `aria-label` describes the row
- Select-all: `<button aria-label aria-pressed>` — not a div
- Bulk action toolbar: Approve / Hold / Reject — appears when ≥1 row selected
- **Fraud gate:** if any selected row has risk ≥ 70, `showFraudGate` modal intercepts Approve
- Table caption: `<caption className="sr-only">` for screen reader context
- Pagination: state-driven; page resets via `useEffect` when `filters` or `tray` changes
- Rows per page: controlled by `filters.rowsPerPage` — select in table footer is wired to `setFilters`

**Props:**
```ts
interface ResultsTableProps {
  txns: Txn[];
  tray: TrayFilter;              // "all" | "overdue" | "high-risk"
  filters: Filters;
  setFilters: (f: Filters) => void;  // required for rows-per-page select in footer
}
```

**Research refs:** REQ-10 (column clarity), REQ-11 (bulk actions), REQ-12 (sort/filter), REQ-13 (row detail), REQ-14 (export), REQ-15 (pagination), H4 (column count), H6 (bulk efficiency), C3 (export), C5 (row detail)

---

### 4.5 Sub-components

#### `FraudBadge`

```tsx
<FraudBadge risk={82} reason="Unusual amount · AML match" />
```

- `risk >= 70` → high (rose ring), `risk >= 40` → medium (amber ring), otherwise low (emerald ring)
- Score + level label (`HIGH` / `MED` / `LOW`) with `aria-label="Risk score N — HIGH"`
- Optional reason text below badge

#### `StatusChip`

```tsx
<StatusChip status="Needs Approval" next="Ready to Approve" overdue={false} />
```

- Maps status string to bg + text colour class
- Shows `Clock` icon when `overdue={true}`
- Includes next-status arrow: `Status → Next`
- Chip backgrounds at `/20` opacity + `-300` text for WCAG contrast on dark bg

#### `getRiskColor` (module-level helper)

```ts
getRiskColor(risk: number) → { ring: string; text: string }
```

- Shared by `FraudBadge` and `FraudSpotlight` list items
- `>= 90` → red, `>= 70` → orange, otherwise amber

#### Modals (`FraudGateModal`, `HoldModal`, `RejectModal`)

All three modals follow the same pattern:
```tsx
<motion.div
  role="dialog"
  aria-modal="true"
  aria-labelledby="[id]-title"
  onClick={e => e.target === e.currentTarget && setShow(false)} // backdrop dismiss
>
  <h3 id="[id]-title">…</h3>
  <button autoFocus …>Primary action</button>  {/* autoFocus on open */}
</motion.div>
```

---

### 4.6 GSmart — Fraud Protection Configuration

**File:** `client/src/pages/FraudRulesConfig.tsx`
**Route:** `/fraud-rules`
**Theme:** Orange-yellow accent (`orange-500`, `amber-400`) on dark navy (`#0a1628` / `#0f1e35` / `#162a47`)

#### Purpose

Operator-facing config screen. Controls which fraud detection rules fire, their risk weights, workflow routing, and enabled/disabled state. Changes affect live payment processing — all edits are held in component state until explicitly saved.

#### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ AppNav                                                           │
├─────────────────────────────────────────────────────────────────┤
│ Breadcrumb: Anti Fraud › Setup › GSmart Fraud Rules             │
├─────────────────────────────────────────────────────────────────┤
│ Page Header: "Fraud Protection Configuration"    [Save Config]  │
│ Subtext                              [info banner: eval order]  │
├─────────────────────────────────────────────────────────────────┤
│ Tab bar: [Detection Rules N] [Anomaly Detection N]              │
│ Rule count summary: N / N rules active                          │
├─────────────────────────────────────────────────────────────────┤
│ Rule cards (one per rule)                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ [Icon + Name  Risk N]  description        [Workflow ▼][⬛]│  │
│  │ ↳ expanded detail: Threshold · Sensitivity · Logic      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ── Sticky unsaved-changes bar (bottom, only when isDirty) ───── │
│ ⚠ Unsaved changes                          [Save Configuration] │
└─────────────────────────────────────────────────────────────────┘
```

#### Key behaviours

- **`isDirty` state** — set to `true` by any `updateRule()` call; reset to `false` on `handleSave()`. Drives the sticky unsaved-changes bar.
- **Sticky save bar** — `sticky bottom-0 -mx-6 -mb-6` inside `overflow-y-auto` `<main>` with `p-6` padding. Counteracts padding to span full column width. `bg-[#0a1628]/95 backdrop-blur-sm` for floating appearance.
- **Rule card expand hit area** — icon + rule name + description wrapped in a single `<button onClick={() => setExpanded(o => !o)}>`. Chevron demoted to `<div aria-hidden="true">` (non-interactive). Workflow `<select>` and enable toggle remain as siblings — no nested interactive elements.
- **Workflow select** — `e.stopPropagation()` removed after expand-button restructure (no longer inside the expand button).
- **Risk weight badge** — displays numeric weight only: `"Risk 35"` (not `"Risk ×35"` — × symbol was incorrect and visually ambiguous).
- **Save toast** — `saved` state shows a `CheckCircle` toast in the page header area for 2 s after `handleSave`.

#### Rule data shape

```ts
interface FraudRule {
  id: string;
  name: string;
  description: string;
  category: "detection" | "anomaly";
  enabled: boolean;
  riskWeight: number;
  workflow: "Route to Reviewer" | "Block Payment" | "Hold Payment" | "Flag Only";
  threshold?: number;
  sensitivity?: "low" | "medium" | "high";
  iconColor: string;
  icon: LucideIcon;
}
```

---

### 4.7 GSmart — Audit Logs & Reporting

**File:** `client/src/pages/FraudReports.tsx`
**Route:** `/fraud-reports`
**Theme:** Matches FraudRulesConfig — orange-yellow accent on dark navy.

#### Purpose

Read-only (with override capability) log of all transactions that passed through the fraud detection pipeline. Reviewers can see which rules fired, at what risk level, and take override actions with mandatory reason capture.

#### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ AppNav                                                           │
├─────────────────────────────────────────────────────────────────┤
│ Breadcrumb: Anti Fraud (link) › Reports                         │
├─────────────────────────────────────────────────────────────────┤
│ Page Header: "Audit Logs & Reporting"          [Export CSV]     │
│ Subtext                                                         │
├─────────────────────────────────────────────────────────────────┤
│ KPI strip: [Flagged N] [Blocked N] [Overridden N] [Cleared N]  │
│  (each card is a clickable filter button; active = ring-2)      │
├─────────────────────────────────────────────────────────────────┤
│ Unified filter card:                                            │
│  Period:  [from date] → [to date]  [7d] [30d] [90d]            │
│  ──────────────────────────────────────────────────────         │
│  [🔍 Search…] [All Statuses ▼] [All Risk Levels ▼] [Clear ×]  │
├─────────────────────────────────────────────────────────────────┤
│ Results table (filtered rows)                                   │
│  TXN ID · Payee · Date · Rule Triggered · Amount · Risk · Status│
├─────────────────────────────────────────────────────────────────┤
│ TxnDetailDialog (modal, on row click)                           │
│  Full transaction detail + Override & Allow action              │
└─────────────────────────────────────────────────────────────────┘
```

#### Key behaviours

- **KPI cards as filter buttons** — clicking a card toggles `statusFilter` to that status (or back to `"all"` if already active). Active state: `ring-2` with status-appropriate colour. Each card has its own `activeRing` class. Implemented as `<button>` not `<div>` for full keyboard access.
- **Unified filter card** — date range + search/status/risk controls merged into one card (previously separate). Reduces visual weight and scroll distance.
- **Date constants** — `DEFAULT_FROM = "2026-02-18"` and `DEFAULT_TO = "2026-02-24"` defined as constants; used in initial state and in `clearFilters()` reset.
- **Date wired into filtering** — `fromDate`/`toDate` applied in the derived `filtered` memo:
  ```ts
  if (fromDate && t.date < fromDate) return false;
  if (toDate   && t.date > toDate)   return false;
  ```
- **Quick-range buttons** — 7d / 30d / 90d buttons call `setQuickRange(days)` which back-calculates `fromDate` from `toDate`.
- **`hasActiveFilters`** — boolean derived from all filter state; controls Clear button visibility.
- **Override action — required reason** — `canOverride = overrideReason.trim().length > 0`. Override button disabled (visual + functional) until a reason is entered. Textarea label has required `*` marker. Helper text `"A reason is required…"` shown while empty.
- **Override success flash** — `overrideSuccess` state shows a green `CheckCircle2` banner `"Override recorded — payment released for processing"` and auto-closes the modal after 1 500 ms via `setTimeout`.
- **Breadcrumb navigation** — "Anti Fraud" uses `<Link href="/fraud-rules">` (wouter) with hover state, not a dead `<span>`. Establishes navigation context within the Anti Fraud module.

#### Filter state shape

```ts
interface ReportsFilters {
  search: string;
  statusFilter: "all" | "flagged" | "blocked" | "overridden" | "cleared";
  riskFilter: "all" | "high" | "medium" | "low";
  fromDate: string;   // ISO date, default DEFAULT_FROM
  toDate: string;     // ISO date, default DEFAULT_TO
}
```

---

### 4.8 TreasuryShell — Global Layout Component

**File:** `client/src/components/TreasuryShell.tsx`
**Used by:** Any page in the `Netting` (and future) solution groups

#### Purpose

Two-tier nav shell extracted from `nav_v2_export.html`. Provides the shared chrome (header, solution tabs, left sidebar) for light-mode Ripple Treasury pages. Pages in `TreasuryShell` do **not** use `AppNav`.

#### Structure

```
┌──────────────────────────────────────────────────────────────┐
│ Header  h-14  bg-[#001B66]  (logo · ⌘K search · Bell/Cfg/User) │
├──────────────────────────────────────────────────────────────┤
│ Solution tabs  bg-[#001B66]  (text-only, NO icons)           │
│  [LM] [Payments] [Cash F.] [Risk] [●Netting] [Recon] …      │
│  Active tab: h-0.5 white bar at TOP of button                │
│  Hover:       h-0.5 #4D9AFF/60 bar slides in from center     │
│  Collapsed sidebar: PanelLeftOpen button prepended here      │
├─────────────────┬────────────────────────────────────────────┤
│ Sidebar         │ <main> flex-1 overflow-auto                │
│ w-[260px]       │  {children}                                │
│ bg-[#f8f9fa]    │                                            │
│ border-[#e5e5e5]│                                            │
│                 │                                            │
│ Quick Actions   │                                            │
│  [PanelClose ←]│                                            │
│  View Net Pos.  │                                            │
│  Run New Batch  │                                            │
│  Today's Summary│                                            │
│ ─────────────── │                                            │
│ Features        │                                            │
│  ★ Netting Cyc  │                                            │
│  Create Cycle   │                                            │
│  Cycle History  │                                            │
│  ● IC Settlement│                                            │
│  Processing     │                                            │
│  Rules          │                                            │
│  Reports ×3     │                                            │
│ ─────────────── │                                            │
│ Solution Settings│                                           │
│ Dark Mode       │                                            │
└─────────────────┴────────────────────────────────────────────┘
```

#### Sidebar toggle

- **Open → Close:** `PanelLeftClose` icon button in the Quick Actions header (`hidden md:flex`). Calls `setIsSidebarOpen(false)`.
- **Closed → Open:** `PanelLeftOpen` icon button prepended to the solution tab row (only rendered when `!isSidebarOpen`). Calls `setIsSidebarOpen(true)`.
- **Animation:** `transition-all duration-200` on `<aside>` — `w-[260px]` ↔ `w-0 overflow-hidden`. Inner sections have `min-w-[260px]` to prevent content wrapping during the transition.
- **DOM structure (exact nav_v2 match):**
  ```tsx
  <div className="hidden md:flex flex-shrink-0">   {/* wrapper — responsive hide */}
    <aside className={`flex flex-col transition-all duration-200 h-full
                       bg-[#f8f9fa] border-r border-[#e5e5e5] overflow-hidden
                       ${isSidebarOpen ? "w-[260px]" : "w-0"}`}>
  ```
  The `hidden md:flex` is on the wrapper `<div>`, not the `<aside>`. The aside is always `flex flex-col`; width toggle drives collapse.

#### Active feature highlight

The active feature item in the sidebar uses:
```
bg-white text-[#0f172a] font-medium shadow-sm border border-[#e2e8f0]
```
Inactive items: `text-[#475569] hover:text-[#0f172a] hover:bg-white/60`
Active feature icon: `text-[#006AFF]`

#### Props

```ts
interface TreasuryShellProps {
  solution?: string;       // highlights the active solution tab (e.g. "Netting")
  activeFeature?: string;  // highlights the active sidebar item by label
  children: React.ReactNode;
}
```

---

### 4.9 Intercompany Settlement — Command Center

**File:** `client/src/pages/IntercompanySettlement.tsx`
**Route:** `/netting`
**Theme:** Light mode, `TreasuryShell`, purple (`#9c47ff`) Netting accent
**Source requirement:** `cross-entity-settlement-prd.md`

#### Purpose

The primary settlement operations screen. Operators view net positions across entity pairs, verify FBO account liquidity, monitor in-flight instructions, and configure/submit new settlement batches.

#### Layout — two views, toggled from the page header

```
Page header: [⚡ icon] Intercompany Settlement | [Settlement type ▼] [Command Center|Report ⊞] [time] [Recalculate]
```

**View A — Command Center** (default):
```
┌──────────────────┬────────────────────────────┬─────────────────┐
│ Net Positions    │ FBO Balances                │ In-Flight       │
│ w-[300px]        │ flex-1                      │ w-[280px]       │
│                  │                             │                 │
│ [All|USD|EUR|GBP]│ Banking Windows card:       │ Header: batch   │
│ ─ USD group ───  │  USD Fedwire · 3h42m        │ status summary  │
│ ● SA ↔ INC $23M  │  EUR SEPA  · 1h18m ⚠       │ ─────────────── │
│   → ICS expanded │  GBP Manual (no window)     │ ● Failed (red   │
│ ─ EUR group ───  │                             │   border-l)     │
│ ● SA ↔ LTD €14M  │ Entity accordions (SA/LTD/  │ ● Confirmed     │
│ …                │ INC/BVI) — each accordion:  │ ● Sent to bank  │
│                  │  [Bank] [CCY] [FBO|Corp]    │ ● 2nd signed    │
│                  │  [Routing pill]             │ ● 1st signed    │
│                  │  LM: $X − applied = Avail   │ ● In Payments   │
│                  │  Balance bar                │ ● Submitted     │
│                  │  Exposure cap bar (if CB)   │                 │
└──────────────────┴────────────────────────────┴─────────────────┘
Bottom bar: [Batch #047 · 7 instr · N confirmed · 1 failed]  [Analytics][Export][⚡ Configure New Batch]
```

**View B — Settlement Report**:
Switches to a full-width table matching the Bitstamp IC Settlement Platform layout.

```
Toolbar: [N rows · N unsettled · N settled · Total: $XM USD + €XM EUR]  [Export Source Txns][Export Report]
─────────────────────────────────────────────────────────────────────────────────────────────────────────
From  |  →/←  |  To  |  To Settle  |  Calculation              |  Settlement tx          |  Ref        |  Status ▼
─────────────────────────────────────────────────────────────────────────────────────────────────────────
── EUR ─────────────────────────────────────────────────────────────────────────────────────────────────
INC        →   SA    $14.20M      $16.10M − $1.90M = $14.20M   ENDID-2026-0311-00142    IC-EUR-047    ●Settled ▾
SA         →   LTD   $8.30M       $9.80M − $1.50M = $8.30M     —                        IC-EUR-048    ●Unsettled ▾
BVI   [red] ←  SA    $0.90M       $1.10M − $0.20M = $0.90M     —                        IC-EUR-051    ●Unsettled ▾
── USD ─────────────────────────────────────────────────────────────────────────────────────────────────
SA         →   INC   $23.10M      $24.60M − $1.50M = $23.10M   —                        IC-USD-047    ●Processing ▾
...
─────────────────────────────────────────────────────────────────────────────────────────────────────────
Action bar: [Manual settlement] [Consolidate] [↻ Calculate new report] … [Update Statuses][← Prev][Next →][Last Report][Process]
```

#### Settlement types — from Bitstamp IC Settlement Platform PDF

All 13 types are selectable from the dropdown in the page header:

| Type | Notes |
|------|-------|
| Trade settlement | Default; largest volume |
| Creditcard settlement | |
| Ripple settlement | |
| Deposit settlement | |
| OTC trade settlement | |
| Derivatives settlement | Skip-node required (BFS→MTF→INC handled as BFS→INC direct) |
| Derivatives IF claim | Insurance Fund; firm money — never netted |
| Derivatives IF premium | Insurance Fund; firm money |
| Derivatives FEE sweep | Fee sweeps to BFS corporate |
| Derivatives liquidation | |
| Derivatives | General derivatives |
| Account transfers | |
| Withdrawals | |

#### Overlays

| Component | Trigger | Z-index | Behaviour |
|-----------|---------|---------|-----------|
| `ConfiguratorDrawer` | "Configure New Batch" button | z-40 | Slides in from right (Framer Motion `x: 560 → 0`), backdrop click closes |
| `PreGoSummary` | Configurator submit | z-50 | Full-screen white overlay, scroll-gated submit |
| `ProvenanceModal` | Click any net amount value | z-50 | Scale-in modal, backdrop click closes |
| Post-submit toast | Pre-Go confirm | fixed bottom-6 right-6 z-50 | 10s auto-dismiss, Framer Motion slide-up |

#### Key implementation rules

- **Settlement type dropdown is dimmed** (`opacity-40 pointer-events-none`) when in Command Center view — it only affects the Settlement Report table
- **Inverse direction rows** in the report table: `isInverse: true` → `bg-red-50` row, `←` red arrow in direction column, `text-red-700` amount
- **Calculation formula** shown inline: `totalBalance [− previouslySettled] = toSettle` in monospace
- **Status select** in report table: `appearance-none` + `ChevronDown` overlay icon for visual affordance
- **React Fragment key** in `<tbody>` currency grouping: use `<Fragment key={currency}>` not shorthand `<>`
- **ICS write-back status** per instruction in In-Flight panel: confirmed (green CheckCircle) / pending (amber Clock) / failed (with "Retry write-back" link)
- **Skip-node chain diagram**: strikethrough node displayed in both Net Positions expanded row and ConfiguratorDrawer position card

#### PRD requirement coverage

| FR | Feature |
|----|---------|
| FR-020 | Available balance formula inline (`LM: $X − Applied: $Y = Available: $Z`) |
| FR-021 | Bank exposure progress bar (Customers Bank 96% cap) |
| FR-023 | FBO vs Corporate labelling per account |
| FR-027 | Trace ID visible throughout (In-Flight + Pre-Go) |
| FR-033b | Retry ICS write-back action on failed instructions |
| FR-036 | 7-state status progression: Submitted → In Payments → First approver → Second approver → Sent to bank → Confirmed received → Failed |
| FR-038 | Calculation provenance modal (source txn count, date range, last settlement, breakdown by type) |
| FR-041 | ICS write-back status per instruction |

---

## 5. Page Layout

```
┌────────────────────────────────────────────────────────────────────────────┐
│  AppNav: GTreasury logo · CASH · PAYMENTS (active) · … · User · ⭐ ❓ 🔔  │
├────────────────────────────────────────────────────────────────────────────┤
│  SubHeader breadcrumb: Payments › Transaction Status Workflow              │
├────────────────────────────────────────────────────────────────────────────┤
│  Page Header: "Transaction Status Workflow" · Last refreshed HH:MM [↻]    │
├────────────────────────────────────────────────────────────────────────────┤
│  FilterPanel ── always-visible bar ─────────────────────────────────────── │
│  [🔍 Search…] | [Trn. Date▼] [02/24]→[02/24] [Preset… ▼] |               │
│  [My Items ⬛] | [More filters (N) ▼] [Clear ×]                           │
│    ↳ AnimatePresence: More Filters panel (Status · Type · Entity · …)     │
│         └ Advanced accordion: Netting                                      │
├────────────────────────────────────────────────────────────────────────────┤
│  FraudSpotlight (collapsible, gradient header) ──────────────────── [∧/∨] │
│  ⚠ N transactions flagged for review · Total exposure: $X                 │
│    ↳ [list: flagged items] | [selected item detail panel]                  │
├────────────────────────────────────────────────────────────────────────────┤
│  ProcessFlow (collapsible pipeline) ─────────────────────────────── [∧/∨] │
│  Create(N) → Anti Fraud(N) → Approvals(N) → Status(N) → History(N)        │
├────────────────────────────────────────────────────────────────────────────┤
│  ResultsTable                                                               │
│  [☐] Risk  Trn. Number  Beneficiary  Type  Amount  Trn. Date  Status      │
│  ──────────────────────────────────────────────────────────────────────    │
│  [☐] ●94   PMT-0029410  New Vendor…  Wire  €890k   02/24/26   Needs App…  │
│    └── [expanded row detail — inline accordion] ─────────────────────────  │
│  [☐] ●78   PMT-0029411  Stripe Inc.  Wire  $125k   02/24/26   Needs App…  │
│  ──────────────────────────────────────────────────────────────────────    │
│  Rows 1–11 of 11  ·  [First][Prev][Next][Last]  ·  [25/page ▾]            │
│                                                                             │
│  ── Bulk toolbar (sticky, appears on selection) ─────────────────────────  │
│  [✓ N selected] [Approve] [Hold] [Reject] [Export CSV] [× Deselect all]   │
├────────────────────────────────────────────────────────────────────────────┤
│  Footer: ©2026 GTreasury · Version · Policies ────────── [☀/🌙 theme]    │
└────────────────────────────────────────────────────────────────────────────┘
```

**Sticky elements:**
- AppNav: sticky top (z-40)
- Table column headers: sticky during table scroll (z-30)
- Bulk action toolbar: sticky bottom when rows selected (z-40)

**Light/Dark mode:**
- Toggle button in footer — `aria-label="Switch to light/dark mode"`
- State stored in `localStorage` key `tsw-theme`; defaults to dark
- Light mode applied via `html.light-mode` class — CSS overrides in `index.css`

---

## 6. WCAG 2.2 Requirements

### Criteria met

| Criterion | Requirement | Implementation |
|-----------|------------|----------------|
| 1.3.1 Info and Relationships | Table structure conveyed | `<caption className="sr-only">`, `<th scope>`, `<fieldset>` + `<legend>` for netting |
| 1.4.3 Contrast Minimum | AA: 4.5:1 normal text, 3:1 large | `text-slate-400` minimum for body text; chips at `/20` bg + `-300` text; see contrast table in §2 |
| 1.4.11 Non-text Contrast | 3:1 for UI components | Risk colour rings, focus indicators |
| 2.1.1 Keyboard | All functionality keyboard accessible | Table rows: `tabIndex={0}` + `onKeyDown` Enter/Space; FraudSpotlight list: `onKeyDown` arrow keys |
| 2.3.3 Animation from Interactions | Respect prefers-reduced-motion | Pulsing status dot uses `motion-safe:animate-pulse` |
| 2.4.3 Focus Order | Focus order meaningful | Modal `autoFocus` on primary button; backdrop click dismisses |
| 2.4.7 Focus Visible | Focus indicator always visible | `focus:ring-2 focus:ring-teal-500/50` — no `focus:outline-none` without replacement |
| 2.4.11 Focus Not Obscured | Focused element not fully hidden | Sticky header/toolbar account for scroll offset |
| 2.5.8 Target Size Minimum | Min 24×24px on all interactive elements | All buttons ≥ `min-h-[24px] min-w-[24px]`; AppNav icons `p-2`; inline clear buttons `p-1.5 min-w-[28px] min-h-[28px]` |
| 3.2.2 On Change | No unexpected context changes | All selects only update filter state; date presets only update date range |
| 4.1.2 Name, Role, Value | All controls labelled | Icon-only buttons have `aria-label`; selects have `aria-label`; toggle has `role="switch" aria-checked`; modals have `role="dialog" aria-modal aria-labelledby`; select-all is `<button aria-pressed>`; date preset buttons have `aria-label` (e.g. "This Quarter") |
| 4.1.3 Status Messages | Live regions for dynamic content | Result count has `aria-live="polite" aria-atomic="true"`; refresh state announced |

### Keyboard navigation map

| Key | Action |
|-----|--------|
| `Tab` | Move through filter controls, table rows, action buttons |
| `Shift+Tab` | Reverse tab order |
| `Space` | Toggle checkboxes; toggle switches; activate select-all; expand/collapse panels |
| `Enter` | Activate buttons; expand selected row; submit filters |
| `Escape` | Close modals; dismiss expanded row; collapse More Filters |
| `↑ / ↓` | Navigate within Fraud Spotlight flagged transaction list |

### ARIA patterns

| Pattern | Implementation |
|---------|---------------|
| Collapsible panel | `aria-expanded` on trigger button; `aria-controls` pointing to panel `id` |
| Modal | `role="dialog" aria-modal="true" aria-labelledby="[heading-id]"`; `autoFocus` on primary action |
| Toggle switch | `role="switch" aria-checked={value}` |
| Listbox | FraudSpotlight: `role="listbox"` on container; `role="option" aria-selected` on items |
| Table row expand | `aria-expanded` on `<tr>`; `aria-label` describes row content |
| Live region | `aria-live="polite" aria-atomic="true"` on result count |

---

## 7. Decisions Log

All questions resolved. No open items.

| # | Date | Question | Decision |
|---|------|---------|---------|
| Q1 | 2026-02-24 | "Ready to Approve" vs "Ready to Send"? | ✅ **"Ready to Approve"** confirmed |
| Q2 | 2026-02-24 | "Settlement Date" vs "Value Date"? | ✅ **Keep "Value Date"** — leave as-is |
| Q3 | 2026-02-24 | Hold / Escalate as real actions? | ✅ **Confirmed** — both exist in GTreasury workflow; included in bulk action toolbar |
| Q4 | 2026-02-24 | Process Flow counts reflect active filter? | ✅ **Confirmed** — counts always reflect current filter state; `*filtered` footnote shown when non-default filter is active |
| Q5 | 2026-02-25 | Filter panel layout priority? | ✅ **Pendo-driven** — date controls (11,400 combined events) and My Items toggle (244 events) promoted to always-visible bar; secondary filters behind "More Filters"; Netting (2 events each) behind "Advanced" accordion; Rows per Page removed from panel (table footer only) |
| Q6 | 2026-02-25 | QA/WCAG pass status? | ✅ **Two full audits completed** — 29 issues found and resolved across two passes. All WCAG 2.2 AA criteria met. Prototype at `http://localhost:5000/prototype` |
| Q7 | 2026-02-26 | Filter bar density — 4 preset buttons vs dropdown? | ✅ **Single `<select>` dropdown** — replaces Today/Week/Month/Qtr buttons to reduce bar from ~12 to ~9 controls. Active preset name shown as selected value (clearer than stateless buttons). `filters.preset` field shared with Saved Searches dropdown; non-overlapping values (today/week/month/qtr vs daily/overdue) prevent conflicts. |
| Q8 | 2026-02-26 | "View details →" button always visible or hover-only? | ✅ **Always visible at reduced opacity** — `opacity-40 group-hover:opacity-100`. `opacity-0` (previous) violated keyboard discoverability: hidden elements still receive focus, creating invisible interactive targets. |
| Q9 | 2026-02-26 | Rule card expand — chevron only or full header? | ✅ **Full icon+title+description area** — wrapped in a single `<button>` trigger. Chevron demoted to `aria-hidden` decorative element. Workflow select and enable toggle remain as siblings (no nested interactive elements). Satisfies WCAG 2.5.8 minimum target size and eliminates small-target UX friction. |
| Q10 | 2026-02-26 | Override action — optional or required reason? | ✅ **Required** — `canOverride = overrideReason.trim().length > 0` gates the button. Override is a high-stakes, irreversible action (releases a blocked payment); audit trail requires a reason. Button is visually and functionally disabled until satisfied. Success flash auto-closes after 1 500 ms. |
| Q11 | 2026-02-26 | Anti Fraud breadcrumb — navigable or dead label? | ✅ **Navigable `<Link>`** (`/fraud-rules`) — establishes in-module navigation context. "Anti Fraud" is the module root; "Reports" is a sub-page. Dead `<span>` gave no way to return to config from audit page. |
| Q12 | 2026-02-25 | Light mode audit — `breadcrumb-bar` class missing from fraud pages? | ✅ **Fixed** — added `breadcrumb-bar` class to `<nav aria-label="Breadcrumb">` in both `FraudRulesConfig.tsx` and `FraudReports.tsx`. Without it, `text-white/50`, `text-white/30`, `text-white/90` are not matched by the `.text-white` rule (they generate separate CSS class names) and render as invisible white-on-white. Also extended `.breadcrumb-bar a { color: #6b7280 }` to cover `Link` components (renders as `<a>`) in FraudReports. |
| Q13 | 2026-02-25 | Process Flow selected stage invisible in light mode? | ✅ **Fixed** — `bg-white/5` (5% white overlay) is near-invisible on light surfaces. Added `html.light-mode [class*="bg-white\/5"] { background-color: rgba(0,0,0,0.04) }` to `index.css`, consistent with the existing `bg-white/2` and `bg-white/3` hover overrides. |
| Q14 | 2026-02-25 | `color-scheme: dark` on form controls persisting in light mode? | ✅ **Fixed** — the base rule keys on the `bg-[#0f1e35]` class name, which stays on the root div even after the background is overridden in light mode. Native calendar pickers and select arrows were rendering with dark chrome on light backgrounds. Added `html.light-mode [class*="bg-[#0f1e35]"] input/select/textarea { color-scheme: light }` immediately after the base rule. |
| Q15 | 2026-02-25 | FraudReports "Clear filters" button — no visible focus indicator? | ✅ **Fixed** — button had `focus:outline-none` with no replacement. Added `focus:ring-1 focus:ring-orange-500/40 rounded`. Consistent with the ring pattern used across filter buttons in the same file. |
| Q16 | 2026-03-05 | TreasuryShell sidebar structure — `hidden md:flex` on aside vs wrapper div? | ✅ **Wrapper div** — `nav_v2_export.html` shows `<div class="hidden md:flex flex-shrink-0"><aside class="flex flex-col ...">`. The `hidden md:flex` belongs on an outer wrapper `<div>`, not the `<aside>` element itself. Aside is always `flex flex-col`; width animation drives the collapse. |
| Q17 | 2026-03-05 | Solution tab `focus-visible:ring-offset` colour — `#001B66` or `#141A1F`? | ✅ **`#141A1F`** — confirmed from nav_v2 source. `ring-offset-[#141A1F]` matches the actual dark surface offset colour used in the design system; `#001B66` was incorrect. |
| Q18 | 2026-03-05 | Quick Action trailing icon — `ChevronRight` or `ArrowRight`? | ✅ **`ArrowRight`** — confirmed from nav_v2 (`lucide-arrow-right h-3 w-3`). Quick Actions use `ArrowRight`; Features section retains `ChevronRight`. |
| Q19 | 2026-03-05 | Section labels "Quick Actions" / "Features" — uppercase or mixed case? | ✅ **Mixed case** — nav_v2 uses `text-[11px] font-semibold tracking-wider text-[#94a3b8]` without `uppercase`. Removed `uppercase` from both labels. |

---

*This document is maintained alongside the codebase. Update it whenever a design decision changes.*
