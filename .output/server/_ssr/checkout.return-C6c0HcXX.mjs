import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { t as Card } from "./card-Bav9nr75.mjs";
import { A as CircleCheck } from "../_libs/lucide-react.mjs";
import { t as Route } from "./checkout.return-BoZSDKbP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout.return-C6c0HcXX.js
var import_jsx_runtime = require_jsx_runtime();
function CheckoutReturn() {
	const { session_id } = Route.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "max-w-md w-full p-8 text-center space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-12 w-12 text-brand mx-auto" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold",
					children: "Payment complete"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: session_id ? "Your subscription is active. We've updated your plan — head to your dashboard to continue." : "If you completed checkout, your plan will update within a minute."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/dashboard",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "brand-gradient text-brand-foreground w-full",
						children: "Go to dashboard"
					})
				})
			]
		})
	});
}
//#endregion
export { CheckoutReturn as component };
