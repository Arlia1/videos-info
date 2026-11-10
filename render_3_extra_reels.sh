#!/usr/bin/env bash
set -e

WORKSPACE="/home/yoel1/Escritorio/videitos"
OUT_DIR="$WORKSPACE/VIDEOS_10-11"
mkdir -p "$OUT_DIR"

echo "=========================================================="
echo "=== RENDERIZANDO LOS 3 REELS 3D LOWPOLY RESTANTES ==="
echo "=========================================================="

REELS=(
  "bailapp_lowpoly3d_characters_reel:bailapp_lowpoly3d_final.mp4:video_viral_7_crew_amigas"
  "bailapp_lowpoly3d_dm_drama_reel:bailapp_dm_drama_final.mp4:video_viral_8_dm_drama"
  "bailapp_lowpoly3d_v2_reel:bailapp_lowpoly3d_v2_final.mp4:video_viral_9_catalogo_estilos"
)

for entry in "${REELS[@]}"; do
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
echo "✓ TODOS LOS VIDEOS EXTRA Y SUS COPYS COMPLETADOS EN $OUT_DIR"
echo "=========================================================="
ls -lh "$OUT_DIR"
