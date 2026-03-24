import { useState } from "react";
import TreasuryShell from "@/components/TreasuryShell";
import { DashboardHeader } from "@/components/netting/DashboardHeader";
import { ColumnHeaders } from "@/components/netting/ColumnHeaders";
import {
  MOCK_PAIRINGS, MOCK_ACTIONS, MOCK_COMPLETED_ACTIONS,
  SETTLEMENT_TYPES, type TxType, type Action,
} from "@/components/netting/types";

function PlaceholderRow({ id }: { id: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[2fr_2fr_1.5fr] border-b border-gray-100 min-h-[80px]">
      {[0, 1, 2].map((i) => (
        <div key={i} className={`px-5 py-4 ${i > 0 ? "border-t sm:border-t-0 sm:border-l border-gray-100" : ""}`}>
          <div className="h-3 w-24 bg-gray-100 rounded animate-pulse mb-2" />
          <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

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
            <PlaceholderRow key={pairing.id} id={pairing.id} />
          ))}
        </div>
      </div>
    </TreasuryShell>
  );
}
