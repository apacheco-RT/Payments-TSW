# TSW Phase 3 — DS Foundation Atom Contribution Design

## Goal

Contribute three components from TSW to `ds-foundation-rt`, cut a new `@ds-foundation/react` patch release, and update TSW to consume them from the package instead of local files.

## Scope

**ds-foundation-rt contributions (3 PRs):**
1. `DetailCard` — direct style conversion, no API change
2. `IconButton` — genericized variant system, style conversion
3. `StateBadge` — new component designed for DS Foundation (does not exist yet in TSW)

**TSW migration (1 PR):**
- Bump `@ds-foundation/react` to new version
- Delete `atoms/DetailCard.tsx`, `atoms/IconButton.tsx`
- Update `atoms/Badge.tsx` status variant to use `<StateBadge>`
- Add `getTxStatusIntent()` helper in `design-tokens.ts`
- Update all import paths

**Out of scope:**
- `atoms/Badge.tsx` stays local — it is a TSW domain molecule, not a generic primitive
- No changes to `atoms/StatusChip.tsx` or other TSW-specific atoms
- No ds-foundation-rt registry rebuild or CI pipeline changes beyond what each contribution PR triggers

---

## Architecture

### Two-repo structure

```
ds-foundation-rt/
└── packages/
    ├── react/src/
    │   ├── DetailCard.tsx       ← new
    │   ├── IconButton.tsx       ← new
    │   ├── StateBadge.tsx       ← new
    │   └── index.ts             ← updated barrel export
    ├── registry/components/
    │   ├── detail-card.mdx      ← new
    │   ├── icon-button.mdx      ← new
    │   └── state-badge.mdx      ← new
    └── storybook/src/
        ├── DetailCard.stories.tsx  ← new
        ├── IconButton.stories.tsx  ← new
        └── StateBadge.stories.tsx  ← new

payments-tsw-phase1/
└── client/src/
    ├── components/atoms/
    │   ├── DetailCard.tsx       ← deleted
    │   ├── IconButton.tsx       ← deleted (shim added to consumers)
    │   └── Badge.tsx            ← StatusBadgeContent replaced with <StateBadge>
    └── lib/design-tokens.ts     ← getTxStatusIntent() added
```

### Contribution model

Each DS PR follows the pattern documented in `NEW_COMPONENTS.md`:
1. Add component to `packages/react/src/`
2. Add MDX registry spec to `packages/registry/components/`
3. Add Storybook story to `packages/storybook/src/`
4. Add barrel export to `packages/react/src/index.ts`
5. Run `npm run validate` (typecheck + registry build)
6. Run `npx changeset` (patch bump)
7. Open PR

---

## Component Specifications

### 1. DetailCard

**File:** `packages/react/src/DetailCard.tsx`

**Props:**
```typescript
export interface DetailCardProps {
  title: string;
  children: React.ReactNode;
}
```

**Rendering:**
- Container `<div>` with `--ds-color-surface-default` background, `--ds-color-border-default` border, `--ds-radius-lg` corners
- `<h4>` title: uppercase, `--ds-font-weight-medium`, `--ds-color-brand-primary` colour, `--ds-font-tracking-wide` letter spacing, bottom border in `--ds-color-border-default`
- Children rendered in the card body below the title

**Styling:** Inline `style` objects only — no Tailwind, no `className` prop (matches ds-foundation convention).

**Accessibility:**
- `<h4>` provides semantic heading structure
- No ARIA roles required (pure presentational container)

**TSW migration:** Delete `atoms/DetailCard.tsx`. Update all imports:
```
@/components/atoms/DetailCard → @ds-foundation/react
```
No call-site prop changes needed — API is identical.

---

### 2. IconButton

**File:** `packages/react/src/IconButton.tsx`

