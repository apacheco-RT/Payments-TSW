# TSW Phase 2 — DS Foundation Full Alignment

**Date:** 2026-04-01
**Status:** Draft — pending implementation
**Project:** payments-tsw-phase1
**Scope:** Full design system token alignment, DS component consumption, atomic component reorganisation

---

## Context

TSW Phase 1 delivered a functional prototype with WCAG 2.2 AA compliance and initial DS Foundation token adoption (surface/text/border/radius). Phase 2 completes the alignment: every design decision in TSW resolves back to a DS Foundation token, and the component structure communicates its DS contract clearly.

DS Foundation (`@ds-foundation/tokens@0.2.2`, `@ds-foundation/react@0.1.0`) is the source of truth. TSW is a consumer — it does not fork or duplicate.

The DS Foundation token prefix bug (`--color-*` vs `--ds-color-*`) was fixed in Phase 1 and merged to `feat/react-atoms-from-settlement`. That fix is a prerequisite for this work.

---

## Goals

1. Zero hardcoded Tailwind colour families in TSW components (teal, rose, emerald, amber, sky, indigo, purple, violet — all removed)
2. All Tailwind utilities (font-size, spacing, leading, tracking, duration, shadow) resolve through DS Foundation tokens via `@theme` wiring
3. DS Foundation React components consumed where behaviour matches (StatusPill, MonoAmount, CurrencyBadge, UrgencyBadge, StatusRing)
4. Component folder structure communicates DS contract: atoms / molecules / organisms / templates
5. Visual output: pixel-identical to current (no visible regressions)
6. TypeScript clean, no new `any` types

---

## Non-Goals

- Contributing TSW components to DS Foundation (Phase 3: IconButton, TxnStatusChip, FraudRiskChip, DetailCard)
- Storybook stories for migrated components
- Adding new features or UI changes
- Changing the application's routing or page structure

---

## Approach: 4-PR sequence (Option A)

Each PR is independently reviewable and releasable. **Verification runs after each PR merge before starting the next.** A PR that does not pass its verification checklist is not considered done.

---

## PR 1 — Token Layer Wiring

**Scope:** `client/src/index.css` `@theme` block only. No `:root` deletions. No component files touched.

> **Important:** The `:root` custom properties for risk levels, status severities, and the spotlight gradient are **not** removed in this PR — they are still referenced by component files. Those references are resolved in PR 2 alongside their DS token replacements. Deleting them here would break the visual between PR 1 and PR 2.

**What:** Wire Tailwind v4 `@theme` custom properties to DS Foundation token vars. After this PR, every Tailwind utility that maps to a DS token (font-size, font-weight, line-height, letter-spacing, spacing, transition duration, shadow) resolves through the token system automatically. Component files need zero changes.

**Changes in `@theme` block:**

