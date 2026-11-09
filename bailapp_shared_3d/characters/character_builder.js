// ============================================================================
// BAILAPP 3D SHARED ASSET LIBRARY: CHARACTER BUILDER (ENHANCED LOW-POLY V4)
// ============================================================================
// - Rostro 100% geométrico 3D (CERO planos cuadrados, CERO texturas 2D planas).
// - Esclera blanca esculpida, iris profundo, pupila, doble brillo especular kawaii.
// - Pestañas y delineado alado, cejas expresivas y sonrisa radiante en 3D con dientes.
// - Base craneal facetada continua con pómulos suaves y mentón cónico.
// - Pies 100% apoyados en el piso real (Y = 0.00) con suelas chunky y sombra de contacto.
// ============================================================================

import * as THREE from '../three.module.js';

// Material base Low-Poly con flatShading puro y respuesta lumínica suave
export function createLowPolyMaterial(color, roughness = 0.72, metalness = 0.05) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness,
    metalness,
    flatShading: true,
  });
}

/**
 * Crea un personaje 3D con silueta orgánica estilizada y geometría facetada.
 */
export function buildEnhancedCharacter(opts = {}) {
  const root = new THREE.Group();

  // --- PALETA Y MATERIALES ---
  const skinColor = opts.skinColor || '#FFD5B8';
  const hairColor = opts.hairColor || '#2D242E';
  const topColor = opts.topColor || '#E06385';
  const bottomColor = opts.bottomColor || opts.pantsColor || '#1F2937';
  const shoesColor = opts.shoesColor || '#FFFFFF';
  const accentColor = opts.accentColor || '#F472B6';
  const soleColor = opts.soleColor || '#F3F4F6';

  const skinMat = createLowPolyMaterial(skinColor, 0.68, 0.04);
  const hairMat = createLowPolyMaterial(hairColor, 0.85);
  const topMat = createLowPolyMaterial(topColor, 0.75);
  const bottomMat = createLowPolyMaterial(bottomColor, 0.80);
  const shoesMat = createLowPolyMaterial(shoesColor, 0.65);
  const soleMat = createLowPolyMaterial(soleColor, 0.85);
  const accentMat = createLowPolyMaterial(accentColor, 0.70);

  const parts = {};

  // -----------------------------------------------------------
  // 1. SOMBRA DE CONTACTO VOLUMÉTRICA EN EL PISO REAL (Y = 0.005)
  // -----------------------------------------------------------
  const shadowGeo = new THREE.CylinderGeometry(0.48, 0.52, 0.01, 16);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x2A1525,
    transparent: true,
    opacity: 0.22,
  });
  const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
  contactShadow.position.y = 0.005;
  root.add(contactShadow);
  parts.contactShadow = contactShadow;

  // -----------------------------------------------------------
  // 2. CADERA / PELVIS (Pivote calibrado para que los pies toquen Y = 0.00)
  // Altura base: Hips a Y = 0.84 -> Pierna 0.08 + 0.38 + 0.38 = 0.84 -> Suela toca Y = 0.00
  // -----------------------------------------------------------
  const hips = new THREE.Group();
  hips.position.y = 0.84;
  root.add(hips);
  parts.hips = hips;

  // Pelvis / Shorts facetados
  const pelvisGeo = new THREE.CylinderGeometry(0.23, 0.26, 0.22, 10);
  const pelvisMesh = new THREE.Mesh(pelvisGeo, bottomMat);
  pelvisMesh.scale.set(1.15, 1.0, 0.78);
  pelvisMesh.castShadow = true;
  pelvisMesh.receiveShadow = true;
  hips.add(pelvisMesh);

  // Cinturón de contraste
  const beltGeo = new THREE.CylinderGeometry(0.235, 0.24, 0.04, 10);
  const beltMesh = new THREE.Mesh(beltGeo, accentMat);
  beltMesh.position.y = 0.09;
  beltMesh.scale.set(1.16, 1.0, 0.80);
  hips.add(beltMesh);

  // -----------------------------------------------------------
  // 3. TORSO ARTICULADO (Cintura + Pecho / Ribcage)
  // -----------------------------------------------------------
  const torso = new THREE.Group();
  torso.position.y = 0.11;
  hips.add(torso);
  parts.torso = torso;

  // Cintura
  const waistMat = (opts.topType === 'croptop' || opts.topType === 'sports_bra') ? skinMat : topMat;
  const waistGeo = new THREE.CylinderGeometry(0.20, 0.22, 0.16, 10);
  const waistMesh = new THREE.Mesh(waistGeo, waistMat);
  waistMesh.position.y = 0.08;
  waistMesh.scale.set(1.08, 1.0, 0.74);
  waistMesh.castShadow = true;
  torso.add(waistMesh);

  // Pecho
  const chestGroup = new THREE.Group();
  chestGroup.position.y = 0.16;
  torso.add(chestGroup);
  parts.chest = chestGroup;

  const chestGeo = new THREE.CylinderGeometry(0.26, 0.20, 0.32, 10);
  const chestMesh = new THREE.Mesh(chestGeo, topMat);
  chestMesh.position.y = 0.16;
  chestMesh.scale.set(1.15, 1.0, 0.76);
  chestMesh.castShadow = true;
  chestMesh.receiveShadow = true;
  chestGroup.add(chestMesh);

  if (opts.topType === 'hoodie') {
    const hoodGeo = new THREE.DodecahedronGeometry(0.22, 0);
    const hoodMesh = new THREE.Mesh(hoodGeo, topMat);
    hoodMesh.position.set(0, 0.30, -0.16);
    hoodMesh.scale.set(1.2, 0.8, 0.7);
    hoodMesh.castShadow = true;
    chestGroup.add(hoodMesh);
  } else {
    const collarGeo = new THREE.TorusGeometry(0.12, 0.025, 6, 10);
    const collarMesh = new THREE.Mesh(collarGeo, accentMat);
    collarMesh.position.set(0, 0.32, 0.04);
    collarMesh.rotation.x = Math.PI / 2.3;
    chestGroup.add(collarMesh);
  }

  // Cuello
  const neckGeo = new THREE.CylinderGeometry(0.08, 0.095, 0.14, 8);
  const neckMesh = new THREE.Mesh(neckGeo, skinMat);
  neckMesh.position.y = 0.37;
  neckMesh.castShadow = true;
  chestGroup.add(neckMesh);

  // -----------------------------------------------------------
  // 4. CABEZA Y ROSTRO LUMINOSO (100% DESPEJADO, CERO POLÍGONOS NEGROS)
  // -----------------------------------------------------------
  // 4. CABEZA Y ROSTRO 100% ESCULPIDO EN 3D LOW-POLY
  // CERO planos cuadrados, CERO texturas 2D planas.
  // -----------------------------------------------------------
  const head = new THREE.Group();
  head.position.y = 0.52;
  chestGroup.add(head);
  parts.head = head;

  // Luz frontal de retrato suave y cálida
  const faceLight = new THREE.PointLight('#FFF6EE', 0.65, 3.5);
  faceLight.position.set(0, 0.16, 1.1);
  head.add(faceLight);

  // A. ESTRUCTURA CRANEAL FACETADA Y CONTINUA
  // 1. Cráneo superior (esfera facetada suavemente aplanada)
  const skullGeo = new THREE.SphereGeometry(0.23, 14, 10);
  const skullMesh = new THREE.Mesh(skullGeo, skinMat);
  skullMesh.position.set(0, 0.15, -0.01);
  skullMesh.scale.set(1.0, 1.05, 0.95);
  skullMesh.castShadow = true;
  skullMesh.receiveShadow = false;
  head.add(skullMesh);

  // 2. Mandíbula y mejillas contorneadas (cilindro cónico facetado)
  const jawGeo = new THREE.CylinderGeometry(0.22, 0.15, 0.22, 12);
  const jawMesh = new THREE.Mesh(jawGeo, skinMat);
  jawMesh.position.set(0, 0.04, 0.015);
  jawMesh.scale.set(0.98, 1.0, 0.90);
  jawMesh.castShadow = true;
  jawMesh.receiveShadow = false;
  head.add(jawMesh);

  // 3. Mentón suavemente redondeado
  const chinGeo = new THREE.DodecahedronGeometry(0.08, 0);
  const chinMesh = new THREE.Mesh(chinGeo, skinMat);
  chinMesh.position.set(0, -0.055, 0.06);
  chinMesh.scale.set(1.0, 0.75, 0.85);
  chinMesh.castShadow = true;
  head.add(chinMesh);

  // 4. Orejas estilizadas
  [-1, 1].forEach((side) => {
    const earGeo = new THREE.BoxGeometry(0.035, 0.075, 0.05);
    const earMesh = new THREE.Mesh(earGeo, skinMat);
    earMesh.position.set(side * 0.21, 0.13, -0.01);
    earMesh.rotation.y = side * 0.15;
    earMesh.rotation.z = -side * 0.10;
    head.add(earMesh);
  });

  // B. MATERIALES DEDICADOS PARA OJOS Y BOCA (ESTILO MINIMALISTA LIMPIO)
  const scleraMat = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    roughness: 0.25,
    metalness: 0.0,
    emissive: 0xFFFFFF,
    emissiveIntensity: 0.25, // Blanco radiante constante, sin sombras oscuras
    flatShading: true,
  });

  const irisColorHex = opts.irisColor || '#2E1E1E';
  const irisMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(irisColorHex),
    roughness: 0.35,
    metalness: 0.0,
    flatShading: true,
  });

  const sparkleMat = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
  });

  const linerMat = new THREE.MeshStandardMaterial({
    color: 0x241620,
    roughness: 0.5,
    metalness: 0.0,
    flatShading: true,
  });

  const mouthMat = new THREE.MeshStandardMaterial({
    color: 0xE05375, // Frambuesa coral radiante
    roughness: 0.35,
    metalness: 0.0,
    emissive: 0x441020,
    flatShading: true,
  });

  const teethMat = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    roughness: 0.2,
    metalness: 0.0,
    emissive: 0xFFFFFF,
    emissiveIntensity: 0.30,
    flatShading: true,
  });

  // C. OJOS 3D LIMPIOS (ESCLERA BLANCA + IRIS + DESTELLO ESPECULAR + LÍNEA SUPERIOR FINA)
  // Solo ojos y boca: sin cejas, sin nariz, sin alas pesadas, sin rubor recargado
  [-1, 1].forEach((side) => {
    const eyeGroup = new THREE.Group();
    eyeGroup.position.set(side * 0.088, 0.145, 0.192);
    eyeGroup.rotation.y = side * 0.16;
    head.add(eyeGroup);

    // 1. Esclera blanca elíptica
    const scleraGeo = new THREE.CylinderGeometry(0.040, 0.040, 0.012, 14);
    const scleraMesh = new THREE.Mesh(scleraGeo, scleraMat);
    scleraMesh.rotation.x = Math.PI / 2;
    scleraMesh.scale.set(1.15, 1.0, 1.30);
    eyeGroup.add(scleraMesh);

    // 2. Iris / Pupila limpia en tono espresso profundo
    const irisGeo = new THREE.CylinderGeometry(0.027, 0.027, 0.014, 12);
    const irisMesh = new THREE.Mesh(irisGeo, irisMat);
    irisMesh.rotation.x = Math.PI / 2;
    irisMesh.scale.set(1.0, 1.0, 1.15);
    irisMesh.position.set(side * 0.002, -0.002, 0.005);
    eyeGroup.add(irisMesh);

    // 3. Brillo especular blanco simple y expresivo
    const sparkGeo = new THREE.SphereGeometry(0.0085, 8, 8);
    const sparkMesh = new THREE.Mesh(sparkGeo, sparkleMat);
    sparkMesh.position.set(-side * 0.009, 0.012, 0.014);
    eyeGroup.add(sparkMesh);

    // 4. Contorno superior sutil que enmarca el ojo
    const linerGeo = new THREE.BoxGeometry(0.082, 0.012, 0.014);
    const linerMesh = new THREE.Mesh(linerGeo, linerMat);
    linerMesh.position.set(0, 0.038, 0.008);
    linerMesh.rotation.z = -side * 0.08;
    eyeGroup.add(linerMesh);
  });

  // D. BOCA Y SONRISA ALEGRE EN 3D CON DIENTES (LIMPIA Y ELEGANTE)
  const mouthGroup = new THREE.Group();
  mouthGroup.position.set(0, 0.052, 0.208);
  head.add(mouthGroup);

  // Arco sonriente hacia arriba en 3D
  const smileGeo = new THREE.TorusGeometry(0.036, 0.009, 8, 16, Math.PI);
  const smileMesh = new THREE.Mesh(smileGeo, mouthMat);
  smileMesh.rotation.z = Math.PI; // Curva alegre hacia arriba
  mouthGroup.add(smileMesh);

  // Dientes blancos en el interior de la sonrisa
  const teethGeo = new THREE.BoxGeometry(0.036, 0.009, 0.012);
  const teethMesh = new THREE.Mesh(teethGeo, teethMat);
  teethMesh.position.set(0, 0.006, -0.004);
  mouthGroup.add(teethMesh);

  // -----------------------------------------------------------
  // 5. CABELLO ESCULPIDO (SOLO EN PARTE SUPERIOR, LATERALES Y POSTERIOR)
  // Ningún polígono de cabello invade el área del rostro (Z > 0.12)
  // -----------------------------------------------------------
  const hairGroup = new THREE.Group();
  head.add(hairGroup);
  parts.hair = hairGroup;

  // Casquete posterior y superior (situado detrás del rostro en Z = -0.06)
  const hairCapGeo = new THREE.SphereGeometry(0.27, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.58);
  const hairCapMesh = new THREE.Mesh(hairCapGeo, hairMat);
  hairCapMesh.position.set(0, 0.18, -0.06);
  hairCapMesh.scale.set(1.04, 1.04, 0.82); // No llega al frente del rostro
  hairCapMesh.castShadow = true;
  hairGroup.add(hairCapMesh);

  // Peinado superior: dos mechones que nacen arriba y van hacia los lados
  [-0.15, 0.15].forEach((xOff, idx) => {
    const tuftGeo = new THREE.ConeGeometry(0.075, 0.20, 6);
    const tuft = new THREE.Mesh(tuftGeo, hairMat);
    tuft.position.set(xOff, 0.32, 0.08); // Arriba en la coronilla, no baja a la cara
    tuft.rotation.z = idx === 0 ? 0.45 : -0.45;
    tuft.rotation.x = -0.15;
    tuft.castShadow = false;
    hairGroup.add(tuft);
  });

  // Mechones laterales externos que enmarcan la cabeza a los costados
  const sideLGeo = new THREE.ConeGeometry(0.08, 0.44, 6);
  const sideLMesh = new THREE.Mesh(sideLGeo, hairMat);
  sideLMesh.position.set(-0.25, 0.06, 0.02);
  sideLMesh.rotation.z = 0.12;
  sideLMesh.castShadow = true;
  hairGroup.add(sideLMesh);

  const sideRMesh = new THREE.Mesh(sideLGeo, hairMat);
  sideRMesh.position.set(0.25, 0.06, 0.02);
  sideRMesh.rotation.z = -0.12;
  sideRMesh.castShadow = true;
  hairGroup.add(sideRMesh);

  // Estilo posterior
  const hairStyle = opts.hairStyle || 'long_wavy';

  if (hairStyle === 'ponytail' || hairStyle === 'high_ponytail') {
    const tieGeo = new THREE.TorusGeometry(0.06, 0.025, 6, 8);
    const tieMesh = new THREE.Mesh(tieGeo, accentMat);
    tieMesh.position.set(0, 0.28, -0.25);
    tieMesh.rotation.x = 0.8;
    hairGroup.add(tieMesh);

    const ponyGeo = new THREE.ConeGeometry(0.14, 0.55, 8);
    const ponyMesh = new THREE.Mesh(ponyGeo, hairMat);
    ponyMesh.position.set(0, 0.12, -0.36);
    ponyMesh.rotation.x = -0.55;
    ponyMesh.castShadow = true;
    hairGroup.add(ponyMesh);
    parts.ponytail = ponyMesh;
  } else if (hairStyle === 'bob') {
    const bobBackGeo = new THREE.CylinderGeometry(0.26, 0.22, 0.32, 10, 1, false, Math.PI * 0.6, Math.PI * 1.8);
    const bobBack = new THREE.Mesh(bobBackGeo, hairMat);
    bobBack.position.set(0, 0.06, -0.08);
    bobBack.castShadow = true;
    hairGroup.add(bobBack);
  } else {
    // Long Wavy
    const wavesGroup = new THREE.Group();
    wavesGroup.position.set(0, 0.05, -0.14);
    hairGroup.add(wavesGroup);
    parts.hairWaves = wavesGroup;

    for (let w = 0; w < 5; w++) {
      const xOff = (w - 2) * 0.09;
      const waveGeo = new THREE.ConeGeometry(0.08, 0.62, 6);
      const waveMesh = new THREE.Mesh(waveGeo, hairMat);
      waveMesh.position.set(xOff, -0.16, -Math.abs(xOff) * 0.2);
      waveMesh.rotation.x = -0.22;
      waveMesh.rotation.z = xOff * 0.4;
      waveMesh.castShadow = true;
      wavesGroup.add(waveMesh);
    }
  }

  // -----------------------------------------------------------
  // 6. BRAZOS Y MANOS ARTICULADAS
  // -----------------------------------------------------------
  const sleeveMat = (opts.sleeves === 'long') ? topMat : skinMat;

  // Brazo Izquierdo
  const shoulderL = new THREE.Group();
  shoulderL.position.set(-0.31, 0.26, 0);
  chestGroup.add(shoulderL);
  parts.shoulderL = shoulderL;

  const shoulderJointL = new THREE.Mesh(new THREE.SphereGeometry(0.072, 8, 8), topMat);
  shoulderL.add(shoulderJointL);

  const upperArmLGeo = new THREE.CylinderGeometry(0.068, 0.058, 0.26, 8);
  const upperArmL = new THREE.Mesh(upperArmLGeo, sleeveMat);
  upperArmL.position.y = -0.13;
  upperArmL.castShadow = true;
  shoulderL.add(upperArmL);

  const elbowL = new THREE.Group();
  elbowL.position.y = -0.26;
  shoulderL.add(elbowL);
  parts.elbowL = elbowL;

  const elbowJointL = new THREE.Mesh(new THREE.SphereGeometry(0.058, 8, 8), skinMat);
  elbowL.add(elbowJointL);

  const forearmLGeo = new THREE.CylinderGeometry(0.058, 0.048, 0.24, 8);
  const forearmL = new THREE.Mesh(forearmLGeo, skinMat);
  forearmL.position.y = -0.12;
  forearmL.castShadow = true;
  elbowL.add(forearmL);

  const handLGroup = new THREE.Group();
  handLGroup.position.y = -0.24;
  elbowL.add(handLGroup);
  parts.handL = handLGroup;

  const palmL = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.038, 0.10, 8), skinMat);
  palmL.position.y = -0.04;
  palmL.castShadow = true;
  handLGroup.add(palmL);

  const thumbL = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.06, 5), skinMat);
  thumbL.position.set(0.035, -0.02, 0.02);
  thumbL.rotation.z = -0.45;
  handLGroup.add(thumbL);

  // Brazo Derecho
  const shoulderR = new THREE.Group();
  shoulderR.position.set(0.31, 0.26, 0);
  chestGroup.add(shoulderR);
  parts.shoulderR = shoulderR;

  const shoulderJointR = new THREE.Mesh(new THREE.SphereGeometry(0.072, 8, 8), topMat);
  shoulderR.add(shoulderJointR);

  const upperArmR = new THREE.Mesh(upperArmLGeo, sleeveMat);
  upperArmR.position.y = -0.13;
  upperArmR.castShadow = true;
  shoulderR.add(upperArmR);

  const elbowR = new THREE.Group();
  elbowR.position.y = -0.26;
  shoulderR.add(elbowR);
  parts.elbowR = elbowR;

  const elbowJointR = new THREE.Mesh(new THREE.SphereGeometry(0.058, 8, 8), skinMat);
  elbowR.add(elbowJointR);

  const forearmR = new THREE.Mesh(forearmLGeo, skinMat);
  forearmR.position.y = -0.12;
  forearmR.castShadow = true;
  elbowR.add(forearmR);

  const handRGroup = new THREE.Group();
  handRGroup.position.y = -0.24;
  elbowR.add(handRGroup);
  parts.handR = handRGroup;

  const palmR = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.038, 0.10, 8), skinMat);
  palmR.position.y = -0.04;
  palmR.castShadow = true;
  handRGroup.add(palmR);

  const thumbR = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.06, 5), skinMat);
  thumbR.position.set(-0.035, -0.02, 0.02);
  thumbR.rotation.z = 0.45;
  handRGroup.add(thumbR);

  if (opts.hasPhone) {
    const phoneHolder = new THREE.Group();
    phoneHolder.position.set(0, -0.06, 0.06);
    phoneHolder.rotation.x = Math.PI / 4;
    handRGroup.add(phoneHolder);

    const miniPhoneMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.22, 0.02),
      createLowPolyMaterial('#1F2937', 0.4)
    );
    const miniScreenMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.105, 0.20, 0.005),
      createLowPolyMaterial('#FCE7F0', 0.2)
    );
    miniScreenMesh.position.z = 0.011;
    phoneHolder.add(miniPhoneMesh);
    phoneHolder.add(miniScreenMesh);
    parts.miniPhone = phoneHolder;
  }

  // -----------------------------------------------------------
  // 7. PIERNAS Y CALZADO (100% APOYADOS EN EL PISO REAL Y = 0.00)
  // -----------------------------------------------------------
  const pantsLength = opts.pantsLength || 'shorts';
  const thighMat = pantsLength === 'shorts' ? skinMat : bottomMat;
  const calfMat = pantsLength === 'shorts' ? skinMat : bottomMat;

  // Pierna Izquierda
  const legJointL = new THREE.Group();
  legJointL.position.set(-0.14, -0.08, 0); // Y = 0.84 - 0.08 = 0.76
  hips.add(legJointL);
  parts.legL = legJointL;

  const thighLGeo = new THREE.CylinderGeometry(0.095, 0.075, 0.38, 8);
  const thighL = new THREE.Mesh(thighLGeo, thighMat);
  thighL.position.y = -0.19; // Centrado
  thighL.castShadow = true;
  legJointL.add(thighL);

  const kneeL = new THREE.Group();
  kneeL.position.y = -0.38; // Y = 0.76 - 0.38 = 0.38
  legJointL.add(kneeL);
  parts.kneeL = kneeL;

  const kneeJointMeshL = new THREE.Mesh(new THREE.SphereGeometry(0.072, 8, 8), skinMat);
  kneeL.add(kneeJointMeshL);

  const calfLGeo = new THREE.CylinderGeometry(0.072, 0.058, 0.38, 8);
  const calfL = new THREE.Mesh(calfLGeo, calfMat);
  calfL.position.y = -0.19; // Centrado
  calfL.castShadow = true;
  kneeL.add(calfL);

  const footL = new THREE.Group();
  footL.position.set(0, -0.38, 0); // Y = 0.38 - 0.38 = 0.00 EXACTO EN EL PISO
  kneeL.add(footL);
  parts.footL = footL;

  buildShoe(footL, opts.shoeType || 'sneaker', shoesMat, soleMat, accentMat);

  // Pierna Derecha
  const legJointR = new THREE.Group();
  legJointR.position.set(0.14, -0.08, 0);
  hips.add(legJointR);
  parts.legR = legJointR;

  const thighR = new THREE.Mesh(thighLGeo, thighMat);
  thighR.position.y = -0.19;
  thighR.castShadow = true;
  legJointR.add(thighR);

  const kneeR = new THREE.Group();
  kneeR.position.y = -0.38;
  legJointR.add(kneeR);
  parts.kneeR = kneeR;

  const kneeJointMeshR = new THREE.Mesh(new THREE.SphereGeometry(0.072, 8, 8), skinMat);
  kneeR.add(kneeJointMeshR);

  const calfR = new THREE.Mesh(calfLGeo, calfMat);
  calfR.position.y = -0.19;
  calfR.castShadow = true;
  kneeR.add(calfR);

  const footR = new THREE.Group();
  footR.position.set(0, -0.38, 0); // Y = 0.00 EXACTO EN EL PISO
  kneeR.add(footR);
  parts.footR = footR;

  buildShoe(footR, opts.shoeType || 'sneaker', shoesMat, soleMat, accentMat);

  // -----------------------------------------------------------
  // 8. MOTOR DE ANIMACIÓN Y POSES
  // -----------------------------------------------------------
  function setPose(pose = {}) {
    if (pose.rootY !== undefined) root.position.y = pose.rootY;
    if (pose.rootRotY !== undefined) root.rotation.y = pose.rootRotY;

    if (pose.hipsY !== undefined) hips.position.y = 0.84 + pose.hipsY;
    if (pose.hipSway !== undefined) hips.rotation.z = pose.hipSway;
    if (pose.hipTwist !== undefined) hips.rotation.y = pose.hipTwist;

    if (pose.torsoTilt !== undefined) torso.rotation.x = pose.torsoTilt;
    if (pose.torsoTwist !== undefined) torso.rotation.y = pose.torsoTwist;
    if (pose.torsoSway !== undefined) torso.rotation.z = pose.torsoSway;

    if (pose.headTilt !== undefined) head.rotation.x = pose.headTilt;
    if (pose.headTurn !== undefined) head.rotation.y = pose.headTurn;
    if (pose.headRoll !== undefined) head.rotation.z = pose.headRoll;

    if (pose.armLX !== undefined) shoulderL.rotation.x = pose.armLX;
    if (pose.armLY !== undefined) shoulderL.rotation.y = pose.armLY;
    if (pose.armLZ !== undefined) shoulderL.rotation.z = pose.armLZ;
    if (pose.elbowLX !== undefined) elbowL.rotation.x = pose.elbowLX;

    if (pose.armRX !== undefined) shoulderR.rotation.x = pose.armRX;
    if (pose.armRY !== undefined) shoulderR.rotation.y = pose.armRY;
    if (pose.armRZ !== undefined) shoulderR.rotation.z = pose.armRZ;
    if (pose.elbowRX !== undefined) elbowR.rotation.x = pose.elbowRX;

    if (pose.legLX !== undefined) legJointL.rotation.x = pose.legLX;
    if (pose.legLZ !== undefined) legJointL.rotation.z = pose.legLZ;
    if (pose.kneeLX !== undefined) kneeL.rotation.x = pose.kneeLX;

    if (pose.legRX !== undefined) legJointR.rotation.x = pose.legRX;
    if (pose.legRZ !== undefined) legJointR.rotation.z = pose.legRZ;
    if (pose.kneeRX !== undefined) kneeR.rotation.x = pose.kneeRX;
  }

  function updateDance(t, style = 'choreo_videoclip', speed = 1.0) {
    const time = t * speed;

    if (style === 'frustrated_practice') {
      const cycle = time * 2.8;
      const bob = Math.abs(Math.sin(cycle * 2)) * 0.05;
      const sway = Math.sin(cycle) * 0.12;

      setPose({
        hipsY: -bob,
        hipSway: sway * 0.4,
        torsoTilt: 0.18 + Math.sin(cycle) * 0.05,
        headTilt: 0.18 + Math.sin(cycle * 1.5) * 0.06,
        headTurn: Math.cos(cycle * 0.8) * 0.12,
        armLX: -0.3 + Math.sin(cycle) * 0.35,
        armLZ: -0.25,
        elbowLX: -0.7,
        armRX: -0.4 - Math.sin(cycle) * 0.35,
        armRZ: 0.25,
        elbowRX: -0.85,
        legLX: Math.sin(cycle) * 0.25,
        kneeLX: Math.max(0, -Math.sin(cycle) * 0.35),
        legRX: -Math.sin(cycle) * 0.25,
        kneeRX: Math.max(0, Math.sin(cycle) * 0.35),
      });
    } else if (style === 'celebrate_victory') {
      const cycle = time * 4.2;
      const bounce = Math.abs(Math.sin(cycle)) * 0.08;

      setPose({
        hipsY: bounce,
        hipSway: Math.sin(cycle * 0.5) * 0.06,
        torsoTilt: -0.04,
        headTilt: -0.10,
        headTurn: Math.sin(cycle * 0.5) * 0.10,
        armLX: -2.3 + Math.sin(cycle) * 0.18,
        armLZ: -0.45,
        elbowLX: -0.25,
        armRX: -2.3 - Math.sin(cycle) * 0.18,
        armRZ: 0.45,
        elbowRX: -0.25,
        legLX: 0.04,
        legLZ: -0.10,
        legRX: -0.04,
        legRZ: 0.10,
      });
    } else {
      // Choreo Videoclip
      const bpm = 118;
      const beat = (time * bpm) / 60;
      const cycle = beat * Math.PI;

      const bob = Math.abs(Math.sin(cycle)) * 0.05;
      const hipSway = Math.sin(cycle * 0.5) * 0.18;

      setPose({
        hipsY: -bob,
        hipSway: hipSway,
        hipTwist: Math.cos(cycle * 0.5) * 0.12,
        torsoTilt: Math.sin(cycle) * 0.06,
        torsoSway: -hipSway * 0.6,
        headTilt: -Math.sin(cycle) * 0.04,
        headTurn: Math.sin(cycle * 0.5) * 0.16,
        headRoll: -hipSway * 0.35,

        armLX: -0.4 + Math.cos(cycle * 0.5) * 0.50,
        armLZ: -0.4 - Math.sin(cycle * 0.5) * 0.30,
        elbowLX: -0.80 + Math.sin(cycle) * 0.35,

        armRX: -0.4 - Math.cos(cycle * 0.5) * 0.50,
        armRZ: 0.4 + Math.sin(cycle * 0.5) * 0.30,
        elbowRX: -0.80 - Math.sin(cycle) * 0.35,

        legLX: Math.sin(cycle * 0.5) * 0.22,
        kneeLX: Math.max(0, -Math.sin(cycle * 0.5) * 0.35),
        legRX: -Math.sin(cycle * 0.5) * 0.22,
        kneeRX: Math.max(0, Math.sin(cycle * 0.5) * 0.35),
      });

      if (parts.hairWaves) {
        parts.hairWaves.rotation.z = -hipSway * 0.5;
      }
      if (parts.ponytail) {
        parts.ponytail.rotation.z = -hipSway * 0.7;
      }
    }
  }

  return {
    root,
    parts,
    materials: { skinMat, hairMat, topMat, bottomMat, shoesMat },
    setPose,
    updateDance,
  };
}

