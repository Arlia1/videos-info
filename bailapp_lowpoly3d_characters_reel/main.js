import * as THREE from './three.module.js';

// =============================================================
// BAILAPP — REEL LOW POLY 3D VIRAL CON PERSONAJES 3D NATIVOS
// Estilo: Low-Poly Pastel World Minimalista (Monument Valley vibe)
// Personajes: 100% 3D Low-Poly Articulados con Facetas, Ojos y Ropa
// Cero partículas voladoras desordenadas • 100% determinista
// =============================================================

const W = 1080;
const H = 1920;
const CX = W / 2;
const CY = H / 2;

// -------------------------------------------------------------
// 1. ESCENA, CÁMARA Y RENDERIZADOR THREE.JS (CAPA 0 & 1)
// -------------------------------------------------------------
const webglCanvas = document.getElementById('webgl');
const renderer = new THREE.WebGLRenderer({
  canvas: webglCanvas,
  antialias: true,
  alpha: false,
  preserveDrawingBuffer: true
});
renderer.setSize(W, H);
renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#FFF5F8');
scene.fog = new THREE.FogExp2('#FFF5F8', 0.02);

// Cámara Isométrica Diorama
const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
camera.position.set(0, 3.8, 8.8);
camera.lookAt(0, 1.25, 0);

// Iluminación Facetada Escultórica
const hemiLight = new THREE.HemisphereLight('#FFF0F5', '#E5D0D8', 1.15);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight('#FFF9E6', 1.35);
dirLight.position.set(6, 12, 8);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 30;
dirLight.shadow.camera.left = -6;
dirLight.shadow.camera.right = 6;
dirLight.shadow.camera.top = 8;
dirLight.shadow.camera.bottom = -4;
dirLight.shadow.bias = -0.0004;
scene.add(dirLight);

const fillLight = new THREE.DirectionalLight('#FAD2E1', 0.55);
fillLight.position.set(-6, 5, -4);
scene.add(fillLight);

// Helper Material Low-Poly
function lpMat(colorHex, roughness = 0.85, metalness = 0.04) {
  return new THREE.MeshStandardMaterial({
    color: colorHex,
    flatShading: true,
    roughness: roughness,
    metalness: metalness
  });
}

// Helper Easing y Geometría 2D
function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }
function easeOutBack(x) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function roundRect(ctx, x, y, width, height, radius) {
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.closePath();
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// -------------------------------------------------------------
// 2. SISTEMA DE PERSONAJES 3D LOW-POLY ARTICULADOS
// -------------------------------------------------------------
function createLowPolyCharacter(opts = {}) {
  const root = new THREE.Group();

  const skinMat = lpMat(opts.skinColor || '#FFD5B8', 0.85);
  const hairMat = lpMat(opts.hairColor || '#2D242E', 0.85);
  const topMat = lpMat(opts.topColor || '#E06385', 0.85);
  const pantsMat = lpMat(opts.pantsColor || '#F4E8C1', 0.85);
  const shoesMat = lpMat(opts.shoesColor || '#FFFFFF', 0.85);
  const accentMat = lpMat(opts.accentColor || '#E06385', 0.85);
  const eyeMat = lpMat('#1F1D2B', 0.3);
  const blushMat = lpMat('#F472B6', 0.9);

  // 1. Cadera / Hips (Centro de masa y pivote)
  const hips = new THREE.Group();
  hips.position.y = 1.35;
  root.add(hips);

  const hipsMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.52, 0.28, 0.32),
    pantsMat
  );
  hipsMesh.castShadow = true;
  hips.add(hipsMesh);

  // 2. Torso (Pivota sobre las caderas)
  const torso = new THREE.Group();
  torso.position.y = 0.14;
  hips.add(torso);

  const torsoMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.56, 0.64, 0.34),
    topMat
  );
  torsoMesh.position.y = 0.34;
  torsoMesh.castShadow = true;
  torso.add(torsoMesh);

  // Cuello
  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.12, 0.18, 6),
    skinMat
  );
  neck.position.y = 0.72;
  neck.castShadow = true;
  torso.add(neck);

  // 3. Cabeza
  const headGroup = new THREE.Group();
  headGroup.position.y = 0.94;
  torso.add(headGroup);

  // Cara base facetada
  const headMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.50, 0.52, 0.46),
    skinMat
  );
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Ojos estilizados en +Z (frente hacia la cámara)
  const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.03), eyeMat);
  eyeL.position.set(-0.11, 0.02, 0.24);
  headGroup.add(eyeL);

  const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.03), eyeMat);
  eyeR.position.set(0.11, 0.02, 0.24);
  headGroup.add(eyeR);

  // Mejillas sonrojadas
  const blushL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.02), blushMat);
  blushL.position.set(-0.16, -0.08, 0.235);
  headGroup.add(blushL);

  const blushR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.02), blushMat);
  blushR.position.set(0.16, -0.08, 0.235);
  headGroup.add(blushR);

  // Cabello estilizado
  const hairGroup = new THREE.Group();
  headGroup.add(hairGroup);

  // Casquete superior
  const hairTop = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.18, 0.50), hairMat);
  hairTop.position.set(0, 0.22, -0.02);
  hairTop.castShadow = true;
  hairGroup.add(hairTop);

  // Flequillo / Bangs en la frente (arriba de los ojos)
  const hairBangs = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.14, 0.10), hairMat);
  hairBangs.position.set(0, 0.18, 0.22);
  hairBangs.castShadow = true;
  hairGroup.add(hairBangs);

  // Mechones laterales
  const hairSideL = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.65, 0.38), hairMat);
  hairSideL.position.set(-0.27, -0.10, -0.04);
  hairSideL.castShadow = true;
  hairGroup.add(hairSideL);

  const hairSideR = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.65, 0.38), hairMat);
  hairSideR.position.set(0.27, -0.10, -0.04);
  hairSideR.castShadow = true;
  hairGroup.add(hairSideR);

  // Cabello posterior (espalda)
  const hairBack = new THREE.Mesh(
    new THREE.BoxGeometry(0.52, opts.hairStyle === 'bob' ? 0.42 : 0.78, 0.14),
    hairMat
  );
  hairBack.position.set(0, opts.hairStyle === 'bob' ? -0.08 : -0.22, -0.22);
  hairBack.castShadow = true;
  hairGroup.add(hairBack);

  // 4. Brazos Articulados
  const shoulderL = new THREE.Group();
  shoulderL.position.set(-0.35, 0.58, 0);
  torso.add(shoulderL);

  const armMeshL = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.58, 0.16),
    opts.sleeves === 'short' ? skinMat : topMat
  );
  armMeshL.position.y = -0.28;
  armMeshL.castShadow = true;
  shoulderL.add(armMeshL);

  const handL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), skinMat);
  handL.position.y = -0.62;
  handL.castShadow = true;
  shoulderL.add(handL);

  const shoulderR = new THREE.Group();
  shoulderR.position.set(0.35, 0.58, 0);
  torso.add(shoulderR);

  const armMeshR = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.58, 0.16),
    opts.sleeves === 'short' ? skinMat : topMat
  );
  armMeshR.position.y = -0.28;
  armMeshR.castShadow = true;
  shoulderR.add(armMeshR);

  const handR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), skinMat);
  handR.position.y = -0.62;
  handR.castShadow = true;
  shoulderR.add(handR);

  // Mini smartphone 3D en la mano si corresponde
  if (opts.hasPhone) {
    const miniPhone = new THREE.Group();
    const phoneMesh = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.28, 0.03), lpMat('#2D242E'));
    const screenMesh = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.25, 0.01), lpMat('#FCE7F0'));
    screenMesh.position.z = 0.016;
    miniPhone.add(phoneMesh);
    miniPhone.add(screenMesh);
    miniPhone.position.set(0, -0.68, 0.14);
    miniPhone.rotation.x = Math.PI / 4;
    shoulderR.add(miniPhone);
  }

  // 5. Piernas Articuladas
  const hipJointL = new THREE.Group();
  hipJointL.position.set(-0.16, -0.12, 0);
  hips.add(hipJointL);

  const legMeshL = new THREE.Mesh(
    new THREE.BoxGeometry(0.19, 0.72, 0.19),
    pantsMat
  );
  legMeshL.position.y = -0.36;
  legMeshL.castShadow = true;
  hipJointL.add(legMeshL);

  const footL = new THREE.Group();
  footL.position.set(0, -0.74, 0);
  hipJointL.add(footL);

  if (opts.shoesType === 'heels') {
    const shoeBox = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.15, 0.32), shoesMat);
    shoeBox.position.z = 0.06;
    shoeBox.castShadow = true;
    footL.add(shoeBox);

    const heel = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.16, 6), accentMat);
    heel.position.set(0, -0.12, -0.06);
    heel.castShadow = true;
    footL.add(heel);
  } else {
    const shoeBox = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.18, 0.36), shoesMat);
    shoeBox.position.z = 0.06;
    shoeBox.castShadow = true;
    footL.add(shoeBox);

    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.38), accentMat);
    sole.position.set(0, -0.10, 0.06);
    sole.castShadow = true;
    footL.add(sole);
  }

  const hipJointR = new THREE.Group();
  hipJointR.position.set(0.16, -0.12, 0);
  hips.add(hipJointR);

  const legMeshR = new THREE.Mesh(
    new THREE.BoxGeometry(0.19, 0.72, 0.19),
    pantsMat
  );
  legMeshR.position.y = -0.36;
  legMeshR.castShadow = true;
  hipJointR.add(legMeshR);

  const footR = new THREE.Group();
  footR.position.set(0, -0.74, 0);
  hipJointR.add(footR);

  if (opts.shoesType === 'heels') {
    const shoeBox = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.15, 0.32), shoesMat);
    shoeBox.position.z = 0.06;
    shoeBox.castShadow = true;
    footR.add(shoeBox);

    const heel = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.16, 6), accentMat);
    heel.position.set(0, -0.12, -0.06);
    heel.castShadow = true;
    footR.add(heel);
  } else {
    const shoeBox = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.18, 0.36), shoesMat);
    shoeBox.position.z = 0.06;
    shoeBox.castShadow = true;
    footR.add(shoeBox);

    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.38), accentMat);
    sole.position.set(0, -0.10, 0.06);
    sole.castShadow = true;
    footR.add(sole);
  }

  return {
    root,
    hips,
    torso,
    head: headGroup,
    shoulderL,
    shoulderR,
    hipJointL,
    hipJointR,
    footL,
    footR
  };
}

