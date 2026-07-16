import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-a0HX1RP9.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime, a as Overlay2, c as Title2, i as Description2, l as Trigger2, n as Cancel, o as Portal2, r as Content2, s as Root2, t as Action } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as buttonVariants, r as cn, t as Button } from "./button-CCQEfgNs.mjs";
import { t as Card } from "./card-Bav9nr75.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as Download, _ as Lock, b as Inbox, s as Trash2, u as Search } from "../_libs/lucide-react.mjs";
import { t as StatusBadge } from "./status-badge-CCqdNHSw.mjs";
import { t as Input } from "./label-D2fwATjQ.mjs";
import { t as Textarea } from "./textarea-Dfe41XSO.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DYjyjhZD.mjs";
import { t as AddLeadDialog } from "./add-lead-dialog-CgdMOrhc.mjs";
import { t as Route } from "./leads-DOxTh3jI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leads-C29iJnIp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AlertDialog = Root2;
var AlertDialogTrigger = Trigger2;
var AlertDialogPortal = Portal2;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = Overlay2.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = Content2.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = Title2.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = Description2.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = Action.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = Cancel.displayName;
function maskLeadName(name) {
	return `${name.trim().split(/\s+/)[0] || "Lead"} •••`;
}
function maskLeadPhone(phone) {
	return phone ? "•••-••••" : "—";
}
function maskedLeadSummary(lead) {
	return lead.locked ? "Lead details hidden until you upgrade." : lead.business_need || "No details captured.";
}
function canAddLead(plan, leadsThisPeriod) {
	if (plan === "free" && leadsThisPeriod >= 10) return false;
	if (plan === "pro" && leadsThisPeriod >= 100) return false;
	return true;
}
function LeadsPage() {
	const { user } = Route.useRouteContext();
	const [leads, setLeads] = (0, import_react.useState)([]);
	const [query, setQuery] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [plan, setPlan] = (0, import_react.useState)("free");
	const [periodStart, setPeriodStart] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		supabase.from("subscriptions").select("plan, call_period_start").eq("user_id", user.id).maybeSingle().then(({ data, error }) => {
			if (error) {
				console.error("Failed to load subscription plan info", error);
				toast.warning("Plan information could not be loaded. Using fallback limits.");
			}
			if (data?.plan) setPlan(data.plan);
			const cps = data?.call_period_start;
			setPeriodStart(cps ? new Date(cps) : new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth(), 1));
		});
		supabase.from("leads").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => setLeads(data || []));
		const ch = supabase.channel("leads-page").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "leads",
			filter: `user_id=eq.${user.id}`
		}, (payload) => {
			if (payload.eventType === "INSERT") setLeads((p) => [payload.new, ...p]);
			else if (payload.eventType === "UPDATE") setLeads((p) => p.map((l) => l.id === payload.new.id ? payload.new : l));
			else if (payload.eventType === "DELETE") setLeads((p) => p.filter((l) => l.id !== payload.old.id));
		}).subscribe();
		return () => {
			supabase.removeChannel(ch);
		};
	}, [user.id]);
	const allowAdd = canAddLead(plan, periodStart ? leads.filter((l) => new Date(l.created_at) >= periodStart).length : 0);
	const filtered = (0, import_react.useMemo)(() => leads.filter((l) => {
		const matchesQuery = !query || [
			l.name,
			l.phone,
			l.email,
			l.business_need
		].some((f) => f?.toLowerCase().includes(query.toLowerCase()));
		const matchesStatus = statusFilter === "all" || l.status === statusFilter;
		return matchesQuery && matchesStatus;
	}), [
		leads,
		query,
		statusFilter
	]);
	async function updateStatus(id, status) {
		const { error } = await supabase.from("leads").update({ status }).eq("id", id);
		if (error) toast.error(error.message);
		else toast.success("Status updated");
	}
	async function updateNotes(id, notes) {
		const { error } = await supabase.from("leads").update({ notes }).eq("id", id);
		if (error) toast.error(error.message);
	}
	async function deleteLead(id) {
		const { error } = await supabase.from("leads").delete().eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Lead deleted");
		setSelected(null);
	}
	function exportCsv() {
		const rows = [[
			"Name",
			"Phone",
			"Email",
			"Need",
			"Callback",
			"Status",
			"Date",
			"Notes"
		]];
		filtered.forEach((l) => rows.push([
			l.locked ? maskLeadName(l.name) : l.name,
			l.locked ? maskLeadPhone(l.phone) : l.phone || "",
			l.locked ? "locked" : l.email || "",
			l.locked ? "locked" : l.business_need || "",
			l.locked ? "locked" : l.callback_time || "",
			l.status,
			new Date(l.created_at).toISOString(),
			l.locked ? "locked" : l.notes || ""
		]));
		const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, "\"\"")}"`).join(",")).join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = `leadcatch-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
		a.click();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8 space-y-6 max-w-7xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "Leads"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						leads.length,
						" total · ",
						leads.filter((l) => l.status === "new").length,
						" new"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: exportCsv,
						disabled: filtered.length === 0,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " Export"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddLeadDialog, {
						userId: user.id,
						disabled: !allowAdd,
						disabledLabel: "Call Limit Reached"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4 flex flex-col sm:flex-row gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "pl-9",
						placeholder: "Search by name, phone, or need...",
						value: query,
						onChange: (e) => setQuery(e.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: statusFilter,
					onValueChange: setStatusFilter,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-full sm:w-44",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All statuses"
						}),
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
				})]
			}),
			filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-16 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "h-10 w-10 mx-auto text-muted-foreground/50" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-medium",
						children: "No leads to show"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: leads.length === 0 ? "Your captured leads will show up here." : "Try adjusting your filters."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3",
				children: filtered.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "p-5 hover:shadow-soft transition-shadow cursor-pointer",
					onClick: () => setSelected(l),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-start justify-between gap-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 flex-wrap",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-semibold",
											children: l.locked ? maskLeadName(l.name) : l.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: l.status }),
										l.locked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-700",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3" }), " Locked"]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `mt-1 text-sm text-muted-foreground ${l.locked ? "blur-[2px]" : ""}`,
									children: maskedLeadSummary(l)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex gap-4 text-xs text-muted-foreground flex-wrap",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono",
											children: l.locked ? maskLeadPhone(l.phone) : l.phone || "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: l.locked ? "locked@hidden" : l.email || "—" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: new Date(l.created_at).toLocaleString() })
									]
								}),
								l.locked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs text-amber-700",
									children: ["Upgrade to unlock full lead details. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "/pricing",
										className: "underline underline-offset-2",
										children: "Upgrade to unlock"
									})]
								})
							]
						})
					})
				}, l.id))
			}),
			selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 bg-black/30 backdrop-blur-sm flex items-end sm:items-center sm:justify-end",
				onClick: () => setSelected(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full sm:max-w-md sm:h-full bg-surface shadow-lift sm:rounded-l-2xl overflow-y-auto",
					onClick: (e) => e.stopPropagation(),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-6 space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xl font-bold",
									children: selected.locked ? maskLeadName(selected.name) : selected.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: ["Captured ", new Date(selected.created_at).toLocaleString()]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => setSelected(null),
									children: "Close"
								})]
							}),
							selected.locked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
								className: "grid grid-cols-2 gap-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Phone"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono",
										children: selected.locked ? maskLeadPhone(selected.phone) : selected.phone || "—"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: selected.locked ? "locked@hidden" : selected.email || "—" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Callback time"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: selected.locked ? "Locked" : selected.callback_time || "—" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Need"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: selected.locked ? "blur-[2px]" : "",
											children: selected.locked ? "Lead details hidden until upgrade." : selected.business_need || "—"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mb-1.5",
								children: "Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: selected.status,
								onValueChange: (v) => {
									updateStatus(selected.id, v);
									setSelected({
										...selected,
										status: v
									});
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "new",
										children: "🔴 New"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "called",
										children: "🟡 Called"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "converted",
										children: "🟢 Converted"
									})
								] })]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mb-1.5",
								children: "Notes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								defaultValue: selected.locked ? "Locked" : selected.notes || "",
								placeholder: selected.locked ? "Upgrade to unlock notes" : "Add your notes...",
								onBlur: (e) => !selected.locked && updateNotes(selected.id, e.target.value),
								className: `min-h-32 ${selected.locked ? "blur-[2px]" : ""}`,
								disabled: selected.locked
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "w-full text-destructive border-destructive/30 hover:bg-destructive/10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), " Delete lead"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Delete this lead?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "This can't be undone." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
								onClick: () => deleteLead(selected.id),
								className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
								children: "Delete"
							})] })] })] })
						]
					})
				})
			})
		]
	});
}
//#endregion
export { LeadsPage as component };
