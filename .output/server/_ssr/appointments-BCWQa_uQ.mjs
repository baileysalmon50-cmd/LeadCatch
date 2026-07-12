import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-a0HX1RP9.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as buttonVariants, r as cn, t as Button } from "./button-CCQEfgNs.mjs";
import { t as Card } from "./card-Bav9nr75.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as CalendarDays, D as ChevronLeft, E as ChevronRight, O as ChevronDown, d as Plus, r as Wrench, w as Clock3, y as Inbox } from "../_libs/lucide-react.mjs";
import { t as Route } from "./appointments-CfC64IDS.mjs";
import { t as StatusBadge } from "./status-badge-CCqdNHSw.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DYBpJUt2.mjs";
import { n as Label, t as Input } from "./label-D2fwATjQ.mjs";
import { t as Textarea } from "./textarea-Dfe41XSO.mjs";
import { i as Trigger, n as Portal, r as Root2, t as Content2 } from "../_libs/@radix-ui/react-popover+[...].mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DYjyjhZD.mjs";
import { n as getDefaultClassNames, t as DayPicker } from "../_libs/react-day-picker.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/appointments-BCWQa_uQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_OPTIONS = [
	"new",
	"confirmed",
	"checked_in",
	"in_service",
	"completed",
	"cancelled",
	"no_show"
];
function dateToInputValue(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function isoToDateInput(iso) {
	return dateToInputValue(new Date(iso));
}
function isoToTimeInput(iso) {
	const date = new Date(iso);
	return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
function combineDateAndTime(dateString, timeString) {
	const [year, month, day] = dateString.split("-").map(Number);
	const [hours, minutes] = timeString.split(":").map(Number);
	return new Date(year, (month || 1) - 1, day || 1, hours || 0, minutes || 0, 0, 0);
}
function defaultFormFromDate(date) {
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
		status: "new"
	};
}
function AppointmentDialog({ userId, open, onOpenChange, selectedDate, appointment, onSaved }) {
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [servicesLoading, setServicesLoading] = (0, import_react.useState)(false);
	const [serviceTypes, setServiceTypes] = (0, import_react.useState)([]);
	const [baysCount, setBaysCount] = (0, import_react.useState)(1);
	const [form, setForm] = (0, import_react.useState)(defaultFormFromDate(selectedDate));
	const isEditMode = !!appointment;
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setServicesLoading(true);
		Promise.all([supabase.from("service_types").select("*").eq("user_id", userId).eq("is_active", true).order("name", { ascending: true }), supabase.from("settings").select("bays_count").eq("user_id", userId).maybeSingle()]).then(([servicesResult, settingsResult]) => {
			setServicesLoading(false);
			setServiceTypes(servicesResult.data ?? []);
			setBaysCount(settingsResult.data?.bays_count ?? 1);
		});
	}, [open, userId]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		if (!appointment) {
			setForm((current) => ({
				...defaultFormFromDate(selectedDate),
				service_type_id: current.service_type_id && serviceTypes.some((s) => s.id === current.service_type_id) ? current.service_type_id : ""
			}));
			return;
		}
		const duration = Math.max(5, Math.round((new Date(appointment.ends_at).getTime() - new Date(appointment.starts_at).getTime()) / 6e4));
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
			status: appointment.status
		});
	}, [
		open,
		appointment,
		selectedDate,
		serviceTypes
	]);
	const selectedService = (0, import_react.useMemo)(() => serviceTypes.find((service) => service.id === form.service_type_id) ?? null, [form.service_type_id, serviceTypes]);
	async function findAvailableBay(startsAtIso, endsAtIso) {
		const overlapQuery = supabase.from("appointments").select("id, bay, status").eq("user_id", userId).neq("status", "cancelled").lt("starts_at", endsAtIso).gt("ends_at", startsAtIso);
		if (appointment?.id) overlapQuery.neq("id", appointment.id);
		const { data, error } = await overlapQuery;
		if (error) throw error;
		const usedBays = new Set((data ?? []).map((item) => item.bay));
		if (appointment?.bay && !usedBays.has(appointment.bay)) return appointment.bay;
		for (let bay = 1; bay <= baysCount; bay += 1) if (!usedBays.has(bay)) return bay;
		return null;
	}
	async function submit() {
		if (!form.customer_name.trim()) return toast.error("Customer name is required.");
		if (!form.customer_phone.trim()) return toast.error("Phone is required.");
		if (!form.date) return toast.error("Date is required.");
		if (!form.start_time) return toast.error("Start time is required.");
		const duration = Number(form.duration_minutes);
		if (!Number.isFinite(duration) || duration <= 0) return toast.error("Duration must be a positive number of minutes.");
		const startsAt = combineDateAndTime(form.date, form.start_time);
		const endsAt = new Date(startsAt.getTime() + duration * 60 * 1e3);
		const startsAtIso = startsAt.toISOString();
		const endsAtIso = endsAt.toISOString();
		const chosenService = serviceTypes.find((service) => service.id === form.service_type_id) ?? (appointment ? {
			id: "",
			name: appointment.service_name,
			duration_minutes: duration,
			is_active: true,
			created_at: "",
			updated_at: "",
			user_id: userId
		} : null);
		if (!chosenService) return toast.error("Select a service type.");
		setLoading(true);
		try {
			const bay = await findAvailableBay(startsAtIso, endsAtIso);
			if (!bay) {
				setLoading(false);
				return toast.error("That slot is full. Pick another time.");
			}
			if (appointment) {
				const { error } = await supabase.from("appointments").update({
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
					status: form.status
				}).eq("id", appointment.id);
				if (error) {
					setLoading(false);
					if (error.code === "23P01") return toast.error("That slot was just taken, pick another time.");
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
					status: "new"
				});
				if (error) {
					setLoading(false);
					if (error.code === "23P01") return toast.error("That slot was just taken, pick another time.");
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
		const { error } = await supabase.from("appointments").update({ status: "cancelled" }).eq("id", appointment.id);
		setLoading(false);
		if (error) return toast.error(error.message);
		toast.success("Appointment cancelled");
		onSaved?.();
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-xl max-h-[90vh] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: isEditMode ? "Edit appointment" : "New appointment" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: isEditMode ? "Update details, status, and schedule." : "Create a new scheduled appointment." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Customer name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.customer_name,
								onChange: (e) => setForm({
									...form,
									customer_name: e.target.value
								}),
								placeholder: "Jane Smith"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.customer_phone,
								onChange: (e) => setForm({
									...form,
									customer_phone: e.target.value
								}),
								placeholder: "+1 555 123 4567"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.customer_email,
							onChange: (e) => setForm({
								...form,
								customer_email: e.target.value
							}),
							placeholder: "jane@example.com"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Vehicle year" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.vehicle_year,
									onChange: (e) => setForm({
										...form,
										vehicle_year: e.target.value
									}),
									placeholder: "2022"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Vehicle make" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.vehicle_make,
									onChange: (e) => setForm({
										...form,
										vehicle_make: e.target.value
									}),
									placeholder: "Toyota"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Vehicle model" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.vehicle_model,
									onChange: (e) => setForm({
										...form,
										vehicle_model: e.target.value
									}),
									placeholder: "Camry"
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Service" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.service_type_id,
								onValueChange: (value) => {
									const service = serviceTypes.find((item) => item.id === value);
									setForm({
										...form,
										service_type_id: value,
										service_name: service?.name ?? form.service_name,
										duration_minutes: String(service?.duration_minutes ?? form.duration_minutes)
									});
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: servicesLoading ? "Loading..." : "Select a service" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: serviceTypes.map((service) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: service.id,
									children: [
										service.name,
										" (",
										service.duration_minutes,
										" min)"
									]
								}, service.id)) })]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Duration (minutes)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: "5",
								value: form.duration_minutes,
								onChange: (e) => setForm({
									...form,
									duration_minutes: e.target.value
								})
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: form.date,
								onChange: (e) => setForm({
									...form,
									date: e.target.value
								})
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Start time" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "time",
								value: form.start_time,
								onChange: (e) => setForm({
									...form,
									start_time: e.target.value
								})
							})] })]
						}),
						isEditMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: form.status,
							onValueChange: (value) => setForm({
								...form,
								status: value
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUS_OPTIONS.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: status,
								children: status.replace("_", " ")
							}, status)) })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Notes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: form.notes,
							onChange: (e) => setForm({
								...form,
								notes: e.target.value
							}),
							placeholder: "Optional notes"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: selectedService ? `Using ${selectedService.name} default of ${selectedService.duration_minutes} minutes.` : "Select a service to prefill duration."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "gap-2",
					children: [
						isEditMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: cancelAppointment,
							disabled: loading,
							children: "Mark cancelled"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => onOpenChange(false),
							children: "Close"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: submit,
							disabled: loading,
							className: "brand-gradient text-brand-foreground",
							children: loading ? "Saving..." : isEditMode ? "Save changes" : "Create appointment"
						})
					]
				})
			]
		})
	});
}
function Calendar({ className, classNames, showOutsideDays = true, captionLayout = "label", buttonVariant = "ghost", formatters, components, ...props }) {
	const defaultClassNames = getDefaultClassNames();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayPicker, {
		showOutsideDays,
		className: cn("bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent", String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`, String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`, className),
		captionLayout,
		formatters: {
			formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
			...formatters
		},
		classNames: {
			root: cn("w-fit", defaultClassNames.root),
			months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
			month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
			nav: cn("absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1", defaultClassNames.nav),
			button_previous: cn(buttonVariants({ variant: buttonVariant }), "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50", defaultClassNames.button_previous),
			button_next: cn(buttonVariants({ variant: buttonVariant }), "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50", defaultClassNames.button_next),
			month_caption: cn("flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)", defaultClassNames.month_caption),
			dropdowns: cn("flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium", defaultClassNames.dropdowns),
			dropdown_root: cn("has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border", defaultClassNames.dropdown_root),
			dropdown: cn("bg-popover absolute inset-0 opacity-0", defaultClassNames.dropdown),
			caption_label: cn("select-none font-medium", captionLayout === "label" ? "text-sm" : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5", defaultClassNames.caption_label),
			table: "w-full border-collapse",
			weekdays: cn("flex", defaultClassNames.weekdays),
			weekday: cn("text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal", defaultClassNames.weekday),
			week: cn("mt-2 flex w-full", defaultClassNames.week),
			week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
			week_number: cn("text-muted-foreground select-none text-[0.8rem]", defaultClassNames.week_number),
			day: cn("group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md", defaultClassNames.day),
			range_start: cn("bg-accent rounded-l-md", defaultClassNames.range_start),
			range_middle: cn("rounded-none", defaultClassNames.range_middle),
			range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
			today: cn("bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none", defaultClassNames.today),
			outside: cn("text-muted-foreground aria-selected:text-muted-foreground", defaultClassNames.outside),
			disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
			hidden: cn("invisible", defaultClassNames.hidden),
			...classNames
		},
		components: {
			Root: ({ className, rootRef, ...props }) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-slot": "calendar",
					ref: rootRef,
					className: cn(className),
					...props
				});
			},
			Chevron: ({ className, orientation, ...props }) => {
				if (orientation === "left") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
					className: cn("size-4", className),
					...props
				});
				if (orientation === "right") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
					className: cn("size-4", className),
					...props
				});
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
					className: cn("size-4", className),
					...props
				});
			},
			DayButton: CalendarDayButton,
			WeekNumber: ({ children, ...props }) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					...props,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-(--cell-size) items-center justify-center text-center",
						children
					})
				});
			},
			...components
		},
		...props
	});
}
function CalendarDayButton({ className, day, modifiers, ...props }) {
	const defaultClassNames = getDefaultClassNames();
	const ref = import_react.useRef(null);
	import_react.useEffect(() => {
		if (modifiers.focused) ref.current?.focus();
	}, [modifiers.focused]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		ref,
		variant: "ghost",
		size: "icon",
		"data-day": day.date.toLocaleDateString(),
		"data-selected-single": modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle,
		"data-range-start": modifiers.range_start,
		"data-range-end": modifiers.range_end,
		"data-range-middle": modifiers.range_middle,
		className: cn("data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-(--cell-size) flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70", defaultClassNames.day, className),
		...props
	});
}
var Popover = Root2;
var PopoverTrigger = Trigger;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = Content2.displayName;
function startOfDay(date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}
function endOfDay(date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}
function vehicleLabel(item) {
	return [
		item.vehicle_year,
		item.vehicle_make,
		item.vehicle_model
	].filter(Boolean).join(" ");
}
function formatDay(date) {
	return date.toLocaleDateString(void 0, {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric"
	});
}
function formatTimeRange(startsAt, endsAt) {
	const start = new Date(startsAt);
	const end = new Date(endsAt);
	const format = {
		hour: "numeric",
		minute: "2-digit"
	};
	return `${start.toLocaleTimeString(void 0, format)} - ${end.toLocaleTimeString(void 0, format)}`;
}
function AppointmentsPage() {
	const { user } = Route.useRouteContext();
	const [appointments, setAppointments] = (0, import_react.useState)([]);
	const [selectedDate, setSelectedDate] = (0, import_react.useState)(startOfDay(/* @__PURE__ */ new Date()));
	const [newDialogOpen, setNewDialogOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	function refetchDay(date = selectedDate) {
		const dayStart = startOfDay(date).toISOString();
		const dayEnd = endOfDay(date).toISOString();
		return supabase.from("appointments").select("*").eq("user_id", user.id).gte("starts_at", dayStart).lte("starts_at", dayEnd).order("starts_at", { ascending: true }).then(({ data }) => setAppointments(data || []));
	}
	(0, import_react.useEffect)(() => {
		const dayStart = startOfDay(selectedDate).toISOString();
		refetchDay(selectedDate);
		const channel = supabase.channel(`appointments-${user.id}-${dayStart}`).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "appointments",
			filter: `user_id=eq.${user.id}`
		}, () => {
			refetchDay(selectedDate);
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [user.id, selectedDate]);
	const selectedLabel = (0, import_react.useMemo)(() => formatDay(selectedDate), [selectedDate]);
	function jumpDays(offset) {
		setSelectedDate((current) => {
			const next = new Date(current);
			next.setDate(next.getDate() + offset);
			return startOfDay(next);
		});
	}
	function goToToday() {
		setSelectedDate(startOfDay(/* @__PURE__ */ new Date()));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8 space-y-6 max-w-6xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "Appointments"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: selectedLabel
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							onClick: () => jumpDays(-1),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "min-w-[220px] justify-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-4 w-4" }), selectedLabel]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
							className: "w-auto p-0",
							align: "end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
								mode: "single",
								selected: selectedDate,
								onSelect: (day) => day && setSelectedDate(startOfDay(day))
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							onClick: () => jumpDays(1),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: goToToday,
							children: "Today"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => setNewDialogOpen(true),
							className: "brand-gradient text-brand-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "New appointment"]
						})
					]
				})]
			}),
			appointments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-16 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "h-10 w-10 mx-auto text-muted-foreground/50" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-medium",
						children: "No appointments for this day"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Create an appointment to start filling your schedule."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3",
				children: appointments.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "p-5 hover:shadow-soft transition-shadow cursor-pointer",
					onClick: () => setEditing(item),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 flex-wrap",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "h-4 w-4 text-muted-foreground" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium",
											children: formatTimeRange(item.starts_at, item.ends_at)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: item.status })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: item.customer_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground truncate",
									children: vehicleLabel(item) || "Vehicle not provided"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: item.service_name
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-medium",
								children: ["Bay ", item.bay]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted-foreground capitalize flex items-center gap-1 justify-end",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-3.5 w-3.5" }), item.status.replace("_", " ")]
							})]
						})]
					})
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentDialog, {
				userId: user.id,
				open: newDialogOpen,
				onOpenChange: setNewDialogOpen,
				selectedDate,
				onSaved: () => {
					refetchDay(selectedDate);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentDialog, {
				userId: user.id,
				open: !!editing,
				onOpenChange: (open) => {
					if (!open) setEditing(null);
				},
				selectedDate,
				appointment: editing,
				onSaved: () => {
					refetchDay(selectedDate).then(() => {
						setEditing(null);
					});
				}
			})
		]
	});
}
//#endregion
export { AppointmentsPage as component };
