import 'server-only';
import { createServerSupabase } from './supabase-server';

export interface SidebarContext {
  email: string;
  fullName: string | null;
  plan: 'free' | 'pro';
  igUsername: string | null;
  igProfilePictureUrl: string | null;
}

export async function loadSidebarContext(): Promise<SidebarContext | null> {
  const supa = await createServerSupabase();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: ig }] = await Promise.all([
    supa.from('users').select('plan').eq('id', user.id).maybeSingle(),
    supa
      .from('ig_accounts')
      .select('username, profile_picture_url')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  return {
    email: user.email ?? '',
    fullName: (user.user_metadata?.full_name as string | undefined) ?? null,
    plan: profile?.plan ?? 'free',
    igUsername: ig?.username ?? null,
    igProfilePictureUrl: ig?.profile_picture_url ?? null,
  };
}
