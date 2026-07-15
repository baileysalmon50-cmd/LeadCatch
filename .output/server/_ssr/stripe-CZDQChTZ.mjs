import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { t as loadStripe } from "../_libs/stripe__stripe-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stripe-CZDQChTZ.js
var stripe_exports = /* @__PURE__ */ __exportAll({
	getStripe: () => getStripe,
	getStripeEnvironment: () => getStripeEnvironment
});
var clientToken = "pk_test_51TjjUUAuq8vUQEP1Wh9BfLhImBvNvw3Nqgyzo7Rk63N4ap1Htuq6SooPyQfi3iEJze216dkb30Zcb1Wf52En4hBA00nxL62t2Q";
function paymentsEnvironment() {
	if (clientToken.startsWith("pk_test_")) return "sandbox";
	if (clientToken.startsWith("pk_live_")) return "live";
	throw new Error("Stripe publishable key missing: set VITE_PAYMENTS_CLIENT_TOKEN at build time.");
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
