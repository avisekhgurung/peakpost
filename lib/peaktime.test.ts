import { describe, it, expect } from 'vitest';
import { computePeakSlots } from './peaktime';

function audWithPeaks(...hours: number[]): number[] {
  const arr = new Array<number>(24).fill(10);
  for (const h of hours) arr[h] = 100;
  return arr;
}

describe('computePeakSlots', () => {
  it('returns top 3 slots', () => {
    const slots = computePeakSlots({
      audienceHours: audWithPeaks(8, 14, 20),
      pastPosts: [],
    });
    expect(slots).toHaveLength(3);
    expect(slots.map((s) => s.hour).sort((a, b) => a - b)).toEqual([8, 14, 20]);
  });

  it('respects minGapHours (no adjacent slots)', () => {
    // Audience peaks at 8,9,10 — should pick only one of them with gap
    const slots = computePeakSlots({
      audienceHours: audWithPeaks(8, 9, 10, 18, 22),
      pastPosts: [],
      minGapHours: 2,
    });
    const hours = slots.map((s) => s.hour);
    for (let i = 0; i < hours.length; i++) {
      for (let j = i + 1; j < hours.length; j++) {
        expect(Math.abs(hours[i] - hours[j])).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('weights past performance into the score', () => {
    // Flat audience, but a single big-reach post at hour 15 should pull 15 in
    const audience = new Array<number>(24).fill(50);
    const slots = computePeakSlots({
      audienceHours: audience,
      pastPosts: [
        { postedAt: new Date(2026, 0, 1, 15), reach: 10000, saves: 500, shares: 100, likes: 2000 },
      ],
      topN: 1,
    });
    expect(slots[0].hour).toBe(15);
  });

  it('throws on bad audienceHours length', () => {
    expect(() =>
      computePeakSlots({ audienceHours: [1, 2, 3], pastPosts: [] })
    ).toThrow();
  });
});
