import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-xl bg-bg-elevated border border-border px-4 text-sm text-text placeholder:text-text-dim",
        "focus:border-accent focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent/30",
        "transition-colors",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[120px] w-full rounded-xl bg-bg-elevated border border-border px-4 py-3 text-sm text-text placeholder:text-text-dim resize-y",
        "focus:border-accent focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent/30",
        "transition-colors",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export function Label({ children, htmlFor, className }: { children: React.ReactNode; htmlFor?: string; className?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("text-xs font-medium uppercase tracking-wider text-text-muted mb-2 block", className)}
    >
      {children}
    </label>
  );
}
