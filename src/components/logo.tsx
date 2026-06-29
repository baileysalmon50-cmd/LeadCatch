import { PhoneIncoming } from "lucide-react";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? "h-7 w-7" : size === "lg" ? "h-10 w-10" : "h-8 w-8";
  const text = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";
  return (
    <div className="flex items-center gap-2">
      <div className={`${dim} brand-gradient rounded-lg flex items-center justify-center shadow-soft`}>
        <PhoneIncoming className="h-4 w-4 text-brand-foreground" strokeWidth={2.5} />
      </div>
      <span className={`${text} font-semibold tracking-tight`}>LeadCatch</span>
    </div>
  );
}