// -------------------------------------------------------------
// 3. GENERADOR DE TEXTURAS CANVAS PARA TARJETAS 3D
// -------------------------------------------------------------
function createCardTexture(title, styleBadge, timeText, locationText, spotsLeft, badgeBg, badgeColor, btnColor) {
  const cv = document.createElement('canvas');
  cv.width = 1024;
  cv.height = 470;
  const ctx = cv.getContext('2d');

  // Fondo blanco con esquinas redondeadas
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  roundRect(ctx, 16, 16, 992, 438, 40);
  ctx.fill();

  ctx.strokeStyle = '#FAD2E1';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Badge Estilo (arriba izquierda)
  ctx.fillStyle = badgeBg;
  ctx.beginPath();
  roundRect(ctx, 48, 48, 290, 60, 30);
  ctx.fill();
  ctx.fillStyle = badgeColor;
  ctx.font = '800 28px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(styleBadge, 193, 78);

  // Badge Cupos (arriba derecha)
  ctx.fillStyle = '#FEF2F2';
  ctx.beginPath();
  roundRect(ctx, 690, 48, 280, 60, 30);
  ctx.fill();
  ctx.fillStyle = '#DC2626';
  ctx.font = '800 24px -apple-system, sans-serif';
  ctx.fillText(spotsLeft, 830, 78);

  // Título de la clase (grande y legible en 3D)
  ctx.fillStyle = '#1E1B4B';
  ctx.font = '900 50px -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(title, 48, 175);

  // Horario y Ubicación
  ctx.fillStyle = '#4B5563';
  ctx.font = '700 32px -apple-system, sans-serif';
  ctx.fillText(timeText + '  •  ' + locationText, 48, 245);

  // Nivel
  ctx.fillStyle = '#9CA3AF';
  ctx.font = '600 26px -apple-system, sans-serif';
  ctx.fillText('Nivel Principiantes  •  Profe Certificada ✨', 48, 305);

  // Botón Reservar
  ctx.fillStyle = btnColor;
  ctx.beginPath();
  roundRect(ctx, 680, 345, 290, 80, 40);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 30px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('RESERVAR ⚡', 825, 385);

  const texture = new THREE.CanvasTexture(cv);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

// -------------------------------------------------------------
// 4. ESCENARIOS PROCEDIMENTALES DINÁMICOS (STAGE SWAPPING)
// -------------------------------------------------------------
const worldRoot = new THREE.Group();
scene.add(worldRoot);

// =============================================================
// ESCENARIO 1 & 2: EL CUARTO CLAUSTROFÓBICO (stageBedroom)
// =============================================================
const stageBedroom = new THREE.Group();
worldRoot.add(stageBedroom);

// Suelo del cuarto (madera clara facetada)
const floorBed = new THREE.Mesh(new THREE.BoxGeometry(7, 0.4, 7), lpMat('#EBDCD6', 0.9));
floorBed.position.y = -0.2;
floorBed.receiveShadow = true;
stageBedroom.add(floorBed);

// Pared trasera izquierda
const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5, 7), lpMat('#F2E5E8', 0.95));
wallLeft.position.set(-3.5, 2.3, 0);
wallLeft.receiveShadow = true;
stageBedroom.add(wallLeft);

// Pared trasera derecha
const wallBack = new THREE.Mesh(new THREE.BoxGeometry(7, 5, 0.3), lpMat('#EADAE0', 0.95));
wallBack.position.set(0, 2.3, -3.5);
wallBack.receiveShadow = true;
stageBedroom.add(wallBack);

