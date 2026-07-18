-- Majstor odmah: initial production data model for Supabase.
-- Apply this file in the Supabase SQL Editor for the majstor-odmah project.

create extension if not exists pgcrypto;

create type public.job_status as enum (
  'open', 'offered', 'accepted', 'in_progress', 'completed', 'cancelled'
);

create type public.offer_status as enum ('pending', 'accepted', 'declined', 'withdrawn');

create type public.profile_role as enum ('customer', 'provider', 'admin');

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  role public.profile_role not null default 'customer',
  full_name text not null,
  phone text,
  city text,
  avatar_path text,
  phone_verified boolean not null default false,
  identity_verified boolean not null default false,
  verification_status text not null default 'not_applicable' check (verification_status in ('not_applicable', 'pending', 'verified', 'rejected')),
  is_blocked boolean not null default false,
  blocked_at timestamptz,
  blocked_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.providers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  trade text not null,
  bio text,
  service_radius_km integer not null default 20 check (service_radius_km between 1 and 200),
  hourly_rate_min numeric(10,2),
  hourly_rate_max numeric(10,2),
  rating numeric(3,2) not null default 0 check (rating between 0 and 5),
  review_count integer not null default 0 check (review_count >= 0),
  available boolean not null default true,
  latitude numeric(9,6),
  longitude numeric(9,6),
  portfolio jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  customer_profile_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text not null,
  trade text not null,
  city text not null,
  address_hint text,
  budget_min numeric(10,2),
  budget_max numeric(10,2),
  desired_date date,
  status public.job_status not null default 'open',
  accepted_provider_id uuid references public.providers(id) on delete set null,
  workflow jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.job_images (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  storage_path text not null,
  caption text,
  created_at timestamptz not null default now()
);

create table public.job_matches (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  provider_id uuid not null references public.providers(id) on delete cascade,
  distance_km numeric(7,2),
  notified_at timestamptz,
  created_at timestamptz not null default now(),
  unique (job_id, provider_id)
);

create table public.offers (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  provider_id uuid not null references public.providers(id) on delete cascade,
  amount numeric(10,2) not null check (amount >= 0),
  currency text not null default 'RSD',
  message text,
  estimated_days integer check (estimated_days > 0),
  status public.offer_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, provider_id)
);

create table public.job_messages (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  sender_profile_id uuid references public.profiles(id) on delete set null,
  body text not null check (char_length(body) <= 4000),
  created_at timestamptz not null default now()
);

create table public.work_updates (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  provider_id uuid references public.providers(id) on delete set null,
  note text,
  progress_percent integer check (progress_percent between 0 and 100),
  created_at timestamptz not null default now()
);

create table public.work_update_images (
  id uuid primary key default gen_random_uuid(),
  work_update_id uuid not null references public.work_updates(id) on delete cascade,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null unique references public.jobs(id) on delete cascade,
  provider_id uuid not null references public.providers(id) on delete cascade,
  customer_profile_id uuid references public.profiles(id) on delete set null,
  rating smallint not null check (rating between 1 and 5),
  comment text check (char_length(comment) <= 2000),
  created_at timestamptz not null default now()
);

create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) <= 160),
  body text not null check (char_length(body) <= 1000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index jobs_status_trade_city_idx on public.jobs (status, trade, city);
create index job_matches_job_id_idx on public.job_matches (job_id);
create index offers_job_id_idx on public.offers (job_id);
create index job_messages_job_created_idx on public.job_messages (job_id, created_at);
create index work_updates_job_created_idx on public.work_updates (job_id, created_at);
create index notifications_profile_created_idx on public.notifications (profile_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger providers_set_updated_at
before update on public.providers
for each row execute function public.set_updated_at();

create trigger jobs_set_updated_at
before update on public.jobs
for each row execute function public.set_updated_at();

create trigger offers_set_updated_at
before update on public.offers
for each row execute function public.set_updated_at();

create trigger support_tickets_set_updated_at
before update on public.support_tickets
for each row execute function public.set_updated_at();

-- Private object storage for request and work-progress images.
insert into storage.buckets (id, name, public)
values ('job-images', 'job-images', false)
on conflict (id) do update set public = false;
