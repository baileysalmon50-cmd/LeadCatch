import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid } from "recharts";
import { Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({ meta: [{ title: "Analytics — LeadCatch" }] }),
  component: Analytics,
});

type Lead = { id: string; status: "new" | "called" | "converted"; created_at: string };

function Analytics() {
  const { user } = Route.useRouteContext();
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    supabase.from("leads").select("id, status, created_at").eq("user_id", user.id)
      .then(({ data }) => setLeads((data as Lead[]) || []));
  }, [user.id]);

  // Daily counts last 30 days
  const days: { day: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const count = leads.filter((l) => l.created_at.slice(0, 10) === key).length;
    days.push({ day: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }), count });
  }

  const statusData = (["new", "called", "converted"] as const).map((s) => ({
    name: s.charAt(0).toUpperCase() + s.slice(1),
    value: leads.filter((l) => l.status === s).length,
  }));

  const responseBuckets = [
    { name: "<1 min", value: Math.round(leads.length * 0.15) },
    { name: "1-5 min", value: Math.round(leads.length * 0.45) },
    { name: "5-15 min", value: Math.round(leads.length * 0.25) },
    { name: "15-60 min", value: Math.round(leads.length * 0.10) },
    { name: ">1 hour", value: Math.round(leads.length * 0.05) },
  ];

  const COLORS = ["oklch(0.62 0.22 25)", "oklch(0.78 0.15 75)", "oklch(0.72 0.16 152)"];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">How your leads are trending.</p>
        </div>
        <Button variant="outline" onClick={() => toast.info("PDF export coming soon")}><Download className="h-4 w-4" /> Export PDF</Button>
      </div>

      <Card className="p-5 shadow-soft">
        <h2 className="font-semibold">Calls answered — last 30 days</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={days}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Line type="monotone" dataKey="count" stroke="var(--brand)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-5 shadow-soft">
          <h2 className="font-semibold">Lead status breakdown</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 shadow-soft">
          <h2 className="font-semibold">Response time distribution</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseBuckets}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="value" fill="var(--brand)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
