import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LogOut, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function Topbar({ businessName }: { businessName?: string }) {
  const navigate = useNavigate();
  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  }
  return (
    <header className="h-16 border-b bg-surface/80 backdrop-blur flex items-center justify-between px-6">
      <div>
        <p className="text-xs text-muted-foreground">Workspace</p>
        <p className="text-sm font-medium">{businessName || "Your business"}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/settings" })}>
          <CreditCard className="h-4 w-4" /> Billing
        </Button>
        <Button variant="outline" size="sm" onClick={signOut}>
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>
    </header>
  );
}
