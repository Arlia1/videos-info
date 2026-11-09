// =============================================================
// BAILAPP LOW POLY 3D VIRAL REEL ENGINE (24.5 Segundos)
// Three.js WebGL (Capas 0 y 1: Escenarios y Modelos 3D Facetados)
// + Canvas 2D (Capas 1, 2, 3 y 4: Personajes, UI y Subtítulos Seguros)
// =============================================================

import * as THREE from './three.module.js';

const W = 1080;
const H = 1920;
const CX = W / 2;
const CY = H / 2;

// -------------------------------------------------------------
// CARGA ASINCRÓNICA DE PERSONAJES HUMAAANS
// -------------------------------------------------------------
const assets = {};
const charNames = [
  'character_dancehall',
  'character_kpop',
  'character_bachata',
  'character_urbano',
  'character_heels',
  'character_ballet',
  'character_generico_1',
  'character_generico_2'
];

async function loadAssets() {
  const promises = charNames.map(name => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = `assets/${name}.png`;
      img.onload = () => { assets[name] = img; resolve(); };
      img.onerror = () => {
        console.warn(`Could not load ${name}, using fallback`);
        resolve();
      };
    });
  });
  await Promise.all(promises);
  console.log('Personajes Humaaans cargados para Reel Low Poly 3D!');
}

await loadAssets();

// -------------------------------------------------------------
// 1. SETUP DE THREE.JS WEBGL (CAPA 0 & 1)
// -------------------------------------------------------------
const webglCanvas = document.getElementById('webgl');
const renderer = new THREE.WebGLRenderer({
  canvas: webglCanvas,
  antialias: true,
  preserveDrawingBuffer: true,
  alpha: true
});
renderer.setSize(W, H, false);
renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#FFF5F8');

// Cámara en perspectiva diorama/isométrica (FOV 42)
const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
camera.position.set(0, 4.2, 8.5);
camera.lookAt(0, 1.2, 0);

// Iluminación Facetada Pastel
const ambientLight = new THREE.AmbientLight(0xFFF2F7, 1.05);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xFFFFFF, 1.35);
sunLight.position.set(6, 12, 8);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024;
sunLight.shadow.mapSize.height = 1024;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 30;
sunLight.shadow.camera.left = -6;
sunLight.shadow.camera.right = 6;
sunLight.shadow.camera.top = 6;
sunLight.shadow.camera.bottom = -6;
sunLight.shadow.bias = -0.001;
scene.add(sunLight);

const rimLight = new THREE.DirectionalLight(0xFFD3E2, 0.65);
rimLight.position.set(-6, 5, -5);
scene.add(rimLight);

// Helper para materiales Low-Poly planos
function lpMat(colorHex, roughness = 0.85, metalness = 0.04) {
  return new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness,
    metalness,
    flatShading: true
  });
}

// -------------------------------------------------------------
// 2. CONSTRUCCIÓN DE ESCENARIOS 3D MODULARES (STAGE SWAPPING)
// -------------------------------------------------------------
const worldRoot = new THREE.Group();
scene.add(worldRoot);

// -------------------------------------------------------------
// ESCENARIO 1 & 2: EL CUARTO APRETADO LOW-POLY (stageBedroom)
// -------------------------------------------------------------
const stageBedroom = new THREE.Group();
worldRoot.add(stageBedroom);

// Piso de tablones de madera low-poly
const floorGeo = new THREE.BoxGeometry(6.2, 0.2, 6.2);
const floorMat = lpMat('#EAD8CF', 0.9);
const floorMesh = new THREE.Mesh(floorGeo, floorMat);
floorMesh.position.y = -0.1;
floorMesh.receiveShadow = true;
stageBedroom.add(floorMesh);

// Pared trasera suave
const wallGeo = new THREE.BoxGeometry(6.2, 4.5, 0.2);
const wallMat = lpMat('#FCE8F0', 0.95);
const wallMesh = new THREE.Mesh(wallGeo, wallMat);
wallMesh.position.set(0, 2.15, -3.0);
wallMesh.receiveShadow = true;
stageBedroom.add(wallMesh);

// Cama Low-Poly
const bedGroup = new THREE.Group();
bedGroup.position.set(1.5, 0, -1.2);

const bedBase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.45, 3.2), lpMat('#D8C2B0'));
bedBase.position.y = 0.225;
bedBase.castShadow = true;
bedBase.receiveShadow = true;
bedGroup.add(bedBase);

