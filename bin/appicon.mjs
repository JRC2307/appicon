#!/usr/bin/env node
// appicon — render a square glyph SVG into the standard web-app icon set.
// Usage: appicon <icon.svg> --out <dir> [--name <project>] [--data-uri]
import { copyFile, mkdir, readFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import sharp from "sharp";

const SIZES = [
  { file: "apple-touch-icon.png", px: 180 },
  { file: "icon-192.png", px: 192 },
  { file: "icon-512.png", px: 512 },
  { file: "favicon.png", px: 48 },
];

function usage(msg) {
  if (msg) console.error(`appicon: ${msg}`);
  console.error(`usage: appicon <icon.svg> --out <dir> [--name <project>] [--data-uri]

  --out <dir>   where to write the icon set (the app's static dir)
  --name <p>    label used in output messages (default: svg filename)
  --data-uri    also print the apple-touch-icon as a base64 <link> tag, for
                servers that can only serve a single HTML file`);
  process.exit(1);
}

const args = process.argv.slice(2);
let svgPath, outDir, name, dataUri = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--out") outDir = args[++i];
  else if (args[i] === "--name") name = args[++i];
  else if (args[i] === "--data-uri") dataUri = true;
  else if (args[i] === "--help" || args[i] === "-h") usage();
  else if (!svgPath) svgPath = args[i];
  else usage(`unexpected argument: ${args[i]}`);
}
if (!svgPath || !outDir) usage();
svgPath = resolve(svgPath);
outDir = resolve(outDir);
name ??= basename(svgPath, ".svg");

const svg = await readFile(svgPath);
await mkdir(outDir, { recursive: true });

for (const { file, px } of SIZES) {
  await sharp(svg, { density: 300 })
    .resize(px, px, { fit: "cover" })
    .png()
    .toFile(join(outDir, file));
}
await copyFile(svgPath, join(outDir, "icon.svg"));

console.log(`${name}: wrote ${SIZES.map((s) => s.file).join(", ")} + icon.svg → ${outDir}\n`);
console.log(`Paste into <head> (adjust href prefix to where these are served from):

  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="48x48" href="/favicon.png">

Next.js app router instead: copy apple-touch-icon.png to app/apple-icon.png and
icon-512.png to app/icon.png — no tags needed.`);

if (dataUri) {
  const b64 = (await readFile(join(outDir, "apple-touch-icon.png"))).toString("base64");
  console.log(`\nSingle-file-server embed (~${Math.round((b64.length / 1024) * 10) / 10} KB inline):

  <link rel="apple-touch-icon" href="data:image/png;base64,${b64}">`);
}
