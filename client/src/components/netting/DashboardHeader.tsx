import { useState } from "react";
import { Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { SETTLEMENT_TYPES, type TxType } from "./types";

interface DashboardHeaderProps {
  startPoint: Date;
  onStartPointChange: (date: Date) => void;
  selectedTypes: TxType[];
  onTypesChange: (types: TxType[]) => void;
}

export function DashboardHeader({
  startPoint, onStartPointChange, selectedTypes, onTypesChange,
}: DashboardHeaderProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  const allSelected = selectedTypes.length === SETTLEMENT_TYPES.length;

  function toggleType(type: TxType) {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  }

  function toggleAll() {
    onTypesChange(allSelected ? [] : [...SETTLEMENT_TYPES]);
  }

  const dateValue = startPoint.toISOString().slice(0, 16);

  return (
    <div className="flex flex-wrap items-center gap-3 px-4 sm:px-6 py-3 border-b border-gray-100 bg-white">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        <label className="text-xs text-gray-500 font-medium">From</label>
        <input
          type="datetime-local"
          value={dateValue}
          onChange={(e) => onStartPointChange(new Date(e.target.value))}
          className="text-sm border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>

      <div className="w-px h-5 bg-gray-200" />

      <Popover open={filterOpen} onOpenChange={setFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
            <Filter className="w-3.5 h-3.5" />
            {allSelected
              ? "All types"
              : `${selectedTypes.length} of ${SETTLEMENT_TYPES.length} types`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="start">
          <div className="space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Checkbox
                id="all-types"
                checked={allSelected}
                onCheckedChange={() => toggleAll()}
              />
              <label htmlFor="all-types" className="text-xs font-semibold text-gray-700 cursor-pointer">
                All types
              </label>
            </div>
            {SETTLEMENT_TYPES.map((type) => (
              <div key={type} className="flex items-center gap-2">
                <Checkbox
                  id={type}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={() => toggleType(type)}
                />
                <label htmlFor={type} className="text-xs text-gray-600 cursor-pointer">
                  {type}
                </label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        USD
      </div>
    </div>
  );
}
