# TSW Phase 2 — DS Foundation Full Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fully align TSW to DS Foundation — zero hardcoded colour families, all token categories wired, DS React components consumed, atomic folder structure in place.

**Architecture:** Four sequential PRs. PR 1 is pure CSS infrastructure (no component changes). PR 2 migrates all colours (~22 files). PR 3 swaps 5 component files to use `@ds-foundation/react`. PR 4 reorganises the 63-component folder structure. Each PR is independently verifiable; do not start the next until the current one passes its checklist.

**Tech Stack:** React 18, Tailwind CSS v4, `@ds-foundation/tokens@0.2.2`, `@ds-foundation/react@0.1.0`, TypeScript 5, Vite

**Spec:** `docs/superpowers/specs/2026-04-01-tsw-phase2-design.md`

---

## File Map

### PR 1 — files touched
- Modify: `client/src/index.css` — `@theme` block only (add DS token wiring for font, spacing, motion, shadow)

### PR 2 — files touched
- Modify: `client/src/index.css` — `@theme` colour token deletions, `@utility` updates, `:root` deletions
- Modify: `client/src/lib/design-tokens.ts` — replace all hardcoded hex in `risk`, `processStage`, `txStatus` objects
- Modify: `client/src/components/shared/Badge.tsx` — `getRiskColors()` + status/fraud/riskScore variant styles
- Modify: `client/src/components/results-table/TransactionRow.tsx` — teal/rose/orange/amber → DS tokens
- Modify: `client/src/components/ProcessFlow.tsx` — stage colour references
- Modify: `client/src/components/FraudSpotlight.tsx` — any hardcoded colours
- Modify: `client/src/components/fraud-spotlight/*.tsx` (5 files) — any hardcoded colours
- Modify: `client/src/components/AppNav.tsx`, `Navigation.tsx`, `UnifiedNav.tsx` — nav active state (teal → brand-primary)
- Modify: remaining component files with hardcoded colour classes (identified by grep in Task 8)

### PR 3 — files touched
- Create: `client/src/lib/formatAmount.ts` — `formatAmount(n: number): string` utility
- Modify: `client/src/components/shared/Badge.tsx` — the central implementation file; `StatusChip.tsx` and `FraudBadge.tsx` and `RiskScoreBadge.tsx` are confirmed thin wrappers that delegate all rendering to `Badge.tsx` variants. All DS component swaps happen here.
- Modify: `client/src/components/results-table/TransactionRow.tsx` — swap amount/currency cells → `MonoAmount` + `CurrencyBadge`
- Modify: `client/src/components/PaymentSummary.tsx` — swap financial figures → `MonoAmount`

### PR 4 — files touched
- Create: `client/src/components/atoms/` (6 files moved here)
- Create: `client/src/components/molecules/` (9 files moved here)
- Create: `client/src/components/organisms/` (15 files moved here)
- Create: `client/src/components/templates/` (13 files moved here)
- Create: `client/src/components/navigation/` (3 files moved here)
- Create: `client/src/components/NEW_COMPONENTS.md`
- Modify: all `import` statements that reference moved files (~80 import path updates)

---

## ══════════════════════════════════════════
## PR 1 — Token Layer Wiring
## ══════════════════════════════════════════

> **Scope:** `client/src/index.css` `@theme` block only. Zero other file changes. Zero `:root` changes.
> **The `:root` colour tokens (`--color-risk-*`, `--color-stage-*`) stay in place** — they are still referenced by component files and will be removed in PR 2 alongside their replacements.

---

### Task 1: Add DS token wiring to `@theme` block

**Files:**
- Modify: `client/src/index.css`

The current `@theme` block (line ~30) starts with `--color-risk-critical: #ef4444;`. Add the DS wiring block **before** the existing `--color-risk-*` lines, inside the same `@theme { }` block.

- [ ] **Step 1: Open `client/src/index.css` and locate the `@theme {` block**

  The block starts at approximately line 30. The first line inside is:
  ```css
  --color-risk-critical: #ef4444;
  ```

- [ ] **Step 2: Insert the following CSS immediately before `--color-risk-critical`**

  ```css
  /* ── DS Foundation token wiring ──────────────────────────────────────────
     These wire Tailwind v4 utility classes to DS Foundation token vars.
     Component files need no changes — utilities auto-resolve to DS values.
     ──────────────────────────────────────────────────────────────────────── */

  /* Typography — font size */
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

  /* Typography — font weight */
  --font-weight-thin:       var(--ds-font-weight-thin);
  --font-weight-light:      var(--ds-font-weight-light);
  --font-weight-regular:    var(--ds-font-weight-regular);
  --font-weight-medium:     var(--ds-font-weight-medium);
  --font-weight-semibold:   var(--ds-font-weight-semibold);
  --font-weight-bold:       var(--ds-font-weight-bold);
  --font-weight-extrabold:  var(--ds-font-weight-extrabold);

  /* Typography — line height */
  --leading-none:    var(--ds-font-leading-none);
  --leading-tight:   var(--ds-font-leading-tight);
  --leading-snug:    var(--ds-font-leading-snug);
  --leading-normal:  var(--ds-font-leading-normal);
  --leading-relaxed: var(--ds-font-leading-relaxed);
  --leading-loose:   var(--ds-font-leading-loose);

  /* Typography — letter spacing */
  --tracking-tighter: var(--ds-font-tracking-tighter);
  --tracking-tight:   var(--ds-font-tracking-tight);
  --tracking-normal:  var(--ds-font-tracking-normal);
  --tracking-wide:    var(--ds-font-tracking-wide);
  --tracking-wider:   var(--ds-font-tracking-wider);
  --tracking-widest:  var(--ds-font-tracking-widest);

  /* Spacing — base unit; all gap-*, p-*, m-* utilities multiply from this */
  --spacing: var(--ds-spacing-1); /* 0.25rem — matches Tailwind default */

  /* Motion — duration (wired via var; easing cannot use var inside cubic-bezier()) */
  --duration-fastest: var(--ds-motion-duration-fastest); /* 50ms  */
  --duration-faster:  var(--ds-motion-duration-faster);  /* 100ms */
  --duration-fast:    var(--ds-motion-duration-fast);    /* 150ms */
  --duration-normal:  var(--ds-motion-duration-normal);  /* 200ms */
  --duration-slow:    var(--ds-motion-duration-slow);    /* 300ms */
  --duration-slower:  var(--ds-motion-duration-slower);  /* 400ms */

  /* Motion — easing (DS values baked in as cubic-bezier strings; update manually if DS changes) */
  --ease-linear:  cubic-bezier(0, 0, 1, 1);           /* --ds-motion-easing-linear     */
  --ease-in:      cubic-bezier(0.4, 0, 1, 1);         /* --ds-motion-easing-ease-in    */
  --ease-out:     cubic-bezier(0, 0, 0.2, 1);         /* --ds-motion-easing-ease-out   */
  --ease-in-out:  cubic-bezier(0.4, 0, 0.2, 1);       /* --ds-motion-easing-ease-in-out */
  --ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);  /* --ds-motion-easing-spring     */

  /* Shadows */
  --shadow-xs:  var(--ds-shadow-xs);
  --shadow-sm:  var(--ds-shadow-sm);
  --shadow-md:  var(--ds-shadow-md);
  --shadow-lg:  var(--ds-shadow-lg);
  --shadow-xl:  var(--ds-shadow-xl);
  --shadow-2xl: var(--ds-shadow-2xl);
  ```

