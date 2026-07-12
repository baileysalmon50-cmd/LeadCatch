import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-a0HX1RP9.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as Plus } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./dialog-DYBpJUt2.mjs";
import { n as Label, t as Input } from "./label-D2fwATjQ.mjs";
import { t as Textarea } from "./textarea-Dfe41XSO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/add-lead-dialog-CgdMOrhc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AddLeadDialog({ userId, disabled, disabledLabel }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		phone: "",
		email: "",
		business_need: "",
		callback_time: ""
	});
	async function submit() {
		setLoading(true);
		const { error } = await supabase.from("leads").insert({
			user_id: userId,
			name: form.name || "Unknown caller",
			phone: form.phone || null,
			email: form.email || null,
			business_need: form.business_need || null,
			callback_time: form.callback_time || null
		});
		setLoading(false);
		if (error) return toast.error(error.message);
		toast.success("Lead captured!", { description: "It just appeared in your dashboard." });
		setOpen(false);
		setForm({
			name: "",
			phone: "",
			email: "",
			business_need: "",
			callback_time: ""
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				disabled,
				className: "brand-gradient text-brand-foreground hover:opacity-90",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }),
					" ",
					disabled ? disabledLabel || "Call Limit Reached" : "Simulate lead"
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add a test lead" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "This simulates a lead arriving from a missed call. Real calls land here via webhook." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.name,
						onChange: (e) => setForm({
							...form,
							name: e.target.value
						}),
						placeholder: "Jane Smith"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.phone,
							onChange: (e) => setForm({
								...form,
								phone: e.target.value
							}),
							placeholder: "+1 555 123 4567"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.email,
							onChange: (e) => setForm({
								...form,
								email: e.target.value
							}),
							placeholder: "jane@example.com"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Business need" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: form.business_need,
						onChange: (e) => setForm({
							...form,
							business_need: e.target.value
						}),
						placeholder: "Looking for a quote on a kitchen remodel..."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Best callback time" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.callback_time,
						onChange: (e) => setForm({
							...form,
							callback_time: e.target.value
						}),
						placeholder: "Tomorrow afternoon"
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				onClick: () => setOpen(false),
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: submit,
				disabled: loading,
				className: "brand-gradient text-brand-foreground",
				children: loading ? "Saving..." : "Capture lead"
			})] })
		] })]
	});
}
//#endregion
export { AddLeadDialog as t };