```css
/* Typography */
--font-size-2xs: var(--ds-font-size-2xs);
--font-size-xs:  var(--ds-font-size-xs);
--font-size-sm:  var(--ds-font-size-sm);
--font-size-md:  var(--ds-font-size-md);
--font-size-lg:  var(--ds-font-size-lg);
--font-size-xl:  var(--ds-font-size-xl);
--font-size-2xl: var(--ds-font-size-2xl);
--font-size-3xl: var(--ds-font-size-3xl);
--font-size-4xl: var(--ds-font-size-4xl);
--font-size-5xl: var(--ds-font-size-5xl);
--font-size-6xl: var(--ds-font-size-6xl);

--font-weight-thin:       var(--ds-font-weight-thin);
--font-weight-light:      var(--ds-font-weight-light);
--font-weight-regular:    var(--ds-font-weight-regular);
--font-weight-medium:     var(--ds-font-weight-medium);
--font-weight-semibold:   var(--ds-font-weight-semibold);
--font-weight-bold:       var(--ds-font-weight-bold);
--font-weight-extrabold:  var(--ds-font-weight-extrabold);

--leading-none:    var(--ds-font-leading-none);
--leading-tight:   var(--ds-font-leading-tight);
--leading-snug:    var(--ds-font-leading-snug);
--leading-normal:  var(--ds-font-leading-normal);
--leading-relaxed: var(--ds-font-leading-relaxed);
--leading-loose:   var(--ds-font-leading-loose);

--tracking-tighter: var(--ds-font-tracking-tighter);
--tracking-tight:   var(--ds-font-tracking-tight);
--tracking-normal:  var(--ds-font-tracking-normal);
--tracking-wide:    var(--ds-font-tracking-wide);
--tracking-wider:   var(--ds-font-tracking-wider);
--tracking-widest:  var(--ds-font-tracking-widest);

/* Spacing — base unit wires all gap-*, p-*, m-* utilities */
--spacing: var(--ds-spacing-1); /* 0.25rem — matches Tailwind default scale */

/* Motion — duration only.
   NOTE: CSS does not support cubic-bezier(var(...)) with comma-separated
   values in a custom property. Easing values from --ds-motion-easing-* are
   documented as cubic-bezier constants below but cannot be var()-referenced.
   If DS Foundation updates easing values, these must be manually updated. */
--duration-fastest: var(--ds-motion-duration-fastest); /* 50ms  */
--duration-faster:  var(--ds-motion-duration-faster);  /* 100ms */
--duration-fast:    var(--ds-motion-duration-fast);    /* 150ms */
--duration-normal:  var(--ds-motion-duration-normal);  /* 200ms */
--duration-slow:    var(--ds-motion-duration-slow);    /* 300ms */
--duration-slower:  var(--ds-motion-duration-slower);  /* 400ms */

/* Easing — DS Foundation values baked in as cubic-bezier() strings */
--ease-linear:   cubic-bezier(0, 0, 1, 1);        /* --ds-motion-easing-linear    */
--ease-in:       cubic-bezier(0.4, 0, 1, 1);      /* --ds-motion-easing-ease-in   */
--ease-out:      cubic-bezier(0, 0, 0.2, 1);      /* --ds-motion-easing-ease-out  */
--ease-in-out:   cubic-bezier(0.4, 0, 0.2, 1);    /* --ds-motion-easing-ease-in-out */
--ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1); /* --ds-motion-easing-spring  */

/* Shadows */
--shadow-xs:  var(--ds-shadow-xs);
--shadow-sm:  var(--ds-shadow-sm);
--shadow-md:  var(--ds-shadow-md);
--shadow-lg:  var(--ds-shadow-lg);
--shadow-xl:  var(--ds-shadow-xl);
--shadow-2xl: var(--ds-shadow-2xl);
```

**Post-PR verification:**
1. `npm run check` — TypeScript must be clean
2. `npm run dev` — open TSW, confirm visual is identical to pre-PR baseline
3. In browser DevTools: confirm a `text-sm` element's `font-size` resolves to `var(--ds-font-size-sm)` = 0.875rem
4. In browser DevTools: confirm `gap-2` on a flex container resolves to `calc(var(--spacing) * 2)` = 0.5rem
5. In browser DevTools: confirm `transition-colors duration-200` uses `--duration-normal` = 200ms

---

## PR 2 — Colour Migration

**Scope:** `client/src/index.css` (including `:root` deletions), `client/src/lib/design-tokens.ts`, all component files with hardcoded Tailwind colour families.

**What:** Replace every hardcoded Tailwind colour class and CSS custom property with DS Foundation semantic tokens. Also remove the now-superseded `:root` custom properties (`--status-*`, `--risk-*`, `--spotlight-gradient`).

### Token reference (all confirmed present in `@ds-foundation/tokens@0.2.2`)

```
--ds-color-brand-primary           → blue-600 (light) / blue-400 (dark)
--ds-color-brand-primary-hover     → blue-700 (light) / blue-300 (dark)
--ds-color-brand-primary-subtle    → blue-50  (light) / blue-950 (dark)
--ds-color-text-on-brand           → white
--ds-color-interactive-selected    → blue-600
--ds-color-interactive-selected-bg → blue-50 (light) / blue-950 (dark)
--ds-color-feedback-error-{text/bg/border/icon}
--ds-color-feedback-warning-{text/bg/border/icon}
--ds-color-feedback-info-{text/bg/border/icon}
--ds-color-feedback-success-{text/bg/border/icon}
/* Also used in process stage History row — confirmed present: */
--ds-color-text-secondary          → neutral-600 (light) / neutral-400 (dark)
--ds-color-surface-sunken          → neutral-100 (light) / neutral-800 (dark)
--ds-color-border-default          → neutral-200 (light) / neutral-700 (dark)
```

### Colour mapping table

