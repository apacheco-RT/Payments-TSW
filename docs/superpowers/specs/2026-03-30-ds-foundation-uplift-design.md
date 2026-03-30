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
| Barrel export style | Flat per layer | Each layer (`atoms/`, `molecules/`, `organisms/`) has one `index.ts` that flat re-exports all components from domain subfolders. Avoids name collisions by using named exports; domain subfolder paths remain importable directly if needed |
| `@ds-component` for unmatched | `@ds-component: custom` | Components in `NEW_COMPONENTS.md` with no DS-foundation equivalent use `@ds-component: custom` as a documented placeholder until the DS contribution branch is created |

---

## Approach: Two-Phase Branches

Phase 1 and Phase 2 are separate branches and PRs. **Phase 2 must not be cut until Phase 1 is merged to `main`.** If Phase 2 is started from `main` before Phase 1 merges, the atomic reorg will operate on the old token system. This is a hard dependency.

---

## Phase 1: Token Foundation

**Branch:** `feat/ds-token-uplift`
**Goal:** Swap all custom tokens for `@ds-foundation/tokens`. Visual output identical to `main`. No structural changes.

### Steps

1. **shadcn/ui + Radix Compatibility Audit** *(gate — do not proceed until complete)*
   - Verify all pinned shadcn/ui and Radix UI packages are Tailwind v4 compatible.
   - Document any blockers. If a blocker is unresolvable, the plan adjusts before any code changes.

2. **Verify `@ds-foundation/tokens` Export Paths**
   - Before writing any import, install the package and inspect its `exports` map:
     ```bash
     # After npm install, read the exports map directly
     cat node_modules/@ds-foundation/tokens/package.json | jq '.exports'
     ```
   - Confirm the subpath exports that map to CSS vars and the Tailwind `@theme` block.
   - Known from DS-foundation v0.2.0 package.json: `"./css"` → CSS variables, `"./tailwind"` → `@theme` block, `"./css/dark"` → dark theme vars. Verify these match the installed version before hardcoding any import paths.

3. **Tailwind v3 → v4 Upgrade**
   - Upgrade `tailwindcss` to v4.
   - Replace `tailwind.config.ts` with CSS-first `@import "tailwindcss"`.
   - Migrate `postcss.config.js`.
   - Run the official Tailwind v4 upgrade codemod for utility class renames:
     ```bash
     npx @tailwindcss/upgrade
     ```
   - Fix any breakage surfaced by the codemod output.

4. **Install `@ds-foundation/tokens`**
   - Add package from GitHub Packages.
   - Add `.npmrc` to the project — **gitignored, never committed with token values**:
     ```
     @ds-foundation:registry=https://npm.pkg.github.com
     //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
     ```
   - For local dev: set `NODE_AUTH_TOKEN` in shell env (personal access token with `read:packages`).
   - For CI: add `NODE_AUTH_TOKEN` as a GitHub Actions secret.
   - Add `.npmrc` to `.gitignore`. Document setup in `README.md` under a "Local Setup" section.
   - Import in `index.css` (using confirmed export paths from Step 2):
     ```css
     @import "@ds-foundation/tokens/css";
     @import "@ds-foundation/tokens/tailwind";
     ```

5. **Token Mapping Table**
   - Produce a full old → new mapping table covering all tokens in `design-tokens.ts` and `index.css`.
   - Categories: surface colors, brand colors, risk levels, process stages, typography, spacing, radius, shadow, z-index.
   - Flag any TSW-specific tokens with no DS-foundation equivalent → `NEW_COMPONENTS.md`.

6. **Swap Tokens Across All Components**
   - Replace all hardcoded hex values, custom CSS vars, and Tailwind config references with DS-foundation tokens.
   - Update `design-tokens.ts` to re-export DS-foundation values as a thin wrapper (preserves existing imports without breaking consumers).
   - Delete custom color/radius/shadow overrides from Tailwind config.

7. **Theme System: `next-themes` → `data-theme`** *(scoped sub-task — higher risk than other steps)*
   - This is a library removal, not just a token swap. It changes the application's theme management contract.
   - Audit all files that import from `next-themes` before touching anything.
   - Replace the `next-themes` provider and toggle with a custom `data-theme="dark"` attribute swap on `<html>`.
   - Update `use-theme.ts` hook to set/remove the `data-theme` attribute and persist to `localStorage`.
   - DS-foundation tokens swap automatically via the `data-theme` attribute — no manual CSS var overrides needed.
   - Rollback boundary: if this sub-task causes regressions, it can be reverted independently without unwinding the rest of Phase 1.
   - Remove `next-themes` from `package.json` only after the toggle is verified working.

8. **Visual Verification**
   - Run dev server (`npm run dev`).
   - Walk all 6 routes: `/`, `/research`, `/specs`, `/prototype`, `/strategy`, `/export`.
   - Enable all 5 feature flags via URL params and verify flagged UI.
   - Toggle light/dark on each route.
   - Verification method: side-by-side screenshot comparison between `main` and the branch at defined breakpoints (1440px desktop, 768px tablet, 375px mobile). Check: surface colors, text colors, border colors, spacing, radius, shadows. Any visual delta is a regression — document and fix before PR.

