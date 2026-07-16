import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-a0HX1RP9.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { t as Card } from "./card-Bav9nr75.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Clock, O as ChevronDown, P as ArrowRight, b as ExternalLink, c as Smartphone, f as Phone, h as MessageSquare, k as Check, v as Info } from "../_libs/lucide-react.mjs";
import { n as Label, t as Input } from "./label-D2fwATjQ.mjs";
import { t as Textarea } from "./textarea-Dfe41XSO.mjs";
import { t as Logo } from "./logo-2UeFUhWv.mjs";
import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as Route } from "./onboarding-Bbjwm2mK.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DvCYJcpz.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dpn8S0gM.mjs";
import { n as CollapsibleTrigger$1, r as Root, t as CollapsibleContent$1 } from "../_libs/radix-ui__react-collapsible.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-DJXTCTfc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Collapsible = Root;
var CollapsibleTrigger = CollapsibleTrigger$1;
var CollapsibleContent = CollapsibleContent$1;
var provisionPhoneNumber = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => {
	if (!/^\d{3}$/.test(data.areaCode)) throw new Error("Area code must be exactly 3 digits");
	return data;
}).handler(createSsrRpc("328cf899c02c22aaf215cecc118f83d0d6d31ff8882d1b4ffec8aba633cc01c2"));
function Onboarding() {
	const { user } = Route.useRouteContext();
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)(1);
	const [forwardPhone, setForwardPhone] = (0, import_react.useState)("");
	const [assignedPhone, setAssignedPhone] = (0, import_react.useState)(null);
	const [areaCode, setAreaCode] = (0, import_react.useState)("");
	const [provisioning, setProvisioning] = (0, import_react.useState)(false);
	const [greeting, setGreeting] = (0, import_react.useState)("");
	const [start, setStart] = (0, import_react.useState)("09:00");
	const [end, setEnd] = (0, import_react.useState)("18:00");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [guidesOpen, setGuidesOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		(async () => {
			const [{ data: p }, { data: s }] = await Promise.all([supabase.from("profiles").select("forward_phone, assigned_phone").eq("id", user.id).maybeSingle(), supabase.from("settings").select("ai_greeting, callback_hours_start, callback_hours_end").eq("user_id", user.id).maybeSingle()]);
			if (p) {
				setForwardPhone(p.forward_phone || "");
				setAssignedPhone(p.assigned_phone || null);
				const digits = (p.forward_phone || "").replace(/\D/g, "");
				const normalized = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
				if (normalized.length >= 3) setAreaCode(normalized.slice(0, 3));
			}
			if (s) {
				setGreeting(s.ai_greeting);
				setStart(s.callback_hours_start);
				setEnd(s.callback_hours_end);
			}
		})();
	}, [user.id]);
	async function finish() {
		setSaving(true);
		await supabase.from("profiles").update({
			forward_phone: forwardPhone || null,
			onboarded: true
		}).eq("id", user.id);
		await supabase.from("settings").update({
			ai_greeting: greeting,
			callback_hours_start: start,
			callback_hours_end: end
		}).eq("user_id", user.id);
		setSaving(false);
		toast.success("You're all set! Welcome to LeadCatch.");
		navigate({ to: "/dashboard" });
	}
	async function handleProvisionNumber() {
		if (!/^\d{3}$/.test(areaCode)) {
			toast.error("Enter a valid 3-digit area code");
			return;
		}
		setProvisioning(true);
		try {
			const result = await provisionPhoneNumber({ data: { areaCode } });
			setAssignedPhone(result.phone);
			toast.success(result.alreadyProvisioned ? `You already have a number: ${result.phone}` : `Your LeadCatch number is ready: ${result.phone}`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not provision a number");
		} finally {
			setProvisioning(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen hero-bg flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 flex items-center justify-center px-4 pb-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "w-full max-w-xl p-8 shadow-lift",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2 mb-6",
						children: [
							1,
							2,
							3
						].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold ${n <= step ? "brand-gradient text-brand-foreground" : "bg-muted text-muted-foreground"}`,
								children: n < step ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }) : n
							}), n < 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `flex-1 h-0.5 ${n < step ? "bg-brand" : "bg-muted"}` })]
						}, n))
					}),
					step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4" }), " Step 1 of 3"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-bold",
								children: "Connect Your Business Number"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "We'll capture missed calls on this number. When you don't answer, your phone system will forward to our AI."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "biz-phone",
									children: "What's your main business phone number?"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "biz-phone",
									value: forwardPhone,
									onChange: (e) => setForwardPhone(e.target.value),
									placeholder: "e.g. 555-123-4567"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border bg-muted/40 p-5 space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground uppercase tracking-wide font-medium",
										children: "Your LeadCatch AI Number"
									}),
									assignedPhone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-2xl font-semibold font-mono",
										children: assignedPhone
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: "Your LeadCatch number will be assigned during setup"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col sm:flex-row gap-2 sm:items-end",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "area-code",
													children: "Preferred area code"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "area-code",
													inputMode: "numeric",
													pattern: "[0-9]*",
													maxLength: 3,
													value: areaCode,
													onChange: (e) => setAreaCode(e.target.value.replace(/\D/g, "").slice(0, 3)),
													placeholder: "754",
													className: "w-28"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												variant: "outline",
												onClick: handleProvisionNumber,
												disabled: provisioning,
												children: provisioning ? "Getting number..." : "Get my number"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Forward missed calls from your business number to this LeadCatch number. Our AI will answer and collect lead info."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-brand/20 bg-brand/10 p-4 flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-5 w-5 text-brand shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-brand-foreground",
									children: "No need to change your number"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground mt-0.5",
									children: "Just set up call forwarding on your existing phone system. Most business phones and carriers support this in their settings."
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Collapsible, {
								open: guidesOpen,
								onOpenChange: setGuidesOpen,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapsibleTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "flex items-center gap-2 text-sm font-medium text-brand hover:text-brand/80 transition-colors",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-4 w-4" }),
											"How to set up call forwarding",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 transition-transform ${guidesOpen ? "rotate-180" : ""}` })
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapsibleContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 space-y-3 rounded-xl border bg-muted/30 p-4",
									children: [
										{
											icon: Smartphone,
											title: "iPhone",
											steps: "Settings → Phone → Call Forwarding → Turn on → Enter your LeadCatch number above."
										},
										{
											icon: Smartphone,
											title: "Android",
											steps: "Phone app → ⋮ Menu → Settings → Calls → Call Forwarding → Enter your LeadCatch number above."
										},
										{
											icon: Phone,
											title: "Vonage Business",
											steps: "Admin Portal → Features → Call Forwarding → Add your LeadCatch number → Save."
										},
										{
											icon: Phone,
											title: "Other carrier / landline",
											steps: "Dial *72 (or *21 in some regions), then your LeadCatch number. Or contact your carrier's support to enable call forwarding."
										}
									].map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(g.icon, { className: "h-4 w-4 text-muted-foreground shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium",
											children: g.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: g.steps
										})] })]
									}, g.title))
								}) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "w-full brand-gradient text-brand-foreground",
								onClick: () => setStep(2),
								children: ["Continue ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
							})
						]
					}),
					step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4" }), " Step 2 of 3"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-2xl font-bold",
							children: "Customize your AI greeting"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "This is what your callers hear when the AI picks up."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							className: "mt-4 min-h-32",
							value: greeting,
							onChange: (e) => setGreeting(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setStep(1),
								children: "Back"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "flex-1 brand-gradient text-brand-foreground",
								onClick: () => setStep(3),
								children: ["Continue ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
							})]
						})
					] }),
					step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }), " Step 3 of 3"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-2xl font-bold",
							children: "Callback preferences"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "When are you typically available to call leads back?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Start time" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "time",
								value: start,
								onChange: (e) => setStart(e.target.value)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "End time" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "time",
								value: end,
								onChange: (e) => setEnd(e.target.value)
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setStep(2),
								children: "Back"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								disabled: saving,
								className: "flex-1 brand-gradient text-brand-foreground",
								onClick: finish,
								children: saving ? "Saving..." : "Go to dashboard"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: finish,
							className: "mt-3 text-xs text-muted-foreground hover:text-foreground w-full text-center",
							children: "Skip for now"
						})
					] })
				]
			})
		})]
	});
}
//#endregion
export { Onboarding as component };
