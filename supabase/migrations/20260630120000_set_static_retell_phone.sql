-- Use a single shared Retell number for all newly provisioned profiles.
CREATE OR REPLACE FUNCTION public.generate_assigned_phone()
RETURNS TEXT LANGUAGE plpgsql AS $$
BEGIN
  RETURN '1(754)341-1322';
END; $$;
