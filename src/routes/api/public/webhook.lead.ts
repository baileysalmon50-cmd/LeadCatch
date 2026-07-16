import { createFileRoute } from "@tanstack/react-router";
import { normalizeDialedNumber } from "@/lib/phone";

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

type LeadNotificationContext = {
  userId: string;
  locked: boolean;
  name: string;
  phone: string | null;
  businessNeed: string | null;
  profileEmail: string | null;
  smsEnabled: boolean;
  smsPhone: string | null;
  emailEnabled: boolean;
  appBaseUrl: string;
};

async function sendLeadNotifications(context: LeadNotificationContext) {
  const leadsUrl = `${context.appBaseUrl}/leads`;
  const pricingUrl = `${context.appBaseUrl}/pricing`;
  const detailedMessage = `New lead: ${context.name}${context.phone ? ` (${context.phone})` : ""}${context.businessNeed ? ` — ${context.businessNeed}` : ""}. View: ${leadsUrl}`;
  const lockedMessage = `A new lead just called — you've reached your free plan limit. Upgrade to see their details: ${pricingUrl}`;
  const message = context.locked ? lockedMessage : detailedMessage;

  if (context.emailEnabled && context.profileEmail) {
    // TODO: wire to real provider (Resend/Postmark). For now, log the payload.
    console.log("[lead-notification][email]", {
      user_id: context.userId,
      to: context.profileEmail,
      locked: context.locked,
      message,
    });
  }

  if (context.smsEnabled && context.smsPhone) {
    // TODO: wire to real SMS provider (Twilio). For now, log the payload.
    console.log("[lead-notification][sms]", {
      user_id: context.userId,
      to: context.smsPhone,
      locked: context.locked,
      message,
    });
  }
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

          const normalizedToNumber = normalizeDialedNumber(call.to_number);
          let resolvedUserId = userId;
          if (normalizedToNumber) {
            const { data: profileMatches, error: profileLookupError } = await supabaseAdmin
              .from("profiles")
              .select("id")
              .eq("retell_phone_id", normalizedToNumber)
              .limit(2);

            if (profileLookupError) {
              console.error("Supabase profile lookup error:", profileLookupError);
              return new Response(JSON.stringify({ error: profileLookupError.message }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
              });
            }

            if ((profileMatches || []).length === 1) {
              resolvedUserId = profileMatches![0].id;
            } else {
              console.error("[webhook.lead] Unmatched to_number; falling back to query user_id", {
                to_number: call.to_number,
                normalized_to_number: normalizedToNumber,
                matches: (profileMatches || []).length,
              });
            }
          }

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
          let periodStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

          if (realLead) {
            const { data: subscription, error: subscriptionError } = await supabaseAdmin
              .from("subscriptions")
              .select("plan, call_period_start")
              .eq("user_id", resolvedUserId)
              .maybeSingle();

            if (subscriptionError) {
              console.error("Supabase subscription lookup error:", subscriptionError);
              return new Response(JSON.stringify({ error: subscriptionError.message }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
              });
            }

            plan = (subscription?.plan as PlanTier | undefined) || "free";
            const callPeriodStart = subscription?.call_period_start;
            periodStart = callPeriodStart
              ? new Date(callPeriodStart)
              : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

            const { data: countedLeads, error: countError } = await supabaseAdmin
              .from("leads")
              .select("name, business_need")
              .eq("user_id", resolvedUserId)
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
            user_id: resolvedUserId,
            call_id: callId,
            name: customerName,
            phone: customerPhone,
            business_need: businessNeed,
            locked,
            notes,
            status: "new" as const,
          };

          console.log("Cap decision", { resolvedUserId, plan, periodStart: periodStart.toISOString(), usedCount, limit, locked });

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

          const shouldNotify = realLead;

          if (shouldNotify) {
            const [{ data: settings, error: settingsError }, { data: profile, error: profileError }] = await Promise.all([
              supabaseAdmin
                .from("settings")
                .select("notifications_email, notifications_sms, notifications_sms_phone")
                .eq("user_id", resolvedUserId)
                .maybeSingle(),
              supabaseAdmin
                .from("profiles")
                .select("email")
                .eq("id", resolvedUserId)
                .maybeSingle(),
            ]);

            if (settingsError || profileError) {
              console.error("Lead notification settings/profile lookup failed", {
                user_id: resolvedUserId,
                settingsError,
                profileError,
              });
            } else {
              const appBaseUrl = new URL(request.url).origin;
              await sendLeadNotifications({
                userId: resolvedUserId,
                locked,
                name: customerName,
                phone: customerPhone,
                businessNeed,
                profileEmail: profile?.email || null,
                smsEnabled: !!settings?.notifications_sms,
                smsPhone: settings?.notifications_sms_phone || null,
                emailEnabled: !!settings?.notifications_email,
                appBaseUrl,
              });
            }
          }

          if (realLead) {
            console.log(
              locked
                ? "Lead locked for over-limit user"
                : "Lead inserted within plan limit",
              {
                user_id: resolvedUserId,
                plan,
                used_count: usedCount,
                limit: Number.isFinite(limit) ? limit : "unlimited",
                locked,
                shouldNotify,
              },
            );
          } else {
            console.log("Inserted non-real lead record without quota burn", {
              user_id: resolvedUserId,
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
