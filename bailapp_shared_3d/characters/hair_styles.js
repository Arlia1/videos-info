// ============================================================================
// BAILAPP 3D — HAIRSTYLE LABORATORY V6 (5 TRULY DISTINCT STYLED HAIRSTYLES)
// ============================================================================
// Solución completa a la visera repetitiva:
// La base craneal se retrasa (Z = -0.085) para que NUNCA interseque la frente
// con zigzags involuntarios. La frente queda 100% limpia y cada estilo
// define su propio peinado frontal único y diferenciado:
// 1. Slick High Ponytail: Frente limpia, cabello recogido hacia arriba en coleta alta.
// 2. K-Pop Curtain Part: Raya al medio elegante con mechones laterales que abren la frente.
// 3. Space Buns: Doble rodete alto con raya central limpia y gran silueta.
// 4. Side-Swept Wave: Raya al costado asimétrica con gran ola volumétrica 3D.
// 5. Classic Top Bun: Rodete alto de bailarina con frente despejada.
// ============================================================================

import * as THREE from '../three.module.js';

export function buildHairstyle(parentHead, styleName, hairMat, accentMat) {
  const hairRoot = new THREE.Group();
  parentHead.add(hairRoot);

  switch (styleName) {
    case 'high_ponytail_slick':
      buildHighPonytailSlick(hairRoot, hairMat, accentMat);
      break;
    case 'curtain_waves':
      buildCurtainWaves(hairRoot, hairMat, accentMat);
      break;
    case 'space_buns':
      buildSpaceBuns(hairRoot, hairMat, accentMat);
      break;
    case 'side_swept_glam':
      buildSideSweptGlam(hairRoot, hairMat, accentMat);
      break;
    case 'classic_top_bun':
      buildClassicTopBun(hairRoot, hairMat, accentMat);
      break;
    case 'ref_chunky_bob':
      buildRefChunkyBob(hairRoot, hairMat, accentMat);
      break;
    case 'ref_long_curtain':
      buildRefLongCurtain(hairRoot, hairMat, accentMat);
      break;
    case 'ref_wavy_lob':
      buildRefWavyLob(hairRoot, hairMat, accentMat);
      break;
    default:
      buildCurtainWaves(hairRoot, hairMat, accentMat);
  }

  return hairRoot;
}

// ----------------------------------------------------------------------------
// BASE CRANEAL RETRASADA: Cubre cráneo posterior, coronilla y nuca.
// Al estar en Z = -0.085, NO toca la frente, dejando la cara 100% limpia.
// ----------------------------------------------------------------------------
function buildCleanCranialCap(parent, hairMat) {
  const capGeo = new THREE.SphereGeometry(0.235, 14, 10);
  const cap = new THREE.Mesh(capGeo, hairMat);
  cap.position.set(0, 0.11, -0.085);
  cap.scale.set(1.05, 1.05, 1.0);
  cap.castShadow = true;
  parent.add(cap);

  const napeGeo = new THREE.BoxGeometry(0.24, 0.18, 0.16);
  const nape = new THREE.Mesh(napeGeo, hairMat);
  nape.position.set(0, 0.01, -0.14);
  nape.rotation.x = -0.22;
  nape.castShadow = true;
  parent.add(nape);
}

