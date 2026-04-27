import 'server-only';
import { createServerSupabase } from '@/lib/supabase-server';
import { decrypt } from '@/lib/crypto';
import {
  getAudienceHours,
  getRecentMedia,
  getPostMetrics,
} from '@/lib/meta';

export interface AnalyticsPost {
  id: string;
  postedAt: string;
  caption: string;
  mediaType: string;
  thumbnailUrl: string | null;
  permalink: string | null;
  views: number; // matches IG app
  reach: number;
  saves: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface AnalyticsData {
  hasIG: boolean;
  username: string | null;
  audienceHours: number[];
  audienceDataAvailable: boolean;
  posts: AnalyticsPost[]; // last up to 30
  totals: {
    avgViews: number;
    bestViews: number;
    totalSaves: number;
    totalLikes: number;
  } | null;
  byMediaType: { type: string; avg: number; count: number }[];
  viewsOverTime: { day: number; views: number; saves: number; date: string }[];
  bestHour: number | null;
  bestDayName: string | null;
  metaError: string | null;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export async function loadAnalytics(): Promise<AnalyticsData> {
  const supa = await createServerSupabase();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) throw new Error('not authenticated');

  const { data: igRow } = await supa
    .from('ig_accounts')
    .select('id, ig_user_id, username, access_token_enc')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const empty: AnalyticsData = {
    hasIG: false,
    username: null,
    audienceHours: new Array(24).fill(0),
    audienceDataAvailable: false,
    posts: [],
    totals: null,
    byMediaType: [],
    viewsOverTime: [],
    bestHour: null,
    bestDayName: null,
    metaError: null,
  };

  if (!igRow) return empty;

  let pageToken: string;
  try {
    pageToken = decrypt(igRow.access_token_enc);
  } catch {
    return {
      ...empty,
      hasIG: true,
      username: igRow.username,
      metaError: 'Could not decrypt your access token. Please reconnect Instagram.',
    };
  }

  const [audienceRes, mediaRes] = await Promise.allSettled([
    getAudienceHours(igRow.ig_user_id, pageToken),
    getRecentMedia(igRow.ig_user_id, pageToken, 30),
  ]);

  const audienceHours =
    audienceRes.status === 'fulfilled' ? audienceRes.value : new Array(24).fill(0);
  const audienceDataAvailable =
    audienceRes.status === 'fulfilled' && audienceHours.some((v) => v > 0);

  const recentMedia = mediaRes.status === 'fulfilled' ? mediaRes.value : [];

  const metricsResults = await Promise.allSettled(
    recentMedia.map((m) => getPostMetrics(m.id, pageToken))
  );

  const posts: AnalyticsPost[] = recentMedia.map((m, i) => {
    const metrics =
      metricsResults[i].status === 'fulfilled' ? metricsResults[i].value : {};
    return {
      id: m.id,
      postedAt: m.timestamp,
      caption: m.caption ?? '',
      mediaType: m.media_type,
      thumbnailUrl: m.thumbnail_url ?? m.media_url ?? null,
      permalink: m.permalink ?? null,
      views: metrics.views ?? 0,
      reach: metrics.reach ?? 0,
      saves: metrics.saves ?? 0,
      // like_count + comments_count from the media object itself
      likes: m.like_count ?? 0,
      comments: m.comments_count ?? 0,
      shares: metrics.shares ?? 0,
    };
  });

  // Use views (IG headline) with reach fallback for legacy posts.
  const headline = (p: AnalyticsPost) => p.views || p.reach;

  let totals: AnalyticsData['totals'] = null;
  const withData = posts.filter((p) => headline(p) > 0);
  if (withData.length > 0) {
    const values = withData.map(headline);
    totals = {
      avgViews: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
      bestViews: Math.max(...values),
      totalSaves: posts.reduce((a, b) => a + b.saves, 0),
      totalLikes: posts.reduce((a, b) => a + b.likes, 0),
    };
  }

  // Group by media_type using views
  const typeMap = new Map<string, { sum: number; count: number }>();
  for (const p of posts) {
    if (headline(p) <= 0) continue;
    const cur = typeMap.get(p.mediaType) ?? { sum: 0, count: 0 };
    cur.sum += headline(p);
    cur.count += 1;
    typeMap.set(p.mediaType, cur);
  }
  const byMediaType = Array.from(typeMap.entries()).map(([type, v]) => ({
    type,
    avg: Math.round(v.sum / v.count),
    count: v.count,
  }));

  // Views over time (oldest → newest)
  const viewsOverTime = posts
    .slice()
    .reverse()
    .map((p, i) => ({
      day: i + 1,
      views: headline(p),
      saves: p.saves,
      date: p.postedAt,
    }));

  // Best hour from audience curve
  let bestHour: number | null = null;
  if (audienceDataAvailable) {
    bestHour = audienceHours.reduce(
      (best, v, h) => (v > audienceHours[best] ? h : best),
      0
    );
  }

  // Best day = day-of-week with highest avg views across posts
  const dayBuckets = new Array(7).fill(null).map(() => ({ sum: 0, count: 0 }));
  for (const p of withData) {
    const d = new Date(p.postedAt).getDay();
    dayBuckets[d].sum += headline(p);
    dayBuckets[d].count += 1;
  }
  const dayAvgs = dayBuckets.map((b) => (b.count ? b.sum / b.count : 0));
  let bestDayName: string | null = null;
  if (dayAvgs.some((v) => v > 0)) {
    const idx = dayAvgs.indexOf(Math.max(...dayAvgs));
    bestDayName = DAY_NAMES[idx];
  }

  let metaError: string | null = null;
  if (audienceRes.status === 'rejected' && mediaRes.status === 'rejected') {
    metaError =
      'We could not reach Instagram right now. Your token may be expired — try reconnecting.';
  }

  return {
    hasIG: true,
    username: igRow.username,
    audienceHours,
    audienceDataAvailable,
    posts,
    totals,
    byMediaType,
    viewsOverTime,
    bestHour,
    bestDayName,
    metaError,
  };
}
