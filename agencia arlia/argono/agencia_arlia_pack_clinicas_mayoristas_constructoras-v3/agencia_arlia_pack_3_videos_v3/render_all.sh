#!/usr/bin/env bash
set -e
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================================="
echo "🚀 INICIANDO RENDER DEL PACK V3 (CLÍNICAS, MAYORISTAS B2B, CONSTRUCTORAS)"
echo "=========================================================="

for folder in "01_clinicas_estetica_y_odontologia" "02_mayoristas_y_distribuidoras_b2b" "03_constructoras_arquitectura_y_hogar"; do
    echo ""
    echo "----------------------------------------------------------"
    echo "▶ Procesando: $folder"
    echo "----------------------------------------------------------"
    for ext in png webp svg jpg ""; do
         candidate="$ROOT_DIR/logo_cutout${ext:+.$ext}"
         if [ -f "$candidate" ]; then
             cp -f "$candidate" "$ROOT_DIR/$folder/"
         fi
    done
    bash "$ROOT_DIR/$folder/render.sh"
done

echo ""
echo "=========================================================="
echo "✅ LOS 3 VIDEOS DEL PACK V3 FUERON GENERADOS EXITOSAMENTE"
echo "=========================================================="
ls -lh "$ROOT_DIR"/*/*.mp4
