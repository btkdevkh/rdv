/**
 * Date formatting for the French UI. All helpers take the appointment's ISO
 * string and render in the device's local timezone.
 */

const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
});

const dateInputFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isToday(iso: string, now: Date): boolean {
  return isSameDay(new Date(iso), now);
}

export function isTomorrow(iso: string, now: Date): boolean {
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return isSameDay(new Date(iso), tomorrow);
}

/** "mer. 15 juil. 2026 à 17:00" — the form used on appointment cards. */
export function formatFullDateTime(iso: string): string {
  const date = new Date(iso);
  return `${dateTimeFormatter.format(date)} à ${timeFormatter.format(date)}`;
}

/** "Aujourd'hui à 19:30" / "Demain à 11:30" / full date — used in the bell list. */
export function formatRelativeDateTime(iso: string, now: Date): string {
  const date = new Date(iso);
  const time = timeFormatter.format(date);

  if (isSameDay(date, now)) return `Aujourd'hui à ${time}`;
  if (isTomorrow(iso, now)) return `Demain à ${time}`;
  return formatFullDateTime(iso);
}

/** "JJ/MM/AAAA" for the date field in the form. */
export function formatDateInput(date: Date): string {
  return dateInputFormatter.format(date);
}

/** "HH:MM" for the time field in the form. */
export function formatTimeInput(date: Date): string {
  return timeFormatter.format(date);
}

/** Combines a picked day and a picked time into one Date. */
export function combineDateAndTime(day: Date, time: Date): Date {
  const combined = new Date(day);
  combined.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return combined;
}
