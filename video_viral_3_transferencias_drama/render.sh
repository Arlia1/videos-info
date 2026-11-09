#!/usr/bin/env bash
set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "$DIR/out"

echo "=== 1. Renderizando video raw con Chromium SwiftShader (24 fps, 1080x1920, 25s) ==="
LEMO_ANGLE=swiftshader node "$HOME/lemo-opuscar/core/render/video.mjs" "$DIR" --fps 24 --workers 2 --size 1080x1920 --out "$DIR/out/video_raw.mp4"

echo "=== 2. Muxeando con audio EBU R128 (-14 LUFS) y grano 0 ==="
sh "$HOME/lemo-opuscar/core/render/mux.sh" "$DIR/out/video_raw.mp4" "$DIR/audio/mix.wav" "$DIR/video_viral_3_final.mp4" 24 0

echo "=== Render Completo: $DIR/video_viral_3_final.mp4 ==="