**Props:**
```typescript
export type IconButtonVariant = 'primary' | 'success' | 'danger' | 'warning' | 'neutral';
export type IconButtonSize = 'sm' | 'md';

export interface IconButtonProps {
  variant?: IconButtonVariant;   // Default: 'neutral'
  size?: IconButtonSize;         // Default: 'md'
  icon: React.ReactNode;
  children?: React.ReactNode;    // Optional label text beside icon
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  'aria-label'?: string;         // Required when no children provided
}
```

**Variant → token mapping:**
| variant | text colour | hover background |
|---------|-------------|------------------|
| `primary` | `--ds-color-brand-primary` | `--ds-color-brand-primary-subtle` |
| `success` | `--ds-color-feedback-success-text` | `--ds-color-feedback-success-bg` |
| `danger` | `--ds-color-feedback-error-text` | `--ds-color-feedback-error-bg` |
| `warning` | `--ds-color-feedback-warning-text` | `--ds-color-feedback-warning-bg` |
| `neutral` | `--ds-color-text-secondary` | `--ds-color-surface-raised` |

**Size mapping:**
| size | padding | min dimension |
|------|---------|---------------|
| `sm` | `4px` | `24px × 24px` |
| `md` | `6px` | `28px × 28px` |

**Rendering:**
- `<button>` element, `flex` row with `icon` and optional `children` side by side
- `--ds-radius-xs` border radius
- Focus ring: `2px solid --ds-color-brand-primary`, `2px offset`
- Disabled: `opacity: 0.4`, `cursor: not-allowed`
- Inline styles only

**Accessibility:**
- `aria-label` required when `children` is not provided (icon-only button)
- `disabled` attribute set from prop

**TSW migration:**
1. Delete `atoms/IconButton.tsx`
2. Update imports: `@/components/atoms/IconButton → @ds-foundation/react`
3. Add TSW variant shim where old domain variant names are used:

```typescript
// In TSW: client/src/lib/iconButtonVariants.ts
const TSW_VARIANT_MAP = {
  view:      'primary',
  confirm:   'success',
  complete:  'success',
  reextract: 'warning',
  fail:      'danger',
  default:   'neutral',
} as const;

export type TswIconButtonVariant = keyof typeof TSW_VARIANT_MAP;
export const toIconButtonVariant = (v: TswIconButtonVariant) => TSW_VARIANT_MAP[v];
```

Call sites that pass TSW-specific variant names use `toIconButtonVariant()`. No bulk find/replace needed across all usage sites.

---

### 3. StateBadge

**File:** `packages/react/src/StateBadge.tsx`

A new component — does not exist in TSW today. Designed as the right DS primitive for displaying workflow lifecycle states, with an optional next-state indicator.

**Props:**
```typescript
export type StateBadgeIntent = 'info' | 'warning' | 'success' | 'error' | 'neutral';
export type StateBadgeSize = 'sm' | 'md';

export interface StateBadgeProps {
  state: string;                 // Current state display label
  intent: StateBadgeIntent;      // Drives colour from DS feedback tokens
  nextState?: string;            // Optional — renders "→ nextState" when provided
  size?: StateBadgeSize;         // Default: 'md'
}
```

**Intent → token mapping:**
| intent | background | border | text |
|--------|-----------|--------|------|
| `info` | `--ds-color-feedback-info-bg` | `--ds-color-feedback-info-border` | `--ds-color-feedback-info-text` |
| `warning` | `--ds-color-feedback-warning-bg` | `--ds-color-feedback-warning-border` | `--ds-color-feedback-warning-text` |
| `success` | `--ds-color-feedback-success-bg` | `--ds-color-feedback-success-border` | `--ds-color-feedback-success-text` |
| `error` | `--ds-color-feedback-error-bg` | `--ds-color-feedback-error-border` | `--ds-color-feedback-error-text` |
| `neutral` | `--ds-color-surface-sunken` | `--ds-color-border-default` | `--ds-color-text-secondary` |

