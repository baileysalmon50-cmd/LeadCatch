alter table public.profiles
  alter column assigned_phone drop not null,
  add column if not exists retell_phone_id text;

comment on column public.profiles.retell_phone_id is
  'Retell phone number id for the provisioned assigned_phone';

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
    NULL
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

drop function if exists public.generate_assigned_phone();