const mattress = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.35, 3.0), lpMat('#FFFFFF'));
mattress.position.y = 0.55;
mattress.castShadow = true;
mattress.receiveShadow = true;
bedGroup.add(mattress);

const blanket = new THREE.Mesh(new THREE.BoxGeometry(2.24, 0.38, 2.0), lpMat('#F8C8DC'));
blanket.position.set(0, 0.57, 0.5);
blanket.castShadow = true;
bedGroup.add(blanket);

const pillow = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.2, 0.7), lpMat('#FFF9F5'));
pillow.position.set(0, 0.8, -1.0);
pillow.rotation.x = 0.15;
pillow.castShadow = true;
bedGroup.add(pillow);
stageBedroom.add(bedGroup);

// Mesita de noche con libros apilados
const standGroup = new THREE.Group();
standGroup.position.set(-0.2, 0, -2.2);

const stand = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.75, 0.8), lpMat('#D8C2B0'));
stand.position.y = 0.375;
stand.castShadow = true;
standGroup.add(stand);

// Libros apoyados
const bookColors = ['#E06385', '#FED7AA', '#DDD6FE'];
bookColors.forEach((col, i) => {
  const bk = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.4), lpMat(col));
  bk.position.set(0.05 * (i % 2), 0.75 + i * 0.08 + 0.04, 0);
  bk.rotation.y = (i * 0.2) - 0.2;
  bk.castShadow = true;
  standGroup.add(bk);
});

// Smartphone apoyado verticalmente
const phoneMini = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.42, 0.04), lpMat('#2D242E'));
phoneMini.position.set(0.05, 1.15, -0.05);
phoneMini.rotation.x = -0.25;
phoneMini.rotation.y = 0.15;
phoneMini.castShadow = true;
standGroup.add(phoneMini);
stageBedroom.add(standGroup);

// Espejo de pie low-poly
const mirrorGroup = new THREE.Group();
mirrorGroup.position.set(-2.2, 0, -1.5);
mirrorGroup.rotation.y = 0.55;

const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.6, 0.1), lpMat('#E06385'));
mirrorFrame.position.y = 1.3;
mirrorFrame.castShadow = true;
mirrorGroup.add(mirrorFrame);

const mirrorGlass = new THREE.Mesh(new THREE.BoxGeometry(0.82, 2.4, 0.05), lpMat('#E0F2FE', 0.2, 0.8));
mirrorGlass.position.set(0, 1.3, 0.04);
mirrorGroup.add(mirrorGlass);
stageBedroom.add(mirrorGroup);

// Planta Low-Poly en esquina
const plantGroup = new THREE.Group();
plantGroup.position.set(-2.2, 0, 1.5);
const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.22, 0.5, 6), lpMat('#FDBA74'));
pot.position.y = 0.25;
pot.castShadow = true;
plantGroup.add(pot);

const leaves = new THREE.Mesh(new THREE.IcosahedronGeometry(0.38, 0), lpMat('#86EFAC'));
leaves.position.y = 0.65;
leaves.castShadow = true;
plantGroup.add(leaves);
stageBedroom.add(plantGroup);

// Notificación 3D Flotante de Frustración [ 🔴 TOMA 48 ]
const notif3D = new THREE.Group();
notif3D.position.set(0, 2.5, 0);
const notifPill = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.55, 0.12), lpMat('#FFFFFF'));
notifPill.castShadow = true;
notif3D.add(notifPill);
const notifTag = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.35, 0.14), lpMat('#D81B60'));
notifTag.position.set(-0.65, 0, 0.02);
notif3D.add(notifTag);
stageBedroom.add(notif3D);
notif3D.visible = false;

// -------------------------------------------------------------
// ESCENARIO 3: EL ESTUDIO REAL BAILAPP (stageStudio)
// -------------------------------------------------------------
const stageStudio = new THREE.Group();
worldRoot.add(stageStudio);
stageStudio.position.y = -15; // Oculto inicialmente bajo tierra

// Piso de estudio de danza low-poly amplio
const studioFloor = new THREE.Mesh(new THREE.BoxGeometry(12, 0.2, 12), lpMat('#FDF4EE', 0.7));
studioFloor.position.y = -0.1;
studioFloor.receiveShadow = true;
stageStudio.add(studioFloor);

// Pared trasera con espejos gigantes de danza
const studioWall = new THREE.Mesh(new THREE.BoxGeometry(12, 6.0, 0.2), lpMat('#FCE7F0', 0.9));
studioWall.position.set(0, 2.9, -5.0);
studioWall.receiveShadow = true;
stageStudio.add(studioWall);

