# PR 2 Visual Baseline — Before Colour Token Migration

**Captured**: 2026-04-01
**Project**: payments-tsw-phase1
**Purpose**: Document current UI colours before colour token migration (PR 2)

## Overview

This baseline captures the visual state of key UI components using Tailwind colour utilities. All colour classes listed here are the current implementation that will be replaced by design tokens in PR 2.

---

## 1. Status Badge Component (`client/src/components/shared/Badge.tsx`)

### Status States
Each status has a unique three-part colour scheme (background, border, text):

| Status | Background | Border | Text | Use Case |
|--------|-----------|--------|------|----------|
| Overdue | `bg-rose-500/20` | `border-rose-500/40` | `text-rose-300` | Critical — transaction past due |
| Under Review | `bg-orange-500/20` | `border-orange-500/35` | `text-orange-300` | Fraud review in progress |
| Needs Approval | `bg-amber-500/20` | `border-amber-500/35` | `text-amber-300` | Awaiting approver action |
| Ready to Approve | `bg-purple-500/20` | `border-purple-500/35` | `text-purple-300` | Prepared for next approver |
| Ready to Extract | `bg-teal-500/20` | `border-teal-500/35` | `text-teal-300` | Ready for settlement |
| Extracted | `bg-blue-500/20` | `border-blue-500/35` | `text-blue-300` | Data extracted |
| Confirmed | `bg-indigo-500/20` | `border-indigo-500/35` | `text-indigo-300` | Final confirmation stage |
| Processing | `bg-sky-500/20` | `border-sky-500/35` | `text-sky-300` | Active processing |
| Approved | `bg-emerald-500/20` | `border-emerald-500/35` | `text-emerald-300` | Approval complete |
| Failed | `bg-red-500/20` | `border-red-500/35` | `text-red-300` | Transaction failed |
| Void | `bg-[var(--ds-color-surface-raised)]/50` | `border-[var(--ds-color-border-default)]/50` | `text-[var(--ds-color-text-secondary)]` | Cancelled transaction |
| Draft | `bg-indigo-500/15` | `border-indigo-500/30` | `text-indigo-300` | Work in progress |
| Default | `bg-[var(--ds-color-surface-raised)]/30` | `border-[var(--ds-color-border-default)]/40` | `text-[var(--ds-color-text-secondary)]` | Unknown status |

### Badge Structure
- **Container**: `h-8 px-3 rounded-[var(--ds-radius-lg)] font-medium text-xs border`
- **Icon**: `w-2.5 h-2.5` (Clock icon for overdue)
- **Next status**: displayed with `ArrowRight` separator

---

## 2. Risk Score Badges (Fraud Detection)

### Risk Level Mapping
Defined in `getRiskColors()` function:

| Risk Range | Border | Text | Reason | Background | Label |
|-----------|--------|------|--------|-----------|-------|
| >= 70 (HIGH) | `border-rose-600` | `text-rose-400` | `text-rose-300` | `bg-rose-500/10` | HIGH |
| 40–69 (MED) | `border-amber-500` | `text-amber-400` | `text-amber-300` | `bg-amber-500/10` | MED |
| < 40 (LOW) | `border-emerald-600` | `text-emerald-400` | `text-emerald-300` | `bg-emerald-500/10` | LOW |

### Risk Badge Display
- **Container**: `inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[var(--ds-radius-xs)] border-2 text-xs font-bold w-fit`
- **Icon**:
  - `ShieldAlert` (w-2.5 h-2.5) for HIGH risk
  - `ShieldCheck` (w-2.5 h-2.5) for MED/LOW risk
- **Layout**: Icon + Score (aria-label) · Label

---

## 3. Risk Score Badge — Risk Score Card

### Score Colour Mapping (from `scoreColors()` in mock-data.ts)

