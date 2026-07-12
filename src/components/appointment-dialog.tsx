import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database, Tables } from "@/integrations/supabase/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Appointment = Tables<"appointments">;
type ServiceType = Tables<"service_types">;
type AppointmentStatus = Database["public"]["Enums"]["appointment_status"];

type AppointmentDialogProps = {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  appointment?: Appointment | null;
  onSaved?: () => void;
};

type FormState = {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  vehicle_year: string;
  vehicle_make: string;
  vehicle_model: string;
  service_type_id: string;
  service_name: string;
  date: string;
  start_time: string;
  duration_minutes: string;
  notes: string;
  status: AppointmentStatus;
};

const STATUS_OPTIONS: AppointmentStatus[] = [
  "new",
  "confirmed",
  "checked_in",
  "in_service",
  "completed",
  "cancelled",
  "no_show",
];

function dateToInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isoToDateInput(iso: string) {
  return dateToInputValue(new Date(iso));
}

function isoToTimeInput(iso: string) {
  const date = new Date(iso);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function combineDateAndTime(dateString: string, timeString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  const [hours, minutes] = timeString.split(":").map(Number);
  return new Date(year, (month || 1) - 1, day || 1, hours || 0, minutes || 0, 0, 0);
}

function defaultFormFromDate(date: Date): FormState {
  return {
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    vehicle_year: "",
    vehicle_make: "",
    vehicle_model: "",
    service_type_id: "",
    service_name: "",
    date: dateToInputValue(date),
    start_time: "09:00",
    duration_minutes: "30",
    notes: "",
    status: "new",
  };
}

export function AppointmentDialog({
  userId,
  open,
  onOpenChange,
  selectedDate,
  appointment,
  onSaved,
}: AppointmentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [baysCount, setBaysCount] = useState<number>(1);
  const [form, setForm] = useState<FormState>(defaultFormFromDate(selectedDate));

  const isEditMode = !!appointment;

  useEffect(() => {
    if (!open) return;
    setServicesLoading(true);
    Promise.all([
      supabase
        .from("service_types")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("name", { ascending: true }),
      supabase.from("settings").select("bays_count").eq("user_id", userId).maybeSingle(),
    ]).then(([servicesResult, settingsResult]) => {
      setServicesLoading(false);
      setServiceTypes((servicesResult.data ?? []) as ServiceType[]);
      setBaysCount(settingsResult.data?.bays_count ?? 1);
    });
  }, [open, userId]);

  useEffect(() => {
    if (!open) return;

    if (!appointment) {
      setForm((current) => ({
        ...defaultFormFromDate(selectedDate),
        service_type_id:
          current.service_type_id && serviceTypes.some((s) => s.id === current.service_type_id)
            ? current.service_type_id
            : "",
      }));
      return;
    }

    const duration = Math.max(
      5,
      Math.round(
        (new Date(appointment.ends_at).getTime() - new Date(appointment.starts_at).getTime()) /
          60000,
      ),
    );

    setForm({
      customer_name: appointment.customer_name,
      customer_phone: appointment.customer_phone,
      customer_email: appointment.customer_email ?? "",
      vehicle_year: appointment.vehicle_year ?? "",
      vehicle_make: appointment.vehicle_make ?? "",
      vehicle_model: appointment.vehicle_model ?? "",
      service_type_id: appointment.service_type_id ?? "",
      service_name: appointment.service_name,
      date: isoToDateInput(appointment.starts_at),
      start_time: isoToTimeInput(appointment.starts_at),
      duration_minutes: String(duration),
      notes: appointment.notes ?? "",
      status: appointment.status,
    });
  }, [open, appointment, selectedDate, serviceTypes]);

  const selectedService = useMemo(
    () => serviceTypes.find((service) => service.id === form.service_type_id) ?? null,
    [form.service_type_id, serviceTypes],
  );

  async function findAvailableBay(startsAtIso: string, endsAtIso: string) {
    const overlapQuery = supabase
      .from("appointments")
      .select("id, bay, status")
      .eq("user_id", userId)
      .neq("status", "cancelled")
      .lt("starts_at", endsAtIso)
      .gt("ends_at", startsAtIso);

    if (appointment?.id) {
      overlapQuery.neq("id", appointment.id);
    }

    const { data, error } = await overlapQuery;
    if (error) throw error;

    const usedBays = new Set((data ?? []).map((item) => item.bay));
    if (appointment?.bay && !usedBays.has(appointment.bay)) {
      return appointment.bay;
    }

    for (let bay = 1; bay <= baysCount; bay += 1) {
      if (!usedBays.has(bay)) return bay;
    }

    return null;
  }

  async function submit() {
    if (!form.customer_name.trim()) return toast.error("Customer name is required.");
    if (!form.customer_phone.trim()) return toast.error("Phone is required.");
    if (!form.date) return toast.error("Date is required.");
    if (!form.start_time) return toast.error("Start time is required.");

    const duration = Number(form.duration_minutes);
    if (!Number.isFinite(duration) || duration <= 0) {
      return toast.error("Duration must be a positive number of minutes.");
    }

    const startsAt = combineDateAndTime(form.date, form.start_time);
    const endsAt = new Date(startsAt.getTime() + duration * 60 * 1000);

    const startsAtIso = startsAt.toISOString();
    const endsAtIso = endsAt.toISOString();

    const chosenService =
      serviceTypes.find((service) => service.id === form.service_type_id) ??
      (appointment
        ? ({
            id: "",
            name: appointment.service_name,
            duration_minutes: duration,
            is_active: true,
            created_at: "",
            updated_at: "",
            user_id: userId,
          } as ServiceType)
        : null);

    if (!chosenService) {
      return toast.error("Select a service type.");
    }

    setLoading(true);
    try {
      const bay = await findAvailableBay(startsAtIso, endsAtIso);
      if (!bay) {
        setLoading(false);
        return toast.error("That slot is full. Pick another time.");
      }

      if (appointment) {
        const { error } = await supabase
          .from("appointments")
          .update({
            customer_name: form.customer_name.trim(),
            customer_phone: form.customer_phone.trim(),
            customer_email: form.customer_email.trim() || null,
            vehicle_year: form.vehicle_year.trim() || null,
            vehicle_make: form.vehicle_make.trim() || null,
            vehicle_model: form.vehicle_model.trim() || null,
            service_type_id: chosenService.id || null,
            service_name: chosenService.name,
            starts_at: startsAtIso,
            ends_at: endsAtIso,
            bay,
            notes: form.notes.trim() || null,
            status: form.status,
          })
          .eq("id", appointment.id);

        if (error) {
          setLoading(false);
          if (error.code === "23P01") {
            return toast.error("That slot was just taken, pick another time.");
          }
          return toast.error(error.message);
        }

        setLoading(false);
        toast.success("Appointment updated");
      } else {
        const { error } = await supabase.from("appointments").insert({
          user_id: userId,
          customer_name: form.customer_name.trim(),
          customer_phone: form.customer_phone.trim(),
          customer_email: form.customer_email.trim() || null,
          vehicle_year: form.vehicle_year.trim() || null,
          vehicle_make: form.vehicle_make.trim() || null,
          vehicle_model: form.vehicle_model.trim() || null,
          service_type_id: chosenService.id || null,
          service_name: chosenService.name,
          starts_at: startsAtIso,
          ends_at: endsAtIso,
          bay,
          notes: form.notes.trim() || null,
          created_source: "manual",
          status: "new",
        });

        if (error) {
          setLoading(false);
          if (error.code === "23P01") {
            return toast.error("That slot was just taken, pick another time.");
          }
          return toast.error(error.message);
        }

        setLoading(false);
        toast.success("Appointment created");
      }

      onSaved?.();
      onOpenChange(false);
    } catch (error) {
      setLoading(false);
      const message = error instanceof Error ? error.message : "Unable to save appointment.";
      toast.error(message);
    }
  }

  async function cancelAppointment() {
    if (!appointment) return;
    setLoading(true);
    const { error } = await supabase
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("id", appointment.id);
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Appointment cancelled");
    onSaved?.();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit appointment" : "New appointment"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update details, status, and schedule."
              : "Create a new scheduled appointment."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Customer name</Label>
              <Input
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={form.customer_phone}
                onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                placeholder="+1 555 123 4567"
              />
            </div>
          </div>

          <div>
            <Label>Email</Label>
            <Input
              value={form.customer_email}
              onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
              placeholder="jane@example.com"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Vehicle year</Label>
              <Input
                value={form.vehicle_year}
                onChange={(e) => setForm({ ...form, vehicle_year: e.target.value })}
                placeholder="2022"
              />
            </div>
            <div>
              <Label>Vehicle make</Label>
              <Input
                value={form.vehicle_make}
                onChange={(e) => setForm({ ...form, vehicle_make: e.target.value })}
                placeholder="Toyota"
              />
            </div>
            <div>
              <Label>Vehicle model</Label>
              <Input
                value={form.vehicle_model}
                onChange={(e) => setForm({ ...form, vehicle_model: e.target.value })}
                placeholder="Camry"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Service</Label>
              <Select
                value={form.service_type_id}
                onValueChange={(value) => {
                  const service = serviceTypes.find((item) => item.id === value);
                  setForm({
                    ...form,
                    service_type_id: value,
                    service_name: service?.name ?? form.service_name,
                    duration_minutes: String(service?.duration_minutes ?? form.duration_minutes),
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={servicesLoading ? "Loading..." : "Select a service"} />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} ({service.duration_minutes} min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                min="5"
                value={form.duration_minutes}
                onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <Label>Start time</Label>
              <Input
                type="time"
                value={form.start_time}
                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              />
            </div>
          </div>

          {isEditMode && (
            <div>
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) => setForm({ ...form, status: value as AppointmentStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Notes</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Optional notes"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            {selectedService
              ? `Using ${selectedService.name} default of ${selectedService.duration_minutes} minutes.`
              : "Select a service to prefill duration."}
          </p>
        </div>

        <DialogFooter className="gap-2">
          {isEditMode && (
            <Button variant="outline" onClick={cancelAppointment} disabled={loading}>
              Mark cancelled
            </Button>
          )}
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={submit} disabled={loading} className="brand-gradient text-brand-foreground">
            {loading ? "Saving..." : isEditMode ? "Save changes" : "Create appointment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