// 3 Espejos Gigantes
[-3.2, 0, 3.2].forEach((mx) => {
  const mFrame = new THREE.Mesh(new THREE.BoxGeometry(2.8, 4.2, 0.12), lpMat('#FAD2E1'));
  mFrame.position.set(mx, 2.2, -4.9);
  mFrame.castShadow = true;
  stageStudio.add(mFrame);

  const mGlass = new THREE.Mesh(new THREE.BoxGeometry(2.55, 3.95, 0.06), lpMat('#E0F2FE', 0.15, 0.85));
  mGlass.position.set(mx, 2.2, -4.82);
  stageStudio.add(mGlass);
});

// Reflectores / Luces de Estudio Cenitales (3 conos)
const lightCones = [];
const spotColors = ['#FF80AB', '#A7F3D0', '#DDD6FE'];
[-3.0, 0, 3.0].forEach((lx, i) => {
  const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, 0.45, 6), lpMat('#2D242E'));
  lamp.position.set(lx, 5.0, -1.0);
  stageStudio.add(lamp);

  // Cono de luz translúcido low-poly
  const cGeo = new THREE.ConeGeometry(1.6, 5.0, 6, 1, true);
  const cMat = new THREE.MeshBasicMaterial({
    color: spotColors[i],
    transparent: true,
    opacity: 0.18,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const cone = new THREE.Mesh(cGeo, cMat);
  cone.position.set(lx, 2.5, -1.0);
  cone.rotation.x = Math.PI;
  stageStudio.add(cone);
  lightCones.push(cone);
});

// Columnas de Sonido / Subwoofers Low-Poly
const subwoofers = [];
[-4.6, 4.6].forEach((sx) => {
  const swBox = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.2, 0.9), lpMat('#2D242E'));
  swBox.position.set(sx, 1.1, -3.2);
  swBox.castShadow = true;
  stageStudio.add(swBox);

  // Conos vibrantes
  const speakerCone = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.28, 0.15, 8), lpMat('#E06385'));
  speakerCone.position.set(sx, 1.4, -2.7);
  speakerCone.rotation.x = Math.PI / 2;
  stageStudio.add(speakerCone);
  subwoofers.push(speakerCone);
});

// Partículas geométricas flotantes de ritmo (Diamantes Low-Poly)
const sparkleCount = 20;
const sparkles = [];
for (let i = 0; i < sparkleCount; i++) {
  const sGeo = new THREE.IcosahedronGeometry(0.12, 0);
  const sMat = lpMat(i % 2 === 0 ? '#E06385' : '#FDE047', 0.3, 0.2);
  const sp = new THREE.Mesh(sGeo, sMat);
  const rad = 2.0 + Math.random() * 2.5;
  const ang = (i / sparkleCount) * Math.PI * 2;
  sp.position.set(Math.cos(ang) * rad, 1.2 + Math.random() * 2.5, Math.sin(ang) * rad);
  stageStudio.add(sp);
  sparkles.push({ mesh: sp, baseAng: ang, baseR: rad, baseY: sp.position.y, speed: 0.8 + Math.random() * 1.2 });
}

// Helper Easing y Geometría
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
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Generador de texturas Canvas ultra nítidas para las tarjetas 3D
function createCardTexture(title, styleBadge, timeText, locationText, spotsLeft, badgeBg, badgeColor, btnColor) {
  const cv = document.createElement('canvas');
  cv.width = 1024;
  cv.height = 470;
  const ctx = cv.getContext('2d');

  // Fondo blanco tarjeta con bordes redondeados
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
// ESCENARIO 4: SMARTPHONE 3D INTERACTIVO (stageSmartphone)
// -------------------------------------------------------------
const stageSmartphone = new THREE.Group();
worldRoot.add(stageSmartphone);
stageSmartphone.position.y = -25; // Oculto inicialmente

const phone3D = new THREE.Group();
phone3D.position.set(0, 0.95, 0);
phone3D.scale.set(0.92, 0.92, 0.92);
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

// -------------------------------------------------------------
// ESCENARIO 5: PODIO 3D & CONFETI DE CONVERSIÓN (stagePodium)
// -------------------------------------------------------------
const stagePodium = new THREE.Group();
worldRoot.add(stagePodium);
stagePodium.position.y = -35; // Oculto inicialmente

// Podio hexagonal Low-Poly escalonado
const basePodium = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 4.0, 0.6, 6), lpMat('#FDF2F8'));
basePodium.position.y = 0.3;
basePodium.receiveShadow = true;
basePodium.castShadow = true;
stagePodium.add(basePodium);