| Score Range | Dot Class | Text Class | Label |
|------------|-----------|-----------|-------|
| >= 90 | `bg-red-500` | `text-red-400` | Critical Risk |
| 75–89 | `bg-orange-500` | `text-orange-400` | High Risk |
| 50–74 | `bg-amber-500` | `text-amber-400` | Medium Risk |
| < 50 | `bg-emerald-500` | `text-emerald-400` | Low Risk |
| Anomaly Only | `bg-amber-400` | `text-amber-400` | Anomaly Detected |

### Display Structure
- **Small (sm)**: Dot (w-2 h-2) + Score (text-sm) + "/100" (text-xs) + Label (text-xs)
- **Large (lg)**: Dot (w-2.5 h-2.5) + Score (text-2xl) + "/100" (text-sm) + Label (text-xs)
- **Dot radius**: `rounded-full`

---

## 4. Transaction Row (`client/src/components/results-table/TransactionRow.tsx`)

### Row Border-Left Indicator
Highlights urgency via left border (2px):

| Condition | Colour |
|-----------|--------|
| Overdue | `border-l-rose-500` |
| Risk >= 70 | `border-l-orange-500` |
| Risk 40–69 | `border-l-amber-500/50` |
| Otherwise | `border-l-transparent` |

### Row Background States
| State | Background |
|-------|-----------|
| Expanded | `bg-[var(--ds-color-surface-raised)]/20` |
| Selected (but not expanded) | `bg-teal-500/5` (hover: `bg-teal-500/8`) |
| Default | `bg-[var(--ds-color-surface-page)]` (hover: `bg-[var(--ds-color-interactive-selected-bg)]`) |

### Selection Checkbox
- **Unselected**: `Square` icon, grey (`text-[var(--ds-color-text-secondary)]`)
- **Selected**: `CheckSquare` icon, teal (`text-teal-400`)
- **Hover**: `text-teal-400`
- **Focus ring**: `ring-teal-400`

### Accent Colours (Links & Interactive)
- **Operative Account link**: `text-teal-400` (hover: `text-teal-300`)
- **Waterfall Chain link**: `text-teal-400` (hover: `underline`)
- **Attachment link**: `text-teal-400` (hover: `underline`)
- **Focus rings**: `focus:ring-teal-400`

### Expanded Row Details
- **Detail Card background**: `bg-[var(--ds-color-surface-page)]`
- **Label text**: `text-[var(--ds-color-text-secondary)]` (text-xs)
- **Value text**: `text-[var(--ds-color-text-primary)]` (text-xs, font-medium)
- **Verified = false**: `text-rose-300`
- **Risk Reason**: `text-rose-300`

### RLUSD Badge
- **Background**: `bg-teal-500`
- **Text**: `text-white`
- **Size**: `px-1 py-0 text-[9px] font-bold`

---

## 5. Navigation (`client/src/components/AppNav.tsx`)

### Active Nav Item State
- **Text**: `text-teal-400`
- **Border-bottom**: `border-teal-400` (2px)
- **Background**: `bg-teal-400/5`

### Inactive Nav Item State
- **Text**: `text-[var(--ds-color-text-secondary)]`
- **Border-bottom**: `border-transparent`
- **Hover text**: `text-[var(--ds-color-text-primary)]`
- **Hover background**: `hover:bg-white/5`

### Highlighted Menu Items (Dropdown)
- **Payments menu**:
  - **Background**: `from-teal-500/20 to-cyan-500/10` (linear gradient)
  - **Ring**: `ring-teal-500/30` (1px)
  - **Hover**: `from-teal-500/30 to-cyan-500/20`
  - **Icon**: `text-teal-400`
  - **Label**: `text-teal-300`

- **Anti Fraud menu**:
  - **Background**: `from-orange-500/20 to-yellow-500/10`
  - **Ring**: `ring-orange-500/30`
  - **Hover**: `from-orange-500/30 to-yellow-500/20`
  - **Icon**: `text-orange-400`
  - **Label**: `text-orange-300`

### Section Sidebar (Payments Dropdown)
- **Active section**: `text-teal-400 bg-teal-400/5 border-l-teal-400` (border-left: 2px)
- **Inactive section hover**: `text-[var(--ds-color-text-primary)] bg-white/5`

