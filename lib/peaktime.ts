// Peak-time scoring: combines audience-online hours with past post performance,
// returns top N non-adjacent slots (≥ minGap hours apart).
//
// Score per hour = audienceScore * 0.6 + perfScore * 0.4
//   audienceScore: 0–100 (normalized followers-online weighting)
//   perfScore:    0–100 (normalized weighted-engagement of past posts at that hour)

import type { PeakSlot } from '@/types';

export interface PastPost {
  postedAt: string | Date; // ISO or Date
  reach: number;
  saves: number;
  shares: number;
  likes: number;
}

export interface ComputeOptions {
  audienceHours: number[]; // length 24, 0–100
  pastPosts: PastPost[];
  topN?: number; // default 3
  minGapHours?: number; // default 2
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function performanceByHour(pastPosts: PastPost[]): number[] {
  const sums = new Array<number>(24).fill(0);
  const counts = new Array<number>(24).fill(0);
  for (const p of pastPosts) {
    const d = p.postedAt instanceof Date ? p.postedAt : new Date(p.postedAt);
    const h = d.getHours();
    if (Number.isNaN(h)) continue;
    const score = p.reach + p.saves * 3 + p.shares * 2 + p.likes;
    sums[h] += score;
    counts[h] += 1;
  }
  const avg = sums.map((s, i) => (counts[i] === 0 ? 0 : s / counts[i]));
  const max = Math.max(...avg, 1);
  return avg.map((v) => Math.round((v / max) * 100));
}

export function computePeakSlots(opts: ComputeOptions): PeakSlot[] {
  const { audienceHours, pastPosts, topN = 3, minGapHours = 2 } = opts;
  if (audienceHours.length !== 24) {
    throw new Error('audienceHours must have 24 entries (one per hour)');
  }

  const perf = performanceByHour(pastPosts);
  const scores = audienceHours.map((aud, h) => Math.round(aud * 0.6 + perf[h] * 0.4));

  // Pair (hour, score), sort desc, then greedily pick respecting minGapHours.
  const ranked = scores
    .map((score, hour) => ({ hour, score, audPct: audienceHours[hour] }))
    .sort((a, b) => b.score - a.score);

  const picked: typeof ranked = [];
  for (const cand of ranked) {
    if (picked.length >= topN) break;
    if (picked.every((p) => Math.abs(p.hour - cand.hour) >= minGapHours)) {
      picked.push(cand);
    }
  }

  // Best day for each picked hour: assume the algorithm runs daily; here we
  // attribute the slot to the next occurrence (today or tomorrow). The day field
  // is a hint — UI can override based on weekly planning.
  const now = new Date();
  return picked.map((p): PeakSlot => {
    const target = new Date(now);
    target.setHours(p.hour, 0, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    return {
      day: target.getDay(),
      hour: p.hour,
      minute: 0,
      score: p.score,
      audienceOnlinePct: p.audPct,
      reason: `${p.audPct}% of your followers are online on ${DAY_NAMES[target.getDay()]} at this hour`,
    };
  });
}
