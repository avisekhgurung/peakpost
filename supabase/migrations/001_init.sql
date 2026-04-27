-- PeakPost — Initial schema
-- Tables: users, ig_accounts, scheduled_posts, post_analytics
-- Enables RLS on every table; user-scoped via auth.uid()

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
do $$ begin
  create type user_plan as enum ('free', 'pro');
exception when duplicate_object then null; end $$;

do $$ begin
  create type post_status as enum ('pending', 'published', 'failed', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type media_type as enum ('IMAGE', 'VIDEO', 'REELS');
exception when duplicate_object then null; end $$;

do $$ begin
  create type content_type as enum ('aesthetic', 'tutorial', 'dance', 'talking', 'funny', 'other');
exception when duplicate_object then null; end $$;

-- ============================================================
-- TABLE: users (mirrors auth.users 1:1)
-- ============================================================
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  plan user_plan not null default 'free',
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  created_at timestamptz not null default now()
);

-- Auto-create a public.users row when a new auth.users row is inserted
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- TABLE: ig_accounts
-- ============================================================
create table if not exists public.ig_accounts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  ig_user_id text not null,
  username text not null,
  access_token_enc text not null,
  token_expires_at timestamptz,
  profile_picture_url text,
  followers_count int default 0,
  created_at timestamptz not null default now(),
  unique (user_id, ig_user_id)
);

create index if not exists ig_accounts_user_id_idx on public.ig_accounts(user_id);

-- ============================================================
-- TABLE: scheduled_posts
-- ============================================================
create table if not exists public.scheduled_posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  ig_account_id uuid not null references public.ig_accounts(id) on delete cascade,
  caption text default '',
  storage_path text,
  public_url text,
  media_type media_type not null,
  content_type content_type default 'other',
  trending_audio boolean default false,
  with_face boolean default false,
  scheduled_at timestamptz not null,
  status post_status not null default 'pending',
  auto_publish boolean not null default false,
  ig_post_id text,
  error_message text,
  reminder_sent boolean not null default false,
  created_at timestamptz not null default now()
);

-- Critical index for the cron job query (every minute)
create index if not exists scheduled_posts_cron_idx
  on public.scheduled_posts(status, scheduled_at)
  where status = 'pending';

create index if not exists scheduled_posts_user_id_idx on public.scheduled_posts(user_id);

-- ============================================================
-- TABLE: post_analytics
-- ============================================================
create table if not exists public.post_analytics (
  id uuid primary key default uuid_generate_v4(),
  ig_account_id uuid not null references public.ig_accounts(id) on delete cascade,
  ig_post_id text not null,
  posted_at timestamptz not null,
  reach int default 0,
  impressions int default 0,
  saves int default 0,
  shares int default 0,
  likes int default 0,
  comments int default 0,
  media_type media_type,
  content_type content_type,
  trending_audio boolean default false,
  hashtag_count int default 0,
  synced_at timestamptz not null default now(),
  unique (ig_account_id, ig_post_id)
);

create index if not exists post_analytics_account_idx on public.post_analytics(ig_account_id, posted_at desc);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.users enable row level security;
alter table public.ig_accounts enable row level security;
alter table public.scheduled_posts enable row level security;
alter table public.post_analytics enable row level security;

-- users: a user can only see and update their own row
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own" on public.users
  for select using (auth.uid() = id);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

-- ig_accounts: scoped to user_id
drop policy if exists "ig_accounts_all_own" on public.ig_accounts;
create policy "ig_accounts_all_own" on public.ig_accounts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- scheduled_posts: scoped to user_id
drop policy if exists "scheduled_posts_all_own" on public.scheduled_posts;
create policy "scheduled_posts_all_own" on public.scheduled_posts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- post_analytics: scoped via the parent ig_account
drop policy if exists "post_analytics_select_own" on public.post_analytics;
create policy "post_analytics_select_own" on public.post_analytics
  for select using (
    exists (
      select 1 from public.ig_accounts a
      where a.id = post_analytics.ig_account_id and a.user_id = auth.uid()
    )
  );

-- ============================================================
-- STORAGE: posts bucket (public, for video/photo uploads)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('posts', 'posts', true)
on conflict (id) do nothing;

-- Authenticated users can upload to their own folder (path prefix = auth.uid())
drop policy if exists "posts_insert_own" on storage.objects;
create policy "posts_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'posts'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "posts_select_public" on storage.objects;
create policy "posts_select_public" on storage.objects
  for select using (bucket_id = 'posts');

drop policy if exists "posts_delete_own" on storage.objects;
create policy "posts_delete_own" on storage.objects
  for delete using (
    bucket_id = 'posts'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
