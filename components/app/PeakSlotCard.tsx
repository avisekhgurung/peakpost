"use client";

import { Clock, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { dayName, formatTime } from "@/lib/utils";
import type { PeakSlot } from "@/types";

export function PeakSlotCard({ slot, rank }: { slot: PeakSlot; rank: number }) {
  const isTop = rank === 1;
  return (
    <div
      className={
        isTop
          ? "relative rounded-2xl bg-gradient-to-br from-accent/20 via-magenta/10 to-transparent border border-accent/40 p-5 shadow-glow overflow-hidden"
          : "relative rounded-2xl bg-surface border border-border p-5 hover:border-border-strong transition-colors overflow-hidden"
      }
    >
      {isTop ? (
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/30 blur-3xl rounded-full" />
      ) : null}
      <div className="relative flex items-start justify-between mb-4">
        <Badge tone={isTop ? "pro" : "neutral"}>#{rank} slot</Badge>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-widest text-text-muted">
            Score
          </div>
          <div className="font-display text-2xl font-semibold text-gradient-accent">
            {slot.score}
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center gap-1 text-text-muted text-sm mb-1">
          <Clock className="h-3.5 w-3.5" /> {dayName(slot.day)}
        </div>
        <div className="font-display text-3xl font-semibold tracking-tight">
          {formatTime(slot.hour, slot.minute)}
        </div>
      </div>

      <div className="mt-4 h-1.5 rounded-full bg-bg-elevated overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent via-magenta to-cyan"
          style={{ width: `${slot.score}%` }}
        />
      </div>

      <p className="relative mt-4 text-sm text-text-muted leading-relaxed line-clamp-3">
        {slot.reason}
      </p>

      <div className="relative mt-4 flex items-center gap-3 text-xs text-text-muted">
        <span className="inline-flex items-center gap-1">
          <Users className="h-3 w-3" /> {slot.audienceOnlinePct}% online
        </span>
        <span className="inline-flex items-center gap-1">
          <TrendingUp className="h-3 w-3 text-success" />
          high reach
        </span>
      </div>

      <div className="relative mt-5">
        <Link href={`/upload?day=${slot.day}&hour=${slot.hour}&min=${slot.minute}`}>
          <Button
            variant={isTop ? "primary" : "secondary"}
            size="sm"
            className="w-full"
          >
            Schedule a post here
          </Button>
        </Link>
      </div>
    </div>
  );
}
