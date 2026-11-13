#!/usr/bin/env bash
set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "$DIR/out"

echo "=== 1. Generando Audio Master (Voz Argentina + Score Antes vs Después: Talleres Mecánicos & Lubricentros) ==="
/home/y/lemo-opuscar/.venv/bin/python "$DIR/audio/generate_voice.py"
/home/y/lemo-opuscar/.venv/bin/python "$DIR/audio/mix.py"

echo "=== 2. Renderizando video raw con Chromium SwiftShader (24 fps, 1080x1920, 20.8s) ==="
LEMO_ANGLE=swiftshader node "$HOME/lemo-opuscar/core/render/video.mjs" "$DIR" --fps 24 --workers 2 --size 1080x1920 --out "$DIR/out/video_raw.mp4"

echo "=== 3. Muxeando con audio EBU R128 (-14 LUFS) y grano 0 (Estilo 2D Vectorial Limpio) ==="
sh "$HOME/lemo-opuscar/core/render/mux.sh" "$DIR/out/video_raw.mp4" "$DIR/audio/mix.wav" "$DIR/agencia_arlia_talleres_antes_despues.mp4" 24 0

echo "=== 4. Render Completo Exitoso: $DIR/agencia_arlia_talleres_antes_despues.mp4 ==="
ls -lh "$DIR/agencia_arlia_talleres_antes_despues.mp4"
