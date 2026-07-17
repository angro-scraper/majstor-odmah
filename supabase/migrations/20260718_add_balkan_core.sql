-- Balkan.works Core Platform: shared profile, business and module-preference layer.
-- Apply after the existing Majstor odmah schema and migrations.

alter table public.profiles
  add column if not exists preferred_locale text not null default 'sr' check (preferred_locale in ('sr', 'hr', 'bs', 'mk', 'sq', 'en', 'de')),
  add column if not exists country_code text,
  add column if not exists latitude numeric(9,6),
  add column if not exists longitude numeric(9,6),
  add column if not exists location_updated_at timestamptz;

create table if not exists public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_profile_id uuid not null references public.profiles(id) on delete cascade,
  legal_name text not null check (char_length(legal_name) between 2 and 180),
  display_name text not null check (char_length(display_name) between 2 and 120),
  business_type text not null check (business_type in ('sole_trader', 'company', 'store', 'service_provider', 'nonprofit', 'other')),
  city text not null check (char_length(city) between 2 and 80),
  country_code text,
  website text,
  description text,
  phone text,
  email text,
  verification_status text not null default 'pending' check (verification_status in ('pending', 'verified', 'rejected')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists business_profiles_owner_display_name_idx
  on public.business_profiles(owner_profile_id, lower(display_name));
create index if not exists business_profiles_city_type_idx
  on public.business_profiles(city, business_type) where is_active = true;

create table if not exists public.profile_module_preferences (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  module_key text not null check (module_key in ('market', 'deals', 'save-food', 'business', 'money')),
  is_pinned boolean not null default true,
  notifications_enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (profile_id, module_key)
);

create table if not exists public.platform_ratings (
  id uuid primary key default gen_random_uuid(),
  reviewer_profile_id uuid not null references public.profiles(id) on delete cascade,
  subject_profile_id uuid references public.profiles(id) on delete cascade,
  business_profile_id uuid references public.business_profiles(id) on delete cascade,
  module_key text not null check (module_key in ('market', 'deals', 'save-food', 'business', 'money')),
  reference_id text,
  rating smallint not null check (rating between 1 and 5),
  comment text check (char_length(comment) <= 1000),
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (num_nonnulls(subject_profile_id, business_profile_id) = 1)
);

create unique index if not exists platform_ratings_unique_subject_idx
  on public.platform_ratings(reviewer_profile_id, module_key, coalesce(reference_id, ''), coalesce(subject_profile_id::text, ''), coalesce(business_profile_id::text, ''));
create index if not exists platform_ratings_subject_idx
  on public.platform_ratings(module_key, subject_profile_id, business_profile_id, created_at desc);

drop trigger if exists business_profiles_set_updated_at on public.business_profiles;
create trigger business_profiles_set_updated_at
before update on public.business_profiles
for each row execute function public.set_updated_at();

drop trigger if exists profile_module_preferences_set_updated_at on public.profile_module_preferences;
create trigger profile_module_preferences_set_updated_at
before update on public.profile_module_preferences
for each row execute function public.set_updated_at();

drop trigger if exists platform_ratings_set_updated_at on public.platform_ratings;
create trigger platform_ratings_set_updated_at
before update on public.platform_ratings
for each row execute function public.set_updated_at();

alter table public.business_profiles enable row level security;
alter table public.profile_module_preferences enable row level security;
alter table public.platform_ratings enable row level security;

grant select, insert, update, delete on public.business_profiles to service_role;
grant select, insert, update, delete on public.profile_module_preferences to service_role;
grant select, insert, update, delete on public.platform_ratings to service_role;
