// ============================================================================
// BAILAPP 3D — CHARACTER BUILDER V12 (PERFECTED SCULPTED DANCER & VOLUMETRIC HAIR)
// ============================================================================
// Directivas exactas del usuario:
// 1. Escenas: NO TOCADAS (permanecen vacías, congeladas y aprobadas).
// 2. Rostros: NO TOCADOS (ojos almendrados con punto blanco, cejas cuadradas,
//    boca en línea, mentón y cráneo aprobados).
// 3. Brazos: NO TOCADOS (hombros, codos, antebrazos, manos y pulgares aprobados).
// 4. RESTO DEL CUERPO REHECHO DESDE CERO:
//    - Cero salientes ni estantes: pretina entallada cónica que abraza la cintura.
//    - Transición continua y suave de torso -> cintura -> cadera -> muslos -> rodilla -> pantorrilla -> calzado.
//    - Zapatillas chunky apoyadas exactamente en el suelo (Y = 0.00).
// 5. CABELLO CON GRAN VOLUMEN 3D Y FRENTE DESPEJADA:
//    - Cúpula craneal de gran volumen con nacimiento de cabello en arco estilizado (curtain bangs).
//    - Frente, cejas (Y=0.113) y ojos (Y=0.065) 100% DESPEJADOS e iluminados.
//    - Siluetas icónicas y volumétricas para cada peinado (ondas, rodete, coleta K-pop, bob).
// ============================================================================

import * as THREE from '../three.module.js';
import { buildHairstyle } from './hair_styles.js';

export function createLowPolyMaterial(color, roughness = 0.82, metalness = 0.03) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness,
    metalness,
    flatShading: true,
  });
}

/**
 * Constructor de Personaje Bailapp V12
 */
