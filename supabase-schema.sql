-- WOG-FUNDS production database schema
create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  donation_date date not null,
  donor_name text not null,
  amount numeric(12,2) not null check (amount >= 0),
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
  amount numeric(12,2) not null check (amount >= 0),
  category text,
  remarks text,
  created_at timestamptz not null default now()
);

alter table public.donations enable row level security;
alter table public.expenses enable row level security;

-- Add authenticated-user policies after creating your WOG admin accounts.
