-- Apply once in Supabase SQL Editor if the initial schema was already created.
-- Adds reversible account moderation for both customers and tradespeople.
alter table public.profiles
  add column if not exists is_blocked boolean not null default false,
  add column if not exists blocked_at timestamptz,
  add column if not exists blocked_reason text,
  add column if not exists verification_status text not null default 'not_applicable';

alter table public.profiles drop constraint if exists profiles_verification_status_check;
alter table public.profiles add constraint profiles_verification_status_check check (verification_status in ('not_applicable', 'pending', 'verified', 'rejected'));

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) <= 160),
  body text not null check (char_length(body) <= 1000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists profiles_is_blocked_idx on public.profiles (is_blocked) where is_blocked = true;
create index if not exists notifications_profile_created_idx on public.notifications (profile_id, created_at desc);
