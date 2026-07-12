-- Align no_double_booking with client overlap checks (exclude only cancelled slots).

alter table public.appointments
  drop constraint if exists no_double_booking;

alter table public.appointments
  add constraint no_double_booking exclude using gist (
    user_id with =,
    bay with =,
    tstzrange(starts_at, ends_at) with &&
  ) where (status <> 'cancelled');
