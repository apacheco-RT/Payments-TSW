import { UnifiedNav } from "@/components/navigation/UnifiedNav"
import AppNav from "@/components/navigation/AppNav"

interface TreasuryShellProps {
  solution?: string
  activeFeature?: string
  children: React.ReactNode
}

export default function TreasuryShell({ children }: TreasuryShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--ds-color-surface-page)] text-white">
      <UnifiedNav />
      <div className="mt-11">
        <AppNav />
      </div>
      <main id="main-content" className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
