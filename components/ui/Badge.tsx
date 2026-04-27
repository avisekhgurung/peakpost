import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger" | "pro" | "free";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-hover text-text-muted border-border",
  accent: "bg-accent/15 text-accent-glow border-accent/30",
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  danger: "bg-danger/15 text-danger border-danger/30",
  pro: "bg-gradient-to-r from-accent to-magenta text-white border-transparent",
  free: "bg-surface-hover text-text-muted border-border",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border tracking-wide uppercase",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
