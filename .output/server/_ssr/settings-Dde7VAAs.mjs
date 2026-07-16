import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-a0HX1RP9.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-CCQEfgNs.mjs";
import { t as Card } from "./card-Bav9nr75.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as CreditCard, I as Sparkles, M as CalendarClock, P as Bell, a as User, f as Phone, s as Trash2 } from "../_libs/lucide-react.mjs";
import { n as Label, t as Input } from "./label-D2fwATjQ.mjs";
import { t as Textarea } from "./textarea-Dfe41XSO.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DYjyjhZD.mjs";
import { t as Route } from "./settings-6-yHDII5.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-Dde7VAAs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
var BUSINESS_TIMEZONES = [
	"America/New_York",
	"America/Chicago",
	"America/Denver",
	"America/Los_Angeles",
	"America/Phoenix",
	"America/Anchorage",
	"Pacific/Honolulu"
];
var DAYS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];
var BAY_OPTIONS = Array.from({ length: 10 }, (_, index) => String(index + 1));
function SettingsPage() {
	const { user } = Route.useRouteContext();
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [settings, setSettings] = (0, import_react.useState)(null);
	const [sub, setSub] = (0, import_react.useState)(null);
	const [businessHours, setBusinessHours] = (0, import_react.useState)([]);
	const [serviceTypes, setServiceTypes] = (0, import_react.useState)([]);
	const [newService, setNewService] = (0, import_react.useState)({
		name: "",
		duration_minutes: "30"
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		(async () => {
			const [{ data: p }, { data: s }, { data: su }, { data: bh }, { data: st }] = await Promise.all([
				supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
				supabase.from("settings").select("*").eq("user_id", user.id).maybeSingle(),
				supabase.from("subscriptions").select("plan, billing_date").eq("user_id", user.id).maybeSingle(),
				supabase.from("business_hours").select("*").eq("user_id", user.id).order("day_of_week", { ascending: true }),
				supabase.from("service_types").select("*").eq("user_id", user.id).eq("is_active", true).order("name", { ascending: true })
			]);
			setProfile(p);
			setSettings(s);
			setSub(su);
			setBusinessHours((bh ?? []).map((day) => ({
				...day,
				open_time: day.open_time?.slice(0, 5) ?? null,
				close_time: day.close_time?.slice(0, 5) ?? null,
				break_start: day.break_start?.slice(0, 5) ?? null,
				break_end: day.break_end?.slice(0, 5) ?? null
			})));
			setServiceTypes(st ?? []);
		})();
	}, [user.id]);
	async function saveProfile() {
		if (!profile) return;
		setSaving(true);
		const { error } = await supabase.from("profiles").update({
			business_name: profile.business_name,
			forward_phone: profile.forward_phone
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
	async function saveBusinessHour(day) {
		setSaving(true);
		const { error } = await supabase.from("business_hours").update({
			is_open: day.is_open,
			open_time: day.open_time,
			close_time: day.close_time,
			break_start: day.break_start,
			break_end: day.break_end
		}).eq("user_id", user.id).eq("day_of_week", day.day_of_week);
		setSaving(false);
		if (error) toast.error(error.message);
		else toast.success(`${DAYS[day.day_of_week]} hours saved`);
	}
	async function refreshServiceTypes() {
		const { data } = await supabase.from("service_types").select("*").eq("user_id", user.id).eq("is_active", true).order("name", { ascending: true });
		setServiceTypes(data ?? []);
	}
	async function saveServiceType(serviceType) {
		setSaving(true);
		const { error } = await supabase.from("service_types").update({
			name: serviceType.name,
			duration_minutes: serviceType.duration_minutes
		}).eq("id", serviceType.id).eq("user_id", user.id);
		setSaving(false);
		if (error) return toast.error(error.message);
		await refreshServiceTypes();
		toast.success("Service saved");
	}
	async function deactivateServiceType(serviceType) {
		setSaving(true);
		const { error } = await supabase.from("service_types").update({ is_active: false }).eq("id", serviceType.id).eq("user_id", user.id);
		setSaving(false);
		if (error) return toast.error(error.message);
		setServiceTypes((current) => current.filter((item) => item.id !== serviceType.id));
		toast.success("Service deleted");
	}
	async function addServiceType() {
		const name = newService.name.trim();
		const duration_minutes = Number(newService.duration_minutes);
		if (!name) return toast.error("Service name is required");
		if (!Number.isFinite(duration_minutes) || duration_minutes <= 0) return toast.error("Duration must be greater than 0");
		setSaving(true);
		const { error } = await supabase.from("service_types").insert({
			user_id: user.id,
			name,
			duration_minutes,
			is_active: true
		});
		setSaving(false);
		if (error) return toast.error(error.message);
		await refreshServiceTypes();
		setNewService({
			name: "",
			duration_minutes: "30"
		});
		toast.success("Service added");
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
							}), profile.assigned_phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xl font-semibold font-mono mt-1",
								children: profile.assigned_phone
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground mt-1",
								children: "Your LeadCatch number will be assigned during setup"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: [
									"Complete setup in ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/onboarding",
										className: "text-brand hover:underline",
										children: "onboarding"
									}),
									" to get your number."
								]
							})] })]
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "h-4 w-4 text-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "Scheduling"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-medium",
								children: "Business hours"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: "Set availability for each day. Changes save per day."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-3",
								children: businessHours.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border p-4 space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-4 flex-wrap",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium",
												children: DAYS[day.day_of_week]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: day.is_open ? "Open for appointments" : "Closed all day"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: `business-hours-${day.day_of_week}`,
													children: "Open"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
													id: `business-hours-${day.day_of_week}`,
													checked: day.is_open,
													onCheckedChange: (value) => setBusinessHours((current) => current.map((item) => item.day_of_week === day.day_of_week ? {
														...item,
														is_open: value
													} : item))
												})]
											})]
										}),
										day.is_open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-3 md:grid-cols-2 xl:grid-cols-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Open time" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "time",
													value: day.open_time ?? "",
													onChange: (e) => setBusinessHours((current) => current.map((item) => item.day_of_week === day.day_of_week ? {
														...item,
														open_time: e.target.value || null
													} : item))
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Close time" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "time",
													value: day.close_time ?? "",
													onChange: (e) => setBusinessHours((current) => current.map((item) => item.day_of_week === day.day_of_week ? {
														...item,
														close_time: e.target.value || null
													} : item))
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Break start" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "time",
													value: day.break_start || "",
													onChange: (e) => setBusinessHours((current) => current.map((item) => item.day_of_week === day.day_of_week ? {
														...item,
														break_start: e.target.value || null
													} : item))
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Break end" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "time",
													value: day.break_end || "",
													onChange: (e) => setBusinessHours((current) => current.map((item) => item.day_of_week === day.day_of_week ? {
														...item,
														break_end: e.target.value || null
													} : item))
												})] })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											onClick: () => saveBusinessHour(day),
											disabled: saving,
											children: ["Save ", DAYS[day.day_of_week]]
										})
									]
								}, day.day_of_week))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 border-t pt-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-medium",
									children: "Bays and timezone"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-1",
									children: "Control booking capacity and local scheduling time."
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 md:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Service bays (simultaneous appointments)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: String(settings.bays_count),
										onValueChange: (value) => setSettings({
											...settings,
											bays_count: Number(value)
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: BAY_OPTIONS.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: option,
											children: option
										}, option)) })]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Timezone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: settings.timezone || "America/Chicago",
										onValueChange: (value) => setSettings({
											...settings,
											timezone: value
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: BUSINESS_TIMEZONES.map((timezone) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: timezone,
											children: timezone
										}, timezone)) })]
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: saveSettings,
									disabled: saving,
									className: "brand-gradient text-brand-foreground",
									children: "Save scheduling settings"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 border-t pt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-medium",
								children: "Service types"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: "Manage active appointment types and durations."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-[minmax(0,1fr)_140px_110px] gap-3 border-b bg-muted/40 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Name" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Duration" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Actions" })
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "divide-y",
									children: [serviceTypes.map((serviceType) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-[minmax(0,1fr)_140px_110px] gap-3 px-4 py-3 items-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: serviceType.name,
												onChange: (e) => setServiceTypes((current) => current.map((item) => item.id === serviceType.id ? {
													...item,
													name: e.target.value
												} : item))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												min: "1",
												value: String(serviceType.duration_minutes),
												onChange: (e) => setServiceTypes((current) => current.map((item) => item.id === serviceType.id ? {
													...item,
													duration_minutes: Number(e.target.value) || 0
												} : item))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex gap-2 justify-end",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "outline",
													onClick: () => saveServiceType(serviceType),
													disabled: saving,
													children: "Save"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													onClick: () => deactivateServiceType(serviceType),
													disabled: saving,
													"aria-label": `Delete ${serviceType.name}`,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
												})]
											})
										]
									}, serviceType.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-[minmax(0,1fr)_140px_110px] gap-3 px-4 py-3 items-center bg-muted/20",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: newService.name,
												onChange: (e) => setNewService({
													...newService,
													name: e.target.value
												}),
												placeholder: "Add a service"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												min: "1",
												value: newService.duration_minutes,
												onChange: (e) => setNewService({
													...newService,
													duration_minutes: e.target.value
												}),
												placeholder: "Minutes"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex justify-end",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													onClick: addServiceType,
													disabled: saving,
													className: "brand-gradient text-brand-foreground",
													children: "Add service"
												})
											})
										]
									})]
								})]
							})]
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
			const { createPortalSession } = await import("./payments.functions-tYsQqYnh.mjs").then((n) => n.n);
			const { getStripeEnvironment } = await import("./stripe-CZDQChTZ.mjs").then((n) => n.r);
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