// ============================================================================
// 1. SLICK HIGH PONYTAIL (Coleta Alta Aerodinámica, Frente Limpia)
// ============================================================================
function buildHighPonytailSlick(parent, hairMat, accentMat) {
  buildCleanCranialCap(parent, hairMat);

  // Cabello peinado hacia arriba y atrás (nacimiento en arco limpio a Y = 0.185)
  const slickGeo = new THREE.BoxGeometry(0.22, 0.08, 0.18);
  const slick = new THREE.Mesh(slickGeo, hairMat);
  slick.position.set(0, 0.20, 0.0);
  slick.rotation.x = 0.40;
  slick.castShadow = true;
  parent.add(slick);

  // Scrunchie grueso de acento
  const tieGeo = new THREE.TorusGeometry(0.075, 0.035, 8, 14);
  const tie = new THREE.Mesh(tieGeo, accentMat);
  tie.position.set(0, 0.31, -0.16);
  tie.rotation.x = Math.PI / 3;
  tie.castShadow = true;
  parent.add(tie);

  // Coleta con curva y volumen generoso
  const ponytailGeo = new THREE.ConeGeometry(0.20, 0.62, 8);
  const ponytail = new THREE.Mesh(ponytailGeo, hairMat);
  ponytail.position.set(0, 0.18, -0.36);
  ponytail.rotation.x = -0.65;
  ponytail.scale.set(1.12, 1.0, 0.92);
  ponytail.castShadow = true;
  parent.add(ponytail);

  const underPonyGeo = new THREE.ConeGeometry(0.14, 0.46, 6);
  const underPony = new THREE.Mesh(underPonyGeo, hairMat);
  underPony.position.set(0, 0.10, -0.28);
  underPony.rotation.x = -0.52;
  underPony.castShadow = true;
  parent.add(underPony);
}

// ============================================================================
// 2. K-POP CURTAIN WAVES (Raya al medio con mechones en arco lateral y ondas)
// ============================================================================
function buildCurtainWaves(parent, hairMat) {
  buildCleanCranialCap(parent, hairMat);

  // Corona superior con raya al medio
  const crownGeo = new THREE.BoxGeometry(0.24, 0.08, 0.16);
  const crown = new THREE.Mesh(crownGeo, hairMat);
  crown.position.set(0, 0.22, -0.01);
  crown.castShadow = true;
  parent.add(crown);

  // Dos mechones laterales gruesos en cortina que enmarcan la frente sin tocarla en el centro
  [-1, 1].forEach(side => {
    const curtainGeo = new THREE.BoxGeometry(0.085, 0.14, 0.08);
    const curtain = new THREE.Mesh(curtainGeo, hairMat);
    curtain.position.set(side * 0.11, 0.16, 0.10);
    curtain.rotation.z = -side * 0.30;
    curtain.rotation.y = side * 0.22;
    curtain.castShadow = true;
    parent.add(curtain);

    const templeLockGeo = new THREE.ConeGeometry(0.065, 0.34, 6);
    const templeLock = new THREE.Mesh(templeLockGeo, hairMat);
    templeLock.position.set(side * 0.185, 0.04, 0.0);
    templeLock.rotation.z = -side * 0.10;
    templeLock.castShadow = true;
    parent.add(templeLock);
  });

  // Cascada de ondas traseras
  [-0.14, 0.0, 0.14].forEach((xOff, idx) => {
    const wave = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.52, 6), hairMat);
    wave.position.set(xOff, -0.10, -0.15);
    wave.rotation.x = -0.18;
    wave.rotation.z = xOff * 0.25;
    wave.castShadow = true;
    parent.add(wave);
  });

  [-0.20, 0.20].forEach((xOff, idx) => {
    const shoulderLock = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.45, 6), hairMat);
    shoulderLock.position.set(xOff, -0.06, -0.05);
    shoulderLock.rotation.z = idx === 0 ? -0.15 : 0.15;
    shoulderLock.rotation.x = 0.08;
    shoulderLock.castShadow = true;
    parent.add(shoulderLock);
  });
}

// ============================================================================
// 3. CHUNKY SPACE BUNS (Doble Rodete Alto con Raya al Medio)
// ============================================================================
function buildSpaceBuns(parent, hairMat, accentMat) {
  buildCleanCranialCap(parent, hairMat);

  // Raya central con dos masas de raíz que van hacia cada rodete
  [-1, 1].forEach(side => {
    const sweepGeo = new THREE.BoxGeometry(0.13, 0.08, 0.15);
    const sweep = new THREE.Mesh(sweepGeo, hairMat);
    sweep.position.set(side * 0.10, 0.20, 0.01);
    sweep.rotation.z = -side * 0.26;
    sweep.castShadow = true;
    parent.add(sweep);

    // Coletero de base
    const tieGeo = new THREE.TorusGeometry(0.08, 0.026, 6, 12);
    const tie = new THREE.Mesh(tieGeo, accentMat);
    tie.position.set(side * 0.18, 0.30, -0.04);
    tie.rotation.x = Math.PI / 2.5;
    tie.rotation.z = -side * 0.30;
    parent.add(tie);

    // Rodete voluminoso facetado
    const bunGeo = new THREE.IcosahedronGeometry(0.145, 1);
    const bun = new THREE.Mesh(bunGeo, hairMat);
    bun.position.set(side * 0.19, 0.36, -0.04);
    bun.castShadow = true;
    parent.add(bun);
  });
}

