// @ds-molecule — composed from DS atoms + TSW domain logic
import React from "react";
import type { FlaggedTxn } from "@/lib/types";
import { Badge } from "@/components/atoms/Badge";

interface RiskScoreBadgeProps {
  txn: FlaggedTxn;
  size?: "sm" | "lg";
  className?: string;
}

function RiskScoreBadgeInner({ txn, size = "sm", className }: RiskScoreBadgeProps) {
  return <Badge variant="riskScore" txn={txn} size={size} className={className} />;
}

export const RiskScoreBadge = React.memo(RiskScoreBadgeInner);
