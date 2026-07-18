-- Partnerski katalog koristi postojeću tabelu support_tickets:
-- prijave ostaju tiketi, a administrativno potvrđeni partneri dobijaju status resolved.
-- Ova politika dozvoljava samo serverskom service_role pristupu da čita i menja te zapise.

alter table public.support_tickets enable row level security;

drop policy if exists "service_role manages support tickets" on public.support_tickets;

create policy "service_role manages support tickets"
on public.support_tickets
for all
to service_role
using (true)
with check (true);

-- The server uses a Supabase secret key. It maps to service_role and needs
-- explicit grants because this project has table-level permissions enabled.
grant usage on schema public to service_role;
grant select, insert, update, delete on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;