// ============================================================================
// 4. SIDE-SWEPT GLAM WAVE (Raya al Costado Asimétrica con Gran Ola 3D)
// ============================================================================
function buildSideSweptGlam(parent, hairMat) {
  buildCleanCranialCap(parent, hairMat);

  // Lado derecho (recogido limpio detrás de la oreja)
  const tuckedGeo = new THREE.BoxGeometry(0.08, 0.22, 0.14);
  const tucked = new THREE.Mesh(tuckedGeo, hairMat);
  tucked.position.set(0.17, 0.09, -0.02);
  tucked.rotation.z = 0.10;
  tucked.castShadow = true;
  parent.add(tucked);

  // Lado izquierdo: Gran ola escultórica con volumen 3D real
  const waveTopGeo = new THREE.BoxGeometry(0.18, 0.095, 0.15);
  const waveTop = new THREE.Mesh(waveTopGeo, hairMat);
  waveTop.position.set(-0.06, 0.21, 0.06);
  waveTop.rotation.z = 0.32;
  waveTop.rotation.y = -0.15;
  waveTop.castShadow = true;
  parent.add(waveTop);

  const waveSideGeo = new THREE.BoxGeometry(0.11, 0.30, 0.16);
  const waveSide = new THREE.Mesh(waveSideGeo, hairMat);
  waveSide.position.set(-0.19, 0.05, 0.03);
  waveSide.rotation.z = -0.12;
  waveSide.castShadow = true;
  parent.add(waveSide);

  [-0.20, -0.08, 0.08].forEach((xOff, idx) => {
    const wave = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.48, 6), hairMat);
    wave.position.set(xOff, -0.10, -0.12);
    wave.rotation.x = -0.16;
    wave.rotation.z = idx === 0 ? -0.22 : 0.05;
    wave.castShadow = true;
    parent.add(wave);
  });
}

// ============================================================================
// 5. CLASSIC TOP BUN (Rodete de Bailarina Desenfadado con Gran Volumen)
// ============================================================================
function buildClassicTopBun(parent, hairMat, accentMat) {
  buildCleanCranialCap(parent, hairMat);

  // Corona peinada hacia arriba
  const crownGeo = new THREE.BoxGeometry(0.22, 0.08, 0.18);
  const crown = new THREE.Mesh(crownGeo, hairMat);
  crown.position.set(0, 0.21, 0.0);
  crown.rotation.x = 0.35;
  crown.castShadow = true;
  parent.add(crown);

  // Rodete alto central esponjoso
  const bunGeo = new THREE.IcosahedronGeometry(0.18, 1);
  const bun = new THREE.Mesh(bunGeo, hairMat);
  bun.position.set(0, 0.38, -0.04);
  bun.castShadow = true;
  parent.add(bun);

  const bunTie = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.028, 6, 12), accentMat);
  bunTie.position.set(0, 0.31, -0.04);
  bunTie.rotation.x = Math.PI / 2;
  parent.add(bunTie);

  [-0.18, 0.18].forEach((xOff, idx) => {
    const wisp = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.30, 5), hairMat);
    wisp.position.set(xOff, 0.02, 0.01);
    wisp.rotation.z = idx === 0 ? -0.10 : 0.10;
    wisp.castShadow = true;
    parent.add(wisp);
  });
}

