#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { statSync } from 'node:fs';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT = resolve(ROOT, 'public/og-image.png');

const WIDTH = 1200;
const HEIGHT = 630;

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#0a0a0a" />
  <rect x="100" y="252" width="72" height="2" fill="#666666" />
  <text x="100" y="332" font-family="Georgia, 'Times New Roman', serif" font-size="76" letter-spacing="2" fill="#f5f5f5">STERLING BRECKENRIDGE</text>
  <text x="100" y="400" font-family="Helvetica, Arial, sans-serif" font-size="30" letter-spacing="1" fill="#a3a3a3">Developer&#160;&#160;·&#160;&#160;Technical Project Manager</text>
  <text x="100" y="548" font-family="Helvetica, Arial, sans-serif" font-size="21" letter-spacing="1" fill="#666666">Nissan&#160;&#160;·&#160;&#160;Capital Group&#160;&#160;·&#160;&#160;Akamai&#160;&#160;·&#160;&#160;Accenture</text>
  <text x="1100" y="548" text-anchor="end" font-family="Helvetica, Arial, sans-serif" font-size="21" letter-spacing="1" fill="#666666">nyk-nyc.com</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(OUT);

const { size } = statSync(OUT);
console.log(`✓ public/og-image.png  ${WIDTH}x${HEIGHT}  ${(size / 1024).toFixed(2)} KB`);
