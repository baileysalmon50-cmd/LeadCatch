-- Applied to live DB via Supabase dashboard on 2026-07-09.
-- This file exists so the repo migration history matches reality. Do not re-run blindly.

create extension if not exists btree_gist;

create type appointment_status as enum (
  'new', 'confirmed', 'checked_in', 'in_service',
  'completed', 'cancelled', 'no_show'
);

create type appointment_source as enum ('ai_agent', 'manual');

create table public.service_types (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  duration_minutes integer not null check (duration_minutes between 5 and 480),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);

create table public.business_hours (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  is_open boolean not null default true,
  open_time time,
  close_time time,
  break_start time,
  break_end time,
  updated_at timestamptz not null default now(),
  unique (user_id, day_of_week),
  check (not is_open or (open_time is not null and close_time is not null and close_time > open_time)),
  check ((break_start is null) = (break_end is null)),
  check (break_start is null or break_end > break_start)
);

alter table public.settings
  add column if not exists timezone text not null default 'America/Chicago',
  add column if not exists bays_count smallint not null default 1
    check (bays_count between 1 and 20);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  vehicle_year text,
  vehicle_make text,
  vehicle_model text,
  service_type_id uuid references public.service_types(id) on delete set null,
  service_name text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  bay smallint not null default 1,
  status appointment_status not null default 'new',
  created_source appointment_source not null default 'manual',
  notes text,
  payment_status text,
  payment_link_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at),
  constraint no_double_booking exclude using gist (
    user_id with =,
    bay with =,
    tstzrange(starts_at, ends_at) with &&
  ) where (status not in ('cancelled', 'no_show'))
);

create index idx_appointments_user_starts on public.appointments (user_id, starts_at);
create index idx_appointments_lead on public.appointments (lead_id) where lead_id is not null;

create trigger set_updated_at_service_types
  before update on public.service_types
  for each row execute function public.update_updated_at_column();

create trigger set_updated_at_business_hours
  before update on public.business_hours
  for each row execute function public.update_updated_at_column();

create trigger set_updated_at_appointments
  before update on public.appointments
  for each row execute function public.update_updated_at_column();

alter table public.service_types enable row level security;
alter table public.business_hours enable row level security;
alter table public.appointments enable row level security;

create policy "own service_types" on public.service_types
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own business_hours" on public.business_hours
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own appointments" on public.appointments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

revoke truncate on public.service_types, public.business_hours, public.appointments
  from anon, authenticated;

insert into public.service_types (user_id, name, duration_minutes)
select u.id, s.name, s.mins
from auth.users u
cross join (values
  ('Oil Change', 30),
  ('Tire Replacement', 90),
  ('Brake Service', 120),
  ('Inspection', 45)
) as s(name, mins)
on conflict (user_id, name) do nothing;

insert into public.business_hours (user_id, day_of_week, is_open, open_time, close_time)
select u.id, d.dow,
       case when d.dow in (0) then false else true end,
       case when d.dow = 0 then null when d.dow = 6 then time '08:00' else time '08:00' end,
       case when d.dow = 0 then null when d.dow = 6 then time '14:00' else time '18:00' end
from auth.users u
cross join (select generate_series(0, 6) as dow) d
on conflict (user_id, day_of_week) do nothing;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, business_name, assigned_phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'business_name', ''),
    public.generate_assigned_phone()
  );
  INSERT INTO public.settings (user_id) VALUES (NEW.id);
  INSERT INTO public.subscriptions (user_id, plan) VALUES (NEW.id, 'free');
  INSERT INTO public.service_types (user_id, name, duration_minutes)
  VALUES
    (NEW.id, 'Oil Change', 30),
    (NEW.id, 'Tire Replacement', 90),
    (NEW.id, 'Brake Service', 120),
    (NEW.id, 'Inspection', 45);
  INSERT INTO public.business_hours (user_id, day_of_week, is_open, open_time, close_time)
  SELECT NEW.id, d,
         d <> 0,
         CASE WHEN d = 0 THEN NULL ELSE time '08:00' END,
         CASE WHEN d = 0 THEN NULL WHEN d = 6 THEN time '14:00' ELSE time '18:00' END
  FROM generate_series(0, 6) AS d;
  RETURN NEW;
END; $function$;