#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { existsSync, statSync } from 'node:fs';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { writeFile } from 'node:fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SOURCE = resolve(ROOT, 'scripts/source-favicon.png');
const PUBLIC = resolve(ROOT, 'public');

if (!existsSync(SOURCE)) {
  console.error(`✗ Source image not found at ${SOURCE}`);
  console.error('  Drop a square, high-resolution PNG (1024x1024 recommended) at scripts/source-favicon.png and re-run.');
  process.exit(1);
}

const meta = await sharp(SOURCE).metadata();
if (meta.width !== meta.height) {
  console.error(`✗ Source image must be square (got ${meta.width}x${meta.height}).`);
  process.exit(1);
}
if (meta.width < 512) {
  console.warn(`⚠ Source is ${meta.width}x${meta.height} — recommended minimum is 512x512 (1024x1024 ideal). Continuing.`);
}

const PNG_OUTPUTS = [
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'web-app-manifest-192x192.png', size: 192 },
  { name: 'web-app-manifest-512x512.png', size: 512 },
];

const ICO_SIZES = [16, 32, 48];

async function renderPng(size) {
  return sharp(SOURCE)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

const summary = [];

for (const { name, size } of PNG_OUTPUTS) {
  const out = resolve(PUBLIC, name);
  const buf = await renderPng(size);
  await writeFile(out, buf);
  summary.push({ file: name, size: `${size}x${size}`, bytes: statSync(out).size });
}

const icoBuffers = await Promise.all(ICO_SIZES.map(renderPng));
const icoOut = resolve(PUBLIC, 'favicon.ico');
await writeFile(icoOut, await pngToIco(icoBuffers));
summary.push({ file: 'favicon.ico', size: ICO_SIZES.map(s => `${s}x${s}`).join(','), bytes: statSync(icoOut).size });

console.log('\n✓ Favicons generated:\n');
for (const row of summary) {
  console.log(`  public/${row.file.padEnd(34)} ${row.size.padEnd(14)} ${(row.bytes / 1024).toFixed(2)} KB`);
}
console.log();
