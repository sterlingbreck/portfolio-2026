#!/bin/bash
# Renders both hero compositions and encodes the web deliverables:
#   out/hero-{wide,mobile}.mp4   H.264, yuv420p, faststart (universal)
#   out/hero-{wide,mobile}.webm  VP9 (smaller, Chrome/Firefox/Edge/Safari 17+)
#   out/hero-{wide,mobile}-poster.webp  frame 0 (= last frame + 1 of the loop)
# Usage: npm run encode            (set CHROME=scripts/chrome.sh in sandboxed shells)
set -euo pipefail
cd "$(dirname "$0")/.."

BROWSER=()
[[ -n "${CHROME:-}" ]] && BROWSER=(--browser-executable="$CHROME")

node scripts/check-tags.mjs

for comp in wide mobile; do
  id="Hero$(tr '[:lower:]' '[:upper:]' <<<"${comp:0:1}")${comp:1}"
  rm -rf "out/$comp"
  npx remotion render src/index.ts "$id" "out/$comp" --sequence --image-format=png ${BROWSER[@]+"${BROWSER[@]}"}

  frames=(-framerate 30 -pattern_type glob -i "out/$comp/*.png")
  color=(-colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv)

  ffmpeg -y -loglevel error "${frames[@]}" \
    -vf "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p" \
    -c:v libx264 -preset veryslow -tune animation -crf 23 -profile:v high \
    -g 300 "${color[@]}" -movflags +faststart -an "out/hero-$comp.mp4"

  ffmpeg -y -loglevel error "${frames[@]}" \
    -vf "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p" \
    -c:v libvpx-vp9 -b:v 0 -crf 33 -row-mt 1 -deadline good -cpu-used 1 -g 300 \
    "${color[@]}" -pass 1 -passlogfile "out/vp9-$comp" -an -f null /dev/null
  ffmpeg -y -loglevel error "${frames[@]}" \
    -vf "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p" \
    -c:v libvpx-vp9 -b:v 0 -crf 33 -row-mt 1 -deadline good -cpu-used 1 -g 300 \
    "${color[@]}" -pass 2 -passlogfile "out/vp9-$comp" -an "out/hero-$comp.webm"

  first=$(ls "out/$comp"/*.png | head -1)
  poster_width=$([[ $comp == wide ]] && echo 1600 || echo 900)
  node -e "require('sharp')(process.argv[1]).resize(+process.argv[3]).webp({quality:82}).toFile(process.argv[2])" \
    "$first" "out/hero-$comp-poster.webp" "$poster_width"
done

ls -lh out/hero-*