// ============================================================================
// 6. EJEMPLO 1: CORTE BOB CHUNKY (RÉPLICA EXACTA DE LA IMAGEN DE REFERENCIA)
// ============================================================================
// Arquitectura low-poly idéntica a WhatsApp Image:
// - Cúpula posterior retrasada: CERO intersección frontal.
// - Raya al medio en "V" invertida alta: frente, cejas y ojos 100% despejados.
// - Cuñas frontales biseladas que nacen altas y bajan en diagonal hacia las sienes.
// - Caída lateral en bloques prismáticos hasta la mandíbula con facetas marcadas.
// ============================================================================
function buildRefChunkyBob(parent, hairMat, accentMat) {
  // A. Cúpula craneal unificada (cubre coronilla y cráneo)
  const capGeo = new THREE.SphereGeometry(0.230, 12, 10);
  const cap = new THREE.Mesh(capGeo, hairMat);
  cap.position.set(0, 0.10, -0.04);
  cap.scale.set(1.06, 1.05, 1.02);
  cap.castShadow = true;
  parent.add(cap);

  // B. Raya al medio en "V" y cuñas frontales biseladas continuas
  [-1, 1].forEach(side => {
    // Cuña frontal en V: se integra perfectamente con la cúpula y las sienes
    const wedgeGeo = new THREE.BoxGeometry(0.155, 0.11, 0.11);
    const wedge = new THREE.Mesh(wedgeGeo, hairMat);
    wedge.position.set(side * 0.085, 0.185, 0.09);
    wedge.rotation.z = -side * 0.34; // Ángulo natural de raya en V
    wedge.rotation.y = side * 0.24;
    wedge.rotation.x = -0.10;
    wedge.castShadow = true;
    parent.add(wedge);

    // Bloque lateral sien / pómulo (transición continua)
    const templeGeo = new THREE.BoxGeometry(0.115, 0.18, 0.14);
    const temple = new THREE.Mesh(templeGeo, hairMat);
    temple.position.set(side * 0.170, 0.08, 0.04);
    temple.rotation.z = -side * 0.06;
    temple.castShadow = true;
    parent.add(temple);

    // Bloque lateral inferior (mandíbula / corte bob en bloque)
    const jawGeo = new THREE.BoxGeometry(0.105, 0.19, 0.13);
    const jaw = new THREE.Mesh(jawGeo, hairMat);
    jaw.position.set(side * 0.175, -0.06, 0.01);
    jaw.rotation.z = -side * 0.03;
    jaw.rotation.y = side * 0.05;
    jaw.castShadow = true;
    parent.add(jaw);
  });

  // C. Masa posterior y nuca sólida
  const backGeo = new THREE.BoxGeometry(0.28, 0.26, 0.16);
  const back = new THREE.Mesh(backGeo, hairMat);
  back.position.set(0, 0.01, -0.12);
  back.rotation.x = -0.16;
  back.castShadow = true;
  parent.add(back);
}