| Current | DS Foundation token | Context |
|---------|-------------------|---------|
| `text-teal-400` | `text-[var(--ds-color-brand-primary)]` | Interactive links, active nav |
| `text-teal-300` | `text-[var(--ds-color-brand-primary-hover)]` | Hover state of links |
| `text-white` on primary buttons | `text-[var(--ds-color-text-on-brand)]` | Button label on brand bg |
| `bg-teal-500` / `bg-teal-600` | `bg-[var(--ds-color-brand-primary)]` | Primary action button bg |
| `hover:bg-teal-600` / `hover:bg-teal-700` | `hover:bg-[var(--ds-color-brand-primary-hover)]` | Primary button hover |
| `bg-teal-500/15` | `bg-[var(--ds-color-interactive-selected-bg)]` | Selected row/item highlight |
| `bg-teal-500/10` | `bg-[var(--ds-color-brand-primary-subtle)]` | Subtle brand tint |
| `ring-teal-400` | `ring-[var(--ds-color-brand-primary)]` | Focus rings |
| `border-teal-500/30` | `border-[var(--ds-color-brand-primary)]/30` | Active borders |
| `text-rose-400` / `text-red-400` | `text-[var(--ds-color-feedback-error-text)]` | Error text |
| `bg-rose-500/15` | `bg-[var(--ds-color-feedback-error-bg)]` | Error backgrounds |
| `border-rose-500/30` | `border-[var(--ds-color-feedback-error-border)]` | Error borders |
| `text-emerald-400` | `text-[var(--ds-color-feedback-success-text)]` | Success text |
| `bg-emerald-500/10` | `bg-[var(--ds-color-feedback-success-bg)]` | Success backgrounds |
| `text-amber-400` | `text-[var(--ds-color-feedback-warning-text)]` | Warning text |
| `bg-amber-500/15` | `bg-[var(--ds-color-feedback-warning-bg)]` | Warning backgrounds |
| `text-blue-400` (info context) | `text-[var(--ds-color-feedback-info-text)]` | Info text |
| `bg-blue-500/10` | `bg-[var(--ds-color-feedback-info-bg)]` | Info backgrounds |
| `border-blue-500/20` | `border-[var(--ds-color-feedback-info-border)]` | Info borders |
| `shadow-teal-500/10` | `shadow-[var(--ds-color-brand-primary)]/10` | Brand glow shadow |
| `shadow-[0_0_15px_rgba(59,130,246,0.2)]` | `shadow-[0_0_15px_color-mix(in_srgb,var(--ds-color-brand-primary)_20%,transparent)]` | Glow point |

### Status chip state mapping (StatusChip vs StatusPill split)

`StatusPill` from `@ds-foundation/react` accepts: `'pending' | 'active' | 'complete' | 'failed' | 'cancelled'`

The 10 TSW states split as follows:

| TSW Status | Handled by | Maps to |
|------------|-----------|---------|
| Failed | `StatusPill` | `status="failed"` |
| Approved | `StatusPill` | `status="complete"` |
| Void | `StatusPill` | `status="cancelled"` |
| Under Review | `StatusChip` (TSW wrapper) | `feedback-warning-text/bg/border` |
| Needs Approval | `StatusChip` (TSW wrapper) | `feedback-warning-text/bg/border` |
| Ready to Approve | `StatusChip` (TSW wrapper) | `feedback-info-text/bg/border` |
| Ready to Extract | `StatusChip` (TSW wrapper) | `feedback-info-text/bg/border` |
| Extracted | `StatusChip` (TSW wrapper) | `feedback-info-text/bg/border` |
| Confirmed | `StatusChip` (TSW wrapper) | `feedback-info-text/bg/border` |
| Processing | `StatusChip` (TSW wrapper) | `feedback-info-text/bg/border` |

> **Why Processing stays in StatusChip (not `StatusPill status="pending"` or `status="active"`).** StatusPill's `pending` and `active` states represent generic lifecycle states with no domain meaning. TSW's 7 in-workflow states (Under Review → Processing) are payment-workflow-specific and benefit from staying in a TSW-owned wrapper where their labels and semantics remain under TSW control. This avoids a false equivalence between generic DS states and TSW business logic states.

`StatusChip` remains the TSW component for all workflow-specific states. Its internal styles migrate to DS feedback tokens in this PR.

### Risk level mapping

> **Design decision — High and Medium share one colour.** High and Medium are both warning-level signals, distinguished by the numeric score, not by colour alone. Collapsing them to a single token is intentional and improves accessibility for colourblind users who cannot distinguish orange from amber. This was reviewed and approved during the Phase 2 brainstorm.

