#!/usr/bin/env bash
set -e

WORKSPACE="/home/yoel1/Escritorio/videitos"
OUT_DIR="$WORKSPACE/VIDEOS_10-11"
mkdir -p "$OUT_DIR"

echo "=== RENDERIZANDO SUITE COMPLETA 3D LOWPOLY BAILAPP ==="

# Video 1:
if [ -f "$WORKSPACE/video_viral_1_dos_pies_izquierdos/video_viral_1_final.mp4" ]; then
  echo "Video 1 ya generado, copiando a $OUT_DIR..."
  cp "$WORKSPACE/video_viral_1_dos_pies_izquierdos/video_viral_1_final.mp4" "$OUT_DIR/video_viral_1_dos_pies_izquierdos.mp4"
  cp "$WORKSPACE/video_viral_1_dos_pies_izquierdos/copy.txt" "$OUT_DIR/video_viral_1_dos_pies_izquierdos.txt"
fi

VIDEOS=(
  "video_viral_2_gym_vs_dance:video_viral_2_final.mp4:video_viral_2_gym_vs_dance"
  "video_viral_3_transferencias_drama:video_viral_3_final.mp4:video_viral_3_transferencias_drama"
  "video_viral_4_finde_sin_plan:video_viral_4_final.mp4:video_viral_4_finde_sin_plan"
  "video_viral_5_heels_glowup:video_viral_5_final.mp4:video_viral_5_heels_glowup"
  "video_viral_6_del_cuarto_al_estudio:video_viral_6_final.mp4:video_viral_6_del_cuarto_al_estudio"
)

for entry in "${VIDEOS[@]}"; do
  IFS=":" read -r DIR_NAME FINAL_NAME TARGET_NAME <<< "$entry"
  DIR_PATH="$WORKSPACE/$DIR_NAME"
  
  echo "=========================================================="
  echo ">>> PROCESANDO $DIR_NAME"
  echo "=========================================================="
  
  cd "$DIR_PATH"
  chmod +x render.sh
  ./render.sh
  
  echo ">>> Copiando video y copy a $OUT_DIR..."
  cp "$DIR_PATH/$FINAL_NAME" "$OUT_DIR/$TARGET_NAME.mp4"
  cp "$DIR_PATH/copy.txt" "$OUT_DIR/$TARGET_NAME.txt"
  echo "✓ Completado: $OUT_DIR/$TARGET_NAME.mp4"
done

echo "=========================================================="
echo "✓ TODOS LOS VIDEOS Y COPYS GENERADOS EXITOSAMENTE EN $OUT_DIR"
echo "=========================================================="
ls -lh "$OUT_DIR"
