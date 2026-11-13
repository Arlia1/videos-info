#!/usr/bin/env bash
set -e
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=================================================================="
echo " AGENCIA ARLIA — RENDER BATCH DE 5 NICHOS VIRALES (1080x1920)     "
echo "=================================================================="

for folder in 01_farmacias_perfumerias 02_petshops_veterinarias 03_talleres_lubricentros 04_distribuidoras_mayoristas 05_indumentaria_showrooms; do
  echo ""
  echo ">>> Procesando y renderizando nicho viral: $folder ..."
  bash "$ROOT_DIR/$folder/render.sh"
done

echo ""
echo "=================================================================="
echo " ¡LOS 5 VIDEOS VIRALES FUERON GENERADOS CON ÉXITO!                "
echo "=================================================================="
