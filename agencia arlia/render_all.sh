#!/usr/bin/env bash
set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "$DIR/out"

echo "=========================================================="
echo " AGENCIA ARLIA — RENDERIZADOR BATCH DE SUITE DE 6 VIDEOS  "
echo " Formato: 1080x1920 (9:16 vertical), 24 FPS, EBU R128 (-14 LUFS)"
echo "=========================================================="

VIDEOS=(
  "video_1_gastronomia|audio/mix_1_gastronomia.wav|agencia_arlia_1_gastronomia.mp4"
  "video_2_estetica|audio/mix_2_estetica.wav|agencia_arlia_2_estetica_turnos.mp4"
  "video_3_inmobiliaria|audio/mix_3_inmobiliaria.wav|agencia_arlia_3_inmobiliaria_catalogo.mp4"
  "video_4_rediseno_web|audio/mix_4_rediseno_web.wav|agencia_arlia_4_rediseno_web.mp4"
  "video_5_corralon_ferreteria|audio/mix_5_corralon_ferreteria.wav|agencia_arlia_5_corralon_ferreteria.mp4"
  "video_6_videos_virales|audio/mix_6_videos_virales.wav|agencia_arlia_6_videos_virales.mp4"
)

# Allow selecting a single video index via argument: ./render_all.sh [1-6]
TARGET_INDEX="${1:-all}"

IDX=1
for item in "${VIDEOS[@]}"; do
  IFS="|" read -r VID_ID AUDIO_FILE OUT_NAME <<< "$item"
  
  if [ "$TARGET_INDEX" != "all" ] && [ "$TARGET_INDEX" != "$IDX" ]; then
    IDX=$((IDX + 1))
    continue
  fi

  echo ""
  echo ">>> [VIDEO $IDX/6] Renderizando: $OUT_NAME ($VID_ID) <<<"
  
  RAW_OUT="$DIR/out/raw_${VID_ID}.mp4"
  FINAL_OUT="$DIR/$OUT_NAME"
  AUDIO_PATH="$DIR/$AUDIO_FILE"

  # Limpiar posibles bloqueos anteriores
  rm -f "$RAW_OUT.lock" "$FINAL_OUT.lock"

  echo "  1. Generando frames con Chromium SwiftShader (24 fps, 1080x1920)..."
  LEMO_ANGLE=swiftshader node "$HOME/lemo-opuscar/core/render/video.mjs" "$DIR" \
    --fps 24 \
    --workers 3 \
    --size 1080x1920 \
    --q "v=$VID_ID" \
    --out "$RAW_OUT"

  echo "  2. Muxeando video raw con audio masterizado (-14 LUFS, AAC 256k)..."
  sh "$HOME/lemo-opuscar/core/render/mux.sh" "$RAW_OUT" "$AUDIO_PATH" "$FINAL_OUT" 24 0

  echo "  ✓ Video $IDX completado: $FINAL_OUT"
  ls -lh "$FINAL_OUT"

  # Limpieza de temporal crudo para no saturar disco
  rm -f "$RAW_OUT"

  IDX=$((IDX + 1))
done

echo ""
echo "=========================================================="
echo " ¡TODOS LOS VIDEOS FUERON RENDERIZADOS EXITOSAMENTE!      "
echo "=========================================================="
ls -lh "$DIR"/agencia_arlia_*.mp4
