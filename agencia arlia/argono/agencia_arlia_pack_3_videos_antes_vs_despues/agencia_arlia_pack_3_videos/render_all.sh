#!/usr/bin/env bash
set -e
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================================="
echo "🚀 INICIANDO RENDER DE LOS 3 VIDEOS (ANTES VS DESPUÉS)"
echo "=========================================================="

for folder in "01_mueblerias_antes_vs_despues" "02_inmobiliarias_antes_vs_despues" "03_talleres_antes_vs_despues"; do
    echo ""
    echo "----------------------------------------------------------"
    echo "▶ Procesando: $folder"
    echo "----------------------------------------------------------"
    # Si logo_cutout está en la raíz del pack, lo copia a cada subcarpeta automáticamente
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
echo "✅ LOS 3 VIDEOS FUERON GENERADOS EXITOSAMENTE"
echo "=========================================================="
ls -lh "$ROOT_DIR"/*/*.mp4
