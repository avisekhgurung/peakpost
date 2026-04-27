import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getOAuthUrl } from '@/lib/meta';

export const dynamic = 'force-dynamic';

// Single-button auth: anyone (logged-in or not) can start the Meta OAuth flow.
// Account creation + sign-in happen in the callback.
export async function GET() {
  const state = crypto.randomBytes(24).toString('base64url');
  const url = getOAuthUrl(state);
  const res = NextResponse.redirect(url);
  res.cookies.set('meta_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  });
  return res;
}
