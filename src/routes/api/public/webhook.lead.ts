import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

// Public webhook endpoint for Make.com / Twilio / Bland AI integrations.
// POST /api/public/webhook/lead
// Body: { user_id, name?, phone?, email?, business_need?, callback_time?, webhook_secret }
//
// Set WEBHOOK_SECRET in your project secrets. The caller must include it
// either as `x-webhook-secret` header or in the JSON body.

const schema = z.object({
  user_id: z.string().uuid(),
  name: z.string().max(200).optional(),
  phone: z.string().max(50).optional(),
  email: z.string().email().max(255).optional(),
  business_need: z.string().max(2000).optional(),
  callback_time: z.string().max(200).optional(),
});

export const Route = createFileRoute("/api/public/webhook/lead")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env.WEBHOOK_SECRET;
        const headerSecret = request.headers.get("x-webhook-secret");
        const raw = await request.json().catch(() => ({}));
        const bodySecret = (raw as { webhook_secret?: string }).webhook_secret;
        if (expected && headerSecret !== expected && bodySecret !== expected) {
          return new Response(JSON.stringify({ error: "Invalid secret" }), { status: 401, headers: { "Content-Type": "application/json" } });
        }
        const parsed = schema.safeParse(raw);
        if (!parsed.success) {
          return new Response(JSON.stringify({ error: "Invalid payload", details: parsed.error.flatten() }), { status: 400, headers: { "Content-Type": "application/json" } });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin.from("leads").insert({
          user_id: parsed.data.user_id,
          name: parsed.data.name || "Unknown caller",
          phone: parsed.data.phone || null,
          email: parsed.data.email || null,
          business_need: parsed.data.business_need || null,
          callback_time: parsed.data.callback_time || null,
        });
        if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
      },
    },
  },
});
