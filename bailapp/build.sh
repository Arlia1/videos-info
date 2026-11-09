#!/bin/sh
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$HOME/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the library folder"; exit 1; }
cd "$LIB"

echo "=== 1. Synthesizing Audio & Music ==="
"$LIB/.venv/bin/python" "$HERE/mix.py"

echo "=== 2. Rendering Video Frames (24 fps, 1080x1920) ==="
node core/render/video.mjs "$HERE" --fps 24 --size 1080x1920 --workers 2 --out "$HERE/out/video.mp4"

echo "=== 3. Final Muxing & Loudness Normalization (-14 LUFS) ==="
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/bailapp.mp4" 24 0

echo "=== Video built successfully at $HERE/bailapp.mp4 ==="
