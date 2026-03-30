# Token Mapping: TSW Custom → DS-Foundation

**Date:** 2026-03-30
**Branch:** feat/ds-token-uplift

This table maps every token exported from `client/src/lib/design-tokens.ts` to its `@ds-foundation/tokens` equivalent. Used by Task 7 (rewriting design-tokens.ts as a thin wrapper) and Task 8 (component sweep).

DS-foundation variable names are verified against:
- `node_modules/@ds-foundation/tokens/build/css/variables.css` (light mode / `:root`)
- `node_modules/@ds-foundation/tokens/build/css/variables.dark.css` (`[data-theme="dark"]`)

---

## Color — Brand

| TSW token | DS-foundation var | Notes |
|---|---|---|
| `brand.blue` `#1E90FF` | `--ds-color-brand-primary` | Semantic match. Light = blue-600 (`#2563eb`), dark = blue-400 (`#60a5fa`). TSW value is lighter than blue-600; the custom Ripple hue has no DS primitive. Use semantic var. |
| `brand.blueDark` `#0071E5` | `--ds-color-brand-primary` | Button primary default; same semantic as above. No exact primitive match. |
| `brand.blueDeeper` `#0043A7` | `--ds-color-brand-primary-active` | Maps to blue-800 (`#1e40af`) in light. Closest semantic for hover/pressed. |
| `brand.success` `#53C922` | `--ds-color-feedback-success-icon` | DS green-600 (`#16a34a`) in light / green-400 (`#4ade80`) in dark. TSW lime-green has no DS primitive. Use semantic feedback var for icon/confirmation contexts. |
| `brand.error` `#ED346A` | `--ds-color-feedback-error-icon` | DS red-600 (`#dc2626`) light / red-400 dark. TSW rose-red has no DS primitive. |
| `brand.warning` `#F9731C` | `--ds-color-feedback-warning-icon` | DS amber-600 (`#d97706`) light / amber-400 dark. TSW orange has no DS primitive. |
| `brand.textHeading` `#141A1F` | — | No DS equivalent. Ripple-specific heading color for light backgrounds. Flag for NEW_COMPONENTS.md. |
| `brand.textBody` `#454C52` | — | No DS equivalent. Custom body text color. Closest DS primitive is neutral-600 (`#475569`) but value is not identical. Flag for NEW_COMPONENTS.md. |

---

## Color — Surface

TSW surface tokens are a custom dark-navy palette with no DS-foundation light-mode equivalent. The DS dark-theme surface tokens are the closest semantic match (applied under `[data-theme="dark"]`).

| TSW token | DS-foundation var | Notes |
|---|---|---|
| `surface.page` `#0f1e35` | `--ds-color-surface-page` | Dark theme = neutral-950 (`#020617`). TSW value is lighter navy — no exact DS primitive. Semantic match only. |
| `surface.card` `#162a47` | `--ds-color-surface-default` | Dark theme = neutral-900 (`#0f172a`). TSW is lighter navy. Semantic match only. |
| `surface.elevated` `#2d4a77` | `--ds-color-surface-raised` | Dark theme = neutral-800 (`#1e293b`). TSW uses `surface-elevated`; DS uses `surface-raised` — **naming discrepancy**. |
| `surface.inset` `#0a1628` | `--ds-color-surface-sunken` | Dark theme = neutral-950. Semantic match for form inputs / deep nested bg. |
| `surface.section` `#0d1c30` | `--ds-color-surface-page` | No dedicated DS token for alternating rows. Closest is `surface-page` in dark mode. |
| `surface.deep` `#050b14` | — | No DS equivalent. Darker than neutral-950. Flag for NEW_COMPONENTS.md. |
| `surface.rowHover` `#132640` | `--ds-color-interactive-selected-bg` | Dark = blue-950 (`#172554`). Approximate semantic match for interactive hover state on rows. |
| `surface.border` `#1a3455` | `--ds-color-border-default` | Dark = neutral-700 (`#334155`). TSW border is a navy tint; DS uses neutral. Approximate. |

---

## Color — Text

