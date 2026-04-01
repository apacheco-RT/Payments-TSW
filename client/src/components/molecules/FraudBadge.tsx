// @ds-molecule — composed from DS atoms + TSW domain logic
import { Badge } from "@/components/atoms/Badge";

interface FraudBadgeProps {
  risk: number;
  reason: string | null;
  className?: string;
}

export function FraudBadge({ risk, reason, className }: FraudBadgeProps) {
  return <Badge variant="fraud" risk={risk} reason={reason} className={className} />;
}
