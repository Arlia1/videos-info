// ============================================================================
// BAILAPP 3D SHARED ASSET LIBRARY: STAGE STUDIO (ESTUDIO PROFESIONAL BAILAPP)
// ============================================================================

import * as THREE from '../three.module.js';
import { createLowPolyMaterial } from '../characters/character_builder.js';

export function createStageStudio() {
  const stage = new THREE.Group();
  const subwoofers = [];

  // 1. Piso de danza profesional amplio (parquet claro rosado pulido)
  const floorGeo = new THREE.BoxGeometry(5.4, 0.2, 4.8);
  const floorMat = createLowPolyMaterial('#F5EDE8', 0.5, 0.08); // leve brillo de piso pulido
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.y = -0.1;
  floor.receiveShadow = true;
  stage.add(floor);

  // Tablones de parquet facetados marcados sutilmente
  for (let i = -4; i <= 4; i++) {
    const lineGeo = new THREE.BoxGeometry(0.015, 0.005, 4.6);
    const lineMat = createLowPolyMaterial('#E5D3C7');
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.position.set(i * 0.55, 0.005, 0);
    stage.add(line);
  }

  // 2. Pared de fondo con Espejos Gigantes de Estudio
  const wallMat = createLowPolyMaterial('#FFF0F5', 0.9);
  const backWallGeo = new THREE.BoxGeometry(5.4, 4.2, 0.15);
  const backWall = new THREE.Mesh(backWallGeo, wallMat);
  backWall.position.set(0, 2.0, -2.4);
  backWall.receiveShadow = true;
  stage.add(backWall);

  // Marco del gran espejo
  const mirrorFrameGeo = new THREE.BoxGeometry(4.6, 2.8, 0.08);
  const mirrorFrameMat = createLowPolyMaterial('#E06385', 0.7); // Marco frambuesa Bailapp
  const mirrorFrame = new THREE.Mesh(mirrorFrameGeo, mirrorFrameMat);
  mirrorFrame.position.set(0, 1.8, -2.32);
  stage.add(mirrorFrame);

  // Cristal del espejo con reflejo brillante
  const mirrorGlassGeo = new THREE.BoxGeometry(4.4, 2.6, 0.02);
  const mirrorGlassMat = createLowPolyMaterial('#E8F4FD', 0.15, 0.7);
  const mirrorGlass = new THREE.Mesh(mirrorGlassGeo, mirrorGlassMat);
  mirrorGlass.position.set(0, 1.8, -2.27);
  stage.add(mirrorGlass);

  // Barra de danza clásica a lo largo del espejo
  const barGeo = new THREE.CylinderGeometry(0.028, 0.028, 4.4, 8);
  const barMat = createLowPolyMaterial('#D8C2B0');
  const bar = new THREE.Mesh(barGeo, barMat);
  bar.rotation.z = Math.PI / 2;
  bar.position.set(0, 1.05, -2.15);
  stage.add(bar);

  // 3. Sistema de Sonido / Subwoofers Pro a los laterales
  [-2.2, 2.2].forEach((xPos, idx) => {
    const speakerGroup = new THREE.Group();
    speakerGroup.position.set(xPos, 0, -1.6);
    speakerGroup.rotation.y = idx === 0 ? 0.35 : -0.35;
    stage.add(speakerGroup);

    // Caja acústica
    const bodyGeo = new THREE.BoxGeometry(0.65, 1.25, 0.65);
    const bodyMat = createLowPolyMaterial('#1F2937');
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.625;
    body.castShadow = true;
    speakerGroup.add(body);

    // Conos de altavoz (woofer) pulsantes
    const coneMat = createLowPolyMaterial('#E06385');
    [0.35, 0.85].forEach((yPos) => {
      const coneGeo = new THREE.CylinderGeometry(0.20, 0.12, 0.08, 10);
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(0, yPos, 0.33);
      cone.rotation.x = Math.PI / 2;
      speakerGroup.add(cone);
      subwoofers.push(cone);
    });
  });

  // 4. Luces de escenario (Spotlights cenitales)
  const spotGeo = new THREE.ConeGeometry(0.16, 0.32, 8);
  const spotMat = createLowPolyMaterial('#4B5563');
  [-1.5, 0, 1.5].forEach((xPos) => {
    const spot = new THREE.Mesh(spotGeo, spotMat);
    spot.position.set(xPos, 3.6, -1.8);
    spot.rotation.x = -Math.PI / 3;
    stage.add(spot);
  });

  return { stage, subwoofers };
}