export function buildEnhancedCharacter(opts = {}) {
  const root = new THREE.Group();

  // Paleta de color
  const skinColor = opts.skinColor || '#FFDEC8';
  const hairColor = opts.hairColor || '#231B26';
  const topColor = opts.topColor || '#E06385';
  const bottomColor = opts.bottomColor || '#1F2937';
  const shoesColor = opts.shoesColor || '#FFFFFF';
  const accentColor = opts.accentColor || '#F472B6';
  const soleColor = opts.soleColor || '#F3F4F6';

  const skinMat = createLowPolyMaterial(skinColor, 0.80, 0.0);
  const hairMat = createLowPolyMaterial(hairColor, 0.88, 0.0);
  const topMat = createLowPolyMaterial(topColor, 0.78, 0.02);
  const bottomMat = createLowPolyMaterial(bottomColor, 0.82, 0.0);
  const shoesMat = createLowPolyMaterial(shoesColor, 0.68, 0.0);
  const soleMat = createLowPolyMaterial(soleColor, 0.85, 0.0);
  const accentMat = createLowPolyMaterial(accentColor, 0.75, 0.02);

  const blackMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const whiteMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

  const parts = {};

  // 1. Sombra de contacto en el piso (Y = 0.00)
  const shadowGeo = new THREE.CylinderGeometry(0.44, 0.48, 0.004, 14);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x3A1B28,
    transparent: true,
    opacity: 0.22,
  });
  const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
  contactShadow.position.y = 0.002;
  root.add(contactShadow);
  parts.contactShadow = contactShadow;

  // ==========================================================================
  // 2. CADERA / PELVIS ESCULPIDA (BASE Y = 0.78)
  // ==========================================================================
  const hips = new THREE.Group();
  hips.position.y = 0.78;
  root.add(hips);
  parts.hips = hips;

  const isJogger = (opts.pantsLength === 'jogger');
  const isCrop = (opts.topType === 'croptop');
  const isHoodie = (opts.topType === 'hoodie');

  const pelvisGroup = new THREE.Group();
  hips.add(pelvisGroup);
  parts.pelvis = pelvisGroup;

  // Cuenca pélvica femenina atlética
  const pelvisCoreGeo = new THREE.CylinderGeometry(0.174, 0.148, 0.18, 12);
  const pelvisCore = new THREE.Mesh(pelvisCoreGeo, bottomMat);
  pelvisCore.position.y = -0.01;
  pelvisCore.scale.set(1.15, 1.0, 0.84);
  pelvisCore.castShadow = true;
  pelvisGroup.add(pelvisCore);

  // Sillín inguinal continuo
  const crotchGeo = new THREE.CylinderGeometry(0.065, 0.048, 0.14, 8);
  const crotch = new THREE.Mesh(crotchGeo, bottomMat);
  crotch.position.set(0, -0.08, 0.0);
  crotch.scale.set(1.0, 1.0, 0.82);
  crotch.castShadow = true;
  pelvisGroup.add(crotch);

  // Pretina entallada que abraza la cintura suavemente (sin estantes salientes)
  const waistbandGeo = new THREE.CylinderGeometry(0.150, 0.176, 0.04, 12);
  const waistband = new THREE.Mesh(waistbandGeo, accentMat);
  waistband.position.y = 0.08;
  waistband.scale.set(1.14, 1.0, 0.82);
  waistband.castShadow = true;
  pelvisGroup.add(waistband);

  // ==========================================================================
  // 3. TORSO CONTINUO Y ESCULPIDO
  // ==========================================================================
  const torso = new THREE.Group();
  torso.position.y = 0.06;
  hips.add(torso);
  parts.torso = torso;

  // A. Cintura estilizada de bailarina (entallada y continua)
  const waistMat = isCrop ? skinMat : topMat;
  const waistGeo = new THREE.CylinderGeometry(0.130, 0.152, 0.18, 12);
  const waist = new THREE.Mesh(waistGeo, waistMat);
  waist.position.y = 0.08;
  waist.scale.set(1.10, 1.0, 0.78);
  waist.castShadow = true;
  torso.add(waist);

  // B. Caja Torácica y Pecho
  const chestGroup = new THREE.Group();
  chestGroup.position.y = 0.15;
  torso.add(chestGroup);
  parts.chest = chestGroup;

  const chestScaleX = isHoodie ? 1.25 : 1.14;
  const chestScaleZ = isHoodie ? 0.94 : 0.80;

  // Tórax inferior atlético
  const lowerRibGeo = new THREE.CylinderGeometry(0.168, 0.134, 0.14, 12);
  const lowerRib = new THREE.Mesh(lowerRibGeo, topMat);
  lowerRib.position.y = 0.055;
  lowerRib.scale.set(chestScaleX, 1.0, chestScaleZ);
  lowerRib.castShadow = true;
  chestGroup.add(lowerRib);

  // Busto atlético femenino
  const upperRibGeo = new THREE.CylinderGeometry(0.192, 0.166, 0.14, 12);
  const upperRib = new THREE.Mesh(upperRibGeo, topMat);
  upperRib.position.y = 0.165;
  upperRib.scale.set(chestScaleX * 1.02, 1.0, chestScaleZ * 1.04);
  upperRib.castShadow = true;
  chestGroup.add(upperRib);

  // Clavícula / hombrera integrada sólidamente
  const shoulderBridgeGeo = new THREE.BoxGeometry(0.48, 0.06, 0.16);
  const shoulderBridge = new THREE.Mesh(shoulderBridgeGeo, topMat);
  shoulderBridge.position.set(0, 0.21, 0.0);
  shoulderBridge.castShadow = true;
  chestGroup.add(shoulderBridge);

  if (isHoodie) {
    const hoodCollarGeo = new THREE.TorusGeometry(0.18, 0.065, 6, 12, Math.PI * 1.6);
    const hoodCollar = new THREE.Mesh(hoodCollarGeo, topMat);
    hoodCollar.position.set(0, 0.23, -0.04);
    hoodCollar.rotation.x = Math.PI / 1.7;
    chestGroup.add(hoodCollar);
  } else {
    const collarGeo = new THREE.TorusGeometry(0.095, 0.016, 6, 10);
    const collar = new THREE.Mesh(collarGeo, accentMat);
    collar.position.set(0, 0.24, 0.02);
    collar.rotation.x = Math.PI / 2.2;
    chestGroup.add(collar);
  }

  // Cuello estilizado
  const neckGeo = new THREE.CylinderGeometry(0.060, 0.070, 0.14, 8);
  const neck = new THREE.Mesh(neckGeo, skinMat);
  neck.position.y = 0.285;
  neck.castShadow = true;
  chestGroup.add(neck);

  // ==========================================================================
  // 4. CABEZA Y ROSTRO APROBADOS (NO TOCADOS)
  // ==========================================================================
  const head = new THREE.Group();
  head.position.y = 0.44;
  chestGroup.add(head);
  parts.head = head;

  // Base craneal
  const skullGeo = new THREE.SphereGeometry(0.215, 12, 10);
  const skull = new THREE.Mesh(skullGeo, skinMat);
  skull.position.set(0, 0.07, 0.0);
  skull.scale.set(1.0, 1.04, 0.96);
  skull.castShadow = true;
  head.add(skull);

  // Mentón suavemente biselado
  const chinGeo = new THREE.ConeGeometry(0.12, 0.08, 8);
  const chin = new THREE.Mesh(chinGeo, skinMat);
  chin.position.set(0, -0.07, 0.015);
  chin.rotation.x = Math.PI;
  chin.scale.set(1.0, 1.0, 0.88);
  head.add(chin);

  // A. OJOS: Almendrados/redondos todo negro con detalle blanco (Aprobados)
  [-1, 1].forEach(side => {
    const eyeGroup = new THREE.Group();
    eyeGroup.position.set(side * 0.072, 0.065, 0.195);
    eyeGroup.rotation.y = side * 0.16;
    head.add(eyeGroup);

    const eyeGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.008, 12);
    const eyeMesh = new THREE.Mesh(eyeGeo, blackMat);
    eyeMesh.rotation.x = Math.PI / 2;
    eyeMesh.scale.set(1.0, 1.0, 1.15);
    eyeGroup.add(eyeMesh);

    const gleamGeo = new THREE.SphereGeometry(0.008, 8, 8);
    const gleamMesh = new THREE.Mesh(gleamGeo, whiteMat);
    gleamMesh.position.set(-side * 0.007, 0.008, 0.006);
    eyeGroup.add(gleamMesh);

    // B. CEJAS CUADRADAS (Aprobadas)
    const browGeo = new THREE.BoxGeometry(0.046, 0.013, 0.010);
    const browMesh = new THREE.Mesh(browGeo, blackMat);
    browMesh.position.set(0, 0.048, 0.005);
    browMesh.rotation.z = -side * 0.04;
    eyeGroup.add(browMesh);
  });

  // C. BOCA: UNA LÍNEA RECTA LIMPIA EN REPOSO (Aprobada)
  const mouthMode = opts.mouthMode || 'line';
  const mouthGroup = new THREE.Group();
  mouthGroup.position.set(0, -0.042, 0.205);
  head.add(mouthGroup);
  parts.mouthGroup = mouthGroup;

  if (mouthMode === 'circle') {
    const mouthCircle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.008, 14),
      blackMat
    );
    mouthCircle.rotation.x = Math.PI / 2;
    mouthGroup.add(mouthCircle);
  } else {
    const mouthLine = new THREE.Mesh(
      new THREE.BoxGeometry(0.042, 0.008, 0.008),
      blackMat
    );
    mouthGroup.add(mouthLine);
  }

  // ==========================================================================
  // 5. CABELLO VOLUMÉTRICO 3D (CERO HOJAS PLANAS, FRENTE Y OJOS 100% DESPEJADOS)
  // ==========================================================================
  const rawStyle = opts.hairStyle || 'ref_chunky_bob';
  let resolvedStyle = rawStyle;
  if (rawStyle === 'long_wavy') resolvedStyle = 'ref_long_curtain';
  if (rawStyle === 'high_ponytail') resolvedStyle = 'high_ponytail_slick';
  if (rawStyle === 'bob') resolvedStyle = 'ref_chunky_bob';
  if (rawStyle === 'curtain_waves') resolvedStyle = 'ref_chunky_bob';
  if (rawStyle === 'top_bun') resolvedStyle = 'space_buns';

  const hairGroup = buildHairstyle(head, resolvedStyle, hairMat, accentMat);
  parts.hair = hairGroup;

  // ==========================================================================
  // 6. BRAZOS Y MANOS ARTICULADAS (APROBADOS SIN CAMBIOS)
  // ==========================================================================
  const isLongSleeves = (opts.sleeves === 'long');
  const sleeveMat = isLongSleeves ? topMat : skinMat;

  // Brazo Izquierdo
  const shoulderL = new THREE.Group();
  shoulderL.position.set(-0.25, 0.22, 0.0);
  chestGroup.add(shoulderL);
  parts.shoulderL = shoulderL;

  const upperArmLGeo = new THREE.CylinderGeometry(0.052, 0.044, 0.26, 8);
  const upperArmL = new THREE.Mesh(upperArmLGeo, sleeveMat);
  upperArmL.position.y = -0.13;
  upperArmL.castShadow = true;
  shoulderL.add(upperArmL);

  const elbowL = new THREE.Group();
  elbowL.position.y = -0.26;
  shoulderL.add(elbowL);
  parts.elbowL = elbowL;

  const forearmLGeo = new THREE.CylinderGeometry(0.044, 0.038, 0.24, 8);
  const forearmL = new THREE.Mesh(forearmLGeo, skinMat);
  forearmL.position.y = -0.12;
  forearmL.castShadow = true;
  elbowL.add(forearmL);

  const handLGroup = new THREE.Group();
  handLGroup.position.y = -0.24;
  elbowL.add(handLGroup);
  parts.handL = handLGroup;

  const palmL = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.075, 0.026), skinMat);
  palmL.position.y = -0.035;
  palmL.castShadow = true;
  handLGroup.add(palmL);

  const thumbL = new THREE.Mesh(new THREE.ConeGeometry(0.016, 0.045, 5), skinMat);
  thumbL.position.set(0.028, -0.02, 0.015);
  thumbL.rotation.z = -0.35;
  handLGroup.add(thumbL);

  // Brazo Derecho
  const shoulderR = new THREE.Group();
  shoulderR.position.set(0.25, 0.22, 0.0);
  chestGroup.add(shoulderR);
  parts.shoulderR = shoulderR;

  const upperArmR = new THREE.Mesh(upperArmLGeo, sleeveMat);
  upperArmR.position.y = -0.13;
  upperArmR.castShadow = true;
  shoulderR.add(upperArmR);

  const elbowR = new THREE.Group();
  elbowR.position.y = -0.26;
  shoulderR.add(elbowR);
  parts.elbowR = elbowR;

  const forearmR = new THREE.Mesh(forearmLGeo, skinMat);
  forearmR.position.y = -0.12;
  forearmR.castShadow = true;
  elbowR.add(forearmR);

  const handRGroup = new THREE.Group();
  handRGroup.position.y = -0.24;
  elbowR.add(handRGroup);
  parts.handR = handRGroup;

  const palmR = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.075, 0.026), skinMat);
  palmR.position.y = -0.035;
  palmR.castShadow = true;
  handRGroup.add(palmR);

  const thumbR = new THREE.Mesh(new THREE.ConeGeometry(0.016, 0.045, 5), skinMat);
  thumbR.position.set(-0.028, -0.02, 0.015);
  thumbR.rotation.z = 0.35;
  handRGroup.add(thumbR);

  // ==========================================================================
  // 7. PIERNAS REHECHAS CONTINUAS (APOYADAS EN EL SUELO Y = 0.00)
  // ==========================================================================
  const legMat = isJogger ? bottomMat : skinMat;

  // Pierna Izquierda
  const legL = new THREE.Group();
  legL.position.set(-0.115, -0.04, 0.0);
  hips.add(legL);
  parts.legL = legL;

  // Muslo completo continuo
  const thighGeo = new THREE.CylinderGeometry(0.088, 0.056, 0.38, 12);
  const thighL = new THREE.Mesh(thighGeo, legMat);
  thighL.position.y = -0.19;
  thighL.scale.set(1.05, 1.0, 1.10);
  thighL.castShadow = true;
  legL.add(thighL);

  if (!isJogger) {
    const shortsLegGeo = new THREE.CylinderGeometry(0.094, 0.084, 0.12, 12);
    const shortsLegL = new THREE.Mesh(shortsLegGeo, bottomMat);
    shortsLegL.position.y = -0.06;
    shortsLegL.scale.set(1.05, 1.0, 1.10);
    shortsLegL.castShadow = true;
    legL.add(shortsLegL);
  }

  // Rodilla
  const kneeL = new THREE.Group();
  kneeL.position.y = -0.38;
  legL.add(kneeL);
  parts.kneeL = kneeL;

  const kneeJointL = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.054, 0.065, 8), legMat);
  kneeJointL.castShadow = true;
  kneeL.add(kneeJointL);

  const patellaL = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.054, 0.020), legMat);
  patellaL.position.set(0, 0.005, 0.046);
  kneeL.add(patellaL);

  // Pantorrilla
  const shinGeo = new THREE.CylinderGeometry(0.062, 0.042, 0.35, 12);
  const shinL = new THREE.Mesh(shinGeo, legMat);
  shinL.position.y = -0.175;
  shinL.scale.set(1.04, 1.0, 1.14);
  shinL.castShadow = true;
  kneeL.add(shinL);

  if (isJogger) {
    const cuffGeo = new THREE.CylinderGeometry(0.050, 0.046, 0.05, 10);
    const cuffL = new THREE.Mesh(cuffGeo, accentMat);
    cuffL.position.y = -0.33;
    kneeL.add(cuffL);
  }

  buildChunkyShoe(kneeL, opts.shoesType, shoesMat, soleMat, accentMat);

  // Pierna Derecha
  const legR = new THREE.Group();
  legR.position.set(0.115, -0.04, 0.0);
  hips.add(legR);
  parts.legR = legR;

  const thighR = new THREE.Mesh(thighGeo, legMat);
  thighR.position.y = -0.19;
  thighR.scale.set(1.05, 1.0, 1.10);
  thighR.castShadow = true;
  legR.add(thighR);

  if (!isJogger) {
    const shortsLegGeo = new THREE.CylinderGeometry(0.094, 0.084, 0.12, 12);
    const shortsLegR = new THREE.Mesh(shortsLegGeo, bottomMat);
    shortsLegR.position.y = -0.06;
    shortsLegR.scale.set(1.05, 1.0, 1.10);
    shortsLegR.castShadow = true;
    legR.add(shortsLegR);
  }

  const kneeR = new THREE.Group();
  kneeR.position.y = -0.38;
  legR.add(kneeR);
  parts.kneeR = kneeR;

  const kneeJointR = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.054, 0.065, 8), legMat);
  kneeJointR.castShadow = true;
  kneeR.add(kneeJointR);

  const patellaR = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.054, 0.020), legMat);
  patellaR.position.set(0, 0.005, 0.046);
  kneeR.add(patellaR);

  const shinR = new THREE.Mesh(shinGeo, legMat);
  shinR.position.y = -0.175;
  shinR.scale.set(1.04, 1.0, 1.14);
  shinR.castShadow = true;
  kneeR.add(shinR);

  if (isJogger) {
    const cuffGeo = new THREE.CylinderGeometry(0.050, 0.046, 0.05, 10);
    const cuffR = new THREE.Mesh(cuffGeo, accentMat);
    cuffR.position.y = -0.33;
    kneeR.add(cuffR);
  }

  buildChunkyShoe(kneeR, opts.shoesType, shoesMat, soleMat, accentMat);

  // Control articular de poses
  function setPose(pose = {}) {
    if (pose.hipsY !== undefined) hips.position.y = 0.78 + pose.hipsY;
    if (pose.hipSway !== undefined) hips.rotation.z = pose.hipSway;
    if (pose.hipTwist !== undefined) hips.rotation.y = pose.hipTwist;

    if (pose.torsoSway !== undefined) torso.rotation.z = pose.torsoSway;
    if (pose.torsoTilt !== undefined) torso.rotation.x = pose.torsoTilt;

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

    if (pose.legLX !== undefined) legL.rotation.x = pose.legLX;
    if (pose.legLZ !== undefined) legL.rotation.z = pose.legLZ;
    if (pose.kneeLX !== undefined) kneeL.rotation.x = pose.kneeLX;

    if (pose.legRX !== undefined) legR.rotation.x = pose.legRX;
    if (pose.legRZ !== undefined) legR.rotation.z = pose.legRZ;
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
    }
  }

  return {
    root,
    parts,
    materials: { skinMat, hairMat, topMat, bottomMat, shoesMat },
    setPose,
    updateDance
  };
}

