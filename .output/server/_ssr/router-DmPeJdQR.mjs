import { i as __toESM } from "../_runtime.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as supabase } from "./client-a0HX1RP9.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { I as useRouter, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Route$6 } from "./analytics-BqBBrcPC.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$7 } from "./appointments-CfC64IDS.mjs";
import { t as Route$8 } from "./auth-CyVGWgkH.mjs";
import { t as Route$9 } from "./checkout.return-Bp3a7qiW.mjs";
import { t as Route$10 } from "./dashboard-s-_9Ou71.mjs";
import { t as Route$11 } from "./leads-CQLRfgoe.mjs";
import { t as Route$12 } from "./onboarding-CPSwg1Va.mjs";
import { r as verifyWebhook } from "./stripe.server-D6VjEd18.mjs";
import { t as Route$13 } from "./route-vByyeg4n.mjs";
import { t as Route$14 } from "./settings-Bvq3GsrS.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DmPeJdQR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BkUBqPNS.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
					children: "Go home"
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$5 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "LeadCatch — Never miss another lead" },
			{
				name: "description",
				content: "AI answers your missed calls and captures every lead so your small business never loses business again."
			},
			{
				property: "og:title",
				content: "LeadCatch — Never miss another lead"
			},
			{
				property: "og:description",
				content: "AI answers missed calls and captures every lead for your small business."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
			}
		]
	}),
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootDocument({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$5.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => sub.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RootDocument, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			position: "top-right",
			richColors: true
		})]
	}) });
}
var $$splitComponentImporter$2 = () => import("./reset-password-Dfc1DnQg.mjs");
var Route$4 = createFileRoute("/reset-password")({
	head: () => ({ meta: [{ title: "Reset password — LeadCatch" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./pricing-ULLzZF5E.mjs");
var Route$3 = createFileRoute("/pricing")({
	head: () => ({ meta: [{ title: "Pricing — LeadCatch" }, {
		name: "description",
		content: "Simple, transparent pricing for missed-call lead capture. Start free, upgrade when you grow."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./routes-DHzsfvfF.mjs");
var Route$2 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "LeadCatch — Never miss another lead" }, {
		name: "description",
		content: "When customers call and you can't pick up, our AI answers, captures their info, and drops the lead in your dashboard."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var UUID_V4_OR_V5_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
var hasLoggedAnalysisStructure = false;
function getPlanLimit(plan) {
	if (plan === "free") return 10;
	if (plan === "pro") return 100;
	return Number.POSITIVE_INFINITY;
}
function isRealLead(name, businessNeed) {
	return name !== "Unknown caller" || !!businessNeed;
}
var Route$1 = createFileRoute("/api/public/webhook/lead")({ server: { handlers: { POST: async ({ request }) => {
	const url = new URL(request.url);
	const userId = url.searchParams.get("user_id");
	const secret = url.searchParams.get("secret");
	const expected = process.env.WEBHOOK_SECRET;
	if (!expected || secret !== expected) return new Response(JSON.stringify({ error: "Unauthorized" }), {
		status: 401,
		headers: { "Content-Type": "application/json" }
	});
	if (!userId || !UUID_V4_OR_V5_REGEX.test(userId)) return new Response(JSON.stringify({ error: "Invalid user_id" }), {
		status: 400,
		headers: { "Content-Type": "application/json" }
	});
	try {
		const body = await request.json();
		if (body.event !== "call_analyzed") return new Response(JSON.stringify({
			success: true,
			ignored: true
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
		const call = body.call;
		if (!call) return new Response(JSON.stringify({ error: "Missing call object" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const callId = call?.call_id;
		if (!callId) return new Response(JSON.stringify({ error: "Missing call_id" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
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
		const notes = [
			`Call ID: ${callId}`,
			vehicle ? `Vehicle: ${vehicle}` : null,
			urgency ? `Urgency: ${urgency}` : null,
			businessNeed ? `Service Needed: ${businessNeed}` : null,
			callSummary ? `Call Summary: ${callSummary}` : null,
			call.transcript ? `Transcript:\n${call.transcript}` : null,
			call.recording_url ? `Recording URL: ${call.recording_url}` : null
		].filter(Boolean).join("\n\n");
		const { supabaseAdmin } = await import("./client.server-D1oHePJa.mjs");
		const { data: existingLead, error: selectError } = await supabaseAdmin.from("leads").select("id").eq("call_id", callId).limit(1).maybeSingle();
		if (selectError) {
			console.error("Supabase lookup error:", selectError);
			return new Response(JSON.stringify({ error: selectError.message }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
		}
		if (existingLead) return new Response(JSON.stringify({
			success: true,
			duplicate: true
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
		let locked = false;
		let plan = "free";
		let usedCount = 0;
		let limit = Number.POSITIVE_INFINITY;
		if (realLead) {
			const { data: subscription, error: subscriptionError } = await supabaseAdmin.from("subscriptions").select("plan").eq("user_id", userId).maybeSingle();
			if (subscriptionError) {
				console.error("Supabase subscription lookup error:", subscriptionError);
				return new Response(JSON.stringify({ error: subscriptionError.message }), {
					status: 400,
					headers: { "Content-Type": "application/json" }
				});
			}
			plan = subscription?.plan || "free";
			const now = /* @__PURE__ */ new Date();
			const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
			const { data: countedLeads, error: countError } = await supabaseAdmin.from("leads").select("name, business_need").eq("user_id", userId).eq("locked", false).gte("created_at", periodStart.toISOString());
			if (countError) {
				console.error("Supabase lead count error:", countError);
				return new Response(JSON.stringify({ error: countError.message }), {
					status: 400,
					headers: { "Content-Type": "application/json" }
				});
			}
			usedCount = (countedLeads || []).filter((lead) => isRealLead(lead.name || "Unknown caller", lead.business_need || null)).length;
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
			status: "new"
		};
		const { error } = await supabaseAdmin.from("leads").insert([leadData]);
		if (error) {
			if (error.code === "23505") return new Response(JSON.stringify({
				success: true,
				duplicate: true
			}), {
				status: 200,
				headers: { "Content-Type": "application/json" }
			});
			console.error("Supabase error:", error);
			return new Response(JSON.stringify({ error: error.message }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
		}
		const shouldNotify = realLead && !locked;
		if (realLead) console.log(locked ? "Lead locked for over-limit user" : "Lead inserted within plan limit", {
			user_id: userId,
			plan,
			used_count: usedCount,
			limit: Number.isFinite(limit) ? limit : "unlimited",
			locked,
			shouldNotify
		});
		else console.log("Inserted non-real lead record without quota burn", {
			user_id: userId,
			locked: false,
			shouldNotify
		});
		return new Response(JSON.stringify({
			success: true,
			lead_id: callId
		}), { headers: { "Content-Type": "application/json" } });
	} catch (error) {
		console.error("Webhook error:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var _supabase = null;
function getSupabase() {
	if (!_supabase) _supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
	return _supabase;
}
function priceIdToPlan(priceId) {
	if (!priceId) return "free";
	if (priceId.startsWith("business")) return "business";
	if (priceId.startsWith("pro")) return "pro";
	return "free";
}
function resolvePriceId(price) {
	return price?.lookup_key || price?.metadata?.lovable_external_id || price?.id;
}
async function sendEmail(kind, userId, plan) {
	console.log(`[email] ${kind} → user=${userId} plan=${plan}`);
}
async function upsertSubscription(subscription, env) {
	const userId = subscription.metadata?.userId;
	if (!userId) {
		console.error("Skipping subscription upsert: missing metadata.userId", { subscriptionId: subscription.id });
		return;
	}
	const item = subscription.items?.data?.[0];
	const priceId = resolvePriceId(item?.price);
	const productId = typeof item?.price?.product === "string" ? item.price.product : item?.price?.product?.id;
	const periodStart = item?.current_period_start ?? subscription.current_period_start;
	const periodEnd = item?.current_period_end ?? subscription.current_period_end;
	const plan = priceIdToPlan(priceId);
	const { error } = await getSupabase().from("subscriptions").upsert({
		user_id: userId,
		stripe_subscription_id: subscription.id,
		stripe_customer_id: subscription.customer,
		product_id: productId,
		price_id: priceId,
		status: subscription.status,
		plan,
		current_period_start: periodStart ? (/* @__PURE__ */ new Date(periodStart * 1e3)).toISOString() : null,
		current_period_end: periodEnd ? (/* @__PURE__ */ new Date(periodEnd * 1e3)).toISOString() : null,
		billing_date: periodEnd ? (/* @__PURE__ */ new Date(periodEnd * 1e3)).toISOString() : null,
		cancel_at_period_end: subscription.cancel_at_period_end ?? false,
		environment: env,
		call_period_start: periodStart ? (/* @__PURE__ */ new Date(periodStart * 1e3)).toISOString() : null,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}, { onConflict: "user_id" });
	if (error) {
		console.error("Subscription upsert failed", {
			userId,
			subscriptionId: subscription.id,
			error
		});
		throw new Error("Subscription upsert failed: " + error.message);
	}
	return {
		userId,
		plan
	};
}
async function handleWebhook(req, env) {
	const event = await verifyWebhook(req, env);
	switch (event.type) {
		case "customer.subscription.created": {
			const res = await upsertSubscription(event.data.object, env);
			if (res) await sendEmail("welcome", res.userId, res.plan);
			break;
		}
		case "customer.subscription.updated": {
			const sub = event.data.object;
			await upsertSubscription(sub, env);
			if (sub.cancel_at_period_end && sub.metadata?.userId) await sendEmail("winback", sub.metadata.userId, priceIdToPlan(resolvePriceId(sub.items?.data?.[0]?.price)));
			break;
		}
		case "customer.subscription.deleted": {
			const sub = event.data.object;
			const userId = sub.metadata?.userId;
			if (userId) {
				const { error } = await getSupabase().from("subscriptions").update({
					status: "canceled",
					plan: "free",
					cancel_at_period_end: false,
					updated_at: (/* @__PURE__ */ new Date()).toISOString(),
					call_period_start: (/* @__PURE__ */ new Date()).toISOString()
				}).eq("user_id", userId).eq("environment", env);
				if (error) {
					console.error("Subscription upsert failed", {
						userId,
						subscriptionId: sub.id,
						error
					});
					throw new Error("Subscription upsert failed: " + error.message);
				}
			}
			break;
		}
		case "invoice.paid": {
			const subscriptionId = event.data.object.subscription;
			if (subscriptionId) await getSupabase().from("subscriptions").update({
				call_period_start: (/* @__PURE__ */ new Date()).toISOString(),
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("stripe_subscription_id", subscriptionId).eq("environment", env);
			break;
		}
		default: console.log("Unhandled event:", event.type);
	}
}
var Route = createFileRoute("/api/public/payments/webhook")({ server: { handlers: { POST: async ({ request }) => {
	const rawEnv = new URL(request.url).searchParams.get("env");
	if (rawEnv !== "sandbox" && rawEnv !== "live") {
		console.error("Webhook received with invalid or missing env:", rawEnv);
		return Response.json({
			received: true,
			ignored: "invalid env"
		});
	}
	try {
		await handleWebhook(request, rawEnv);
		return Response.json({ received: true });
	} catch (e) {
		console.error("Webhook error:", e);
		if (e instanceof Error && e.message === "Invalid webhook signature") return new Response("Invalid webhook signature", { status: 400 });
		return new Response("Webhook error", { status: 400 });
	}
} } } });
var ResetPasswordRoute = Route$4.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$5
});
var PricingRoute = Route$3.update({
	id: "/pricing",
	path: "/pricing",
	getParentRoute: () => Route$5
});
var AuthRoute = Route$8.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$5
});
var AuthenticatedRouteRoute = Route$13.update({
	id: "/_authenticated",
	getParentRoute: () => Route$5
});
var IndexRoute = Route$2.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$5
});
var CheckoutReturnRoute = Route$9.update({
	id: "/checkout/return",
	path: "/checkout/return",
	getParentRoute: () => Route$5
});
var AuthenticatedSettingsRoute = Route$14.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedOnboardingRoute = Route$12.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedLeadsRoute = Route$11.update({
	id: "/leads",
	path: "/leads",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDashboardRoute = Route$10.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAppointmentsRoute = Route$7.update({
	id: "/appointments",
	path: "/appointments",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAnalyticsRoute = Route$6.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => AuthenticatedRouteRoute
});
var ApiPublicWebhookLeadRoute = Route$1.update({
	id: "/api/public/webhook/lead",
	path: "/api/public/webhook/lead",
	getParentRoute: () => Route$5
});
var ApiPublicPaymentsWebhookRoute = Route.update({
	id: "/api/public/payments/webhook",
	path: "/api/public/payments/webhook",
	getParentRoute: () => Route$5
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAnalyticsRoute,
	AuthenticatedAppointmentsRoute,
	AuthenticatedDashboardRoute,
	AuthenticatedLeadsRoute,
	AuthenticatedOnboardingRoute,
	AuthenticatedSettingsRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	PricingRoute,
	ResetPasswordRoute,
	CheckoutReturnRoute,
	ApiPublicPaymentsWebhookRoute,
	ApiPublicWebhookLeadRoute
};
var routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