const topPodium = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.8, 0.5, 6), lpMat('#E06385'));
topPodium.position.y = 0.8;
topPodium.receiveShadow = true;
topPodium.castShadow = true;
stagePodium.add(topPodium);

// Confeti y prismas geométricos cayendo en 3D
const confettiCount = 45;
const confettiList = [];
const confColors = ['#E06385', '#D81B60', '#FDE047', '#A7F3D0', '#C4B5FD', '#FFFFFF'];

for (let i = 0; i < confettiCount; i++) {
  const geo = i % 2 === 0
    ? new THREE.BoxGeometry(0.18, 0.18, 0.03)
    : new THREE.TetrahedronGeometry(0.15, 0);
  const confMat = lpMat(confColors[i % confColors.length], 0.4);
  const mesh = new THREE.Mesh(geo, confMat);
  mesh.position.set((Math.random() - 0.5) * 5.5, 1.5 + Math.random() * 4.5, (Math.random() - 0.5) * 4.5);
  mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  stagePodium.add(mesh);
  confettiList.push({
    mesh,
    fallSpeed: 0.025 + Math.random() * 0.035,
    rotX: (Math.random() - 0.5) * 0.08,
    rotY: (Math.random() - 0.5) * 0.08,
    initY: mesh.position.y
  });
}

// -------------------------------------------------------------
// 3. CANVAS 2D: CAPAS 1, 2, 3 & 4 (PERSONAJES, UI, CARDS Y SUBTÍTULOS)
// -------------------------------------------------------------
const uiCanvas = document.getElementById('ui');
const g = uiCanvas.getContext('2d');

// CAPA 1: DIBUJAR PERSONAJE HUMAAANS (SIEMPRE ANTES DE CONTENEDORES UI)
function drawCharacter(ctx, imgName, x, y, scale = 1.0, bob = 0, rot = 0, alpha = 1.0) {
  const img = assets[imgName];
  if (!img) return;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y + bob);
  ctx.rotate(rot);
  ctx.scale(scale, scale);

  // Sombra suave en suelo
  ctx.fillStyle = 'rgba(216, 27, 96, 0.15)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 110 * scale, 24 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  const iw = img.width;
  const ih = img.height;
  const drawW = 340;
  const drawH = (ih / iw) * drawW;

  ctx.drawImage(img, -drawW / 2, -drawH + 15, drawW, drawH);
  ctx.restore();
}

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

  // Fondo cápsula de alto contraste
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(224, 99, 133, 0.16)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  roundRect(ctx, bx, by, bw, bh, 30);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  // Borde
  ctx.strokeStyle = '#FAD2E1';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Indicador
  const dotX = bx + paddingH + dotSize / 2;
  ctx.fillStyle = dotColor;
  ctx.beginPath();
  ctx.arc(dotX, by + bh / 2, 6, 0, Math.PI * 2);
  ctx.fill();

  // Texto centrado en su bloque interior
  ctx.fillStyle = '#2D242E';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, dotX + gap, by + bh / 2 + 1);

  ctx.restore();
}

