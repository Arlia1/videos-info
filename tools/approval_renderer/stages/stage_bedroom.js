// ============================================================================
// BAILAPP 3D SHARED ASSET LIBRARY: STAGE BEDROOM (DIORAMA CUARTO CASERO LOW-POLY)
// ============================================================================

import * as THREE from '../three.module.js';
import { createLowPolyMaterial } from '../characters/character_builder.js';

export function createStageBedroom() {
  const stage = new THREE.Group();

  // 1. Suelo del cuarto (madera clara pastel facetada en tablones)
  const floorGeo = new THREE.BoxGeometry(4.2, 0.2, 4.2);
  const floorMat = createLowPolyMaterial('#F3E8E2', 0.85);
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.y = -0.1;
  floor.receiveShadow = true;
  stage.add(floor);

  // Tablones de madera suaves
  for (let i = -3; i <= 3; i++) {
    const plankLine = new THREE.Mesh(
      new THREE.BoxGeometry(0.012, 0.005, 4.0),
      createLowPolyMaterial('#E2D4CD', 0.9)
    );
    plankLine.position.set(i * 0.55, 0.003, 0);
    stage.add(plankLine);
  }

  // Alfombra circular rosa pastel
  const rugGeo = new THREE.CylinderGeometry(1.2, 1.25, 0.025, 16);
  const rugMat = createLowPolyMaterial('#FCE7F0', 0.95);
  const rug = new THREE.Mesh(rugGeo, rugMat);
  rug.position.set(0, 0.015, 0.2);
  rug.receiveShadow = true;
  stage.add(rug);

  // 2. Paredes de fondo (esquina de diorama)
  const wallMat = createLowPolyMaterial('#FFF5F8', 0.92);

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

  // Cuadro / Poster decorativo en la pared
  const posterFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 1.2, 0.04),
    createLowPolyMaterial('#D8C2B0')
  );
  posterFrame.position.set(-0.7, 2.2, -2.0);
  posterFrame.castShadow = true;
  stage.add(posterFrame);

  const posterArt = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 1.1, 0.02),
    createLowPolyMaterial('#FAD2E1')
  );
  posterArt.position.set(-0.7, 2.2, -1.97);
  stage.add(posterArt);

  // Detalle artístico en el póster (círculo frambuesa abstracto)
  const posterCircle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 0.02, 12),
    createLowPolyMaterial('#E06385')
  );
  posterCircle.rotation.x = Math.PI / 2;
  posterCircle.position.set(-0.7, 2.2, -1.95);
  stage.add(posterCircle);

  // 3. Cama Low-Poly (a la derecha)
  const bedGroup = new THREE.Group();
  bedGroup.position.set(1.25, 0, -0.9);
  stage.add(bedGroup);

  const bedBase = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.45, 2.2),
    createLowPolyMaterial('#E0D2C7')
  );
  bedBase.position.y = 0.225;
  bedBase.castShadow = true;
  bedBase.receiveShadow = true;
  bedGroup.add(bedBase);

  // Colchón y acolchado rosa suave con facetas
  const mattress = new THREE.Mesh(
    new THREE.BoxGeometry(1.42, 0.22, 2.12),
    createLowPolyMaterial('#F8C8DC')
  );
  mattress.position.y = 0.52;
  mattress.castShadow = true;
  bedGroup.add(mattress);

  // Almohadas facetadas
  [-0.38, 0.38].forEach((xOff) => {
    const pillow = new THREE.Mesh(
      new THREE.BoxGeometry(0.52, 0.14, 0.38),
      createLowPolyMaterial('#FFFFFF')
    );
    pillow.position.set(xOff, 0.68, -0.75);
    pillow.rotation.x = 0.25;
    pillow.castShadow = true;
    bedGroup.add(pillow);
  });

  // Manta doblada al pie de la cama
  const blanket = new THREE.Mesh(
    new THREE.BoxGeometry(1.44, 0.08, 0.65),
    createLowPolyMaterial('#E06385')
  );
  blanket.position.set(0, 0.64, 0.7);
  bedGroup.add(blanket);

  // 4. Mesita de noche con lámpara cálida
  const nightstand = new THREE.Mesh(
    new THREE.BoxGeometry(0.52, 0.48, 0.48),
    createLowPolyMaterial('#D8C2B0')
  );
  nightstand.position.set(0.2, 0.24, -1.8);
  nightstand.castShadow = true;
  stage.add(nightstand);

  // Libros apilados en la mesita
  const book1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.04, 0.18),
    createLowPolyMaterial('#FAD2E1')
  );
  book1.position.set(0.18, 0.50, -1.78);
  book1.rotation.y = 0.15;
  stage.add(book1);

  // Lámpara de noche
  const lampBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.08, 0.14, 8),
    createLowPolyMaterial('#374151')
  );
  lampBase.position.set(0.26, 0.55, -1.82);
  stage.add(lampBase);

  const lampShade = new THREE.Mesh(
    new THREE.ConeGeometry(0.12, 0.16, 8),
    new THREE.MeshStandardMaterial({
      color: 0xFFFBEB,
      emissive: 0xFFE4B5,
      emissiveIntensity: 0.6,
      flatShading: true
    })
  );
  lampShade.position.set(0.26, 0.68, -1.82);
  stage.add(lampShade);

  const warmLampLight = new THREE.PointLight(0xFFE4B5, 0.9, 3.2);
  warmLampLight.position.set(0.26, 0.72, -1.82);
  stage.add(warmLampLight);

  // 5. Espejo de cuerpo entero con pie inclinado
  const mirrorGroup = new THREE.Group();
  mirrorGroup.position.set(-1.6, 0, -1.1);
  mirrorGroup.rotation.y = 0.45;
  stage.add(mirrorGroup);

  const mirrorFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 1.8, 0.06),
    createLowPolyMaterial('#D8C2B0')
  );
  mirrorFrame.position.y = 0.95;
  mirrorFrame.castShadow = true;
  mirrorGroup.add(mirrorFrame);

  const mirrorGlass = new THREE.Mesh(
    new THREE.BoxGeometry(0.58, 1.66, 0.02),
    new THREE.MeshStandardMaterial({
      color: 0xE2F1FF,
      roughness: 0.15,
      metalness: 0.6,
      flatShading: true
    })
  );
  mirrorGlass.position.set(0, 0.95, 0.03);
  mirrorGroup.add(mirrorGlass);

  // 6. Planta de interior low-poly (Monstera / Ficus en maceta geométrica)
  const plantPot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.13, 0.32, 6),
    createLowPolyMaterial('#E0D2C7')
  );
  plantPot.position.set(-1.6, 0.16, 0.6);
  plantPot.castShadow = true;
  stage.add(plantPot);

  [-0.08, 0.0, 0.08].forEach((xOff, idx) => {
    const leaf = new THREE.Mesh(
      new THREE.ConeGeometry(0.12, 0.35, 5),
      createLowPolyMaterial('#10B981', 0.8)
    );
    leaf.position.set(-1.6 + xOff, 0.42, 0.6 + (idx === 1 ? -0.05 : 0.05));
    leaf.rotation.z = idx === 0 ? 0.35 : (idx === 2 ? -0.35 : 0.05);
    leaf.rotation.x = idx === 1 ? -0.25 : 0.25;
    leaf.castShadow = true;
    stage.add(leaf);
  });

  // 7. Aro de luz LED (Ring Light) sobre trípode en la esquina
  const ringGroup = new THREE.Group();
  ringGroup.position.set(1.7, 0, 0.7);
  ringGroup.rotation.y = -2.3;
  stage.add(ringGroup);

  const stand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 1.5, 6),
    createLowPolyMaterial('#374151')
  );
  stand.position.y = 0.75;
  ringGroup.add(stand);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.22, 0.03, 8, 16),
    new THREE.MeshBasicMaterial({ color: 0xFFFBEB })
  );
  ring.position.y = 1.55;
  ringGroup.add(ring);

  const phoneOnTripod = new THREE.Mesh(
    new THREE.BoxGeometry(0.09, 0.16, 0.015),
    createLowPolyMaterial('#1F2937')
  );
  phoneOnTripod.position.set(0, 1.55, 0);
  ringGroup.add(phoneOnTripod);

  const ringLight = new THREE.PointLight(0xFFFBEB, 0.6, 3.5);
  ringLight.position.set(1.7, 1.55, 0.7);
  stage.add(ringLight);

  return stage;
}
