import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-a0HX1RP9.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-CCQEfgNs.mjs";
import { t as Card } from "./card-Bav9nr75.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Bell, d as Phone, i as User, k as Sparkles, x as CreditCard } from "../_libs/lucide-react.mjs";
import { n as Label, t as Input } from "./label-D2fwATjQ.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DYjyjhZD.mjs";
import { t as Textarea } from "./textarea-Dfe41XSO.mjs";
import { t as Route } from "./settings-BYhoHAqS.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-Ck8Oc0bl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
var RETELL_PHONE_NUMBER = "1(754)341-1322";
var TIMEZONES = [
	"America/New_York",
	"America/Chicago",
	"America/Denver",
	"America/Los_Angeles",
	"Europe/London",
	"Europe/Paris",
	"Asia/Tokyo",
	"Australia/Sydney"
];
function SettingsPage() {
	const { user } = Route.useRouteContext();
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [settings, setSettings] = (0, import_react.useState)(null);
	const [sub, setSub] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		(async () => {
			const [{ data: p }, { data: s }, { data: su }] = await Promise.all([
				supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
				supabase.from("settings").select("*").eq("user_id", user.id).maybeSingle(),
				supabase.from("subscriptions").select("plan, billing_date").eq("user_id", user.id).maybeSingle()
			]);
			setProfile(p);
			setSettings(s);
			setSub(su);
		})();
	}, [user.id]);
	async function saveProfile() {
		if (!profile) return;
		setSaving(true);
		const { error } = await supabase.from("profiles").update({
			business_name: profile.business_name,
			forward_phone: profile.forward_phone,
			timezone: profile.timezone
		}).eq("id", user.id);
		setSaving(false);
		if (error) toast.error(error.message);
		else toast.success("Profile saved");
	}
	async function saveSettings() {
		if (!settings) return;
		setSaving(true);
		const { error } = await supabase.from("settings").update(settings).eq("user_id", user.id);
		setSaving(false);
		if (error) toast.error(error.message);
		else toast.success("Settings saved");
	}
	async function changePassword(pw) {
		const { error } = await supabase.auth.updateUser({ password: pw });
		if (error) toast.error(error.message);
		else toast.success("Password updated");
	}
	if (!profile || !settings || !sub) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-sm text-muted-foreground",
		children: "Loading..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8 space-y-6 max-w-4xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: "Settings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Manage your phone, notifications, and account."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6 shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4 text-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "Phone settings"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-muted/40 border p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Your LeadCatch AI number"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xl font-semibold font-mono mt-1",
								children: RETELL_PHONE_NUMBER
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Your business phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: profile.forward_phone || "",
							onChange: (e) => setProfile({
								...profile,
								forward_phone: e.target.value
							}),
							placeholder: "+1 555 000 1234"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "AI greeting" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							className: "min-h-28",
							value: settings.ai_greeting,
							onChange: (e) => setSettings({
								...settings,
								ai_greeting: e.target.value
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								onClick: () => toast.info("Test call coming soon — we'll dial you in a moment."),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), " Test AI call"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => {
									saveProfile();
									saveSettings();
								},
								disabled: saving,
								className: "brand-gradient text-brand-foreground",
								children: "Save"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6 shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4 text-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "Notifications"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						[
							{
								key: "notifications_email",
								label: "Email when a new lead arrives",
								desc: "Sent to your account email."
							},
							{
								key: "notifications_sms",
								label: "SMS notifications",
								desc: "Texted to the number below."
							},
							{
								key: "notifications_slack",
								label: "Slack integration",
								desc: "Connect a channel to get pings."
							}
						].map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-4 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "cursor-pointer",
								children: opt.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: opt.desc
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: settings[opt.key],
								onCheckedChange: (v) => setSettings({
									...settings,
									[opt.key]: v
								})
							})]
						}, opt.key)),
						settings.notifications_sms && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "SMS phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: settings.notifications_sms_phone || "",
							onChange: (e) => setSettings({
								...settings,
								notifications_sms_phone: e.target.value
							}),
							placeholder: "+1 555 000 1234"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Callback hours start" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "time",
								value: settings.callback_hours_start,
								onChange: (e) => setSettings({
									...settings,
									callback_hours_start: e.target.value
								})
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Callback hours end" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "time",
								value: settings.callback_hours_end,
								onChange: (e) => setSettings({
									...settings,
									callback_hours_end: e.target.value
								})
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: saveSettings,
							disabled: saving,
							className: "brand-gradient text-brand-foreground",
							children: "Save preferences"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6 shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 text-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "Account"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Business name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: profile.business_name,
							onChange: (e) => setProfile({
								...profile,
								business_name: e.target.value
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: profile.email,
							disabled: true
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Timezone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: profile.timezone,
							onValueChange: (v) => setProfile({
								...profile,
								timezone: v
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: TIMEZONES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: t,
								children: t
							}, t)) })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: saveProfile,
							disabled: saving,
							className: "brand-gradient text-brand-foreground",
							children: "Save account"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-4 border-t",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Change password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordChanger, { onSubmit: changePassword })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BillingCard, {
				plan: sub.plan,
				billingDate: sub.billing_date
			})
		]
	});
}
function BillingCard({ plan, billingDate }) {
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function openPortal() {
		setLoading(true);
		try {
			const { createPortalSession } = await import("./payments.functions-xdEWfXRb.mjs").then((n) => n.n);
			const { getStripeEnvironment } = await import("./stripe-CBIZNDhx.mjs").then((n) => n.r);
			const res = await createPortalSession({ data: {
				environment: getStripeEnvironment(),
				returnUrl: window.location.href
			} });
			if ("error" in res) throw new Error(res.error);
			window.open(res.url, "_blank");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not open billing portal");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6 shadow-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4 text-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "Billing"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-4 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Current plan"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-2xl font-semibold capitalize mt-1",
						children: [
							plan,
							" ",
							plan === "free" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted-foreground font-normal",
								children: "(trial)"
							})
						]
					}),
					billingDate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground mt-1",
						children: ["Next bill: ", new Date(billingDate).toLocaleDateString()]
					})
				] }), plan === "free" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/pricing",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "brand-gradient text-brand-foreground",
						children: "Upgrade to Pro"
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/pricing",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "Change plan"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: openPortal,
						disabled: loading,
						className: "brand-gradient text-brand-foreground",
						children: loading ? "Opening..." : "Manage billing"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 pt-6 border-t",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "Invoices"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-2",
					children: plan === "free" ? "No invoices yet — you're on the free plan." : "Click \"Manage billing\" to view and download invoices."
				})]
			})
		]
	});
}
function PasswordChanger({ onSubmit }) {
	const [pw, setPw] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-2 mt-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			type: "password",
			value: pw,
			onChange: (e) => setPw(e.target.value),
			placeholder: "New password",
			minLength: 6
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			onClick: () => {
				if (pw.length >= 6) {
					onSubmit(pw);
					setPw("");
				} else toast.error("Password must be 6+ chars");
			},
			children: "Update"
		})]
	});
}
//#endregion
export { SettingsPage as component };
