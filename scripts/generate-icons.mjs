/**
 * Renders every app icon from assets/logo/mark.svg.
 *
 * Run with `npm run icons` after editing the SVG. The PNGs it writes are
 * committed so builds do not depend on this script, but they are generated
 * output — edit the SVG, never the PNGs.
 */
import {mkdir, readFile, writeFile} from "node:fs/promises";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const markPath = join(root, "assets/logo/mark.svg");
const imagesDir = join(root, "assets/images");

// Mirrors src/constants/theme.ts. Kept in sync by hand — there are only two.
const ACCENT = "#3ECB9C";
const WHITE = "#FFFFFF";

const template = await readFile(markPath, "utf8");

/** The colour the SVG is authored in, swapped out per target. */
const SOURCE_COLOR = ACCENT;

/**
 * @param color   fill for the glyph
 * @param scale   glyph size as a fraction of the canvas
 * @param bg      background colour, or null for transparency
 */
async function render({size, color, scale, bg}) {
  const glyphSize = Math.round(size * scale);
  const glyph = await sharp(
    Buffer.from(template.replaceAll(SOURCE_COLOR, color)),
  )
    .resize(glyphSize, glyphSize)
    .png()
    .toBuffer();

  const canvas = sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: bg ?? {r: 0, g: 0, b: 0, alpha: 0},
    },
  });

  return canvas.composite([{input: glyph, gravity: "centre"}]).png().toBuffer();
}

const targets = [
  // Store / launcher icon. Green field, white glyph — mint-on-green reads as
  // washed out at 48dp, so the in-app pairing is inverted here.
  {file: "icon.png", size: 1024, color: WHITE, scale: 0.62, bg: ACCENT},

  // Android adaptive foreground. The outer ~33% is cropped by the launcher
  // mask, so the glyph has to stay well inside the safe zone.
  {
    file: "android-icon-foreground.png",
    size: 1024,
    color: WHITE,
    scale: 0.5,
    bg: null,
  },
  {
    file: "android-icon-background.png",
    size: 1024,
    color: ACCENT,
    scale: 0,
    bg: ACCENT,
  },
  // Themed icons are tinted by the launcher, so this one is a silhouette.
  {
    file: "android-icon-monochrome.png",
    size: 1024,
    color: WHITE,
    scale: 0.5,
    bg: null,
  },

  // Splash sits on the light app background, so the glyph is green here.
  {file: "splash-icon.png", size: 512, color: ACCENT, scale: 0.9, bg: null},

  {file: "favicon.png", size: 196, color: WHITE, scale: 0.62, bg: ACCENT},
];

await mkdir(imagesDir, {recursive: true});

for (const {file, ...options} of targets) {
  const png =
    options.scale === 0
      ? await sharp({
          create: {
            width: options.size,
            height: options.size,
            channels: 4,
            background: options.bg,
          },
        })
          .png()
          .toBuffer()
      : await render(options);

  await writeFile(join(imagesDir, file), png);
  console.log(`wrote assets/images/${file}`);
}