| TSW token | DS-foundation var | Notes |
|---|---|---|
| `textTokens.dark.primary` `#f8fafc` | `--ds-color-text-primary` | Dark theme = neutral-50 (`#f8fafc`). **Exact match.** |
| `textTokens.dark.secondary` `#94a3b8` | `--ds-color-text-secondary` | Dark theme = neutral-400 (`#94a3b8`). **Exact match.** |
| `textTokens.dark.tertiary` `#8e9eb0` | `--ds-color-text-tertiary` | Dark theme = neutral-600 (`#475569`). TSW value `#8e9eb0` is between neutral-400 and neutral-500. No exact match; use `--ds-color-text-tertiary` as semantic fallback. |
| `textTokens.light.primary` `#0f172a` | `--ds-color-text-primary` | Light theme = neutral-900 (`#0f172a`). **Exact match.** |
| `textTokens.light.secondary` `#64748b` | `--ds-color-text-secondary` | Light theme = neutral-600 (`#475569`). TSW value is neutral-500 (`#64748b`). One step lighter — close semantic match. |
| `textTokens.light.tertiary` `#4b5563` | `--ds-color-text-tertiary` | Light theme = neutral-400 (`#94a3b8`). TSW value maps to neutral-600 range (`#475569` is neutral-600). Use `--ds-color-text-secondary` in light or a primitive. |

---

## Color — Border

| TSW token | DS-foundation var | Notes |
|---|---|---|
| `surface.border` `#1a3455` | `--ds-color-border-default` | Already noted above. Navy tint vs neutral-700 in dark. |

---

## Color — Feedback

DS-foundation has a complete feedback system. TSW uses inline objects for feedback coloring; these map cleanly.

| TSW token / usage | DS-foundation var | Notes |
|---|---|---|
| Success text color | `--ds-color-feedback-success-text` | Green-700 light / green-400 dark. |
| Success background | `--ds-color-feedback-success-bg` | Green-50 light / green-950 dark. |
| Success border | `--ds-color-feedback-success-border` | Green-300 light / green-700 dark. |
| Error text color | `--ds-color-feedback-error-text` | Red-700 light / red-400 dark. |
| Error background | `--ds-color-feedback-error-bg` | Red-50 light / red-950 dark. |
| Error border | `--ds-color-feedback-error-border` | Red-300 light / red-700 dark. |
| Warning text color | `--ds-color-feedback-warning-text` | Amber-700 light / amber-400 dark. |
| Warning background | `--ds-color-feedback-warning-bg` | Amber-50 light / amber-950 dark. |
| Warning border | `--ds-color-feedback-warning-border` | Amber-300 light / amber-700 dark. |

---

## Spacing

DS uses a numeric T-shirt scale. TSW spacing tokens map as follows:

| TSW token | Value | DS-foundation var | Notes |
|---|---|---|---|
| `spacing.pagePadding` | `1.5rem` (24px) | `--ds-spacing-6` | **Exact match.** |
| `spacing.sectionGap` | `0.75rem` (12px) | `--ds-spacing-3` | **Exact match.** |
| `spacing.cardPadding` | `1rem` (16px) | `--ds-spacing-4` | **Exact match.** |
| `spacing.tableRowH` | `2.75rem` (44px) | `--ds-component-height-lg` (`3rem`) | Closest is component-height-lg (48px). DS has no 44px spacing step. TSW value is WCAG 2.5.8 target. Retain as custom or use `--ds-component-height-md` (40px) + note. |
| `spacing.minTouchTarget` | `1.5rem` (24px) | `--ds-component-height-xs` | **Exact match** on component-height-xs. |

---

## Typography

