#!/usr/bin/env bash
set -e

WORKSPACE="/home/yoel1/Escritorio/videitos"
OUT_DIR="$WORKSPACE/PRE-LANZAMIENTO"
mkdir -p "$OUT_DIR"

echo "=========================================================="
echo "=== RENDERIZANDO VIDEOS 4 Y 5 DE PRE-LANZAMIENTO ==="
echo "=========================================================="

VIDEOS=(
  "video_prelanzamiento_4_detras_de_escena_hype:video_prelanzamiento_4_final.mp4:video_prelanzamiento_4_detras_de_escena_hype"
  "video_prelanzamiento_5_amiga_arrancamos:video_prelanzamiento_5_final.mp4:video_prelanzamiento_5_amiga_arrancamos"
)

for entry in "${VIDEOS[@]}"; do
  IFS=":" read -r DIR_NAME FINAL_NAME TARGET_NAME <<< "$entry"
  DIR_PATH="$WORKSPACE/$DIR_NAME"

  echo "=========================================================="
  echo ">>> INICIANDO RENDER DE: $DIR_NAME"
  echo "=========================================================="

  cd "$DIR_PATH"
  chmod +x render.sh
  ./render.sh

  echo ">>> Copiando entregable a $OUT_DIR..."
  cp "$DIR_PATH/$FINAL_NAME" "$OUT_DIR/$TARGET_NAME.mp4"
  cp "$DIR_PATH/copy.txt" "$OUT_DIR/$TARGET_NAME.txt"
  echo "✓ Completado: $OUT_DIR/$TARGET_NAME.mp4"
done

echo "=========================================================="
echo "✓ SUITE COMPLETA PRE-LANZAMIENTO FINALIZADA EN $OUT_DIR"
echo "=========================================================="
ls -lh "$OUT_DIR"
