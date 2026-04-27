import { NextResponse, type NextRequest } from 'next/server';
import crypto from 'node:crypto';
import { getOAuthUrl, buildRedirectUri } from '@/lib/meta';

export const dynamic = 'force-dynamic';

// Resolve the public origin for this request, honoring Vercel's x-forwarded-* headers.
function originFromRequest(req: NextRequest): string {
  const proto = req.headers.get('x-forwarded-proto') ?? 'https';
  const host =
    req.headers.get('x-forwarded-host') ??
    req.headers.get('host') ??
    new URL(req.url).host;
  return `${proto}://${host}`;
}

export async function GET(req: NextRequest) {
  const state = crypto.randomBytes(24).toString('base64url');
  const origin = originFromRequest(req);
  const redirectUri = buildRedirectUri(origin);
  const url = getOAuthUrl(state, redirectUri);
  const res = NextResponse.redirect(url);
  // Persist redirect URI alongside state so the callback can use the same one
  // when exchanging the code (Meta requires the exchange URI to match the auth URI).
  res.cookies.set('meta_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  });
  res.cookies.set('meta_oauth_redirect', redirectUri, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  });
  return res;
}
