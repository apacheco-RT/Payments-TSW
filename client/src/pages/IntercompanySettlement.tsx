import { useState } from "react";
import TreasuryShell from "@/components/TreasuryShell";
import { DashboardHeader } from "@/components/netting/DashboardHeader";
import { ColumnHeaders } from "@/components/netting/ColumnHeaders";
import { EntityRow } from "@/components/netting/EntityRow";
import {
  MOCK_PAIRINGS, MOCK_ACTIONS, MOCK_COMPLETED_ACTIONS,
  SETTLEMENT_TYPES, type TxType, type Action,
} from "@/components/netting/types";

export default function IntercompanySettlement() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [startPoint, setStartPoint] = useState<Date>(today);
  const [selectedTypes, setSelectedTypes] = useState<TxType[]>([...SETTLEMENT_TYPES]);
  const [actions, setActions] = useState<Action[]>(MOCK_ACTIONS);

  return (
    <TreasuryShell solution="Payments" activeFeature="Settlement Netting">
      <div className="flex flex-col h-full">
        <DashboardHeader
          startPoint={startPoint}
          onStartPointChange={setStartPoint}
          selectedTypes={selectedTypes}
          onTypesChange={setSelectedTypes}
        />
        <div className="flex-1 overflow-auto">
          <ColumnHeaders />
          {MOCK_PAIRINGS.map((pairing) => (
            <EntityRow
              key={pairing.id}
              pairing={pairing}
              inflightActions={actions.filter((a) => a.pairingId === pairing.id)}
              completedActions={MOCK_COMPLETED_ACTIONS.filter((a) => a.pairingId === pairing.id)}
              onInitiateAction={(id) => console.log("Initiate action for", id)}
            />
          ))}
        </div>
      </div>
    </TreasuryShell>
  );
}
