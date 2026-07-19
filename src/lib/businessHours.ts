export type BusinessHourRow = {
  day_of_week: number;
  is_open: boolean;
  open_time: string | null;
  close_time: string | null;
  break_start: string | null;
  break_end: string | null;
};

// Verified against src/routes/_authenticated/settings.tsx (DAYS constant): 0=Sunday.
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

function toMinutes(value: string): number | null {
  const match = value.match(/^(\d{2}):(\d{2})(?::\d{2})?$/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

  return hours * 60 + minutes;
}

function formatMinutes(totalMinutes: number): string {
  const hours24 = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  if (minutes === 0) {
    return `${hours12} ${period}`;
  }

  return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
}

function formatInterval(start: string, end: string): string | null {
  const startMinutes = toMinutes(start);
  const endMinutes = toMinutes(end);
  if (startMinutes === null || endMinutes === null) return null;

  return `${formatMinutes(startMinutes)} to ${formatMinutes(endMinutes)}`;
}

function dayPhrase(dayIndexes: number[]): string {
  if (dayIndexes.length === 1) {
    return DAY_NAMES[dayIndexes[0]];
  }

  if (dayIndexes.length === 2) {
    return `${DAY_NAMES[dayIndexes[0]]} and ${DAY_NAMES[dayIndexes[1]]}`;
  }

  return `${DAY_NAMES[dayIndexes[0]]} through ${DAY_NAMES[dayIndexes[dayIndexes.length - 1]]}`;
}

export function formatBusinessHours(rows: BusinessHourRow[]): string | null {
  if (rows.length === 0) return null;

  const rowByDay = new Map<number, BusinessHourRow>();
  for (const row of rows) {
    if (row.day_of_week < 0 || row.day_of_week > 6) continue;
    // Duplicate day rows should not exist; if they do, we use the last row as a latest-row fallback.
    rowByDay.set(row.day_of_week, row);
  }

  const hoursByDay = new Map<number, string | null>();
  for (const day of DISPLAY_ORDER) {
    const row = rowByDay.get(day);
    if (!row || !row.is_open || !row.open_time || !row.close_time) {
      hoursByDay.set(day, null);
      continue;
    }

    const baseInterval = formatInterval(row.open_time, row.close_time);
    if (!baseInterval) {
      hoursByDay.set(day, null);
      continue;
    }

    if (row.break_start && row.break_end) {
      const firstInterval = formatInterval(row.open_time, row.break_start);
      const secondInterval = formatInterval(row.break_end, row.close_time);
      if (firstInterval && secondInterval) {
        hoursByDay.set(day, `${firstInterval} and ${secondInterval}`);
        continue;
      }
    }

    hoursByDay.set(day, baseInterval);
  }

  const allClosed = DISPLAY_ORDER.every((day) => hoursByDay.get(day) === null);
  if (allClosed) return "closed every day";

  const openParts: string[] = [];
  const closedParts: string[] = [];

  let index = 0;
  while (index < DISPLAY_ORDER.length) {
    const start = index;
    const startDay = DISPLAY_ORDER[start];
    const startHours = hoursByDay.get(startDay) ?? null;

    index += 1;
    while (index < DISPLAY_ORDER.length) {
      const nextDay = DISPLAY_ORDER[index];
      const nextHours = hoursByDay.get(nextDay) ?? null;
      if (nextHours !== startHours) break;
      index += 1;
    }

    const dayIndexes = DISPLAY_ORDER.slice(start, index);
    const daysText = dayPhrase(dayIndexes);
    if (startHours === null) {
      closedParts.push(`closed ${daysText}`);
    } else {
      openParts.push(`${daysText} ${startHours}`);
    }
  }

  return [...openParts, ...closedParts].join(", ");
}