- [ ] **Step 3: Run TypeScript check**

  ```bash
  cd /Users/apacheco/Documents/Projects/payments-tsw-phase1
  npm run check
  ```

  Expected: zero errors. CSS changes don't affect TypeScript, but confirm nothing else was accidentally touched.

- [ ] **Step 4: Run dev server and verify no visual change**

  ```bash
  npm run dev
  ```

  Open http://localhost:5173 (or whichever port Vite reports). Navigate to the Payments / Prototype route. The UI should look **identical** to before — this PR only adds infrastructure that gets resolved the same way Tailwind already resolves these utilities.

- [ ] **Step 5: Verify token resolution in DevTools**

  Open browser DevTools → Elements. Find any element with `text-sm` class. In Computed styles, `font-size` should show as `var(--ds-font-size-sm)` → resolving to `14px` (0.875rem).

  Find any flex container with `gap-2`. Computed `gap` should be `8px` (0.5rem = `calc(var(--spacing) * 2)`).

- [ ] **Step 6: Commit**

  ```bash
  git add client/src/index.css
  git commit -m "feat(tokens): wire @theme to DS Foundation token vars

  Connects Tailwind v4 utilities (font-size, font-weight, leading,
  tracking, spacing, motion duration, easing, shadow) to DS Foundation
  token vars. Zero component file changes — utilities auto-resolve.

  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
  ```

---

## ══════════════════════════════════════════
## PR 2 — Colour Migration
## ══════════════════════════════════════════

> **Scope:** `client/src/index.css`, `client/src/lib/design-tokens.ts`, all component files containing hardcoded Tailwind colour families.
> **Before touching any file:** capture the visual baseline (Task 2).

---

### Task 2: Capture visual baseline

**Files:** none (screenshots only)

- [ ] **Step 1: Create baseline directory**

  ```bash
  mkdir -p /Users/apacheco/Documents/Projects/payments-tsw-phase1/docs/superpowers/baselines/phase2-pre-pr2
  ```

- [ ] **Step 2: Start dev server if not running**

  ```bash
  npm run dev
  ```

- [ ] **Step 3: Take screenshots of all key UI states**

  Save to `docs/superpowers/baselines/phase2-pre-pr2/`. Name them:
  - `01-payments-table.png` — full payments table with transactions visible
  - `02-expanded-row.png` — a transaction row expanded
  - `03-fraud-spotlight.png` — fraud spotlight section
  - `04-process-flow.png` — process flow component showing all 5 stages
  - `05-status-chips.png` — status chips showing multiple different states
  - `06-risk-badges.png` — risk badges showing HIGH, MED, LOW
  - `07-approve-modal.png` — approve confirm modal open
  - `08-nav-active.png` — nav with an active link highlighted

  These are your regression reference for PR 2 and PR 3.

---

### Task 3: Update `@utility` colour rules in `index.css`

> **Task order for PR 2: 3 → 5 → 6 → 7 → 8 → 9**
> Tasks 5 (design-tokens.ts) and 6 (Badge.tsx) must complete before Task 7 (`:root` deletions) — the deletions remove variables that are still referenced until those files are updated.

**Files:**
- Modify: `client/src/index.css`

The current `@theme` block has hardcoded `--color-risk-*` and `--color-stage-*` tokens. These will be removed in Task 4 — but not yet. In this task we migrate only the `@utility` rules that use raw Tailwind colour classes.

- [ ] **Step 1: Find and update the `text-gradient` utility**

  Current (around line 144):
  ```css
  @utility text-gradient {
    @apply bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-teal-400;
  }
  ```

  Replace with:
  ```css
  @utility text-gradient {
    @apply bg-clip-text text-transparent bg-linear-to-r from-[var(--ds-color-feedback-info-text)] to-[var(--ds-color-brand-primary)];
  }
  ```

- [ ] **Step 2: Find and update the `glow-point` utility**

  Current:
  ```css
  @utility glow-point {
    @apply relative flex items-center justify-center w-8 h-8 rounded-full bg-[var(--ds-color-surface-raised)] text-blue-400 font-bold border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)];
  }
  ```

  Replace with:
  ```css
  @utility glow-point {
    @apply relative flex items-center justify-center w-8 h-8 rounded-full bg-[var(--ds-color-surface-raised)] text-[var(--ds-color-brand-primary)] font-bold border border-[var(--ds-color-brand-primary)]/30 shadow-[0_0_15px_color-mix(in_srgb,var(--ds-color-brand-primary)_20%,transparent)];
  }
  ```

- [ ] **Step 3: Find and update the `nav-link` utility**

  Current (the `&.active` block):
  ```css
  &.active {
    @apply text-blue-400;
  }
  ```

  Replace with:
  ```css
  &.active {
    @apply text-[var(--ds-color-brand-primary)];
  }
  ```

---

### Task 7: Remove legacy `:root` colour tokens from `index.css`

> ⚠️ **This task must run AFTER Tasks 5 and 6 are complete.** Those tasks replace every reference to these `:root` vars. Deleting them before that causes a visual regression.

**Files:**
- Modify: `client/src/index.css`

- [ ] **Step 1: Confirm no remaining references before deleting**

  ```bash
  rg "(--status-high|--status-med|--status-low|--risk-critical|--risk-high|--risk-medium|--risk-low|--risk-none|--spotlight-gradient)" client/src/
  ```

  If any results appear (other than the `:root` definitions themselves), fix those references in the component files before proceeding.

- [ ] **Step 2: Remove the `:root` severity and risk variables**

  Delete the following lines from the `:root` block:
  ```css
  --status-high: 343 88% 60%;
  --status-med: 38 92% 50%;
  --status-low: 158 64% 52%;

  --risk-critical-bg: #fef2f2;
  --risk-critical-text: #dc2626;
  --risk-high-bg: #fff7ed;
  --risk-high-text: #c2410c;
  --risk-medium-bg: #fffbeb;
  --risk-medium-text: #b45309;
  --risk-low-bg: #f0fdf4;
  --risk-low-text: #166534;
  --risk-none-bg: #f8fafc;
  --risk-none-text: #475569;

  --spotlight-gradient: linear-gradient(135deg, #f43f5e, #fb923c);
  ```

