-- Apply once in Supabase SQL Editor if the initial schema was already created.
-- Adds reversible account moderation for both customers and tradespeople.
alter table public.profiles
  add column if not exists is_blocked boolean not null default false,
  add column if not exists blocked_at timestamptz,
  add column if not exists blocked_reason text;

create index if not exists profiles_is_blocked_idx on public.profiles (is_blocked) where is_blocked = true;
