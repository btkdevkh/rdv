/**
 * Environment configuration.
 *
 * Every value here is EXPO_PUBLIC_* and therefore embedded in the app bundle —
 * it is readable by anyone who downloads the app. Only ever put non-secret,
 * client-safe values in here. Appwrite project/database/collection IDs are
 * client-safe by design; access is enforced by Appwrite permissions, not by
 * hiding these IDs. Never add an Appwrite API key.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env and fill it in.`,
    );
  }
  return value;
}

export const AppwriteConfig = {
  endpoint: required(
    "EXPO_PUBLIC_APPWRITE_ENDPOINT",
    process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  ),
  projectId: required(
    "EXPO_PUBLIC_APPWRITE_PROJECT_ID",
    process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  ),
  platform: required(
    "EXPO_PUBLIC_APPWRITE_PLATFORM",
    process.env.EXPO_PUBLIC_APPWRITE_PLATFORM,
  ),
  databaseId: required(
    "EXPO_PUBLIC_APPWRITE_DATABASE_ID",
    process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  ),
  /** Table (collection) IDs live here so no string literal is spread across features. */
  tables: {
    appointments: "appointments",
  },
} as const;