- [ ] **Step 3: Remove `--color-risk-*` and `--color-stage-*` from `@theme` block**

  Delete these lines from the `@theme { }` block:
  ```css
  --color-risk-critical: #ef4444;
  --color-risk-high: #f97316;
  --color-risk-medium: #f59e0b;
  --color-risk-low: #22c55e;
  --color-risk-none: #94a3b8;

  --color-stage-create: #6366f1;
  --color-stage-antifraud: #f97316;
  --color-stage-approvals: #8b5cf6;
  --color-stage-status: #0ea5e9;
  --color-stage-history: #64748b;
  ```

---

### Task 5: Migrate `design-tokens.ts`

**Files:**
- Modify: `client/src/lib/design-tokens.ts`

Replace all hardcoded hex values with DS Foundation CSS var references. Keep all TypeScript type definitions and object shapes — only change the value side.

- [ ] **Step 1: Replace the `risk` object**

  Current:
  ```typescript
  export const risk = {
    critical: { bg: '#fef2f2', border: '#fecaca', text: '#dc2626', solid: '#ef4444', label: 'Critical' },
    high:     { bg: '#fff7ed', border: '#fed7aa', text: '#c2410c', solid: '#f97316', label: 'High' },
    medium:   { bg: '#fffbeb', border: '#fde68a', text: '#b45309', solid: '#f59e0b', label: 'Medium' },
    low:      { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534', solid: '#22c55e', label: 'Low' },
    none:     { bg: '#f8fafc', border: '#e2e8f0', text: '#475569', solid: '#94a3b8', label: 'Clear' },
  } as const;
  ```

  Replace with:
  ```typescript
  export const risk = {
    critical: { bg: 'var(--ds-color-feedback-error-bg)',   border: 'var(--ds-color-feedback-error-border)',   text: 'var(--ds-color-feedback-error-text)',   solid: 'var(--ds-color-feedback-error-icon)',   label: 'Critical' },
    high:     { bg: 'var(--ds-color-feedback-warning-bg)', border: 'var(--ds-color-feedback-warning-border)', text: 'var(--ds-color-feedback-warning-text)', solid: 'var(--ds-color-feedback-warning-icon)', label: 'High' },
    medium:   { bg: 'var(--ds-color-feedback-warning-bg)', border: 'var(--ds-color-feedback-warning-border)', text: 'var(--ds-color-feedback-warning-text)', solid: 'var(--ds-color-feedback-warning-icon)', label: 'Medium' },
    low:      { bg: 'var(--ds-color-feedback-success-bg)', border: 'var(--ds-color-feedback-success-border)', text: 'var(--ds-color-feedback-success-text)', solid: 'var(--ds-color-feedback-success-icon)', label: 'Low' },
    none:     { bg: 'var(--ds-color-surface-sunken)',       border: 'var(--ds-color-border-default)',           text: 'var(--ds-color-text-secondary)',         solid: 'var(--ds-color-text-tertiary)',          label: 'Clear' },
  } as const;
  ```

  > **Note:** High and Medium intentionally share warning tokens — this is a design decision made for accessibility (colourblind users). They are distinguished by the numeric score value, not colour alone.

- [ ] **Step 2: Replace the `processStage` object**

  Current:
  ```typescript
  export const processStage = {
    create:    { color: '#6366f1', bg: '#eef2ff', label: 'Create',     order: 1 },
    antiFraud: { color: '#f97316', bg: '#fff7ed', label: 'Anti Fraud', order: 2 },
    approvals: { color: '#8b5cf6', bg: '#f5f3ff', label: 'Approvals',  order: 3 },
    status:    { color: '#0ea5e9', bg: '#f0f9ff', label: 'Status',     order: 4 },
    history:   { color: '#64748b', bg: '#f8fafc', label: 'History',    order: 5 },
  } as const;
  ```

  Replace with:
  ```typescript
  export const processStage = {
    create:    { color: 'var(--ds-color-brand-primary)',         bg: 'var(--ds-color-brand-primary-subtle)',    border: 'var(--ds-color-brand-primary)',            label: 'Create',     order: 1 },
    antiFraud: { color: 'var(--ds-color-feedback-error-text)',   bg: 'var(--ds-color-feedback-error-bg)',       border: 'var(--ds-color-feedback-error-border)',    label: 'Anti Fraud', order: 2 },
    approvals: { color: 'var(--ds-color-feedback-warning-text)', bg: 'var(--ds-color-feedback-warning-bg)',     border: 'var(--ds-color-feedback-warning-border)',  label: 'Approvals',  order: 3 },
    status:    { color: 'var(--ds-color-feedback-info-text)',    bg: 'var(--ds-color-feedback-info-bg)',        border: 'var(--ds-color-feedback-info-border)',     label: 'Status',     order: 4 },
    history:   { color: 'var(--ds-color-text-secondary)',        bg: 'var(--ds-color-surface-sunken)',          border: 'var(--ds-color-border-default)',           label: 'History',    order: 5 },
  } as const;
  ```

  Note the `border` field is new. Run `npm run check` immediately after this step to isolate any type errors introduced by the new field before moving on:

  ```bash
  npm run check
  ```

  Fix any errors before continuing.

- [ ] **Step 3: Replace the `txStatus` object**

  Current:
  ```typescript
  export const txStatus = {
    pending:        { color: '#b45309', bg: '#fffbeb', label: 'Pending'           },
    processing:     { color: '#0369a1', bg: '#f0f9ff', label: 'Processing'        },
    readyToApprove: { color: '#7c3aed', bg: '#f5f3ff', label: 'Ready to Approve'  },
    approved:       { color: '#166534', bg: '#f0fdf4', label: 'Approved'          },
    rejected:       { color: '#dc2626', bg: '#fef2f2', label: 'Rejected'          },
    onHold:         { color: '#92400e', bg: '#fef3c7', label: 'On Hold'           },
    escalated:      { color: '#1d4ed8', bg: '#eff6ff', label: 'Escalated'         },
    cancelled:      { color: '#374151', bg: '#f9fafb', label: 'Cancelled'         },
  } as const;
  ```

  Replace with:
  ```typescript
  export const txStatus = {
    pending:        { color: 'var(--ds-color-feedback-warning-text)', bg: 'var(--ds-color-feedback-warning-bg)', label: 'Pending'          },
    processing:     { color: 'var(--ds-color-feedback-info-text)',    bg: 'var(--ds-color-feedback-info-bg)',    label: 'Processing'       },
    readyToApprove: { color: 'var(--ds-color-feedback-info-text)',    bg: 'var(--ds-color-feedback-info-bg)',    label: 'Ready to Approve' },
    approved:       { color: 'var(--ds-color-feedback-success-text)', bg: 'var(--ds-color-feedback-success-bg)', label: 'Approved'         },
    rejected:       { color: 'var(--ds-color-feedback-error-text)',   bg: 'var(--ds-color-feedback-error-bg)',   label: 'Rejected'         },
    onHold:         { color: 'var(--ds-color-feedback-warning-text)', bg: 'var(--ds-color-feedback-warning-bg)', label: 'On Hold'          },
    escalated:      { color: 'var(--ds-color-feedback-info-text)',    bg: 'var(--ds-color-feedback-info-bg)',    label: 'Escalated'        },
    cancelled:      { color: 'var(--ds-color-text-secondary)',        bg: 'var(--ds-color-surface-sunken)',       label: 'Cancelled'        },
  } as const;
  ```