| TSW token | DS-foundation var | Notes |
|---|---|---|
| `typography.fontSans` | `--ds-font-family-sans` | DS = `Inter Variable, Inter, system-ui, -apple-system, sans-serif`. TSW prepends `"TT Ripple", "Space Grotesk"` as Ripple brand fonts — these are not in DS. Wrapper must override with Ripple stack falling back to `--ds-font-family-sans`. |
| `typography.fontMono` | `--ds-font-family-mono` | DS = `JetBrains Mono, Fira Code, Consolas, monospace`. TSW = `"JetBrains Mono", Menlo, monospace`. **Near-exact match**; use DS var. |
| `typography.scale.xs` `0.75rem` | `--ds-font-size-xs` | **Exact match.** |
| `typography.scale.sm` `0.8125rem` | — | No DS equivalent. DS jumps from xs (0.75rem) to sm (0.875rem); 0.8125rem (13px) has no DS step. Retain as custom. |
| `typography.scale.base` `0.875rem` | `--ds-font-size-sm` | **Exact match** (DS `sm` = 0.875rem). Naming discrepancy: TSW calls it `base`, DS calls it `sm`. |
| `typography.scale.md` `1rem` | `--ds-font-size-md` | **Exact match.** |
| `typography.scale.lg` `1.125rem` | `--ds-font-size-lg` | **Exact match.** |
| `typography.scale.xl` `1.25rem` | `--ds-font-size-xl` | **Exact match.** |
| `typography.scale.2xl` `1.5rem` | `--ds-font-size-2xl` | **Exact match.** |
| `typography.tableHeader` `0.6875rem` | — | No DS equivalent. 11px table header step does not exist in DS scale. Retain as custom. |
| Line-heights (all scales) | `--ds-font-leading-*` | Approximate matches. TSW uses rem values; DS uses unitless ratios. Closest: `tight` (1.25), `normal` (1.5), `relaxed` (1.625). |
| Font weights (400/600/700) | `--ds-font-weight-regular` / `--ds-font-weight-semibold` / `--ds-font-weight-bold` | **Exact matches.** |
| `typography.tableHeader.letterSpacing` `0.06em` | `--ds-font-tracking-wider` (`0.05em`) | Closest DS step. Not exact (0.05 vs 0.06). Retain custom or use `--ds-font-tracking-widest` (0.1em) — neither is right, retain raw value. |

---

## Border Radius

| TSW token | Value | DS-foundation var | Notes |
|---|---|---|---|
| `radius.pill` | `100px` | `--ds-radius-full` (`9999px`) | Semantic match (both produce pill shape). Value differs but visual result is identical. |
| `radius.card` | `0.75rem` (12px) | `--ds-radius-xl` (`0.75rem`) | **Exact match.** |
| `radius.input` | `0.5rem` (8px) | `--ds-radius-lg` (`0.5rem`) | **Exact match.** |
| `radius.badge` | `0.25rem` (4px) | `--ds-radius-sm` (`0.25rem`) | **Exact match.** |
| `radius.sm` | `0.1875rem` (3px) | `--ds-radius-xs` (`0.125rem`) | Closest. TSW is 3px, DS xs is 2px. No exact match; use `--ds-radius-xs` or retain custom value. |

---

## Shadows

| TSW token | DS-foundation var | Notes |
|---|---|---|
| `shadows.panel` `0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.05)` | `--ds-shadow-sm` (`0px 1px 3px 0px rgba(0,0,0,0.07)`) | Very close. TSW uses two-layer shadow; DS is single-layer. Use `--ds-shadow-sm` as replacement. |
| `shadows.dropdown` `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.06)` | `--ds-shadow-md` (`0px 4px 6px -1px rgba(0,0,0,0.1)`) | **Near-exact first layer.** Use `--ds-shadow-md`. |
| `shadows.modal` `0 20px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)` | `--ds-shadow-xl` (`0px 20px 25px -5px rgba(0,0,0,0.1)`) | First layer matches geometry; TSW uses 0.15 opacity vs DS 0.1. Use `--ds-shadow-xl`. |

---

## Z-Index

**Important:** TSW z-index values differ significantly from DS-foundation values. The mapping below is by **semantic name only** — the numeric values will change.

| TSW token | TSW value | DS-foundation var | DS value | Notes |
|---|---|---|---|---|
| `zIndex.base` | `0` | `--ds-z-index-base` | `0` | **Exact match.** |
| `zIndex.raised` | `10` | `--ds-z-index-raised` | `10` | **Exact match.** |
| `zIndex.overlay` | `20` | `--ds-z-index-overlay` | `300` | **Value change.** Semantic name matches. Components using `zIndex.overlay` will jump to 300. Verify no conflicts. |
| `zIndex.dropdown` | `30` | `--ds-z-index-dropdown` | `100` | **Value change.** Semantic match. |
| `zIndex.sticky` | `40` | `--ds-z-index-sticky` | `200` | **Value change.** Semantic match. |
| `zIndex.modal` | `50` | `--ds-z-index-modal` | `400` | **Value change.** Semantic match. |
| `zIndex.toast` | `60` | `--ds-z-index-toast` | `600` | **Value change.** Semantic match. |

