"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-ring select-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-6 text-base",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-[0_8px_24px_-8px_rgba(124,108,255,0.6)] hover:bg-accent-glow hover:shadow-[0_10px_30px_-8px_rgba(124,108,255,0.8)]",
  secondary:
    "bg-surface text-text border border-border hover:bg-surface-hover hover:border-border-strong",
  ghost: "text-text-muted hover:text-text hover:bg-surface",
  outline: "bg-transparent border border-border text-text hover:bg-surface hover:border-accent",
  danger: "bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  )
);
Button.displayName = "Button";
