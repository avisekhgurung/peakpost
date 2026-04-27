import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  delta?: number;
  icon?: LucideIcon;
  hint?: string;
}) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="rounded-2xl bg-surface border border-border p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-text-muted">{label}</div>
        {Icon ? (
          <div className="h-8 w-8 rounded-lg bg-bg-elevated border border-border grid place-items-center">
            <Icon className="h-4 w-4 text-accent-glow" />
          </div>
        ) : null}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <div className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
          {value}
        </div>
        {delta !== undefined ? (
          <div
            className={cn(
              "inline-flex items-center text-xs font-medium",
              positive ? "text-success" : "text-danger"
            )}
          >
            {positive ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {Math.abs(delta)}%
          </div>
        ) : null}
      </div>
      {hint ? (
        <div className="mt-1 text-xs text-text-dim">{hint}</div>
      ) : null}
    </div>
  );
}