/**
 * Genera el calzado facetado (Sneaker o Taco) con suela descansando en Y = 0.00
 */
function buildShoe(parent, type, shoeMat, soleMat, accentMat) {
  if (type === 'heels') {
    const soleGeo = new THREE.BoxGeometry(0.12, 0.02, 0.24);
    const soleMesh = new THREE.Mesh(soleGeo, soleMat);
    soleMesh.position.set(0, 0.01, 0.04);
    parent.add(soleMesh);

    const heelPegGeo = new THREE.CylinderGeometry(0.016, 0.010, 0.10, 6);
    const heelPeg = new THREE.Mesh(heelPegGeo, accentMat);
    heelPeg.position.set(0, 0.05, -0.05);
    parent.add(heelPeg);

    const strapGeo = new THREE.TorusGeometry(0.06, 0.016, 5, 8);
    const strap = new THREE.Mesh(strapGeo, shoeMat);
    strap.position.set(0, 0.07, 0.04);
    strap.rotation.x = Math.PI / 2.3;
    parent.add(strap);
  } else {
    // Sneaker Chunky con suela blanca que asienta en Y = 0.00
    // Suela: altura 0.04, base en Y = 0.00, centro en Y = 0.02
    const soleGeo = new THREE.BoxGeometry(0.14, 0.04, 0.28);
    const soleMesh = new THREE.Mesh(soleGeo, soleMat);
    soleMesh.position.set(0, 0.02, 0.05);
    soleMesh.castShadow = true;
    parent.add(soleMesh);

    // Empeine
    const upperGeo = new THREE.BoxGeometry(0.13, 0.07, 0.24);
    const upperMesh = new THREE.Mesh(upperGeo, shoeMat);
    upperMesh.position.set(0, 0.065, 0.03);
    upperMesh.castShadow = true;
    parent.add(upperMesh);

    // Puntera biselada
    const toeGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.06, 8);
    const toeMesh = new THREE.Mesh(toeGeo, shoeMat);
    toeMesh.position.set(0, 0.06, 0.14);
    toeMesh.scale.set(0.95, 1.0, 0.6);
    parent.add(toeMesh);

    // Franja de acento
    const stripeGeo = new THREE.BoxGeometry(0.135, 0.018, 0.08);
    const stripeMesh = new THREE.Mesh(stripeGeo, accentMat);
    stripeMesh.position.set(0, 0.095, 0.04);
    parent.add(stripeMesh);
  }
}
