import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-a0HX1RP9.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-CCQEfgNs.mjs";
import { t as Card } from "./card-Bav9nr75.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { b as Inbox, i as Users, o as TrendingUp, p as PhoneOff, w as Clock } from "../_libs/lucide-react.mjs";
import { t as StatusBadge } from "./status-badge-CCqdNHSw.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-DYBpJUt2.mjs";
import { t as Textarea } from "./textarea-Dfe41XSO.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DYjyjhZD.mjs";
import { t as Route } from "./dashboard-BsTQpoai.mjs";
import { t as AddLeadDialog } from "./add-lead-dialog-CgdMOrhc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CWwB6Vv5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StatsCard({ label, value, hint, icon: Icon, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "p-5 shadow-soft hover:shadow-lift transition-shadow",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-3xl font-semibold tracking-tight",
					children: value
				}),
				hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: hint
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("h-10 w-10 rounded-lg flex items-center justify-center", accent ? "brand-gradient text-brand-foreground" : "bg-muted text-muted-foreground"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			})]
		})
	});
}
function maskLeadName(name) {
	return `${name.trim().split(/\s+/)[0] || "Lead"} •••`;
}
function maskLeadPhone(phone) {
	return phone ? "•••-••••" : "—";
}
function Dashboard() {
	const { user } = Route.useRouteContext();
	const [leads, setLeads] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [selectedLead, setSelectedLead] = (0, import_react.useState)(null);
	const [updatingStatus, setUpdatingStatus] = (0, import_react.useState)(false);
	const [updatingNotes, setUpdatingNotes] = (0, import_react.useState)(false);
	const [plan, setPlan] = (0, import_react.useState)("free");
	(0, import_react.useEffect)(() => {
		supabase.from("subscriptions").select("plan").eq("user_id", user.id).maybeSingle().then(({ data }) => {
			if (data?.plan) setPlan(data.plan);
		});
	}, [user.id]);
	(0, import_react.useEffect)(() => {
		let active = true;
		(async () => {
			const { data } = await supabase.from("leads").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
			if (active) {
				setLeads(data || []);
				setLoading(false);
			}
		})();
		const ch = supabase.channel(`leads-${user.id}`).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "leads",
			filter: `user_id=eq.${user.id}`
		}, (payload) => {
			if (payload.eventType === "INSERT") {
				setLeads((prev) => [payload.new, ...prev]);
				toast.success("New lead captured!", { description: payload.new.name });
			} else if (payload.eventType === "UPDATE") {
				setLeads((prev) => prev.map((l) => l.id === payload.new.id ? payload.new : l));
				setSelectedLead((cur) => cur && cur.id === payload.new.id ? payload.new : cur);
			} else if (payload.eventType === "DELETE") setLeads((prev) => prev.filter((l) => l.id !== payload.old.id));
		}).subscribe();
		return () => {
			active = false;
			supabase.removeChannel(ch);
		};
	}, [user.id]);
	const thisMonth = leads.filter((l) => new Date(l.created_at).getMonth() === (/* @__PURE__ */ new Date()).getMonth());
	const captured = thisMonth.length;
	const converted = thisMonth.filter((l) => l.status === "converted").length;
	const conversion = captured ? Math.round(converted / captured * 100) : 0;
	async function updateLeadStatus(id, status) {
		setUpdatingStatus(true);
		const { error } = await supabase.from("leads").update({ status }).eq("id", id);
		setUpdatingStatus(false);
		if (error) toast.error(error.message);
		else toast.success("Status updated");
	}
	async function updateLeadNotes(id, notes) {
		setUpdatingNotes(true);
		const { error } = await supabase.from("leads").update({ notes }).eq("id", id);
		setUpdatingNotes(false);
		if (error) toast.error(error.message);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8 space-y-6 max-w-7xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "Dashboard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Real-time view of every lead your AI captures."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddLeadDialog, { userId: user.id })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsCard, {
						label: "Missed calls this month",
						value: captured,
						icon: PhoneOff
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsCard, {
						label: "Leads captured",
						value: captured,
						hint: "All converted to leads",
						icon: Users,
						accent: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsCard, {
						label: "Avg. response time",
						value: "3m 12s",
						hint: "Last 30 days",
						icon: Clock
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsCard, {
						label: "Conversion rate",
						value: `${conversion}%`,
						hint: `${converted} of ${captured}`,
						icon: TrendingUp
					})
				]
			}),
			plan === "free" && (() => {
				const limit = 10;
				const remaining = Math.max(0, limit - captured);
				const reached = captured >= limit;
				const approaching = captured >= 8 && !reached;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: `p-5 flex flex-wrap items-center justify-between gap-3 shadow-soft ${reached ? "border-destructive/40 bg-destructive/5" : approaching ? "border-amber-500/40 bg-amber-500/5" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold",
							children: "Free Plan Limit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								"You have ",
								remaining,
								" calls remaining this month (",
								captured,
								"/",
								limit,
								" used)"
							]
						})] }),
						reached && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/pricing",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "brand-gradient text-brand-foreground",
								children: "Upgrade Now"
							})
						}),
						approaching && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/pricing",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								children: "Upgrade Soon"
							})
						})
					]
				});
			})(),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 border-b flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "Recent leads"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Updates live as new calls come in."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/leads",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							children: "View all"
						})
					})]
				}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-12 text-center text-sm text-muted-foreground",
					children: "Loading..."
				}) : leads.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-12 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "h-10 w-10 mx-auto text-muted-foreground/50" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-medium",
							children: "No leads yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "When your AI captures a caller's info, it'll appear here in real time."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground mt-3",
							children: [
								"Try the ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Simulate lead" }),
								" button above to see it in action."
							]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/50 text-xs uppercase text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-5 py-3 font-medium",
									children: "Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-5 py-3 font-medium",
									children: "Phone"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-5 py-3 font-medium",
									children: "Need"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-5 py-3 font-medium",
									children: "When"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-5 py-3 font-medium",
									children: "Status"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: leads.slice(0, 10).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t hover:bg-muted/30 cursor-pointer transition-colors",
							onClick: () => setSelectedLead(l),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3 font-medium",
									children: l.locked ? maskLeadName(l.name) : l.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3 text-muted-foreground font-mono text-xs",
									children: l.locked ? maskLeadPhone(l.phone) : l.phone || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: `px-5 py-3 text-muted-foreground max-w-xs truncate ${l.locked ? "blur-[2px]" : ""}`,
									children: l.locked ? "Locked lead details" : l.business_need || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3 text-muted-foreground text-xs",
									children: new Date(l.created_at).toLocaleString()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: l.status })
								})
							]
						}, l.id)) })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!selectedLead,
				onOpenChange: (open) => !open && setSelectedLead(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto",
					children: selectedLead && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
							className: "flex flex-row items-start justify-between space-y-0 pr-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
									className: "text-xl md:text-2xl",
									children: selectedLead.locked ? maskLeadName(selectedLead.name) : selectedLead.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground mt-1",
									children: ["Created ", new Date(selectedLead.created_at).toLocaleString()]
								})]
							})
						}),
						selectedLead.locked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-700",
							children: [
								"This lead is locked by your current plan. ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/pricing",
									className: "underline underline-offset-2",
									children: "Upgrade to unlock"
								}),
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold text-muted-foreground uppercase",
										children: "Phone"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-mono mt-1",
										children: selectedLead.locked ? maskLeadPhone(selectedLead.phone) : selectedLead.phone || "—"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold text-muted-foreground uppercase",
										children: "Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm mt-1 break-all",
										children: selectedLead.locked ? "locked@hidden" : selectedLead.email || "—"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-muted-foreground uppercase",
									children: "Business Need"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-sm mt-1 ${selectedLead.locked ? "blur-[2px]" : ""}`,
									children: selectedLead.locked ? "Lead details hidden until upgrade." : selectedLead.business_need || "—"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-muted-foreground uppercase",
									children: "Callback Time"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm mt-1",
									children: selectedLead.locked ? "Locked" : selectedLead.callback_time || "—"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-muted-foreground uppercase mb-2",
									children: "Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: selectedLead.status,
									onValueChange: (status) => updateLeadStatus(selectedLead.id, status),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-full",
										disabled: updatingStatus,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "new",
											children: "New"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "called",
											children: "Called"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "converted",
											children: "Converted"
										})
									] })]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-muted-foreground uppercase mb-2",
									children: "Notes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									placeholder: selectedLead.locked ? "Upgrade to unlock notes" : "Add notes about this lead...",
									value: selectedLead.locked ? "Locked" : selectedLead.notes || "",
									onChange: (e) => {
										if (selectedLead.locked) return;
										setSelectedLead({
											...selectedLead,
											notes: e.target.value
										});
										updateLeadNotes(selectedLead.id, e.target.value);
									},
									disabled: updatingNotes || selectedLead.locked,
									className: `min-h-24 ${selectedLead.locked ? "blur-[2px]" : ""}`
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-muted-foreground uppercase",
									children: "Last Updated"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm mt-1",
									children: new Date(selectedLead.updated_at).toLocaleString()
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setSelectedLead(null),
							className: "w-full",
							children: "Close"
						}) })
					] })
				})
			})
		]
	});
}
//#endregion
export { Dashboard as component };
