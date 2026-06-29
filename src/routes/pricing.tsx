import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — LeadCatch" },
      { name: "description", content: "Simple, transparent pricing for missed-call lead capture. Start free, upgrade when you grow." },
    ],
  }),
  component: Pricing,
});

type Billing = "monthly" | "yearly";

type Plan = {
  name: string;
  tier: "free" | "pro" | "business";
  monthly: number;
  yearly: number; // total billed annually
  desc: string;
  highlight: boolean;
  features: string[];
};

const PLANS: Plan[] = [
  { name: "Free", tier: "free", monthly: 0, yearly: 0, desc: "Try it on us.", highlight: false,
    features: ["10 calls / month", "Basic lead inbox", "Email notifications", "1 phone number"] },
  { name: "Pro", tier: "pro", monthly: 79, yearly: 798, desc: "For growing teams.", highlight: true,
    features: ["100 calls / month", "Real-time analytics", "SMS + Slack notifications", "Custom AI greeting", "CSV export"] },
  { name: "Business", tier: "business", monthly: 150, yearly: 1550, desc: "Scale without limits.", highlight: false,
    features: ["Unlimited calls", "Advanced analytics", "API access", "Priority support", "Multi-user accounts"] },
];

function priceIdFor(tier: "pro" | "business", billing: Billing) {
  return `${tier}_${billing === "monthly" ? "monthly" : "yearly"}`;
}

function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const [authed, setAuthed] = useState(false);
  const navigate = useNavigate();
  const { openCheckout, checkoutElement } = useStripeCheckout();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setAuthed(!!data.user));
  }, []);

  function handleSelect(plan: Plan) {
    if (plan.tier === "free") {
      navigate({ to: "/auth", search: { mode: "signup" } });
      return;
    }
    if (!authed) {
      navigate({ to: "/auth", search: { mode: "signup" } });
      return;
    }
    openCheckout({ priceId: priceIdFor(plan.tier, billing) });
  }

  return (
    <div className="min-h-screen">
      <PaymentTestModeBanner />
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto h-16 flex items-center justify-between px-6">
          <Link to="/"><Logo /></Link>
          <div className="flex items-center gap-2">
            <Link to="/auth"><Button variant="ghost" size="sm">Sign in</Button></Link>
            <Link to="/auth" search={{ mode: "signup" }}><Button size="sm" className="brand-gradient text-brand-foreground">Start free</Button></Link>
          </div>
        </div>
      </header>
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Pricing that pays for itself.</h1>
          <p className="mt-4 text-muted-foreground">One captured lead usually covers the whole month. Cancel anytime.</p>

          <div className="mt-8 inline-flex items-center rounded-full border p-1 bg-surface">
            <button
              onClick={() => setBilling("monthly")}
              className={cn("px-4 py-1.5 text-sm rounded-full transition-colors", billing === "monthly" ? "bg-brand text-brand-foreground" : "text-muted-foreground")}
            >Monthly</button>
            <button
              onClick={() => setBilling("yearly")}
              className={cn("px-4 py-1.5 text-sm rounded-full transition-colors", billing === "yearly" ? "bg-brand text-brand-foreground" : "text-muted-foreground")}
            >Yearly <span className="text-xs ml-1 opacity-80">save up to $250</span></button>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {PLANS.map((p) => {
            const isYearly = billing === "yearly" && p.tier !== "free";
            const perMonth = isYearly ? Math.round(p.yearly / 12) : p.monthly;
            const savings = isYearly ? p.monthly * 12 - p.yearly : 0;
            return (
              <Card key={p.name} className={cn("p-7 relative flex flex-col", p.highlight && "ring-2 ring-brand shadow-lift")}>
                {p.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium brand-gradient text-brand-foreground">Most popular</span>
                )}
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${perMonth}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                {isYearly && p.tier !== "free" && (
                  <p className="text-xs text-brand mt-1">Billed ${p.yearly}/yr — save ${savings}</p>
                )}
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                <ul className="mt-6 space-y-2.5 text-sm flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-brand shrink-0 mt-0.5" />{f}</li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSelect(p)}
                  className={cn("mt-6 w-full", p.highlight && "brand-gradient text-brand-foreground hover:opacity-90")}
                  variant={p.highlight ? "default" : "outline"}
                >
                  {p.tier === "free" ? "Start free" : `Get ${p.name}`}
                </Button>
              </Card>
            );
          })}
        </div>
      </section>
      {checkoutElement}
    </div>
  );
}
