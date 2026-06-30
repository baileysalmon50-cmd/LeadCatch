import { t as Stripe } from "../_libs/stripe.mjs";
import { Buffer } from "node:buffer";
//#region node_modules/.nitro/vite/services/ssr/assets/stripe.server-CZmSH6zg.js
var getEnv = (key) => {
	const value = process.env[key];
	if (!value) throw new Error(`${key} is not configured`);
	return value;
};
var GATEWAY_STRIPE_BASE = "https://connector-gateway.lovable.dev/stripe";
function getConnectionApiKey(env) {
	return env === "sandbox" ? getEnv("STRIPE_SANDBOX_API_KEY") : getEnv("STRIPE_LIVE_API_KEY");
}
function createStripeClient(env) {
	const connectionApiKey = getConnectionApiKey(env);
	const lovableApiKey = getEnv("LOVABLE_API_KEY");
	return new Stripe(connectionApiKey, {
		apiVersion: "2026-03-25.dahlia",
		httpClient: Stripe.createFetchHttpClient((input, init) => {
			const gatewayUrl = (input instanceof Request ? input.url : input.toString()).replace("https://api.stripe.com", GATEWAY_STRIPE_BASE);
			return fetch(gatewayUrl, {
				...init,
				headers: {
					...Object.fromEntries(new Headers(init?.headers ?? (input instanceof Request ? input.headers : void 0)).entries()),
					"X-Connection-Api-Key": connectionApiKey,
					"Lovable-API-Key": lovableApiKey
				}
			});
		})
	});
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
	if (!signature || !body) throw new Error("Missing signature or body");
	let timestamp;
	const v1Signatures = [];
	for (const part of signature.split(",")) {
		const [key, value] = part.split("=", 2);
		if (key === "t") timestamp = value;
		if (key === "v1") v1Signatures.push(value);
	}
	if (!timestamp || v1Signatures.length === 0) throw new Error("Invalid signature format");
	if (Math.abs(Date.now() / 1e3 - Number(timestamp)) > 300) throw new Error("Webhook timestamp too old");
	const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), {
		name: "HMAC",
		hash: "SHA-256"
	}, false, ["sign"]);
	const signed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${body}`));
	const expected = Buffer.from(new Uint8Array(signed)).toString("hex");
	if (!v1Signatures.includes(expected)) throw new Error("Invalid webhook signature");
	return JSON.parse(body);
}
//#endregion
export { getStripeErrorMessage as n, verifyWebhook as r, createStripeClient as t };
