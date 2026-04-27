// Meta Graph API helpers for Instagram OAuth, Insights, and Publishing.
// Reference: https://developers.facebook.com/docs/instagram-platform

const GRAPH = 'https://graph.facebook.com/v21.0';
const FB_OAUTH = 'https://www.facebook.com/v21.0/dialog/oauth';

const SCOPES = [
  'email',
  'public_profile',
  'instagram_basic',
  'instagram_content_publish',
  'instagram_manage_insights',
  'pages_show_list',
  'pages_read_engagement',
  'business_management',
] as const;

function appId() {
  const v = process.env.META_APP_ID;
  if (!v) throw new Error('META_APP_ID not set');
  return v;
}
function appSecret() {
  const v = process.env.META_APP_SECRET;
  if (!v) throw new Error('META_APP_SECRET not set');
  return v;
}
// Resolve the redirect URI dynamically from the request host. Falls back to
// the env var for places that don't have an explicit override (e.g. local dev).
// The same value MUST be exchangeForToken's redirect_uri AND registered in
// Meta's "Valid OAuth Redirect URIs" — otherwise Meta returns "URL blocked".
export function buildRedirectUri(originHost?: string): string {
  if (originHost) return `${originHost.replace(/\/$/, '')}/api/auth/callback`;
  const envOverride = process.env.META_REDIRECT_URI;
  if (envOverride) return envOverride;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) return `${appUrl.replace(/\/$/, '')}/api/auth/callback`;
  throw new Error('No redirect URI: set NEXT_PUBLIC_APP_URL or META_REDIRECT_URI');
}

async function jget<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const body = await res.json();
  if (!res.ok) throw new Error(`Meta GET ${res.status}: ${JSON.stringify(body)}`);
  return body as T;
}

