import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { p as PhoneIncoming } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/logo-2UeFUhWv.js
var import_jsx_runtime = require_jsx_runtime();
function Logo({ size = "md" }) {
	const dim = size === "sm" ? "h-7 w-7" : size === "lg" ? "h-10 w-10" : "h-8 w-8";
	const text = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `${dim} brand-gradient rounded-lg flex items-center justify-center shadow-soft`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneIncoming, {
				className: "h-4 w-4 text-brand-foreground",
				strokeWidth: 2.5
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `${text} font-semibold tracking-tight`,
			children: "LeadCatch"
		})]
	});
}
//#endregion
export { Logo as t };