- [ ] **Step 4: Run TypeScript check**

  ```bash
  npm run check
  ```

  Expected: zero errors. If any consumer fails because of the new `border` field in `processStage`, TypeScript will report it — add the field access where needed.

---

### Task 6: Migrate `Badge.tsx` — the colour hotspot

**Files:**
- Modify: `client/src/components/shared/Badge.tsx`

`Badge.tsx` contains `getRiskColors()` which has all the hardcoded Tailwind colour classes for fraud/risk badges. This is the single most important file in PR 2.

- [ ] **Step 1: Replace `getRiskColors()` function**

  Current:
  ```typescript
  export function getRiskColors(risk: number) {
    const hi = risk >= 70;
    const md = risk >= 40;
    return {
      border: hi ? "border-rose-600" : md ? "border-amber-500" : "border-emerald-600",
      text: hi ? "text-rose-400" : md ? "text-amber-400" : "text-emerald-400",
      reason: hi ? "text-rose-300" : md ? "text-amber-300" : "text-emerald-300",
      bg: hi ? "bg-rose-500/10" : md ? "bg-amber-500/10" : "bg-emerald-500/10",
      label: hi ? "HIGH" as const : md ? "MED" as const : "LOW" as const,
      isHigh: hi,
    };
  }
  ```

  Replace with:
  ```typescript
  export function getRiskColors(risk: number) {
    const hi = risk >= 70;
    const md = risk >= 40;
    return {
      border: hi ? "border-[var(--ds-color-feedback-error-border)]"   : md ? "border-[var(--ds-color-feedback-warning-border)]"   : "border-[var(--ds-color-feedback-success-border)]",
      text:   hi ? "text-[var(--ds-color-feedback-error-text)]"       : md ? "text-[var(--ds-color-feedback-warning-text)]"       : "text-[var(--ds-color-feedback-success-text)]",
      reason: hi ? "text-[var(--ds-color-feedback-error-text)]"       : md ? "text-[var(--ds-color-feedback-warning-text)]"       : "text-[var(--ds-color-feedback-success-text)]",
      bg:     hi ? "bg-[var(--ds-color-feedback-error-bg)]"           : md ? "bg-[var(--ds-color-feedback-warning-bg)]"           : "bg-[var(--ds-color-feedback-success-bg)]",
      label: hi ? "HIGH" as const : md ? "MED" as const : "LOW" as const,
      isHigh: hi,
    };
  }
  ```

- [ ] **Step 2: Grep Badge.tsx for any remaining hardcoded colour classes**

  ```bash
  rg "text-(teal|rose|emerald|amber|sky|indigo|violet|purple|orange|blue)-|bg-(teal|rose|emerald|amber|sky|indigo|violet|purple|orange|blue)-|border-(teal|rose|emerald|amber|sky|indigo|violet|purple|orange|blue)-" client/src/components/shared/Badge.tsx
  ```

  Fix any remaining instances using the colour mapping table in the spec.

- [ ] **Step 3: Run TypeScript check**

  ```bash
  npm run check
  ```

---

### Task 7: Migrate `TransactionRow.tsx`

**Files:**
- Modify: `client/src/components/results-table/TransactionRow.tsx`

This file has many hardcoded colour classes. Key patterns to find and replace:

- [ ] **Step 1: Replace focus ring colour**

  Find: `focus:ring-teal-400`
  Replace with: `focus:ring-[var(--ds-color-brand-primary)]`

- [ ] **Step 2: Replace selected row background**

  Find: `bg-teal-500/5 hover:bg-teal-500/8`
  Replace with: `bg-[var(--ds-color-interactive-selected-bg)] hover:bg-[var(--ds-color-interactive-selected-bg)]`

- [ ] **Step 3: Replace checkbox hover colour**

  Find: `hover:text-teal-400`
  Replace with: `hover:text-[var(--ds-color-brand-primary)]`

- [ ] **Step 4: Replace checked checkbox colour**

  Find: `text-teal-400` (inside checkbox icon)
  Replace with: `text-[var(--ds-color-brand-primary)]`

- [ ] **Step 5: Replace border-left risk colours**

  Find: `"border-l-rose-500"` and `"border-l-orange-500"` and `"border-l-amber-500/50"`
  Replace with:
  ```typescript
  "border-l-[var(--ds-color-feedback-error-border)]"   // overdue
  "border-l-[var(--ds-color-feedback-error-icon)]"     // risk >= 70
  "border-l-[var(--ds-color-feedback-warning-border)]" // risk >= 40
  ```

- [ ] **Step 6: Grep for any remaining hardcoded colours in TransactionRow**

  ```bash
  rg "text-(teal|rose|emerald|amber|sky|indigo|violet|purple|orange)-|bg-(teal|rose|emerald|amber|sky|indigo|violet|purple|orange)-|border-(teal|rose|emerald|amber|sky|indigo|violet|purple|orange)-" client/src/components/results-table/TransactionRow.tsx
  ```

  Fix all remaining instances.

- [ ] **Step 7: Run TypeScript check**

  ```bash
  npm run check
  ```

---

### Task 8: Sweep remaining component files for hardcoded colours

> Run after Tasks 5, 6, and 7 are complete.

**Files:**
- Modify: any component files identified by grep

- [ ] **Step 1: Find all remaining files with hardcoded colour classes**

  ```bash
  rg -l "text-(teal|rose|emerald|amber|sky|indigo|violet|purple|orange)-|bg-(teal|rose|emerald|amber|sky|indigo|violet|purple|orange)-|border-(teal|rose|emerald|amber|sky|indigo|violet|purple|orange)-" client/src/components/
  ```

  Work through each file in the output. For each file, apply the colour mapping from the spec (`docs/superpowers/specs/2026-04-01-tsw-phase2-design.md`, "Colour mapping table" section):

  | Pattern | Replace with |
  |---------|-------------|
  | `text-teal-400` | `text-[var(--ds-color-brand-primary)]` |
  | `bg-teal-500` / `bg-teal-600` | `bg-[var(--ds-color-brand-primary)]` |
  | `hover:bg-teal-600` | `hover:bg-[var(--ds-color-brand-primary-hover)]` |
  | `bg-teal-500/15` | `bg-[var(--ds-color-interactive-selected-bg)]` |
  | `bg-teal-500/10` | `bg-[var(--ds-color-brand-primary-subtle)]` |
  | `ring-teal-400` | `ring-[var(--ds-color-brand-primary)]` |
  | `text-white` on teal/primary bg | `text-[var(--ds-color-text-on-brand)]` |
  | `text-rose-400` / `text-red-400` | `text-[var(--ds-color-feedback-error-text)]` |
  | `bg-rose-500/15` | `bg-[var(--ds-color-feedback-error-bg)]` |
  | `text-emerald-400` | `text-[var(--ds-color-feedback-success-text)]` |
  | `bg-emerald-500/10` | `bg-[var(--ds-color-feedback-success-bg)]` |
  | `text-amber-400` | `text-[var(--ds-color-feedback-warning-text)]` |
  | `bg-amber-500/15` | `bg-[var(--ds-color-feedback-warning-bg)]` |
  | `text-blue-400` (info context) | `text-[var(--ds-color-feedback-info-text)]` |
  | `bg-blue-500/10` | `bg-[var(--ds-color-feedback-info-bg)]` |
  | `shadow-teal-500/10` | `shadow-[var(--ds-color-brand-primary)]/10` |

  > **Be careful with `text-white`**: only replace `text-white` when it appears on an element that has a teal/primary brand background. `text-white` on non-brand surfaces (e.g. modal overlays, dark text on dark bg) should stay as-is.

