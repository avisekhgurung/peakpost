import 'server-only';
import { createServerSupabase } from '@/lib/supabase-server';
import { decrypt } from '@/lib/crypto';
import {
  getAudienceHours,
  getRecentMedia,
  getPostMetrics,
} from '@/lib/meta';
import { computePeakSlots, type PastPost } from '@/lib/peaktime';
import type { PeakSlot } from '@/types';

export interface DashboardAccount {
  id: string;
  username: string;
  profilePictureUrl: string | null;
  followersCount: number;
}

export interface RecentPost {
  id: string;
  postedAt: string;
  views: number; // headline metric (matches IG app)
  reach: number;
  saves: number;
  likes: number;
  comments: number;
  mediaType: string;
  caption: string;
  thumbnailUrl: string | null;
  permalink: string | null;
}

export interface DashboardData {
  user: { id: string; email: string; name: string | null };
  account: DashboardAccount | null;
  slots: PeakSlot[];
  audienceHours: number[]; // 24
  audienceDataAvailable: boolean;
  recentPosts: RecentPost[];
  totals: {
    avgViews: number;
    bestViews: number;
    totalSaves: number;
    postsAnalyzed: number;
  } | null;
  scheduledCount: number;
  metaError: string | null;
}

export async function loadDashboard(): Promise<DashboardData> {
  const supa = await createServerSupabase();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) throw new Error('not authenticated');

  const userInfo = {
    id: user.id,
    email: user.email ?? '',
    name: (user.user_metadata?.full_name as string | undefined) ?? null,
  };

  // Pull connected IG account
  const { data: igRow } = await supa
    .from('ig_accounts')
    .select('id, ig_user_id, username, profile_picture_url, followers_count, access_token_enc')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { count: scheduledCount } = await supa
    .from('scheduled_posts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'pending');

  if (!igRow) {
    return {
      user: userInfo,
      account: null,
      slots: [],
      audienceHours: new Array(24).fill(0),
      audienceDataAvailable: false,
      recentPosts: [],
      totals: null,
      scheduledCount: scheduledCount ?? 0,
      metaError: null,
    };
  }

  const account: DashboardAccount = {
    id: igRow.id,
    username: igRow.username,
    profilePictureUrl: igRow.profile_picture_url,
    followersCount: igRow.followers_count ?? 0,
  };

  let pageToken: string;
  try {
    pageToken = decrypt(igRow.access_token_enc);
  } catch (e) {
    return {
      user: userInfo,
      account,
      slots: [],
      audienceHours: new Array(24).fill(0),
      audienceDataAvailable: false,
      recentPosts: [],
      totals: null,
      scheduledCount: scheduledCount ?? 0,
      metaError: 'Could not decrypt your access token. Please reconnect Instagram.',
    };
  }

  // Call Meta in parallel; tolerate failures gracefully
  const [audienceRes, mediaRes] = await Promise.allSettled([
    getAudienceHours(igRow.ig_user_id, pageToken),
    getRecentMedia(igRow.ig_user_id, pageToken, 10),
  ]);

  const audienceHours =
    audienceRes.status === 'fulfilled' ? audienceRes.value : new Array(24).fill(0);
  const audienceDataAvailable =
    audienceRes.status === 'fulfilled' && audienceHours.some((v) => v > 0);

  const recentMedia = mediaRes.status === 'fulfilled' ? mediaRes.value : [];

  // Fetch metrics for the most-recent posts in parallel
  const top = recentMedia.slice(0, 10);
  const metricsResults = await Promise.allSettled(
    top.map((m) => getPostMetrics(m.id, pageToken))
  );
  const recentPosts: RecentPost[] = top.map((m, i) => {
    const metrics =
      metricsResults[i].status === 'fulfilled' ? metricsResults[i].value : {};
    return {
      id: m.id,
      postedAt: m.timestamp,
      mediaType: m.media_type,
      caption: m.caption ?? '',
      thumbnailUrl: m.thumbnail_url ?? m.media_url ?? null,
      permalink: m.permalink ?? null,
      views: metrics.views ?? 0,
      reach: metrics.reach ?? 0,
      saves: metrics.saves ?? 0,
      // like_count + comments_count come from the media object itself
      // (always populated, never blocked by deprecated metric names)
      likes: m.like_count ?? 0,
      comments: m.comments_count ?? 0,
    };
  });

  // Build PastPost[] for peaktime scoring (only with non-zero data).
  // Use views (Reels headline) when available, fall back to reach.
  const past: PastPost[] = recentPosts
    .filter((p) => p.views > 0 || p.reach > 0)
    .map((p) => ({
      postedAt: p.postedAt,
      reach: p.views || p.reach,
      saves: p.saves,
      likes: p.likes,
      shares: 0,
    }));

  let slots: PeakSlot[] = [];
  if (audienceDataAvailable) {
    try {
      slots = computePeakSlots({
        audienceHours,
        pastPosts: past,
      });
    } catch {
      slots = [];
    }
  }

  let totals: DashboardData['totals'] = null;
  if (recentPosts.length > 0 && recentPosts.some((p) => p.views > 0 || p.reach > 0)) {
    const views = recentPosts.map((p) => p.views || p.reach);
    totals = {
      avgViews: Math.round(views.reduce((a, b) => a + b, 0) / views.length),
      bestViews: Math.max(...views),
      totalSaves: recentPosts.reduce((a, b) => a + b.saves, 0),
      postsAnalyzed: recentPosts.length,
    };
  }

  let metaError: string | null = null;
  if (audienceRes.status === 'rejected' && mediaRes.status === 'rejected') {
    metaError =
      'We could not reach Instagram right now. Your token may be expired — try reconnecting.';
  }

  return {
    user: userInfo,
    account,
    slots,
    audienceHours,
    audienceDataAvailable,
    recentPosts,
    totals,
    scheduledCount: scheduledCount ?? 0,
    metaError,
  };
}
