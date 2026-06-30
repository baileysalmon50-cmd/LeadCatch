import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-a0HX1RP9.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-CCQEfgNs.mjs";
import { t as Card } from "./card-Bav9nr75.mjs";
import { n as EmbeddedCheckoutProvider, t as EmbeddedCheckout } from "../_libs/@stripe/react-stripe-js+[...].mjs";
import { T as Check } from "../_libs/lucide-react.mjs";
import { t as Logo } from "./logo-2UeFUhWv.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-DYBpJUt2.mjs";
import { t as createCheckoutSession } from "./payments.functions-xdEWfXRb.mjs";
import { n as getStripeEnvironment, t as getStripe } from "./stripe-CBIZNDhx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pricing-CIEWcVoZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StripeEmbeddedCheckout({ priceId, returnUrl }) {
	const fetchClientSecret = async () => {
		const result = await createCheckoutSession({ data: {
			priceId,
			returnUrl: returnUrl || `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
			environment: getStripeEnvironment()
		} });
		if ("error" in result) throw new Error(result.error);
		if (!result.clientSecret) throw new Error("Stripe did not return a client secret");
		return result.clientSecret;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		id: "checkout",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmbeddedCheckoutProvider, {
			stripe: getStripe(),
			options: { fetchClientSecret },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmbeddedCheckout, {})
		})
	});
}
function useStripeCheckout() {
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [options, setOptions] = (0, import_react.useState)(null);
	const openCheckout = (0, import_react.useCallback)((opts) => {
		setOptions(opts);
		setIsOpen(true);
	}, []);
	const closeCheckout = (0, import_react.useCallback)(() => {
		setIsOpen(false);
		setOptions(null);
	}, []);
	return {
		openCheckout,
		closeCheckout,
		isOpen,
		checkoutElement: isOpen && options ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: isOpen,
			onOpenChange: (o) => !o && closeCheckout(),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-3xl max-h-[90vh] overflow-y-auto p-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
					className: "px-6 pt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Complete your subscription" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StripeEmbeddedCheckout, { ...options })
				})]
			})
		}) : null
	};
}
function PaymentTestModeBanner() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full bg-red-100 border-b border-red-300 px-4 py-2 text-center text-sm text-red-800",
		children: "Production checkout is not configured. Complete Stripe go-live in your Lovable project to accept real payments."
	});
}
var PLANS = [
	{
		name: "Free",
		tier: "free",
		monthly: 0,
		yearly: 0,
		desc: "Try it on us.",
		highlight: false,
		features: [
			"10 calls / month",
			"Basic lead inbox",
			"Email notifications",
			"1 phone number"
		]
	},
	{
		name: "Pro",
		tier: "pro",
		monthly: 79,
		yearly: 798,
		desc: "For growing teams.",
		highlight: true,
		features: [
			"100 calls / month",
			"Real-time analytics",
			"SMS + Slack notifications",
			"Custom AI greeting",
			"CSV export"
		]
	},
	{
		name: "Business",
		tier: "business",
		monthly: 150,
		yearly: 1550,
		desc: "Scale without limits.",
		highlight: false,
		features: [
			"Unlimited calls",
			"Advanced analytics",
			"API access",
			"Priority support",
			"Multi-user accounts"
		]
	}
];
function priceIdFor(tier, billing) {
	return `${tier}_${billing === "monthly" ? "monthly" : "yearly"}`;
}
function Pricing() {
	const [billing, setBilling] = (0, import_react.useState)("monthly");
	const [authed, setAuthed] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const { openCheckout, checkoutElement } = useStripeCheckout();
	(0, import_react.useEffect)(() => {
		supabase.auth.getUser().then(({ data }) => setAuthed(!!data.user));
	}, []);
	function handleSelect(plan) {
		if (plan.tier === "free") {
			navigate({
				to: "/auth",
				search: { mode: "signup" }
			});
			return;
		}
		if (!authed) {
			navigate({
				to: "/auth",
				search: { mode: "signup" }
			});
			return;
		}
		openCheckout({ priceId: priceIdFor(plan.tier, billing) });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentTestModeBanner, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 bg-background/80 backdrop-blur border-b",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-6xl mx-auto h-16 flex items-center justify-between px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								children: "Sign in"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							search: { mode: "signup" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								className: "brand-gradient text-brand-foreground",
								children: "Start free"
							})
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "max-w-6xl mx-auto px-6 py-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center max-w-2xl mx-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-4xl md:text-5xl font-bold tracking-tight",
							children: "Pricing that pays for itself."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-muted-foreground",
							children: "One captured lead usually covers the whole month. Cancel anytime."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 inline-flex items-center rounded-full border p-1 bg-surface",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setBilling("monthly"),
								className: cn("px-4 py-1.5 text-sm rounded-full transition-colors", billing === "monthly" ? "bg-brand text-brand-foreground" : "text-muted-foreground"),
								children: "Monthly"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setBilling("yearly"),
								className: cn("px-4 py-1.5 text-sm rounded-full transition-colors", billing === "yearly" ? "bg-brand text-brand-foreground" : "text-muted-foreground"),
								children: ["Yearly ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs ml-1 opacity-80",
									children: "save up to $250"
								})]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 grid md:grid-cols-3 gap-6",
					children: PLANS.map((p) => {
						const isYearly = billing === "yearly" && p.tier !== "free";
						const perMonth = isYearly ? Math.round(p.yearly / 12) : p.monthly;
						const savings = isYearly ? p.monthly * 12 - p.yearly : 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: cn("p-7 relative flex flex-col", p.highlight && "ring-2 ring-brand shadow-lift"),
							children: [
								p.highlight && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium brand-gradient text-brand-foreground",
									children: "Most popular"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-lg font-semibold",
									children: p.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex items-baseline gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-4xl font-bold",
										children: ["$", perMonth]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "/mo"
									})]
								}),
								isYearly && p.tier !== "free" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-brand mt-1",
									children: [
										"Billed $",
										p.yearly,
										"/yr — save $",
										savings
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: p.desc
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-6 space-y-2.5 text-sm flex-1",
									children: p.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-brand shrink-0 mt-0.5" }), f]
									}, f))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => handleSelect(p),
									className: cn("mt-6 w-full", p.highlight && "brand-gradient text-brand-foreground hover:opacity-90"),
									variant: p.highlight ? "default" : "outline",
									children: p.tier === "free" ? "Start free" : `Get ${p.name}`
								})
							]
						}, p.name);
					})
				})]
			}),
			checkoutElement
		]
	});
}
//#endregion
export { Pricing as component };
