#!/bin/bash
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
LIB="${LIB:-$HOME/lemo-opuscar}"

echo "=== 1. Generando mezcla de audio y locución ==="
"$LIB/.venv/bin/python" "$HERE/audio/mix.py"

echo "=== 2. Renderizando fotogramas (24 fps, 1080x1920) ==="
node "$LIB/core/render/video.mjs" "$HERE" --fps 24 --size 1080x1920 --workers 2 --out "$HERE/out/video_raw.mp4"

echo "=== 3. Muxing final con audio y normalización (-14 LUFS) ==="
sh "$LIB/core/render/mux.sh" "$HERE/out/video_raw.mp4" "$HERE/audio/mix.wav" "$HERE/bailapp_whatsapp_final.mp4" 24 0

echo "=== Video compilado con éxito: $HERE/bailapp_whatsapp_final.mp4 ==="
