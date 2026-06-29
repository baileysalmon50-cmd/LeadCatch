import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { type StripeEnv, verifyWebhook } from "@/lib/stripe.server";

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase(): any {
  if (!_supabase) {
    _supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  }
  return _supabase;
}

function priceIdToPlan(priceId: string | null | undefined): "free" | "pro" | "business" {
  if (!priceId) return "free";
  if (priceId.startsWith("business")) return "business";
  if (priceId.startsWith("pro")) return "pro";
  return "free";
}

function resolvePriceId(price: any): string | undefined {
  return price?.lookup_key || price?.metadata?.lovable_external_id || price?.id;
}

// TODO: wire to a real email provider (Resend, Postmark, etc.).
async function sendEmail(kind: "welcome" | "winback", userId: string, plan: string) {
  console.log(`[email] ${kind} → user=${userId} plan=${plan}`);
}

async function upsertSubscription(subscription: any, env: StripeEnv, opts: { resetCallPeriod?: boolean } = {}) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error("No userId in subscription metadata");
    return;
  }
  const item = subscription.items?.data?.[0];
  const priceId = resolvePriceId(item?.price);
  const productId = typeof item?.price?.product === "string" ? item.price.product : item?.price?.product?.id;
  const periodStart = item?.current_period_start ?? subscription.current_period_start;
  const periodEnd = item?.current_period_end ?? subscription.current_period_end;
  const plan = priceIdToPlan(priceId);

  await getSupabase().from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer,
      product_id: productId,
      price_id: priceId,
      status: subscription.status,
      plan,
      current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      billing_date: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      cancel_at_period_end: subscription.cancel_at_period_end ?? false,
      environment: env,
      ...(opts.resetCallPeriod && { call_period_start: new Date().toISOString() }),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" },
  );

  return { userId, plan };
}

async function handleWebhook(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);

  switch (event.type) {
    case "customer.subscription.created": {
      const res = await upsertSubscription(event.data.object, env, { resetCallPeriod: true });
      if (res) await sendEmail("welcome", res.userId, res.plan);
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object;
      // Detect cancellation request → schedule win-back email.
      await upsertSubscription(sub, env);
      if (sub.cancel_at_period_end && sub.metadata?.userId) {
        await sendEmail("winback", sub.metadata.userId, priceIdToPlan(resolvePriceId(sub.items?.data?.[0]?.price)));
      }
      break;
    }
    case "customer.subscription.deleted": {
      // End-of-period: drop user back to free.
      const sub = event.data.object;
      const userId = sub.metadata?.userId;
      if (userId) {
        await getSupabase()
          .from("subscriptions")
          .update({
            status: "canceled",
            plan: "free",
            cancel_at_period_end: false,
            updated_at: new Date().toISOString(),
            call_period_start: new Date().toISOString(),
          })
          .eq("user_id", userId)
          .eq("environment", env);
      }
      break;
    }
    case "invoice.paid": {
      // Renewal: reset call quota window.
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;
      if (subscriptionId) {
        await getSupabase()
          .from("subscriptions")
          .update({
            call_period_start: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscriptionId)
          .eq("environment", env);
      }
      break;
    }
    default:
      console.log("Unhandled event:", event.type);
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          console.error("Webhook received with invalid or missing env:", rawEnv);
          return Response.json({ received: true, ignored: "invalid env" });
        }
        try {
          await handleWebhook(request, rawEnv);
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
