import Constants, {ExecutionEnvironment} from "expo-constants";
import {Platform} from "react-native";
import {formatRelativeDateTime} from "@/utils/date";
import type {Appointment} from "./types";

/**
 * Local reminders. The device schedules these itself, so they fire offline —
 * but only for appointments this device has synced. Appointments created on the
 * web app produce no reminder here until the list is loaded again, which is why
 * `syncReminders` rebuilds the whole schedule on every load.
 */

/** How long before the appointment the reminder fires. */
const REMINDER_LEAD_MINUTES = 30;

const ANDROID_CHANNEL_ID = "rendez-vous";

/**
 * Expo Go dropped notification support on Android in SDK 53, and
 * expo-notifications throws on import there. Loading it lazily behind this flag
 * keeps Expo Go usable for everything else — reminders simply do nothing until
 * you run a development build.
 */
const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

type NotificationsModule = typeof import("expo-notifications");

let notifications: NotificationsModule | null = null;

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

function reminderDate(appointment: Appointment): Date {
  const startsAt = new Date(appointment.startsAt);
  return new Date(startsAt.getTime() - REMINDER_LEAD_MINUTES * 60_000);
}

async function scheduleReminder(
  appointment: Appointment,
  now: Date,
): Promise<void> {
  const Notifications = getNotifications();
  if (!Notifications) return;

  const fireAt = reminderDate(appointment);
  // A reminder whose lead time has already elapsed would fire immediately.
  if (fireAt <= now) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: appointment.title,
      body: formatRelativeDateTime(appointment.startsAt, now),
      data: {appointmentId: appointment.$id},
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: fireAt,
      ...(Platform.OS === "android" && {channelId: ANDROID_CHANNEL_ID}),
    },
  });
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

  const pending = appointments.filter(a => a.status === "pending");
  await Promise.all(pending.map(a => scheduleReminder(a, now)));
}

export async function clearReminders(): Promise<void> {
  const Notifications = getNotifications();
  if (!Notifications) return;

  await Notifications.cancelAllScheduledNotificationsAsync();
}
