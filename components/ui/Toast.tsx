"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "warning" | "info";
interface Toast {
  id: string;
  tone: ToastTone;
  title: string;
  description?: string;
}

interface ToastCtx {
  push: (t: Omit<Toast, "id">) => void;
}

const Ctx = createContext<ToastCtx | null>(null);

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
}

const tones: Record<ToastTone, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  success: { icon: CheckCircle2, color: "text-success", bg: "border-success/30" },
  error: { icon: XCircle, color: "text-danger", bg: "border-danger/30" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "border-warning/30" },
  info: { icon: Info, color: "text-accent-glow", bg: "border-accent/30" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((arr) => [...arr, { ...t, id }]);
    setTimeout(() => setToasts((arr) => arr.filter((x) => x.id !== id)), 4500);
  }, []);

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-[min(360px,calc(100vw-2rem))] pointer-events-none">
        {toasts.map((t) => {
          const tone = tones[t.tone];
          const Icon = tone.icon;
          return (
            <div
              key={t.id}
              className={cn(
                "pointer-events-auto glass rounded-xl border px-4 py-3 flex items-start gap-3 animate-slide-up shadow-soft",
                tone.bg
              )}
            >
              <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", tone.color)} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-text">{t.title}</div>
                {t.description ? (
                  <div className="text-xs text-text-muted mt-0.5">{t.description}</div>
                ) : null}
              </div>
              <button
                onClick={() => setToasts((arr) => arr.filter((x) => x.id !== t.id))}
                className="text-text-dim hover:text-text"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}
