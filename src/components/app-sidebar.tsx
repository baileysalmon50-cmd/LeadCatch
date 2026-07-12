import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  CalendarDays,
  Settings as SettingsIcon,
} from "lucide-react";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/leads",     label: "Leads",     icon: Users },
  { to: "/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings",  label: "Settings",  icon: SettingsIcon },
];

export function AppSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-surface">
      <div className="h-16 flex items-center px-5 border-b">
        <Logo />
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map((it) => {
          const active = path.startsWith(it.to);
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <div className="rounded-lg bg-muted p-3 text-xs">
          <p className="font-medium text-foreground">Need help?</p>
          <p className="mt-1 text-muted-foreground">Check our quick-start guide for connecting your phone.</p>
        </div>
      </div>
    </aside>
  );
}
