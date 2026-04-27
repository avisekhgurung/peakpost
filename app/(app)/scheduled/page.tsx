"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Video,
  Image as ImageIcon,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { PageHeader } from "@/components/app/AppShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { cn, formatNumber, relativeFromNow } from "@/lib/utils";
import { mockScheduled } from "@/lib/mock";
import type { ScheduledPost } from "@/types";

export default function ScheduledPage() {
  const toast = useToast();
  const [posts, setPosts] = useState<ScheduledPost[]>(mockScheduled);
  const [filter, setFilter] = useState<"all" | "pending" | "published" | "failed">("all");

  const filtered = posts.filter((p) => filter === "all" || p.status === filter);
  const pending = posts.filter((p) => p.status === "pending");
  const published = posts.filter((p) => p.status === "published");

  function cancel(id: string) {
    setPosts((arr) => arr.filter((p) => p.id !== id));
    toast.push({ tone: "success", title: "Post cancelled" });
  }

  return (
    <div className="px-4 sm:px-5 md:px-8 py-6 md:py-8 max-w-6xl">
      <PageHeader
        title="Scheduled"
        description="Everything queued, published, and waiting in line."
      >
        <Link href="/upload">
          <Button>
            <Plus className="h-4 w-4" /> New post
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
        <MiniStat label="Pending" value={pending.length.toString()} icon={Clock} tone="accent" />
        <MiniStat
          label="Published"
          value={published.length.toString()}
          icon={CheckCircle2}
          tone="success"
        />
        <MiniStat label="Total reach" value={formatNumber(
          published.reduce((s, p) => s + (p.estimatedReach ?? 0), 0)
        )} icon={Zap} tone="neutral" />
      </div>

      <div className="flex items-center gap-2 mb-5 overflow-x-auto -mx-2 px-2 pb-1">
        {(["all", "pending", "published", "failed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "h-9 px-4 rounded-full text-sm font-medium border transition-colors capitalize whitespace-nowrap",
              filter === f
                ? "border-accent bg-accent/10 text-accent-glow"
                : "border-border text-text-muted hover:text-text"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <PostRow key={p.id} post={p} onCancel={cancel} />
          ))}
        </div>
      )}
    </div>
  );
}

function MiniStat({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: typeof Clock;
  tone: "accent" | "success" | "neutral";
}) {
  const colors = {
    accent: "text-accent-glow",
    success: "text-success",
    neutral: "text-text-muted",
  };
  return (
    <div className="rounded-2xl border border-border bg-surface p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
      <div
        className={cn(
          "h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-bg-elevated grid place-items-center flex-shrink-0",
          colors[tone]
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] sm:text-xs uppercase tracking-wider text-text-muted truncate">
          {label}
        </div>
        <div className="font-display text-lg sm:text-xl font-semibold truncate">
          {value}
        </div>
      </div>
    </div>
  );
}

function PostRow({
  post,
  onCancel,
}: {
  post: ScheduledPost;
  onCancel: (id: string) => void;
}) {
  const date = new Date(post.scheduledAt);
  const dateStr = date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timeStr = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 md:p-5 flex flex-col md:flex-row gap-4 md:gap-5 group hover:border-border-strong transition-colors">
      <img
        src={post.thumbnailUrl}
        alt=""
        className="h-24 w-full md:h-20 md:w-20 rounded-xl object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          {post.mediaType === "REELS" ? (
            <Badge tone="accent">
              <Video className="h-3 w-3" /> Reel
            </Badge>
          ) : (
            <Badge tone="neutral">
              <ImageIcon className="h-3 w-3" /> Photo
            </Badge>
          )}
          <Badge tone={post.autoPublish ? "pro" : "neutral"}>
            {post.autoPublish ? (
              <>
                <Zap className="h-3 w-3" /> Auto-publish
              </>
            ) : (
              <>
                <Clock className="h-3 w-3" /> Reminder
              </>
            )}
          </Badge>
          <StatusBadge status={post.status} />
          <span className="text-xs text-text-muted capitalize">{post.contentType}</span>
        </div>
        <p className="text-sm leading-snug line-clamp-2">{post.caption}</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {dateStr} · {timeStr}
          </span>
          <span>{relativeFromNow(date)}</span>
          {post.estimatedReach ? (
            <span className="inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-accent-glow" />
              ~{formatNumber(post.estimatedReach)} est. reach
            </span>
          ) : null}
        </div>
      </div>
      {post.status === "pending" ? (
        <div className="flex md:flex-col gap-2 md:items-end">
          <Button
            variant="danger"
            size="sm"
            onClick={() => onCancel(post.id)}
            className="md:w-auto w-full"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Cancel
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function StatusBadge({ status }: { status: ScheduledPost["status"] }) {
  if (status === "pending")
    return (
      <Badge tone="warning">
        <Clock className="h-3 w-3" /> Pending
      </Badge>
    );
  if (status === "published")
    return (
      <Badge tone="success">
        <CheckCircle2 className="h-3 w-3" /> Published
      </Badge>
    );
  if (status === "failed")
    return (
      <Badge tone="danger">
        <AlertTriangle className="h-3 w-3" /> Failed
      </Badge>
    );
  return <Badge>{status}</Badge>;
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-surface/40 p-10 md:p-14 text-center">
      <div className="mx-auto h-16 w-16 rounded-2xl bg-bg-elevated grid place-items-center mb-4">
        <Calendar className="h-7 w-7 text-text-muted" />
      </div>
      <h3 className="font-display text-xl font-semibold tracking-tight">Nothing in the queue</h3>
      <p className="mt-2 text-text-muted max-w-md mx-auto">
        Drop your first Reel and we&apos;ll line it up for your next peak window.
      </p>
      <Link href="/upload" className="inline-block mt-6">
        <Button>
          <Plus className="h-4 w-4" /> Schedule a post
        </Button>
      </Link>
    </div>
  );
}
