import { createFileRoute } from "@tanstack/react-router";

type RetellWebhookPayload = {
  event?: string;
  call?: {
    call_id?: string;
    from_number?: string;
    to_number?: string;
    transcript?: string;
    recording_url?: string;
    call_analysis?: {
      call_summary?: string;
      custom_analysis_data?: Record<string, string | null | undefined>;
      [key: string]: unknown;
    };
  };
};

type PlanTier = "free" | "pro" | "business";

const UUID_V4_OR_V5_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

let hasLoggedAnalysisStructure = false;

function getPlanLimit(plan: PlanTier) {
  if (plan === "free") return 10;
  if (plan === "pro") return 100;
  return Number.POSITIVE_INFINITY;
}

function isRealLead(name: string, businessNeed: string | null) {
  return name !== "Unknown caller" || !!businessNeed;
}

export const Route = createFileRoute("/api/public/webhook/lead")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const userId = url.searchParams.get("user_id");
        const secret = url.searchParams.get("secret");
        const expected = process.env.WEBHOOK_SECRET;

        if (!expected || secret !== expected) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        if (!userId || !UUID_V4_OR_V5_REGEX.test(userId)) {
          return new Response(JSON.stringify({ error: "Invalid user_id" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const body = (await request.json()) as RetellWebhookPayload;
          if (body.event !== "call_analyzed") {
            return new Response(JSON.stringify({ success: true, ignored: true }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          const call = body.call;
          if (!call) {
            return new Response(JSON.stringify({ error: "Missing call object" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const callId = call?.call_id;
          if (!callId) {
            return new Response(JSON.stringify({ error: "Missing call_id" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (!hasLoggedAnalysisStructure) {
            console.log("Retell call_analysis structure:", call.call_analysis);
            hasLoggedAnalysisStructure = true;
          }

          const customAnalysisData = call.call_analysis?.custom_analysis_data || {};
          const customerName = customAnalysisData.customer_name || "Unknown caller";
          const customerPhone = customAnalysisData.callback_phone || call.from_number || null;
          const businessNeed = customAnalysisData.service_needed || null;
          const vehicle = customAnalysisData.vehicle || null;
          const urgency = customAnalysisData.symptoms_urgency || null;
          const callSummary = call.call_analysis?.call_summary || null;
          const realLead = isRealLead(customerName, businessNeed);

          const notesParts = [
            `Call ID: ${callId}`,
            vehicle ? `Vehicle: ${vehicle}` : null,
            urgency ? `Urgency: ${urgency}` : null,
            businessNeed ? `Service Needed: ${businessNeed}` : null,
            callSummary ? `Call Summary: ${callSummary}` : null,
            call.transcript ? `Transcript:\n${call.transcript}` : null,
            call.recording_url ? `Recording URL: ${call.recording_url}` : null,
          ].filter(Boolean);

          const notes = notesParts.join("\n\n");

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data: existingLead, error: selectError } = await supabaseAdmin
            .from("leads")
            .select("id")
            .eq("call_id", callId)
            .limit(1)
            .maybeSingle();

          if (selectError) {
            console.error("Supabase lookup error:", selectError);
            return new Response(JSON.stringify({ error: selectError.message }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (existingLead) {
            return new Response(JSON.stringify({ success: true, duplicate: true }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          let locked = false;
          let plan: PlanTier = "free";
          let usedCount = 0;
          let limit = Number.POSITIVE_INFINITY;

          if (realLead) {
            const { data: subscription, error: subscriptionError } = await supabaseAdmin
              .from("subscriptions")
              .select("plan")
              .eq("user_id", userId)
              .maybeSingle();

            if (subscriptionError) {
              console.error("Supabase subscription lookup error:", subscriptionError);
              return new Response(JSON.stringify({ error: subscriptionError.message }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
              });
            }

            plan = (subscription?.plan as PlanTier | undefined) || "free";
            const now = new Date();
            const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);

            const { data: countedLeads, error: countError } = await supabaseAdmin
              .from("leads")
              .select("name, business_need")
              .eq("user_id", userId)
              .eq("locked", false)
              .gte("created_at", periodStart.toISOString());

            if (countError) {
              console.error("Supabase lead count error:", countError);
              return new Response(JSON.stringify({ error: countError.message }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
              });
            }

            usedCount = (countedLeads || []).filter((lead) =>
              isRealLead(lead.name || "Unknown caller", lead.business_need || null),
            ).length;
            limit = getPlanLimit(plan);
            locked = usedCount >= limit;
          }

          const leadData = {
            user_id: userId,
            call_id: callId,
            name: customerName,
            phone: customerPhone,
            business_need: businessNeed,
            locked,
            notes,
            status: "new" as const,
          };

          const { error } = await supabaseAdmin.from("leads").insert([leadData]);

          if (error) {
            if (error.code === "23505") {
              return new Response(JSON.stringify({ success: true, duplicate: true }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            }

            console.error("Supabase error:", error);
            return new Response(JSON.stringify({ error: error.message }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const shouldNotify = realLead && !locked;

          if (realLead) {
            console.log(
              locked
                ? "Lead locked for over-limit user"
                : "Lead inserted within plan limit",
              {
                user_id: userId,
                plan,
                used_count: usedCount,
                limit: Number.isFinite(limit) ? limit : "unlimited",
                locked,
                shouldNotify,
              },
            );
          } else {
            console.log("Inserted non-real lead record without quota burn", {
              user_id: userId,
              locked: false,
              shouldNotify,
            });
          }

          return new Response(JSON.stringify({ success: true, lead_id: callId }), {
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
