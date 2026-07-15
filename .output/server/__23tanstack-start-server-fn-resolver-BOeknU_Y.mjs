//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-BOeknU_Y.js
var manifest = {
	"0206bd4cdfe0c7c9eb947bf34cf597177e3457d80e7322cb83d53d97df557340": {
		functionName: "createPortalSession_createServerFn_handler",
		importer: () => import("./_ssr/payments.functions--NdCvrSy.mjs")
	},
	"6186b6303b8f63886db376ba9a679f2f179f7619f609db631a0d86c4045dec88": {
		functionName: "createCheckoutSession_createServerFn_handler",
		importer: () => import("./_ssr/payments.functions--NdCvrSy.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
