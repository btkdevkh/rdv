import {Platform} from "react-native";
import {formatRelativeDateTime} from "@/utils/date";
import {isExpoGo} from "@/lib/runtime";
import type {Appointment} from "./types";

/**
 * Local reminders. The device schedules these itself, so they fire offline —
 * but only for appointments this device has synced. Appointments created on the
 * web app produce no reminder here until the list is loaded again, which is why
 * `syncReminders` rebuilds the whole schedule on every load.
 */

const HOURS = 60 * 60 * 1000;

/**
 * How far ahead of an appointment each reminder fires: three days out, the day
 * before, then three hours before it starts.
 *
 * Leads already in the past are skipped, so booking something for this evening
 * schedules only the 3h reminder rather than firing the others immediately.
 */
const REMINDER_LEADS_MS = [3 * 24 * HOURS, 24 * HOURS, 3 * HOURS];

const ANDROID_CHANNEL_ID = "rendez-vous";

type NotificationsModule = typeof import("expo-notifications");

let notifications: NotificationsModule | null = null;

/**
 * expo-notifications throws on import in Expo Go, so it is loaded lazily behind
 * that check — Expo Go stays usable and reminders simply do nothing there.
 */
function getNotifications(): NotificationsModule | null {
  if (isExpoGo) return null;
  if (!notifications) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    notifications = require("expo-notifications") as NotificationsModule;
    notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }
  return notifications;
}

/** True when reminders can actually be scheduled — false in Expo Go. */
export function areRemindersSupported(): boolean {
  return !isExpoGo;
}

/**
 * Asks for permission once. Returns false if unavailable or declined — callers
 * carry on silently rather than blocking the app.
 */
export async function ensureNotificationPermission(): Promise<boolean> {
  const Notifications = getNotifications();
  if (!Notifications) return false;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
      name: "Rendez-vous",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const {status} = await Notifications.getPermissionsAsync();
  if (status === "granted") return true;

  const request = await Notifications.requestPermissionsAsync();
  return request.status === "granted";
}

/** The lead times still ahead of `now`, soonest last. */
export function reminderDates(appointment: Appointment, now: Date): Date[] {
  const startsAt = new Date(appointment.startsAt).getTime();
  return REMINDER_LEADS_MS.map(lead => new Date(startsAt - lead)).filter(
    fireAt => fireAt > now,
  );
}

async function scheduleReminders(
  appointment: Appointment,
  now: Date,
): Promise<void> {
  const Notifications = getNotifications();
  if (!Notifications) return;

  for (const fireAt of reminderDates(appointment, now)) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: appointment.title,
        // Phrased against the moment it fires, not the moment it is scheduled,
        // so the 24h reminder reads "Demain à 11:30" and the 3h one
        // "Aujourd'hui à 11:30".
        body: formatRelativeDateTime(appointment.startsAt, fireAt),
        data: {appointmentId: appointment.$id},
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: fireAt,
        ...(Platform.OS === "android" && {channelId: ANDROID_CHANNEL_ID}),
      },
    });
  }
}

/**
 * Rebuilds the whole schedule from the current list. Cancelling everything and
 * re-scheduling is far simpler than tracking individual notification IDs across
 * edits and deletes, and the list is small enough that the cost is irrelevant.
 */
export async function syncReminders(
  appointments: Appointment[],
  now: Date,
): Promise<void> {
  const Notifications = getNotifications();
  if (!Notifications) return;

  const granted = await ensureNotificationPermission();
  if (!granted) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  // iOS keeps at most 64 pending notifications per app and silently drops the
  // rest. At three leads each that is roughly 21 appointments — fine for now,
  // but if the list grows, schedule only the nearest few rather than all of
  // them.
  const pending = appointments.filter(a => a.status === "pending");
  await Promise.all(pending.map(a => scheduleReminders(a, now)));
}

export async function clearReminders(): Promise<void> {
  const Notifications = getNotifications();
  if (!Notifications) return;

  await Notifications.cancelAllScheduledNotificationsAsync();
}
