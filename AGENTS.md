# Rendez-vous — conventions

Mobile port of the existing Rendez-vous web app: plan, track and manage
appointments. Expo SDK 57 + expo-router, Appwrite as the backend.

## Match the web app

`context/screenshots/web/` is **the spec**. This app is a port, not a redesign —
look there before designing any screen, component or column, and treat it as
authoritative when the two disagree. Do not edit or replace those images.

`context/screenshots/mobile/` is **evidence**: what the app actually looks like
right now, captured from an emulator. Refresh it when the UI changes
meaningfully. It records the current state; it never defines the target.

Deviating from the web design is allowed where a mobile idiom demands it — modal
routes instead of dialogs, the user's name dropped from the header for want of
width — but say so in a comment and in the commit message, so the difference
reads as a decision rather than an oversight.

To recapture (emulator running, app on the screen you want):

```bash
adb exec-out screencap -p > context/screenshots/mobile/list.png
```

## Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before
writing any code. Do not rely on remembered API shapes — SDK 56 removed direct
`@react-navigation/*` imports, and several Expo and Appwrite APIs moved to
object-parameter form.

## Branching

**Never commit directly to `main` or `develop`.** Every change starts on its own
branch cut from `develop`:

```bash
git checkout develop
git pull                      # once a remote exists
git checkout -b feature/upcoming-bell-badge
```

| Branch      | Role                                                        |
| ----------- | ----------------------------------------------------------- |
| `main`      | Kept up to date. Only ever receives merges from `develop`.  |
| `develop`   | Where work lives. Feature branches merge here.              |
| `feature/*` | One feature or refactor. Cut from `develop`, merged back.   |
| `fix/*`     | Bug fix. Same flow.                                         |
| `hotfix/*`  | Urgent production fix. Cut from `main`, merged to **both**. |

`main` is not a stale release marker — once work lands in `develop` and is
verified, merge `develop` into `main` so the two stay level:

```bash
git checkout main
git merge --no-ff develop
git checkout develop          # go straight back; never work on main
```

`develop` is the branch you sit on between tasks.

Name branches after the change, kebab-case: `feature/appointment-search`,
`fix/timezone-offset`. One concern per branch — if a branch needs "and" to
describe it, split it.

Before merging back into `develop`: `npm run typecheck` and `npm run lint` must
both pass, and the app must run. `hotfix/*` merges into `main` **and**
`develop`, otherwise the fix is lost at the next release.

## Commands

| Command             | Purpose                                      |
| ------------------- | -------------------------------------------- |
| `npm start`         | Expo dev server                              |
| `npm run typecheck` | `tsc --noEmit` — must pass before any commit |
| `npm run lint`      | ESLint — must pass before any commit         |
| `npm run format`    | Prettier over `src/`                         |

## Project structure

```
src/app/          Routes only. Thin screens: layout + wiring, no business logic.
src/components/   Generic presentational components. No data fetching.
src/features/     Domain code, grouped by feature (auth, rdv).
  <feature>/
    *-context.tsx        state + operations exposed via a hook
    *-repository.ts      all Appwrite calls for that domain
    types.ts             domain types and derived predicates
    components/          components only this feature uses
src/hooks/        Shared hooks.
src/constants/    theme.ts (design tokens), config.ts (env).
src/lib/          Third-party client setup (Appwrite).
src/utils/        Pure helpers, no React.
```

Rule of thumb: a screen should read as a list of components and handlers. If a
screen contains a fetch, a date calculation, or a status rule, it belongs in
`features/`.

## Naming

- **Files: kebab-case**, always — `appointment-card.tsx`, `use-now.ts`.
  Components inside are PascalCase. This avoids case-sensitivity breakage
  between Windows and CI/Linux, which is painful to debug.
- Booleans read as predicates: `isLoading`, `isOldestFirst`, `canSubmit`.
- Async operations are verbs: `reload`, `create`, `toggleDone`, `remove`.

## Styling

- **No raw hex values or magic numbers in components.** Add a token to
  `src/constants/theme.ts` — `Colors`, `Spacing`, `FontSize`, `FontWeight`,
  `Radius`, `IconSize`. ESLint enforces the colour half of this.
- `StyleSheet.create` at the bottom of the component file, named `styles`.
  There is no global stylesheet; shared visuals become a shared component.
- Use `gap` on the parent for spacing. Never spacer elements or stacked margins.
- The app is **light-only** (`userInterfaceStyle: "light"`). To add dark mode,
  turn each token into a `{ light, dark }` pair behind a `useTheme()` hook —
  do not scatter `useColorScheme()` through components.

## State

- Feature state lives in a context + `useX()` hook that throws when used outside
  its provider. Providers are mounted in `src/app/_layout.tsx`.
- Derived state is **computed, never stored**. "En retard", "À venir" and
  "Aujourd'hui" are functions of `startsAt` + `status` (see
  `features/rdv/types.ts`). Storing them would go stale.
- Pass the current time in as a `now: Date` argument rather than calling
  `new Date()` inside helpers, so one render is internally consistent. Screens
  get it from `useNow()`.

## Appwrite

- One shared client in `src/lib/appwrite.ts`. Never construct a second `Client`
  — sessions would not be shared.
- All queries and mutations go through a repository in the owning feature. UI
  and contexts never import `tables` or `account` directly.
- Every row is created with owner-only permissions (`ownerPermissions`) **and**
  a `userId` column. Permissions enforce access; the column enables querying.
- Config comes from `EXPO_PUBLIC_*` env vars via `src/constants/config.ts`,
  which fails loudly on a missing value. These are embedded in the app bundle
  and readable by anyone — **never put an Appwrite API key in them**.

## Errors

- User-facing strings are French, and specific: "L'enregistrement a échoué."
- Contexts store an `error` string for the screen to render; they do not throw
  into the UI for expected failures.
- Never swallow an error silently unless the failure genuinely does not affect
  the user (reminder scheduling is the one such case, and it is commented).

## Comments

Explain *why*, not *what*. A comment restating the code is noise; a comment
explaining a non-obvious constraint (why reminders are fully rebuilt, why `now`
is passed in) earns its place.
