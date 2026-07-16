import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dpn8S0gM.mjs";
import { n as getStripeErrorMessage, t as createStripeClient } from "./stripe.server-D6VjEd18.mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payments.functions-zCN1MCS2.js
async function resolveOrCreateCustomer(stripe, options) {
	if (options.userId && !/^[a-zA-Z0-9_-]+$/.test(options.userId)) throw new Error("Invalid userId");
	if (options.userId) {
		const found = await stripe.customers.search({
			query: `metadata['userId']:'${options.userId}'`,
			limit: 1
		});
		if (found.data.length) return found.data[0].id;
	}
	if (options.email) {
		const existing = await stripe.customers.list({
			email: options.email,
			limit: 1
		});
		if (existing.data.length) {
			const customer = existing.data[0];
			if (options.userId && customer.metadata?.userId !== options.userId) await stripe.customers.update(customer.id, { metadata: {
				...customer.metadata,
				userId: options.userId
			} });
			return customer.id;
		}
	}
	return (await stripe.customers.create({
		...options.email && { email: options.email },
		...options.userId && { metadata: { userId: options.userId } }
	})).id;
}
var createCheckoutSession_createServerFn_handler = createServerRpc({
	id: "6186b6303b8f63886db376ba9a679f2f179f7619f609db631a0d86c4045dec88",
	name: "createCheckoutSession",
	filename: "src/utils/payments.functions.ts"
}, (opts) => createCheckoutSession.__executeServer(opts));
var createCheckoutSession = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => {
	if (!/^[a-zA-Z0-9_-]+$/.test(data.priceId)) throw new Error("Invalid priceId");
	return data;
}).handler(createCheckoutSession_createServerFn_handler, async ({ data, context }) => {
	try {
		const { userId, supabase } = context;
		const { data: { user } } = await supabase.auth.getUser();
		const email = user?.email ?? void 0;
		const stripe = createStripeClient(data.environment);
		const prices = await stripe.prices.list({ lookup_keys: [data.priceId] });
		if (!prices.data.length) throw new Error("Price not found");
		const stripePrice = prices.data[0];
		const customerId = await resolveOrCreateCustomer(stripe, {
			email,
			userId
		});
		return { clientSecret: (await stripe.checkout.sessions.create({
			line_items: [{
				price: stripePrice.id,
				quantity: 1
			}],
			mode: "subscription",
			ui_mode: "embedded_page",
			return_url: data.returnUrl,
			customer: customerId,
			metadata: { userId },
			subscription_data: { metadata: { userId } },
			managed_payments: { enabled: true }
		})).client_secret ?? "" };
	} catch (error) {
		return { error: getStripeErrorMessage(error) };
	}
});
var createPortalSession_createServerFn_handler = createServerRpc({
	id: "0206bd4cdfe0c7c9eb947bf34cf597177e3457d80e7322cb83d53d97df557340",
	name: "createPortalSession",
	filename: "src/utils/payments.functions.ts"
}, (opts) => createPortalSession.__executeServer(opts));
var createPortalSession = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(createPortalSession_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: sub } = await supabase.from("subscriptions").select("stripe_customer_id").eq("user_id", userId).eq("environment", data.environment).not("stripe_customer_id", "is", null).order("created_at", { ascending: false }).limit(1).maybeSingle();
	if (!sub?.stripe_customer_id) return { error: "No active subscription found" };
	try {
		return { url: (await createStripeClient(data.environment).billingPortal.sessions.create({
			customer: sub.stripe_customer_id,
			...data.returnUrl && { return_url: data.returnUrl }
		})).url };
	} catch (error) {
		return { error: getStripeErrorMessage(error) };
	}
});
//#endregion
export { createCheckoutSession_createServerFn_handler, createPortalSession_createServerFn_handler };
