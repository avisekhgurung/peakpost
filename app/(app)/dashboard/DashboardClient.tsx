"use client";

import Link from "next/link";
import {
  Eye,
  Heart,
  Bookmark,
  Sparkles,
  Plus,
  ArrowRight,
  CheckCircle2,
  Instagram,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/app/AppShell";
import { PeakSlotCard } from "@/components/app/PeakSlotCard";
import { StatCard } from "@/components/app/StatCard";
import { PeakClock } from "@/components/marketing/PeakClock";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatNumber, dayName, formatTime, relativeFromNow } from "@/lib/utils";
import type { DashboardData } from "@/lib/dashboard-data";

export function DashboardClient({ data }: { data: DashboardData }) {
  const firstName =
    data.user.name?.split(" ")[0] ||
    data.account?.username ||
    data.user.email.split("@")[0];

  // No IG account connected
  if (!data.account) {
    return (
      <div className="px-4 sm:px-5 md:px-8 py-6 md:py-8 max-w-7xl">
        <PageHeader
          title={`Hey ${firstName} 👋`}
          description="One step left — connect Instagram to unlock your peak times."
        />
        <div className="rounded-3xl bg-gradient-to-br from-accent/10 via-bg-elevated to-magenta/5 border border-border p-8 md:p-12 text-center">
          <Instagram className="h-12 w-12 mx-auto text-magenta mb-4" />
          <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
            Connect your Instagram
          </h2>
          <p className="mt-3 text-text-muted max-w-lg mx-auto">
            We&apos;ll fetch your audience-online hours and last 30 posts to
            calculate the best times to post.
          </p>
          <a href="/api/auth/meta" className="inline-block mt-6">
            <Button size="lg">
              <Instagram className="h-4 w-4" />
              Connect Instagram
            </Button>
          </a>
        </div>
      </div>
    );
  }

  const account = data.account;
  const slots = data.slots;
  const totals = data.totals;
  const recent = data.recentPosts;

  return (
    <div className="px-4 sm:px-5 md:px-8 py-6 md:py-8 max-w-7xl">
      <PageHeader
        title={`Hey ${firstName} 👋`}
        description="Here's where your audience is hanging out this week."
      >
        <Link href="/upload">
          <Button>
            <Plus className="h-4 w-4" /> Schedule a post
          </Button>
        </Link>
      </PageHeader>

      {data.metaError && (
        <div className="mb-6 rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">Heads up</p>
            <p className="text-text-muted">{data.metaError}</p>
            <a
              href="/api/auth/meta"
              className="text-accent-glow hover:underline text-xs mt-1 inline-block"
            >
              Reconnect Instagram →
            </a>
          </div>
        </div>
      )}

      {/* IG Account Card */}
      <div className="rounded-2xl bg-surface border border-border p-4 md:p-6 flex items-center gap-3 md:gap-6 mb-6 md:mb-8">
        {account.profilePictureUrl ? (
          <img
            src={account.profilePictureUrl}
            alt={account.username}
            className="h-12 w-12 md:h-20 md:w-20 rounded-2xl ring-2 ring-accent/40 flex-shrink-0 object-cover"
          />
        ) : (
          <div className="h-12 w-12 md:h-20 md:w-20 rounded-2xl ring-2 ring-accent/40 bg-bg-elevated flex items-center justify-center flex-shrink-0">
            <Instagram className="h-5 w-5 md:h-7 md:w-7 text-magenta" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Instagram className="h-4 w-4 text-magenta flex-shrink-0" />
            <span className="font-display text-base md:text-xl font-semibold truncate">
              @{account.username}
            </span>
            <Badge tone="success" className="hidden sm:inline-flex">
              <CheckCircle2 className="h-3 w-3" /> Connected
            </Badge>
          </div>
          <div className="mt-1.5 md:mt-3 flex flex-wrap items-center gap-x-4 md:gap-x-6 gap-y-1 text-sm">
            <span>
              <span className="font-semibold">{formatNumber(account.followersCount)}</span>{" "}
              <span className="text-text-muted">followers</span>
            </span>
          </div>
        </div>
        <Link href="/analytics" className="hidden md:block md:self-center flex-shrink-0">
          <Button variant="secondary" size="sm">
            View analytics <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Hero peak time OR no-data state */}
      {data.audienceDataAvailable && slots.length > 0 ? (
        <div className="rounded-3xl bg-gradient-to-br from-accent/10 via-bg-elevated to-magenta/5 border border-border overflow-hidden mb-6 md:mb-8 relative">
          <div className="absolute inset-0 grid-bg opacity-30 mask-fade-r pointer-events-none" />
          <div className="relative grid md:grid-cols-[auto_1fr] gap-4 md:gap-10 p-4 md:p-8 items-center">
            <div className="mx-auto md:mx-0 w-full max-w-[200px] sm:max-w-[240px] md:max-w-none">
              <PeakClock
                data={data.audienceHours}
                size={260}
                highlight={slots[0].hour}
              />
            </div>
            <div className="min-w-0">
              <Badge tone="accent" className="mb-2 md:mb-3">
                <Sparkles className="h-3 w-3" /> Top window this week
              </Badge>
              <h2 className="font-display text-xl sm:text-2xl md:text-4xl font-semibold tracking-tight text-balance">
                Post on{" "}
                <span className="text-gradient-accent">
                  {dayName(slots[0].day)} at{" "}
                  {formatTime(slots[0].hour, slots[0].minute)}
                </span>
              </h2>
              <p className="mt-2 md:mt-3 text-sm md:text-base text-text-muted leading-relaxed max-w-xl">
                {slots[0].reason}
              </p>
              <div className="mt-4 md:mt-5 flex flex-wrap gap-2">
                <Link
                  href={`/upload?day=${slots[0].day}&hour=${slots[0].hour}&min=${slots[0].minute}`}
                >
                  <Button>
                    Use this slot <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button variant="secondary">See full forecast</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-surface p-8 md:p-10 mb-8 text-center">
          <Sparkles className="h-8 w-8 mx-auto text-text-muted mb-3" />
          <h2 className="font-display text-xl md:text-2xl font-semibold">
            Gathering your audience data
          </h2>
          <p className="mt-2 text-text-muted max-w-md mx-auto">
            Instagram needs a few days of audience-online data before we can
            calculate your peak times. Check back in 24–48 hours.
          </p>
        </div>
      )}

      {/* Top 3 windows — only if data available */}
      {slots.length > 0 && (
        <>
          <h3 className="font-display text-lg font-semibold tracking-tight mb-4">
            Your top {slots.length} window{slots.length > 1 ? "s" : ""}
          </h3>
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {slots.map((slot, i) => (
              <PeakSlotCard key={i} slot={slot} rank={i + 1} />
            ))}
          </div>
        </>
      )}

      {/* Stats row */}
      {totals && (
        <>
          <h3 className="font-display text-lg font-semibold tracking-tight mb-4">
            Recent performance
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard
              label="Avg views"
              value={formatNumber(totals.avgViews)}
              icon={Eye}
              hint={`Last ${totals.postsAnalyzed} posts`}
            />
            <StatCard
              label="Best views"
              value={formatNumber(totals.bestViews)}
              icon={Heart}
            />
            <StatCard
              label="Total saves"
              value={formatNumber(totals.totalSaves)}
              icon={Bookmark}
            />
            <StatCard
              label="Pending posts"
              value={String(data.scheduledCount)}
              icon={Sparkles}
              hint={data.scheduledCount > 0 ? "View in Scheduled" : "None scheduled"}
            />
          </div>
        </>
      )}

      {/* Recent posts */}
      {recent.length > 0 ? (
        <>
          <div className="flex items-end justify-between mb-4">
            <h3 className="font-display text-lg font-semibold tracking-tight">
              Recent posts
            </h3>
            <Link
              href="/analytics"
              className="text-sm text-text-muted hover:text-text inline-flex items-center gap-1"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="rounded-2xl border border-border bg-surface overflow-hidden">
            {recent.slice(0, 5).map((p, i) => {
              const Wrapper = p.permalink ? "a" : "div";
              const wrapperProps = p.permalink
                ? { href: p.permalink, target: "_blank", rel: "noopener noreferrer" }
                : {};
              return (
                <Wrapper
                  key={p.id}
                  {...wrapperProps}
                  className={
                    (i > 0
                      ? "flex items-center gap-4 px-4 md:px-5 py-4 border-t border-border "
                      : "flex items-center gap-4 px-4 md:px-5 py-4 ") +
                    "hover:bg-surface-hover transition-colors"
                  }
                >
                  {p.thumbnailUrl ? (
                    <img
                      src={p.thumbnailUrl}
                      alt=""
                      className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-bg-elevated flex items-center justify-center flex-shrink-0">
                      <Instagram className="h-5 w-5 text-magenta" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">
                      {p.caption?.trim() || (
                        <span className="text-text-muted italic">
                          {p.mediaType.toLowerCase()} (no caption)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {relativeFromNow(new Date(p.postedAt))} · {p.mediaType.toLowerCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 md:gap-6 text-xs">
                    <div className="text-right">
                      <div className="text-text-muted">Views</div>
                      <div className="font-semibold">
                        {formatNumber(p.views || p.reach)}
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-text-muted">Likes</div>
                      <div className="font-semibold">{formatNumber(p.likes)}</div>
                    </div>
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          <p className="text-text-muted">
            No published posts yet. Once you post, performance will show up here.
          </p>
        </div>
      )}
    </div>
  );
}
