// Dev helper: samples the reference banner to recover wave edges and node positions.
import sharp from "sharp";

const { data, info } = await sharp("public/banner.png").removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;
const px = (x, y) => { const i = (y * W + x) * 3; return [data[i], data[i + 1], data[i + 2]]; };
const cls = ([r, g, b]) => {
  if (r > 190 && g > 50 && g < 200 && b < 110 && r - b > 120) return "O";
  if (r < 110 && g < 110 && b < 110) return "D";
  if (r < 200 && Math.abs(r - g) < 14 && Math.abs(g - b) < 14) return "g";
  return ".";
};
const mode = process.argv[2] ?? "cols";
if (mode === "cols") {
  for (let x = 0; x < W; x += 33) {
    const runs = []; let cur = null, start = 0;
    for (let y = 0; y < H; y++) {
      const c = cls(px(x, y));
      if (c !== cur) { if (cur && cur !== "." && y - start > 2) runs.push(`${cur}${start}-${y - 1}`); cur = c; start = y; }
    }
    if (cur && cur !== ".") runs.push(`${cur}${start}-${H - 1}`);
    console.log(x, runs.join(" "));
  }
}
