# TSW DS Foundation Gap Fill

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace every handrolled monetary amount, status chip, icon button, and freshness indicator in TSW with the correct `@ds-foundation/react` component — closing 18 identified gaps across 10 files.

**Architecture:** Pure substitution work. No new files, no API changes, no layout changes. Each task replaces TSW-custom renders with their DS Foundation equivalent, using the existing DS imports pattern already established in Phase 2/3.

**Tech Stack:** `@ds-foundation/react` (file: linked), React 18, TypeScript, Tailwind. Working dir: `/Users/apacheco/Documents/Projects/payments-tsw-phase1`.

---

## File Map

| File | Change |
|------|--------|
| `client/src/components/organisms/results-table/TransactionCard.tsx` | MonoAmount+CurrencyBadge for amount; StateBadge for status chip |
| `client/src/components/molecules/fraud-spotlight/FlaggedItemRow.tsx` | MonoAmount+CurrencyBadge |
| `client/src/components/molecules/fraud-spotlight/FlaggedItemDetail.tsx` | MonoAmount+CurrencyBadge |
| `client/src/components/molecules/fraud-spotlight/OverrideDialog.tsx` | MonoAmount for amount |
| `client/src/components/organisms/results-table/PaymentRailDialog.tsx` | MonoAmount for amount; IconButton for close |
| `client/src/components/organisms/results-table/AttachmentViewer.tsx` | IconButton for close |
| `client/src/components/organisms/ConfigurePrototypeModal.tsx` | IconButton for close |
| `client/src/components/navigation/UnifiedNav.tsx` | IconButton for close |
| `client/src/components/organisms/results-table/TableToolbar.tsx` | IconButton for Export button |
| `client/src/pages/Prototype.tsx` | FreshnessChip + IconButton for Refresh; `lastRefreshed` state → `Date` |

---

## DS Component APIs (reference)

```typescript
// MonoAmount — value: number, currency: 'USD'|'EUR'|'GBP', size?: 'sm'|'md'|'lg'
<MonoAmount value={t.amount} currency={t.cur as 'USD'|'EUR'|'GBP'} />

// CurrencyBadge — currency: 'USD'|'EUR'|'GBP'
<CurrencyBadge currency={t.cur as 'USD'|'EUR'|'GBP'} />

// StateBadge — state: string, intent: StateBadgeIntent, nextState?: string, size?: 'sm'|'md'
<StateBadge state={t.status} intent={getTxStatusIntent(t.status)} size="sm" />

// IconButton — extends ButtonHTMLAttributes, variant?, size?, icon?, children?
<IconButton icon={<X className="w-4 h-4" />} aria-label="Close" variant="neutral" />

// FreshnessChip — state: FreshnessState, timestamp: Date, onRefresh?: () => void
// deriveFreshnessState(date: Date): FreshnessState — 0-5min=fresh, 5-15min=watch, >15min=stale
<FreshnessChip state={deriveFreshnessState(lastRefreshed)} timestamp={lastRefreshed} onRefresh={handleRefresh} />
```

---

## Task 1: MonoAmount + CurrencyBadge sweep (5 files)

**Files:**
- Modify: `client/src/components/organisms/results-table/TransactionCard.tsx`
- Modify: `client/src/components/molecules/fraud-spotlight/FlaggedItemRow.tsx`
- Modify: `client/src/components/molecules/fraud-spotlight/FlaggedItemDetail.tsx`
- Modify: `client/src/components/molecules/fraud-spotlight/OverrideDialog.tsx`
- Modify: `client/src/components/organisms/results-table/PaymentRailDialog.tsx`

> **PaymentRailDialog note:** Currently uses a local `fmtUSD` function that formats as `$1,234.56`. `MonoAmount` uses tabular-nums mono font and DS token colour. No `size="lg"` equivalent exists in MonoAmount (sizes are `sm`|`md`) — use `md` (default). Remove the local `fmtUSD` function after migration.

