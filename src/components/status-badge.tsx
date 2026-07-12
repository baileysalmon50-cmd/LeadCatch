import { cn } from "@/lib/utils";

type Status =
  | "new"
  | "called"
  | "converted"
  | "sold"
  | "confirmed"
  | "checked_in"
  | "in_service"
  | "completed"
  | "cancelled"
  | "no_show";

const map: Record<Status, { label: string; dot: string; bg: string; text: string }> = {
  new: { label: "New", dot: "bg-destructive pulse-dot", bg: "bg-destructive/10", text: "text-destructive" },
  called: { label: "Called", dot: "bg-warning", bg: "bg-warning/15", text: "text-warning-foreground" },
  converted: { label: "Converted", dot: "bg-success", bg: "bg-success/15", text: "text-success-foreground" },
  sold: { label: "Sold", dot: "bg-blue-600", bg: "bg-blue-100", text: "text-blue-700" },
  confirmed: { label: "Confirmed", dot: "bg-sky-600", bg: "bg-sky-100", text: "text-sky-700" },
  checked_in: { label: "Checked In", dot: "bg-indigo-600", bg: "bg-indigo-100", text: "text-indigo-700" },
  in_service: { label: "In Service", dot: "bg-violet-600", bg: "bg-violet-100", text: "text-violet-700" },
  completed: { label: "Completed", dot: "bg-success", bg: "bg-success/15", text: "text-success-foreground" },
  cancelled: { label: "Cancelled", dot: "bg-muted-foreground", bg: "bg-muted", text: "text-muted-foreground" },
  no_show: { label: "No Show", dot: "bg-amber-600", bg: "bg-amber-100", text: "text-amber-700" },
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const s = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        s.bg,
        s.text,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}