- [ ] **Step 2: Run TypeScript check after all file updates**

  ```bash
  npm run check
  ```

- [ ] **Step 3: Run hex grep to confirm no hardcoded colours remain in components**

  ```bash
  rg "#[0-9a-fA-F]{3,6}" client/src/components/ client/src/lib/design-tokens.ts
  ```

  Expected: zero results.

---

### Task 9: PR 2 verification

- [ ] **Step 1: TypeScript check**

  ```bash
  npm run check
  ```

  Expected: zero errors.

- [ ] **Step 2: Final colour grep — three patterns must all return zero results**

  ```bash
  rg "text-(teal|rose|emerald|amber|sky|indigo|violet|purple|orange)-" client/src/
  rg "bg-(teal|rose|emerald|amber|sky|indigo|violet|purple|orange)-" client/src/
  rg "border-(teal|rose|emerald|amber|sky|indigo|violet|purple|orange)-" client/src/
  ```

- [ ] **Step 3: Visual review**

  Run dev server. Compare every screenshot in `docs/superpowers/baselines/phase2-pre-pr2/` against the current UI:
  - Active nav link: teal → blue (brand-primary). Label and underline colour changes, layout stays identical.
  - Status chips: check all visible states. Failed=red, warning states=amber/orange tones, info states=blue, Approved=green, Void=grey.
  - Risk badges HIGH/MED/LOW: HIGH and MED now share warning (amber) colour — this is intentional per design decision.
  - Process flow stages: Create=blue, Anti-Fraud=red, Approvals=amber, Status=blue, History=grey.
  - No layout shifts, no missing backgrounds, no invisible text.

- [ ] **Step 4: WCAG spot check**

  In DevTools, inspect an active nav link. In dark mode, `--ds-color-brand-primary` resolves to blue-400 (`#60a5fa`) against the nav background neutral-900 (`#0f172a`). The contrast ratio is approximately **8.6:1** — well above the 4.5:1 AA requirement. Verify using the DevTools Accessibility panel or a contrast checker tool. Any result ≥4.5:1 passes.

- [ ] **Step 5: Commit**

  ```bash
  git add client/src/index.css client/src/lib/design-tokens.ts client/src/components/
  git commit -m "feat(tokens): migrate all colours to DS Foundation semantic tokens

  Replaces teal/rose/emerald/amber/sky/indigo/violet/purple with DS
  feedback (error/warning/info/success) and brand-primary tokens.
  Removes hardcoded :root colour vars. design-tokens.ts risk and
  processStage objects now reference DS vars throughout.

  High+Medium risk intentionally share warning token (accessibility).

  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
  ```

---

## ══════════════════════════════════════════
## PR 3 — DS Component Consumption
## ══════════════════════════════════════════

> **Scope:** `client/src/lib/formatAmount.ts` (new), `client/src/components/shared/Badge.tsx`, `client/src/components/results-table/TransactionRow.tsx`, `client/src/components/PaymentSummary.tsx`. No structural moves.

---

### Task 10: Create `formatAmount` utility

**Files:**
- Create: `client/src/lib/formatAmount.ts`

`MonoAmount` expects `children: string`. TSW stores amounts as numbers. We need a shared formatter.

- [ ] **Step 1: Read how amounts are currently formatted**

  Look at `client/src/lib/mock-data.ts` — find the `fmtAmt` function to understand the current formatting convention (locale, decimals, sign handling).

- [ ] **Step 2: Create `client/src/lib/formatAmount.ts`**

  ```typescript
  /**
   * Formats a numeric amount for display in MonoAmount component.
   * Returns a string with thousands separators and 2 decimal places.
   * Sign is preserved (negative numbers get a leading minus).
   */
  export function formatAmount(amount: number): string {
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const sign = amount < 0 ? '-' : '';
    return `${sign}${formatted}`;
  }
  ```

  > Check `fmtAmt` in `client/src/lib/mock-data.ts` first. If it already produces a correctly formatted string (thousands-separated, 2dp, sign-preserved), call it inside `formatAmount` rather than duplicating the locale logic. Example: `export function formatAmount(amount: number): string { return fmtAmt(amount); }`

- [ ] **Step 3: Run TypeScript check**

  ```bash
  npm run check
  ```

---

### Task 11: Swap `Badge.tsx` variants to DS components

**Files:**
- Modify: `client/src/components/shared/Badge.tsx`

`Badge.tsx` is the central implementation file. `StatusChip.tsx`, `FraudBadge.tsx`, and `RiskScoreBadge.tsx` are all thin wrappers that pass through to `Badge.tsx` variants. **Confirm this before starting:**

- [ ] **Step 0: Verify the wrapper relationship**

  ```bash
  cat client/src/components/StatusChip.tsx
  cat client/src/components/FraudBadge.tsx
  cat client/src/components/fraud-spotlight/RiskScoreBadge.tsx
  ```

  Each should show a single-function component that calls `<Badge variant="status|fraud|riskScore" .../>` with no additional rendering logic. If any of these files contain independent rendering logic (not delegating to Badge), stop and update the plan before proceeding — those files will also need DS component swaps.

- [ ] **Step 1: Add DS component imports at the top of `Badge.tsx`**

  ```typescript
  import { StatusPill, UrgencyBadge, StatusRing } from '@ds-foundation/react';
  ```

- [ ] **Step 2: In the `status` variant rendering, delegate 3 states to `StatusPill`**

  Find where the `variant === "status"` branch renders. For the `Failed`, `Approved`, and `Void` states, render `StatusPill` instead of the manual badge markup:

  ```typescript
  // Inside the status variant branch:
  if (props.variant === 'status') {
    const { status } = props;

    // States handled by DS Foundation StatusPill
    if (status === 'Failed')   return <StatusPill status="failed" />;
    if (status === 'Approved') return <StatusPill status="complete" />;
    if (status === 'Void')     return <StatusPill status="cancelled" />;

    // TSW-specific workflow states — keep custom rendering with DS tokens
    // (existing rendering code continues below, now using DS colour tokens
    //  from design-tokens.ts which were updated in PR 2)
  }
  ```

  > Check the exact status string values used in the codebase. Run `rg "status=" client/src/components/ client/src/lib/` to find all usages and confirm the exact strings passed (e.g. 'Failed' vs 'failed').

