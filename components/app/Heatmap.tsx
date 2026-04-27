"use client";

import { dayName } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function Heatmap({
  data,
  highlight,
}: {
  data: number[][]; // [day][hour]
  highlight?: { day: number; hour: number };
}) {
  return (
    <div>
      <div className="overflow-x-auto -mx-2 px-2">
        <div className="min-w-[640px]">
          {/* hour labels */}
          <div className="grid grid-cols-[40px_repeat(24,minmax(0,1fr))] gap-1 mb-1">
            <div />
            {Array.from({ length: 24 }, (_, h) => (
              <div
                key={h}
                className="text-[9px] text-text-dim text-center font-mono"
              >
                {h % 4 === 0 ? (h % 12 === 0 ? 12 : h % 12) : ""}
              </div>
            ))}
          </div>
          {data.map((row, day) => (
            <div
              key={day}
              className="grid grid-cols-[40px_repeat(24,minmax(0,1fr))] gap-1 mb-1"
            >
              <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider self-center">
                {dayName(day, true)}
              </div>
              {row.map((value, hour) => {
                const isHigh = highlight?.day === day && highlight?.hour === hour;
                return (
                  <div
                    key={hour}
                    className={cn(
                      "aspect-square rounded-sm relative group",
                      isHigh
                        ? "ring-2 ring-accent shadow-[0_0_12px_2px_rgba(124,108,255,0.6)]"
                        : ""
                    )}
                    style={{
                      backgroundColor: heatColor(value),
                    }}
                    title={`${dayName(day, true)} ${hour}:00 — ${value}% online`}
                  >
                    {isHigh ? (
                      <span className="absolute -top-1.5 -right-1.5 h-2 w-2 rounded-full bg-accent-glow animate-pulse" />
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-[10px] text-text-muted">
        <span>Less</span>
        <div className="flex-1 h-1.5 max-w-[200px] rounded-full bg-gradient-to-r from-bg-elevated via-accent/50 to-magenta" />
        <span>More</span>
      </div>
    </div>
  );
}

function heatColor(value: number) {
  // 0..100 → blend
  const t = Math.max(0, Math.min(100, value)) / 100;
  if (t < 0.05) return "rgba(255,255,255,0.04)";
  if (t < 0.25) return `rgba(124, 108, 255, ${0.18 + t * 0.5})`;
  if (t < 0.6) return `rgba(168, 100, 220, ${0.4 + t * 0.4})`;
  return `rgba(255, 92, 177, ${0.55 + t * 0.4})`;
}
