"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Logo } from "@/components/ui/Logo";
import { useToast } from "@/components/ui/Toast";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const searchParams = useSearchParams();
  const metaError = searchParams.get("meta_error");
  const toast = useToast();

  useEffect(() => {
    if (metaError) {
      toast.push({
        tone: "error",
        title: "Couldn't connect Instagram",
        description: decodeURIComponent(metaError),
      });
    }
  }, [metaError, toast]);

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: CTA */}
      <div className="relative flex items-center justify-center p-6 md:p-10">
        <div className="absolute top-6 left-6 md:top-8 md:left-8">
          <Link href="/" className="focus-ring rounded-md">
            <Logo />
          </Link>
        </div>

        <div className="w-full max-w-md animate-slide-up">
          <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
            Get your peak times
          </h1>
          <p className="mt-2 text-text-muted">
            Connect Instagram to find when your followers are most active.
            We&apos;ll create your account in one step.
          </p>

          <a
            href="/api/auth/meta"
            className="mt-8 w-full h-14 rounded-xl bg-gradient-to-r from-magenta via-accent to-cyan p-px focus-ring block"
          >
            <div className="h-full w-full rounded-[11px] bg-bg flex items-center justify-center gap-2 px-4 text-base font-medium hover:bg-bg-elevated transition-colors">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path
                  fill="url(#ig)"
                  d="M12 2.4c2.6 0 2.9 0 4 .06 2.6.12 3.8 1.34 3.92 3.92.06 1.07.07 1.4.07 4.02s0 2.95-.07 4c-.12 2.6-1.32 3.82-3.92 3.94-1.07.06-1.4.07-4 .07s-2.95-.01-4-.07c-2.6-.12-3.82-1.34-3.94-3.94-.06-1.07-.07-1.4-.07-4.02s.02-2.95.07-4C4.18 3.78 5.4 2.58 8 2.46 9.05 2.4 9.4 2.4 12 2.4Zm0 4.94a4.66 4.66 0 100 9.32 4.66 4.66 0 000-9.32Zm0 7.7a3 3 0 110-6.06 3 3 0 010 6.06Zm5.2-7.86a1.1 1.1 0 100 2.2 1.1 1.1 0 000-2.2Z"
                />
                <defs>
                  <linearGradient id="ig" x1="0" y1="0" x2="24" y2="24">
                    <stop offset="0%" stopColor="#ff5cb1" />
                    <stop offset="50%" stopColor="#7c6cff" />
                    <stop offset="100%" stopColor="#5ce0ff" />
                  </linearGradient>
                </defs>
              </svg>
              Continue with Instagram
            </div>
          </a>

          <ul className="mt-6 space-y-2 text-sm text-text-muted">
            <li>• Your Instagram must be a Business or Creator account</li>
            <li>• Linked to a Facebook Page</li>
            <li>• Your access token is encrypted at rest (AES-256)</li>
          </ul>

          <p className="mt-8 text-xs text-text-dim text-center">
            By continuing you agree to our{" "}
            <a href="#" className="hover:text-text-muted underline">Terms</a> and{" "}
            <a href="#" className="hover:text-text-muted underline">Privacy</a>.
          </p>
        </div>
      </div>

      {/* Right: visual */}
      <div className="hidden lg:block relative bg-bg-elevated overflow-hidden border-l border-border">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-10">
          <div className="rounded-2xl border border-border bg-surface/80 backdrop-blur-xl p-7 max-w-sm shadow-soft animate-float">
            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/40?img=12"
                alt=""
                className="h-10 w-10 rounded-full"
              />
              <div>
                <div className="text-sm font-semibold">@avisekh.creates</div>
                <div className="text-xs text-text-muted">12.8K followers</div>
              </div>
            </div>
            <div className="mt-5 rounded-xl bg-gradient-to-br from-accent/20 to-magenta/20 border border-accent/30 p-4">
              <div className="text-[10px] font-medium uppercase tracking-widest text-accent-glow">
                Next peak
              </div>
              <div className="font-display text-2xl font-semibold mt-1 text-gradient">
                Wed, 8:45 PM
              </div>
              <div className="text-xs text-text-muted mt-2">
                87% of your followers will be online — your highest score this week.
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-text-muted">Avg reach uplift</span>
              <span className="font-semibold text-success">+143%</span>
            </div>
          </div>
          <p className="mt-8 text-text-muted text-sm max-w-sm text-center">
            &ldquo;PeakPost found a 9 PM window I&apos;d never have tried.
            My reels do 2× the reach now.&rdquo;
          </p>
          <p className="mt-2 text-xs text-text-dim">— Aanya, lifestyle creator (38K)</p>
        </div>
      </div>
    </div>
  );
}
