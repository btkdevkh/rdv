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
      // Raw colours and one-off spacing belong in src/constants/theme.ts.
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
  {
    // The theme file is where the raw values are allowed to live.
    files: ["src/constants/theme.ts"],
    rules: {"no-restricted-syntax": "off"},
  },
]);
