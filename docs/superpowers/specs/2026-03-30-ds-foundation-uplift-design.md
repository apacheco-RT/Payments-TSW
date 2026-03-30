# DS-Foundation Uplift — Design Spec
**Date:** 2026-03-30
**Author:** Alex Pacheco + Claude
**Status:** Approved — ready for implementation planning

---

## Overview

Uplift Payments-TSW to consume `@ds-foundation/tokens` and reorganize components into a strict atomic design structure. Scope is consume-only — no components are contributed back to the DS-foundation registry on these branches. New or unmatched components are documented in `NEW_COMPONENTS.md` for a future DS contribution branch requiring team review.

---

## Decisions Made

| Decision | Choice | Rationale |
|---|---|---|
| Tailwind version | Upgrade to v4 | DS-foundation ships a v4 `@theme` block; running v3 alongside creates two parallel token systems with no single source of truth |
| Token strategy | Consume `@ds-foundation/tokens` only | No registry contributions yet — those go through a separate design review branch with teammates |
| Atomic structure | Option B: atomic layers + domain subfolders | `organisms/results-table/ResultsTable.tsx` — preserves existing mental model inside the atomic hierarchy |
| New components | Staged to `NEW_COMPONENTS.md` | Any component or token with no DS-foundation equivalent is documented for team review before registry contribution |
| Execution approach | Two-phase branches | Phase 1 (token swap) and Phase 2 (atomic reorg) are independent PRs with distinct, verifiable success criteria |

---

## Approach: Two-Phase Branches

Phase 1 and Phase 2 are separate branches and PRs. Phase 2 cuts from Phase 1 after merge. Each phase has a singular purpose and isolated failure modes.

---

## Phase 1: Token Foundation

**Branch:** `feat/ds-token-uplift`
**Goal:** Swap all custom tokens for `@ds-foundation/tokens`. Visual output identical to `main`. No structural changes.

### Steps

1. **shadcn/ui + Radix Compatibility Audit** *(gate)*
   - Verify all pinned shadcn/ui and Radix UI packages are Tailwind v4 compatible before any code changes.
   - Document blockers. If a blocker is unresolvable, the plan adjusts before work starts.

2. **Tailwind v3 → v4 Upgrade**
   - Upgrade `tailwindcss` to v4.
   - Replace `tailwind.config.ts` with CSS-first `@import "tailwindcss"`.
   - Migrate `postcss.config.js`.
   - Run the official Tailwind v4 codemod for utility class renames.
   - Fix any breakage surfaced by the codemod.

3. **Install `@ds-foundation/tokens`**
   - Add package from GitHub Packages (`@ds-foundation` scope, registry: `npm.pkg.github.com`).
   - Add `.npmrc` with scoped registry config.
   - Import in `index.css`:
     ```css
     @import "@ds-foundation/tokens/css";
     @import "@ds-foundation/tokens/tailwind";
     ```

4. **Token Mapping Table**
   - Produce a full old → new mapping table covering all tokens in `design-tokens.ts` and `index.css`.
   - Categories: surface colors, brand colors, risk levels, process stages, typography, spacing, radius, shadow, z-index.
   - Flag any TSW-specific tokens with no DS-foundation equivalent → `NEW_COMPONENTS.md`.

5. **Swap Tokens Across All Components**
   - Replace all hardcoded hex values, custom CSS vars, and Tailwind config references with DS-foundation tokens.
   - Update `design-tokens.ts` to re-export DS-foundation values as a thin wrapper (preserves existing imports).
   - Delete custom color/radius/shadow overrides from Tailwind config.

6. **Theme System: `next-themes` → `data-theme`**
   - Replace `next-themes` toggle with DS-foundation's `data-theme="dark"` attribute swap on `<html>`.
   - Update `use-theme.ts` hook.
   - DS-foundation tokens swap automatically — no manual CSS var overrides needed.

7. **Visual Verification**
   - Run dev server. Walk all 6 routes. Toggle light/dark.
   - Visual output must be identical to `main`. Document regressions.

### Success Criteria
- `npm run dev` renders all routes visually identically to `main`
- No hardcoded hex values remain in any component
- All tokens resolve to `var(--ds-*)`
- Light/dark toggle works via `data-theme` attribute
- Zero console errors

---

## Phase 2: Atomic Reorganization

**Branch:** `feat/ds-atomic-reorg`
**Cut from:** `feat/ds-token-uplift` after merge
**Goal:** Reorganize `/client/src/components/` into atomic design layers. No visual changes.

### Target Folder Structure