### Success Criteria
- `npm run dev` renders all routes visually identically to `main` at 1440 / 768 / 375px
- No hardcoded hex values remain in any component file
- All tokens resolve to `var(--ds-*)`
- Light/dark toggle works via `data-theme` attribute on `<html>`
- `.npmrc` is gitignored; `README.md` documents `NODE_AUTH_TOKEN` setup
- Zero console errors on all routes

---

## Phase 2: Atomic Reorganization

**Branch:** `feat/ds-atomic-reorg`
**Cut from:** `feat/ds-token-uplift` — **only after that branch is merged to `main`**

> **Prerequisite gate:** Before cutting this branch, confirm `feat/ds-token-uplift` is merged: `git log main --oneline | grep ds-token-uplift`. Do not start Phase 2 from `main` before Phase 1 merges.

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
   - Strict layer order. Each layer produces two commits: one for the file moves, one for all import path updates across the codebase that reference those moved files.
   - After the import-path commit: run `npm run check`, confirm zero TypeScript errors before moving to the next layer.

3. **DS Contract Annotations**
   - Add header comment to each uplifted component:
     ```ts
     // @ds-component: button | @ds-adapter: tailwind | @ds-version: 0.2.0 | @ds-layer: atom
     ```
   - For components with no DS-foundation equivalent (NEW_COMPONENTS candidates):
     ```ts
     // @ds-component: custom | @ds-adapter: tailwind | @ds-version: 0.2.0 | @ds-layer: molecule
     ```

4. **`NEW_COMPONENTS.md`**
   - Create at repo root.
   - Document every component or token with no DS-foundation equivalent: name, atomic layer, description, proposed token usage, rationale.
   - Format:
     ```markdown
     ## RiskScoreBadge · molecule
     Displays a numeric risk score with severity color coding (critical / high / medium / low / none).
     Tokens used: color.feedback.* · No DS-foundation equivalent. Proposed for DS registry.
     ```

5. **Barrel Exports (flat per layer)**
   - Add one `index.ts` at each atomic layer that flat re-exports all components from domain subfolders.
   - Named exports only — no default re-exports. If two subfolders export a component with the same name, use aliased re-exports to avoid collisions.
   - Example: `atoms/index.ts` re-exports `Button`, `Input`, `Label` from `./ui` and `Badge`, `IconButton` from `./shared`.
   - Update all page and organism import paths to use layer-level imports:
     ```ts
     import { Button, Badge } from '@/components/atoms'
     import { StatusChip, RiskScoreBadge } from '@/components/molecules'
     ```
   - Domain subfolder imports remain valid for internal cross-references within a layer.

6. **Final Verification**
   - `npm run check` — zero TypeScript errors.
   - `npm run dev` — all 6 routes render correctly, all 5 feature flags work.
   - Confirm every component has a `@ds-layer` annotation.
   - Confirm `NEW_COMPONENTS.md` is complete and covers all candidates.
   - Confirm no orphaned files remain in old component locations.

### Success Criteria
- Zero TypeScript errors (`npm run check`)
- All 6 routes and 5 feature flags work correctly
- Every component has `@ds-component` and `@ds-layer` annotations
- `NEW_COMPONENTS.md` documents all unmatched components and tokens
- Flat barrel exports at each atomic layer; all page/organism imports use layer-level paths
- No orphaned files in old `components/` locations

---

## Out of Scope (These Branches)

- Contributing components to DS-foundation registry (separate design branch, requires team review)
- Server or shared schema changes
- New features or visual changes
- Storybook or documentation site
- Upgrading any dependency other than `tailwindcss` and packages required by the v4 migration

---

## Known Candidates for `NEW_COMPONENTS.md`

Components and tokens in TSW with no current DS-foundation equivalent:

| Name | Layer | Type | Notes |
|---|---|---|---|
| `RiskScoreBadge` | molecule | component | Risk score display with critical/high/medium/low/none states |
| `StatusChip` | molecule | component | Transaction status indicator |
| `ProcessFlow` | organism | component | Multi-stage payment process visualization |
| `FraudBadge` | molecule | component | Fraud risk indicator |
| `PaymentSummary` | organism | component | Summary stats panel for payment transactions |
| `FraudGateModal` | organism | component | Domain-specific fraud check gate dialog |
| `OverrideDialog` | organism | component | Domain-specific fraud override dialog |
| `ApproveConfirmModal` | organism | component | Domain-specific approval confirmation |
| `RejectModal` | organism | component | Domain-specific rejection dialog |
| `HoldModal` | organism | component | Domain-specific hold transaction dialog |
| Risk level tokens | — | tokens | `critical`, `high`, `medium`, `low`, `none` color system |
| Process stage tokens | — | tokens | `create`, `antifraud`, `approvals`, `status`, `history` colors |

---

## Dependencies & Environment Setup

- `@ds-foundation/tokens` v0.2.0 from GitHub Packages
- Tailwind CSS v4
- `.npmrc` must be **gitignored** and use `${NODE_AUTH_TOKEN}` env var (not a hardcoded token)
- Local dev: set `NODE_AUTH_TOKEN` in shell env (personal access token with `read:packages` scope)
- CI: add `NODE_AUTH_TOKEN` as a GitHub Actions secret
- Document setup procedure in `README.md` before merging Phase 1
