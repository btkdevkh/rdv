/**
 * Design tokens, matched to the existing web version of Rendez-vous.
 * Components must not contain raw hex values or magic numbers — add a token here.
 *
 * The app is light-only (`userInterfaceStyle: "light"` in app.json). To add dark
 * mode later, turn each colour into a { light, dark } pair and read it through a
 * `useTheme()` hook instead of importing `Colors` directly.
 */

export const Colors = {
  /** Green accent: app icon, avatar, "À venir" badges. */
  accent: "#3ECB9C",
  accentSurface: "#ECFDF5",

  /** Primary actions ("Ajouter", active filter chip) are black on the web app. */
  primary: "#16181D",
  onPrimary: "#FFFFFF",

  /** Late appointments. */
  danger: "#E5484D",
  dangerSurface: "#FEF2F2",

  background: "#F7F8F9",
  card: "#FFFFFF",
  border: "#E8EAED",
  /** Neutral chip / "Terminé" badge background. */
  neutralSurface: "#F1F3F5",

  text: "#1A1D1F",
  textMuted: "#969FAA",
  /** Titles of completed appointments (struck through). */
  textDisabled: "#B4BAC1",

  /** Dimmed layer behind modals and popovers. */
  backdrop: "rgba(0, 0, 0, 0.15)",
  shadow: "#000000",
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  title: 33,
} as const;

export const FontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const IconSize = {
  sm: 16,
  md: 18,
  lg: 24,
  xl: 34,
} as const;
