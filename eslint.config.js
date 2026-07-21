// https://docs.expo.dev/guides/using-eslint/
const {defineConfig} = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
// Turns off every rule that would fight Prettier's formatting.
const prettierConfig = require("eslint-config-prettier");

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  {
    ignores: ["dist/*", "node_modules/*", ".expo/*"],
  },
  {
    // Build tooling runs in Node, not React Native.
    files: ["scripts/**/*.mjs", "*.config.js"],
    languageOptions: {globals: {...require("globals").node}},
  },
  {
    // Scoped to TypeScript: the @typescript-eslint plugin is only registered
    // for these files, so applying its rules globally errors out the moment a
    // plain .js or .mjs file is linted.
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Keep imports honest — unused ones are almost always a leftover.
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {argsIgnorePattern: "^_", varsIgnorePattern: "^_"},
      ],
      // `export const X = {...} as const` next to `export type X = ...` is the
      // enum pattern we use throughout; the redeclare warning is a false positive.
      "@typescript-eslint/no-redeclare": "off",
    },
  },
  {
    // Raw colours belong in src/constants/theme.ts.
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/constants/theme.ts"],
    rules: {
      "no-restricted-syntax": [
        "warn",
        {
          selector: "Literal[value=/^#[0-9a-fA-F]{3,8}$/]",
          message:
            "Pas de couleur en dur — ajoutez un token dans src/constants/theme.ts.",
        },
      ],
    },
  },
]);