### Utility Buttons (Search, User, etc.)
- **Default**: `text-[var(--ds-color-text-secondary)]`
- **Hover**: `text-[var(--ds-color-text-primary)]`
- **Focus ring**: `ring-teal-400`

---

## 6. Other Components

### Icon Button Variants (TransactionRow action buttons)
- **view**: Uses grey styling
- **confirm**: Uses teal styling
- **complete**: Uses emerald/green styling
- **reextract**: Uses blue styling
- **fail**: Uses red/rose styling

(Specific colour classes from `client/src/components/shared/IconButton.tsx` not fully detailed here—subject to inspection)

### Instruction Type Badge (TransactionRow)
- **Background**: `bg-[var(--ds-color-surface-raised)]/60`
- **Border**: `border-[var(--ds-color-border-default)]`
- **Text**: `text-[var(--ds-color-text-secondary)]`
- **Size**: `text-xs px-1.5 py-0.5 rounded-[var(--ds-radius-lg)]`

---

## Key Colour Palette Summary

### Primary Colours (Semantic)
- **Teal**: `teal-400` (primary action, active states, safe/approved)
- **Amber**: `amber-500`, `amber-400`, `amber-300` (warning, needs approval)
- **Rose/Red**: `rose-500`, `rose-400`, `rose-300` (critical, overdue, high risk)
- **Orange**: `orange-500`, `orange-400`, `orange-300` (fraud review, high risk)
- **Emerald/Green**: `emerald-500`, `emerald-400`, `emerald-300` (low risk, safe)

### Secondary Colours (Status Pipeline)
- **Blue**: `blue-500`, `blue-400`, `blue-300` (extracted state)
- **Indigo**: `indigo-500`, `indigo-400`, `indigo-300` (confirmed, draft)
- **Purple**: `purple-500`, `purple-400`, `purple-300` (ready to approve)
- **Sky**: `sky-500`, `sky-400`, `sky-300` (processing)
- **Cyan**: `cyan-500` (used in gradients)
- **Yellow**: `yellow-500` (used in gradients with orange)

### Opacity Patterns
- **Backgrounds**: `/20`, `/15`, `/10`, `/5` (decreasing intensity)
- **Borders**: `/40`, `/35`, `/30`, `/50` (moderate transparency)
- **Text**: Solid (no opacity, `-400`, `-300` variants for contrast)

---

## Design System Variables (Fallback)

Components also reference design system CSS custom properties:
- `--ds-color-surface-page`
- `--ds-color-surface-default`
- `--ds-color-surface-raised`
- `--ds-color-surface-sunken`
- `--ds-color-border-default`
- `--ds-color-text-primary`
- `--ds-color-text-secondary`
- `--ds-color-text-tertiary`
- `--ds-color-interactive-selected-bg`
- `--ds-radius-xs`
- `--ds-radius-lg`
- `--ds-radius-xl`

These appear in "Void" status badges and fallback states for maximum flexibility during token migration.

---

## Implementation Notes

1. **Prefix Consistency**: All Tailwind utilities follow Tailwind v3 syntax (no `tw-` prefix needed in JSX/TSX context).
2. **Opacity Syntax**: Opacity values use slash notation: `text-rose-300`, `bg-rose-500/10`.
3. **Linear Gradients**: Used in navigation highlights: `bg-linear-to-br from-X to-Y`.
4. **Radius Variables**: Components use CSS custom properties (`var(--ds-radius-*)`) for border-radius.
5. **Focus States**: Consistently use `focus:ring-teal-400` with `focus:outline-hidden` for accessibility.

---

## Next Steps (PR 2)

When implementing colour token migration:
1. Create design token definitions mapping current Tailwind utilities to named tokens
2. Replace hardcoded utilities with token references
3. Update Tailwind config to consume token values
4. Verify all visual states render identically to this baseline
5. Test in both light and dark modes (if applicable)

---

*Baseline documented by Claude Code on 2026-04-01*
