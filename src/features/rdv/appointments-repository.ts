import {AppwriteConfig} from "@/constants/config";
import {ID, Permission, Query, Role, tables} from "@/lib/appwrite";
import {
  AppointmentStatus,
  type Appointment,
  type AppointmentData,
} from "./types";

const databaseId = AppwriteConfig.databaseId;
const tableId = AppwriteConfig.tables.appointments;

/**
 * Row-level permissions: only the owner may read or change their appointments.
 * The userId column is kept as well so we can query by it.
 */
function ownerPermissions(userId: string): string[] {
  const owner = Role.user(userId);
  return [
    Permission.read(owner),
    Permission.update(owner),
    Permission.delete(owner),
  ];
}

/** Input for creating an appointment — status and owner are set by the repo. */
export type NewAppointment = Pick<AppointmentData, "title" | "notes"> & {
  startsAt: Date;
};

export async function listAppointments(userId: string): Promise<Appointment[]> {
  const {rows} = await tables.listRows<Appointment>({
    databaseId,
    tableId,
    queries: [
      Query.equal("userId", userId),
      Query.orderAsc("startsAt"),
      Query.limit(200),
    ],
  });
  return rows;
}

export async function createAppointment(
  userId: string,
  input: NewAppointment,
): Promise<Appointment> {
  return tables.createRow<Appointment>({
    databaseId,
    tableId,
    rowId: ID.unique(),
    data: {
      title: input.title.trim(),
      notes: input.notes.trim(),
      startsAt: input.startsAt.toISOString(),
      status: AppointmentStatus.Pending,
      userId,
    },
    permissions: ownerPermissions(userId),
  });
}

export async function updateAppointment(
  id: string,
  input: NewAppointment,
): Promise<Appointment> {
  return tables.updateRow<Appointment>({
    databaseId,
    tableId,
    rowId: id,
    data: {
      title: input.title.trim(),
      notes: input.notes.trim(),
      startsAt: input.startsAt.toISOString(),
    },
  });
}

export async function setAppointmentStatus(
  id: string,
  status: AppointmentStatus,
): Promise<Appointment> {
  return tables.updateRow<Appointment>({
    databaseId,
    tableId,
    rowId: id,
    data: {status},
  });
}

export async function deleteAppointment(id: string): Promise<void> {
  await tables.deleteRow({databaseId, tableId, rowId: id});
}