// Cama low-poly
const bedBase = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.6, 2.2), lpMat('#D4B5A5', 0.8));
bedBase.position.set(1.6, 0.3, -1.8);
bedBase.castShadow = true;
bedBase.receiveShadow = true;
stageBedroom.add(bedBase);

const mattress = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.4, 2.1), lpMat('#FFFFFF', 0.9));
mattress.position.set(1.6, 0.7, -1.8);
mattress.castShadow = true;
mattress.receiveShadow = true;
stageBedroom.add(mattress);

const blanket = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.45, 2.15), lpMat('#FAD2E1', 0.85));
blanket.position.set(2.2, 0.73, -1.8);
blanket.castShadow = true;
stageBedroom.add(blanket);

const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 1.4), lpMat('#FCE8F0', 0.9));
pillow.position.set(0.3, 0.95, -1.8);
pillow.rotation.y = 0.05;
pillow.castShadow = true;
stageBedroom.add(pillow);

// Mesita de noche
const nightstand = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.1, 1.0), lpMat('#CDB4A3', 0.85));
nightstand.position.set(-0.9, 0.55, -2.4);
nightstand.castShadow = true;
nightstand.receiveShadow = true;
stageBedroom.add(nightstand);

// Libros apilados donde se apoya el celular
const book1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.12, 0.5), lpMat('#C4B5FD', 0.8));
book1.position.set(-0.9, 1.16, -2.4);
book1.castShadow = true;
stageBedroom.add(book1);

const book2 = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.12, 0.45), lpMat('#E06385', 0.8));
book2.position.set(-0.9, 1.28, -2.4);
book2.rotation.y = 0.15;
book2.castShadow = true;
stageBedroom.add(book2);

// Smartphone low-poly propped up
const phoneMini = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.48, 0.3), lpMat('#2D242E', 0.3));
phoneMini.position.set(-0.9, 1.55, -2.35);
phoneMini.rotation.x = -0.25;
phoneMini.castShadow = true;
stageBedroom.add(phoneMini);

// Espejo vertical en marco
const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.15, 3.4, 1.5), lpMat('#E06385', 0.7));
mirrorFrame.position.set(-3.2, 1.7, 0.8);
mirrorFrame.castShadow = true;
stageBedroom.add(mirrorFrame);

const mirrorGlass = new THREE.Mesh(new THREE.BoxGeometry(0.05, 3.2, 1.3), lpMat('#F0FDFA', 0.2, 0.8));
mirrorGlass.position.set(-3.12, 1.7, 0.8);
stageBedroom.add(mirrorGlass);

// Notificación 3D Flotante "Toma 48 rechazada"
const notif3D = new THREE.Group();
notif3D.position.set(-0.9, 2.5, -2.2);
stageBedroom.add(notif3D);

const notifBox = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.65, 0.12), lpMat('#FFFFFF', 0.5));
notifBox.castShadow = true;
notif3D.add(notifBox);

const notifDot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.14, 6), lpMat('#EF4444'));
notifDot.position.set(-0.85, 0, 0.08);
notifDot.rotation.x = Math.PI / 2;
notif3D.add(notifDot);

// PERSONAJE 3D EN EL CUARTO
const charBedroom = createLowPolyCharacter({
  skinColor: '#FFD5B8',
  hairColor: '#2D242E',
  hairStyle: 'long_wavy',
  topColor: '#2D242E',
  topType: 'hoodie',
  pantsColor: '#F4E8C1',
  shoesColor: '#FFFFFF',
  accentColor: '#E06385',
  hasPhone: false
});
charBedroom.root.scale.set(0.72, 0.72, 0.72);
charBedroom.root.position.set(-0.85, 0, 0.5);
charBedroom.root.rotation.y = 0.35;
stageBedroom.add(charBedroom.root);

// =============================================================
// ESCENARIO 3: EL GRAN ESTUDIO REAL (stageStudio)
// =============================================================
const stageStudio = new THREE.Group();
worldRoot.add(stageStudio);
stageStudio.position.y = -18; // Oculto inicialmente

// Gran pista de danza de madera clara
const floorStudio = new THREE.Mesh(new THREE.BoxGeometry(10, 0.4, 9), lpMat('#F5EDE8', 0.85, 0.02));
floorStudio.position.y = -0.2;
floorStudio.receiveShadow = true;
stageStudio.add(floorStudio);

// Pared trasera con espejos gigantes
const wallStudio = new THREE.Mesh(new THREE.BoxGeometry(10, 6, 0.4), lpMat('#EADAE2', 0.95));
wallStudio.position.set(0, 2.8, -4.3);
wallStudio.receiveShadow = true;
stageStudio.add(wallStudio);

// 3 Espejos de cuerpo entero gigantes
for (let i = -1; i <= 1; i++) {
  const mFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4.4, 0.1), lpMat('#E06385', 0.5));
  mFrame.position.set(i * 2.8, 2.6, -4.0);
  mFrame.castShadow = true;
  stageStudio.add(mFrame);

  const mGlass = new THREE.Mesh(new THREE.BoxGeometry(2.2, 4.2, 0.05), lpMat('#F0FDFA', 0.1, 0.9));
  mGlass.position.set(i * 2.8, 2.6, -3.94);
  stageStudio.add(mGlass);
}

// 3 Reflectores cenitales con haces de luz translúcidos limpios (Sin partículas sueltas)
const lightCones = [];
for (let i = -1; i <= 1; i++) {
  const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 0.4, 6), lpMat('#2D242E'));
  lamp.position.set(i * 2.6, 5.4, -1.0);
  stageStudio.add(lamp);

  const coneGeo = new THREE.ConeGeometry(1.6, 5.0, 8, 1, true);
  const coneMat = new THREE.MeshBasicMaterial({
    color: i === 0 ? '#FFFFFF' : '#FCE7F0',
    transparent: true,
    opacity: 0.12,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const cone = new THREE.Mesh(coneGeo, coneMat);
  cone.position.set(i * 2.6, 2.9, -1.0);
  cone.rotation.x = Math.PI;
  stageStudio.add(cone);
  lightCones.push(cone);
}

// 2 Subwoofers profesionales low-poly
const subwoofers = [];
[-4.2, 4.2].forEach((xPos) => {
  const subBox = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.0, 1.1), lpMat('#2D242E', 0.7));
  subBox.position.set(xPos, 1.0, -2.5);
  subBox.castShadow = true;
  stageStudio.add(subBox);

  for (let sy of [0.55, 1.45]) {
    const speaker = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.1, 8), lpMat('#E06385', 0.5));
    speaker.position.set(xPos > 0 ? xPos - 0.52 : xPos + 0.52, sy, -2.5);
    speaker.rotation.z = Math.PI / 2;
    stageStudio.add(speaker);
    subwoofers.push(speaker);
  }
});

