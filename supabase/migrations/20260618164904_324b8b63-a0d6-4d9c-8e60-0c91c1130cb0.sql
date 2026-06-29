
-- Enum for lead status
CREATE TYPE public.lead_status AS ENUM ('new', 'called', 'converted');
CREATE TYPE public.plan_tier AS ENUM ('free', 'pro', 'business');

-- updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  business_name TEXT NOT NULL DEFAULT '',
  assigned_phone TEXT NOT NULL,
  forward_phone TEXT,
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  onboarded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- LEADS
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Unknown caller',
  phone TEXT,
  email TEXT,
  business_need TEXT,
  callback_time TEXT,
  status public.lead_status NOT NULL DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own leads all" ON public.leads FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER leads_updated BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX leads_user_created_idx ON public.leads (user_id, created_at DESC);

-- SETTINGS
CREATE TABLE public.settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  ai_greeting TEXT NOT NULL DEFAULT 'Hi! Sorry we missed your call. I''m the AI assistant — can I get your name, number, and what you''re looking for? Someone will reach back out soon.',
  callback_hours_start TEXT NOT NULL DEFAULT '09:00',
  callback_hours_end TEXT NOT NULL DEFAULT '18:00',
  notifications_email BOOLEAN NOT NULL DEFAULT true,
  notifications_sms BOOLEAN NOT NULL DEFAULT false,
  notifications_sms_phone TEXT,
  notifications_slack BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settings TO authenticated;
GRANT ALL ON public.settings TO service_role;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own settings all" ON public.settings FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER settings_updated BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SUBSCRIPTIONS
CREATE TABLE public.subscriptions (
  user_id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  plan public.plan_tier NOT NULL DEFAULT 'free',
  billing_date TIMESTAMPTZ,
  stripe_customer_id TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own sub all" ON public.subscriptions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER subs_updated BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Phone assignment helper (fake but realistic-looking)
CREATE OR REPLACE FUNCTION public.generate_assigned_phone()
RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE area_codes TEXT[] := ARRAY['415','512','646','305','312','206','718','619','404','617'];
BEGIN
  RETURN '+1 (' || area_codes[1 + floor(random()*10)::int] || ') ' ||
         lpad(floor(random()*900+100)::text, 3, '0') || '-' ||
         lpad(floor(random()*9000+1000)::text, 4, '0');
END; $$;

-- Auto-provision profile + settings + subscription on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
