alter table public.subscriptions
  add column if not exists call_period_start timestamptz,
  add column if not exists stripe_subscription_id text,
  add column if not exists product_id text,
  add column if not exists price_id text,
  add column if not exists status text,
  add column if not exists current_period_start timestamptz,
  add column if not exists current_period_end timestamptz,
  add column if not exists cancel_at_period_end boolean not null default false,
  add column if not exists environment text;

comment on column public.subscriptions.call_period_start is
  'Holds Stripe current_period_start for usage-cap windowing. Null falls back to calendar month.';

create unique index if not exists subscriptions_stripe_subscription_id_key
  on public.subscriptions (stripe_subscription_id);