// PERSONAJES 3D EN EL ESTUDIO
const charStudioA = createLowPolyCharacter({
  skinColor: '#FFD5B8',
  hairColor: '#2D242E',
  hairStyle: 'long_wavy',
  topColor: '#E06385', // Raspberry Diva
  sleeves: 'short',
  pantsColor: '#1F2937', // Black leggings
  shoesColor: '#FFFFFF',
  accentColor: '#E06385',
  hasPhone: false
});
charStudioA.root.scale.set(0.75, 0.75, 0.75);
charStudioA.root.position.set(-1.15, 0, 0.8);
stageStudio.add(charStudioA.root);

const charStudioB = createLowPolyCharacter({
  skinColor: '#F5C396',
  hairColor: '#4A2810',
  hairStyle: 'bob',
  topColor: '#8B5CF6', // Lavender K-Pop
  sleeves: 'short',
  pantsColor: '#C4B5FD',
  shoesColor: '#FFFFFF',
  accentColor: '#8B5CF6',
  hasPhone: false
});
charStudioB.root.scale.set(0.75, 0.75, 0.75);
charStudioB.root.position.set(1.15, 0, 0.8);
stageStudio.add(charStudioB.root);

// =============================================================
// ESCENARIO 4: SMARTPHONE 3D INTERACTIVO (stageSmartphone)
// =============================================================
const stageSmartphone = new THREE.Group();
worldRoot.add(stageSmartphone);
stageSmartphone.position.y = -25; // Oculto inicialmente

const phone3D = new THREE.Group();
phone3D.position.set(0, 1.45, 0);
phone3D.scale.set(0.76, 0.76, 0.76);
stageSmartphone.add(phone3D);

// Chasis iPhone Low-Poly
const phoneBody = new THREE.Mesh(new THREE.BoxGeometry(2.9, 5.6, 0.22), lpMat('#2D242E', 0.3, 0.8));
phoneBody.castShadow = true;
phone3D.add(phoneBody);

// Pantalla OLED
const phoneScreen = new THREE.Mesh(new THREE.BoxGeometry(2.7, 5.35, 0.05), lpMat('#FFF8FA', 0.2));
phoneScreen.position.z = 0.11;
phone3D.add(phoneScreen);

// Dynamic Island
const phoneIsland = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.16, 0.04), lpMat('#000000'));
phoneIsland.position.set(0, 2.45, 0.14);
phone3D.add(phoneIsland);

// 3 Tarjetas de Clases Flotando en Relieve Tridimensional con Texturas Canvas
const cards3D = [];
const cardConfigs = [
  {
    title: 'Dancehall Principiantes',
    badge: '🔥 DANCEHALL',
    time: '⏰ Hoy 19:00 hs',
    loc: '📍 Palermo',
    spots: '⚠️ Quedan 3 cupos',
    color: '#FFF0F5',
    badgeBg: '#FCE7F3',
    badgeColor: '#BE185D',
    btnColor: '#E06385',
    y: 1.15
  },
  {
    title: 'Heels Divas Desde Cero',
    badge: '👠 HEELS DIVAS',
    time: '⏰ Hoy 20:00 hs',
    loc: '📍 Belgrano',
    spots: '🔥 ¡Casi lleno!',
    color: '#FEFCE8',
    badgeBg: '#FEF9C3',
    badgeColor: '#B45309',
    btnColor: '#D97706',
    y: 0.05
  },
  {
    title: 'Commercial Pop Flow',
    badge: '🪩 COMMERCIAL POP',
    time: '⏰ Hoy 20:30 hs',
    loc: '📍 Recoleta',
    spots: '✨ Cupos abiertos',
    color: '#EEF2FF',
    badgeBg: '#E0E7FF',
    badgeColor: '#4338CA',
    btnColor: '#4F46E5',
    y: -1.05
  }
];

cardConfigs.forEach((c) => {
  const cGroup = new THREE.Group();
  cGroup.position.set(0, c.y, 0.22);

  const cBox = new THREE.Mesh(new THREE.BoxGeometry(2.42, 1.05, 0.08), lpMat(c.color, 0.5));
  cBox.castShadow = true;
  cGroup.add(cBox);

  const cTex = createCardTexture(c.title, c.badge, c.time, c.loc, c.spots, c.badgeBg, c.badgeColor, c.btnColor);
  const planeMat = new THREE.MeshBasicMaterial({ map: cTex, transparent: true });
  const planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.40, 1.03), planeMat);
  planeMesh.position.z = 0.043;
  cGroup.add(planeMesh);

  phone3D.add(cGroup);
  cards3D.push(cGroup);
});

// PERSONAJES 3D FLANQUEANDO EL SMARTPHONE (100% visibles en los márgenes seguros)
const charPhoneLeft = createLowPolyCharacter({
  skinColor: '#FFD5B8',
  hairColor: '#2D242E',
  hairStyle: 'long_wavy',
  topColor: '#E06385',
  pantsColor: '#1F2937',
  shoesColor: '#1F2937',
  accentColor: '#E06385',
  shoesType: 'heels',
  hasPhone: true
});
charPhoneLeft.root.scale.set(0.68, 0.68, 0.68);
charPhoneLeft.root.position.set(-1.42, 0.2, 0.8);
charPhoneLeft.root.rotation.y = 0.35;
stageSmartphone.add(charPhoneLeft.root);

const charPhoneRight = createLowPolyCharacter({
  skinColor: '#F5C396',
  hairColor: '#4A2810',
  hairStyle: 'bob',
  topColor: '#10B981', // Mint Urban
  pantsColor: '#F4E8C1',
  shoesColor: '#FFFFFF',
  accentColor: '#10B981',
  shoesType: 'sneakers',
  hasPhone: true
});
charPhoneRight.root.scale.set(0.68, 0.68, 0.68);
charPhoneRight.root.position.set(1.42, 0.2, 0.8);
charPhoneRight.root.rotation.y = -0.35;
stageSmartphone.add(charPhoneRight.root);

// =============================================================
// ESCENARIO 5: PODIO 3D & CONVERSIÓN (stagePodium)
// =============================================================
const stagePodium = new THREE.Group();
worldRoot.add(stagePodium);
stagePodium.position.y = -35; // Oculto inicialmente

// Podio hexagonal Low-Poly escalonado limpio
const basePodium = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 4.2, 0.6, 6), lpMat('#FDF2F8'));
basePodium.position.y = 0.3;
basePodium.receiveShadow = true;
basePodium.castShadow = true;
stagePodium.add(basePodium);

const topPodium = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 3.0, 0.5, 6), lpMat('#E06385'));
topPodium.position.y = 0.8;
topPodium.receiveShadow = true;
topPodium.castShadow = true;
stagePodium.add(topPodium);

// 3 PERSONAJES 3D CELEBRANDO EN EL PODIO (Completamente visibles)
const charPodiumCenter = createLowPolyCharacter({
  skinColor: '#FFD5B8',
  hairColor: '#2D242E',
  hairStyle: 'long_wavy',
  topColor: '#E06385',
  pantsColor: '#1F2937',
  shoesColor: '#FFFFFF',
  accentColor: '#E06385',
  hasPhone: false
});
charPodiumCenter.root.scale.set(0.62, 0.62, 0.62);
charPodiumCenter.root.position.set(0, 0.60, 0.9);
stagePodium.add(charPodiumCenter.root);

