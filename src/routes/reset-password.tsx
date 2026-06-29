import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — LeadCatch" }] }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated.");
    navigate({ to: "/dashboard" });
  }
  return (
    <div className="min-h-screen flex flex-col hero-bg">
      <div className="p-6"><Link to="/"><Logo /></Link></div>
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <Card className="w-full max-w-md p-8 shadow-lift">
          <h1 className="text-2xl font-bold text-center">Set a new password</h1>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div><Label>New password</Label><Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            <Button type="submit" disabled={loading} className="w-full brand-gradient text-brand-foreground">{loading ? "Updating..." : "Update password"}</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
