"use client";

import { useState } from "react";
import { Check, Sparkles, Zap, ArrowRight, Crown, Bell, BarChart3, Infinity } from "lucide-react";
import { PageHeader } from "@/components/app/AppShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

const features: { label: string; free: boolean | string; pro: boolean | string; icon?: typeof Zap }[] = [
  { label: "Peak time analysis", free: true, pro: true, icon: Sparkles },
  { label: "Reminder emails 15 min before", free: true, pro: true, icon: Bell },
  { label: "Auto-publish at peak", free: false, pro: true, icon: Zap },
  { label: "Scheduled posts / month", free: "10", pro: "Unlimited", icon: Infinity },
  { label: "Full audience heatmap", free: false, pro: true, icon: BarChart3 },
  { label: "Trending audio insights", free: false, pro: true },
  { label: "Multi-account (coming soon)", free: false, pro: true },
  { label: "Priority support", free: false, pro: true },
];

export default function UpgradePage() {
  const toast = useToast();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);

  function checkout() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.push({
        tone: "info",
        title: "Stripe checkout",
        description: "Wire up STRIPE_SECRET_KEY in .env to go live.",
      });
    }, 700);
  }

  const proPriceMonthly = 399;
  const proPriceYearly = 3990; // 2 months free

  return (
    <div className="px-4 sm:px-5 md:px-8 py-6 md:py-8 max-w-5xl">
      <PageHeader
        title="Upgrade to Pro"
        description="One coffee a month. Unlock auto-publish + unlimited scheduling."
      />

      {/* Billing toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1 rounded-full border border-border bg-surface">
          {(["monthly", "yearly"] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              className={cn(
                "h-9 px-5 rounded-full text-sm font-medium transition-colors capitalize",
                billing === b
                  ? "bg-accent text-white shadow-glow"
                  : "text-text-muted hover:text-text"
              )}
            >
              {b}
              {b === "yearly" ? (
                <span className="ml-1.5 text-[10px] uppercase tracking-wider text-success">
                  -17%
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-10">
        {/* Free */}
        <div className="rounded-3xl border border-border bg-surface p-7 relative">
          <h3 className="font-display text-xl font-semibold tracking-tight">Free</h3>
          <p className="text-text-muted text-sm mt-1">For getting started.</p>
          <div className="mt-5 flex items-baseline gap-1">
            <span className="font-display text-5xl font-semibold">₹0</span>
            <span className="text-text-muted">/ forever</span>
          </div>
          <Button variant="secondary" size="lg" disabled className="w-full mt-6">
            Current plan
          </Button>
          <ul className="mt-6 space-y-3 text-sm">
            {features
              .filter((f) => f.free)
              .map((f) => (
                <li key={f.label} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 mt-0.5 text-success flex-shrink-0" />
                  <span>
                    {f.label}
                    {typeof f.free === "string" ? (
                      <span className="text-text-muted"> — {f.free}</span>
                    ) : null}
                  </span>
                </li>
              ))}
          </ul>
        </div>

        {/* Pro */}
        <div className="relative rounded-3xl border border-accent/40 bg-gradient-to-br from-accent/15 via-magenta/8 to-cyan/5 p-7 shadow-glow overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-40 mask-fade-r pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-accent/30 blur-3xl rounded-full" />
          <Badge tone="pro" className="absolute top-7 right-7">
            <Crown className="h-3 w-3" /> Most popular
          </Badge>
          <div className="relative">
            <h3 className="font-display text-xl font-semibold tracking-tight">Pro</h3>
            <p className="text-text-muted text-sm mt-1">Auto-publish + unlimited.</p>
            <div className="mt-5 flex items-baseline gap-1">
              <span className="font-display text-5xl font-semibold text-gradient">
                ₹{billing === "monthly" ? proPriceMonthly : Math.round(proPriceYearly / 12)}
              </span>
              <span className="text-text-muted">/ month</span>
            </div>
            {billing === "yearly" ? (
              <p className="text-xs text-success mt-1">Billed ₹{proPriceYearly} yearly · save ₹798</p>
            ) : null}
            <Button size="lg" loading={loading} className="w-full mt-6" onClick={checkout}>
              Upgrade to Pro <ArrowRight className="h-4 w-4" />
            </Button>
            <ul className="mt-6 space-y-3 text-sm">
              {features.map((f) => (
                <li key={f.label} className="flex items-start gap-2.5">
                  <div className="h-4 w-4 mt-0.5 rounded-full bg-accent grid place-items-center flex-shrink-0">
                    <Check className="h-2.5 w-2.5 text-white" />
                  </div>
                  <span>
                    {f.label}
                    {typeof f.pro === "string" ? (
                      <span className="text-text-muted"> — {f.pro}</span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="rounded-2xl border border-border bg-surface p-5 md:p-6 grid md:grid-cols-3 gap-5">
        <Trust title="Cancel anytime" desc="No questions asked. Your data stays safe." />
        <Trust title="Secure payments" desc="Stripe-powered checkout, PCI-compliant." />
        <Trust title="Money-back guarantee" desc="Don't love it in 14 days? Full refund." />
      </div>
    </div>
  );
}

function Trust({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <div className="h-7 w-7 rounded-full bg-success/15 grid place-items-center">
          <Check className="h-3.5 w-3.5 text-success" />
        </div>
        <span className="font-medium text-sm">{title}</span>
      </div>
      <p className="text-xs text-text-muted leading-relaxed pl-9">{desc}</p>
    </div>
  );
}
