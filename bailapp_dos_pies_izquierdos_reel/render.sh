#!/bin/bash
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
LIB="${LIB:-$HOME/lemo-opuscar}"

echo "=== 1. Verificando mezcla de audio ==="
if [ ! -f "$HERE/audio/mix.wav" ]; then
  "$LIB/.venv/bin/python" "$HERE/audio/mix.py"
fi

echo "=== 2. Limpiando locks previos y preparando directorio ==="
mkdir -p "$HERE/out"
rm -f "$HERE/out/video_raw.mp4.lock"
rm -f "$HERE/out/video_raw.mp4"
rm -rf "$HERE/out/."*_segs-*

echo "=== 3. Renderizando fotogramas (24 fps, 1080x1920) ==="
node "$LIB/core/render/video.mjs" "$HERE" --fps 24 --size 1080x1920 --workers 2 --out "$HERE/out/video_raw.mp4"

echo "=== 4. Muxing final con audio y normalización (-14 LUFS) ==="
sh "$LIB/core/render/mux.sh" "$HERE/out/video_raw.mp4" "$HERE/audio/mix.wav" "$HERE/bailapp_dos_pies_izquierdos_final.mp4" 24 0

echo "=== Video compilado con éxito: $HERE/bailapp_dos_pies_izquierdos_final.mp4 ==="