async function jpost<T>(url: string, params: Record<string, string>): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params).toString(),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Meta POST ${res.status}: ${JSON.stringify(body)}`);
  return body as T;
}

// ---------------- OAuth ----------------

export function getOAuthUrl(state: string, redirectUri?: string): string {
  const params = new URLSearchParams({
    client_id: appId(),
    redirect_uri: redirectUri ?? buildRedirectUri(),
    state,
    scope: SCOPES.join(','),
    response_type: 'code',
  });
  return `${FB_OAUTH}?${params.toString()}`;
}

export async function exchangeCodeForToken(
  code: string,
  redirectUri?: string
): Promise<{
  access_token: string;
  expires_in?: number;
}> {
  const params = new URLSearchParams({
    client_id: appId(),
    client_secret: appSecret(),
    redirect_uri: redirectUri ?? buildRedirectUri(),
    code,
  });
  return jget(`${GRAPH}/oauth/access_token?${params.toString()}`);
}

// Convert short-lived (1h) → long-lived (60d) token
export async function getLongLivedToken(shortToken: string): Promise<{
  access_token: string;
  expires_in: number;
}> {
  const params = new URLSearchParams({
    grant_type: 'fb_exchange_token',
    client_id: appId(),
    client_secret: appSecret(),
    fb_exchange_token: shortToken,
  });
  return jget(`${GRAPH}/oauth/access_token?${params.toString()}`);
}

// ---------------- Facebook user profile ----------------

export interface MeProfile {
  id: string;
  email: string | null;
  name: string | null;
}

export async function getMeProfile(userAccessToken: string): Promise<MeProfile> {
  const r = await jget<{ id: string; email?: string; name?: string }>(
    `${GRAPH}/me?fields=id,email,name&access_token=${userAccessToken}`
  );
  return { id: r.id, email: r.email ?? null, name: r.name ?? null };
}

// ---------------- IG account ----------------

export interface IGUserInfo {
  igUserId: string;
  username: string;
  profilePictureUrl: string | null;
  followersCount: number;
  pageId: string;
  pageAccessToken: string;
}

// User access token → list of FB Pages → for each, find linked instagram_business_account.
export async function getIGUser(userAccessToken: string): Promise<IGUserInfo> {
  const pages = await jget<{
    data: { id: string; name: string; access_token: string }[];
  }>(`${GRAPH}/me/accounts?access_token=${userAccessToken}`);

  for (const page of pages.data) {
    const r = await jget<{
      instagram_business_account?: { id: string };
    }>(
      `${GRAPH}/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`
    );
    if (r.instagram_business_account) {
      const igId = r.instagram_business_account.id;
      const ig = await jget<{
        username: string;
        profile_picture_url?: string;
        followers_count?: number;
      }>(
        `${GRAPH}/${igId}?fields=username,profile_picture_url,followers_count&access_token=${page.access_token}`
      );
      return {
        igUserId: igId,
        username: ig.username,
        profilePictureUrl: ig.profile_picture_url ?? null,
        followersCount: ig.followers_count ?? 0,
        pageId: page.id,
        pageAccessToken: page.access_token,
      };
    }
  }
  throw new Error('No Instagram Business account linked to any of the user\'s Facebook Pages.');
}

// ---------------- Insights ----------------

// Returns 24-element array (one per hour, 0-23) of audience-online weighting (0-100 normalized).
export async function getAudienceHours(
  igUserId: string,
  pageAccessToken: string
): Promise<number[]> {
  const url =
    `${GRAPH}/${igUserId}/insights` +
    `?metric=online_followers&period=lifetime&access_token=${pageAccessToken}`;
  type InsightsResp = {
    data: {
      values: { value: Record<string, number>; end_time: string }[];
    }[];
  };
  const r = await jget<InsightsResp>(url);
  // Aggregate the most recent 7 days into a 24-hour distribution
  const buckets = new Array<number>(24).fill(0);
  const last7 = r.data[0]?.values.slice(-7) ?? [];
  for (const day of last7) {
    for (const [hourStr, val] of Object.entries(day.value)) {
      const h = Number(hourStr);
      if (h >= 0 && h <= 23) buckets[h] += val;
    }
  }
  const max = Math.max(...buckets, 1);
  return buckets.map((v) => Math.round((v / max) * 100));
}

export interface PostMetric {
  igPostId: string;
  postedAt: string;
  views: number; // matches the IG app's headline "Views" number for Reels
  reach: number;
  saves: number;
  likes: number;
  comments: number;
  shares: number;
  mediaType: string;
}

export interface IGMediaItem {
  id: string;
  timestamp: string;
  media_type: string; // IMAGE | VIDEO | CAROUSEL_ALBUM | REELS
  caption?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  like_count?: number;
  comments_count?: number;
}

export async function getRecentMedia(
  igUserId: string,
  pageAccessToken: string,
  limit = 30
): Promise<IGMediaItem[]> {
  // like_count + comments_count come directly off the media object — more
  // reliable than asking /insights for them (insights uses different metric
  // names per media type and rejects deprecated names like "impressions").
  const fields =
    'id,timestamp,media_type,caption,media_url,thumbnail_url,permalink,like_count,comments_count';
  const r = await jget<{ data: IGMediaItem[] }>(
    `${GRAPH}/${igUserId}/media?fields=${fields}&limit=${limit}&access_token=${pageAccessToken}`
  );
  return r.data;
}

// Insights endpoint only — for metrics not on the media object.
// reach + saved + shares + views are universally supported across IMAGE/VIDEO/REELS.
// impressions was deprecated by Meta (Nov 2024) and would cause 400.
export async function getPostMetrics(
  igPostId: string,
  pageAccessToken: string
): Promise<Partial<PostMetric>> {
  const metrics = ['reach', 'saved', 'shares', 'views'].join(',');
  const r = await jget<{
    data: { name: string; values: { value: number }[] }[];
  }>(`${GRAPH}/${igPostId}/insights?metric=${metrics}&access_token=${pageAccessToken}`).catch(
    () => ({ data: [] as { name: string; values: { value: number }[] }[] })
  );
  const out: Partial<PostMetric> = {};
  for (const m of r.data) {
    const v = m.values[0]?.value ?? 0;
    if (m.name === 'reach') out.reach = v;
    else if (m.name === 'views') out.views = v;
    else if (m.name === 'saved') out.saves = v;
    else if (m.name === 'shares') out.shares = v;
  }
  return out;
}

// ---------------- Publishing ----------------

export interface CreateContainerParams {
  igUserId: string;
  pageAccessToken: string;
  videoUrl?: string;
  imageUrl?: string;
  caption?: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'REELS';
}

export async function createMediaContainer(p: CreateContainerParams): Promise<string> {
  const params: Record<string, string> = {
    access_token: p.pageAccessToken,
    caption: p.caption ?? '',
  };
  if (p.mediaType === 'IMAGE') {
    if (!p.imageUrl) throw new Error('imageUrl required for IMAGE');
    params.image_url = p.imageUrl;
  } else {
    if (!p.videoUrl) throw new Error('videoUrl required for VIDEO/REELS');
    params.media_type = p.mediaType === 'REELS' ? 'REELS' : 'VIDEO';
    params.video_url = p.videoUrl;
  }
  const r = await jpost<{ id: string }>(`${GRAPH}/${p.igUserId}/media`, params);
  return r.id;
}

export async function publishMediaContainer(
  igUserId: string,
  pageAccessToken: string,
  creationId: string
): Promise<string> {
  const r = await jpost<{ id: string }>(`${GRAPH}/${igUserId}/media_publish`, {
    creation_id: creationId,
    access_token: pageAccessToken,
  });
  return r.id;
}

// Poll a container's status until FINISHED or ERROR (videos take a few seconds to process)
export async function waitForContainerReady(
  creationId: string,
  pageAccessToken: string,
  timeoutMs = 60_000
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const r = await jget<{ status_code: string }>(
      `${GRAPH}/${creationId}?fields=status_code&access_token=${pageAccessToken}`
    );
    if (r.status_code === 'FINISHED') return;
    if (r.status_code === 'ERROR' || r.status_code === 'EXPIRED') {
      throw new Error(`Media container failed: ${r.status_code}`);
    }
    await new Promise((res) => setTimeout(res, 3000));
  }
  throw new Error('Media container processing timed out');
}