const charPodiumLeft = createLowPolyCharacter({
  skinColor: '#F5C396',
  hairColor: '#4A2810',
  hairStyle: 'bob',
  topColor: '#8B5CF6',
  pantsColor: '#C4B5FD',
  shoesColor: '#FFFFFF',
  accentColor: '#8B5CF6',
  hasPhone: false
});
charPodiumLeft.root.scale.set(0.62, 0.62, 0.62);
charPodiumLeft.root.position.set(-1.12, 0.38, 1.1);
charPodiumLeft.root.rotation.y = 0.35;
stagePodium.add(charPodiumLeft.root);

const charPodiumRight = createLowPolyCharacter({
  skinColor: '#E2AC80',
  hairColor: '#2D242E',
  hairStyle: 'long_wavy',
  topColor: '#10B981',
  pantsColor: '#F4E8C1',
  shoesColor: '#FFFFFF',
  accentColor: '#10B981',
  hasPhone: false
});
charPodiumRight.root.scale.set(0.62, 0.62, 0.62);
charPodiumRight.root.position.set(1.12, 0.38, 1.1);
charPodiumRight.root.rotation.y = -0.35;
stagePodium.add(charPodiumRight.root);

// -------------------------------------------------------------
// 5. CANVAS 2D: CAPAS 2, 3 & 4 (UI, BANNERS, SUBTÍTULOS)
// -------------------------------------------------------------
const uiCanvas = document.getElementById('ui');
const g = uiCanvas.getContext('2d');

