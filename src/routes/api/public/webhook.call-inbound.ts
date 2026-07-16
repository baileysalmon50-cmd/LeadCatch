import { createFileRoute } from "@tanstack/react-router";
import { normalizeDialedNumber } from "@/lib/phone";

type RetellInboundWebhookPayload = {
  event?: string;
  call_inbound?: {
    agent_id?: string;
    to_number?: string;
    from_number?: string;
    [key: string]: unknown;
  };
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
  call_inbound: {
    dynamic_variables: Record<string, string>;
  };
};

const DEFAULT_SHOP_NAME = "the shop";
const DEFAULT_GREETING = "Hi! Thanks for calling.";

function toStringOrUndefined(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  return String(value);
}

function inboundResponse(input?: {
  shopName?: unknown;
  greeting?: unknown;
}): RetellInboundWebhookResponse {
  const dynamicVariables: Record<string, string> = {
    shop_name: toStringOrUndefined(input?.shopName) || DEFAULT_SHOP_NAME,
    greeting: toStringOrUndefined(input?.greeting) || DEFAULT_GREETING,
  };

  return {
    call_inbound: {
      dynamic_variables: dynamicVariables,
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
          return new Response(JSON.stringify(inboundResponse()), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        const rawToNumber = body.call_inbound?.to_number ?? body.call?.to_number ?? body.to_number;
        const rawFromNumber =
          body.call_inbound?.from_number ?? body.call?.from_number ?? body.from_number;
        const normalizedToNumber = normalizeDialedNumber(rawToNumber);

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        if (!normalizedToNumber) {
          console.error("[webhook.call-inbound] Missing or invalid to_number", {
            event: body.event,
            to_number: rawToNumber,
            from_number: rawFromNumber,
          });
          return new Response(JSON.stringify(inboundResponse()), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        const { data: profileMatches, error: profileError } = await supabaseAdmin
          .from("profiles")
          .select("id, business_name")
          .eq("retell_phone_id", normalizedToNumber)
          .limit(2);

        const matchCount = (profileMatches || []).length;
        console.log("[webhook.call-inbound] Profile lookup result", {
          normalized_to_number: normalizedToNumber,
          matches: matchCount,
        });

        if (profileError) {
          console.error("[webhook.call-inbound] Profile lookup failed", {
            to_number: normalizedToNumber,
            from_number: rawFromNumber,
            error: profileError,
          });
          return new Response(JSON.stringify(inboundResponse()), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        const profile = matchCount === 1 ? profileMatches![0] : null;

        if (!profile?.id) {
          console.error("[webhook.call-inbound] Unmatched to_number", {
            to_number: normalizedToNumber,
            from_number: rawFromNumber,
            matches: matchCount,
          });
          return new Response(JSON.stringify(inboundResponse()), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
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
            JSON.stringify(
              inboundResponse({
                shopName: profile.business_name,
                greeting: DEFAULT_GREETING,
              }),
            ),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        return new Response(
          JSON.stringify(
            inboundResponse({
              shopName: profile.business_name,
              greeting: settings?.ai_greeting,
            }),
          ),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      },
    },
  },
});
