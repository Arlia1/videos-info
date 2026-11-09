// ============================================================================
// BAILAPP 3D SHARED ASSET LIBRARY: STAGE BEDROOM (DIORAMA CUARTO CASERO)
// ============================================================================

import * as THREE from '../three.module.js';
import { createLowPolyMaterial } from '../characters/character_builder.js';

export function createStageBedroom() {
  const stage = new THREE.Group();

  // 1. Suelo del cuarto (madera clara pastel facetada)
  const floorGeo = new THREE.BoxGeometry(4.2, 0.2, 4.2);
  const floorMat = createLowPolyMaterial('#F3E8E2', 0.85);
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.y = -0.1;
  floor.receiveShadow = true;
  stage.add(floor);

  // Alfombra circular rosa pastel
  const rugGeo = new THREE.CylinderGeometry(1.2, 1.25, 0.03, 16);
  const rugMat = createLowPolyMaterial('#FCE7F0', 0.95);
  const rug = new THREE.Mesh(rugGeo, rugMat);
  rug.position.set(0, 0.015, 0.2);
  rug.receiveShadow = true;
  stage.add(rug);

  // 2. Paredes de fondo (esquina de diorama)
  const wallMat = createLowPolyMaterial('#FFF5F8', 0.9);

  // Pared trasera
  const backWallGeo = new THREE.BoxGeometry(4.2, 3.8, 0.15);
  const backWall = new THREE.Mesh(backWallGeo, wallMat);
  backWall.position.set(0, 1.8, -2.1);
  backWall.receiveShadow = true;
  stage.add(backWall);

  // Pared lateral izquierda
  const sideWallGeo = new THREE.BoxGeometry(0.15, 3.8, 4.2);
  const sideWall = new THREE.Mesh(sideWallGeo, wallMat);
  sideWall.position.set(-2.1, 1.8, 0);
  sideWall.receiveShadow = true;
  stage.add(sideWall);

  // Zócalo decorativo
  const baseboardGeo = new THREE.BoxGeometry(4.2, 0.12, 0.05);
  const baseboardMat = createLowPolyMaterial('#E5D5D0');
  const baseboard = new THREE.Mesh(baseboardGeo, baseboardMat);
  baseboard.position.set(0, 0.06, -2.0);
  stage.add(baseboard);

  // 3. Cama Low-Poly claustrofóbica (a la derecha)
  const bedGroup = new THREE.Group();
  bedGroup.position.set(1.25, 0, -0.9);
  stage.add(bedGroup);

  // Base de la cama
  const bedBaseGeo = new THREE.BoxGeometry(1.5, 0.45, 2.2);
  const bedBaseMat = createLowPolyMaterial('#E0D2C7');
  const bedBase = new THREE.Mesh(bedBaseGeo, bedBaseMat);
  bedBase.position.y = 0.225;
  bedBase.castShadow = true;
  bedBase.receiveShadow = true;
  bedGroup.add(bedBase);

  // Colchón y acolchado rosa suave
  const mattressGeo = new THREE.BoxGeometry(1.42, 0.22, 2.12);
  const mattressMat = createLowPolyMaterial('#F8C8DC');
  const mattress = new THREE.Mesh(mattressGeo, mattressMat);
  mattress.position.y = 0.52;
  mattress.castShadow = true;
  bedGroup.add(mattress);

  // Almohadas facetadas
  [-0.38, 0.38].forEach((xOff) => {
    const pillowGeo = new THREE.BoxGeometry(0.52, 0.14, 0.38);
    const pillowMat = createLowPolyMaterial('#FFFFFF');
    const pillow = new THREE.Mesh(pillowGeo, pillowMat);
    pillow.position.set(xOff, 0.68, -0.75);
    pillow.rotation.x = 0.25;
    pillow.castShadow = true;
    bedGroup.add(pillow);
  });

  // 4. Espejo de cuerpo entero con pie inclinado
  const mirrorGroup = new THREE.Group();
  mirrorGroup.position.set(-1.6, 0, -1.2);
  mirrorGroup.rotation.y = 0.45;
  stage.add(mirrorGroup);

  const mirrorFrameGeo = new THREE.BoxGeometry(0.7, 1.8, 0.06);
  const mirrorFrameMat = createLowPolyMaterial('#D8C2B0');
  const mirrorFrame = new THREE.Mesh(mirrorFrameGeo, mirrorFrameMat);
  mirrorFrame.position.y = 0.95;
  mirrorFrame.castShadow = true;
  mirrorGroup.add(mirrorFrame);

  const mirrorGlassGeo = new THREE.BoxGeometry(0.58, 1.66, 0.02);
  const mirrorGlassMat = createLowPolyMaterial('#E2F1FF', 0.2, 0.6);
  const mirrorGlass = new THREE.Mesh(mirrorGlassGeo, mirrorGlassMat);
  mirrorGlass.position.set(0, 0.95, 0.03);
  mirrorGroup.add(mirrorGlass);

  // 5. Aro de luz LED (Ring Light) sobre trípode (típico de TikTok/Reels en casa)
  const ringGroup = new THREE.Group();
  ringGroup.position.set(1.45, 0, 1.1);
  ringGroup.rotation.y = -2.2;
  stage.add(ringGroup);

  // Trípode
  const standGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.5, 6);
  const standMat = createLowPolyMaterial('#374151');
  const stand = new THREE.Mesh(standGeo, standMat);
  stand.position.y = 0.75;
  ringGroup.add(stand);

  // Aro de luz
  const ringGeo = new THREE.TorusGeometry(0.24, 0.035, 8, 16);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xFFFBEB });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.y = 1.55;
  ringGroup.add(ring);

  // Smartphone montado en el centro del aro
  const phoneOnTripod = new THREE.Mesh(
    new THREE.BoxGeometry(0.09, 0.16, 0.015),
    createLowPolyMaterial('#1F2937')
  );
  phoneOnTripod.position.set(0, 1.55, 0);
  ringGroup.add(phoneOnTripod);

  // Luz puntual suave que emite el aro
  const ringLight = new THREE.PointLight(0xFFFBEB, 0.6, 3.5);
  ringLight.position.set(1.45, 1.55, 1.1);
  stage.add(ringLight);

  return stage;
}
