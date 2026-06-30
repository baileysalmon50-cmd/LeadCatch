import { i as __toESM } from "../_runtime.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as supabase } from "./client-a0HX1RP9.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { I as useRouter, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Route$6 } from "./analytics-BqBBrcPC.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as objectType, r as stringType } from "../_libs/zod.mjs";
import { t as Route$7 } from "./auth-CyVGWgkH.mjs";
import { t as Route$8 } from "./checkout.return-BoZSDKbP.mjs";
import { t as Route$9 } from "./dashboard-ChtUCbWo.mjs";
import { t as Route$10 } from "./leads-k3OoQnK7.mjs";
import { t as Route$11 } from "./onboarding-DMuxylKF.mjs";
import { r as verifyWebhook } from "./stripe.server-CZmSH6zg.mjs";
import { t as Route$12 } from "./route-Dri6_4dd.mjs";
import { t as Route$13 } from "./settings-BSGImc0K.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-B9p9aHTr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DZTyTnGS.css";
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
var $$splitComponentImporter$1 = () => import("./pricing-CIEWcVoZ.mjs");
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
var Route$1 = createFileRoute("/api/public/webhook/lead")({ server: { handlers: { POST: async ({ request }) => {
	const expected = process.env.WEBHOOK_SECRET;
	const headerSecret = request.headers.get("x-webhook-secret");
	if (!expected || headerSecret !== expected) return new Response(JSON.stringify({ error: "Unauthorized" }), {
		status: 401,
		headers: { "Content-Type": "application/json" }
	});
	try {
		const body = await request.json();
		const userId = body.user_id || request.headers.get("x-user-id") || "default-user";
		const extracted = body.extracted_data || {};
		const notes = [
			`Call ID: ${body.call_id || "N/A"}`,
			"",
			"Transcript:",
			body.transcript || "N/A",
			"",
			`Recording: ${body.recording_url || "N/A"}`
		].join("\n");
		const leadData = {
			user_id: userId,
			name: extracted.customer_name || body.customer_name || "Unknown caller",
			phone: extracted.customer_phone || body.customer_phone || null,
			email: extracted.customer_email || body.customer_email || null,
			business_need: extracted.service_type || body.service_type || null,
			callback_time: extracted.preferred_callback_time || body.callback_time || null,
			notes,
			status: "new"
		};
		const { supabaseAdmin } = await import("./client.server-D1oHePJa.mjs");
		const { error } = await supabaseAdmin.from("leads").insert([leadData]);
		if (error) {
			console.error("Supabase error:", error);
			return new Response(JSON.stringify({ error: error.message }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
		}
		return new Response(JSON.stringify({
			success: true,
			lead_id: body.call_id
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
async function upsertSubscription(subscription, env, opts = {}) {
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
	await getSupabase().from("subscriptions").upsert({
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
		...opts.resetCallPeriod && { call_period_start: (/* @__PURE__ */ new Date()).toISOString() },
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}, { onConflict: "stripe_subscription_id" });
	return {
		userId,
		plan
	};
}
async function handleWebhook(req, env) {
	const event = await verifyWebhook(req, env);
	switch (event.type) {
		case "customer.subscription.created": {
			const res = await upsertSubscription(event.data.object, env, { resetCallPeriod: true });
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
			const userId = event.data.object.metadata?.userId;
			if (userId) await getSupabase().from("subscriptions").update({
				status: "canceled",
				plan: "free",
				cancel_at_period_end: false,
				updated_at: (/* @__PURE__ */ new Date()).toISOString(),
				call_period_start: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("user_id", userId).eq("environment", env);
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
var AuthRoute = Route$7.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$5
});
var AuthenticatedRouteRoute = Route$12.update({
	id: "/_authenticated",
	getParentRoute: () => Route$5
});
var IndexRoute = Route$2.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$5
});
var CheckoutReturnRoute = Route$8.update({
	id: "/checkout/return",
	path: "/checkout/return",
	getParentRoute: () => Route$5
});
var AuthenticatedSettingsRoute = Route$13.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedOnboardingRoute = Route$11.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedLeadsRoute = Route$10.update({
	id: "/leads",
	path: "/leads",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDashboardRoute = Route$9.update({
	id: "/dashboard",
	path: "/dashboard",
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
