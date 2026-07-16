import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Phone,
  Bell,
  User,
  CreditCard,
  Sparkles,
  CalendarClock,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — LeadCatch" }] }),
  component: SettingsPage,
});

type Profile = {
  id: string;
  email: string;
  business_name: string;
  assigned_phone: string | null;
  forward_phone: string | null;
  retell_phone_id: string | null;
  timezone: string;
};
type Settings = {
  ai_greeting: string;
  callback_hours_start: string;
  callback_hours_end: string;
  notifications_email: boolean;
  notifications_sms: boolean;
  notifications_sms_phone: string | null;
  notifications_slack: boolean;
  timezone: string;
  bays_count: number;
};
type Subscription = {
  plan: "free" | "pro" | "business";
  billing_date: string | null;
};
type BusinessHour = Tables<"business_hours">;
type ServiceType = Tables<"service_types">;

const BUSINESS_TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Anchorage",
  "Pacific/Honolulu",
];
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const BAY_OPTIONS = Array.from({ length: 10 }, (_, index) => String(index + 1));

function SettingsPage() {
  const { user } = Route.useRouteContext();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [sub, setSub] = useState<Subscription | null>(null);
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [newService, setNewService] = useState({
    name: "",
    duration_minutes: "30",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const [
        { data: p },
        { data: s },
        { data: su },
        { data: bh },
        { data: st },
      ] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase
          .from("settings")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("subscriptions")
          .select("plan, billing_date")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("business_hours")
          .select("*")
          .eq("user_id", user.id)
          .order("day_of_week", { ascending: true }),
        supabase
          .from("service_types")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .order("name", { ascending: true }),
      ]);
      setProfile(p as Profile);
      setSettings(s as Settings);
      setSub(su as Subscription);
      setBusinessHours(
        ((bh ?? []) as BusinessHour[]).map((day) => ({
          ...day,
          open_time: day.open_time?.slice(0, 5) ?? null,
          close_time: day.close_time?.slice(0, 5) ?? null,
          break_start: day.break_start?.slice(0, 5) ?? null,
          break_end: day.break_end?.slice(0, 5) ?? null,
        })),
      );
      setServiceTypes((st ?? []) as ServiceType[]);
    })();
  }, [user.id]);

  async function saveProfile() {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        business_name: profile.business_name,
        forward_phone: profile.forward_phone,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile saved");
  }
  async function saveSettings() {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase
      .from("settings")
      .update(settings)
      .eq("user_id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Settings saved");
  }
  async function saveBusinessHour(day: BusinessHour) {
    setSaving(true);
    const { error } = await supabase
      .from("business_hours")
      .update({
        is_open: day.is_open,
        open_time: day.open_time,
        close_time: day.close_time,
        break_start: day.break_start,
        break_end: day.break_end,
      })
      .eq("user_id", user.id)
      .eq("day_of_week", day.day_of_week);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success(`${DAYS[day.day_of_week]} hours saved`);
  }
  async function refreshServiceTypes() {
    const { data } = await supabase
      .from("service_types")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("name", { ascending: true });
    setServiceTypes((data ?? []) as ServiceType[]);
  }
  async function saveServiceType(serviceType: ServiceType) {
    setSaving(true);
    const { error } = await supabase
      .from("service_types")
      .update({
        name: serviceType.name,
        duration_minutes: serviceType.duration_minutes,
      })
      .eq("id", serviceType.id)
      .eq("user_id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    await refreshServiceTypes();
    toast.success("Service saved");
  }
  async function deactivateServiceType(serviceType: ServiceType) {
    setSaving(true);
    const { error } = await supabase
      .from("service_types")
      .update({ is_active: false })
      .eq("id", serviceType.id)
      .eq("user_id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    setServiceTypes((current) =>
      current.filter((item) => item.id !== serviceType.id),
    );
    toast.success("Service deleted");
  }
  async function addServiceType() {
    const name = newService.name.trim();
    const duration_minutes = Number(newService.duration_minutes);
    if (!name) return toast.error("Service name is required");
    if (!Number.isFinite(duration_minutes) || duration_minutes <= 0)
      return toast.error("Duration must be greater than 0");
    setSaving(true);
    const { error } = await supabase
      .from("service_types")
      .insert({ user_id: user.id, name, duration_minutes, is_active: true });
    setSaving(false);
    if (error) return toast.error(error.message);
    await refreshServiceTypes();
    setNewService({ name: "", duration_minutes: "30" });
    toast.success("Service added");
  }
  async function changePassword(pw: string) {
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) toast.error(error.message);
    else toast.success("Password updated");
  }

  if (!profile || !settings || !sub)
    return <div className="p-8 text-sm text-muted-foreground">Loading...</div>;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your phone, notifications, and account.
        </p>
      </div>

      {/* Phone */}
      <Card className="p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="h-4 w-4 text-brand" />
          <h2 className="font-semibold">Phone settings</h2>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl bg-muted/40 border p-4">
            <p className="text-xs text-muted-foreground">
              Your LeadCatch AI number
            </p>
            {profile.assigned_phone ? (
              <p className="text-xl font-semibold font-mono mt-1">
                {profile.assigned_phone}
              </p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mt-1">
                  Your LeadCatch number will be assigned during setup
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Complete setup in <Link to="/onboarding" className="text-brand hover:underline">onboarding</Link> to get your number.
                </p>
              </>
            )}
          </div>
          <div>
            <Label>Your business phone</Label>
            <Input
              value={profile.forward_phone || ""}
              onChange={(e) =>
                setProfile({ ...profile, forward_phone: e.target.value })
              }
              placeholder="+1 555 000 1234"
            />
          </div>
          <div>
            <Label>AI greeting</Label>
            <Textarea
              className="min-h-28"
              value={settings.ai_greeting}
              onChange={(e) =>
                setSettings({ ...settings, ai_greeting: e.target.value })
              }
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() =>
                toast.info(
                  "Test call coming soon — we'll dial you in a moment.",
                )
              }
            >
              <Sparkles className="h-4 w-4" /> Test AI call
            </Button>
            <Button
              onClick={() => {
                saveProfile();
                saveSettings();
              }}
              disabled={saving}
              className="brand-gradient text-brand-foreground"
            >
              Save
            </Button>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-4 w-4 text-brand" />
          <h2 className="font-semibold">Notifications</h2>
        </div>
        <div className="space-y-4">
          {[
            {
              key: "notifications_email" as const,
              label: "Email when a new lead arrives",
              desc: "Sent to your account email.",
            },
            {
              key: "notifications_sms" as const,
              label: "SMS notifications",
              desc: "Texted to the number below.",
            },
            {
              key: "notifications_slack" as const,
              label: "Slack integration",
              desc: "Connect a channel to get pings.",
            },
          ].map((opt) => (
            <div
              key={opt.key}
              className="flex items-center justify-between gap-4 py-2"
            >
              <div>
                <Label className="cursor-pointer">{opt.label}</Label>
                <p className="text-xs text-muted-foreground">{opt.desc}</p>
              </div>
              <Switch
                checked={settings[opt.key]}
                onCheckedChange={(v) =>
                  setSettings({ ...settings, [opt.key]: v })
                }
              />
            </div>
          ))}
          {settings.notifications_sms && (
            <div>
              <Label>SMS phone</Label>
              <Input
                value={settings.notifications_sms_phone || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications_sms_phone: e.target.value,
                  })
                }
                placeholder="+1 555 000 1234"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Callback hours start</Label>
              <Input
                type="time"
                value={settings.callback_hours_start}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    callback_hours_start: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Callback hours end</Label>
              <Input
                type="time"
                value={settings.callback_hours_end}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    callback_hours_end: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <Button
            onClick={saveSettings}
            disabled={saving}
            className="brand-gradient text-brand-foreground"
          >
            Save preferences
          </Button>
        </div>
      </Card>

      {/* Scheduling */}
      <Card className="p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <CalendarClock className="h-4 w-4 text-brand" />
          <h2 className="font-semibold">Scheduling</h2>
        </div>
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Business hours</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Set availability for each day. Changes save per day.
              </p>
            </div>
            <div className="space-y-3">
              {businessHours.map((day) => (
                <div
                  key={day.day_of_week}
                  className="rounded-xl border p-4 space-y-4"
                >
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-medium">{DAYS[day.day_of_week]}</p>
                      <p className="text-xs text-muted-foreground">
                        {day.is_open
                          ? "Open for appointments"
                          : "Closed all day"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Label htmlFor={`business-hours-${day.day_of_week}`}>
                        Open
                      </Label>
                      <Switch
                        id={`business-hours-${day.day_of_week}`}
                        checked={day.is_open}
                        onCheckedChange={(value) =>
                          setBusinessHours((current) =>
                            current.map((item) =>
                              item.day_of_week === day.day_of_week
                                ? { ...item, is_open: value }
                                : item,
                            ),
                          )
                        }
                      />
                    </div>
                  </div>
                  {day.is_open && (
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <div>
                        <Label>Open time</Label>
                        <Input
                          type="time"
                          value={day.open_time ?? ""}
                          onChange={(e) =>
                            setBusinessHours((current) =>
                              current.map((item) =>
                                item.day_of_week === day.day_of_week
                                  ? {
                                      ...item,
                                      open_time: e.target.value || null,
                                    }
                                  : item,
                              ),
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label>Close time</Label>
                        <Input
                          type="time"
                          value={day.close_time ?? ""}
                          onChange={(e) =>
                            setBusinessHours((current) =>
                              current.map((item) =>
                                item.day_of_week === day.day_of_week
                                  ? {
                                      ...item,
                                      close_time: e.target.value || null,
                                    }
                                  : item,
                              ),
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label>Break start</Label>
                        <Input
                          type="time"
                          value={day.break_start || ""}
                          onChange={(e) =>
                            setBusinessHours((current) =>
                              current.map((item) =>
                                item.day_of_week === day.day_of_week
                                  ? {
                                      ...item,
                                      break_start: e.target.value || null,
                                    }
                                  : item,
                              ),
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label>Break end</Label>
                        <Input
                          type="time"
                          value={day.break_end || ""}
                          onChange={(e) =>
                            setBusinessHours((current) =>
                              current.map((item) =>
                                item.day_of_week === day.day_of_week
                                  ? {
                                      ...item,
                                      break_end: e.target.value || null,
                                    }
                                  : item,
                              ),
                            )
                          }
                        />
                      </div>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => saveBusinessHour(day)}
                    disabled={saving}
                  >
                    Save {DAYS[day.day_of_week]}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <div>
              <h3 className="text-sm font-medium">Bays and timezone</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Control booking capacity and local scheduling time.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Service bays (simultaneous appointments)</Label>
                <Select
                  value={String(settings.bays_count)}
                  onValueChange={(value) =>
                    setSettings({ ...settings, bays_count: Number(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BAY_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Timezone</Label>
                <Select
                  value={settings.timezone || "America/Chicago"}
                  onValueChange={(value) =>
                    setSettings({ ...settings, timezone: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_TIMEZONES.map((timezone) => (
                      <SelectItem key={timezone} value={timezone}>
                        {timezone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={saveSettings}
              disabled={saving}
              className="brand-gradient text-brand-foreground"
            >
              Save scheduling settings
            </Button>
          </div>

          <div className="space-y-4 border-t pt-6">
            <div>
              <h3 className="text-sm font-medium">Service types</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Manage active appointment types and durations.
              </p>
            </div>
            <div className="rounded-xl border overflow-hidden">
              <div className="grid grid-cols-[minmax(0,1fr)_140px_110px] gap-3 border-b bg-muted/40 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <div>Name</div>
                <div>Duration</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                {serviceTypes.map((serviceType) => (
                  <div
                    key={serviceType.id}
                    className="grid grid-cols-[minmax(0,1fr)_140px_110px] gap-3 px-4 py-3 items-center"
                  >
                    <Input
                      value={serviceType.name}
                      onChange={(e) =>
                        setServiceTypes((current) =>
                          current.map((item) =>
                            item.id === serviceType.id
                              ? { ...item, name: e.target.value }
                              : item,
                          ),
                        )
                      }
                    />
                    <Input
                      type="number"
                      min="1"
                      value={String(serviceType.duration_minutes)}
                      onChange={(e) =>
                        setServiceTypes((current) =>
                          current.map((item) =>
                            item.id === serviceType.id
                              ? {
                                  ...item,
                                  duration_minutes: Number(e.target.value) || 0,
                                }
                              : item,
                          ),
                        )
                      }
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => saveServiceType(serviceType)}
                        disabled={saving}
                      >
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deactivateServiceType(serviceType)}
                        disabled={saving}
                        aria-label={`Delete ${serviceType.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-[minmax(0,1fr)_140px_110px] gap-3 px-4 py-3 items-center bg-muted/20">
                  <Input
                    value={newService.name}
                    onChange={(e) =>
                      setNewService({ ...newService, name: e.target.value })
                    }
                    placeholder="Add a service"
                  />
                  <Input
                    type="number"
                    min="1"
                    value={newService.duration_minutes}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        duration_minutes: e.target.value,
                      })
                    }
                    placeholder="Minutes"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={addServiceType}
                      disabled={saving}
                      className="brand-gradient text-brand-foreground"
                    >
                      Add service
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Account */}
      <Card className="p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-4 w-4 text-brand" />
          <h2 className="font-semibold">Account</h2>
        </div>
        <div className="space-y-4">
          <div>
            <Label>Business name</Label>
            <Input
              value={profile.business_name}
              onChange={(e) =>
                setProfile({ ...profile, business_name: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={profile.email} disabled />
          </div>
          <Button
            onClick={saveProfile}
            disabled={saving}
            className="brand-gradient text-brand-foreground"
          >
            Save account
          </Button>

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

function BillingCard({
  plan,
  billingDate,
}: {
  plan: "free" | "pro" | "business";
  billingDate: string | null;
}) {
  const [loading, setLoading] = useState(false);
  async function openPortal() {
    setLoading(true);
    try {
      const { createPortalSession } =
        await import("@/utils/payments.functions");
      const { getStripeEnvironment } = await import("@/lib/stripe");
      const res = await createPortalSession({
        data: {
          environment: getStripeEnvironment(),
          returnUrl: window.location.href,
        },
      });
      if ("error" in res) throw new Error(res.error);
      window.open(res.url, "_blank");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not open billing portal",
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <Card className="p-6 shadow-soft">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="h-4 w-4 text-brand" />
        <h2 className="font-semibold">Billing</h2>
      </div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs text-muted-foreground">Current plan</p>
          <p className="text-2xl font-semibold capitalize mt-1">
            {plan}{" "}
            {plan === "free" && (
              <span className="text-sm text-muted-foreground font-normal">
                (trial)
              </span>
            )}
          </p>
          {billingDate && (
            <p className="text-xs text-muted-foreground mt-1">
              Next bill: {new Date(billingDate).toLocaleDateString()}
            </p>
          )}
        </div>
        {plan === "free" ? (
          <Link to="/pricing">
            <Button className="brand-gradient text-brand-foreground">
              Upgrade to Pro
            </Button>
          </Link>
        ) : (
          <div className="flex gap-2">
            <Link to="/pricing">
              <Button variant="outline">Change plan</Button>
            </Link>
            <Button
              onClick={openPortal}
              disabled={loading}
              className="brand-gradient text-brand-foreground"
            >
              {loading ? "Opening..." : "Manage billing"}
            </Button>
          </div>
        )}
      </div>
      <div className="mt-6 pt-6 border-t">
        <p className="text-sm font-medium">Invoices</p>
        <p className="text-sm text-muted-foreground mt-2">
          {plan === "free"
            ? "No invoices yet — you're on the free plan."
            : 'Click "Manage billing" to view and download invoices.'}
        </p>
      </div>
    </Card>
  );
}

function PasswordChanger({ onSubmit }: { onSubmit: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  return (
    <div className="flex gap-2 mt-1.5">
      <Input
        type="password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        placeholder="New password"
        minLength={6}
      />
      <Button
        variant="outline"
        onClick={() => {
          if (pw.length >= 6) {
            onSubmit(pw);
            setPw("");
          } else toast.error("Password must be 6+ chars");
        }}
      >
        Update
      </Button>
    </div>
  );
}
