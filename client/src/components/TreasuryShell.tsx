import { UnifiedNav } from "@/components/navigation/UnifiedNav"
import AppNav from "@/components/navigation/AppNav"

interface TreasuryShellProps {
  children: React.ReactNode
}

export default function TreasuryShell({ children }: TreasuryShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--ds-color-surface-page)] text-[var(--ds-color-text-primary)]">
      <UnifiedNav />
      <div className="mt-11">
        <AppNav />
      </div>
      <main id="main-content" className="flex-1 p-6 min-h-0">
        {children}
      </main>
    </div>
  )
}
