import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const searchSchema = z.object({ mode: z.enum(["signin", "signup"]).optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Sign in — LeadCatch" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">(search.mode || "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (forgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/reset-password" });
        if (error) throw error;
        toast.success("Check your email for the reset link.");
        setForgot(false);
        return;
      }
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { business_name: businessName },
          },
        });
        if (error) throw error;
        toast.success("Account created! Welcome aboard.");
        navigate({ to: "/onboarding" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex flex-col hero-bg">
      <div className="p-6"><Link to="/"><Logo /></Link></div>
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <Card className="w-full max-w-md p-8 shadow-lift">
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              {forgot ? "Reset your password" : mode === "signup" ? "Start your free trial" : "Welcome back"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {forgot ? "We'll email you a reset link." : mode === "signup" ? "10 free calls. No credit card." : "Sign in to your dashboard."}
            </p>
          </div>
          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && !forgot && (
              <div><Label>Business name</Label><Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} required placeholder="Acme Plumbing" /></div>
            )}
            <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@business.com" /></div>
            {!forgot && (
              <div>
                <div className="flex justify-between"><Label>Password</Label>
                  {mode === "signin" && <button type="button" onClick={() => setForgot(true)} className="text-xs text-brand hover:underline">Forgot?</button>}
                </div>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              </div>
            )}
            <Button type="submit" disabled={loading} className="w-full brand-gradient text-brand-foreground hover:opacity-90">
              {loading ? "Working..." : forgot ? "Send reset link" : mode === "signup" ? "Create account" : "Sign in"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {forgot ? (
              <button onClick={() => setForgot(false)} className="text-brand hover:underline">Back to sign in</button>
            ) : mode === "signup" ? (
              <>Already have an account? <button onClick={() => setMode("signin")} className="text-brand hover:underline">Sign in</button></>
            ) : (
              <>New here? <button onClick={() => setMode("signup")} className="text-brand hover:underline">Start free trial</button></>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
