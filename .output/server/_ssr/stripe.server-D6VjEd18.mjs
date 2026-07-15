import { t as Stripe } from "../_libs/stripe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stripe.server-D6VjEd18.js
var getEnv = (key) => {
	const value = process.env[key];
	if (!value) throw new Error(`${key} is not configured`);
	return value;
};
function getConnectionApiKey(env) {
	return env === "sandbox" ? getEnv("STRIPE_SANDBOX_API_KEY") : getEnv("STRIPE_LIVE_API_KEY");
}
function createStripeClient(env) {
	return new Stripe(getConnectionApiKey(env), { apiVersion: "2026-03-25.dahlia" });
}
function getStripeErrorMessage(error) {
	if (error && typeof error === "object") {
		const e = error;
		const msg = e.raw?.message ?? e.message;
		if (msg) return msg;
	}
	return "Stripe request failed";
}
async function verifyWebhook(req, env) {
	const signature = req.headers.get("stripe-signature");
	const body = await req.text();
	const secret = env === "sandbox" ? getEnv("PAYMENTS_SANDBOX_WEBHOOK_SECRET") : getEnv("PAYMENTS_LIVE_WEBHOOK_SECRET");
	if (!signature || !body) throw new Error("Invalid webhook signature");
	try {
		return createStripeClient(env).webhooks.constructEvent(body, signature, secret);
	} catch {
		throw new Error("Invalid webhook signature");
	}
}
//#endregion
export { getStripeErrorMessage as n, verifyWebhook as r, createStripeClient as t };
