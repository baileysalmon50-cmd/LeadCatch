import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-a0HX1RP9.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as useNavigate, f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-CCQEfgNs.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as CreditCard, R as ChartColumn, g as LogOut, i as Users, j as CalendarDays, l as Settings, v as LayoutDashboard } from "../_libs/lucide-react.mjs";
import { t as Logo } from "./logo-2UeFUhWv.mjs";
import { t as Route } from "./route-teEVkAjr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-DZIZsHVE2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var items = [
	{
		to: "/dashboard",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/leads",
		label: "Leads",
		icon: Users
	},
	{
		to: "/appointments",
		label: "Appointments",
		icon: CalendarDays
	},
	{
		to: "/analytics",
		label: "Analytics",
		icon: ChartColumn
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings
	}
];
function AppSidebar() {
	const path = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "hidden md:flex w-64 flex-col border-r bg-surface",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-16 flex items-center px-5 border-b",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex-1 p-3 space-y-1",
				children: items.map((it) => {
					const active = path.startsWith(it.to);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: it.to,
						className: cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors", active ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:bg-muted hover:text-foreground"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(it.icon, { className: "h-4 w-4" }), it.label]
					}, it.to);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-4 border-t",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-muted p-3 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium text-foreground",
						children: "Need help?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-muted-foreground",
						children: "Check our quick-start guide for connecting your phone."
					})]
				})
			})
		]
	});
}
function Topbar({ businessName }) {
	const navigate = useNavigate();
	async function signOut() {
		await supabase.auth.signOut();
		toast.success("Signed out");
		navigate({ to: "/" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "h-16 border-b bg-surface/80 backdrop-blur flex items-center justify-between px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: "Workspace"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium",
			children: businessName || "Your business"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: () => navigate({ to: "/settings" }),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4" }), " Billing"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: signOut,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), " Sign out"]
			})]
		})]
	});
}
function AuthenticatedLayout() {
	const { user } = Route.useRouteContext();
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const isOnboarding = pathname.endsWith("/onboarding");
	const [businessName, setBusinessName] = (0, import_react.useState)("");
	const [onboarded, setOnboarded] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		supabase.from("profiles").select("business_name, onboarded").eq("id", user.id).maybeSingle().then(({ data }) => {
			setBusinessName(data?.business_name || "");
			setOnboarded(!!data?.onboarded);
			if (data && !data.onboarded && !pathname.endsWith("/onboarding")) navigate({ to: "/onboarding" });
		});
	}, [
		user.id,
		navigate,
		pathname
	]);
	if (isOnboarding) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	if (onboarded === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center text-sm text-muted-foreground",
		children: "Loading..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSidebar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex flex-col min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Topbar, { businessName }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 overflow-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			})]
		})]
	});
}
//#endregion
export { AuthenticatedLayout as component };
