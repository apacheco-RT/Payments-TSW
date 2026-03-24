// client/src/components/netting/FreshnessChip.tsx
import { cn } from "@/lib/utils";
import { getFreshnessState, type FreshnessState } from "./types";

interface FreshnessChipProps {
  minutes: number;
  className?: string;
}

export function FreshnessChip({ minutes, className }: FreshnessChipProps) {
  const state = getFreshnessState(minutes);

  if (state === "fresh") return null;

  const configs: Record<Exclude<FreshnessState, "fresh">, { label: string; classes: string }> = {
    watch: {
      label: `Updated ${minutes}m ago`,
      classes: "bg-amber-50 text-amber-700 border border-amber-200",
    },
    stale: {
      label: `Stale — ${minutes}m ago`,
      classes: "bg-red-50 text-red-700 border border-red-200",
    },
  };

  const config = configs[state as "watch" | "stale"];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        config.classes,
        className
      )}
    >
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        state === "watch" ? "bg-amber-500" : "bg-red-500"
      )} />
      {config.label}
    </span>
  );
}
