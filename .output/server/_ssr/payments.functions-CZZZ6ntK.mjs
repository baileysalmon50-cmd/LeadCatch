import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dpn8S0gM.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-BOeknU_Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payments.functions-CZZZ6ntK.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var payments_functions_exports = /* @__PURE__ */ __exportAll({
	createCheckoutSession: () => createCheckoutSession,
	createPortalSession: () => createPortalSession
});
var createCheckoutSession = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => {
	if (!/^[a-zA-Z0-9_-]+$/.test(data.priceId)) throw new Error("Invalid priceId");
	return data;
}).handler(createSsrRpc("6186b6303b8f63886db376ba9a679f2f179f7619f609db631a0d86c4045dec88"));
var createPortalSession = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(createSsrRpc("0206bd4cdfe0c7c9eb947bf34cf597177e3457d80e7322cb83d53d97df557340"));
//#endregion
export { payments_functions_exports as n, createCheckoutSession as t };
