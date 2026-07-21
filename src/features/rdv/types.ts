import type {Models} from "react-native-appwrite";

export const AppointmentStatus = {
  Pending: "pending",
  Done: "done",
} as const;

export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

/** Columns we own. Appwrite adds $id, $createdAt, … through Models.Row. */
export type AppointmentData = {
  title: string;
  /** Free text: lieu, préparation, participants. Empty string when unset. */
  notes: string;
  /** ISO 8601. Appwrite datetime columns are stored in UTC. */
  startsAt: string;
  status: AppointmentStatus;
  /** Owner. Also enforced by per-row Appwrite permissions. */
  userId: string;
};

export type Appointment = Models.Row & AppointmentData;

/**
 * The filters shown in the list. "late" and "upcoming" are derived from
 * startsAt + status rather than stored, so a pending appointment moves between
 * them on its own as time passes.
 */
export const AppointmentFilter = {
  All: "all",
  Upcoming: "upcoming",
  Late: "late",
  Done: "done",
} as const;

export type AppointmentFilter =
  (typeof AppointmentFilter)[keyof typeof AppointmentFilter];

export const FILTER_LABELS: Record<AppointmentFilter, string> = {
  all: "Tous",
  upcoming: "À venir",
  late: "En retard",
  done: "Terminés",
};

export function isDone(appointment: Appointment): boolean {
  return appointment.status === AppointmentStatus.Done;
}

/** Still pending, but its time has passed. */
export function isLate(appointment: Appointment, now: Date): boolean {
  return !isDone(appointment) && new Date(appointment.startsAt) < now;
}

/** Still pending, and its time has not passed. */
export function isUpcoming(appointment: Appointment, now: Date): boolean {
  return !isDone(appointment) && !isLate(appointment, now);
}

export function matchesFilter(
  appointment: Appointment,
  filter: AppointmentFilter,
  now: Date,
): boolean {
  switch (filter) {
    case AppointmentFilter.All:
      return true;
    case AppointmentFilter.Upcoming:
      return isUpcoming(appointment, now);
    case AppointmentFilter.Late:
      return isLate(appointment, now);
    case AppointmentFilter.Done:
      return isDone(appointment);
  }
}

export type AppointmentCounts = Record<AppointmentFilter, number>;

export function countByFilter(
  appointments: Appointment[],
  now: Date,
): AppointmentCounts {
  return {
    all: appointments.length,
    upcoming: appointments.filter(a => isUpcoming(a, now)).length,
    late: appointments.filter(a => isLate(a, now)).length,
    done: appointments.filter(isDone).length,
  };
}
