// @ds-candidate — generic primitive, Phase 3 contribution candidate
import React from "react";
import { Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FlaggedTxn } from "@/lib/types";
import { displayScore, scoreColors, isAnomaly } from "@/lib/mock-data";
import { StatusPill, UrgencyBadge, StatusRing } from "@ds-foundation/react";

export function getRiskColors(risk: number) {
  const hi = risk >= 70;
  const md = risk >= 40;
  return {
    border: hi ? "border-[var(--ds-color-feedback-error-border)]"   : md ? "border-[var(--ds-color-feedback-warning-border)]"   : "border-[var(--ds-color-feedback-success-border)]",
    text:   hi ? "text-[var(--ds-color-feedback-error-text)]"       : md ? "text-[var(--ds-color-feedback-warning-text)]"       : "text-[var(--ds-color-feedback-success-text)]",
    reason: hi ? "text-[var(--ds-color-feedback-error-text)]"       : md ? "text-[var(--ds-color-feedback-warning-text)]"       : "text-[var(--ds-color-feedback-success-text)]",
    bg:     hi ? "bg-[var(--ds-color-feedback-error-bg)]"           : md ? "bg-[var(--ds-color-feedback-warning-bg)]"           : "bg-[var(--ds-color-feedback-success-bg)]",
    label: hi ? "HIGH" as const : md ? "MED" as const : "LOW" as const,
    isHigh: hi,
  };
}

interface StatusBadgeProps {
  variant: "status";
  status: string;
  next: string;
  overdue: boolean;
  className?: string;
}

interface FraudBadgeProps {
  variant: "fraud";
  risk: number;
  reason: string | null;
  className?: string;
}

interface RiskScoreBadgeProps {
  variant: "riskScore";
  txn: FlaggedTxn;
  size?: "sm" | "lg";
  className?: string;
}

type BadgeProps = StatusBadgeProps | FraudBadgeProps | RiskScoreBadgeProps;

function StatusBadgeContent({ status, next, overdue, className }: Omit<StatusBadgeProps, "variant">) {
  // Delegate terminal error states to DS StatusPill
  if (!overdue && status === "Failed") {
    return (
      <div className={cn("flex items-center gap-1 text-xs flex-wrap", className)}>
        <StatusPill status="failed" />
        <ArrowRight className="w-2.5 h-2.5 text-[var(--ds-color-text-secondary)]" aria-hidden="true" />
        <span className="text-[var(--ds-color-text-secondary)] text-xs">{next}</span>
      </div>
    );
  }
  const s = status;
  const cls =
    overdue                      ? "bg-[var(--ds-color-feedback-error-bg)] border-[var(--ds-color-feedback-error-border)] text-[var(--ds-color-feedback-error-text)]"
    : s === "Under Review"     ? "bg-[var(--ds-color-feedback-warning-bg)] border-[var(--ds-color-feedback-warning-border)] text-[var(--ds-color-feedback-warning-text)]"
    : s === "Needs Approval"   ? "bg-[var(--ds-color-feedback-warning-bg)] border-[var(--ds-color-feedback-warning-border)] text-[var(--ds-color-feedback-warning-text)]"
    : s === "Ready to Approve" ? "bg-[var(--ds-color-feedback-info-bg)] border-[var(--ds-color-feedback-info-border)] text-[var(--ds-color-feedback-info-text)]"
    : s === "Ready to Extract" ? "bg-[var(--ds-color-brand-primary-subtle)] border-[var(--ds-color-brand-primary)] text-[var(--ds-color-brand-primary)]"
    : s === "Extracted"        ? "bg-[var(--ds-color-feedback-info-bg)] border-[var(--ds-color-feedback-info-border)] text-[var(--ds-color-feedback-info-text)]"
    : s === "Confirmed"        ? "bg-[var(--ds-color-feedback-info-bg)] border-[var(--ds-color-feedback-info-border)] text-[var(--ds-color-feedback-info-text)]"
    : s === "Processing"       ? "bg-[var(--ds-color-feedback-info-bg)] border-[var(--ds-color-feedback-info-border)] text-[var(--ds-color-feedback-info-text)]"
    : s === "Approved"         ? "bg-[var(--ds-color-feedback-success-bg)] border-[var(--ds-color-feedback-success-border)] text-[var(--ds-color-feedback-success-text)]"
    : s === "Failed"           ? "bg-[var(--ds-color-feedback-error-bg)] border-[var(--ds-color-feedback-error-border)] text-[var(--ds-color-feedback-error-text)]"
    : s === "Void"             ? "bg-[var(--ds-color-surface-raised)]/50 border-[var(--ds-color-border-default)]/50 text-[var(--ds-color-text-secondary)]"
    : s === "Draft"            ? "bg-[var(--ds-color-feedback-info-bg)] border-[var(--ds-color-feedback-info-border)] text-[var(--ds-color-feedback-info-text)]"
    :                            "bg-[var(--ds-color-surface-raised)]/30 border-[var(--ds-color-border-default)]/40 text-[var(--ds-color-text-secondary)]";
  return (
    <div className={cn("flex items-center gap-1 text-xs flex-wrap", className)}>
      <span className={`inline-flex items-center h-8 px-3 rounded-[var(--ds-radius-lg)] font-medium text-xs border ${cls}`}>
        {overdue && <Clock className="w-2.5 h-2.5 inline mr-1" aria-hidden="true" />}
        {status}
      </span>
      <ArrowRight className="w-2.5 h-2.5 text-[var(--ds-color-text-secondary)]" aria-hidden="true" />
      <span className="text-[var(--ds-color-text-secondary)] text-xs">{next}</span>
    </div>
  );
}

function FraudBadgeContent({ risk, reason, className }: Omit<FraudBadgeProps, "variant">) {
  const urgency = risk >= 70 ? "critical" : risk >= 40 ? "watch" : "clear";
  return (
    <div className={className}>
      <UrgencyBadge urgency={urgency} />
      {reason && <p className="text-xs mt-0.5 max-w-[140px] leading-tight text-[var(--ds-color-text-secondary)]">{reason}</p>}
    </div>
  );
}

function RiskScoreBadgeContent({ txn, size = "sm", className }: Omit<RiskScoreBadgeProps, "variant">) {
  const anomalyOnly = !txn.riskFactors.some(f => !isAnomaly(f));
  const score = displayScore(txn);
  const c = scoreColors(score, anomalyOnly);
  const lg = size === "lg";
  const urgency = score >= 75 ? "critical" : score >= 50 ? "watch" : "clear";
  return (
    <div className={cn("shrink-0 flex flex-col", className)}>
      <div className="flex items-center gap-1.5">
        <StatusRing urgency={urgency} size={lg ? "md" : "sm"} />
        <span className={cn("font-bold tabular-nums", c.text, lg ? "text-2xl" : "text-sm")}>{score}</span>
        <span className={cn("text-[var(--ds-color-text-secondary)]", lg ? "text-sm" : "text-xs")}>/100</span>
      </div>
      <span className={cn("font-bold", c.text, lg ? "text-xs mt-0.5" : "text-xs")}>{c.label}</span>
    </div>
  );
}

function BadgeInner(props: BadgeProps) {
  switch (props.variant) {
    case "status":
      return <StatusBadgeContent status={props.status} next={props.next} overdue={props.overdue} className={props.className} />;
    case "fraud":
      return <FraudBadgeContent risk={props.risk} reason={props.reason} className={props.className} />;
    case "riskScore":
      return <RiskScoreBadgeContent txn={props.txn} size={props.size} className={props.className} />;
  }
}

export const Badge = React.memo(BadgeInner);
