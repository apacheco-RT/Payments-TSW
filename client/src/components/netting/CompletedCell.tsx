// Stub — will be replaced by Task 6
import type { Action } from "./types";
interface CompletedCellProps {
  actions: Action[];
}
export function CompletedCell({ actions }: CompletedCellProps) {
  return (
    <div className="border-t sm:border-t-0 sm:border-l border-gray-100 px-5 py-4 text-xs text-gray-300">
      Completed — coming soon ({actions.length} actions)
    </div>
  );
}
