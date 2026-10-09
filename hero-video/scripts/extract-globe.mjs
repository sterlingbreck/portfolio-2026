// Dev helper: pulls the grey halftone globe dots out of the reference banner
// into src/data/globe-dots.json as [x, y, darkness] in banner pixel space.
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const { data, info } = await sharp("public/banner.png").removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const lum = (x, y) => { const i = (y * W + x) * 3; return [data[i], data[i + 1], data[i + 2]]; };
const isGrey = ([r, g, b]) => Math.max(r, g, b) - Math.min(r, g, b) < 18 && r < 225;

const dots = [];
for (let y = 130; y < 330; y++) {
  for (let x = 60; x < 400; x++) {
    const p = lum(x, y);
    if (!isGrey(p)) continue;
    const v = p[0];
    let isMin = true;
    for (let dy = -1; dy <= 1 && isMin; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const q = lum(x + dx, y + dy)[0];
        if (q < v || (q === v && (dy < 0 || (dy === 0 && dx < 0)))) { isMin = false; break; }
      }
    if (isMin) dots.push([x, y, +((240 - v) / 240).toFixed(2)]);
  }
}
writeFileSync("src/data/globe-dots.json", JSON.stringify(dots));
console.log(dots.length, "dots");