- [ ] **Step 1: TransactionCard.tsx — replace amount display**

  Find (line ~67-69):
  ```tsx
  <span className="text-sm font-medium text-[var(--ds-color-text-primary)] whitespace-nowrap shrink-0">
    {fmtAmt(t.amount, t.cur)} <span className="text-xs text-[var(--ds-color-text-secondary)] font-normal">{t.cur}</span>
  </span>
  ```

  Replace with:
  ```tsx
  <span className="flex items-center gap-1.5 whitespace-nowrap shrink-0">
    <MonoAmount value={t.amount} currency={t.cur as 'USD' | 'EUR' | 'GBP'} />
    <CurrencyBadge currency={t.cur as 'USD' | 'EUR' | 'GBP'} />
  </span>
  ```

  Add to imports:
  ```typescript
  import { DetailCard, MonoAmount, CurrencyBadge } from "@ds-foundation/react";
  ```

  Remove `fmtAmt` from import if no longer used in this file. Check if `fmtAmt` is used elsewhere in TransactionCard (it is used in the `aria-label` on line ~34 — keep that usage but also update it to use a simple formatted string, or keep `fmtAmt` just for that aria-label).

- [ ] **Step 2: FlaggedItemRow.tsx — replace amount display**

  Find (line ~36):
  ```tsx
  <span className="text-xs text-[var(--ds-color-text-secondary)] font-medium">{t.currency} {t.amount.toLocaleString()}</span>
  ```

  Replace with:
  ```tsx
  <span className="flex items-center gap-1.5">
    <MonoAmount value={t.amount} currency={t.currency as 'USD' | 'EUR' | 'GBP'} size="sm" />
    <CurrencyBadge currency={t.currency as 'USD' | 'EUR' | 'GBP'} />
  </span>
  ```

  Add imports: `import { MonoAmount, CurrencyBadge } from '@ds-foundation/react';`

- [ ] **Step 3: FlaggedItemDetail.tsx — replace amount display**

  Find (line ~50):
  ```tsx
  {selectedTxn.currency} {selectedTxn.amount.toLocaleString()}
  ```

  Replace with:
  ```tsx
  <span className="flex items-center gap-1.5">
    <MonoAmount value={selectedTxn.amount} currency={selectedTxn.currency as 'USD' | 'EUR' | 'GBP'} />
    <CurrencyBadge currency={selectedTxn.currency as 'USD' | 'EUR' | 'GBP'} />
  </span>
  ```

  Add imports: `import { MonoAmount, CurrencyBadge } from '@ds-foundation/react';`

- [ ] **Step 4: OverrideDialog.tsx — replace amount in summary line**

  Find (line ~43):
  ```tsx
  {overrideTxn?.vendor} · {overrideTxn?.currency} {overrideTxn?.amount.toLocaleString()} · Risk Score: {overrideTxn?.riskScore}/100
  ```

  Replace with:
  ```tsx
  {overrideTxn?.vendor}
  {overrideTxn && (
    <> · <MonoAmount value={overrideTxn.amount} currency={overrideTxn.currency as 'USD' | 'EUR' | 'GBP'} size="sm" /></>
  )}
   · Risk Score: {overrideTxn?.riskScore}/100
  ```

  Add imports: `import { MonoAmount } from '@ds-foundation/react';`

- [ ] **Step 5: PaymentRailDialog.tsx — replace fmtUSD amount**

  Find (line ~33):
  ```typescript
  const fmtUSD = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  ```
  Delete this function.

  Find (line ~60):
  ```tsx
  <span className="text-lg font-bold text-white">{fmtUSD(txn.amount)}</span>
  ```

  Replace with:
  ```tsx
  <MonoAmount value={txn.amount} currency="USD" />
  ```

  Add imports: `import { MonoAmount } from '@ds-foundation/react';` (merge with existing import if present)

- [ ] **Step 6: TypeScript check + commit**

  ```bash
  npm run check
  ```
  Zero errors required.

  ```bash
  git add client/src/components/organisms/results-table/TransactionCard.tsx \
          client/src/components/molecules/fraud-spotlight/FlaggedItemRow.tsx \
          client/src/components/molecules/fraud-spotlight/FlaggedItemDetail.tsx \
          client/src/components/molecules/fraud-spotlight/OverrideDialog.tsx \
          client/src/components/organisms/results-table/PaymentRailDialog.tsx
  git commit -m "feat: replace handrolled amounts with MonoAmount + CurrencyBadge"
  ```

---

## Task 2: StateBadge — TransactionCard mobile status chip

**Files:**
- Modify: `client/src/components/organisms/results-table/TransactionCard.tsx`