| Level | Current | DS token (icon colour) |
|-------|---------|----------|
| Critical | `#ef4444` / `--color-risk-critical` | `--ds-color-feedback-error-icon` |
| High | `#f97316` / `--color-risk-high` | `--ds-color-feedback-warning-icon` |
| Medium | `#f59e0b` / `--color-risk-medium` | `--ds-color-feedback-warning-icon` (same as High — intentional, see note above) |
| Low | `#22c55e` / `--color-risk-low` | `--ds-color-feedback-success-icon` |
| None | `#94a3b8` / `--color-risk-none` | `--ds-color-text-tertiary` |

### Process stage mapping

Specific sub-tokens per semantic role (label text / background / border):

| Stage | Current | Text token | Bg token | Border token |
|-------|---------|-----------|----------|-------------|
| Create | `#6366f1` / `--color-stage-create` | `--ds-color-brand-primary` | `--ds-color-brand-primary-subtle` | `--ds-color-brand-primary`/30 |
| Anti-Fraud | `#f97316` / `--color-stage-antifraud` | `--ds-color-feedback-error-text` | `--ds-color-feedback-error-bg` | `--ds-color-feedback-error-border` |
| Approvals | `#8b5cf6` / `--color-stage-approvals` | `--ds-color-feedback-warning-text` | `--ds-color-feedback-warning-bg` | `--ds-color-feedback-warning-border` |
| Status | `#0ea5e9` / `--color-stage-status` | `--ds-color-feedback-info-text` | `--ds-color-feedback-info-bg` | `--ds-color-feedback-info-border` |
| History | `#64748b` / `--color-stage-history` | `--ds-color-text-secondary` | `--ds-color-surface-sunken` | `--ds-color-border-default` |

### `design-tokens.ts` changes
- Remove all hardcoded hex values for risk levels and process stages
- Replace with `var(--ds-color-*)` references matching the tables above
- Keep all TypeScript type definitions — only change the value side

### `@utility` changes in `index.css`
- `text-gradient`: `from-blue-400 to-teal-400` → `from-[var(--ds-color-feedback-info-text)] to-[var(--ds-color-brand-primary)]`
- `glow-point`: `text-blue-400` → `text-[var(--ds-color-brand-primary)]`, `border-blue-500/30` → `border-[var(--ds-color-brand-primary)]/30`, hardcoded rgba shadow → `color-mix()` equivalent
- `nav-link` active: `text-blue-400` → `text-[var(--ds-color-brand-primary)]`

### `:root` deletions (in this PR, alongside their replacements)
Remove: `--status-high`, `--status-med`, `--status-low`, `--risk-critical-bg`, `--risk-critical-text`, `--risk-high-bg`, `--risk-high-text`, `--risk-medium-bg`, `--risk-medium-text`, `--risk-low-bg`, `--risk-low-text`, `--risk-none-bg`, `--risk-none-text`, `--spotlight-gradient`

**Post-PR verification:**
0. **Capture visual baseline** before making any changes: run `npm run dev`, take screenshots of: (a) payments table with transactions, (b) fraud spotlight section, (c) process flow, (d) a modal. Save to `docs/superpowers/baselines/phase2-pre-pr2/`. These are the reference images for PR 2 and PR 3 visual comparisons.
1. `npm run check` — TypeScript clean
2. Visual snapshot: active nav tab, selected table row, all 10 status chip states, risk badges (all 4 levels), process flow stages — compare to screenshots in `docs/superpowers/baselines/phase2-pre-pr2/`
3. Grep for remaining hardcoded colour families across all source:
   ```bash
   rg "text-(teal|rose|emerald|amber|sky|indigo|violet|purple|orange)-" client/src/
   rg "bg-(teal|rose|emerald|amber|sky|indigo|violet|purple|orange)-" client/src/
   rg "border-(teal|rose|emerald|amber|sky|indigo|violet|purple|orange)-" client/src/
   ```
   All must return zero results.
