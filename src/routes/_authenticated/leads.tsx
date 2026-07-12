import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";
import { AddLeadDialog } from "@/components/add-lead-dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Search, Download, Inbox } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/leads")({
  head: () => ({ meta: [{ title: "Leads — LeadCatch" }] }),
  component: LeadsPage,
});

type Lead = {
  id: string; name: string; phone: string | null; email: string | null;
  business_need: string | null; callback_time: string | null;
  status: "new" | "called" | "converted"; created_at: string; updated_at: string; notes: string | null;
};

function canAddLead(plan: string, leadsThisPeriod: number) {
  if (plan === "free" && leadsThisPeriod >= 10) return false;
  if (plan === "pro" && leadsThisPeriod >= 100) return false;
  return true;
}

function LeadsPage() {
  const { user } = Route.useRouteContext();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [plan, setPlan] = useState<string>("free");
  const [periodStart, setPeriodStart] = useState<Date | null>(null);

  useEffect(() => {
    supabase.from("subscriptions").select("plan, call_period_start").eq("user_id", user.id).maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error("Failed to load subscription plan info", error);
          toast.warning("Plan information could not be loaded. Using fallback limits.");
        }
        if (data?.plan) setPlan(data.plan as string);
        const cps = data?.call_period_start;
        setPeriodStart(cps ? new Date(cps) : new Date(new Date().getFullYear(), new Date().getMonth(), 1));
      });
    supabase.from("leads").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setLeads((data as Lead[]) || []));
    const ch = supabase.channel("leads-page")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads", filter: `user_id=eq.${user.id}` }, (payload) => {
        if (payload.eventType === "INSERT") setLeads((p) => [payload.new as Lead, ...p]);
        else if (payload.eventType === "UPDATE") setLeads((p) => p.map((l) => l.id === (payload.new as Lead).id ? payload.new as Lead : l));
        else if (payload.eventType === "DELETE") setLeads((p) => p.filter((l) => l.id !== (payload.old as Lead).id));
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user.id]);

  const leadsThisPeriod = periodStart
    ? leads.filter((l) => new Date(l.created_at) >= periodStart).length
    : 0;
  const allowAdd = canAddLead(plan, leadsThisPeriod);

  const filtered = useMemo(() => leads.filter((l) => {
    const matchesQuery = !query || [l.name, l.phone, l.email, l.business_need].some((f) => f?.toLowerCase().includes(query.toLowerCase()));
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    return matchesQuery && matchesStatus;
  }), [leads, query, statusFilter]);

  async function updateStatus(id: string, status: Lead["status"]) {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Status updated");
  }
  async function updateNotes(id: string, notes: string) {
    const { error } = await supabase.from("leads").update({ notes }).eq("id", id);
    if (error) toast.error(error.message);
  }
  async function deleteLead(id: string) {
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Lead deleted");
    setSelected(null);
  }

  function exportCsv() {
    const rows = [["Name","Phone","Email","Need","Callback","Status","Date","Notes"]];
    filtered.forEach((l) => rows.push([l.name, l.phone||"", l.email||"", l.business_need||"", l.callback_time||"", l.status, new Date(l.created_at).toISOString(), l.notes||""]));
    const csv = rows.map((r) => r.map((c) => `"${(c as string).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `leadcatch-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-sm text-muted-foreground">{leads.length} total · {leads.filter((l) => l.status === "new").length} new</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCsv} disabled={filtered.length === 0}><Download className="h-4 w-4" /> Export</Button>
          <AddLeadDialog userId={user.id} disabled={!allowAdd} disabledLabel="Call Limit Reached" />
        </div>
      </div>

      <Card className="p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by name, phone, or need..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
       <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="called">Called</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      {filtered.length === 0 ? (
        <Card className="p-16 text-center">
          <Inbox className="h-10 w-10 mx-auto text-muted-foreground/50" />
          <p className="mt-3 font-medium">No leads to show</p>
          <p className="text-sm text-muted-foreground">{leads.length === 0 ? "Your captured leads will show up here." : "Try adjusting your filters."}</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((l) => (
            <Card key={l.id} className="p-5 hover:shadow-soft transition-shadow cursor-pointer" onClick={() => setSelected(l)}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold">{l.name}</h3>
                    <StatusBadge status={l.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{l.business_need || "No details captured."}</p>
                  <div className="mt-2 flex gap-4 text-xs text-muted-foreground flex-wrap">
                    {l.phone && <span className="font-mono">{l.phone}</span>}
                    {l.email && <span>{l.email}</span>}
                    <span>{new Date(l.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm flex items-end sm:items-center sm:justify-end" onClick={() => setSelected(null)}>
          <div className="w-full sm:max-w-md sm:h-full bg-surface shadow-lift sm:rounded-l-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{selected.name}</h2>
                  <p className="text-xs text-muted-foreground">Captured {new Date(selected.created_at).toLocaleString()}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>Close</Button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-muted-foreground">Phone</p><p className="font-mono">{selected.phone || "—"}</p></div>
                <div><p className="text-xs text-muted-foreground">Email</p><p>{selected.email || "—"}</p></div>
                <div className="col-span-2"><p className="text-xs text-muted-foreground">Callback time</p><p>{selected.callback_time || "—"}</p></div>
                <div className="col-span-2"><p className="text-xs text-muted-foreground">Need</p><p>{selected.business_need || "—"}</p></div>
              </div>
 <div>
                <p className="text-xs text-muted-foreground mb-1.5">Status</p>
                <Select value={selected.status} onValueChange={(v) => { updateStatus(selected.id, v as Lead["status"]); setSelected({ ...selected, status: v as Lead["status"] }); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">🔴 New</SelectItem>
                    <SelectItem value="called">🟡 Called</SelectItem>
                    <SelectItem value="converted">🟢 Converted</SelectItem>
                  </SelectContent>
                </Select>
              </div> 
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Notes</p>
                <Textarea defaultValue={selected.notes || ""} placeholder="Add your notes..." onBlur={(e) => updateNotes(selected.id, e.target.value)} className="min-h-32" />
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"><Trash2 className="h-4 w-4" /> Delete lead</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
                    <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteLead(selected.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
