import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PhoneOff, Users, Clock, TrendingUp, Inbox } from "lucide-react";
import { toast } from "sonner";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StatsCard } from "@/components/stats-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { AddLeadDialog } from "@/components/add-lead-dialog";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — LeadCatch" }] }),
  component: Dashboard,
});

type Lead = {
  id: string; name: string; phone: string | null; email: string | null;
  business_need: string | null; callback_time: string | null;
  status: "new" | "called" | "converted"; created_at: string; updated_at: string; notes: string | null;
};

function Dashboard() {
  const { user } = Route.useRouteContext();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingNotes, setUpdatingNotes] = useState(false);
  const [plan, setPlan] = useState<string>("free");

  useEffect(() => {
    supabase.from("subscriptions").select("plan").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => { if (data?.plan) setPlan(data.plan as string); });
  }, [user.id]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("leads")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (active) {
        setLeads((data as Lead[]) || []);
        setLoading(false);
      }
    })();

    const ch = supabase
      .channel(`leads-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads", filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setLeads((prev) => [payload.new as Lead, ...prev]);
            toast.success("New lead captured!", { description: (payload.new as Lead).name });
          } else if (payload.eventType === "UPDATE") {
            setLeads((prev) => prev.map((l) => (l.id === (payload.new as Lead).id ? (payload.new as Lead) : l)));
            setSelectedLead((cur) => (cur && cur.id === (payload.new as Lead).id ? (payload.new as Lead) : cur));
          } else if (payload.eventType === "DELETE") {
            setLeads((prev) => prev.filter((l) => l.id !== (payload.old as Lead).id));
          }
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(ch);
    };
  }, [user.id]);

  const thisMonth = leads.filter((l) => new Date(l.created_at).getMonth() === new Date().getMonth());
  const captured = thisMonth.length;
  const converted = thisMonth.filter((l) => l.status === "converted").length;
  const conversion = captured ? Math.round((converted / captured) * 100) : 0;

  async function updateLeadStatus(id: string, status: Lead["status"]) {
    setUpdatingStatus(true);
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    setUpdatingStatus(false);
    if (error) toast.error(error.message);
    else toast.success("Status updated");
  }

  async function updateLeadNotes(id: string, notes: string) {
    setUpdatingNotes(true);
    const { error } = await supabase.from("leads").update({ notes }).eq("id", id);
    setUpdatingNotes(false);
    if (error) toast.error(error.message);
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Real-time view of every lead your AI captures.</p>
        </div>
        <AddLeadDialog userId={user.id} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Missed calls this month" value={captured} icon={PhoneOff} />
        <StatsCard label="Leads captured" value={captured} hint="All converted to leads" icon={Users} accent />
        <StatsCard label="Avg. response time" value="3m 12s" hint="Last 30 days" icon={Clock} />
        <StatsCard label="Conversion rate" value={`${conversion}%`} hint={`${converted} of ${captured}`} icon={TrendingUp} />
      </div>

      {plan === "free" && (() => {
        const limit = 10;
        const remaining = Math.max(0, limit - captured);
        const reached = captured >= limit;
        const approaching = captured >= 8 && !reached;
        return (
          <Card className={`p-5 flex flex-wrap items-center justify-between gap-3 shadow-soft ${reached ? "border-destructive/40 bg-destructive/5" : approaching ? "border-amber-500/40 bg-amber-500/5" : ""}`}>
            <div>
              <h3 className="font-semibold">Free Plan Limit</h3>
              <p className="text-sm text-muted-foreground">
                You have {remaining} calls remaining this month ({captured}/{limit} used)
              </p>
            </div>
            {reached && (
              <Link to="/pricing"><Button className="brand-gradient text-brand-foreground">Upgrade Now</Button></Link>
            )}
            {approaching && (
              <Link to="/pricing"><Button variant="outline">Upgrade Soon</Button></Link>
            )}
          </Card>
        );
      })()}

      <Card className="shadow-soft">
        <div className="p-5 border-b flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Recent leads</h2>
            <p className="text-xs text-muted-foreground">Updates live as new calls come in.</p>
          </div>
          <Link to="/leads"><Button variant="outline" size="sm">View all</Button></Link>
        </div>
        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">Loading...</div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center">
            <Inbox className="h-10 w-10 mx-auto text-muted-foreground/50" />
            <p className="mt-3 font-medium">No leads yet</p>
            <p className="text-sm text-muted-foreground">When your AI captures a caller's info, it'll appear here in real time.</p>
            <p className="text-xs text-muted-foreground mt-3">Try the <strong>Simulate lead</strong> button above to see it in action.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Name</th>
                  <th className="text-left px-5 py-3 font-medium">Phone</th>
                  <th className="text-left px-5 py-3 font-medium">Need</th>
                  <th className="text-left px-5 py-3 font-medium">When</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 10).map((l) => (
                  <tr key={l.id} className="border-t hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => setSelectedLead(l)}>
                    <td className="px-5 py-3 font-medium">{l.name}</td>
                    <td className="px-5 py-3 text-muted-foreground font-mono text-xs">{l.phone || "—"}</td>
                    <td className="px-5 py-3 text-muted-foreground max-w-xs truncate">{l.business_need || "—"}</td>
                    <td className="px-5 py-3 text-muted-foreground text-xs">{new Date(l.created_at).toLocaleString()}</td>
                    <td className="px-5 py-3"><StatusBadge status={l.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedLead && (
            <>
              <DialogHeader className="flex flex-row items-start justify-between space-y-0 pr-8">
                <div className="flex-1">
                  <DialogTitle className="text-xl md:text-2xl">{selectedLead.name}</DialogTitle>
                  <p className="text-xs text-muted-foreground mt-1">Created {new Date(selectedLead.created_at).toLocaleString()}</p>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Phone</p>
                    <p className="text-sm font-mono mt-1">{selectedLead.phone || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Email</p>
                    <p className="text-sm mt-1 break-all">{selectedLead.email || "—"}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Business Need</p>
                  <p className="text-sm mt-1">{selectedLead.business_need || "—"}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Callback Time</p>
                  <p className="text-sm mt-1">{selectedLead.callback_time || "—"}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Status</p>
                  <Select value={selectedLead.status} onValueChange={(status) => updateLeadStatus(selectedLead.id, status as Lead["status"])}>
                    <SelectTrigger className="w-full" disabled={updatingStatus}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="called">Called</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Notes</p>
                  <Textarea
                    placeholder="Add notes about this lead..."
                    value={selectedLead.notes || ""}
                    onChange={(e) => {
                      setSelectedLead({ ...selectedLead, notes: e.target.value });
                      updateLeadNotes(selectedLead.id, e.target.value);
                    }}
                    disabled={updatingNotes}
                    className="min-h-24"
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Last Updated</p>
                  <p className="text-sm mt-1">{new Date(selectedLead.updated_at).toLocaleString()}</p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedLead(null)} className="w-full">Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
