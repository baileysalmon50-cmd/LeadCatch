alter table public.leads
  add column if not exists called_at timestamptz,
  add column if not exists converted_at timestamptz;

comment on column public.leads.called_at is
  'Timestamp of first transition to called (used for response-time analytics).';

comment on column public.leads.converted_at is
  'Timestamp of first transition to converted.';