- [ ] **Step 1: Replace handrolled status chip**

  Find (lines ~73-79):
  ```tsx
  <span className={`text-[10px] px-1.5 py-0.5 rounded-[var(--ds-radius-xs)] font-medium
    ${t.status === "Needs Approval" ? "bg-[var(--ds-color-feedback-warning-bg)] text-[var(--ds-color-feedback-warning-text)] border border-[var(--ds-color-feedback-warning-border)]/25"
    : t.status === "Approved" ? "bg-[var(--ds-color-feedback-success-bg)] text-[var(--ds-color-feedback-success-text)] border border-[var(--ds-color-feedback-success-border)]/25"
    : "bg-[var(--ds-color-surface-raised)]/50 text-[var(--ds-color-text-secondary)] border border-[var(--ds-color-border-default)]/50"}`}
  >
    {t.status}
  </span>
  ```

  Replace with:
  ```tsx
  <StateBadge state={t.status} intent={getTxStatusIntent(t.status)} size="sm" />
  ```

  Add to imports:
  ```typescript
  import { DetailCard, MonoAmount, CurrencyBadge, StateBadge } from "@ds-foundation/react";
  import { getTxStatusIntent } from "@/lib/design-tokens";
  ```

  > Note: `getTxStatusIntent` is already in `design-tokens.ts`. Only 3 statuses were manually handled in the old chip (Needs Approval, Approved, and default). `getTxStatusIntent` handles all 15 TSW statuses correctly, so this is an improvement in coverage.

- [ ] **Step 2: TypeScript check + commit**

  ```bash
  npm run check
  ```

  ```bash
  git add client/src/components/organisms/results-table/TransactionCard.tsx
  git commit -m "feat: replace handrolled status chip in TransactionCard with StateBadge"
  ```

---

## Task 3: IconButton sweep — close buttons + Export

**Files:**
- Modify: `client/src/components/organisms/results-table/AttachmentViewer.tsx`
- Modify: `client/src/components/organisms/results-table/PaymentRailDialog.tsx`
- Modify: `client/src/components/organisms/ConfigurePrototypeModal.tsx`
- Modify: `client/src/components/navigation/UnifiedNav.tsx`
- Modify: `client/src/components/organisms/results-table/TableToolbar.tsx`

> **Note on visual change:** The Export button currently uses `rounded-full` (pill shape). IconButton uses `--ds-radius-lg`. This is an intentional alignment to DS standards.

- [ ] **Step 1: AttachmentViewer.tsx — replace close button**

  Find (lines ~27-30):
  ```tsx
  <button onClick={onClose} aria-label="Close attachment viewer"
    className="...">
    <X className="w-4 h-4" aria-hidden="true" />
  </button>
  ```

  Replace with:
  ```tsx
  <IconButton
    onClick={onClose}
    icon={<X className="w-4 h-4" aria-hidden="true" />}
    aria-label="Close attachment viewer"
    variant="neutral"
  />
  ```

  Add import: `import { IconButton } from '@ds-foundation/react';`

- [ ] **Step 2: PaymentRailDialog.tsx — replace close button**

  Find (lines ~52-55):
  ```tsx
  <button onClick={onClose} aria-label="Close dialog"
    className="...">
    <X className="w-5 h-5" aria-hidden="true" />
  </button>
  ```

  Replace with:
  ```tsx
  <IconButton
    onClick={onClose}
    icon={<X className="w-5 h-5" aria-hidden="true" />}
    aria-label="Close dialog"
    variant="neutral"
  />
  ```

  Merge with the existing `MonoAmount` import added in Task 1.

- [ ] **Step 3: ConfigurePrototypeModal.tsx — replace close button**

  Find (lines ~89-95):
  ```tsx
  <button
    onClick={closeModal}
    aria-label="Close configure modal"
    className="...">
    <X className="w-5 h-5" />
  </button>
  ```

  Replace with:
  ```tsx
  <IconButton
    onClick={closeModal}
    icon={<X className="w-5 h-5" aria-hidden="true" />}
    aria-label="Close configure modal"
    variant="neutral"
  />
  ```

  Add import: `import { IconButton } from '@ds-foundation/react';`