- [ ] **Step 3: In the `fraud` variant rendering, swap to `UrgencyBadge`**

  Find the `variant === "fraud"` branch. Replace the badge rendering with:

  ```typescript
  if (props.variant === 'fraud') {
    const { risk } = props;
    const level = risk >= 70 ? 'critical' : risk >= 40 ? 'watch' : 'clear';
    return <UrgencyBadge level={level} />;
  }
  ```

- [ ] **Step 4: In the `riskScore` variant, swap urgency dot to `StatusRing`**

  Find where the `variant === "riskScore"` branch renders the urgency indicator dot. Replace the coloured `div` dot with `StatusRing`:

  ```typescript
  // Find the dot/indicator div and replace with:
  const urgency = txn.risk >= 70 ? 'critical' : txn.risk >= 40 ? 'watch' : 'clear';
  // Replace: <div className={`w-2.5 h-2.5 rounded-full ${riskColors.bg}`} />
  // With:
  <StatusRing urgency={urgency} />
  ```

- [ ] **Step 5: Run TypeScript check after each swap (not just at the end)**

  ```bash
  npm run check
  ```

  Fix any type errors before the next step.

---

### Task 12: Swap amount/currency rendering in `TransactionRow.tsx`

**Files:**
- Modify: `client/src/components/results-table/TransactionRow.tsx`

- [ ] **Step 1: Add imports**

  ```typescript
  import { MonoAmount, CurrencyBadge } from '@ds-foundation/react';
  import { formatAmount } from '@/lib/formatAmount';
  ```

- [ ] **Step 2: Find the amount cell in the table row**

  Search for where `fmtAmt(t.amount, t.cur)` is called. This renders the amount. Replace the raw string output with `MonoAmount`:

  ```tsx
  // Before (approximate):
  <span className="font-mono text-sm">{fmtAmt(t.amount, t.cur)}</span>

  // After:
  <MonoAmount>{formatAmount(t.amount)}</MonoAmount>
  ```

- [ ] **Step 3: Find the currency cell**

  Search for where `t.cur` is rendered as a currency label. Replace with `CurrencyBadge`:

  ```tsx
  // Before (approximate):
  <span className="text-xs text-[var(--ds-color-text-secondary)]">{t.cur}</span>

  // After:
  <CurrencyBadge currency={t.cur} />
  ```

  > If `t.cur` is typed as a narrow union type, you may need `currency={t.cur as string}`. Add a comment: `// DS CurrencyBadge accepts string; t.cur is always ISO 4217`

- [ ] **Step 4: Run TypeScript check**

  ```bash
  npm run check
  ```

---

### Task 13: Swap amount rendering in `PaymentSummary.tsx`

**Files:**
- Modify: `client/src/components/PaymentSummary.tsx`

- [ ] **Step 1: Add imports**

  ```typescript
  import { MonoAmount } from '@ds-foundation/react';
  import { formatAmount } from '@/lib/formatAmount';
  ```

- [ ] **Step 2: Find all uses of the inline `fmt()` function for financial figures**

  The `fmt` function is defined inline: `const fmt = (n: number) => n.toLocaleString(...)`. Find every place it's called to render currency amounts and replace with `MonoAmount`:

  ```tsx
  // Before: {fmt(row.amount)}
  // After:  <MonoAmount>{formatAmount(row.amount)}</MonoAmount>
  ```

  > The `fmt` function is also used for `count` (number of transactions) — do NOT replace count formatting with MonoAmount. Only replace monetary amount rendering.

- [ ] **Step 3: After all amount renders are swapped, remove the inline `fmt` function**

  ```typescript
  // Remove this line:
  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  ```

- [ ] **Step 4: Run TypeScript check**

  ```bash
  npm run check
  ```

---

### Task 14: PR 3 verification

- [ ] **Step 1: TypeScript check**

  ```bash
  npm run check
  ```

  Expected: zero errors.

- [ ] **Step 2: Visual check in dev server**

  - Transaction table: amounts display in monospace font with correct formatting
  - Currency codes appear as `CurrencyBadge` — should look the same or better than before
  - Failed/Approved/Void status chips render via `StatusPill` — visually same as current (both use DS feedback tokens now)
  - Fraud badges (HIGH/MED/LOW) render via `UrgencyBadge`
  - Risk score urgency dot renders via `StatusRing`

- [ ] **Step 3: Check for stale node_modules cache if DS components render blank**

  ```bash
  rm -rf node_modules/.vite
  npm run dev
  ```

- [ ] **Step 4: Commit**

  ```bash
  git add client/src/lib/formatAmount.ts client/src/components/shared/Badge.tsx client/src/components/results-table/TransactionRow.tsx client/src/components/PaymentSummary.tsx
  git commit -m "feat(components): consume @ds-foundation/react atoms

  Swaps StatusPill (failed/complete/cancelled), UrgencyBadge (fraud
  levels), StatusRing (urgency dot), MonoAmount, and CurrencyBadge
  from @ds-foundation/react. Adds formatAmount utility.

  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
  ```

---

## ══════════════════════════════════════════
## PR 4 — Atomic Reorg
## ══════════════════════════════════════════

> **Scope:** All component file moves + import path updates + DS contract annotations + NEW_COMPONENTS.md.
> TypeScript is the authoritative test — zero TS errors means all import paths resolved.

---

### Task 15: Create atomic folder structure

**Files:**
- Create: directory structure under `client/src/components/`

- [ ] **Step 1: Create all new directories**

  ```bash
  mkdir -p client/src/components/atoms
  mkdir -p client/src/components/molecules/fraud-spotlight
  mkdir -p client/src/components/organisms/results-table
  mkdir -p client/src/components/templates/export
  mkdir -p client/src/components/templates/home
  mkdir -p client/src/components/templates/research
  mkdir -p client/src/components/templates/specs
  mkdir -p client/src/components/navigation
  ```

---

### Task 16: Move atoms

**Files:** `shared/Badge.tsx`, `shared/DetailCard.tsx`, `shared/IconButton.tsx`, `SectionHeader.tsx`, `Skeleton.tsx`, `StatusChip.tsx`

- [ ] **Step 1: Move files**

  ```bash
  cd client/src/components
  mv shared/Badge.tsx atoms/Badge.tsx
  mv shared/DetailCard.tsx atoms/DetailCard.tsx
  mv shared/IconButton.tsx atoms/IconButton.tsx
  mv SectionHeader.tsx atoms/SectionHeader.tsx
  mv Skeleton.tsx atoms/Skeleton.tsx
  mv StatusChip.tsx atoms/StatusChip.tsx
  ```

  > If `shared/` is now empty (or only has an index file), delete the directory after moving.

