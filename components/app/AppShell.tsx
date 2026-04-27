"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Upload,
  BarChart3,
  CalendarClock,
  Sparkles,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { Instagram } from "lucide-react";
import type { SidebarContext } from "@/lib/user-context";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/scheduled", label: "Scheduled", icon: CalendarClock },
];

export function AppShell({
  children,
  ctx,
}: {
  children: React.ReactNode;
  ctx: SidebarContext;
}) {
  const pathname = usePathname();
  const displayName = ctx.igUsername
    ? `@${ctx.igUsername}`
    : ctx.fullName || ctx.email.split("@")[0];
  const subtitle = ctx.igUsername && ctx.fullName ? ctx.fullName : ctx.email;

  return (
    <div className="min-h-screen flex max-w-[100vw]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 border-r border-border bg-bg-elevated/50 backdrop-blur-xl">
        <div className="h-16 px-5 flex items-center border-b border-border">
          <Link href="/dashboard" className="focus-ring rounded-md">
            <Logo />
          </Link>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "bg-accent/10 text-accent-glow"
                    : "text-text-muted hover:bg-surface hover:text-text"
                )}
              >
                <Icon
                  className={cn(
                    "h-4.5 w-4.5",
                    active ? "text-accent-glow" : "text-text-dim group-hover:text-text-muted"
                  )}
                />
                <span>{item.label}</span>
                {active ? (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent-glow shadow-[0_0_8px_2px_rgba(124,108,255,0.6)]" />
                ) : null}
              </Link>
            );
          })}

          <div className="mt-6 px-3">
            <div className="text-[10px] font-medium uppercase tracking-widest text-text-dim mb-2">
              Plan
            </div>
            {ctx.plan === "free" ? (
              <Link
                href="/upgrade"
                className="block rounded-xl border border-accent/30 bg-gradient-to-br from-accent/15 to-magenta/10 p-4 hover:border-accent/50 transition-colors group"
              >
                <Badge tone="accent" className="mb-2">
                  <Sparkles className="h-3 w-3" />
                  Free plan
                </Badge>
                <p className="text-sm font-medium leading-snug">
                  Upgrade for auto-publish + unlimited schedules
                </p>
                <div className="mt-3 inline-flex items-center gap-1 text-xs text-accent-glow group-hover:gap-2 transition-all">
                  Upgrade <ChevronRight className="h-3 w-3" />
                </div>
              </Link>
            ) : null}
          </div>
        </nav>

        <div className="px-3 py-4 border-t border-border">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-surface transition-colors group cursor-pointer">
            {ctx.igProfilePictureUrl ? (
              <img
                src={ctx.igProfilePictureUrl}
                alt={displayName}
                className="h-9 w-9 rounded-full ring-2 ring-border object-cover"
              />
            ) : (
              <div className="h-9 w-9 rounded-full ring-2 ring-border bg-bg-elevated flex items-center justify-center">
                <Instagram className="h-4 w-4 text-magenta" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{displayName}</div>
              <div className="text-xs text-text-muted truncate">{subtitle}</div>
            </div>
            <Settings className="h-4 w-4 text-text-dim opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <form action="/api/auth/logout" method="post" className="mt-1">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-2 py-2 rounded-xl text-sm text-text-muted hover:bg-surface hover:text-text"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar — sticky, blurred, with safe-area inset */}
      <header className="lg:hidden fixed inset-x-0 top-0 z-40 bg-bg/85 backdrop-blur-xl border-b border-border pt-safe">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/dashboard" className="focus-ring rounded-md no-select">
            <Logo />
          </Link>
          <div className="flex items-center gap-2.5">
            {ctx.plan === "free" && (
              <Link href="/upgrade" className="tappable">
                <Badge tone="accent">
                  <Sparkles className="h-3 w-3" />
                  Upgrade
                </Badge>
              </Link>
            )}
            {ctx.igProfilePictureUrl ? (
              <img
                src={ctx.igProfilePictureUrl}
                alt={displayName}
                className="h-8 w-8 rounded-full ring-1 ring-border object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full ring-1 ring-border bg-bg-elevated flex items-center justify-center">
                <Instagram className="h-4 w-4 text-magenta" />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content — top padding for mobile header, bottom for nav + safe area */}
      <main className="flex-1 min-w-0 lg:ml-64 pt-14 lg:pt-0 pb-24 lg:pb-0 overflow-x-hidden">
        {children}
      </main>

      {/* Mobile bottom nav — safe-area padded, tappable feedback */}
      <nav className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/90 backdrop-blur-xl pb-safe no-select">
        <div className="grid grid-cols-4 max-w-md mx-auto">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="tappable relative h-16 flex flex-col items-center justify-center gap-1"
              >
                {active ? (
                  <span className="absolute top-0 inset-x-6 h-0.5 bg-gradient-to-r from-transparent via-accent-glow to-transparent" />
                ) : null}
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    active ? "text-accent-glow" : "text-text-muted"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium uppercase tracking-wider transition-colors",
                    active ? "text-accent-glow" : "text-text-dim"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 md:mb-8">
      <div>
        <h1 className="font-display text-2xl md:text-4xl font-semibold tracking-tight">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 md:mt-2 text-sm md:text-base text-text-muted">
            {description}
          </p>
        ) : null}
      </div>
      {children ? (
        <div className="flex items-center gap-2 [&>*]:tappable">{children}</div>
      ) : null}
    </div>
  );
}
