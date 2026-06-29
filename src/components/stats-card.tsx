import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatsCard({
  label, value, hint, icon: Icon, accent,
}: { label: string; value: string | number; hint?: string; icon: LucideIcon; accent?: boolean }) {
  return (
    <Card className="p-5 shadow-soft hover:shadow-lift transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={cn(
          "h-10 w-10 rounded-lg flex items-center justify-center",
          accent ? "brand-gradient text-brand-foreground" : "bg-muted text-muted-foreground"
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
