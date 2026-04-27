"use client";

/**
 * 24-hour radial heatmap clock — the visual hook competitors don't have.
 * Renders a ring of 24 hour-segments, color intensity = audience-online %.
 */
export function PeakClock({
  data,
  size = 300,
  highlight = 20, // 8 PM
}: {
  data?: number[]; // length 24, 0-100
  size?: number;
  highlight?: number;
}) {
  const hours = data ?? defaultCurve();
  const radius = size / 2;
  const inner = radius * 0.62;
  const cx = radius;
  const cy = radius;

  return (
    <div
      className="relative aspect-square mx-auto w-full"
      style={{ maxWidth: size }}
    >
      {/* glow */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-60"
        style={{
          background:
            "radial-gradient(circle at center, rgba(124,108,255,0.35), transparent 70%)",
        }}
      />
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="relative animate-spin-slow w-full h-full"
      >
        <defs>
          <linearGradient id="seg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7c6cff" />
            <stop offset="100%" stopColor="#ff5cb1" />
          </linearGradient>
        </defs>
        {hours.map((value, h) => {
          const a0 = ((h - 6) / 24) * 2 * Math.PI;
          const a1 = ((h - 6 + 1) / 24) * 2 * Math.PI;
          const isHighlight = h === highlight;
          const len = 0.4 + (value / 100) * 0.6;
          const r0 = inner;
          const r1 = inner + (radius - inner) * len;
          const p0 = polar(cx, cy, r0, a0);
          const p1 = polar(cx, cy, r1, a0);
          const p2 = polar(cx, cy, r1, a1);
          const p3 = polar(cx, cy, r0, a1);
          const r0r = Math.round(r0 * 1000) / 1000;
          const r1r = Math.round(r1 * 1000) / 1000;
          const path = `M ${p0.x} ${p0.y} L ${p1.x} ${p1.y} A ${r1r} ${r1r} 0 0 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${r0r} ${r0r} 0 0 0 ${p0.x} ${p0.y} Z`;
          return (
            <path
              key={h}
              d={path}
              fill={isHighlight ? "url(#seg)" : "rgba(124,108,255,0.5)"}
              opacity={isHighlight ? 1 : 0.15 + (value / 100) * 0.6}
              stroke="rgba(8,8,13,0.8)"
              strokeWidth={1.5}
            />
          );
        })}
        {/* outer ring */}
        <circle
          cx={cx}
          cy={cy}
          r={radius - 1}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
        />
      </svg>

      {/* center label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-[10px] font-medium uppercase tracking-widest text-text-muted">
            Peak hour
          </div>
          <div className="font-display text-3xl md:text-4xl font-semibold text-gradient">
            {highlight % 12 === 0 ? 12 : highlight % 12}:45
            <span className="ml-1 text-base text-text-muted font-sans">
              {highlight < 12 ? "AM" : "PM"}
            </span>
          </div>
          <div className="text-xs text-text-muted mt-1">Wednesday • 87% online</div>
        </div>
      </div>
    </div>
  );
}

function polar(cx: number, cy: number, r: number, a: number) {
  // Round to 3 decimals so server (Node) and client (V8) produce identical strings
  // and React doesn't flag the SVG path as a hydration mismatch.
  const round = (n: number) => Math.round(n * 1000) / 1000;
  return { x: round(cx + r * Math.cos(a)), y: round(cy + r * Math.sin(a)) };
}

function defaultCurve(): number[] {
  // shape: low overnight, climb in evening, peak at 8 PM
  return Array.from({ length: 24 }, (_, h) => {
    if (h < 6) return 6 + h;
    if (h < 12) return 20 + h * 2;
    if (h < 17) return 35 + (h - 12) * 4;
    if (h < 21) return 60 + (h - 17) * 9;
    return Math.max(15, 96 - (h - 20) * 20);
  });
}
