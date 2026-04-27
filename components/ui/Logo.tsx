import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div className="relative h-8 w-8 rounded-xl bg-accent-gradient overflow-hidden flex items-center justify-center shadow-glow">
        <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />
        <svg viewBox="0 0 24 24" fill="none" className="relative h-5 w-5 text-white">
          <path
            d="M12 2.5l2.4 4.86 5.36.78-3.88 3.78.92 5.34L12 14.74l-4.8 2.52.92-5.34L4.24 8.14l5.36-.78L12 2.5z"
            fill="currentColor"
            opacity="0.95"
          />
        </svg>
      </div>
      <span className="font-display text-lg font-semibold tracking-tight">PeakPost</span>
    </div>
  );
}
