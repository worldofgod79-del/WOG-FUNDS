create extension if not exists pgcrypto;

create table if not exists public.donations (
 id uuid primary key default gen_random_uuid(),
 donation_date date not null,
 donor_name text not null,
 amount numeric(12,2) not null check(amount>=0),
 payment_mode text,
 purpose text,
 reference text,
 remarks text,
 created_at timestamptz not null default now()
);

create table if not exists public.expenses (
 id uuid primary key default gen_random_uuid(),
 expense_date date not null,
 description text not null,
 amount numeric(12,2) not null check(amount>=0),
 category text,
 remarks text,
 created_at timestamptz not null default now()
);

alter table public.donations enable row level security;
alter table public.expenses enable row level security;

-- NO LOGIN version:
-- Anyone who knows the website can read/insert/delete records.
-- Use only if you accept that risk.
create policy "public read donations" on public.donations for select to anon using (true);
create policy "public insert donations" on public.donations for insert to anon with check (true);
create policy "public delete donations" on public.donations for delete to anon using (true);

create policy "public read expenses" on public.expenses for select to anon using (true);
create policy "public insert expenses" on public.expenses for insert to anon with check (true);
create policy "public delete expenses" on public.expenses for delete to anon using (true);
