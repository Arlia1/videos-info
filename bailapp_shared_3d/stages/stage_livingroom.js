// ============================================================================
// BAILAPP 3D SHARED ASSET LIBRARY: STAGE LIVING ROOM (DIORAMA SILLÓN / LIVING)
// ============================================================================
// Diseñado para escenas de "Finde sin plan", "Aburrimiento en casa":
// - Sillón low-poly con cojines (superficie del asiento a Y = 0.44m).
// - Mesa ratona con taza pastel y lámpara de pie.
// - Geometría diorama limpia y optimizada para 9:16 vertical.
// ============================================================================

import * as THREE from '../three.module.js';
import { createLowPolyMaterial } from '../characters/character_builder.js';

export function createStageLivingRoom() {
  const stage = new THREE.Group();

  // 1. Suelo del living (parquet facetado pastel cálido)
  const floorGeo = new THREE.BoxGeometry(4.2, 0.2, 4.2);
  const floorMat = createLowPolyMaterial('#F5EDE6', 0.85);
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.y = -0.1;
  floor.receiveShadow = true;
  stage.add(floor);

  // Alfombra ovalada suave
  const rugGeo = new THREE.CylinderGeometry(1.3, 1.35, 0.025, 20);
  const rugMat = createLowPolyMaterial('#FCE7F0', 0.95);
  const rug = new THREE.Mesh(rugGeo, rugMat);
  rug.position.set(0, 0.015, 0.2);
  rug.scale.set(1.2, 1, 0.85);
  rug.receiveShadow = true;
  stage.add(rug);

  // 2. Pared trasera
  const wallMat = createLowPolyMaterial('#FFF5F8', 0.9);
  const backWallGeo = new THREE.BoxGeometry(4.2, 3.8, 0.15);
  const backWall = new THREE.Mesh(backWallGeo, wallMat);
  backWall.position.set(0, 1.8, -2.1);
  backWall.receiveShadow = true;
  stage.add(backWall);

  // Cuadro abstracto en la pared
  const artFrameGeo = new THREE.BoxGeometry(1.4, 1.8, 0.06);
  const artFrameMat = createLowPolyMaterial('#FFFFFF');
  const artFrame = new THREE.Mesh(artFrameGeo, artFrameMat);
  artFrame.position.set(-0.8, 2.3, -1.95);
  stage.add(artFrame);

  const artInnerGeo = new THREE.PlaneGeometry(1.28, 1.68);
  const artInnerMat = createLowPolyMaterial('#FAD2E1');
  const artInner = new THREE.Mesh(artInnerGeo, artInnerMat);
  artInner.position.set(-0.8, 2.3, -1.91);
  stage.add(artInner);

  // 3. Sillón Low-Poly Pastel (Centrado o semi-centrado)
  // Altura del asiento: Y = 0.44m
  const couchGroup = new THREE.Group();
  couchGroup.position.set(0, 0, -0.4);
  stage.add(couchGroup);

  const couchMat = createLowPolyMaterial('#EBD6CD', 0.8);
  const cushionMat = createLowPolyMaterial('#F8C8DC', 0.9);

  // Base y respaldo del sillón
  const baseGeo = new THREE.BoxGeometry(2.1, 0.28, 0.95);
  const base = new THREE.Mesh(baseGeo, couchMat);
  base.position.y = 0.14;
  base.castShadow = true;
  base.receiveShadow = true;
  couchGroup.add(base);

  const backGeo = new THREE.BoxGeometry(2.1, 0.65, 0.25);
  const back = new THREE.Mesh(backGeo, couchMat);
  back.position.set(0, 0.52, -0.35);
  back.castShadow = true;
  couchGroup.add(back);

  // Apoyabrazos laterales
  const armLGeo = new THREE.BoxGeometry(0.24, 0.45, 0.95);
  const armL = new THREE.Mesh(armLGeo, couchMat);
  armL.position.set(-1.05, 0.38, 0);
  armL.castShadow = true;
  couchGroup.add(armL);

  const armRGeo = new THREE.BoxGeometry(0.24, 0.45, 0.95);
  const armR = new THREE.Mesh(armRGeo, couchMat);
  armR.position.set(1.05, 0.38, 0);
  armR.castShadow = true;
  couchGroup.add(armR);

  // Almohadones del asiento (superficie superior en Y = 0.44m)
  const seatGeo = new THREE.BoxGeometry(0.85, 0.16, 0.7);
  const seatL = new THREE.Mesh(seatGeo, cushionMat);
  seatL.position.set(-0.45, 0.36, 0.05);
  seatL.castShadow = true;
  seatL.receiveShadow = true;
  couchGroup.add(seatL);

  const seatR = new THREE.Mesh(seatGeo, cushionMat);
  seatR.position.set(0.45, 0.36, 0.05);
  seatR.castShadow = true;
  seatR.receiveShadow = true;
  couchGroup.add(seatR);

  // 4. Mesa ratona frente al sillón
  const tableGroup = new THREE.Group();
  tableGroup.position.set(0, 0, 0.7);
  stage.add(tableGroup);

  const tableTopGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.05, 16);
  const tableMat = createLowPolyMaterial('#D8B4A6');
  const tableTop = new THREE.Mesh(tableTopGeo, tableMat);
  tableTop.position.y = 0.35;
  tableTop.castShadow = true;
  tableTop.receiveShadow = true;
  tableGroup.add(tableTop);

  const tableLegGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.33, 8);
  for (let i = 0; i < 3; i++) {
    const leg = new THREE.Mesh(tableLegGeo, tableMat);
    const ang = (i * Math.PI * 2) / 3;
    leg.position.set(Math.cos(ang) * 0.32, 0.165, Math.sin(ang) * 0.32);
    tableGroup.add(leg);
  }

  // Taza pastel en la mesa
  const mugGeo = new THREE.CylinderGeometry(0.05, 0.04, 0.09, 10);
  const mugMat = createLowPolyMaterial('#E06385');
  const mug = new THREE.Mesh(mugGeo, mugMat);
  mug.position.set(0.08, 0.42, 0.72);
  stage.add(mug);

  // 5. Lámpara de pie nórdica (a la derecha)
  const lampGroup = new THREE.Group();
  lampGroup.position.set(1.4, 0, -0.6);
  stage.add(lampGroup);

  const lampPoleGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.1, 8);
  const lampPoleMat = createLowPolyMaterial('#B08968');
  const pole = new THREE.Mesh(lampPoleGeo, lampPoleMat);
  pole.position.y = 1.05;
  lampGroup.add(pole);

  const lampShadeGeo = new THREE.ConeGeometry(0.24, 0.35, 12, 1, true);
  const lampShadeMat = createLowPolyMaterial('#FFF3B0', 0.9);
  const shade = new THREE.Mesh(lampShadeGeo, lampShadeMat);
  shade.position.set(0, 2.05, 0);
  lampGroup.add(shade);

  return { stage, seatY: 0.44 };
}
