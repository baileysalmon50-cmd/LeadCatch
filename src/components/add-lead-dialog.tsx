import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AddLeadDialog({ userId, disabled, disabledLabel }: { userId: string; disabled?: boolean; disabledLabel?: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", business_need: "", callback_time: "" });

  async function submit() {
    setLoading(true);
    const { error } = await supabase.from("leads").insert({
      user_id: userId,
      name: form.name || "Unknown caller",
      phone: form.phone || null,
      email: form.email || null,
      business_need: form.business_need || null,
      callback_time: form.callback_time || null,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Lead captured!", { description: "It just appeared in your dashboard." });
    setOpen(false);
    setForm({ name: "", phone: "", email: "", business_need: "", callback_time: "" });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} className="brand-gradient text-brand-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> {disabled ? (disabledLabel || "Call Limit Reached") : "Simulate lead"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a test lead</DialogTitle>
          <DialogDescription>This simulates a lead arriving from a missed call. Real calls land here via webhook.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Smith" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 555 123 4567" /></div>
            <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@example.com" /></div>
          </div>
          <div><Label>Business need</Label><Textarea value={form.business_need} onChange={(e) => setForm({ ...form, business_need: e.target.value })} placeholder="Looking for a quote on a kitchen remodel..." /></div>
          <div><Label>Best callback time</Label><Input value={form.callback_time} onChange={(e) => setForm({ ...form, callback_time: e.target.value })} placeholder="Tomorrow afternoon" /></div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={loading} className="brand-gradient text-brand-foreground">{loading ? "Saving..." : "Capture lead"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
