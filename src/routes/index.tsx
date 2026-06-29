import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Card } from "@/components/ui/card";
import { PhoneOff, Bot, Bell, BarChart3, Check, ArrowRight, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LeadCatch — Never miss another lead" },
      { name: "description", content: "When customers call and you can't pick up, our AI answers, captures their info, and drops the lead in your dashboard." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto h-16 flex items-center justify-between px-6">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/auth"><Button variant="ghost" size="sm">Sign in</Button></Link>
            <Link to="/auth" search={{ mode: "signup" }}><Button size="sm" className="brand-gradient text-brand-foreground hover:opacity-90">Start free trial</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-bg">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-surface text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-brand pulse-dot" />
            Now live — AI answers in under 2 rings
          </div>
          <h1 className="mt-6 text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            Every missed call is<br/>
            <span className="bg-gradient-to-r from-brand to-chart-2 bg-clip-text text-transparent">a lead you forgot to win.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            LeadCatch picks up when you can't. Our AI greets the caller, captures who they are and what they need, and drops the lead into your dashboard — in real time.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/auth" search={{ mode: "signup" }}>
              <Button size="lg" className="brand-gradient text-brand-foreground hover:opacity-90 shadow-soft">
                Start free trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing"><Button size="lg" variant="outline">See pricing</Button></Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">No credit card • 10 free calls • Set up in 3 minutes</p>

          {/* Mock dashboard preview */}
          <div className="mt-16 max-w-4xl mx-auto rounded-2xl border bg-surface shadow-lift overflow-hidden">
            <div className="h-9 bg-muted/50 flex items-center gap-1.5 px-4 border-b">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/40" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/40" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/40" />
            </div>
            <div className="p-6 grid grid-cols-3 gap-4 text-left">
              <Card className="p-4"><p className="text-xs text-muted-foreground">Missed calls</p><p className="text-2xl font-semibold mt-1">47</p></Card>
              <Card className="p-4"><p className="text-xs text-muted-foreground">Leads captured</p><p className="text-2xl font-semibold mt-1 text-brand">42</p></Card>
              <Card className="p-4"><p className="text-xs text-muted-foreground">Conversion</p><p className="text-2xl font-semibold mt-1">31%</p></Card>
              <div className="col-span-3 rounded-lg border p-4 space-y-2">
                {[
                  { n: "Sarah Chen", need: "Kitchen remodel quote", s: "new" as const },
                  { n: "Marcus Lee", need: "Plumbing emergency", s: "called" as const },
                  { n: "Priya Patel", need: "Booking weekly cleanup", s: "converted" as const },
                ].map((r) => (
                  <div key={r.n} className="flex items-center justify-between text-sm py-1">
                    <div><span className="font-medium">{r.n}</span><span className="text-muted-foreground"> — {r.need}</span></div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.s === "new" ? "bg-destructive/10 text-destructive" : r.s === "called" ? "bg-warning/15 text-warning-foreground" : "bg-success/15 text-success-foreground"}`}>{r.s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center">Built for businesses that live on the phone</h2>
        <p className="mt-3 text-center text-muted-foreground max-w-2xl mx-auto">Contractors, salons, clinics, agencies — anyone who can't drop everything to answer.</p>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { i: Bot,      t: "AI that actually listens", d: "Custom greeting, qualifying questions, and a friendly voice that sounds like your business." },
            { i: Bell,     t: "Instant notifications",    d: "Email, SMS, and Slack pings the moment a lead drops in. Call them back while it's hot." },
            { i: BarChart3,t: "Real-time analytics",      d: "See response time, conversion rate, and lead source trends across every channel." },
          ].map(({ i: Icon, t, d }) => (
            <Card key={t} className="p-6 hover:shadow-lift transition-shadow">
              <div className="h-10 w-10 rounded-lg brand-gradient flex items-center justify-center">
                <Icon className="h-5 w-5 text-brand-foreground" />
              </div>
              <h3 className="mt-4 font-semibold text-lg">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 bg-muted/40">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Three steps. Zero missed leads.</h2>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {[
              { n: "01", t: "Forward your missed calls", d: "We assign you a dedicated number. Set it as your call-forwarding fallback in 60 seconds." },
              { n: "02", t: "AI picks up & qualifies",  d: "Custom greeting captures name, phone, email, and what they need — politely and fast." },
              { n: "03", t: "You call them back",        d: "Lead shows up live in your dashboard with a notification. You close the deal." },
            ].map((s) => (
              <div key={s.n} className="relative">
                <div className="text-5xl font-bold text-brand/30">{s.n}</div>
                <h3 className="mt-2 text-xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center">
        <div className="rounded-3xl border bg-surface p-12 shadow-lift hero-bg">
          <PhoneOff className="h-10 w-10 text-brand mx-auto" />
          <h2 className="mt-4 text-3xl md:text-4xl font-bold">Stop losing leads to voicemail.</h2>
          <p className="mt-3 text-muted-foreground">10 free calls. Cancel anytime. Setup in 3 minutes.</p>
          <Link to="/auth" search={{ mode: "signup" }} className="mt-6 inline-block">
            <Button size="lg" className="brand-gradient text-brand-foreground hover:opacity-90">
              <Zap className="h-4 w-4" /> Start free trial
            </Button>
          </Link>
          <ul className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            {["No credit card", "Cancel anytime", "5-minute setup"].map((x) => (
              <li key={x} className="inline-flex items-center gap-1"><Check className="h-4 w-4 text-brand" />{x}</li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 LeadCatch. Built for businesses that hate missing calls.</p>
      </footer>
    </div>
  );
}
