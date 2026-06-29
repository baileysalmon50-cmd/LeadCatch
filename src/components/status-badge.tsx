import { cn } from "@/lib/utils";

type Status = "new" | "called" | "converted" | "sold";

const map: Record<Status, { label: string; dot: string; bg: string; text: string }> = {
  new: { label: "New", dot: "bg-destructive pulse-dot", bg: "bg-destructive/10", text: "text-destructive" },
  called: { label: "Called", dot: "bg-warning", bg: "bg-warning/15", text: "text-warning-foreground" },
  converted: { label: "Converted", dot: "bg-success", bg: "bg-success/15", text: "text-success-foreground" },
  sold: { label: "Sold", dot: "bg-blue-600", bg: "bg-blue-100", text: "text-blue-700" },
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
