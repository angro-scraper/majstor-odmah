-- Stavke kataloga koje partneri prikazuju na javnoj stranici.
create table if not exists public.partner_catalog_items (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.support_tickets(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 120),
  description text not null default '' check (char_length(description) <= 700),
  price_label text not null default '' check (char_length(price_label) <= 80),
  link_url text not null default '' check (char_length(link_url) <= 300),
  image_url text not null default '' check (char_length(image_url) <= 500),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists partner_catalog_items_partner_id_idx on public.partner_catalog_items(partner_id, created_at desc);
alter table public.partner_catalog_items enable row level security;
grant select, insert, update, delete on public.partner_catalog_items to service_role;
