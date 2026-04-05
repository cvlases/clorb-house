-- ─── Clorb House — Initial Schema ────────────────────────────────────────────
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query).

-- ── Users ─────────────────────────────────────────────────────────────────────
create table if not exists public.users (
  id            uuid primary key references auth.users on delete cascade,
  display_name  text not null,
  created_at    timestamptz default now()
);

-- ── Chore Sessions ────────────────────────────────────────────────────────────
create table if not exists public.chore_sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  chore_type    text not null,
  started_at    timestamptz default now(),
  completed_at  timestamptz,
  given_up_at   timestamptz,
  duration_sec  int,
  status        text not null default 'active'
                  check (status in ('active', 'completed', 'abandoned'))
);

-- ── User Stats ────────────────────────────────────────────────────────────────
create table if not exists public.user_stats (
  user_id          uuid primary key references public.users(id) on delete cascade,
  total_completed  int default 0,
  current_streak   int default 0,
  longest_streak   int default 0,
  last_chore_date  date,
  badges_earned    text[] default '{}'
);

-- ── Shelf Items ───────────────────────────────────────────────────────────────
-- item_key is either a collectible name (from Reward screen) or a reward id
-- (from the Rewards redemption board).
create table if not exists public.shelf_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  item_key    text not null,
  earned_at   timestamptz default now()
);

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table public.users          enable row level security;
alter table public.chore_sessions enable row level security;
alter table public.user_stats     enable row level security;
alter table public.shelf_items    enable row level security;

-- users: own row only
create policy "users_select_own" on public.users
  for select using (auth.uid() = id);
create policy "users_insert_own" on public.users
  for insert with check (auth.uid() = id);
create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

-- chore_sessions: own rows only
create policy "sessions_select_own" on public.chore_sessions
  for select using (auth.uid() = user_id);
create policy "sessions_insert_own" on public.chore_sessions
  for insert with check (auth.uid() = user_id);
create policy "sessions_update_own" on public.chore_sessions
  for update using (auth.uid() = user_id);

-- user_stats: own row only
create policy "stats_select_own" on public.user_stats
  for select using (auth.uid() = user_id);
create policy "stats_insert_own" on public.user_stats
  for insert with check (auth.uid() = user_id);
create policy "stats_update_own" on public.user_stats
  for update using (auth.uid() = user_id);

-- shelf_items: own rows only
create policy "shelf_select_own" on public.shelf_items
  for select using (auth.uid() = user_id);
create policy "shelf_insert_own" on public.shelf_items
  for insert with check (auth.uid() = user_id);

-- ── Trigger: create user record + stats on auth sign-up ──────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', 'Clorb' || floor(random() * 9999)::text)
  )
  on conflict (id) do nothing;

  insert into public.user_stats (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

-- Drop before recreate to allow re-running
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
