import Link from "next/link";
import {
  Sparkles,
  Zap,
  TrendingUp,
  Calendar,
  Bell,
  Shield,
  ArrowRight,
  Check,
  Instagram,
  BarChart3,
  Clock,
} from "lucide-react";
import { Header } from "@/components/marketing/Header";
import { PeakClock } from "@/components/marketing/PeakClock";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Logo } from "@/components/ui/Logo";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Header />
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <ComparisonStrip />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative pt-28 md:pt-36 pb-16 md:pb-24">
      {/* atmospheric background */}
      <div className="absolute inset-0 grid-bg mask-fade-b opacity-50 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[600px] bg-grid-fade pointer-events-none" />
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-accent/15 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center">
        <div className="animate-slide-up">
          <Badge tone="accent" className="mb-5">
            <Sparkles className="h-3 w-3" />
            Now in beta — 1,200+ creators
          </Badge>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] text-balance">
            <span className="text-gradient">Post at the perfect</span>
            <br />
            <span className="text-gradient-accent">time. Every time.</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-text-muted max-w-xl leading-relaxed">
            PeakPost reads your Instagram audience signals, finds the exact 15-minute window
            when your followers are most active, and auto-publishes your Reels for you.
            <span className="text-text"> No more guessing.</span>
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md">
            <Link href="/login" className="flex-1">
              <Button size="lg" className="w-full">
                Start free — connect Instagram
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#how-it-works" className="sm:flex-none">
              <Button size="lg" variant="secondary" className="w-full">
                See how it works
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-4 text-xs text-text-dim">
            <div className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-success" />
              No credit card
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-success" />
              2-min setup
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-success" />
              Cancel anytime
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center w-full max-w-[340px] sm:max-w-[380px] lg:max-w-none mx-auto">
          <div className="absolute -inset-8 bg-accent-gradient opacity-20 blur-3xl rounded-full" />
          <PeakClock size={380} highlight={20} />
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  const metrics = [
    { value: "2.4×", label: "avg reach uplift" },
    { value: "1,200+", label: "creators in beta" },
    { value: "47K", label: "Reels auto-published" },
    { value: "93%", label: "stay past month one" },
  ];
  return (
    <section className="border-y border-border bg-bg-elevated/40">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {metrics.map((m) => (
          <div key={m.label} className="text-center md:text-left">
            <div className="font-display text-3xl md:text-4xl font-semibold text-gradient-accent">
              {m.value}
            </div>
            <div className="text-xs text-text-muted mt-1 uppercase tracking-wider">
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      icon: Clock,
      title: "Peak time, pinpointed",
      desc: "We crunch your last 30 posts plus live audience signals to find your top 3 windows — not generic 'tuesdays at 9'.",
      gradient: "from-accent to-magenta",
    },
    {
      icon: Zap,
      title: "Auto-publish, hands-free",
      desc: "Schedule a Reel, close the app. We publish to the second through Meta's official API. No reminder pings, no missed windows.",
      gradient: "from-magenta to-cyan",
    },
    {
      icon: BarChart3,
      title: "Analytics that read like English",
      desc: "Skip the spreadsheet. We tell you 'aesthetic Reels with trending audio post Wednesdays at 8:45 PM' in plain text.",
      gradient: "from-cyan to-accent",
    },
    {
      icon: Calendar,
      title: "Mobile-first scheduling",
      desc: "Tap a slot, drop a video, write a caption — done. The whole flow takes 30 seconds on your phone.",
      gradient: "from-accent to-magenta",
    },
    {
      icon: Bell,
      title: "Free reminders too",
      desc: "On the free plan we still email you 15 minutes before your peak slot. You'll never miss a beat.",
      gradient: "from-magenta to-cyan",
    },
    {
      icon: Shield,
      title: "Your tokens, encrypted",
      desc: "Meta tokens are encrypted with AES-256 at rest. We can't read them. We never post without your explicit schedule.",
      gradient: "from-cyan to-accent",
    },
  ];

  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="max-w-2xl">
          <Badge tone="accent" className="mb-4">
            <Zap className="h-3 w-3" />
            Why PeakPost
          </Badge>
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-balance">
            Built for creators, not <span className="text-text-muted">enterprise teams</span>.
          </h2>
          <p className="mt-4 text-text-muted text-lg">
            Buffer is for marketers. Later is for agencies. Hootsuite is bloated.
            <span className="text-text"> PeakPost is for you and your phone.</span>
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="group relative rounded-2xl border border-border bg-surface p-6 hover:border-border-strong transition-colors"
            >
              <div
                className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} shadow-glow`}
              >
                <item.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">{item.desc}</p>
              <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Connect Instagram",
      desc: "One-tap OAuth. We fetch your audience-active hours and last 30 posts.",
      icon: Instagram,
    },
    {
      n: "02",
      title: "Get your peak slots",
      desc: "Top 3 windows ranked by score. Each comes with a plain-English reason.",
      icon: TrendingUp,
    },
    {
      n: "03",
      title: "Schedule from your phone",
      desc: "Drop a Reel, pick a slot, hit publish. Free or auto-publish on Pro.",
      icon: Calendar,
    },
  ];
  return (
    <section id="how-it-works" className="relative py-24 md:py-32 border-t border-border">
      <div className="absolute inset-0 grid-bg mask-fade-b opacity-30 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-5 md:px-8">
        <div className="max-w-2xl">
          <Badge tone="accent" className="mb-4">
            <Sparkles className="h-3 w-3" />
            How it works
          </Badge>
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-balance">
            From zero to scheduled in <span className="text-gradient-accent">under 2 minutes</span>.
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <div className="rounded-2xl border border-border bg-surface p-7 h-full">
                <div className="flex items-start justify-between">
                  <div className="font-display text-5xl font-semibold text-gradient-accent leading-none">
                    {s.n}
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-bg-elevated border border-border flex items-center justify-center">
                    <s.icon className="h-5 w-5 text-accent-glow" />
                  </div>
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">{s.desc}</p>
              </div>
              {i < steps.length - 1 ? (
                <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                  <ArrowRight className="h-5 w-5 text-text-dim" />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonStrip() {
  const rows = [
    { feature: "Mobile-first upload", us: true, buffer: false, later: true, hootsuite: false },
    { feature: "Per-creator peak time scoring", us: true, buffer: false, later: false, hootsuite: false },
    { feature: "Plain-English recommendations", us: true, buffer: false, later: false, hootsuite: false },
    { feature: "Free reminder emails", us: true, buffer: false, later: false, hootsuite: false },
    { feature: "Auto-publish via Meta API", us: true, buffer: true, later: true, hootsuite: true },
    { feature: "Starts at ₹399 / $4.99", us: true, buffer: false, later: false, hootsuite: false },
  ];
  return (
    <section className="py-24 border-t border-border bg-bg-elevated/30">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-balance">
          Why creators leave <span className="text-text-muted">Buffer, Later, Hootsuite</span>.
        </h2>
        <div className="mt-10 rounded-2xl border border-border bg-surface overflow-hidden">
          <div className="grid grid-cols-[1.5fr_repeat(4,1fr)] text-xs uppercase tracking-wider text-text-muted bg-bg-elevated px-5 py-4">
            <div>Feature</div>
            <div className="text-center text-accent-glow font-semibold">PeakPost</div>
            <div className="text-center">Buffer</div>
            <div className="text-center">Later</div>
            <div className="text-center">Hootsuite</div>
          </div>
          {rows.map((r) => (
            <div
              key={r.feature}
              className="grid grid-cols-[1.5fr_repeat(4,1fr)] items-center px-5 py-4 border-t border-border text-sm"
            >
              <div className="text-text">{r.feature}</div>
              <Tick on={r.us} accent />
              <Tick on={r.buffer} />
              <Tick on={r.later} />
              <Tick on={r.hootsuite} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tick({ on, accent }: { on: boolean; accent?: boolean }) {
  return (
    <div className="flex justify-center">
      {on ? (
        <div
          className={
            accent
              ? "h-6 w-6 rounded-full bg-accent text-white grid place-items-center"
              : "h-6 w-6 rounded-full bg-success/15 text-success grid place-items-center"
          }
        >
          <Check className="h-3.5 w-3.5" />
        </div>
      ) : (
        <div className="h-6 w-6 rounded-full bg-bg-elevated text-text-dim grid place-items-center">
          —
        </div>
      )}
    </div>
  );
}

function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "₹0",
      sub: "forever",
      cta: "Start free",
      features: [
        "Peak time analysis",
        "Reminder emails 15 min before",
        "Up to 10 scheduled posts/month",
        "Basic analytics",
      ],
      highlight: false,
    },
    {
      name: "Pro",
      price: "₹399",
      sub: "/ month",
      cta: "Upgrade to Pro",
      features: [
        "Auto-publish at exact peak time",
        "Unlimited scheduled posts",
        "Full analytics + heatmaps",
        "Trending audio insights",
        "Priority support",
        "Multi-account (coming soon)",
      ],
      highlight: true,
    },
  ];

  return (
    <section id="pricing" className="relative py-24 md:py-32 border-t border-border">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <Badge tone="accent" className="mb-4">
            <Sparkles className="h-3 w-3" />
            Pricing
          </Badge>
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-balance">
            One coffee a month. <span className="text-gradient-accent">2× the reach.</span>
          </h2>
          <p className="mt-4 text-text-muted">
            Start on free. Upgrade when you want auto-publish and unlimited scheduling.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={
                t.highlight
                  ? "relative rounded-2xl bg-gradient-to-br from-accent/20 via-magenta/10 to-transparent border border-accent/40 p-7 shadow-glow"
                  : "relative rounded-2xl bg-surface border border-border p-7"
              }
            >
              {t.highlight ? (
                <Badge tone="pro" className="absolute -top-3 left-7">
                  Most popular
                </Badge>
              ) : null}
              <h3 className="font-display text-xl font-semibold tracking-tight">{t.name}</h3>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="font-display text-5xl font-semibold text-gradient">
                  {t.price}
                </span>
                <span className="text-text-muted">{t.sub}</span>
              </div>
              <Link href="/login" className="block mt-6">
                <Button
                  size="lg"
                  variant={t.highlight ? "primary" : "secondary"}
                  className="w-full"
                >
                  {t.cta}
                </Button>
              </Link>
              <ul className="mt-6 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 mt-0.5 text-success flex-shrink-0" />
                    <span className="text-text">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "How does PeakPost find my peak time?",
      a: "We pull your audience-active hours from Meta's Insights API and combine them with the actual reach of your last 30 posts. The result is a per-creator score — not a generic 'best time to post' chart.",
    },
    {
      q: "Will Instagram penalize auto-published Reels?",
      a: "No. We use Meta's official Content Publishing API. Reels go up exactly the same way they would if you posted manually — they just hit the right minute.",
    },
    {
      q: "Do I need a Business or Creator account?",
      a: "Yes. Personal accounts can't access the Meta Graph API. Switch in Instagram → Settings → Account → Switch to Professional. Takes 30 seconds.",
    },
    {
      q: "What about my access tokens?",
      a: "Encrypted with AES-256 the moment they hit our database. We can't read them. We never post without an explicit schedule from you.",
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes. Cancel from the dashboard, no questions asked. Your data stays intact in case you come back.",
    },
  ];

  return (
    <section className="py-24 md:py-32 border-t border-border bg-bg-elevated/30">
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-center text-balance">
          Frequently <span className="text-gradient-accent">asked</span>
        </h2>
        <div className="mt-10 space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-border bg-surface p-5 transition-colors open:border-border-strong"
            >
              <summary className="cursor-pointer flex items-center justify-between gap-4 list-none">
                <span className="text-text font-medium">{f.q}</span>
                <span className="h-6 w-6 rounded-full bg-bg-elevated grid place-items-center text-text-muted group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-text-muted leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative py-24 md:py-32 border-t border-border overflow-hidden">
      <div className="absolute inset-0 bg-grid-fade pointer-events-none" />
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-accent/15 blur-3xl pointer-events-none" />
      <div className="relative max-w-3xl mx-auto px-5 md:px-8 text-center">
        <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight text-balance">
          Ready to <span className="text-gradient-accent">post smarter</span>?
        </h2>
        <p className="mt-4 text-text-muted text-lg">
          Connect your Instagram in two minutes. See your peak times for free.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login">
            <Button size="lg">
              Start free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="secondary">
              Read the features
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-text-muted max-w-sm">
            Built by creators, for creators. Mumbai → the world.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-muted">
          <Link href="#features" className="hover:text-text">Features</Link>
          <Link href="#pricing" className="hover:text-text">Pricing</Link>
          <Link href="/login" className="hover:text-text">Log in</Link>
          <a href="#" className="hover:text-text">Privacy</a>
          <a href="#" className="hover:text-text">Terms</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-5 md:px-8 mt-8 pt-6 border-t border-border flex items-center justify-between text-xs text-text-dim">
        <span>© 2026 PeakPost. Not affiliated with Meta or Instagram.</span>
        <span>Made with ☕ + ❤️</span>
      </div>
    </footer>
  );
}
