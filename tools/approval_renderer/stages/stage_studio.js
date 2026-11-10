// ============================================================================
// BAILAPP 3D SHARED ASSET LIBRARY: STAGE STUDIO (ESTUDIO PROFESIONAL BAILAPP)
// ============================================================================

import * as THREE from '../three.module.js';
import { createLowPolyMaterial } from '../characters/character_builder.js';

export function createStageStudio() {
  const stage = new THREE.Group();
  const subwoofers = [];

  // 1. Piso de danza profesional amplio (parquet claro rosado pulido facetado)
  const floorGeo = new THREE.BoxGeometry(5.6, 0.2, 5.0);
  const floorMat = createLowPolyMaterial('#F5EDE8', 0.55, 0.06);
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.y = -0.1;
  floor.receiveShadow = true;
  stage.add(floor);

  // Tablones de parquet facetados
  for (let i = -5; i <= 5; i++) {
    const lineGeo = new THREE.BoxGeometry(0.015, 0.005, 4.8);
    const lineMat = createLowPolyMaterial('#E5D3C7', 0.8);
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.position.set(i * 0.52, 0.004, 0);
    stage.add(line);
  }

  // 2. Pared de fondo con Espejos Gigantes de Estudio
  const wallMat = createLowPolyMaterial('#FFF0F5', 0.92);
  const backWallGeo = new THREE.BoxGeometry(5.6, 4.4, 0.15);
  const backWall = new THREE.Mesh(backWallGeo, wallMat);
  backWall.position.set(0, 2.1, -2.4);
  backWall.receiveShadow = true;
  stage.add(backWall);

  // Paredes laterales de diorama
  [-2.8, 2.8].forEach((xPos, idx) => {
    const sideWallGeo = new THREE.BoxGeometry(0.15, 4.4, 5.0);
    const sideWall = new THREE.Mesh(sideWallGeo, wallMat);
    sideWall.position.set(xPos, 2.1, 0);
    sideWall.receiveShadow = true;
    stage.add(sideWall);
  });

  // Marco del gran espejo (frambuesa Bailapp)
  const mirrorFrameGeo = new THREE.BoxGeometry(4.8, 3.0, 0.08);
  const mirrorFrameMat = createLowPolyMaterial('#E06385', 0.7);
  const mirrorFrame = new THREE.Mesh(mirrorFrameGeo, mirrorFrameMat);
  mirrorFrame.position.set(0, 1.9, -2.32);
  stage.add(mirrorFrame);

  // Cristal del espejo reflectante
  const mirrorGlassGeo = new THREE.BoxGeometry(4.6, 2.8, 0.02);
  const mirrorGlassMat = new THREE.MeshStandardMaterial({
    color: 0xE8F4FD,
    roughness: 0.12,
    metalness: 0.75,
    flatShading: true,
  });
  const mirrorGlass = new THREE.Mesh(mirrorGlassGeo, mirrorGlassMat);
  mirrorGlass.position.set(0, 1.9, -2.27);
  stage.add(mirrorGlass);

  // Barra de danza clásica a lo largo del espejo
  const barGeo = new THREE.CylinderGeometry(0.028, 0.028, 4.6, 8);
  const barMat = createLowPolyMaterial('#D8C2B0');
  const bar = new THREE.Mesh(barGeo, barMat);
  bar.rotation.z = Math.PI / 2;
  bar.position.set(0, 1.05, -2.15);
  stage.add(bar);

  // Soportes de la barra de ballet
  [-1.8, -0.6, 0.6, 1.8].forEach(xPos => {
    const bracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.08, 0.14),
      createLowPolyMaterial('#374151')
    );
    bracket.position.set(xPos, 1.05, -2.22);
    stage.add(bracket);
  });

  // 3. Sistema de Sonido Profesional / Torres de altavoces
  [-2.2, 2.2].forEach((xPos, idx) => {
    const speakerGroup = new THREE.Group();
    speakerGroup.position.set(xPos, 0, -1.6);
    speakerGroup.rotation.y = idx === 0 ? 0.35 : -0.35;
    stage.add(speakerGroup);

    // Caja acústica
    const bodyGeo = new THREE.BoxGeometry(0.65, 1.35, 0.65);
    const bodyMat = createLowPolyMaterial('#1F2937');
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.675;
    body.castShadow = true;
    speakerGroup.add(body);

    // Conos de altavoz (woofer)
    const coneMat = createLowPolyMaterial('#E06385');
    [0.40, 0.95].forEach((yPos) => {
      const coneGeo = new THREE.CylinderGeometry(0.20, 0.12, 0.08, 10);
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(0, yPos, 0.33);
      cone.rotation.x = Math.PI / 2;
      speakerGroup.add(cone);
      subwoofers.push(cone);
    });

    // Logo / Placa Bailapp en el altavoz
    const badge = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.06, 0.02),
      createLowPolyMaterial('#FAD2E1')
    );
    badge.position.set(0, 1.25, 0.33);
    speakerGroup.add(badge);
  });

  // 4. Estructura superior de luces (Truss)
  const trussBar = new THREE.Mesh(
    new THREE.BoxGeometry(5.2, 0.10, 0.10),
    createLowPolyMaterial('#374151')
  );
  trussBar.position.set(0, 3.8, -1.6);
  stage.add(trussBar);

  // Spotlights cenitales
  const spotGeo = new THREE.ConeGeometry(0.18, 0.32, 8);
  const spotMat = createLowPolyMaterial('#4B5563');
  [-1.6, -0.8, 0, 0.8, 1.6].forEach((xPos) => {
    const spot = new THREE.Mesh(spotGeo, spotMat);
    spot.position.set(xPos, 3.7, -1.6);
    spot.rotation.x = -Math.PI / 3;
    stage.add(spot);
  });

  return { stage, subwoofers };
}
