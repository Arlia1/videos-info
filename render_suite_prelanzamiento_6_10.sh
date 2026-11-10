#!/usr/bin/env bash
set -e

WORKSPACE="/home/yoel1/Escritorio/videitos"
OUT_DIR="$WORKSPACE/PRE-LANZAMIENTO"
mkdir -p "$OUT_DIR"

echo "=========================================================="
echo "=== RENDERIZANDO SUITE PRE-LANZAMIENTO (VIDEOS 6 AL 10) ==="
echo "=========================================================="

VIDEOS=(
  "video_prelanzamiento_6_test_estilos:video_prelanzamiento_6_final.mp4:video_prelanzamiento_6_test_estilos"
  "video_prelanzamiento_7_travelling_pies_5_estilos:video_prelanzamiento_7_final.mp4:video_prelanzamiento_7_travelling_pies_5_estilos"
  "video_prelanzamiento_8_estudios_argentina:video_prelanzamiento_8_final.mp4:video_prelanzamiento_8_estudios_argentina"
  "video_prelanzamiento_9_viernes_pide_pista:video_prelanzamiento_9_final.mp4:video_prelanzamiento_9_viernes_pide_pista"
  "video_prelanzamiento_10_cuenta_regresiva_secreta:video_prelanzamiento_10_final.mp4:video_prelanzamiento_10_cuenta_regresiva_secreta"
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

  echo ">>> Copiando entregables a $OUT_DIR..."
  cp "$DIR_PATH/$FINAL_NAME" "$OUT_DIR/$TARGET_NAME.mp4"
  cp "$DIR_PATH/copy.txt" "$OUT_DIR/$TARGET_NAME.txt"
  echo "✓ Completado: $OUT_DIR/$TARGET_NAME.mp4"
done

echo "=========================================================="
echo "✓ SUITE COMPLETA (6 AL 10) FINALIZADA EN $OUT_DIR"
echo "=========================================================="
ls -lh "$OUT_DIR"