- [ ] **Step 2: Add DS contract annotation to each moved file**

  Add the appropriate comment on the line immediately below the last `import` statement in each file:

  ```typescript
  // @ds-candidate — generic primitive, Phase 3 contribution candidate
  ```
  → `Badge.tsx`, `DetailCard.tsx`, `IconButton.tsx`

  ```typescript
  // @tsw-atom — TSW-specific atom, stays local
  ```
  → `SectionHeader.tsx`, `Skeleton.tsx`, `StatusChip.tsx`

- [ ] **Step 3: Run TypeScript check to see all broken imports**

  ```bash
  npm run check 2>&1 | head -50
  ```

  This will list every file that imports from the old paths. Fix them all in the next step.

- [ ] **Step 4: Update all import paths for moved atoms**

  ```bash
  # Find all imports of the moved files
  rg "from \"@/components/shared/(Badge|DetailCard|IconButton)\"" client/src/ --files-with-matches
  rg "from \"@/components/(SectionHeader|Skeleton|StatusChip)\"" client/src/ --files-with-matches
  ```

  For each file in the output, update the import path:
  - `@/components/shared/Badge` → `@/components/atoms/Badge`
  - `@/components/shared/DetailCard` → `@/components/atoms/DetailCard`
  - `@/components/shared/IconButton` → `@/components/atoms/IconButton`
  - `@/components/SectionHeader` → `@/components/atoms/SectionHeader`
  - `@/components/Skeleton` → `@/components/atoms/Skeleton`
  - `@/components/StatusChip` → `@/components/atoms/StatusChip`

- [ ] **Step 5: TypeScript check — must be clean before next task**

  ```bash
  npm run check
  ```

---

### Task 17: Move molecules

**Files:** `FraudBadge.tsx`, `ProcessFlow.tsx`, `PaymentSummary.tsx`, `PaymentSummarySkeleton.tsx`, `fraud-spotlight/` (5 files)

- [ ] **Step 1: Move files**

  ```bash
  cd client/src/components
  mv FraudBadge.tsx molecules/FraudBadge.tsx
  mv ProcessFlow.tsx molecules/ProcessFlow.tsx
  mv PaymentSummary.tsx molecules/PaymentSummary.tsx
  mv PaymentSummarySkeleton.tsx molecules/PaymentSummarySkeleton.tsx
  mv fraud-spotlight/FlaggedItemDetail.tsx molecules/fraud-spotlight/FlaggedItemDetail.tsx
  mv fraud-spotlight/FlaggedItemRow.tsx molecules/fraud-spotlight/FlaggedItemRow.tsx
  mv fraud-spotlight/OverrideDialog.tsx molecules/fraud-spotlight/OverrideDialog.tsx
  mv fraud-spotlight/RiskScoreBadge.tsx molecules/fraud-spotlight/RiskScoreBadge.tsx
  mv fraud-spotlight/VerificationActions.tsx molecules/fraud-spotlight/VerificationActions.tsx
  rmdir fraud-spotlight  # if now empty
  ```

- [ ] **Step 2: Add DS contract annotations**

  Add to each file (below last import):
  ```typescript
  // @ds-molecule — composed from DS atoms + TSW domain logic
  ```

- [ ] **Step 3: Update all import paths**

  ```bash
  rg "from \"@/components/(FraudBadge|ProcessFlow|PaymentSummary|PaymentSummarySkeleton)\"" client/src/ --files-with-matches
  rg "from \"@/components/fraud-spotlight/" client/src/ --files-with-matches
  ```

  Update each:
  - `@/components/FraudBadge` → `@/components/molecules/FraudBadge`
  - `@/components/ProcessFlow` → `@/components/molecules/ProcessFlow`
  - `@/components/PaymentSummary` → `@/components/molecules/PaymentSummary`
  - `@/components/PaymentSummarySkeleton` → `@/components/molecules/PaymentSummarySkeleton`
  - `@/components/fraud-spotlight/X` → `@/components/molecules/fraud-spotlight/X`

- [ ] **Step 4: TypeScript check**

  ```bash
  npm run check
  ```

---

### Task 18: Move organisms

**Files:** `FilterPanel.tsx`, `FraudGateModal.tsx`, `FraudSpotlight.tsx`, `HoldModal.tsx`, `ApproveConfirmModal.tsx`, `RejectModal.tsx`, `ResultsTable.tsx`, `ResultsTableSkeleton.tsx`, `results-table/` (7 files)

- [ ] **Step 1: Move files**

  ```bash
  cd client/src/components
  mv FilterPanel.tsx organisms/FilterPanel.tsx
  mv FraudGateModal.tsx organisms/FraudGateModal.tsx
  mv FraudSpotlight.tsx organisms/FraudSpotlight.tsx
  mv HoldModal.tsx organisms/HoldModal.tsx
  mv ApproveConfirmModal.tsx organisms/ApproveConfirmModal.tsx
  mv RejectModal.tsx organisms/RejectModal.tsx
  mv ResultsTable.tsx organisms/ResultsTable.tsx
  mv ResultsTableSkeleton.tsx organisms/ResultsTableSkeleton.tsx
  mv results-table/AttachmentViewer.tsx organisms/results-table/AttachmentViewer.tsx
  mv results-table/ColumnPicker.tsx organisms/results-table/ColumnPicker.tsx
  mv results-table/PaymentRailDialog.tsx organisms/results-table/PaymentRailDialog.tsx
  mv results-table/TablePagination.tsx organisms/results-table/TablePagination.tsx
  mv results-table/TableToolbar.tsx organisms/results-table/TableToolbar.tsx
  mv results-table/TransactionCard.tsx organisms/results-table/TransactionCard.tsx
  mv results-table/TransactionRow.tsx organisms/results-table/TransactionRow.tsx
  rmdir results-table  # if now empty
  ```

- [ ] **Step 2: Add DS contract annotations**

  ```typescript
  // @tsw-organism — TSW-specific feature section, stays local
  ```

- [ ] **Step 3: Update all import paths**

  ```bash
  rg "from \"@/components/(FilterPanel|FraudGateModal|FraudSpotlight|HoldModal|ApproveConfirmModal|RejectModal|ResultsTable|ResultsTableSkeleton)\"" client/src/ --files-with-matches
  rg "from \"@/components/results-table/" client/src/ --files-with-matches
  ```

  Update each path prefix:
  - `@/components/FilterPanel` → `@/components/organisms/FilterPanel`
  - `@/components/FraudGateModal` → `@/components/organisms/FraudGateModal`
  - etc.
  - `@/components/results-table/X` → `@/components/organisms/results-table/X`

- [ ] **Step 4: TypeScript check**

  ```bash
  npm run check
  ```

---

### Task 19: Move templates and navigation

**Files:** `export/`, `home/`, `research/`, `specs/` folders → `templates/`. `AppNav.tsx`, `Navigation.tsx`, `UnifiedNav.tsx` → `navigation/`. `CompetitorCard.tsx` → `templates/home/` (prototype-specific). `ConfigurePrototypeModal.tsx` → `organisms/`. `ErrorBoundary.tsx` → `atoms/`.

