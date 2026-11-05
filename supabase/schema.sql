-- =========================================================
-- STITCHES · database setup
-- Paste all of this into Supabase → SQL Editor → New query → Run.
-- Safe to run more than once.
-- =========================================================

create extension if not exists "pgcrypto";

-- ---------- Tailors (the people who log in) ----------
create table if not exists public.tailors (
  id             uuid primary key default gen_random_uuid(),
  business_name  text not null,
  full_name      text not null,
  email          text not null unique check (email = lower(email)),
  password_hash  text not null,
  phone          text,
  unit           text not null default 'in' check (unit in ('in', 'cm')),
  currency       text not null default 'NGN',
  created_at     timestamptz not null default now()
);

-- ---------- Clients ----------
create table if not exists public.clients (
  id          uuid primary key default gen_random_uuid(),
  tailor_id   uuid not null references public.tailors(id) on delete cascade,
  full_name   text not null,
  phone       text,
  email       text,
  gender      text not null default 'female' check (gender in ('female', 'male')),
  address     text,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists clients_tailor_name_idx on public.clients (tailor_id, full_name);
create index if not exists clients_tailor_updated_idx on public.clients (tailor_id, updated_at desc);

-- ---------- Measurement sets ----------
create table if not exists public.measurements (
  id          uuid primary key default gen_random_uuid(),
  tailor_id   uuid not null references public.tailors(id) on delete cascade,
  client_id   uuid not null references public.clients(id) on delete cascade,
  label       text not null default 'Standard',
  unit        text not null default 'in' check (unit in ('in', 'cm')),
  "values"    jsonb not null default '{}'::jsonb,   -- e.g. {"neck": 15.5, "chest": 40}
  extras      jsonb not null default '[]'::jsonb,   -- e.g. [{"label": "Cap size", "value": "23"}]
  notes       text,
  taken_at    date not null default current_date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists measurements_client_idx on public.measurements (client_id, taken_at desc);
create index if not exists measurements_tailor_idx on public.measurements (tailor_id);

-- ---------- Orders ----------
create table if not exists public.orders (
  id          uuid primary key default gen_random_uuid(),
  tailor_id   uuid not null references public.tailors(id) on delete cascade,
  client_id   uuid not null references public.clients(id) on delete cascade,
  title       text not null,
  status      text not null default 'pending'
              check (status in ('pending', 'in_progress', 'ready', 'delivered')),
  due_date    date,
  price       numeric(12, 2),
  deposit     numeric(12, 2),
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists orders_tailor_status_idx on public.orders (tailor_id, status, due_date);
create index if not exists orders_client_idx on public.orders (client_id);

-- ---------- Order status links for clients ----------
-- Each order gets a long random code. Anyone with the link /o/<code> can see that
-- one order's status (no login). The tailor can make a new code to cancel an old link.
alter table public.orders add column if not exists share_token text
  default replace(gen_random_uuid()::text, '-', '');
update public.orders set share_token = replace(gen_random_uuid()::text, '-', '') where share_token is null;
create unique index if not exists orders_share_token_idx on public.orders (share_token);

-- ---------- Account access (set by the admin at /admin) ----------
-- trial   = new sign-up, can use the app and sees a "pay for full access" notice
-- active  = paid and approved by the admin
-- blocked = cannot log in
alter table public.tailors add column if not exists status text not null default 'trial';
alter table public.tailors add column if not exists approved_at timestamptz;
alter table public.tailors add column if not exists admin_note text;
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'tailors_status_check') then
    alter table public.tailors add constraint tailors_status_check check (status in ('trial', 'active', 'blocked'));
  end if;
end $$;

-- ---------- Payments received from tailors (recorded by the admin) ----------
create table if not exists public.payments (
  id          uuid primary key default gen_random_uuid(),
  tailor_id   uuid references public.tailors(id) on delete set null,
  payer       text not null,                       -- business name at the time of payment
  amount      numeric(12, 2) not null check (amount >= 0),
  currency    text not null default 'NGN',
  method      text,                                -- e.g. Bank transfer, Cash
  note        text,
  paid_at     date not null default current_date,
  created_at  timestamptz not null default now()
);
create index if not exists payments_paid_at_idx on public.payments (paid_at desc);
create index if not exists payments_tailor_idx on public.payments (tailor_id);

-- ---------- Keep updated_at fresh ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists clients_updated_at on public.clients;
create trigger clients_updated_at before update on public.clients
  for each row execute function public.set_updated_at();

drop trigger if exists measurements_updated_at on public.measurements;
create trigger measurements_updated_at before update on public.measurements
  for each row execute function public.set_updated_at();

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

-- ---------- Lock the tables ----------
-- Row Level Security is ON with no policies, so the public "anon" key can read nothing.
-- The Stitches server uses the private service-role key and checks the logged-in tailor itself.
alter table public.tailors      enable row level security;
alter table public.clients      enable row level security;
alter table public.measurements enable row level security;
alter table public.orders       enable row level security;
alter table public.payments     enable row level security;

revoke all on public.tailors, public.clients, public.measurements, public.orders, public.payments from anon, authenticated;
