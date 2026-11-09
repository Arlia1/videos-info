// ============================================================================
// BAILAPP 3D SHARED ASSET LIBRARY: STAGE GYM (GIMNASIO LOW-POLY TRADICIONAL)
// ============================================================================
// Diseñado para representar la rutina aburrida del fitness tradicional:
// - Cinta de correr facetada con cinta negra, barandales y consola.
// - Rack de mancuernas y pesas hexagonales facetadas.
// - Reloj de pared analógico facetado que simboliza el paso lento del tiempo.
// - Piso de goma deportivo gris carbón (#374151) con baldosas facetadas.
// ============================================================================

import * as THREE from '../three.module.js';
import { createLowPolyMaterial } from '../characters/character_builder.js';

export function createStageGym() {
  const stage = new THREE.Group();

  // 1. Piso de goma de gimnasio (Gris oscuro facetado)
  const floorGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.2, 32);
  const floorMat = createLowPolyMaterial('#2D3748', 0.88, 0.02);
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.y = -0.1;
  floor.receiveShadow = true;
  stage.add(floor);

  // Líneas divisorias de goma en el piso
  for (let i = -2; i <= 2; i++) {
    const lineGeo = new THREE.BoxGeometry(4.8, 0.01, 0.04);
    const lineMat = createLowPolyMaterial('#4A5568', 0.9);
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.position.set(0, 0.005, i * 0.9);
    stage.add(line);
  }

  // 2. Cinta de Correr (Treadmill Low-Poly)
  const treadmill = new THREE.Group();
  treadmill.position.set(0, 0, 0.1);
  stage.add(treadmill);

  // Base y rampa de la cinta (elevada 0.22m sobre el piso)
  const baseGeo = new THREE.BoxGeometry(1.0, 0.22, 2.2);
  const baseMat = createLowPolyMaterial('#1A202C', 0.7);
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.y = 0.11;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  treadmill.add(baseMesh);

  // Banda de rodamiento negra
  const beltGeo = new THREE.BoxGeometry(0.78, 0.04, 1.85);
  const beltMat = createLowPolyMaterial('#111827', 0.95);
  const beltMesh = new THREE.Mesh(beltGeo, beltMat);
  beltMesh.position.y = 0.23;
  beltMesh.receiveShadow = true;
  treadmill.add(beltMesh);

  // Pasamanos / Barandales laterales
  [-0.44, 0.44].forEach((xSide) => {
    // Poste vertical
    const postGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.1, 8);
    const postMat = createLowPolyMaterial('#718096', 0.4, 0.2);
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.set(xSide, 0.65, 0.4);
    post.rotation.x = -0.15;
    treadmill.add(post);

    // Barra horizontal
    const barGeo = new THREE.BoxGeometry(0.05, 0.06, 1.2);
    const bar = new THREE.Mesh(barGeo, postMat);
    bar.position.set(xSide, 1.15, -0.1);
    bar.rotation.x = -0.08;
    treadmill.add(bar);
  });

  // Consola / Display frontal
  const consoleGeo = new THREE.BoxGeometry(0.84, 0.28, 0.18);
  const consoleMat = createLowPolyMaterial('#2D3748', 0.5);
  const consoleMesh = new THREE.Mesh(consoleGeo, consoleMat);
  consoleMesh.position.set(0, 1.22, -0.65);
  consoleMesh.rotation.x = 0.45;
  treadmill.add(consoleMesh);

  // Pantalla digital con tiempo "45:00"
  const screenGeo = new THREE.BoxGeometry(0.5, 0.16, 0.02);
  const screenMat = new THREE.MeshBasicMaterial({ color: 0x38BDF8 });
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.set(0, 1.25, -0.58);
  screenMesh.rotation.x = 0.45;
  treadmill.add(screenMesh);

  // 3. Rack de Pesas y Mancuernas al fondo lateral
  const rackGroup = new THREE.Group();
  rackGroup.position.set(-1.6, 0, -1.2);
  stage.add(rackGroup);

  // Estructura del rack
  const rackFrameGeo = new THREE.BoxGeometry(1.2, 0.8, 0.4);
  const rackFrameMat = createLowPolyMaterial('#4A5568', 0.6);
  const rackFrame = new THREE.Mesh(rackFrameGeo, rackFrameMat);
  rackFrame.position.y = 0.4;
  rackFrame.castShadow = true;
  rackGroup.add(rackFrame);

  // Mancuernas hexagonales
  [-0.35, 0, 0.35].forEach((xOff, idx) => {
    const dumbGroup = new THREE.Group();
    dumbGroup.position.set(xOff, 0.84, 0);

    const barDumbGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.28, 8);
    const barDumbMat = createLowPolyMaterial('#CBD5E0', 0.3, 0.5);
    const barDumb = new THREE.Mesh(barDumbGeo, barDumbMat);
    barDumb.rotation.z = Math.PI / 2;
    dumbGroup.add(barDumb);

    [-0.12, 0.12].forEach((xW) => {
      const weightGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 6);
      const weightMat = createLowPolyMaterial('#1A202C', 0.8);
      const weight = new THREE.Mesh(weightGeo, weightMat);
      weight.rotation.z = Math.PI / 2;
      weight.position.x = xW;
      dumbGroup.add(weight);
    });

    rackGroup.add(dumbGroup);
  });

  // 4. Reloj de Pared Analógico Aburrido
  const clockGroup = new THREE.Group();
  clockGroup.position.set(1.4, 2.4, -1.8);
  stage.add(clockGroup);

  const clockGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.06, 16);
  const clockMat = createLowPolyMaterial('#FFFFFF', 0.3);
  const clockMesh = new THREE.Mesh(clockGeo, clockMat);
  clockMesh.rotation.x = Math.PI / 2;
  clockGroup.add(clockMesh);

  const clockRimGeo = new THREE.TorusGeometry(0.35, 0.03, 6, 16);
  const clockRimMat = createLowPolyMaterial('#E06385', 0.5);
  const clockRim = new THREE.Mesh(clockRimGeo, clockRimMat);
  clockGroup.add(clockRim);

  // Manecillas del reloj
  const handHourGeo = new THREE.BoxGeometry(0.02, 0.16, 0.02);
  const handMat = new THREE.MeshBasicMaterial({ color: 0x1F2937 });
  const handHour = new THREE.Mesh(handHourGeo, handMat);
  handHour.position.set(0, 0.08, 0.04);
  clockGroup.add(handHour);

  const handMinGeo = new THREE.BoxGeometry(0.015, 0.24, 0.02);
  const handMin = new THREE.Mesh(handMinGeo, handMat);
  handMin.position.set(0.08, 0.05, 0.04);
  handMin.rotation.z = -Math.PI / 3;
  clockGroup.add(handMin);

  return { stage, treadmill, clockGroup };
}