```
client/src/components/
├── atoms/
│   ├── ui/              ← shadcn primitives (Button, Input, Label, Textarea, Tooltip, Toast, Form)
│   └── shared/          ← Badge, IconButton
├── molecules/
│   ├── shared/          ← StatusChip, DetailCard, SectionHeader, FraudBadge, Skeleton
│   ├── results-table/   ← TransactionCard, TablePagination, ColumnPicker
│   └── fraud-spotlight/ ← RiskScoreBadge, FlaggedItemRow, VerificationActions
├── organisms/
│   ├── results-table/   ← ResultsTable, ResultsTableSkeleton, FilterPanel, TableToolbar,
│   │                       TransactionRow, PaymentRailDialog, AttachmentViewer
│   ├── fraud-spotlight/ ← FraudSpotlight, FlaggedItemDetail, OverrideDialog
│   ├── navigation/      ← AppNav, UnifiedNav, Navigation
│   ├── home/            ← HeroSection, ResearchSection, StrategySection, RoadmapSection,
│   │                       FeedbackSection, CompetitorCard
│   ├── research/        ← ResearchHeader, ResearchHeaderSkeleton, HeuristicTable,
│   │                       BacklogTable, PriorityList, RequirementsSection
│   ├── specs/           ← SpecsHeader, SpecsHeaderSkeleton, SpecCard
│   ├── export/          ← PrintBar, ExportBadges, CoverPage, SectionA–E
│   └── modals/          ← ApproveConfirmModal, FraudGateModal, RejectModal, HoldModal,
│                           ConfigurePrototypeModal
└── templates/
    ├── home/            ← page-level layout wrappers (non-page, non-route)
    └── export/          ← export layout wrappers
```

**Pages stay in `client/src/pages/`** — unchanged (Landing, Prototype, Home, ResearchReport, AnnotatedSpecs, ExportReport, not-found).

### Steps

1. **Component Audit + Atomic Layer Assignment**
   - Map all 60+ components to their atomic layer before moving any file.
   - Produce a complete assignment table.
   - Flag any component with no clear DS-foundation equivalent → `NEW_COMPONENTS.md`.

2. **Move Files Bottom-Up: Atoms → Molecules → Organisms → Templates**
   - Strict layer order. Each layer's moves are committed separately.
   - After each commit: update all import paths, run `npm run check`, confirm zero TypeScript errors before moving to the next layer.

3. **DS Contract Annotations**
   - Add header comment to each uplifted component:
     ```ts
     // @ds-component: button | @ds-adapter: tailwind | @ds-version: 0.2.0 | @ds-layer: atom
     ```

4. **`NEW_COMPONENTS.md`**
   - Create at repo root.
   - Document every component or token with no DS-foundation equivalent: name, atomic layer, description, proposed token usage, rationale.
   - Known candidates: `RiskScoreBadge`, `StatusChip`, `ProcessFlow`, risk/process-stage token system.
   - Format:
     ```markdown
     ## RiskScoreBadge · molecule
     Displays a numeric risk score with severity color coding (critical / high / medium / low / none).
     Tokens used: color.feedback.* · No DS-foundation equivalent. Proposed for DS registry.
     ```

5. **Barrel Exports**
   - Add `index.ts` at each atomic layer (`atoms/index.ts`, `molecules/index.ts`, etc.).
   - Clean up all page and organism import paths to use layer-level imports:
     ```ts
     import { Button, Badge } from '@/components/atoms'
     import { StatusChip, RiskScoreBadge } from '@/components/molecules'
     ```

6. **Final Verification**
   - `npm run check` — zero TypeScript errors.
   - `npm run dev` — all 6 routes render correctly, all feature flags work.
   - Confirm `NEW_COMPONENTS.md` is complete.

### Success Criteria
- Zero TypeScript errors
- All 6 routes and 5 feature flags work correctly
- Every component has a `@ds-layer` annotation
- `NEW_COMPONENTS.md` documents all unmatched components and tokens
- Barrel exports clean up all import paths
- No orphaned files in old component locations

---

## Out of Scope (These Branches)

- Contributing components to DS-foundation registry (separate design branch, requires team review)
- Server or shared schema changes
- New features or visual changes
- Storybook or documentation site

---

## Known Candidates for `NEW_COMPONENTS.md`

Components and tokens in TSW with no current DS-foundation equivalent:

| Name | Layer | Type | Notes |
|---|---|---|---|
| `RiskScoreBadge` | molecule | component | Risk score display with critical/high/medium/low/none states |
| `StatusChip` | molecule | component | Transaction status indicator |
| `ProcessFlow` | organism | component | Multi-stage payment process visualization |
| `FraudBadge` | molecule | component | Fraud risk indicator |
| Risk level tokens | — | tokens | `critical`, `high`, `medium`, `low`, `none` color system |
| Process stage tokens | — | tokens | `create`, `antifraud`, `approvals`, `status`, `history` colors |
| `PaymentSummary` | organism | component | Summary stats panel for payment transactions |

---

## Dependencies

- `@ds-foundation/tokens` v0.2.0 from GitHub Packages (`npm.pkg.github.com`, scope `@ds-foundation`)
- Tailwind CSS v4
- Read access to GitHub Packages (`read:packages` token required in `.npmrc`)