// CAPA 4: SUBTÍTULOS SEGUROS CON WRAP DINÁMICO Y AUTO-ESCALADO (CERO DESBORDES)
function drawSubtitleSafeZone(ctx, text) {
  const subY = 1370;
  const pillW = 960;
  const pillH = 140;
  const pillX = (W - pillW) / 2;
  const maxW = pillW - 90; // 870px ancho útil interno seguro

  ctx.save();

  // Contenedor píldora
  ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
  ctx.shadowColor = 'rgba(224, 99, 133, 0.22)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 12;
  roundRect(ctx, pillX, subY, pillW, pillH, 36);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  ctx.strokeStyle = '#F8C8DC';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#2D242E';

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

  const words = text.split(' ');
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
// 4. ANIMACIÓN Y RENDERIZADO POR TIEMPO DETERMINISTA
// -------------------------------------------------------------
window.DUR = 24.5;

window.render = async (t) => {
  // Limpiar Canvas 2D
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, W, H);

  // ===========================================================
  // FASE 1: HOOK — EL TREND EN TU CUARTO LOW-POLY (0.0s – 3.2s)
  // ===========================================================
  if (t < 3.2) {
    // 3D Scene Config
    stageBedroom.position.y = 0;
    stageStudio.position.y = -15;
    stageSmartphone.position.y = -25;
    stagePodium.position.y = -35;
    notif3D.visible = false;

    // Cámara suave siguiendo el cuarto
    camera.position.set(0.5 * Math.sin(t * 0.5), 3.8, 7.8);
    camera.lookAt(0, 1.1, 0);

    // Render WebGL (Capa 0)
    renderer.render(scene, camera);

    // CAPA 1: Personaje intentando bailar en el cuarto (DETRÁS DE LA TARJETA)
    drawCharacter(g, 'character_generico_1', CX - 220, 1340, 1.15, Math.sin(t * 4) * 4, 0);

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
    stageStudio.position.y = -15;
    stageSmartphone.position.y = -25;
    stagePodium.position.y = -35;
    notif3D.visible = true;

    // Animación de rebote en la notificación 3D
    const dt2 = t - 3.2;
    const sPop = easeOutBack(clamp(dt2 * 2.0, 0, 1));
    notif3D.scale.set(sPop, sPop, sPop);
    notif3D.rotation.y = Math.sin(t * 4) * 0.1;

    // Sacudida sutil en el smartphone de la mesa de noche
    phoneMini.rotation.z = Math.sin(t * 18) * 0.08;

    camera.position.set(0.8, 3.4, 7.2);
    camera.lookAt(0, 1.2, 0);

    // Render WebGL (Capa 0)
    renderer.render(scene, camera);

    // CAPA 1: Personaje desanimado en el cuarto (DETRÁS DE LA TARJETA)
    const bob = Math.sin(t * 3) * 4;
    drawCharacter(g, 'character_generico_2', CX - 220, 1340, 1.15, bob, 0);

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

    // Transición cinematográfica: el cuarto se hunde y el estudio emerge
    const transP = clamp(dt3 * 2.0, 0, 1);
    stageBedroom.position.y = -transP * 15;
    stageStudio.position.y = (1 - easeOutBack(transP)) * -12;
    stageSmartphone.position.y = -25;
    stagePodium.position.y = -35;

    // Animación de los subwoofers vibrando con el beat
    const bassPulse = 1.0 + Math.abs(Math.sin(t * 14)) * 0.25;
    subwoofers.forEach((sw) => {
      sw.scale.set(bassPulse, bassPulse, 1.0);
    });

    // Ondas y rotación de los reflectores cenitales
    lightCones.forEach((cone, i) => {
      cone.rotation.z = Math.sin(t * 3 + i) * 0.15;
    });

    // Partículas de ritmo orbitando en 3D
    sparkles.forEach((sp) => {
      const ang = sp.baseAng + t * sp.speed * 0.5;
      sp.mesh.position.x = Math.cos(ang) * sp.baseR;
      sp.mesh.position.z = Math.sin(ang) * sp.baseR;
      sp.mesh.position.y = sp.baseY + Math.sin(t * 4 + sp.baseAng) * 0.3;
      sp.mesh.rotation.x += 0.04;
      sp.mesh.rotation.y += 0.04;
    });

    // Cámara amplia orbital en el estudio
    const camAngle = (t - 7.8) * 0.12;
    camera.position.set(Math.sin(camAngle) * 2.5, 4.6, 8.8 + Math.cos(camAngle) * 0.8);
    camera.lookAt(0, 1.8, 0);

    // Render WebGL (Capa 0)
    renderer.render(scene, camera);

    // CAPA 1: Dos bailarinas celebrando en el estudio 3D (DETRÁS DEL BANNER)
    const bounce1 = Math.sin(t * 12) * 16;
    drawCharacter(g, 'character_dancehall', CX - 240, 1340 + bounce1, 1.15, 0, Math.sin(t * 6) * 0.04);

    const bounce2 = Math.cos(t * 12) * 16;
    drawCharacter(g, 'character_kpop', CX + 240, 1340 + bounce2, 1.15, 0, -Math.sin(t * 6) * 0.04);

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

    // Chips de coreografías dentro de los márgenes seguros
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
    phone3D.position.set(0, 1.35, 0);
    phone3D.scale.set(0.85, 0.85, 0.85);
    phone3D.rotation.y = -0.16 + Math.sin(dt4 * 1.6) * 0.08;
    phone3D.rotation.x = 0.08 + Math.cos(dt4 * 1.6) * 0.03;

    // Efecto magnético flotante de las tarjetas 3D en relieve
    cards3D.forEach((card, idx) => {
      const cardBob = Math.sin(t * 5 + idx * 1.5) * 0.02;
      card.position.z = 0.22 + cardBob;
    });

    camera.position.set(0, 2.7, 7.8);
    camera.lookAt(0, 1.35, 0);

    // Render WebGL (Capa 0: Smartphone 3D y entorno)
    renderer.render(scene, camera);

    // CAPA 1: Bailarinas en flancos exteriores (Completamente fuera del chasis del teléfono)
    drawCharacter(g, 'character_heels', 75, 1340, 0.95, Math.sin(t * 6) * 5, 0);
    drawCharacter(g, 'character_dancehall', W - 75, 1340, 0.95, -Math.sin(t * 6) * 5, 0);

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
    stagePodium.position.y = (1 - easeOutBack(clamp(dt5 * 1.8, 0, 1))) * -15;

    // Rotación del podio y lluvia de confeti 3D
    topPodium.rotation.y = t * 0.4;
    confettiList.forEach(cf => {
      cf.mesh.position.y -= cf.fallSpeed;
      cf.mesh.rotation.x += cf.rotX;
      cf.mesh.rotation.y += cf.rotY;
      if (cf.mesh.position.y < 0.2) {
        cf.mesh.position.y = cf.initY + 1.5;
      }
    });

    camera.position.set(0, 3.8, 8.2);
    camera.lookAt(0, 1.4, 0);

    // Render WebGL (Capa 0)
    renderer.render(scene, camera);

    // CAPA 1: Trío de bailarinas divas en el podio (DETRÁS DE LA TARJETA CTA)
    const danceBob = Math.sin(t * 10) * 12;
    drawCharacter(g, 'character_kpop', CX - 280, 1340 - danceBob, 1.12, 0, Math.sin(t * 6) * 0.03);
    drawCharacter(g, 'character_dancehall', CX, 1340 + danceBob, 1.15, 0, 0);
    drawCharacter(g, 'character_bachata', CX + 280, 1340 - danceBob, 1.12, 0, -Math.sin(t * 6) * 0.03);

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
console.log('Bailapp Low Poly 3D Viral Reel Engine Listo! Duración:', window.DUR);

// -------------------------------------------------------------
// CONTROLES INTERACTIVOS PARA NAVEGADOR
// -------------------------------------------------------------
const btnPlay = document.getElementById('btn-play');
const btnRestart = document.getElementById('btn-restart');
const timeSlider = document.getElementById('time-slider');
const timeDisplay = document.getElementById('time-display');
const btnSpeed = document.getElementById('btn-speed');
const btnSound = document.getElementById('btn-sound');
const stageContainer = document.getElementById('stage-container');

function resizePreview() {
  if (!stageContainer) return;
  const availableW = window.innerWidth - 60;
  const availableH = window.innerHeight - 120;
  const scale = Math.min(availableW / W, availableH / H, 1.0);
  stageContainer.style.transform = `scale(${scale})`;
}
window.addEventListener('resize', resizePreview);
resizePreview();

let isPlaying = false;
let currentTime = 0;
let playSpeed = 1.0;
let lastTimestamp = null;
let audioEl = null;

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
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

  currentTime += delta * playSpeed;
  if (currentTime >= window.DUR) {
    currentTime = window.DUR;
    isPlaying = false;
    if (btnPlay) btnPlay.textContent = '▶ Reproducir';
    if (audioEl) audioEl.pause();
  }
  stepTime(currentTime);
  if (isPlaying) requestAnimationFrame(tick);
}

if (btnPlay) {
  btnPlay.addEventListener('click', () => {
    isPlaying = !isPlaying;
    btnPlay.textContent = isPlaying ? '⏸ Pausa' : '▶ Reproducir';
    if (isPlaying) {
      if (currentTime >= window.DUR) currentTime = 0;
      lastTimestamp = null;
      requestAnimationFrame(tick);
    }
  });
}

if (btnRestart) {
  btnRestart.addEventListener('click', () => {
    stepTime(0);
    if (isPlaying) {
      lastTimestamp = null;
    }
  });
}

if (timeSlider) {
  timeSlider.addEventListener('input', (e) => {
    isPlaying = false;
    if (btnPlay) btnPlay.textContent = '▶ Reproducir';
    stepTime(parseFloat(e.target.value));
  });
}

stepTime(0);
