# Appwrite setup

One-time console configuration. Nothing in the app works until all four steps
are done.

## 1. Register the platform

Console → your project → **Overview** → **Add platform** → *React Native*.

Enter the bundle identifier / package name exactly as it appears in `app.json`:

```
com.btkdevkh.rdv
```

This value must also be `EXPO_PUBLIC_APPWRITE_PLATFORM` in `.env`, or every
request is rejected as an unknown origin.

## 2. Enable Google OAuth

Console → **Auth** → **Settings** → **Google** → enable.

You need a Google Cloud OAuth client (Web application type):

1. https://console.cloud.google.com → APIs & Services → Credentials
2. Create OAuth client ID → *Web application*
3. Copy the **redirect URI shown in the Appwrite Google settings panel** into
   Google's *Authorized redirect URIs*
4. Paste Google's Client ID and Client Secret back into Appwrite

The mobile app returns to itself through the `rdv://` scheme already set in
`app.json`; no extra Google config is needed for that.

## 3. Create the `appointments` table

The schema lives in `appwrite.config.json` and is applied by the CLI, so it is
version-controlled rather than clicked into existence:

```bash
npx appwrite login      # interactive, once per machine
npm run appwrite:push
```

`push` is idempotent — re-run it after editing `appwrite.config.json` to apply
changes. Adding a column is safe; changing the type of an existing one is not,
Appwrite will drop and recreate it.

**Read the change table `push` prints before typing YES.** Anything marked
`recreating` deletes that column and its data. A field merely *missing* from
the config counts as a difference, which is why every column spells out
`array` and `encrypt` explicitly — omitting them makes the CLI want to recreate
the column on every push.

The rest of this section documents what that file declares, for reference.

### Columns

| Key        | Type     | Size | Required | Default | Notes                        |
| ---------- | -------- | ---- | -------- | ------- | ---------------------------- |
| `title`    | String   | 200  | yes      | —       |                              |
| `notes`    | String   | 2000 | no       | `""`    | lieu, préparation, …         |
| `startsAt` | Datetime | —    | yes      | —       | stored UTC                   |
| `status`   | Enum     | —    | yes      | —       | elements: `pending`, `done`  |
| `userId`   | String   | 64   | yes      | —       | Appwrite user `$id`          |

> `notes` must be **not required with a default of `""`** — the app always sends
> a string and `AppointmentData.notes` is typed `string`, never `null`.

### Indexes

| Key             | Type | Attributes            | Order         |
| --------------- | ---- | --------------------- | ------------- |
| `user_starts`   | key  | `userId`, `startsAt`  | `ASC`, `ASC`  |

This backs the one query the app makes: appointments for the current user,
oldest first.

### Permissions

Table-level: **`create("users")` only**, with **row security enabled**.

> The config key is **`$permissions`** (with the dollar), not `permissions`.
> The CLI reads `table["$permissions"]` and silently sends nothing if the key is
> misspelled — while still printing `Updated … - permissions` on every push. If
> creating a row fails with *"No permissions provided for action 'create'"*,
> check this first, then verify against the console.

Read, update and delete are granted **per row** by the app (see
`ownerPermissions` in `appointments-repository.ts`), so one user can never see
another's appointments. Do not add table-wide read — it would expose every
user's appointments to every other user.

## 4. Fill in `.env`

```bash
cp .env.example .env
```

Then paste in your endpoint, project ID and database ID from the console.
`.env` is gitignored; `.env.example` is committed.

> Keep `appwrite.config.json` and `.env` in agreement. The config file is
> committed and holds only non-secret IDs; if you point `.env` at a different
> project, change both.

## Builds

`.env` is gitignored, and **EAS Build never uploads gitignored files** — a
cloud build would start and immediately throw `Missing environment variable`.
The same values are therefore duplicated into each build profile's `env` block
in `eas.json`.

Keep the two in sync. They hold only non-secret IDs, which is why committing
them is fine; the duplication across profiles is deliberate so a future staging
build can point at a separate Appwrite project.

```bash
npx eas build --platform android --profile preview   # installable APK
```

If these ever need to hold a real secret, move them out of `eas.json` and into
EAS environment variables (`eas env:create`), referenced by an `environment`
field on the profile.

## Notifications

Local reminders fire 30 minutes before each appointment
(`REMINDER_LEAD_MINUTES` in `features/rdv/reminders.ts`).

They require a **development build** — Expo Go on Android cannot schedule
notifications:

```bash
npx expo run:android   # or: npx expo run:ios
```