**Rendering:**
- Pill-shaped container: `--ds-radius-lg`, `1px solid` border from intent
- `state` label: uppercase, `--ds-font-weight-medium`, `xs` font size
- When `nextState` provided: `state` + `→` separator (in `--ds-color-text-tertiary`) + `nextState`
- `→` separator uses `--ds-color-text-tertiary` (subdued, not the intent colour) to visually distinguish current from next
- Inline styles only

**Size:**
| size | padding | font size |
|------|---------|-----------|
| `sm` | `2px 6px` | `--ds-font-size-xs` |
| `md` | `3px 8px` | `--ds-font-size-sm` |

**Accessibility:**
- `role="status"` on the container
- `aria-label` constructed as: `"Status: {state}"` or `"Status: {state}, next: {nextState}"` when nextState is provided

**TSW usage (Badge.tsx after migration):**
```tsx
import { StateBadge } from '@ds-foundation/react';

// StatusBadgeContent replaces custom colour logic with:
<StateBadge
  state={status}
  intent={getTxStatusIntent(status)}
  nextState={next}
/>
```

**TSW helper (design-tokens.ts):**
```typescript
import type { StateBadgeIntent } from '@ds-foundation/react';

export function getTxStatusIntent(status: string): StateBadgeIntent {
  switch (status) {
    case 'Pending':
    case 'On Hold':          return 'warning';
    case 'Processing':
    case 'Ready to Approve':
    case 'Escalated':        return 'info';
    case 'Approved':         return 'success';
    case 'Rejected':
    case 'Failed':           return 'error';
    case 'Cancelled':
    default:                 return 'neutral';
  }
}
```

---

## Delivery Sequence

### PR 1 — ds-foundation-rt: DetailCard
Lowest risk. Proves the contribution workflow end-to-end.
- `packages/react/src/DetailCard.tsx`
- `packages/registry/components/detail-card.mdx`
- `packages/storybook/src/DetailCard.stories.tsx`
- `packages/react/src/index.ts` barrel update
- `npx changeset` — patch

### PR 2 — ds-foundation-rt: IconButton
- `packages/react/src/IconButton.tsx`
- `packages/registry/components/icon-button.mdx`
- `packages/storybook/src/IconButton.stories.tsx`
- `packages/react/src/index.ts` barrel update
- `npx changeset` — patch

### PR 3 — ds-foundation-rt: StateBadge
New component, most review surface.
- `packages/react/src/StateBadge.tsx`
- `packages/registry/components/state-badge.mdx`
- `packages/storybook/src/StateBadge.stories.tsx`
- `packages/react/src/index.ts` barrel update
- `npx changeset` — patch

### PR 4 — TSW: package bump + local atom removal
After all three DS PRs are merged and a new `@ds-foundation/react` version is published:
- Bump `@ds-foundation/react` in `package.json`
- Delete `client/src/components/atoms/DetailCard.tsx`
- Delete `client/src/components/atoms/IconButton.tsx`
- Update all import paths (`@/components/atoms/DetailCard` → `@ds-foundation/react`, same for IconButton)
- Add `client/src/lib/iconButtonVariants.ts` (TSW variant shim)
- Update `client/src/components/atoms/Badge.tsx` — replace `StatusBadgeContent` with `<StateBadge>`
- Add `getTxStatusIntent()` to `client/src/lib/design-tokens.ts`
- `npm run check` — zero errors

---

## Acceptance Criteria

**Each DS PR:**
- `npm run validate` passes (typecheck + registry build)
- Component renders correctly in Storybook (all states, light + dark)
- Inline styles only — zero Tailwind classes
- WCAG 2.2 AA contrast verified for each intent/variant

**TSW migration PR:**
- `npm run check` — zero TypeScript errors
- Zero imports from `@/components/atoms/DetailCard` or `@/components/atoms/IconButton`
- `StatusBadgeContent` removed from `Badge.tsx`
- Visual regression: status badges in TSW look identical to pre-migration