4. Grep for hardcoded hex values across all source:
   ```bash
   rg "#[0-9a-fA-F]{3,6}" client/src/
   ```
   Must return zero results (DS Foundation token imports are excluded — they're in `node_modules`).
5. WCAG contrast check: `--ds-color-brand-primary` (blue-600, #2563eb) against dark surface (neutral-900, #0f172a) = 5.9:1 ✅ — meets 4.5:1 normal text requirement.

---

## PR 3 — DS Component Consumption

**Scope:** The following specific files in `client/src/components/`: `StatusChip.tsx`, `results-table/TransactionRow.tsx`, `PaymentSummary.tsx`, `fraud-spotlight/RiskScoreBadge.tsx`, `FraudBadge.tsx`. No other component files touched. No structural moves (that's PR 4).

**What:** Replace TSW hand-rolled implementations with `@ds-foundation/react` equivalents where the DS component covers the same semantic role.

### Component swap plan

| TSW component | DS component | Swap notes |
|---------------|-------------|------------|
| `StatusChip` (failed/complete/cancelled states) | `StatusPill` | 3 states delegate to StatusPill; see split table in PR 2. StatusChip stays as wrapper for the 7 TSW-specific states. |
| Amount display in `TransactionRow`, `PaymentSummary` | `MonoAmount` | Pass formatted amount string as children. Remove manual `font-mono` + inline formatting. |
| Currency badge in `TransactionRow` | `CurrencyBadge` | Pass ISO 4217 currency code string as `currency` prop. |
| Urgency dot in `RiskScoreBadge` | `StatusRing` | Replace manual coloured `div` with `StatusRing` at the appropriate urgency level. |
| `FraudBadge` level display | `UrgencyBadge` | Map HIGH→`critical`, MED→`watch`, LOW→`clear`. |

### Import pattern
```tsx
import { StatusPill, MonoAmount, CurrencyBadge, StatusRing, UrgencyBadge } from '@ds-foundation/react';
```

### Props reference
- `StatusPill`: `status: 'pending' | 'active' | 'complete' | 'failed' | 'cancelled'`
- `MonoAmount`: `children: string` — formatted number string (e.g. `"1,234,567.89"`)
- `CurrencyBadge`: `currency: string` — ISO 4217 code (e.g. `"USD"`)
- `StatusRing`: `urgency: 'critical' | 'watch' | 'clear' | 'skip'`
- `UrgencyBadge`: `level: 'critical' | 'watch' | 'clear' | 'skip'`

### TypeScript compatibility notes
Before each swap, check the existing prop types:
- **MonoAmount children**: TSW likely stores amounts as `number` or `Decimal` — format to string before passing. Pattern: `<MonoAmount>{formatAmount(txn.amount)}</MonoAmount>`. If a formatting utility doesn't exist, create one in `lib/utils.ts`.
- **CurrencyBadge**: TSW currency codes may be typed as `string` (fine) or a union type. If narrower than `string`, cast with `as string` and add a comment explaining why.
- **UrgencyBadge / StatusRing level**: TSW risk levels are `'HIGH' | 'MED' | 'LOW'` — requires a mapping function, not a direct prop pass. Create a `toUrgencyLevel(risk: RiskLevel): UrgencyLevel` helper alongside the swap.
- Run `npm run check` after each individual swap, not just at the end of the PR, to catch type errors early.

**Post-PR verification:**
1. `npm run check` — TypeScript clean
2. Visual check in dev server:
   - StatusChip renders identically in transaction table (all 10 states)
   - MonoAmount renders financial figures with correct mono font, alignment, and sign
   - FraudBadge HIGH/MED/LOW renders urgency labels correctly
   - RiskScoreBadge urgency dot renders with correct colour for each level
3. Confirm no `@ds-foundation/react` imports are resolving to `node_modules/.cache` stale build — clear cache if needed

---

## PR 4 — Atomic Reorg

**Scope:** File moves + import path updates + DS contract annotations + NEW_COMPONENTS.md

**What:** Reorganise all 63 components into an Atomic Design folder structure. Every file move has a corresponding import path update. TypeScript is the authoritative verification that all paths resolve.

### Target folder structure

```
client/src/components/
├── atoms/                    # Primitive, stateless, DS-aligned
│   ├── Badge.tsx             # @ds-candidate
│   ├── DetailCard.tsx        # @ds-candidate
│   ├── IconButton.tsx        # @ds-candidate
│   ├── SectionHeader.tsx
│   ├── Skeleton.tsx
│   └── StatusChip.tsx        # @tsw-atom
│
├── molecules/                # Composed from atoms, domain-aware
│   ├── FraudBadge.tsx
│   ├── ProcessFlow.tsx
│   ├── PaymentSummary.tsx
│   ├── PaymentSummarySkeleton.tsx
│   └── fraud-spotlight/
│       ├── FlaggedItemDetail.tsx
│       ├── FlaggedItemRow.tsx
│       ├── OverrideDialog.tsx
│       ├── RiskScoreBadge.tsx
│       └── VerificationActions.tsx
│
├── organisms/                # Full feature sections, domain logic
│   ├── FilterPanel.tsx
│   ├── FraudGateModal.tsx
│   ├── FraudSpotlight.tsx
│   ├── HoldModal.tsx
│   ├── ApproveConfirmModal.tsx
│   ├── RejectModal.tsx
│   ├── ResultsTable.tsx
│   ├── ResultsTableSkeleton.tsx
│   └── results-table/
│       ├── AttachmentViewer.tsx
│       ├── ColumnPicker.tsx
│       ├── PaymentRailDialog.tsx
│       ├── TablePagination.tsx
│       ├── TableToolbar.tsx
│       ├── TransactionCard.tsx
│       └── TransactionRow.tsx
│
├── templates/                # Page-level layouts, prototype-specific
│   ├── export/
│   ├── home/
│   ├── research/
│   └── specs/
│
└── navigation/               # Product nav — separate from atomic hierarchy
    ├── AppNav.tsx
    ├── Navigation.tsx
    └── UnifiedNav.tsx
```

### DS contract annotations

Add a single-line comment at the top of each component file (below imports):

```tsx
// @ds-atom       — primitive, DS Foundation aligned, Phase 3 contribution candidate
// @ds-candidate  — generic enough to contribute to DS Foundation
// @tsw-atom      — TSW-specific atom, stays local
// @ds-molecule   — composed from DS atoms + TSW domain logic
// @tsw-organism  — TSW-specific feature section, stays local
// @tsw-template  — prototype page layout
```

### `NEW_COMPONENTS.md`

Create at `client/src/components/NEW_COMPONENTS.md`:

```markdown
# Adding New Components

## Decision tree

1. Does this already exist in @ds-foundation/react? → Use it directly.
2. Is this a generic primitive with no TSW domain logic? → Add to atoms/, mark @ds-candidate, open a DS Foundation contribution PR.
3. Is this composed from atoms + TSW domain logic? → Add to molecules/, mark @ds-molecule.
4. Is this a full feature section? → Add to organisms/, mark @tsw-organism.

## DS Foundation contribution model

Branch → component file + MDX registry spec + Storybook story → `npm run validate` in ds-foundation-rt → changeset → PR.
```

**Post-PR verification:**
1. `npm run check` — **zero TypeScript errors is the pass criteria for all import path resolution**. The compiler catches every broken import path; no manual grep needed.
2. `npm run dev` — app loads without console errors on every route: home, research, specs, payments table (with transactions visible), fraud spotlight section, each of the four modals (Approve, Reject, Hold, FraudGate).
3. Confirm `client/src/components/` root folder contains only `atoms/`, `molecules/`, `organisms/`, `templates/`, `navigation/`, `ui/`, `shared/` (shared and ui folders from Phase 1 remain for shadcn/ui components), and `NEW_COMPONENTS.md`.
4. Spot-check: pick 5 moved components at random, confirm their annotation comment is present and correct.

---

## PR failure and rollback policy

Each PR must pass its full verification checklist before the next PR begins.

If a PR fails verification:
1. **TypeScript error** — fix in the same branch, re-run `npm run check`. Do not start the next PR.
2. **Visual regression** — diagnose before reverting. If the regression is a known intentional change (e.g. orange→amber colour merge for risk levels), update the visual baseline and document the change. If unintentional, fix in the same branch.
3. **WCAG regression** — block the PR. Fix the specific token or usage before merging. Do not proceed.
4. **If a merged PR must be reverted** — revert the entire PR (not individual commits). The next PR in sequence inherits the reverted state cleanly.

PRs are sequentially dependent. Do not start PR 2 if PR 1 is not merged and verified.

---

## Acceptance criteria (Phase 2 complete)

- [ ] `npm run check` passes clean after every PR
- [ ] `npm run dev` — zero console errors on any route
- [ ] Zero hardcoded Tailwind colour family classes in `client/src/` (grep verified per PR 2 checklist)
- [ ] Zero hardcoded hex values in `client/src/` (grep verified per PR 2 checklist)
- [ ] All DS Foundation React components imported from `@ds-foundation/react`
- [ ] Component folder structure matches the atomic layout above
- [ ] Every component file has a DS contract annotation comment
- [ ] `NEW_COMPONENTS.md` present and accurate
- [ ] Visual output pixel-identical to Phase 1 (snapshots reviewed per-PR)
- [ ] WCAG 2.2 AA maintained: brand-primary blue-600 meets 5.9:1 contrast on dark surface

---

## Out of scope / Phase 3

- Contributing `IconButton`, `DetailCard`, `Badge`, `StatusChip` to DS Foundation
- Adding Storybook stories
- Light mode audit (Phase 1 delivered dark mode; light mode parity is a separate track)
