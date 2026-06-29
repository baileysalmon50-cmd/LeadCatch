import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/checkout/return")({
  head: () => ({ meta: [{ title: "Payment complete — LeadCatch" }] }),
  validateSearch: (search: Record<string, unknown>): { session_id?: string } => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  component: CheckoutReturn,
});

function CheckoutReturn() {
  const { session_id } = Route.useSearch();
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 text-center space-y-4">
        <CheckCircle2 className="h-12 w-12 text-brand mx-auto" />
        <h1 className="text-2xl font-bold">Payment complete</h1>
        <p className="text-sm text-muted-foreground">
          {session_id
            ? "Your subscription is active. We've updated your plan — head to your dashboard to continue."
            : "If you completed checkout, your plan will update within a minute."}
        </p>
        <Link to="/dashboard"><Button className="brand-gradient text-brand-foreground w-full">Go to dashboard</Button></Link>
      </Card>
    </div>
  );
}