/**
 * Zapatillas Chunky Low-Poly con plataforma biselada asentadas en Y = 0.00
 */
function buildChunkyShoe(parent, type, shoeMat, soleMat, accentMat) {
  const shoeGroup = new THREE.Group();
  shoeGroup.position.y = -0.35;
  parent.add(shoeGroup);

  if (type === 'heels') {
    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.02, 0.20), soleMat);
    sole.position.set(0, 0.01, 0.03);
    shoeGroup.add(sole);

    const heelPeg = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.008, 0.09, 6), accentMat);
    heelPeg.position.set(0, 0.045, -0.04);
    shoeGroup.add(heelPeg);

    const strap = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 4, 8), shoeMat);
    strap.position.set(0, 0.06, 0.03);
    strap.rotation.x = Math.PI / 2.3;
    shoeGroup.add(strap);
  } else {
    // 1. Suela Chunky con plataforma biselada
    const soleGeo = new THREE.BoxGeometry(0.13, 0.04, 0.27);
    const sole = new THREE.Mesh(soleGeo, soleMat);
    sole.position.set(0, 0.02, 0.035);
    sole.castShadow = true;
    shoeGroup.add(sole);

    // 2. Línea de amortiguación / entresuela
    const midStripeGeo = new THREE.BoxGeometry(0.134, 0.014, 0.25);
    const midStripe = new THREE.Mesh(midStripeGeo, accentMat);
    midStripe.position.set(0, 0.04, 0.03);
    shoeGroup.add(midStripe);

    // 3. Capellada / Upper del sneaker
    const upperGeo = new THREE.BoxGeometry(0.118, 0.064, 0.22);
    const upper = new THREE.Mesh(upperGeo, shoeMat);
    upper.position.set(0, 0.07, 0.02);
    upper.castShadow = true;
    shoeGroup.add(upper);

    // 4. Puntera redondeada facetada
    const toeGeo = new THREE.CylinderGeometry(0.058, 0.058, 0.058, 8);
    const toe = new THREE.Mesh(toeGeo, shoeMat);
    toe.position.set(0, 0.062, 0.125);
    toe.scale.set(0.96, 1.0, 0.70);
    shoeGroup.add(toe);

    // 5. Lengüeta acolchada
    const tongueGeo = new THREE.BoxGeometry(0.08, 0.04, 0.05);
    const tongue = new THREE.Mesh(tongueGeo, accentMat);
    tongue.position.set(0, 0.098, 0.06);
    tongue.rotation.x = -0.25;
    shoeGroup.add(tongue);
  }
}
