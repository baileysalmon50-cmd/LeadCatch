import { createFileRoute } from "@tanstack/react-router";

type RetellWebhookPayload = {
  call_id?: string;
  transcript?: string;
  recording_url?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  service_type?: string;
  callback_time?: string;
  extracted_data?: {
    customer_name?: string;
    customer_phone?: string;
    customer_email?: string;
    service_type?: string;
    preferred_callback_time?: string;
  };
};

export const Route = createFileRoute("/api/public/webhook/lead")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env.WEBHOOK_SECRET;
        const headerSecret = request.headers.get("x-webhook-secret");
        if (!expected || headerSecret !== expected) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const body = (await request.json()) as RetellWebhookPayload;
          const extracted = body.extracted_data || {};
          const notes = [
            `Call ID: ${body.call_id || "N/A"}`,
            "",
            "Transcript:",
            body.transcript || "N/A",
            "",
            `Recording: ${body.recording_url || "N/A"}`,
          ].join("\n");

          const leadData = {
            user_id: request.headers.get("x-user-id") || "default-user",
            name: extracted.customer_name || body.customer_name || "Unknown caller",
            phone: extracted.customer_phone || body.customer_phone || null,
            email: extracted.customer_email || body.customer_email || null,
            business_need: extracted.service_type || body.service_type || null,
            callback_time: extracted.preferred_callback_time || body.callback_time || null,
            notes,
            status: "new",
          };

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { error } = await supabaseAdmin.from("leads").insert([leadData]);

          if (error) {
            console.error("Supabase error:", error);
            return new Response(JSON.stringify({ error: error.message }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ success: true, lead_id: body.call_id }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("Webhook error:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
