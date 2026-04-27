"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  Eye,
  Bookmark,
  Heart,
  TrendingUp,
  Sparkles,
  Sunrise,
  Instagram,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/app/AppShell";
import { StatCard } from "@/components/app/StatCard";
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatNumber, formatTime } from "@/lib/utils";
import type { AnalyticsData } from "@/lib/analytics-data";

export function AnalyticsClient({ data }: { data: AnalyticsData }) {
  if (!data.hasIG) {
    return (
      <div className="px-4 sm:px-5 md:px-8 py-6 md:py-8 max-w-7xl">
        <PageHeader title="Analytics" />
        <div className="rounded-3xl border border-border bg-surface p-8 md:p-12 text-center">
          <Instagram className="h-12 w-12 mx-auto text-magenta mb-4" />
          <h2 className="font-display text-2xl font-semibold">
            Connect Instagram to see analytics
          </h2>
          <a href="/api/auth/meta" className="inline-block mt-6">
            <Button>Connect Instagram</Button>
          </a>
        </div>
      </div>
    );
  }

  if (data.posts.length === 0) {
    return (
      <div className="px-4 sm:px-5 md:px-8 py-6 md:py-8 max-w-7xl">
        <PageHeader
          title="Analytics"
          description={`@${data.username} · No posts yet to analyze`}
        />
        {data.metaError && (
          <div className="mb-6 rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
            <p className="text-sm text-text-muted">{data.metaError}</p>
          </div>
        )}
        <div className="rounded-3xl border border-border bg-surface p-10 text-center">
          <p className="text-text-muted">
            Once you publish to Instagram, your reach, saves, and audience trends
            will appear here.
          </p>
        </div>
      </div>
    );
  }

  const { totals, byMediaType, viewsOverTime, audienceHours, audienceDataAvailable } = data;

  return (
    <div className="px-4 sm:px-5 md:px-8 py-6 md:py-8 max-w-7xl">
      <PageHeader
        title="Analytics"
        description={`@${data.username} · Last ${data.posts.length} post${
          data.posts.length === 1 ? "" : "s"
        }`}
      />

      {data.metaError && (
        <div className="mb-6 rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
          <p className="text-sm text-text-muted">{data.metaError}</p>
        </div>
      )}

      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Avg views"
          value={totals ? formatNumber(totals.avgViews) : "—"}
          icon={Eye}
        />
        <StatCard
          label="Best views"
          value={totals ? formatNumber(totals.bestViews) : "—"}
          icon={Heart}
        />
        <StatCard
          label="Total saves"
          value={totals ? formatNumber(totals.totalSaves) : "—"}
          icon={Bookmark}
        />
        <StatCard
          label="Best day"
          value={data.bestDayName ?? "—"}
          icon={Sunrise}
          hint={
            data.bestHour !== null
              ? `Peak hour ${formatTime(data.bestHour, 0)}`
              : undefined
          }
        />
      </div>

      {/* Recommendation */}
      {data.bestDayName && data.bestHour !== null && (
        <div className="rounded-3xl bg-gradient-to-br from-accent/15 via-magenta/8 to-cyan/8 border border-accent/30 p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-30 mask-fade-r" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent/30 blur-3xl rounded-full" />
          <div className="relative">
            <Badge tone="accent" className="mb-3">
              <Sparkles className="h-3 w-3" /> Smart recommendation
            </Badge>
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight max-w-3xl text-balance">
              Your highest-view posts go live on{" "}
              <span className="text-gradient-accent">
                {data.bestDayName}s around {formatTime(data.bestHour, 0)}
              </span>
              .
            </h2>
            <p className="mt-3 text-text-muted max-w-2xl leading-relaxed">
              Based on your last {data.posts.length} Instagram post
              {data.posts.length === 1 ? "" : "s"} and your followers&apos; online
              hours.
            </p>
          </div>
        </div>
      )}

      {/* Reach over time */}
      <div className="grid lg:grid-cols-3 gap-5 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Views over time</CardTitle>
                <CardDescription>
                  Last {viewsOverTime.length} post
                  {viewsOverTime.length === 1 ? "" : "s"} (oldest → newest)
                </CardDescription>
              </div>
              <Badge tone="success">
                <TrendingUp className="h-3 w-3" /> Live data
              </Badge>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-64 -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={viewsOverTime}>
                  <defs>
                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#7c6cff" />
                      <stop offset="100%" stopColor="#ff5cb1" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#22222e" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="#48465c"
                    tick={{ fill: "#6b6880", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#48465c"
                    tick={{ fill: "#6b6880", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => formatNumber(v)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#13131c",
                      border: "1px solid #22222e",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                    cursor={{ stroke: "#7c6cff", strokeWidth: 1 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="url(#viewsGrad)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: "#7c6cff" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Followers online</CardTitle>
            <CardDescription>By hour of day</CardDescription>
          </CardHeader>
          <CardBody>
            {audienceDataAvailable ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={audienceHours.map((v, h) => ({ hour: h, value: v }))}>
                    <XAxis
                      dataKey="hour"
                      stroke="#48465c"
                      tick={{ fill: "#6b6880", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      interval={3}
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#13131c",
                        border: "1px solid #22222e",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                      cursor={{ fill: "rgba(124,108,255,0.08)" }}
                      formatter={(v: number) => [`${v}%`, "online"]}
                      labelFormatter={(h: number) => formatTime(h, 0)}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {audienceHours.map((v, h) => (
                        <Cell
                          key={h}
                          fill={
                            h === data.bestHour
                              ? "#7c6cff"
                              : v > 50
                              ? "#5e4cc7"
                              : "#2d2d3d"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-text-muted">
                Audience-online data isn&apos;t available yet. Instagram needs
                ~7 days of activity from your followers before it returns this
                metric.
              </p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Media type performance */}
      {byMediaType.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Performance by media type</CardTitle>
            <CardDescription>Average views per format</CardDescription>
          </CardHeader>
          <CardBody>
            <div className="h-64 -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byMediaType}>
                  <CartesianGrid
                    stroke="#22222e"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="type"
                    stroke="#48465c"
                    tick={{ fill: "#6b6880", fontSize: 11 }}
                    tickFormatter={(v: string) =>
                      v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()
                    }
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#48465c"
                    tick={{ fill: "#6b6880", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => formatNumber(v)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#13131c",
                      border: "1px solid #22222e",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                    cursor={{ fill: "rgba(124,108,255,0.08)" }}
                    formatter={(v: number) => formatNumber(v)}
                  />
                  <Bar dataKey="avg" radius={[8, 8, 0, 0]}>
                    {byMediaType.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={
                          entry.avg ===
                          Math.max(...byMediaType.map((b) => b.avg))
                            ? "#7c6cff"
                            : "#2d2d3d"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Top posts */}
      <Card>
        <CardHeader>
          <CardTitle>Top performing posts</CardTitle>
          <CardDescription>Sorted by views</CardDescription>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {[...data.posts]
              .filter((p) => (p.views || p.reach) > 0)
              .sort((a, b) => (b.views || b.reach) - (a.views || a.reach))
              .slice(0, 5)
              .map((p, i) => {
                const Wrapper = p.permalink ? "a" : "div";
                const wrapperProps = p.permalink
                  ? {
                      href: p.permalink,
                      target: "_blank" as const,
                      rel: "noopener noreferrer",
                    }
                  : {};
                return (
                  <Wrapper
                    key={p.id}
                    {...wrapperProps}
                    className="flex items-center gap-4 rounded-xl border border-border bg-bg-elevated p-3 hover:bg-surface-hover transition-colors"
                  >
                    <span className="font-display text-xl font-semibold text-text-dim w-6 text-center">
                      {i + 1}
                    </span>
                    {p.thumbnailUrl ? (
                      <img
                        src={p.thumbnailUrl}
                        alt=""
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-bg flex items-center justify-center">
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
                      <div className="text-xs text-text-muted mt-0.5 capitalize">
                        {p.mediaType.toLowerCase()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-text-muted">Views</div>
                      <div className="font-semibold">
                        {formatNumber(p.views || p.reach)}
                      </div>
                    </div>
                  </Wrapper>
                );
              })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
