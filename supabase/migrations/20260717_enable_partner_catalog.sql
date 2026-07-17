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

grant select, insert, update, delete
on table public.support_tickets
to service_role;
