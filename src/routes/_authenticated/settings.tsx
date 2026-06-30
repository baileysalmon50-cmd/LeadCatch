import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Bell, User, CreditCard, Sparkles } from "lucide-react";
import { toast } from "sonner";

const RETELL_PHONE_NUMBER = "1(754)341-1322";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — LeadCatch" }] }),
  component: SettingsPage,
});

type Profile = { id: string; email: string; business_name: string; assigned_phone: string; forward_phone: string | null; timezone: string };
type Settings = { ai_greeting: string; callback_hours_start: string; callback_hours_end: string;
  notifications_email: boolean; notifications_sms: boolean; notifications_sms_phone: string | null; notifications_slack: boolean };
type Subscription = { plan: "free" | "pro" | "business"; billing_date: string | null };

const TIMEZONES = ["America/New_York","America/Chicago","America/Denver","America/Los_Angeles","Europe/London","Europe/Paris","Asia/Tokyo","Australia/Sydney"];

function SettingsPage() {
  const { user } = Route.useRouteContext();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [sub, setSub] = useState<Subscription | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const [{ data: p }, { data: s }, { data: su }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("settings").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("subscriptions").select("plan, billing_date").eq("user_id", user.id).maybeSingle(),
      ]);
      setProfile(p as Profile);
      setSettings(s as Settings);
      setSub(su as Subscription);
    })();
  }, [user.id]);

  async function saveProfile() {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      business_name: profile.business_name, forward_phone: profile.forward_phone, timezone: profile.timezone,
    }).eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Profile saved");
  }
  async function saveSettings() {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase.from("settings").update(settings).eq("user_id", user.id);
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Settings saved");
  }
  async function changePassword(pw: string) {
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) toast.error(error.message); else toast.success("Password updated");
  }

  if (!profile || !settings || !sub) return <div className="p-8 text-sm text-muted-foreground">Loading...</div>;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your phone, notifications, and account.</p>
      </div>

      {/* Phone */}
      <Card className="p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4"><Phone className="h-4 w-4 text-brand" /><h2 className="font-semibold">Phone settings</h2></div>
        <div className="space-y-4">
          <div className="rounded-xl bg-muted/40 border p-4">
            <p className="text-xs text-muted-foreground">Your LeadCatch AI number</p>
            <p className="text-xl font-semibold font-mono mt-1">{RETELL_PHONE_NUMBER}</p>
          </div>
          <div><Label>Your business phone</Label><Input value={profile.forward_phone || ""} onChange={(e) => setProfile({ ...profile, forward_phone: e.target.value })} placeholder="+1 555 000 1234" /></div>
          <div><Label>AI greeting</Label>
            <Textarea className="min-h-28" value={settings.ai_greeting} onChange={(e) => setSettings({ ...settings, ai_greeting: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.info("Test call coming soon — we'll dial you in a moment.")}><Sparkles className="h-4 w-4" /> Test AI call</Button>
            <Button onClick={() => { saveProfile(); saveSettings(); }} disabled={saving} className="brand-gradient text-brand-foreground">Save</Button>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4"><Bell className="h-4 w-4 text-brand" /><h2 className="font-semibold">Notifications</h2></div>
        <div className="space-y-4">
          {[
            { key: "notifications_email" as const, label: "Email when a new lead arrives", desc: "Sent to your account email." },
            { key: "notifications_sms"   as const, label: "SMS notifications",              desc: "Texted to the number below." },
            { key: "notifications_slack" as const, label: "Slack integration",              desc: "Connect a channel to get pings." },
          ].map((opt) => (
            <div key={opt.key} className="flex items-center justify-between gap-4 py-2">
              <div><Label className="cursor-pointer">{opt.label}</Label><p className="text-xs text-muted-foreground">{opt.desc}</p></div>
              <Switch checked={settings[opt.key]} onCheckedChange={(v) => setSettings({ ...settings, [opt.key]: v })} />
            </div>
          ))}
          {settings.notifications_sms && (
            <div><Label>SMS phone</Label><Input value={settings.notifications_sms_phone || ""} onChange={(e) => setSettings({ ...settings, notifications_sms_phone: e.target.value })} placeholder="+1 555 000 1234" /></div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Callback hours start</Label><Input type="time" value={settings.callback_hours_start} onChange={(e) => setSettings({ ...settings, callback_hours_start: e.target.value })} /></div>
            <div><Label>Callback hours end</Label><Input type="time" value={settings.callback_hours_end} onChange={(e) => setSettings({ ...settings, callback_hours_end: e.target.value })} /></div>
          </div>
          <Button onClick={saveSettings} disabled={saving} className="brand-gradient text-brand-foreground">Save preferences</Button>
        </div>
      </Card>

      {/* Account */}
      <Card className="p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4"><User className="h-4 w-4 text-brand" /><h2 className="font-semibold">Account</h2></div>
        <div className="space-y-4">
          <div><Label>Business name</Label><Input value={profile.business_name} onChange={(e) => setProfile({ ...profile, business_name: e.target.value })} /></div>
          <div><Label>Email</Label><Input value={profile.email} disabled /></div>
          <div><Label>Timezone</Label>
            <Select value={profile.timezone} onValueChange={(v) => setProfile({ ...profile, timezone: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TIMEZONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Button onClick={saveProfile} disabled={saving} className="brand-gradient text-brand-foreground">Save account</Button>

          <div className="pt-4 border-t">
            <Label>Change password</Label>
            <PasswordChanger onSubmit={changePassword} />
          </div>
        </div>
      </Card>

      {/* Billing */}
      <BillingCard plan={sub.plan} billingDate={sub.billing_date} />
    </div>
  );
}

function BillingCard({ plan, billingDate }: { plan: "free" | "pro" | "business"; billingDate: string | null }) {
  const [loading, setLoading] = useState(false);
  async function openPortal() {
    setLoading(true);
    try {
      const { createPortalSession } = await import("@/utils/payments.functions");
      const { getStripeEnvironment } = await import("@/lib/stripe");
      const res = await createPortalSession({
        data: { environment: getStripeEnvironment(), returnUrl: window.location.href },
      });
      if ("error" in res) throw new Error(res.error);
      window.open(res.url, "_blank");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not open billing portal");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Card className="p-6 shadow-soft">
      <div className="flex items-center gap-2 mb-4"><CreditCard className="h-4 w-4 text-brand" /><h2 className="font-semibold">Billing</h2></div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs text-muted-foreground">Current plan</p>
          <p className="text-2xl font-semibold capitalize mt-1">{plan} {plan === "free" && <span className="text-sm text-muted-foreground font-normal">(trial)</span>}</p>
          {billingDate && <p className="text-xs text-muted-foreground mt-1">Next bill: {new Date(billingDate).toLocaleDateString()}</p>}
        </div>
        {plan === "free" ? (
          <Link to="/pricing"><Button className="brand-gradient text-brand-foreground">Upgrade to Pro</Button></Link>
        ) : (
          <div className="flex gap-2">
            <Link to="/pricing"><Button variant="outline">Change plan</Button></Link>
            <Button onClick={openPortal} disabled={loading} className="brand-gradient text-brand-foreground">
              {loading ? "Opening..." : "Manage billing"}
            </Button>
          </div>
        )}
      </div>
      <div className="mt-6 pt-6 border-t">
        <p className="text-sm font-medium">Invoices</p>
        <p className="text-sm text-muted-foreground mt-2">
          {plan === "free" ? "No invoices yet — you're on the free plan." : "Click \"Manage billing\" to view and download invoices."}
        </p>
      </div>
    </Card>
  );
}

function PasswordChanger({ onSubmit }: { onSubmit: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  return (
    <div className="flex gap-2 mt-1.5">
      <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="New password" minLength={6} />
      <Button variant="outline" onClick={() => { if (pw.length >= 6) { onSubmit(pw); setPw(""); } else toast.error("Password must be 6+ chars"); }}>Update</Button>
    </div>
  );
}
