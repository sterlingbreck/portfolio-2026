# Hero video

Seamless 20 s loop (30 fps, 600 frames) used as the portfolio hero background. Built with Remotion and kept separate from the site build. Cloudflare never installs it.

- **HeroWide**: 2400×800 (3:1), used at ≥768px.
- **HeroMobile**: 1200×900 (4:3), a crop of the same scene with larger labels.

## Commands

```bash
npm install
npm run check    # skills still match the 4 most recent projects in ../src/data/projects.ts
npm run studio   # live preview; set the `debug` prop to overlay the original banner + headline safe zones
npm run encode   # render frames → out/hero-{wide,mobile}.{mp4,webm} + posters
npm run verify   # frame 600 === frame 0, and the wrap is as smooth as any other frame step
cp out/hero-*.{mp4,webm,webp} ../src/assets/hero/
```

In sandboxed shells, headless Chrome's GPU helper can crash. In that case, prefix commands with `CHROME=scripts/chrome.sh`, which keeps GPU work in-process.

## How the loop stays seamless

All motion goes through `src/loop.ts`:
- `phase = frame / 600`
- only integer cycles per loop (`osc`, `saw`)
- dash offsets that move by whole pattern lengths

No CSS animations and no unseeded randomness.

## Editing skills

`src/data/chapters.ts` holds one chapter per project.
- Each label has a fixed slot, so a skill shared by consecutive projects stays on screen instead of re-animating.
- Slot positions live in `src/layouts.ts`.
- If projects are reordered or a tag is renamed, `npm run check` fails until `chapters.ts` is updated.
