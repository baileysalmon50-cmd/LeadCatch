import { createFileRoute, Outlet, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppSidebar } from "@/components/app-sidebar";
import { Topbar } from "@/components/topbar";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isOnboarding = pathname.endsWith("/onboarding");
  const [businessName, setBusinessName] = useState<string>("");
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.from("profiles").select("business_name, onboarded").eq("id", user.id).maybeSingle().then(({ data }) => {
      setBusinessName(data?.business_name || "");
      setOnboarded(!!data?.onboarded);
      if (data && !data.onboarded && !pathname.endsWith("/onboarding")) {
        navigate({ to: "/onboarding" });
      }
    });
  }, [user.id, navigate, pathname]);

  if (isOnboarding) return <Outlet />;
  if (onboarded === null) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Loading...</div>;
  }
  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar businessName={businessName} />
        <main className="flex-1 overflow-auto"><Outlet /></main>
      </div>
    </div>
  );
}
