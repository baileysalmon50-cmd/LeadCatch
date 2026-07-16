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
type ViewMode = "day" | "week";

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

function endOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

function startOfWeekMonday(date: Date) {
  const dayStart = startOfDay(date);
  const day = dayStart.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  const result = new Date(dayStart);
  result.setDate(dayStart.getDate() + offset);
  return startOfDay(result);
}

function endOfWeekSunday(date: Date) {
  const weekStart = startOfWeekMonday(date);
  const result = new Date(weekStart);
  result.setDate(weekStart.getDate() + 6);
  return endOfDay(result);
}

function dayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function weekDays(date: Date) {
  const start = startOfWeekMonday(date);
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
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

function formatDayShort(date: Date) {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
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
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);

  function rangeForView(date: Date = selectedDate, mode: ViewMode = viewMode) {
    const rangeStart = mode === "week" ? startOfWeekMonday(date) : startOfDay(date);
    const rangeEnd = mode === "week" ? endOfWeekSunday(date) : endOfDay(date);
    return { rangeStart, rangeEnd };
  }

  function refetchRange(rangeStart: Date, rangeEnd: Date) {
    const startIso = rangeStart.toISOString();
    const endIso = rangeEnd.toISOString();

    return supabase
      .from("appointments")
      .select("*")
      .eq("user_id", user.id)
      .gte("starts_at", startIso)
      .lte("starts_at", endIso)
      .order("starts_at", { ascending: true })
      .then(({ data }) => setAppointments((data as Appointment[]) || []));
  }

  useEffect(() => {
    const { rangeStart, rangeEnd } = rangeForView(selectedDate, viewMode);
    const channelRangeKey = `${rangeStart.toISOString()}-${rangeEnd.toISOString()}`;
    refetchRange(rangeStart, rangeEnd);

    const channel = supabase
      .channel(`appointments-${user.id}-${channelRangeKey}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          refetchRange(rangeStart, rangeEnd);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user.id, selectedDate, viewMode]);

  const selectedLabel = useMemo(() => {
    if (viewMode === "day") return formatDay(selectedDate);
    const weekStart = startOfWeekMonday(selectedDate);
    const weekEnd = endOfWeekSunday(selectedDate);
    return `${formatDayShort(weekStart)} - ${formatDayShort(weekEnd)}`;
  }, [selectedDate, viewMode]);

  const appointmentsByDay = useMemo(() => {
    const grouped = new Map<string, Appointment[]>();
    appointments.forEach((item) => {
      const key = dayKey(new Date(item.starts_at));
      const existing = grouped.get(key);
      if (existing) existing.push(item);
      else grouped.set(key, [item]);
    });
    return grouped;
  }, [appointments]);

  const weekViewDays = useMemo(() => weekDays(selectedDate), [selectedDate]);

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
          <Button variant="outline" size="icon" onClick={() => jumpDays(viewMode === "day" ? -1 : -7)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="inline-flex items-center rounded-md border bg-background p-1">
            <Button
              variant={viewMode === "day" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("day")}
              className="h-8"
            >
              Day
            </Button>
            <Button
              variant={viewMode === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("week")}
              className="h-8"
            >
              Week
            </Button>
          </div>
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
          <Button variant="outline" size="icon" onClick={() => jumpDays(viewMode === "day" ? 1 : 7)}>
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

      {viewMode === "day" ? (
        appointments.length === 0 ? (
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
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekViewDays.map((day) => {
            const key = dayKey(day);
            const dayAppointments = appointmentsByDay.get(key) || [];
            return (
              <Card key={key} className="p-3 space-y-3 min-h-40">
                <button
                  type="button"
                  className="w-full text-left"
                  onClick={() => {
                    setSelectedDate(startOfDay(day));
                    setViewMode("day");
                  }}
                >
                  <p className="text-sm font-semibold">{formatDayShort(day)}</p>
                </button>
                {dayAppointments.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No appointments</p>
                ) : (
                  <div className="space-y-2">
                    {dayAppointments.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="w-full rounded-md border bg-card p-2 text-left hover:bg-muted/40 transition-colors"
                        onClick={() => setEditing(item)}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-medium">{formatTimeRange(item.starts_at, item.ends_at)}</p>
                          <StatusBadge status={item.status} />
                        </div>
                        <p className="text-sm font-semibold truncate">{item.customer_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{item.service_name}</p>
                        <p className="text-xs text-muted-foreground">Bay {item.bay}</p>
                      </button>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <AppointmentDialog
        userId={user.id}
        open={newDialogOpen}
        onOpenChange={setNewDialogOpen}
        selectedDate={selectedDate}
        onSaved={() => {
          const { rangeStart, rangeEnd } = rangeForView(selectedDate, viewMode);
          refetchRange(rangeStart, rangeEnd);
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
          const { rangeStart, rangeEnd } = rangeForView(selectedDate, viewMode);
          refetchRange(rangeStart, rangeEnd).then(() => {
            setEditing(null);
          });
        }}
      />
    </div>
  );
}