- [ ] **Step 4: UnifiedNav.tsx — replace close button**

  Find (lines ~248-253):
  ```tsx
  <button
    onClick={closeModal}
    aria-label="Close configure modal"
    className="...">
    <X className="w-5 h-5" />
  </button>
  ```

  Replace with:
  ```tsx
  <IconButton
    onClick={closeModal}
    icon={<X className="w-5 h-5" aria-hidden="true" />}
    aria-label="Close configure modal"
    variant="neutral"
  />
  ```

  Add import: `import { IconButton } from '@ds-foundation/react';`

- [ ] **Step 5: TableToolbar.tsx — replace Export button**

  Find (lines ~87-89):
  ```tsx
  <button className="flex items-center gap-1.5 px-4 h-10 rounded-full text-xs text-[var(--ds-color-text-secondary)] hover:text-white border border-[var(--ds-color-border-default)]/60 hover:border-[var(--ds-color-border-default)] bg-[var(--ds-color-surface-page)] transition-all focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)]">
    <Download className="w-3.5 h-3.5" aria-hidden="true" /> Export
  </button>
  ```

  Replace with:
  ```tsx
  <IconButton
    icon={<Download className="w-3.5 h-3.5" aria-hidden="true" />}
    aria-label="Export transactions"
    variant="neutral"
  >
    Export
  </IconButton>
  ```

  `IconButton` is already imported in this file — no import change needed.

- [ ] **Step 6: TypeScript check + commit**

  ```bash
  npm run check
  ```

  ```bash
  git add client/src/components/organisms/results-table/AttachmentViewer.tsx \
          client/src/components/organisms/results-table/PaymentRailDialog.tsx \
          client/src/components/organisms/ConfigurePrototypeModal.tsx \
          client/src/components/navigation/UnifiedNav.tsx \
          client/src/components/organisms/results-table/TableToolbar.tsx
  git commit -m "feat: replace handrolled close/action buttons with IconButton"
  ```

---

## Task 4: FreshnessChip — Prototype.tsx

**Files:**
- Modify: `client/src/pages/Prototype.tsx`

> **UX note:** FreshnessChip renders as invisible (hidden `aria-live` span) when state is `fresh` (< 5 minutes since refresh). This is intentional — when data is fresh, no indicator is needed. The chip becomes visible at `watch` (5-15 min) and `stale` (> 15 min). The existing "Refresh" button stays; FreshnessChip adds the freshness signal alongside it.

- [ ] **Step 1: Change `lastRefreshed` state from `string` to `Date`**

  Find (line ~67):
  ```typescript
  const [lastRefreshed, setLastRefreshed] = useState("4:23 PM");
  ```

  Replace with:
  ```typescript
  const [lastRefreshed, setLastRefreshed] = useState<Date>(() => new Date());
  ```

- [ ] **Step 2: Update `handleRefresh` to set a `Date`**

  Find (line ~111):
  ```typescript
  setLastRefreshed(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
  ```

  Replace with:
  ```typescript
  setLastRefreshed(new Date());
  ```

- [ ] **Step 3: Replace "Last refreshed" text with FreshnessChip**

  Find (lines ~133-136):
  ```tsx
  <p className="text-xs text-[var(--ds-color-text-secondary)] m-0" aria-live="polite">
    Last refreshed: <span className="text-[var(--ds-color-text-secondary)] font-medium">{lastRefreshed}</span>
  </p>
  ```

  Replace with:
  ```tsx
  <FreshnessChip
    state={deriveFreshnessState(lastRefreshed)}
    timestamp={lastRefreshed}
    onRefresh={handleRefresh}
  />
  ```

- [ ] **Step 4: Add imports**

  Add to imports:
  ```typescript
  import { FreshnessChip, deriveFreshnessState } from '@ds-foundation/react';
  ```

- [ ] **Step 5: TypeScript check + commit**

  ```bash
  npm run check
  ```

  ```bash
  git add client/src/pages/Prototype.tsx
  git commit -m "feat: replace last-refreshed text with FreshnessChip"
  ```

---

## Acceptance Criteria

- [ ] `npm run check` — zero TypeScript errors
- [ ] `grep -r "fmtAmt\|fmtUSD\|toLocaleString" client/src/components/` — zero results (all amount rendering through DS)
- [ ] `grep -rn "rounded-full.*Download\|rounded-full.*X\b" client/src/` — zero results (no handrolled icon buttons)
- [ ] `TransactionCard.tsx` contains no inline ternary colour mapping for status chip
- [ ] `FreshnessChip` renders in Prototype.tsx header area (invisible when fresh, visible when stale)