// Responsive Auto-Sizing Header Badge
function drawDynamicHeaderBadge(ctx, text, dotColor = '#E06385') {
  ctx.save();
  ctx.font = '800 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  const textWidth = ctx.measureText(text).width;
  const paddingH = 34;
  const dotSize = 14;
  const gap = 16;

  const bw = Math.max(260, textWidth + paddingH * 2 + dotSize + gap);
  const bh = 60;
  const bx = CX - bw / 2;
  const by = 80;

  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(224, 99, 133, 0.35)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 6;
  roundRect(ctx, bx, by, bw, bh, 30);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  ctx.strokeStyle = '#FAD2E1';
  ctx.lineWidth = 2.5;
  roundRect(ctx, bx, by, bw, bh, 30);
  ctx.stroke();

  ctx.fillStyle = dotColor;
  ctx.beginPath();
  ctx.arc(bx + paddingH + dotSize / 2, by + bh / 2, dotSize / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#2D242E';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, bx + paddingH + dotSize + gap, by + bh / 2 + 1);

  ctx.restore();
}

// Subtítulos Dinámicos en Safe Zone (Zero Text Overflow)
function drawSubtitleSafeZone(ctx, text) {
  if (!text) return;
  ctx.save();

  const subW = 920;
  const subX = CX - subW / 2;
  const subY = 1380;
  const pillH = 140;

  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(224, 99, 133, 0.3)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 8;
  roundRect(ctx, subX, subY, subW, pillH, 32);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  ctx.strokeStyle = '#FAD2E1';
  ctx.lineWidth = 2.5;
  roundRect(ctx, subX, subY, subW, pillH, 32);
  ctx.stroke();

  ctx.fillStyle = '#2D242E';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const words = text.split(' ');
  const maxW = subW - 80;

  function wrapWordsToLines(words, maxLineWidth) {
    const lines = [];
    let curLine = '';
    for (let i = 0; i < words.length; i++) {
      const test = curLine ? curLine + ' ' + words[i] : words[i];
      if (ctx.measureText(test).width <= maxLineWidth) {
        curLine = test;
      } else {
        if (curLine) lines.push(curLine);
        curLine = words[i];
      }
    }
    if (curLine) lines.push(curLine);
    return lines;
  }

  let fontSize = 33;
  ctx.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  let lines = wrapWordsToLines(words, maxW);

  if (lines.length > 2) {
    fontSize = 27;
    ctx.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    lines = wrapWordsToLines(words, maxW);
  }

  while (lines.length > 2 && fontSize > 18) {
    fontSize -= 2;
    ctx.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    lines = wrapWordsToLines(words, maxW);
  }

  if (lines.length === 1) {
    ctx.font = '800 34px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(lines[0], CX, subY + pillH / 2);
  } else if (lines.length === 2) {
    const lineHeight = fontSize + 12;
    const startY = subY + (pillH / 2) - (lineHeight / 2);
    ctx.fillText(lines[0], CX, startY);
    ctx.fillText(lines[1], CX, startY + lineHeight);
  } else {
    const lineHeight = fontSize + 8;
    const startY = subY + (pillH / 2) - lineHeight;
    lines.slice(0, 3).forEach((line, idx) => {
      ctx.fillText(line, CX, startY + idx * lineHeight);
    });
  }

  ctx.restore();
}

// -------------------------------------------------------------
// 6. ANIMACIÓN DETERMINISTA POR TIEMPO
// -------------------------------------------------------------
window.DUR = 24.5;

window.render = async (t) => {
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, W, H);

  // ===========================================================
  // FASE 1: HOOK — EL TREND EN TU CUARTO 3D (0.0s – 3.2s)
  // ===========================================================
  if (t < 3.2) {
    stageBedroom.position.y = 0;
    stageStudio.position.y = -18;
    stageSmartphone.position.y = -25;
    stagePodium.position.y = -35;
    notif3D.visible = false;

    camera.position.set(0.6 * Math.sin(t * 0.5), 3.8, 8.8);
    camera.lookAt(0, 1.25, 0);

    // Animación 3D del personaje intentando bailar en su cuarto
    const danceTempo = t * 7;
    charBedroom.hips.position.y = 1.35 + Math.abs(Math.sin(danceTempo)) * 0.08;
    charBedroom.torso.rotation.y = Math.sin(danceTempo) * 0.25;
    charBedroom.shoulderL.rotation.z = -0.3 + Math.sin(danceTempo) * 0.4;
    charBedroom.shoulderR.rotation.z = 0.3 - Math.sin(danceTempo) * 0.4;
    charBedroom.head.rotation.y = -0.2 + Math.sin(danceTempo * 0.5) * 0.15;
    charBedroom.hipJointL.rotation.x = Math.sin(danceTempo) * 0.2;
    charBedroom.hipJointR.rotation.x = -Math.sin(danceTempo) * 0.2;

    renderer.render(scene, camera);

    // CAPA 2 & 3: 2D UI Overlay
    drawDynamicHeaderBadge(g, 'Expectativa vs. Realidad • 📱🛏️', '#E06385');

    const dt = t;
    const sCard = easeOutBack(clamp(dt * 1.6, 0, 1));
    g.save();
    g.translate(CX, 380);
    g.scale(sCard, sCard);

    const cw = 880, ch = 340;
    g.fillStyle = '#FFFFFF';
    g.shadowColor = 'rgba(45, 36, 46, 0.12)';
    g.shadowBlur = 36;
    g.shadowOffsetY = 12;
    roundRect(g, -cw/2, -ch/2, cw, ch, 36);
    g.fill();
    g.shadowColor = 'transparent';

    g.strokeStyle = '#FAD2E1';
    g.lineWidth = 3;
    g.stroke();

    // Badge Trend
    g.fillStyle = '#000000';
    roundRect(g, -cw/2 + 36, -ch/2 + 32, 280, 48, 24);
    g.fill();
    g.fillStyle = '#FFFFFF';
    g.font = '800 20px -apple-system, sans-serif';
    g.textAlign = 'center';
    g.fillText('🎵 TREND DE TIKTOK', -cw/2 + 176, -ch/2 + 62);

    g.fillStyle = '#E06385';
    g.font = '700 20px -apple-system, sans-serif';
    g.textAlign = 'right';
    g.fillText('Apoyado en un libro 📚', cw/2 - 40, -ch/2 + 62);

    // Titular
    g.fillStyle = '#2D242E';
    g.font = '900 40px -apple-system, sans-serif';
    g.textAlign = 'center';
    g.fillText('¿Tratando de aprenderte', 0, -20);
    g.fillText('el trend viral en tu pieza?', 0, 30);

    g.fillStyle = '#7E7582';
    g.font = '600 24px -apple-system, sans-serif';
    g.fillText('Te chocás la cama, el placard y no hay espacio 🤦‍♀️', 0, 90);

    g.restore();

    // CAPA 4: Subtítulos Safe Zone
    drawSubtitleSafeZone(g, '¿Entrenar el trend viral en un metro cuadrado?');
  }

  // ===========================================================
  // FASE 2: AGITATE — 50 TOMAS Y FRUSTRACIÓN (3.2s – 7.8s)
  // ===========================================================
  else if (t < 7.8) {
    stageBedroom.position.y = 0;
    stageStudio.position.y = -18;
    stageSmartphone.position.y = -25;
    stagePodium.position.y = -35;
    notif3D.visible = true;

    const dt2 = t - 3.2;
    const sPop = easeOutBack(clamp(dt2 * 2.0, 0, 1));
    notif3D.scale.set(sPop, sPop, sPop);
    notif3D.rotation.y = Math.sin(t * 3) * 0.08;

    phoneMini.rotation.z = Math.sin(t * 16) * 0.06;

    camera.position.set(0.8, 3.6, 8.2);
    camera.lookAt(0, 1.25, 0);

    // Animación de frustración y cansancio en el personaje 3D
    charBedroom.hips.position.y = 1.30;
    charBedroom.torso.rotation.x = 0.22 + Math.sin(t * 3) * 0.04;
    charBedroom.head.rotation.x = 0.35;
    charBedroom.shoulderL.rotation.z = -0.15;
    charBedroom.shoulderR.rotation.z = 0.15;
    charBedroom.shoulderL.rotation.x = 0.1;
    charBedroom.shoulderR.rotation.x = 0.1;

    renderer.render(scene, camera);

    // CAPA 2 & 3: 2D UI Overlay
    drawDynamicHeaderBadge(g, 'Toma 48 rechazada • 🗑️🫠', '#D81B60');

    const sCard = easeOutBack(clamp(dt2 * 1.5, 0, 1));
    g.save();
    g.translate(CX, 380);
    g.scale(sCard, sCard);

    const cw = 880, ch = 340;
    g.fillStyle = '#FFFFFF';
    g.shadowColor = 'rgba(216, 27, 96, 0.16)';
    g.shadowBlur = 36;
    roundRect(g, -cw/2, -ch/2, cw, ch, 36);
    g.fill();

    g.strokeStyle = '#FAD2E1';
    g.lineWidth = 3;
    g.stroke();

    // Contador de tomas
    g.fillStyle = '#FFF0F5';
    roundRect(g, -cw/2 + 36, -ch/2 + 32, 290, 48, 24);
    g.fill();
    g.fillStyle = '#D81B60';
    g.font = '800 20px -apple-system, sans-serif';
    g.textAlign = 'center';
    g.fillText('🔴 Grabando Toma 48...', -cw/2 + 181, -ch/2 + 62);

    g.fillStyle = '#FEE2E2';
    roundRect(g, cw/2 - 270, -ch/2 + 32, 230, 48, 24);
    g.fill();
    g.fillStyle = '#991B1B';
    g.font = '700 20px -apple-system, sans-serif';
    g.fillText('⚠️ Espacio 1x1m', cw/2 - 155, -ch/2 + 62);

    // Titular
    g.fillStyle = '#2D242E';
    g.font = '900 40px -apple-system, sans-serif';
    g.fillText('El espacio te queda chico', 0, -20);
    g.fillText('y terminás borrando todo', 0, 30);

    g.fillStyle = '#EF4444';
    g.font = '800 24px -apple-system, sans-serif';
    g.fillText('¡Así es imposible que el movimiento se vea lindo!', 0, 95);

    g.restore();

    // CAPA 4: Subtítulos Safe Zone
    drawSubtitleSafeZone(g, 'Te chocás la cama, el placard y grabás 50 tomas frustradas.');
  }

  // ===========================================================
  // FASE 3: REFRAME — ¡EL GRAN ESTUDIO REAL 3D! (7.8s – 12.6s)
  // ===========================================================
  else if (t < 12.6) {
    const dt3 = t - 7.8;

    const transP = clamp(dt3 * 2.0, 0, 1);
    stageBedroom.position.y = -transP * 16;
    stageStudio.position.y = (1 - easeOutBack(transP)) * -14;
    stageSmartphone.position.y = -25;
    stagePodium.position.y = -35;

    // Vibración de los subwoofers con el beat
    const bassPulse = 1.0 + Math.abs(Math.sin(t * 14)) * 0.22;
    subwoofers.forEach((sw) => {
      sw.scale.set(bassPulse, bassPulse, 1.0);
    });

    lightCones.forEach((cone, i) => {
      cone.rotation.z = Math.sin(t * 2.5 + i) * 0.12;
    });

    const camAngle = (t - 7.8) * 0.14;
    camera.position.set(Math.sin(camAngle) * 2.2, 4.0, 9.4);
    camera.lookAt(0, 1.35, 0);

    // COREOGRAFÍA 3D DE LAS DOS BAILARINAS EN EL ESTUDIO
    const beat = t * 11;
    // Bailarina A (Frambuesa / Dancehall)
    charStudioA.hips.position.y = 1.35 + Math.abs(Math.sin(beat)) * 0.12;
    charStudioA.hips.rotation.z = Math.sin(beat * 0.5) * 0.16;
    charStudioA.torso.rotation.y = Math.sin(beat) * 0.25;
    charStudioA.shoulderL.rotation.z = -0.6 + Math.sin(beat) * 0.5;
    charStudioA.shoulderR.rotation.z = 0.6 - Math.sin(beat) * 0.5;
    charStudioA.head.rotation.y = Math.sin(beat * 0.5) * 0.18;
    charStudioA.hipJointL.rotation.x = Math.sin(beat) * 0.35;
    charStudioA.hipJointR.rotation.x = -Math.sin(beat) * 0.35;

    // Bailarina B (Lavanda / K-Pop)
    charStudioB.hips.position.y = 1.35 + Math.abs(Math.cos(beat)) * 0.12;
    charStudioB.hips.rotation.z = -Math.sin(beat * 0.5) * 0.16;
    charStudioB.torso.rotation.y = -Math.sin(beat) * 0.25;
    charStudioB.shoulderL.rotation.z = -0.5 - Math.cos(beat) * 0.5;
    charStudioB.shoulderR.rotation.z = 0.5 + Math.cos(beat) * 0.5;
    charStudioB.head.rotation.y = -Math.sin(beat * 0.5) * 0.18;
    charStudioB.hipJointL.rotation.x = -Math.sin(beat) * 0.35;
    charStudioB.hipJointR.rotation.x = Math.sin(beat) * 0.35;

    renderer.render(scene, camera);

    // CAPA 2 & 3: 2D UI Overlay (Top Banner Estudio)
    drawDynamicHeaderBadge(g, 'Modo Videoclip Activado ✨🪞', '#E06385');

    const sCard = easeOutBack(clamp(dt3 * 1.5, 0, 1));
    g.save();
    g.translate(CX, 340);
    g.scale(sCard, sCard);

    const bw = 900, bh = 220;
    g.fillStyle = '#FFFFFF';
    g.shadowColor = 'rgba(224, 99, 133, 0.35)';
    g.shadowBlur = 40;
    g.shadowOffsetY = 14;
    roundRect(g, -bw/2, -bh/2, bw, bh, 36);
    g.fill();
    g.shadowColor = 'transparent';

    g.strokeStyle = '#FAD2E1';
    g.lineWidth = 3;
    g.stroke();

    g.fillStyle = '#E06385';
    g.font = '900 32px -apple-system, sans-serif';
    g.textAlign = 'center';
    g.fillText('🪞 ESPEJOS GIGANTES • SONIDO PRO • AMIGAS', 0, -45);

    const chips = [
      { label: 'K-Pop 🎀', col: '#FCE7F3', tc: '#9D174D', x: -270 },
      { label: 'Commercial Pop 🪩', col: '#E0E7FF', tc: '#3730A3', x: 0 },
      { label: 'Heels & Divas 👠', col: '#FEF08A', tc: '#854D0E', x: 270 }
    ];

    chips.forEach(c => {
      g.fillStyle = c.col;
      roundRect(g, c.x - 120, 0, 240, 52, 26);
      g.fill();
      g.fillStyle = c.tc;
      g.font = '800 22px -apple-system, sans-serif';
      g.fillText(c.label, c.x, 32);
    });

    g.fillStyle = '#6B7280';
    g.font = '600 20px -apple-system, sans-serif';
    g.fillText('En una sola clase te aprendés la coreografía completa', 0, 78);

    g.restore();

    // CAPA 4: Subtítulos Safe Zone
    drawSubtitleSafeZone(g, '¡En un estudio real con espejos gigantes y amigas te sentís en un videoclip!');
  }

  // ===========================================================
  // FASE 4: SMARTPHONE 3D — ENCONTRÁ TU CLASE (12.6s – 16.8s)
  // ===========================================================
  else if (t < 16.8) {
    const dt4 = t - 12.6;

    stageBedroom.position.y = -22;
    stageStudio.position.y = -22;
    stageSmartphone.position.y = (1 - easeOutBack(clamp(dt4 * 1.8, 0, 1))) * -15;
    stagePodium.position.y = -35;

    // Rotación isométrica suave y elegante del smartphone 3D
    phone3D.position.set(0, 1.45, 0);
    phone3D.scale.set(0.76, 0.76, 0.76);
    phone3D.rotation.y = -0.16 + Math.sin(dt4 * 1.6) * 0.08;
    phone3D.rotation.x = 0.08 + Math.cos(dt4 * 1.6) * 0.03;

    cards3D.forEach((card, idx) => {
      const cardBob = Math.sin(t * 5 + idx * 1.5) * 0.02;
      card.position.z = 0.22 + cardBob;
    });

    // Animación de las bailarinas flanqueando el smartphone (posando y consultando la app)
    charPhoneLeft.hips.position.y = 1.35 + Math.sin(t * 4) * 0.03;
    charPhoneLeft.shoulderR.rotation.x = 0.45 + Math.sin(t * 3) * 0.08;
    charPhoneLeft.head.rotation.y = 0.35 + Math.sin(t * 2) * 0.08;

    charPhoneRight.hips.position.y = 1.35 + Math.cos(t * 4) * 0.03;
    charPhoneRight.shoulderR.rotation.x = 0.45 + Math.cos(t * 3) * 0.08;
    charPhoneRight.head.rotation.y = -0.35 - Math.cos(t * 2) * 0.08;

    camera.position.set(0, 2.8, 8.8);
    camera.lookAt(0, 1.35, 0);

    renderer.render(scene, camera);

    // CAPA 2 & 3: 2D UI Overlay (Top Banner)
    drawDynamicHeaderBadge(g, 'Buscá en Bailapp • 📱', '#E06385');

    const sBanner = easeOutBack(clamp(dt4 * 1.6, 0, 1));
    g.save();
    g.translate(CX, 300);
    g.scale(sBanner, sBanner);

    const bw = 900, bh = 150;
    g.fillStyle = '#FFFFFF';
    g.shadowColor = 'rgba(224, 99, 133, 0.3)';
    g.shadowBlur = 36;
    roundRect(g, -bw/2, -bh/2, bw, bh, 32);
    g.fill();

    g.strokeStyle = '#FAD2E1';
    g.lineWidth = 3;
    g.stroke();

    g.fillStyle = '#E06385';
    g.font = '900 32px -apple-system, sans-serif';
    g.textAlign = 'center';
    g.fillText('✨ FILTRÁ POR HORARIO, ESTILO Y BARRIO', 0, -18);

    g.fillStyle = '#2D242E';
    g.font = '800 22px -apple-system, sans-serif';
    g.fillText('Elegí tu clase y asegurá tu cupo en 1 toque 📲⚡', 0, 28);

    g.restore();

    // CAPA 4: Subtítulos Safe Zone
    drawSubtitleSafeZone(g, 'Encontrá los mejores estudios y disciplinas cerca tuyo en Bailapp.');
  }

  // ===========================================================
  // FASE 5: CLÍMAX & CTA — PODIO 3D Y BAILAPP.COM.AR (16.8s – 24.5s)
  // ===========================================================
  else {
    const dt5 = t - 16.8;

    stageBedroom.position.y = -25;
    stageStudio.position.y = -25;
    stageSmartphone.position.y = -25;
    stagePodium.position.y = (1 - easeOutBack(clamp(dt5 * 1.8, 0, 1))) * -15 - 0.2;

    topPodium.rotation.y = t * 0.35;

    // Animación de celebración de las 3 bailarinas en el podio
    const danceTempo = t * 10;
    // Centro: levantando brazos en victoria
    charPodiumCenter.hips.position.y = 1.35 + Math.abs(Math.sin(danceTempo)) * 0.08;
    charPodiumCenter.shoulderL.rotation.z = -1.2 + Math.sin(danceTempo) * 0.2;
    charPodiumCenter.shoulderR.rotation.z = 1.2 - Math.sin(danceTempo) * 0.2;
    charPodiumCenter.head.rotation.x = -0.15;

    // Izquierda: saludando y celebrando
    charPodiumLeft.hips.position.y = 1.35 + Math.abs(Math.cos(danceTempo)) * 0.08;
    charPodiumLeft.shoulderL.rotation.z = -0.8 + Math.cos(danceTempo) * 0.3;
    charPodiumLeft.shoulderR.rotation.z = 0.4;

    // Derecha: saludando y celebrando
    charPodiumRight.hips.position.y = 1.35 + Math.abs(Math.sin(danceTempo)) * 0.08;
    charPodiumRight.shoulderR.rotation.z = 0.8 - Math.sin(danceTempo) * 0.3;
    charPodiumRight.shoulderL.rotation.z = -0.4;

    camera.position.set(0, 3.6, 9.2);
    camera.lookAt(0, 1.2, 0);

    renderer.render(scene, camera);

    // CAPA 2 & 3: 2D UI Overlay (Gran Tarjeta de Conversión Oficial)
    drawDynamicHeaderBadge(g, 'Tu momento de desconexión ✨', '#E06385');

    const sCta = easeOutBack(clamp(dt5 * 1.8, 0, 1));
    g.save();
    g.translate(CX, 460);
    g.scale(sCta, sCta);

    const cw = 880, ch = 520;
    g.fillStyle = '#FFFFFF';
    g.shadowColor = 'rgba(224, 99, 133, 0.45)';
    g.shadowBlur = 54;
    g.shadowOffsetY = 18;
    roundRect(g, -cw/2, -ch/2, cw, ch, 44);
    g.fill();
    g.shadowColor = 'transparent';

    g.strokeStyle = '#FAD2E1';
    g.lineWidth = 4;
    g.stroke();

    // Logo Bailapp
    g.fillStyle = '#E06385';
    g.font = '900 56px -apple-system, sans-serif';
    g.textAlign = 'center';
    g.fillText('Bailapp ✨', 0, -170);

    g.fillStyle = '#2D242E';
    g.font = '900 38px -apple-system, sans-serif';
    g.fillText('Aprendé los trends virales', 0, -100);
    g.fillText('en estudios reales con amigas', 0, -50);

    g.fillStyle = '#8E7D88';
    g.font = '600 24px -apple-system, sans-serif';
    g.fillText('K-Pop • Commercial Dance • Heels • Reggaetón', 0, 10);
    g.fillText('Todos los estudios de tu ciudad en una sola web', 0, 48);

    // BOTÓN OFICIAL CON DOMINIO BAILAPP.COM.AR
    const btnPulse = 1.0 + Math.sin(t * 8) * 0.04;
    g.save();
    g.translate(0, 150);
    g.scale(btnPulse, btnPulse);

    g.fillStyle = '#D81B60';
    g.shadowColor = 'rgba(216, 27, 96, 0.55)';
    g.shadowBlur = 32;
    g.shadowOffsetY = 10;
    roundRect(g, -360, -50, 720, 100, 50);
    g.fill();
    g.shadowColor = 'transparent';

    // Shimmer
    const shimX = ((t * 600) % 1100) - 550;
    const sGrad = g.createLinearGradient(shimX - 100, 0, shimX + 100, 0);
    sGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    sGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.45)');
    sGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    g.fillStyle = sGrad;
    roundRect(g, -360, -50, 720, 100, 50);
    g.fill();

    g.fillStyle = '#FFFFFF';
    g.font = '900 40px -apple-system, sans-serif';
    g.textAlign = 'center';
    g.fillText('👉 bailapp.com.ar 👈', 0, 14);
    g.restore();

    g.fillStyle = '#E06385';
    g.font = '800 22px -apple-system, sans-serif';
    g.fillText('Link directo en la bio • Cupos limitados', 0, 235);

    g.restore();

    // CAPA 4: Subtítulos Safe Zone
    drawSubtitleSafeZone(g, 'Reservá tu clase hoy en bailapp.com.ar • Link en bio.');
  }
};

