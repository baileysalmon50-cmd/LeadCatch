ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS call_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS leads_call_id_unique_idx
ON public.leads (call_id)
WHERE call_id IS NOT NULL;
