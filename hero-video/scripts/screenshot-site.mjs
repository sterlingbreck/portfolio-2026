// Dev helper: screenshots the hero of a running site (default: vite preview on 4317)
// at desktop + mobile sizes, after the video has started playing.
import puppeteer from "puppeteer-core";

const url = process.argv[2] ?? "http://localhost:4317/";
const outDir = process.argv[3] ?? "out/site";
const sizes = [
  ["desktop-1440", 1440, 900],
  ["desktop-1920", 1920, 1080],
  ["desktop-1280", 1280, 720],
  ["mobile-390", 390, 844],
];

const browser = await puppeteer.launch({
  executablePath: new URL("./chrome.sh", import.meta.url).pathname,
  args: ["--autoplay-policy=no-user-gesture-required"],
});
const { mkdirSync } = await import("node:fs");
mkdirSync(outDir, { recursive: true });
for (const [name, width, height] of sizes) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const state = await page
    .waitForFunction(() => {
      const v = document.querySelector("section video");
      return v && v.currentTime > 1.5 && { src: v.currentSrc.split("/").pop(), t: v.currentTime };
    }, { timeout: 15000 })
    .then((h) => h.jsonValue())
    .catch(() => "video did not play");
  await new Promise((r) => setTimeout(r, 2500)); // let GSAP text reveal finish
  await page.screenshot({ path: `${outDir}/${name}.png` });
  console.log(name, JSON.stringify(state));
  await page.close();
}
await browser.close();
