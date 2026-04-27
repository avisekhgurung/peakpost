import { NextResponse, type NextRequest } from 'next/server';
import { createServerSupabase, createServiceSupabase } from '@/lib/supabase-server';
import {
  exchangeCodeForToken,
  getLongLivedToken,
  getMeProfile,
  getIGUser,
} from '@/lib/meta';
import { encrypt } from '@/lib/crypto';

export const dynamic = 'force-dynamic';

function originFromRequest(req: NextRequest): string {
  const proto = req.headers.get('x-forwarded-proto') ?? 'https';
  const host =
    req.headers.get('x-forwarded-host') ??
    req.headers.get('host') ??
    new URL(req.url).host;
  return `${proto}://${host}`;
}

function loginRedirect(req: NextRequest, query: string) {
  const url = new URL('/login', originFromRequest(req));
  url.search = query;
  return NextResponse.redirect(url);
}

function dashboardRedirect(req: NextRequest, query: string) {
  const url = new URL('/dashboard', originFromRequest(req));
  url.search = query;
  return NextResponse.redirect(url);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) return loginRedirect(req, `?meta_error=${encodeURIComponent(error)}`);
  if (!code || !state) return loginRedirect(req, '?meta_error=missing_code_or_state');

  const expected = req.cookies.get('meta_oauth_state')?.value;
  if (!expected || expected !== state) {
    return loginRedirect(req, '?meta_error=state_mismatch');
  }

  // The redirect URI used at /api/auth/meta — Meta requires the same on exchange.
  const redirectUri = req.cookies.get('meta_oauth_redirect')?.value;

  try {
    // 1. Meta OAuth: code → short token → long-lived token
    const short = await exchangeCodeForToken(code, redirectUri);
    const long = await getLongLivedToken(short.access_token);

    // 2. Get the Facebook user's email + IG business account in parallel
    const [me, ig] = await Promise.all([
      getMeProfile(long.access_token),
      getIGUser(long.access_token),
    ]);

    if (!me.email) {
      return loginRedirect(req, '?meta_error=no_email_from_meta');
    }

    // 3. Ensure a Supabase auth user exists for this email (create if not).
    const admin = createServiceSupabase();
    let userId: string | null = null;

    const created = await admin.auth.admin.createUser({
      email: me.email,
      email_confirm: true,
      user_metadata: { full_name: me.name ?? me.email, source: 'meta' },
    });

    if (created.error) {
      // Likely "already registered" — look up the user via list with a filter.
      const list = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
      const found = list.data.users.find((u) => u.email === me.email);
      if (!found) throw new Error(`createUser: ${created.error.message}`);
      userId = found.id;
    } else {
      userId = created.data.user!.id;
    }

    // 4. Generate a magic-link OTP and verify it server-side to set the session cookie.
    const link = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email: me.email,
    });
    if (link.error || !link.data.properties?.hashed_token) {
      throw new Error(`generateLink: ${link.error?.message ?? 'no token'}`);
    }

    const supa = await createServerSupabase();
    const verify = await supa.auth.verifyOtp({
      type: 'magiclink',
      token_hash: link.data.properties.hashed_token,
    });
    if (verify.error) throw new Error(`verifyOtp: ${verify.error.message}`);

    // 5. Encrypt + upsert IG account
    const tokenEnc = encrypt(ig.pageAccessToken);
    const expiresAt = long.expires_in
      ? new Date(Date.now() + long.expires_in * 1000).toISOString()
      : null;

    const payload = {
      user_id: userId,
      ig_user_id: ig.igUserId,
      username: ig.username,
      access_token_enc: tokenEnc,
      token_expires_at: expiresAt,
      profile_picture_url: ig.profilePictureUrl,
      followers_count: ig.followersCount,
    };
    const { error: upsertErr } = await admin
      .from('ig_accounts')
      .upsert(payload, { onConflict: 'user_id,ig_user_id' });
    if (upsertErr) throw new Error(`db: ${upsertErr.message}`);

    const res = dashboardRedirect(req, '?connected=1');
    res.cookies.delete('meta_oauth_state');
    res.cookies.delete('meta_oauth_redirect');
    return res;
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown';
    return loginRedirect(req, `?meta_error=${encodeURIComponent(msg.slice(0, 200))}`);
  }
}
