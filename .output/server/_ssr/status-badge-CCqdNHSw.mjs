import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn } from "./button-CCQEfgNs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-badge-CCqdNHSw.js
var import_jsx_runtime = require_jsx_runtime();
var map = {
	new: {
		label: "New",
		dot: "bg-destructive pulse-dot",
		bg: "bg-destructive/10",
		text: "text-destructive"
	},
	called: {
		label: "Called",
		dot: "bg-warning",
		bg: "bg-warning/15",
		text: "text-warning-foreground"
	},
	converted: {
		label: "Converted",
		dot: "bg-success",
		bg: "bg-success/15",
		text: "text-success-foreground"
	},
	sold: {
		label: "Sold",
		dot: "bg-blue-600",
		bg: "bg-blue-100",
		text: "text-blue-700"
	},
	confirmed: {
		label: "Confirmed",
		dot: "bg-sky-600",
		bg: "bg-sky-100",
		text: "text-sky-700"
	},
	checked_in: {
		label: "Checked In",
		dot: "bg-indigo-600",
		bg: "bg-indigo-100",
		text: "text-indigo-700"
	},
	in_service: {
		label: "In Service",
		dot: "bg-violet-600",
		bg: "bg-violet-100",
		text: "text-violet-700"
	},
	completed: {
		label: "Completed",
		dot: "bg-success",
		bg: "bg-success/15",
		text: "text-success-foreground"
	},
	cancelled: {
		label: "Cancelled",
		dot: "bg-muted-foreground",
		bg: "bg-muted",
		text: "text-muted-foreground"
	},
	no_show: {
		label: "No Show",
		dot: "bg-amber-600",
		bg: "bg-amber-100",
		text: "text-amber-700"
	}
};
function StatusBadge({ status, className }) {
	const s = map[status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", s.bg, s.text, className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-1.5 w-1.5 rounded-full", s.dot) }), s.label]
	});
}
//#endregion
export { StatusBadge as t };
