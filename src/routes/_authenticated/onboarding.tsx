import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Logo } from "@/components/logo";
import { Phone, MessageSquare, Clock, ArrowRight, Check, Info, ChevronDown, Smartphone, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const RETELL_PHONE_NUMBER = "1(754)341-1322";

export const Route = createFileRoute("/_authenticated/onboarding")({
  component: Onboarding,
});

function Onboarding() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [forwardPhone, setForwardPhone] = useState(""); // their business number
  const [greeting, setGreeting] = useState("");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("18:00");
  const [saving, setSaving] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const [{ data: p }, { data: s }] = await Promise.all([
        supabase.from("profiles").select("forward_phone").eq("id", user.id).maybeSingle(),
        supabase.from("settings").select("ai_greeting, callback_hours_start, callback_hours_end").eq("user_id", user.id).maybeSingle(),
      ]);
      if (p) { setForwardPhone(p.forward_phone || ""); }
      if (s) { setGreeting(s.ai_greeting); setStart(s.callback_hours_start); setEnd(s.callback_hours_end); }
    })();
  }, [user.id]);

  async function finish() {
    setSaving(true);
    await supabase.from("profiles").update({ forward_phone: forwardPhone || null, onboarded: true }).eq("id", user.id);
    await supabase.from("settings").update({ ai_greeting: greeting, callback_hours_start: start, callback_hours_end: end }).eq("user_id", user.id);
    setSaving(false);
    toast.success("You're all set! Welcome to LeadCatch.");
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen hero-bg flex flex-col">
      <div className="p-6"><Logo /></div>
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <Card className="w-full max-w-xl p-8 shadow-lift">
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex-1 flex items-center gap-2">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold ${n <= step ? "brand-gradient text-brand-foreground" : "bg-muted text-muted-foreground"}`}>
                  {n < step ? <Check className="h-3.5 w-3.5" /> : n}
                </div>
                {n < 3 && <div className={`flex-1 h-0.5 ${n < step ? "bg-brand" : "bg-muted"}`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4" /> Step 1 of 3</div>
              <div>
                <h2 className="text-2xl font-bold">Connect Your Business Number</h2>
                <p className="mt-1 text-sm text-muted-foreground">We'll capture missed calls on this number. When you don't answer, your phone system will forward to our AI.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="biz-phone">What's your main business phone number?</Label>
                <Input
                  id="biz-phone"
                  value={forwardPhone}
                  onChange={(e) => setForwardPhone(e.target.value)}
                  placeholder="e.g. 555-123-4567"
                />
              </div>

              <div className="rounded-xl border bg-muted/40 p-5 space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Your LeadCatch AI Number</p>
                <p className="text-2xl font-semibold font-mono">{RETELL_PHONE_NUMBER}</p>
                <p className="text-xs text-muted-foreground">Forward missed calls from your business number to this LeadCatch number. Our AI will answer and collect lead info.</p>
              </div>

              <div className="rounded-xl border border-brand/20 bg-brand/10 p-4 flex gap-3">
                <Info className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-brand-foreground">No need to change your number</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Just set up call forwarding on your existing phone system. Most business phones and carriers support this in their settings.</p>
                </div>
              </div>

              <Collapsible open={guidesOpen} onOpenChange={setGuidesOpen}>
                <CollapsibleTrigger asChild>
                  <button className="flex items-center gap-2 text-sm font-medium text-brand hover:text-brand/80 transition-colors">
                    <ExternalLink className="h-4 w-4" />
                    How to set up call forwarding
                    <ChevronDown className={`h-4 w-4 transition-transform ${guidesOpen ? "rotate-180" : ""}`} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-3 space-y-3 rounded-xl border bg-muted/30 p-4">
                    {[
                      { icon: Smartphone, title: "iPhone", steps: "Settings → Phone → Call Forwarding → Turn on → Enter your LeadCatch number above." },
                      { icon: Smartphone, title: "Android", steps: "Phone app → ⋮ Menu → Settings → Calls → Call Forwarding → Enter your LeadCatch number above." },
                      { icon: Phone, title: "Vonage Business", steps: "Admin Portal → Features → Call Forwarding → Add your LeadCatch number → Save." },
                      { icon: Phone, title: "Other carrier / landline", steps: "Dial *72 (or *21 in some regions), then your LeadCatch number. Or contact your carrier's support to enable call forwarding." },
                    ].map((g) => (
                      <div key={g.title} className="flex gap-3">
                        <g.icon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">{g.title}</p>
                          <p className="text-sm text-muted-foreground">{g.steps}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Button className="w-full brand-gradient text-brand-foreground" onClick={() => setStep(2)}>
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><MessageSquare className="h-4 w-4" /> Step 2 of 3</div>
              <h2 className="mt-2 text-2xl font-bold">Customize your AI greeting</h2>
              <p className="mt-1 text-sm text-muted-foreground">This is what your callers hear when the AI picks up.</p>
              <Textarea className="mt-4 min-h-32" value={greeting} onChange={(e) => setGreeting(e.target.value)} />
              <div className="mt-6 flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-1 brand-gradient text-brand-foreground" onClick={() => setStep(3)}>Continue <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4" /> Step 3 of 3</div>
              <h2 className="mt-2 text-2xl font-bold">Callback preferences</h2>
              <p className="mt-1 text-sm text-muted-foreground">When are you typically available to call leads back?</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div><Label>Start time</Label><Input type="time" value={start} onChange={(e) => setStart(e.target.value)} /></div>
                <div><Label>End time</Label><Input type="time" value={end} onChange={(e) => setEnd(e.target.value)} /></div>
              </div>
              <div className="mt-6 flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button disabled={saving} className="flex-1 brand-gradient text-brand-foreground" onClick={finish}>{saving ? "Saving..." : "Go to dashboard"}</Button>
              </div>
              <button onClick={finish} className="mt-3 text-xs text-muted-foreground hover:text-foreground w-full text-center">Skip for now</button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
