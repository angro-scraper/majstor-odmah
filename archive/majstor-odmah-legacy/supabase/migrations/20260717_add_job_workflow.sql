alter table public.jobs
add column if not exists workflow jsonb not null default '{}'::jsonb;