// ============================================================================
// 7. EJEMPLO 2: MELENA LARGA ESCALONADA (LONG CURTAIN WAVES LOW-POLY)
// ============================================================================
// Misma raya en "V" y volumen superior de la referencia, pero prolongado
// en mechones facetados escalonados por delante y detrás de los hombros.
// ============================================================================
function buildRefLongCurtain(parent, hairMat, accentMat) {
  // A. Cúpula craneal unificada
  const capGeo = new THREE.SphereGeometry(0.230, 12, 10);
  const cap = new THREE.Mesh(capGeo, hairMat);
  cap.position.set(0, 0.10, -0.04);
  cap.scale.set(1.06, 1.05, 1.02);
  cap.castShadow = true;
  parent.add(cap);

  [-1, 1].forEach(side => {
    // Cuña frontal en V continua
    const wedgeGeo = new THREE.BoxGeometry(0.155, 0.11, 0.11);
    const wedge = new THREE.Mesh(wedgeGeo, hairMat);
    wedge.position.set(side * 0.085, 0.185, 0.09);
    wedge.rotation.z = -side * 0.34;
    wedge.rotation.y = side * 0.24;
    wedge.rotation.x = -0.10;
    wedge.castShadow = true;
    parent.add(wedge);

    // Bloque sien
    const templeGeo = new THREE.BoxGeometry(0.115, 0.18, 0.14);
    const temple = new THREE.Mesh(templeGeo, hairMat);
    temple.position.set(side * 0.170, 0.08, 0.04);
    temple.rotation.z = -side * 0.06;
    temple.castShadow = true;
    parent.add(temple);

    // Mechón frontal largo que cae sobre el pecho/clavícula con volumen
    const frontCascade = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.42, 6), hairMat);
    frontCascade.position.set(side * 0.16, -0.16, 0.07);
    frontCascade.rotation.x = 0.12;
    frontCascade.rotation.z = -side * 0.08;
    frontCascade.castShadow = true;
    parent.add(frontCascade);
  });

  // B. Cascada posterior larga en facetas
  [-0.14, 0.0, 0.14].forEach((xOff, idx) => {
    const strand = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.52, 6), hairMat);
    strand.position.set(xOff, -0.15, -0.14);
    strand.rotation.x = -0.22;
    strand.rotation.z = idx === 1 ? 0 : (idx === 0 ? -0.12 : 0.12);
    strand.castShadow = true;
    parent.add(strand);
  });
}

// ============================================================================
// 8. EJEMPLO 3: BOB URBANO TEXTURADO (ANGLED FACETED LOB)
// ============================================================================
// Misma raya en "V", pero con corte biselado más afilado y dinámico en los
// laterales, con mechón asimétrico recogido de un lado para look urbano.
// ============================================================================
function buildRefWavyLob(parent, hairMat, accentMat) {
  // A. Cúpula craneal unificada
  const capGeo = new THREE.SphereGeometry(0.230, 12, 10);
  const cap = new THREE.Mesh(capGeo, hairMat);
  cap.position.set(0, 0.10, -0.04);
  cap.scale.set(1.06, 1.05, 1.02);
  cap.castShadow = true;
  parent.add(cap);

  // B. Raya en V alta
  [-1, 1].forEach(side => {
    const wedgeGeo = new THREE.BoxGeometry(0.155, 0.11, 0.11);
    const wedge = new THREE.Mesh(wedgeGeo, hairMat);
    wedge.position.set(side * 0.085, 0.185, 0.09);
    wedge.rotation.z = -side * 0.34;
    wedge.rotation.y = side * 0.24;
    wedge.rotation.x = -0.10;
    wedge.castShadow = true;
    parent.add(wedge);
  });

  // Lado Izquierdo: mechón texturado que enmarca la mandíbula con bisel pronunciado
  const leftUpper = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.14), hairMat);
  leftUpper.position.set(-0.17, 0.07, 0.04);
  leftUpper.rotation.z = 0.12;
  leftUpper.castShadow = true;
  parent.add(leftUpper);

  const leftTip = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.28, 5), hairMat);
  leftTip.position.set(-0.16, -0.12, 0.03);
  leftTip.rotation.z = -0.14;
  leftTip.rotation.x = 0.08;
  leftTip.castShadow = true;
  parent.add(leftTip);

  // Lado Derecho: corte biselado más recogido
  const rightUpper = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.20, 0.13), hairMat);
  rightUpper.position.set(0.165, 0.05, 0.03);
  rightUpper.rotation.z = -0.06;
  rightUpper.castShadow = true;
  parent.add(rightUpper);

  const rightTip = new THREE.Mesh(new THREE.ConeGeometry(0.070, 0.24, 5), hairMat);
  rightTip.position.set(0.155, -0.10, 0.02);
  rightTip.rotation.z = 0.10;
  rightTip.castShadow = true;
  parent.add(rightTip);

  // Masa posterior angular
  const backGeo = new THREE.BoxGeometry(0.28, 0.26, 0.15);
  const back = new THREE.Mesh(backGeo, hairMat);
  back.position.set(0, 0.02, -0.12);
  back.rotation.x = -0.16;
  back.castShadow = true;
  parent.add(back);
}

