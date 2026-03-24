// Stub — will be replaced by Task 5
import type { Action } from "./types";
interface InFlightCellProps {
  actions: Action[];
  onInitiateAction: () => void;
}
export function InFlightCell({ actions, onInitiateAction }: InFlightCellProps) {
  return (
    <div className="border-t sm:border-t-0 sm:border-l border-gray-100 px-5 py-4 text-xs text-gray-300">
      In-flight — coming soon ({actions.length} actions)
    </div>
  );
}