- [ ] **Step 1: Confirm which template folders exist in components/**

  ```bash
  ls client/src/components/
  ```

  Note which of `export/`, `home/`, `research/`, `specs/` are present. Only move the ones that exist. (Some may be in `pages/` already — do not move those.)

- [ ] **Step 2: Move each existing template folder explicitly**

  For each folder confirmed in Step 1, run the move individually:

  ```bash
  # Example — only run the lines that match folders confirmed in Step 1:
  mv client/src/components/export/* client/src/components/templates/export/
  mv client/src/components/home/* client/src/components/templates/home/
  mv client/src/components/research/* client/src/components/templates/research/
  mv client/src/components/specs/* client/src/components/templates/specs/
  # Then remove the now-empty source directories:
  rmdir client/src/components/export client/src/components/home client/src/components/research client/src/components/specs 2>/dev/null
  ```

  If `mv` reports "no such file or directory", that folder doesn't exist — this is expected and fine.

- [ ] **Step 3: Move remaining root-level components**

  ```bash
  cd client/src/components
  mv AppNav.tsx navigation/AppNav.tsx
  mv Navigation.tsx navigation/Navigation.tsx
  mv UnifiedNav.tsx navigation/UnifiedNav.tsx
  mv CompetitorCard.tsx templates/CompetitorCard.tsx
  mv ConfigurePrototypeModal.tsx organisms/ConfigurePrototypeModal.tsx
  mv ErrorBoundary.tsx atoms/ErrorBoundary.tsx
  ```

- [ ] **Step 4: Add DS contract annotations**

  - Navigation files: `// @tsw-organism — product nav, stays local`
  - Template files: `// @tsw-template — prototype page layout`
  - `ErrorBoundary.tsx`: `// @tsw-atom — infrastructure atom, stays local`
  - `CompetitorCard.tsx`: `// @tsw-template — prototype-specific component`

- [ ] **Step 5: Update all import paths**

  ```bash
  rg "from \"@/components/(AppNav|Navigation|UnifiedNav|CompetitorCard|ConfigurePrototypeModal|ErrorBoundary)\"" client/src/ --files-with-matches
  ```

  Update each path.

- [ ] **Step 6: TypeScript check**

  ```bash
  npm run check
  ```

  **Zero errors = all import paths resolved = PR 4 core work complete.**

---

### Task 20: Create `NEW_COMPONENTS.md`

**Files:**
- Create: `client/src/components/NEW_COMPONENTS.md`

- [ ] **Step 1: Create the file**

  ```markdown
  # Adding New Components to TSW

  ## Decision tree

  Before writing a new component, ask:

  1. **Does this already exist in `@ds-foundation/react`?**
     → Import and use it directly. No new file needed.

  2. **Is this a generic primitive with no TSW-specific domain logic?**
     → Add to `atoms/`. Mark with `// @ds-candidate`.
     → Open a contribution PR to `ds-foundation-rt` (see below).

  3. **Is this composed from atoms + TSW domain logic (e.g. a payment-specific widget)?**
     → Add to `molecules/`. Mark with `// @ds-molecule`.

  4. **Is this a full feature section (table, modal, panel)?**
     → Add to `organisms/`. Mark with `// @tsw-organism`.

  5. **Is this a page layout or prototype-specific view?**
     → Add to `templates/`. Mark with `// @tsw-template`.

  ## DS contract annotation reference

  | Annotation | Meaning |
  |------------|---------|
  | `// @ds-candidate` | Generic, no TSW domain logic — contribute to DS Foundation |
  | `// @tsw-atom` | TSW-specific primitive — stays local |
  | `// @ds-molecule` | Composed from DS atoms + TSW domain logic |
  | `// @tsw-organism` | TSW-specific feature section — stays local |
  | `// @tsw-template` | Prototype page layout — stays local |

  ## Contributing to DS Foundation

  1. Create a branch in `ds-foundation-rt`
  2. Add the component file to `packages/react/src/`
  3. Add a MDX registry spec to `packages/registry/`
  4. Add a Storybook story to `packages/storybook/`
  5. Run `npm run validate` — must pass typecheck + registry build
  6. Run `npx changeset` to add a changelog entry
  7. Open a PR

  ## Candidates for Phase 3 contribution

  - `atoms/IconButton.tsx` — generic, no domain logic
  - `atoms/DetailCard.tsx` — generic info card pattern
  - `atoms/Badge.tsx` — generic badge, TSW-specific state map only
  ```

---

### Task 21: PR 4 verification and commit

- [ ] **Step 1: TypeScript check — authoritative path validation**

  ```bash
  npm run check
  ```

  Expected: **zero errors**. The TS compiler catches every broken import path.

- [ ] **Step 2: Run dev server — check every route**

  ```bash
  npm run dev
  ```

  Visit each route and confirm it loads without console errors:
  - `/` or `/home` — Home page
  - `/prototype` or `/payments` — Main payments prototype (transactions visible)
  - Expand a transaction row
  - Open Approve modal
  - Open Reject modal
  - Open Hold modal
  - Open FraudGate modal
  - Fraud spotlight section visible and interactive
  - `/research` — Research page
  - `/specs` — Specs page
  - `/export` — Export page

- [ ] **Step 3: Confirm folder structure**

  ```bash
  ls client/src/components/
  ```

  Should show only: `atoms/  molecules/  organisms/  templates/  navigation/  ui/  shared/  NEW_COMPONENTS.md`

  (The `ui/` and `shared/` folders remain for shadcn/ui base components; `shared/` may be empty if all files moved to `atoms/`.)

- [ ] **Step 4: Spot-check 5 annotations**

  Pick 5 component files at random and confirm the annotation comment is present below imports.

- [ ] **Step 5: Commit**

  ```bash
  git add client/src/components/
  git commit -m "refactor(components): atomic design reorg + DS contract annotations

  Reorganises 63 components into atoms/molecules/organisms/templates/
  navigation. Every file annotated with @ds-candidate/@tsw-atom/
  @ds-molecule/@tsw-organism/@tsw-template. Adds NEW_COMPONENTS.md
  with decision tree and DS contribution guide.

  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
  ```

---

## Final Acceptance Check

After all 4 PRs are merged and verified:

- [ ] `npm run check` — zero errors
- [ ] `npm run dev` — zero console errors on all routes
- [ ] `rg "text-(teal|rose|emerald|amber|sky|indigo|violet|purple|orange)-" client/src/` — zero results
- [ ] `rg "#[0-9a-fA-F]{3,6}" client/src/components/ client/src/lib/design-tokens.ts` — zero results
- [ ] `ls client/src/components/` shows atomic structure
- [ ] `NEW_COMPONENTS.md` exists and is accurate
- [ ] Every component file has a DS contract annotation
- [ ] Visual: pixel-identical to Phase 1 baseline (intentional change: teal interactive → blue, High+Med risk = same warning colour)
