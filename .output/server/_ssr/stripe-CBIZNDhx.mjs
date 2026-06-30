import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { t as loadStripe } from "../_libs/stripe__stripe-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stripe-CBIZNDhx.js
var stripe_exports = /* @__PURE__ */ __exportAll({
	getStripe: () => getStripe,
	getStripeEnvironment: () => getStripeEnvironment
});
var clientToken = void 0;
function paymentsEnvironment() {
	throw new Error("Stripe payments are not configured for this build. Complete Stripe go-live in your Lovable project to enable production checkout.");
}
var stripePromise = null;
function getStripe() {
	if (!stripePromise) {
		paymentsEnvironment();
		stripePromise = loadStripe(clientToken);
	}
	return stripePromise;
}
function getStripeEnvironment() {
	return paymentsEnvironment();
}
//#endregion
export { getStripeEnvironment as n, stripe_exports as r, getStripe as t };
