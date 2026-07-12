import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { AppointmentDialog } from "@/components/appointment-dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Inbox,
  Plus,
  Wrench,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/appointments")({
  head: () => ({ meta: [{ title: "Appointments — LeadCatch" }] }),
  component: AppointmentsPage,
});

type Appointment = Tables<"appointments">;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

function endOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

function vehicleLabel(item: Appointment) {
  return [item.vehicle_year, item.vehicle_make, item.vehicle_model].filter(Boolean).join(" ");
}

function formatDay(date: Date) {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTimeRange(startsAt: string, endsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const format: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" };
  return `${start.toLocaleTimeString(undefined, format)} - ${end.toLocaleTimeString(undefined, format)}`;
}

function AppointmentsPage() {
  const { user } = Route.useRouteContext() as { user: { id: string } };
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);

  function refetchDay(date: Date = selectedDate) {
    const dayStart = startOfDay(date).toISOString();
    const dayEnd = endOfDay(date).toISOString();

    return supabase
      .from("appointments")
      .select("*")
      .eq("user_id", user.id)
      .gte("starts_at", dayStart)
      .lte("starts_at", dayEnd)
      .order("starts_at", { ascending: true })
      .then(({ data }) => setAppointments((data as Appointment[]) || []));
  }

  useEffect(() => {
    const dayStart = startOfDay(selectedDate).toISOString();
    refetchDay(selectedDate);

    const channel = supabase
      .channel(`appointments-${user.id}-${dayStart}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          refetchDay(selectedDate);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user.id, selectedDate]);

  const selectedLabel = useMemo(() => formatDay(selectedDate), [selectedDate]);

  function jumpDays(offset: number) {
    setSelectedDate((current) => {
      const next = new Date(current);
      next.setDate(next.getDate() + offset);
      return startOfDay(next);
    });
  }

  function goToToday() {
    setSelectedDate(startOfDay(new Date()));
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <p className="text-sm text-muted-foreground">{selectedLabel}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="icon" onClick={() => jumpDays(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="min-w-[220px] justify-start">
                <CalendarDays className="h-4 w-4" />
                {selectedLabel}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(day) => day && setSelectedDate(startOfDay(day))}
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="icon" onClick={() => jumpDays(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={goToToday}>
            Today
          </Button>
          <Button onClick={() => setNewDialogOpen(true)} className="brand-gradient text-brand-foreground">
            <Plus className="h-4 w-4" />
            New appointment
          </Button>
        </div>
      </div>

      {appointments.length === 0 ? (
        <Card className="p-16 text-center">
          <Inbox className="h-10 w-10 mx-auto text-muted-foreground/50" />
          <p className="mt-3 font-medium">No appointments for this day</p>
          <p className="text-sm text-muted-foreground">
            Create an appointment to start filling your schedule.
          </p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {appointments.map((item) => (
            <Card
              key={item.id}
              className="p-5 hover:shadow-soft transition-shadow cursor-pointer"
              onClick={() => setEditing(item)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Clock3 className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{formatTimeRange(item.starts_at, item.ends_at)}</p>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="text-sm font-semibold">{item.customer_name}</p>
                  <p className="text-sm text-muted-foreground truncate">{vehicleLabel(item) || "Vehicle not provided"}</p>
                  <p className="text-sm text-muted-foreground">{item.service_name}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium">Bay {item.bay}</p>
                  <p className="text-muted-foreground capitalize flex items-center gap-1 justify-end">
                    <Wrench className="h-3.5 w-3.5" />
                    {item.status.replace("_", " ")}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AppointmentDialog
        userId={user.id}
        open={newDialogOpen}
        onOpenChange={setNewDialogOpen}
        selectedDate={selectedDate}
        onSaved={() => {
          refetchDay(selectedDate);
        }}
      />

      <AppointmentDialog
        userId={user.id}
        open={!!editing}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
        selectedDate={selectedDate}
        appointment={editing}
        onSaved={() => {
          refetchDay(selectedDate).then(() => {
            setEditing(null);
          });
        }}
      />
    </div>
  );
}
