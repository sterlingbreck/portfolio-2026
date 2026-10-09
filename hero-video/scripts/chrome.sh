#!/bin/bash
# Runs Remotion's bundled headless Chrome with GPU work kept in-process
# (separate GPU helper processes crash in some sandboxed shells).
DIR="$(cd "$(dirname "$0")/.." && pwd)"
exec "$DIR/node_modules/.remotion/chrome-headless-shell/mac-arm64/chrome-headless-shell-mac-arm64/chrome-headless-shell" \
  --in-process-gpu --disable-gpu-compositing "$@"