window.READY = true;
console.log('Bailapp 100% Low-Poly 3D Characters Reel Engine Listo! Duración:', window.DUR);

// -------------------------------------------------------------
// 7. CONTROLES INTERACTIVOS PARA NAVEGADOR
// -------------------------------------------------------------
const btnPlay = document.getElementById('btn-play');
const btnRestart = document.getElementById('btn-restart');
const timeSlider = document.getElementById('time-slider');
const timeDisplay = document.getElementById('time-display');
const btnSpeed = document.getElementById('btn-speed');
const btnSound = document.getElementById('btn-sound');

let isPlaying = false;
let currentTime = 0;
let playbackSpeed = 1.0;
let lastTimestamp = null;
let audioObj = null;

if (document.getElementById('bg-music')) {
  audioObj = document.getElementById('bg-music');
}

function formatTime(s) {
  const mins = Math.floor(s / 60);
  const secs = Math.floor(s % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

async function stepTime(time) {
  currentTime = clamp(time, 0, window.DUR);
  if (timeSlider) timeSlider.value = currentTime;
  if (timeDisplay) timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(window.DUR)}`;
  await window.render(currentTime);
}

function tick(ts) {
  if (!isPlaying) return;
  if (!lastTimestamp) lastTimestamp = ts;
  const delta = (ts - lastTimestamp) / 1000;
  lastTimestamp = ts;

  currentTime += delta * playbackSpeed;
  if (currentTime >= window.DUR) {
    currentTime = window.DUR;
    isPlaying = false;
    if (btnPlay) btnPlay.textContent = '▶ Reproducir';
    if (audioObj) audioObj.pause();
  }
  stepTime(currentTime);
  if (isPlaying) requestAnimationFrame(tick);
}

if (btnPlay) {
  btnPlay.addEventListener('click', () => {
    isPlaying = !isPlaying;
    btnPlay.textContent = isPlaying ? '❚❚ Pausar' : '▶ Reproducir';
    if (isPlaying) {
      if (currentTime >= window.DUR) currentTime = 0;
      lastTimestamp = null;
      if (audioObj) {
        audioObj.currentTime = currentTime;
        audioObj.play().catch(() => {});
      }
      requestAnimationFrame(tick);
    } else {
      if (audioObj) audioObj.pause();
    }
  });
}

if (btnRestart) {
  btnRestart.addEventListener('click', () => {
    currentTime = 0;
    stepTime(0);
    if (audioObj) audioObj.currentTime = 0;
  });
}

if (timeSlider) {
  timeSlider.addEventListener('input', (e) => {
    stepTime(parseFloat(e.target.value));
    if (audioObj) audioObj.currentTime = currentTime;
  });
}

stepTime(0);
