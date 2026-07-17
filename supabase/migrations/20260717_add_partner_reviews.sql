-- Javne ocene partnera: jedna ocena jednog prijavljenog klijenta po partneru.
create table if not exists public.partner_reviews (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.support_tickets(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text not null default '' check (char_length(comment) <= 500),
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (partner_id, profile_id)
);

create index if not exists partner_reviews_partner_rating_idx
  on public.partner_reviews(partner_id, rating desc, created_at desc);

alter table public.partner_reviews enable row level security;
grant select, insert, update, delete on public.partner_reviews to service_role;
