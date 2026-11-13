#!/usr/bin/env bash
set -e
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================================="
echo "🚀 INICIANDO RENDER DEL PACK V2 (INMOBILIARIAS, CONCESIONARIOS, TALLERES)"
echo "=========================================================="

for folder in "01_inmobiliarias_captacion_y_visitas" "02_concesionarios_antes_vs_despues" "03_talleres_presupuestos_y_repuestos"; do
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
echo "✅ LOS 3 VIDEOS NUEVOS FUERON GENERADOS EXITOSAMENTE"
echo "=========================================================="
ls -lh "$ROOT_DIR"/*/*.mp4
