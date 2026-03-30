# RT-Payments — Transaction Status Workflow (TSW)

Interactive React prototype demonstrating a redesigned payment lifecycle interface for Ripple Treasury, built on `@ds-foundation/tokens`, Tailwind CSS v4, and Space Grotesk typography.

## Pages

| Route | Description |
|---|---|
| `/` | Hub — landing page with project overview and navigation |
| `/research` | UX Research Report — Nielsen's heuristic evaluation with 17 findings |
| `/specs` | Annotated Specs — 10 prioritized recommendations with design tokens |
| `/prototype` | Interactive Prototype — transaction approval workflow with filters, bulk actions, risk scoring |
| `/strategy` | Design Strategy — approach, principles, and roadmap |
| `/export` | Export Report — print-friendly summary of all findings |

## Tech Stack

- **Frontend**: React 18, Vite 7, Tailwind CSS v4, Framer Motion, Wouter, TanStack Query
- **Backend**: Express 5, Node.js, PostgreSQL 16 via Drizzle ORM
- **Validation**: Zod shared schemas
- **Design System**: `@ds-foundation/tokens` v0.2.2 — CSS vars + Tailwind `@theme` preset

## Local Setup

### 1. GitHub Packages Authentication

This project consumes `@ds-foundation/tokens` from GitHub Packages.

Create a `.npmrc` in the project root (gitignored — never commit it):

```
@ds-foundation:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Set the token in your shell before running `npm install`:

```bash
export NODE_AUTH_TOKEN=ghp_your_token_here   # PAT with read:packages scope
```

Create one at: https://github.com/settings/tokens?scopes=read:packages

### 2. Install and Run

```bash
npm install
npm run dev       # http://localhost:5000
npm run check     # TypeScript check
npm run build     # Production build
```

### CI

Add `NODE_AUTH_TOKEN` as a GitHub Actions secret. The `.npmrc` template uses `${NODE_AUTH_TOKEN}` and will pick it up automatically.

## Feature Flags

All prototype feature toggles default to OFF. Enable via URL params (`=1`):

| Flag | Description |
|---|---|
| `rlusdStrip` | RLUSD Eligible Strip |
| `stablecoinRail` | Stablecoin Payment Rail |
| `selectPaymentRail` | Select Payment Rail Button |
| `riskColumn` | Risk Column in transaction table |
| `fraudSpotlight` | Fraud Protection Spotlight banner |

Example: `/prototype?rlusdStrip=1&fraudSpotlight=1`

## Theming

Light/dark toggle sets `data-theme="light"` or `data-theme="dark"` on `<html>`. DS-foundation semantic tokens swap automatically. Default is dark.

## Project Structure

```
client/src/
  pages/          Route components
  components/
    shared/       Badge, IconButton, DetailCard
    research/     Research Report sub-components
    home/         Hub sub-components
    export/       Export Report sub-components
    specs/        Annotated Specs sub-components
    results-table/ Transaction table components
    ui/           shadcn/ui primitives
  hooks/          use-theme.ts, use-toast.ts
  lib/            design-tokens.ts (DS-foundation wrapper), utils, types, mock data
  data/           Shared report data
server/           Express backend
shared/           Shared TypeScript schemas
docs/superpowers/ Design specs, implementation plans, migration notes
```

## Design System Uplift

Branch `feat/ds-token-uplift` (PR #1) — Phase 1 complete:
- Tailwind CSS v3 → v4 upgrade
- `@ds-foundation/tokens@0.2.2` installed and wired
- All hardcoded hex values and `--m3-*`/`--surface-*` vars removed from components
- `design-tokens.ts` rewritten as thin DS-foundation re-export wrapper
- `next-themes` replaced with `data-theme` attribute toggle
- Token mapping: `docs/superpowers/migration-notes/token-mapping.md`

**Phase 2 (pending PR #1 merge):** Atomic folder reorganization — `feat/ds-atomic-reorg`
Plan: `docs/superpowers/plans/2026-03-30-phase2-ds-atomic-reorg.md`

## Database

Single table: `feedback` (id, name, email, message, isRead)

```bash
npm run db:push
```

## License

Proprietary — Ripple Treasury
