#!/bin/bash
# Proves the loop is seamless:
#  1. frame 600 (one past the end) renders pixel-identical to frame 0
#  2. the wrap (599 → 0) changes no more than a normal frame step does
#  3. the encoded MP4's wrap is just as smooth
# Run after `npm run encode`. Set CHROME=scripts/chrome.sh in sandboxed shells.
set -euo pipefail
cd "$(dirname "$0")/.."

BROWSER=()
[[ -n "${CHROME:-}" ]] && BROWSER=(--browser-executable="$CHROME")
mkdir -p out/verify
fail=0

ssim() { # prints the SSIM "All" score between two images/videos
  ffmpeg -loglevel error -i "$1" -i "$2" -lavfi ssim=stats_file=- -f null - 2>/dev/null \
    | awk -F'All:' '{split($2,a," "); s+=a[1]; n++} END {printf "%.6f", s/n}'
}

for comp in Wide Mobile; do
  lc=$(tr '[:upper:]' '[:lower:]' <<<"$comp")
  echo "── Hero$comp"

  for f in 0 600; do
    npx remotion still src/index.ts "Hero${comp}Check" "out/verify/$lc-$f.png" --frame=$f \
      ${BROWSER[@]+"${BROWSER[@]}"} --log=error >/dev/null
  done
  a=$(ffmpeg -loglevel error -i "out/verify/$lc-0.png" -f md5 -)
  b=$(ffmpeg -loglevel error -i "out/verify/$lc-600.png" -f md5 -)
  if [[ "$a" == "$b" ]]; then echo "  ✓ frame 600 is pixel-identical to frame 0"
  else
    s=$(ssim "out/verify/$lc-0.png" "out/verify/$lc-600.png")
    echo "  frame 600 vs 0: not bit-identical, SSIM $s"
    awk -v s="$s" 'BEGIN{exit !(s >= 0.9999)}' || { echo "  ✗ loop does not close"; fail=1; }
  fi

  dir="out/$lc"
  if [[ -d "$dir" ]]; then
    frames=("$dir"/*.png)
    n=${#frames[@]}
    seam=$(ssim "${frames[$((n - 1))]}" "${frames[0]}")
    min=1
    for i in 37 113 151 222 299 301 377 449 450 523; do
      v=$(ssim "${frames[$i]}" "${frames[$((i + 1))]}")
      min=$(awk -v a="$min" -v b="$v" 'BEGIN{print (b<a)?b:a}')
    done
    echo "  wrap 599→0 SSIM $seam (lowest normal step $min)"
    awk -v s="$seam" -v m="$min" 'BEGIN{exit !(s >= m - 0.002)}' || { echo "  ✗ wrap is a visible jump"; fail=1; }
  fi

  if [[ -f "out/hero-$lc.mp4" ]]; then
    ffmpeg -loglevel error -y -i "out/hero-$lc.mp4" -vf "select=eq(n\,0)" -frames:v 1 "out/verify/$lc-mp4-first.png"
    ffmpeg -loglevel error -y -sseof -0.1 -i "out/hero-$lc.mp4" -update 1 "out/verify/$lc-mp4-last.png"
    echo "  encoded wrap SSIM $(ssim "out/verify/$lc-mp4-last.png" "out/verify/$lc-mp4-first.png")"
  fi
done

exit $fail
