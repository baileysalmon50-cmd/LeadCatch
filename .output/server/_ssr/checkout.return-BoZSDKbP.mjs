import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout.return-BoZSDKbP.js
var $$splitComponentImporter = () => import("./checkout.return-C6c0HcXX.mjs");
var Route = createFileRoute("/checkout/return")({
	head: () => ({ meta: [{ title: "Payment complete — LeadCatch" }] }),
	validateSearch: (search) => ({ session_id: typeof search.session_id === "string" ? search.session_id : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
