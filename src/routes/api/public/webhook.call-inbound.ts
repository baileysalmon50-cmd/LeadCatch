import { createFileRoute } from "@tanstack/react-router";
import { normalizeDialedNumber } from "@/lib/phone";

type RetellInboundWebhookPayload = {
  event?: string;
  call?: {
    call_id?: string;
    to_number?: string;
    from_number?: string;
    [key: string]: unknown;
  };
  to_number?: string;
  from_number?: string;
  [key: string]: unknown;
};

type RetellInboundWebhookResponse = {
  dynamic_variables: {
    shop_name: string;
    greeting: string;
  };
};

const DEFAULT_SHOP_NAME = "the shop";
const DEFAULT_GREETING = "Hi! Thanks for calling.";

function defaultInboundResponse(): RetellInboundWebhookResponse {
  return {
    dynamic_variables: {
      shop_name: DEFAULT_SHOP_NAME,
      greeting: DEFAULT_GREETING,
    },
  };
}

export const Route = createFileRoute("/api/public/webhook/call-inbound")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const secret = url.searchParams.get("secret");
        const expected = process.env.WEBHOOK_SECRET;

        if (!expected || secret !== expected) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        let body: RetellInboundWebhookPayload;
        try {
          body = (await request.json()) as RetellInboundWebhookPayload;
        } catch (error) {
          console.error("[webhook.call-inbound] Failed to parse JSON body", {
            error,
          });
          return new Response(JSON.stringify(defaultInboundResponse()), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        const rawToNumber = body.call?.to_number ?? body.to_number;
        const rawFromNumber = body.call?.from_number ?? body.from_number;
        const normalizedToNumber = normalizeDialedNumber(rawToNumber);

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        if (!normalizedToNumber) {
          console.error("[webhook.call-inbound] Missing or invalid to_number", {
            event: body.event,
            to_number: rawToNumber,
            from_number: rawFromNumber,
          });
          return new Response(JSON.stringify(defaultInboundResponse()), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        const { data: profile, error: profileError } = await supabaseAdmin
          .from("profiles")
          .select("id, business_name")
          .eq("retell_phone_id", normalizedToNumber)
          .maybeSingle();

        if (profileError) {
          console.error("[webhook.call-inbound] Profile lookup failed", {
            to_number: normalizedToNumber,
            from_number: rawFromNumber,
            error: profileError,
          });
          return new Response(JSON.stringify(defaultInboundResponse()), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        if (!profile?.id) {
          console.error("[webhook.call-inbound] Unmatched to_number", {
            to_number: normalizedToNumber,
            from_number: rawFromNumber,
          });
          return new Response(
            JSON.stringify({
              dynamic_variables: {
                shop_name: DEFAULT_SHOP_NAME,
                greeting: DEFAULT_GREETING,
              },
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        const {
          data: settings,
          error: settingsError,
        } = await supabaseAdmin
          .from("settings")
          .select("ai_greeting")
          .eq("user_id", profile.id)
          .maybeSingle();

        if (settingsError) {
          console.error("[webhook.call-inbound] Settings lookup failed", {
            user_id: profile.id,
            to_number: normalizedToNumber,
            error: settingsError,
          });
          return new Response(
            JSON.stringify({
              dynamic_variables: {
                shop_name: profile.business_name || DEFAULT_SHOP_NAME,
                greeting: DEFAULT_GREETING,
              },
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        return new Response(
          JSON.stringify({
            dynamic_variables: {
              shop_name: profile.business_name || DEFAULT_SHOP_NAME,
              greeting: settings?.ai_greeting || DEFAULT_GREETING,
            },
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      },
    },
  },
});
