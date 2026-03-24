import { PositionCell } from "./PositionCell";
import { InFlightCell } from "./InFlightCell";
import { CompletedCell } from "./CompletedCell";
import { type EntityPairing, type Action } from "./types";

interface EntityRowProps {
  pairing: EntityPairing;
  inflightActions: Action[];
  completedActions: Action[];
  onInitiateAction: (pairingId: string) => void;
}

export function EntityRow({ pairing, inflightActions, completedActions, onInitiateAction }: EntityRowProps) {
  const urgency = pairing.open > 150
    ? "border-l-4 border-l-red-400"
    : pairing.open > 50
    ? "border-l-4 border-l-amber-400"
    : "border-l-4 border-l-transparent";

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-[2fr_2fr_1.5fr] border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${urgency}`}>
      <PositionCell pairing={pairing} />
      <InFlightCell
        actions={inflightActions}
        onInitiateAction={() => onInitiateAction(pairing.id)}
      />
      <CompletedCell actions={completedActions} />
    </div>
  );
}