DS also defines `--ds-z-index-below` (-1), `--ds-z-index-popover` (500), and `--ds-z-index-max` (9999) which have no TSW equivalents.

---

## Non-Color Exports (No Direct Token Mapping)

These exports contain non-token data (labels, logic, constants) and are not candidates for DS-foundation mapping.

| TSW export | Notes |
|---|---|
| `FRAUD_GATE_THRESHOLD` `70` | Business logic constant. Not a design token. Stays as-is. |
| `filterPresets.myDailyQueue` | UX default state. Not a design token. Stays as-is. |
| `fraudSpotlight.topN` `10` | Business logic constant. Not a design token. Stays as-is. |

---

## No DS-Foundation Equivalent — Flagged for NEW_COMPONENTS.md

These tokens are domain-specific to the TSW payments application. DS-foundation has no equivalent and they must remain as custom tokens.

| TSW token | Category | Notes |
|---|---|---|
| `risk.critical` `{ bg, border, text, solid }` | Color — risk level | Domain-specific fraud/risk indicator. Critical threshold. No DS semantic for risk scoring. |
| `risk.high` `{ bg, border, text, solid }` | Color — risk level | Domain-specific. High fraud risk. |
| `risk.medium` `{ bg, border, text, solid }` | Color — risk level | Domain-specific. Medium fraud risk. |
| `risk.low` `{ bg, border, text, solid }` | Color — risk level | Domain-specific. Low fraud risk. |
| `risk.none` `{ bg, border, text, solid }` | Color — risk level | Domain-specific. Clear / no risk. |
| `processStage.create` `{ color, bg }` | Color — process stage | Domain-specific payment flow stage. Indigo palette. |
| `processStage.antiFraud` `{ color, bg }` | Color — process stage | Domain-specific. Orange palette. |
| `processStage.approvals` `{ color, bg }` | Color — process stage | Domain-specific. Violet palette. |
| `processStage.status` `{ color, bg }` | Color — process stage | Domain-specific. Sky blue palette. |
| `processStage.history` `{ color, bg }` | Color — process stage | Domain-specific. Slate palette. |
| `txStatus.pending` `{ color, bg }` | Color — transaction status | Domain-specific. Amber palette. |
| `txStatus.processing` `{ color, bg }` | Color — transaction status | Domain-specific. Blue palette. |
| `txStatus.readyToApprove` `{ color, bg }` | Color — transaction status | Domain-specific. Violet palette. |
| `txStatus.approved` `{ color, bg }` | Color — transaction status | Domain-specific. Green palette. |
| `txStatus.rejected` `{ color, bg }` | Color — transaction status | Domain-specific. Red palette. |
| `txStatus.onHold` `{ color, bg }` | Color — transaction status | Domain-specific. Amber/brown palette. |
| `txStatus.escalated` `{ color, bg }` | Color — transaction status | Domain-specific. Blue-700 palette. |
| `txStatus.cancelled` `{ color, bg }` | Color — transaction status | Domain-specific. Neutral palette. |
| `fraudSpotlight.gradientFrom/Via/To` | Color — gradient | Fraud spotlight header gradient. Domain-specific rose-to-orange gradient. |
| `surface.deep` `#050b14` | Color — surface | Darker than DS neutral-950. No DS primitive match. Footer background. |
| `brand.textHeading` `#141A1F` | Color — brand typography | Ripple-specific heading color for light bg. No DS equivalent. |
| `brand.textBody` `#454C52` | Color — brand typography | Ripple-specific body text for light bg. Close to neutral-600 but not exact. |
| `typography.scale.sm` `0.8125rem` | Typography — size | 13px table cell size. Falls between DS `xs` (12px) and `sm` (14px). No DS step. |
| `typography.tableHeader` | Typography — composite | 11px / uppercase / wide tracking composite. No DS equivalent step. |
| `a11y.*` | Accessibility constants | WCAG reference values. Not design tokens — keep as constants. |
