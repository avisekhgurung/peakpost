"use client";

import { Suspense, useState, useRef, type ChangeEvent, type DragEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Upload as UploadIcon,
  X,
  Image as ImageIcon,
  Video,
  Sparkles,
  Lock,
  CheckCircle2,
  Music,
  User,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/app/AppShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Textarea, Label, Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { cn, dayName, formatTime } from "@/lib/utils";
import { mockSlots, contentTypes, mockUser } from "@/lib/mock";
import type { ContentType, MediaType, PeakSlot } from "@/types";

export default function UploadPage() {
  return (
    <Suspense fallback={<div className="p-8 text-text-muted">Loading…</div>}>
      <UploadInner />
    </Suspense>
  );
}

function UploadInner() {
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  const fileInput = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [caption, setCaption] = useState("");
  const [contentType, setContentType] = useState<ContentType>("aesthetic");
  const [trendingAudio, setTrendingAudio] = useState(true);
  const [withFace, setWithFace] = useState(false);

  const initialSlotIdx = (() => {
    const day = params.get("day");
    const hour = params.get("hour");
    if (!day || !hour) return 0;
    const idx = mockSlots.findIndex(
      (s) => s.day === Number(day) && s.hour === Number(hour)
    );
    return idx >= 0 ? idx : 0;
  })();
  const [selectedSlot, setSelectedSlot] = useState<number>(initialSlotIdx);
  const [customTime, setCustomTime] = useState<string>("");
  const [igEnabled, setIgEnabled] = useState(true);
  const [fbEnabled, setFbEnabled] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [success, setSuccess] = useState<{ slot: PeakSlot } | null>(null);

  const isPro = mockUser.plan === "pro";

  function onFiles(files: FileList | null) {
    if (!files || !files[0]) return;
    const f = files[0];
    const isVideo = f.type.startsWith("video/");
    const isImage = f.type.startsWith("image/");
    if (!isVideo && !isImage) {
      toast.push({
        tone: "error",
        title: "Unsupported file",
        description: "Use mp4, mov, jpg, png, or webp.",
      });
      return;
    }
    if (isVideo && f.size > 200 * 1024 * 1024) {
      toast.push({
        tone: "error",
        title: "Video too large",
        description: "Max 200MB for videos.",
      });
      return;
    }
    if (isImage && f.size > 10 * 1024 * 1024) {
      toast.push({ tone: "error", title: "Image too large", description: "Max 10MB." });
      return;
    }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setUploading(true);
    setProgress(0);
    // Simulated upload progress
    const tick = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(tick);
          setUploading(false);
          toast.push({ tone: "success", title: "Upload ready", description: f.name });
          return 100;
        }
        return Math.min(100, p + Math.random() * 18 + 6);
      });
    }, 220);
  }

  function clearFile() {
    setFile(null);
    setPreviewUrl(null);
    setProgress(0);
    setUploading(false);
    if (fileInput.current) fileInput.current.value = "";
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragActive(false);
    onFiles(e.dataTransfer.files);
  }

  function onSubmit() {
    if (!file) {
      toast.push({ tone: "warning", title: "Add a file first" });
      return;
    }
    if (!caption.trim()) {
      toast.push({ tone: "warning", title: "Caption is required" });
      return;
    }
    setScheduling(true);
    setTimeout(() => {
      setScheduling(false);
      setSuccess({ slot: mockSlots[selectedSlot] });
    }, 900);
  }

  if (success) return <SuccessScreen slot={success.slot} onAnother={() => router.refresh()} />;

  const mediaType: MediaType = file?.type.startsWith("video/") ? "REELS" : "IMAGE";

  return (
    <div className="px-4 sm:px-5 md:px-8 py-6 md:py-8 max-w-5xl">
      <PageHeader
        title="Schedule a post"
        description="Drop a Reel or photo, set your details, pick your peak slot."
      />

      <div className="space-y-8">
        {/* Step 1: Upload */}
        <Step n={1} title="Upload your content">
          {!file ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={onDrop}
              onClick={() => fileInput.current?.click()}
              className={cn(
                "relative rounded-2xl border-2 border-dashed p-10 md:p-14 text-center cursor-pointer transition-all",
                dragActive
                  ? "border-accent bg-accent/10"
                  : "border-border bg-surface hover:border-accent/40 hover:bg-surface-hover"
              )}
            >
              <input
                ref={fileInput}
                type="file"
                accept="video/mp4,video/quicktime,image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e: ChangeEvent<HTMLInputElement>) => onFiles(e.target.files)}
              />
              <div className="mx-auto h-16 w-16 rounded-2xl bg-accent-gradient grid place-items-center mb-4 shadow-glow">
                <UploadIcon className="h-7 w-7 text-white" />
              </div>
              <p className="font-display text-lg font-semibold">
                Drop your file or tap to browse
              </p>
              <p className="text-text-muted text-sm mt-2">
                Reels (.mp4 .mov) up to 200MB · Photos (.jpg .png .webp) up to 10MB
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-surface p-4 md:p-5 flex flex-col md:flex-row gap-5">
              <div className="relative h-48 md:h-44 md:w-44 flex-shrink-0 rounded-xl overflow-hidden bg-bg-elevated">
                {previewUrl &&
                  (mediaType === "REELS" ? (
                    <video
                      src={previewUrl}
                      muted
                      autoPlay
                      loop
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img src={previewUrl} alt="" className="h-full w-full object-cover" />
                  ))}
                <button
                  onClick={clearFile}
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-bg/80 backdrop-blur grid place-items-center hover:bg-bg"
                  aria-label="Remove"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {mediaType === "REELS" ? (
                    <Badge tone="accent">
                      <Video className="h-3 w-3" /> Reel
                    </Badge>
                  ) : (
                    <Badge tone="neutral">
                      <ImageIcon className="h-3 w-3" /> Photo
                    </Badge>
                  )}
                  {!uploading ? (
                    <Badge tone="success">
                      <CheckCircle2 className="h-3 w-3" /> Ready
                    </Badge>
                  ) : null}
                </div>
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-xs text-text-muted mt-1">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </p>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-text-muted mb-1.5">
                    <span>{uploading ? "Uploading…" : "Upload complete"}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-bg-elevated overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        uploading
                          ? "bg-gradient-to-r from-accent to-magenta"
                          : "bg-success"
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </Step>

        {/* Step 2: Details */}
        <Step n={2} title="Post details">
          <div className="grid lg:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={2200}
                placeholder="Write something that hooks in the first line…"
              />
              <div className="mt-2 flex justify-between text-xs text-text-dim">
                <span>Tip: question or POV in line 1 → 2× completion</span>
                <span>{caption.length} / 2200</span>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <Label>Content type</Label>
                <div className="flex flex-wrap gap-2">
                  {contentTypes.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setContentType(c.id as ContentType)}
                      className={cn(
                        "h-10 px-3.5 rounded-full text-sm font-medium border transition-all flex items-center gap-1.5",
                        contentType === c.id
                          ? "bg-accent/15 border-accent text-accent-glow shadow-glow"
                          : "bg-surface border-border hover:border-border-strong text-text-muted hover:text-text"
                      )}
                    >
                      <span>{c.emoji}</span> {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Toggle
                  label="Trending audio"
                  icon={Music}
                  on={trendingAudio}
                  onChange={setTrendingAudio}
                  hint="+170% reach"
                />
                <Toggle
                  label="Face on camera"
                  icon={User}
                  on={withFace}
                  onChange={setWithFace}
                  hint="+34% saves"
                />
              </div>
            </div>
          </div>
        </Step>

        {/* Step 3: Schedule */}
        <Step n={3} title="Schedule">
          <div className="space-y-5">
            <div>
              <Label>Pick a peak slot</Label>
              <div className="grid md:grid-cols-3 gap-3">
                {mockSlots.map((slot, i) => {
                  const active = i === selectedSlot;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setSelectedSlot(i);
                        setCustomTime("");
                      }}
                      className={cn(
                        "text-left rounded-xl border p-4 transition-all",
                        active
                          ? "border-accent bg-accent/10 shadow-glow"
                          : "border-border bg-surface hover:border-border-strong"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge tone={active ? "pro" : "neutral"}>#{i + 1}</Badge>
                        <span className="font-display text-lg font-semibold text-gradient-accent">
                          {slot.score}
                        </span>
                      </div>
                      <div className="text-xs text-text-muted">{dayName(slot.day, true)}</div>
                      <div className="font-display text-xl font-semibold tracking-tight">
                        {formatTime(slot.hour, slot.minute)}
                      </div>
                      <div className="mt-2 text-xs text-text-muted line-clamp-2">
                        {slot.audienceOnlinePct}% audience online
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="custom">Or pick a custom time</Label>
              <Input
                id="custom"
                type="datetime-local"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
              />
            </div>

            <div>
              <Label>Publish to</Label>
              <div className="flex flex-wrap gap-3">
                <PlatformBox
                  label="Instagram"
                  on={igEnabled}
                  onChange={setIgEnabled}
                  gradient="from-magenta via-accent to-cyan"
                />
                <PlatformBox
                  label="Facebook"
                  on={fbEnabled}
                  onChange={setFbEnabled}
                  gradient="from-cyan to-accent"
                />
              </div>
            </div>

            {!isPro ? (
              <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 flex items-start gap-3">
                <Lock className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">Auto-publish is a Pro feature</div>
                  <p className="text-xs text-text-muted mt-1">
                    On free plan we&apos;ll email you a reminder 15 min before your slot. Upgrade
                    to publish automatically at the second.
                  </p>
                </div>
                <Button size="sm" variant="primary" onClick={() => router.push("/upgrade")}>
                  Upgrade
                </Button>
              </div>
            ) : null}

            <div className="pt-2 flex flex-col-reverse md:flex-row md:justify-end gap-3">
              <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                Cancel
              </Button>
              <Button size="lg" onClick={onSubmit} loading={scheduling} disabled={!file}>
                {isPro ? "Schedule auto-publish" : "Schedule with reminder"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Step>
      </div>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-bg-elevated/30 border border-border p-5 md:p-7">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-8 w-8 rounded-lg bg-accent/15 text-accent-glow grid place-items-center font-display font-semibold">
          {n}
        </div>
        <h2 className="font-display text-lg md:text-xl font-semibold tracking-tight">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Toggle({
  label,
  icon: Icon,
  on,
  onChange,
  hint,
}: {
  label: string;
  icon: typeof Music;
  on: boolean;
  onChange: (b: boolean) => void;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={cn(
        "rounded-xl border p-3.5 text-left transition-all flex items-start gap-3",
        on
          ? "border-accent bg-accent/10"
          : "border-border bg-surface hover:border-border-strong"
      )}
    >
      <div
        className={cn(
          "h-9 w-9 rounded-lg grid place-items-center flex-shrink-0",
          on ? "bg-accent text-white" : "bg-bg-elevated text-text-muted"
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {hint ? <div className="text-xs text-text-muted mt-0.5">{hint}</div> : null}
      </div>
      <div
        className={cn(
          "h-5 w-9 rounded-full p-0.5 transition-colors flex-shrink-0",
          on ? "bg-accent" : "bg-bg-elevated"
        )}
      >
        <div
          className={cn(
            "h-4 w-4 rounded-full bg-white transition-transform",
            on ? "translate-x-4" : ""
          )}
        />
      </div>
    </button>
  );
}

function PlatformBox({
  label,
  on,
  onChange,
  gradient,
}: {
  label: string;
  on: boolean;
  onChange: (b: boolean) => void;
  gradient: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={cn(
        "h-12 px-4 rounded-xl border flex items-center gap-3 transition-all",
        on ? "border-accent bg-accent/10" : "border-border bg-surface"
      )}
    >
      <span className={cn("h-6 w-6 rounded-md bg-gradient-to-br", gradient)} />
      <span className="text-sm font-medium">{label}</span>
      <div
        className={cn(
          "ml-2 h-5 w-9 rounded-full p-0.5 transition-colors flex-shrink-0",
          on ? "bg-accent" : "bg-bg-elevated"
        )}
      >
        <div
          className={cn(
            "h-4 w-4 rounded-full bg-white transition-transform",
            on ? "translate-x-4" : ""
          )}
        />
      </div>
    </button>
  );
}

function SuccessScreen({ slot, onAnother }: { slot: PeakSlot; onAnother: () => void }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 md:px-8 py-12">
      <div className="max-w-md w-full text-center animate-slide-up">
        <div className="relative mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-accent via-magenta to-cyan grid place-items-center shadow-glow mb-6">
          <CheckCircle2 className="h-10 w-10 text-white" />
          <Sparkles className="absolute -top-2 -right-2 h-7 w-7 text-warning animate-pulse-soft" />
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
          You&apos;re locked in. 🎉
        </h2>
        <p className="mt-3 text-text-muted">
          Scheduled for{" "}
          <span className="text-text font-medium">
            {dayName(slot.day)} at {formatTime(slot.hour, slot.minute)}
          </span>
          .
          <br />
          We&apos;ll{" "}
          {mockUser.plan === "pro" ? (
            <>auto-publish it the second your peak window opens.</>
          ) : (
            <>send a reminder email 15 minutes before.</>
          )}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onAnother}>
            <Calendar className="h-4 w-4" /> Schedule another
          </Button>
          <Button
            variant="secondary"
            onClick={() => (window.location.href = "/scheduled")}
          >
            View queue
          </Button>
        </div>
      </div>
    </div>
  );
}
