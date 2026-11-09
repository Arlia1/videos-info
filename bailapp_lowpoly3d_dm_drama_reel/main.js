import * as THREE from './shared/three.module.js';
import { createLowPolyMaterial, buildEnhancedCharacter } from './shared/characters/character_builder.js';
import {
  createBedroomGirl,
  createStudioDancerA,
  createStudioDancerB,
  createStudioDancerC
} from './shared/characters/character_presets.js';
import { createStageBedroom } from './shared/stages/stage_bedroom.js';
import { createStageStudio } from './shared/stages/stage_studio.js';
import { createStageSmartphone } from './shared/stages/stage_smartphone.js';
import { createStagePodium } from './shared/stages/stage_podium.js';

// ============================================================================
// BAILAPP — REEL LOW-POLY 3D VIRAL: "EL DRAMA DEL DM VS BAILAPP" (V3)
// ============================================================================
// - Rostros 100% luminosos y limpios (textura canvas de alta definición).
// - Carteles flotantes 3D con TEXTO REAL y nítido.
// - Cero desborde de texto (badges dinámicos y escalado automático).
// - Cámara cinematográfica continua (dolly, órbita, paneo y grúa).
// - Personajes con pies firmemente apoyados en el piso real (Y = 0.00).
// ============================================================================

const W = 1080;
const H = 1920;
const CX = W / 2;
const CY = H / 2;
window.DUR = 31.0;

// ----------------------------------------------------------------------------
// 1. MOTOR 3D THREE.JS (CAPA 0 & CAPA 1)
// ----------------------------------------------------------------------------
const webglCanvas = document.getElementById('webgl');
const renderer = new THREE.WebGLRenderer({
  canvas: webglCanvas,
  antialias: true,
  alpha: false,
  preserveDrawingBuffer: true,
});
renderer.setSize(W, H);
renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.10;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#FFF5F8');
scene.fog = new THREE.FogExp2('#FFF5F8', 0.02);

// Cámara cinematográfica con posición inicial
const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
camera.position.set(0.8, 3.4, 9.2);
camera.lookAt(0, 1.25, 0);

// Iluminación Escénica
const hemiLight = new THREE.HemisphereLight('#FFF0F5', '#E5D0D8', 1.25);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight('#FFF9E6', 1.45);
dirLight.position.set(6, 12, 8);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.bias = -0.0004;
scene.add(dirLight);

const fillLight = new THREE.DirectionalLight('#FAD2E1', 0.65);
fillLight.position.set(-6, 5, -4);
scene.add(fillLight);

// ----------------------------------------------------------------------------
// 2. ESCENARIOS Y CARTELES FLOTANTES 3D CON TEXTO REAL
// ----------------------------------------------------------------------------
// Helper para crear texturas Canvas para carteles 3D
function createDMTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');

  // Fondo blanco con sombra suave
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(10, 10, 620, 300, 28);
  ctx.fill();

  // Borde frambuesa suave
  ctx.strokeStyle = '#FAD2E1';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Header tipo chat Instagram DM
  ctx.fillStyle = '#E06385';
  ctx.beginPath();
  ctx.roundRect(30, 28, 220, 38, 14);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 20px Inter, sans-serif';
  ctx.fillText('INSTAGRAM DM • 19:02', 45, 54);

  // Mensaje enviado
  ctx.fillStyle = '#1F2937';
  ctx.font = 'bold 30px Inter, sans-serif';
  ctx.fillText('«Hola! ¿Quedan cupos para hoy?»', 35, 120);

  // Sub-burbuja de respuesta / espera
  ctx.fillStyle = '#F3F4F6';
  ctx.beginPath();
  ctx.roundRect(35, 155, 570, 75, 18);
  ctx.fill();

  ctx.fillStyle = '#6B7280';
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.fillText('Visto 19:05 👁️‍🗨️', 55, 202);

  ctx.fillStyle = '#EF4444';
  ctx.font = 'bold 22px Inter, sans-serif';
  ctx.fillText('• Sin respuesta hace 3 horas ⏳', 240, 202);

  // Status de espera
  ctx.fillStyle = '#9CA3AF';
  ctx.font = '500 20px Inter, sans-serif';
  ctx.fillText('Esperando confirmación para ir a la clase...', 35, 275);

  const tex = new THREE.CanvasTexture(canvas);
  tex.generateMipmaps = true;
  return tex;
}

function createFlyerTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 680;
  const ctx = canvas.getContext('2d');

  // Fondo del flyer (estilo historia de Instagram)
  ctx.fillStyle = '#2D242E';
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 660, 24);
  ctx.fill();

  ctx.strokeStyle = '#EF4444';
  ctx.lineWidth = 8;
  ctx.stroke();

  // Título academia
  ctx.fillStyle = '#F8C8DC';
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('★ ACADEMIA DE DANZA ★', 256, 65);

  // Disciplina
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 42px Inter, sans-serif';
  ctx.fillText('URBANO & HEELS', 256, 135);

  ctx.fillStyle = '#D1D5DB';
  ctx.font = '24px Inter, sans-serif';
  ctx.fillText('Jueves 19:30 hs • Sala Principal', 256, 185);

  // Sello gigante de CUPO COMPLETO
  ctx.save();
  ctx.translate(256, 320);
  ctx.rotate(-0.15);

  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.roundRect(-210, -50, 420, 100, 20);
  ctx.fill();

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px Inter, sans-serif';
  ctx.fillText('❌ CUPO COMPLETO', 0, 12);
  ctx.restore();

  // Mensaje de respuesta frustrante
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(30, 430, 452, 130, 18);
  ctx.fill();

  ctx.fillStyle = '#E06385';
  ctx.font = 'bold 20px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('RESPUESTA DEL ESTUDIO (23:45 hs):', 50, 465);

  ctx.fillStyle = '#1F2937';
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.fillText('«Hola reina! Recién lo vemos...', 50, 505);
  ctx.fillText('Ya no nos queda lugar 🫠💀»', 50, 540);

  // Footer
  ctx.fillStyle = '#9CA3AF';
  ctx.font = '18px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Tipografía ilegible • Mensaje fuera de hora', 256, 620);

  const tex = new THREE.CanvasTexture(canvas);
  tex.generateMipmaps = true;
  return tex;
}

// ----------------------------------------------------------------------------
// ESCENARIOS
// ----------------------------------------------------------------------------
// 1. Escenario del Cuarto (t = 0.0 - 12.4s)
const stageBedroom = createStageBedroom();
scene.add(stageBedroom);

// Cartel Flotante 1: Burbuja 3D con texto real de mensaje
const dmBubbleTex = createDMTexture();
const dmBubbleGeo = new THREE.BoxGeometry(1.7, 0.85, 0.05);
const dmBubbleMat = new THREE.MeshStandardMaterial({
  map: dmBubbleTex,
  roughness: 0.35,
  metalness: 0.05,
});
const dmBubble3D = new THREE.Mesh(dmBubbleGeo, dmBubbleMat);
dmBubble3D.position.set(-0.65, 2.35, 1.1);
dmBubble3D.castShadow = true;
stageBedroom.add(dmBubble3D);

// Cartel Flotante 2: Flyer 3D de historia con texto real
const flyerTex = createFlyerTexture();
const flyerGeo = new THREE.BoxGeometry(1.2, 1.6, 0.05);
const flyerMat = new THREE.MeshStandardMaterial({
  map: flyerTex,
  roughness: 0.35,
  metalness: 0.05,
});
const flyerGroup = new THREE.Mesh(flyerGeo, flyerMat);
flyerGroup.position.set(1.25, 2.15, 0.65);
flyerGroup.rotation.y = -0.38;
flyerGroup.castShadow = true;
stageBedroom.add(flyerGroup);

// Personaje Casual con Smartphone apoyada firmemente en el piso (Y = 0)
const charCasual = createBedroomGirl({ hasPhone: true });
charCasual.root.scale.set(0.72, 0.72, 0.72);
charCasual.root.position.set(-0.45, 0, 0.55);
charCasual.root.rotation.y = 0.25;
stageBedroom.add(charCasual.root);

// 2. Escenario Smartphone 3D (t = 12.4 - 21.4s)
const { stage: stageSmartphone, phoneGroup, cards: cards3D } = createStageSmartphone();
phoneGroup.scale.set(0.74, 0.74, 0.74);
scene.add(stageSmartphone);

const charPhoneLeft = createStudioDancerA({ hasPhone: true });
charPhoneLeft.root.scale.set(0.68, 0.68, 0.68);
charPhoneLeft.root.position.set(-1.15, 0, 0.85); // Centrada y visible
charPhoneLeft.root.rotation.y = 0.32;
stageSmartphone.add(charPhoneLeft.root);

const charPhoneRight = createStudioDancerC({ hasPhone: true });
charPhoneRight.root.scale.set(0.68, 0.68, 0.68);
charPhoneRight.root.position.set(1.15, 0, 0.85); // Centrada y visible
charPhoneRight.root.rotation.y = -0.32;
stageSmartphone.add(charPhoneRight.root);

// 3. Escenario Estudio Real Bailapp (t = 21.4 - 25.6s)
const { stage: stageStudio, subwoofers } = createStageStudio();
scene.add(stageStudio);

const charStudioA = createStudioDancerA();
charStudioA.root.scale.set(0.75, 0.75, 0.75);
charStudioA.root.position.set(-0.65, 0, 0.85); // Encuadrada en 9:16
stageStudio.add(charStudioA.root);

const charStudioB = createStudioDancerB();
charStudioB.root.scale.set(0.75, 0.75, 0.75);
charStudioB.root.position.set(0.65, 0, 0.85); // Encuadrada en 9:16
stageStudio.add(charStudioB.root);

// 4. Escenario Podio de Celebración (t = 25.6 - 31.0s)
const stagePodium = createStagePodium();
scene.add(stagePodium);

const charPodiumCenter = createStudioDancerA();
charPodiumCenter.root.scale.set(0.64, 0.64, 0.64);
charPodiumCenter.root.position.set(0, 0.65, 0.2); // Apoyada en podio central
stagePodium.add(charPodiumCenter.root);

const charPodiumLeft = createStudioDancerB();
charPodiumLeft.root.scale.set(0.64, 0.64, 0.64);
charPodiumLeft.root.position.set(-0.95, 0.42, 0.4); // Encuadrada
charPodiumLeft.root.rotation.y = 0.30;
stagePodium.add(charPodiumLeft.root);

const charPodiumRight = createStudioDancerC();
charPodiumRight.root.scale.set(0.64, 0.64, 0.64);
charPodiumRight.root.position.set(0.95, 0.30, 0.4); // Encuadrada
charPodiumRight.root.rotation.y = -0.30;
stagePodium.add(charPodiumRight.root);

// ----------------------------------------------------------------------------
// 3. CANVAS 2D UI & OVERLAYS CON PREVENCIÓN ESTRICTA DE DESBORDES
// ----------------------------------------------------------------------------
const uiCanvas = document.getElementById('ui');
const ctx = uiCanvas.getContext('2d');

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function easeOutBack(x) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}
function lerp(a, b, t) { return a + (b - a) * t; }

function roundRect(context, x, y, width, height, radius) {
  if (context.roundRect) {
    context.beginPath();
    context.roundRect(x, y, width, height, radius);
    context.closePath();
    return;
  }
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

/**
 * Dibuja un badge / pill dinámico cuyo ancho se calcula en base al texto medido.
 * NUNCA puede desbordar.
 */
function drawDynamicBadge(context, text, x, y, bgCol, textCol, fontSize = 20) {
  context.font = `bold ${fontSize}px Inter, sans-serif`;
  const textW = context.measureText(text).width;
  const badgeW = textW + 36;
  const badgeH = fontSize + 16;

  context.fillStyle = bgCol;
  roundRect(context, x - badgeW / 2, y - badgeH / 2, badgeW, badgeH, badgeH / 2);
  context.fill();

  context.fillStyle = textCol;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, x, y);
}

/**
 * Ajusta el tamaño de la fuente para que el texto nunca sobrepase maxWidth.
 */
function drawFittedText(context, text, x, y, maxW, baseSize, weight = 'bold', color = '#1F1D2B') {
  let size = baseSize;
  context.font = `${weight} ${size}px Inter, sans-serif`;
  while (context.measureText(text).width > maxW && size > 16) {
    size -= 1;
    context.font = `${weight} ${size}px Inter, sans-serif`;
  }
  context.fillStyle = color;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, x, y);
}

function wrapWordsToLines(context, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine + ' ' + word;
    if (context.measureText(testLine).width <= maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

const subtitles = [
  { start: 0.1, end: 5.7, text: '¿Alguna vez mandaste un mensaje a una academia y te respondieron cuando ya terminó la clase?' },
  { start: 5.7, end: 12.4, text: 'Flyers ilegibles en historias destacadas, mensajes clavados en visto y llegar al estudio para que no quede lugar...' },
  { start: 12.4, end: 16.5, text: 'Buscar clases en 2026 no puede ser tan difícil. ¡Conocé Bailapp!' },
  { start: 16.5, end: 21.4, text: 'Filtrás por zona, disciplina y nivel con cupos confirmados en vivo.' },
  { start: 21.4, end: 25.6, text: '¡Reservás en 1 solo toque y vas directo a entrenar como en un videoclip!' },
  { start: 25.6, end: 31.0, text: 'Descargá Bailapp gratis en el link de la bio y volvé a disfrutar de tu danza.' },
];

// ----------------------------------------------------------------------------
// 4. BUCLE DE RENDERIZADO DETERMINISTA Y CÁMARA CINEMATOGRÁFICA DINÁMICA
// ----------------------------------------------------------------------------
window.render = async function(t) {
  const time = clamp(t, 0, window.DUR);

  // Estados de escena
  const isDMHook = time < 5.7;
  const isDMAgitation = time >= 5.7 && time < 12.4;
  const isBedroom = time < 12.4;
  const isSmartphone = time >= 12.4 && time < 21.4;
  const isStudio = time >= 21.4 && time < 25.6;
  const isPodium = time >= 25.6;

  stageBedroom.visible = isBedroom;
  stageSmartphone.visible = isSmartphone;
  stageStudio.visible = isStudio;
  stagePodium.visible = isPodium;

  // ---------------------------------------------------------
  // A. MOVIMIENTO CINEMATOGRÁFICO DE CÁMARA (TRAYECTORIA DINÁMICA)
  // ---------------------------------------------------------
  if (time < 5.7) {
    // Escena 1: Dolly in suave acercándose a la chica y su celular
    const prog = time / 5.7;
    const camX = lerp(0.8, -0.35, prog);
    const camY = lerp(3.5, 2.7, prog);
    const camZ = lerp(9.4, 7.2, prog);
    camera.position.set(camX, camY, camZ);
    camera.lookAt(-0.4, 1.25, 0.4);

    // Animación de la burbuja DM
    const bProg = clamp(time / 0.4, 0, 1);
    const bScale = easeOutBack(bProg);
    dmBubble3D.scale.set(bScale, bScale, bScale);
    dmBubble3D.position.y = 2.35 + Math.sin(time * 2.2) * 0.04;
    flyerGroup.scale.set(0, 0, 0);

    charCasual.setPose({
      armLX: -0.4, armLZ: -0.25, elbowLX: -0.85,
      armRX: -0.6, armRZ: 0.20, elbowRX: -0.95,
      headTilt: 0.18, headTurn: 0.10,
      hipsY: 0,
    });
  } else if (time >= 5.7 && time < 12.4) {
    // Escena 2: Paneo y elevación mostrando los flyers y la frustración
    const prog = (time - 5.7) / (12.4 - 5.7);
    const camX = lerp(-0.35, 0.65, prog);
    const camY = lerp(2.7, 3.2, prog);
    const camZ = lerp(7.2, 8.4, prog);
    camera.position.set(camX, camY, camZ);
    camera.lookAt(0.1, 1.35, 0.2);

    // Animación del flyer flotante con texto
    const fProg = clamp((time - 5.7) / 0.45, 0, 1);
    const fScale = easeOutBack(fProg);
    flyerGroup.scale.set(fScale, fScale, fScale);
    flyerGroup.rotation.y = -0.38 + Math.sin(time * 1.5) * 0.12;
    flyerGroup.position.y = 2.15 + Math.sin(time * 2.0) * 0.06;

    dmBubble3D.scale.set(0.9, 0.9, 0.9);
    dmBubble3D.rotation.z = Math.sin(time * 2.5) * 0.04;

    charCasual.setPose({
      hipsY: -0.04,
      torsoTilt: 0.22,
      headTilt: 0.26, headTurn: -0.12,
      armLX: -0.1, elbowLX: -0.75,
      armRX: -0.5, armRZ: 0.15, elbowRX: -1.2, // mano en la frente
    });
  } else if (time >= 12.4 && time < 21.4) {
    // Escena 3: Órbita isométrica alrededor del smartphone 3D
    const phTime = time - 12.4;
    const prog = phTime / 9.0;
    const camAngle = lerp(-0.35, 0.25, prog);
    const camRadius = 8.6;
    camera.position.set(Math.sin(camAngle) * camRadius, lerp(3.6, 3.2, prog), Math.cos(camAngle) * camRadius);
    camera.lookAt(0, 1.4, 0);

    phoneGroup.rotation.y = Math.sin(phTime * 1.0) * 0.15;
    phoneGroup.rotation.x = 0.08 + Math.cos(phTime * 0.8) * 0.03;

    cards3D.forEach((cGroup, idx) => {
      const cardDelay = 0.2 + idx * 0.25;
      const cProg = clamp((phTime - cardDelay) / 0.45, 0, 1);
      const cScale = easeOutBack(cProg);
      cGroup.scale.set(cScale, cScale, cScale);
    });

    charPhoneLeft.updateDance(phTime, 'choreo_videoclip', 0.9);
    charPhoneRight.updateDance(phTime + 0.3, 'choreo_videoclip', 0.9);
  } else if (time >= 21.4 && time < 25.6) {
    // Escena 4: Paneo dinámico bajo en el estudio de danza frente a los espejos
    const stTime = time - 21.4;
    const prog = stTime / 4.2;
    const camX = lerp(-0.7, 0.7, prog);
    const camY = lerp(2.2, 2.7, prog);
    const camZ = lerp(7.2, 7.8, prog);
    camera.position.set(camX, camY, camZ);
    camera.lookAt(0, 1.15, 0);

    charStudioA.updateDance(stTime, 'choreo_videoclip', 1.05);
    charStudioB.updateDance(stTime, 'choreo_videoclip', 1.05);

    const bassPulse = 1.0 + Math.sin(stTime * 14.0) * 0.15;
    subwoofers.forEach((cone) => {
      cone.scale.set(bassPulse, bassPulse, 1.0);
    });
  } else if (time >= 25.6) {
    // Escena 5: Grúa de elevación triunfal en el podio de celebración
    const pdTime = time - 25.6;
    const prog = pdTime / 5.4;
    const camY = lerp(2.6, 4.2, prog);
    const camZ = lerp(7.8, 8.8, prog);
    camera.position.set(Math.sin(pdTime * 0.2) * 0.4, camY, camZ);
    camera.lookAt(0, 1.35, 0);

    stagePodium.rotation.y = pdTime * 0.12;

    charPodiumCenter.updateDance(pdTime, 'celebrate_victory', 1.0);
    charPodiumLeft.updateDance(pdTime + 0.15, 'celebrate_victory', 0.95);
    charPodiumRight.updateDance(pdTime + 0.30, 'celebrate_victory', 1.05);
  }

  // Render 3D
  renderer.render(scene, camera);

  // ---------------------------------------------------------
  // B. RENDERIZADO 2D UI CON CERO DESBORDES MATEMÁTICAMENTE GARANTIZADO
  // ---------------------------------------------------------
  ctx.clearRect(0, 0, W, H);

  // 1. Barra de progreso superior
  const progressRatio = time / window.DUR;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.fillRect(40, 24, W - 80, 8);
  ctx.fillStyle = '#E06385';
  roundRect(ctx, 40, 24, (W - 80) * progressRatio, 8, 4);
  ctx.fill();

  // 2. Tarjetas Contextuales Superiores (Ancho 880px, Padding generoso)
  const cardW = 880;
  const cardH = 175;
  const cardMaxTextW = cardW - 60; // 820px seguros para texto

  if (isDMHook) {
    const hProg = clamp(time / 0.35, 0, 1);
    const scale = easeOutBack(hProg);

    ctx.save();
    ctx.translate(CX, 210);
    ctx.scale(scale, scale);

    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(224, 99, 133, 0.25)';
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 8;
    roundRect(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 28);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.strokeStyle = '#FAD2E1';
    ctx.lineWidth = 3;
    roundRect(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 28);
    ctx.stroke();

    // Badge dinámico
    drawDynamicBadge(ctx, 'EL DRAMA DE RESERVAR POR DM 🫠', 0, -56, '#E06385', '#FFFFFF', 19);

    // Textos ajustados
    drawFittedText(ctx, '¿Mandaste mensaje y no te responden?', 0, 14, cardMaxTextW, 34);
    drawFittedText(ctx, '«Hola! ¿Quedan cupos para hoy?» ...', 0, 56, cardMaxTextW, 23, '500', '#6B7280');
    ctx.restore();
  } else if (isDMAgitation) {
    const fProg = clamp((time - 5.7) / 0.35, 0, 1);
    const scale = easeOutBack(fProg);

    ctx.save();
    ctx.translate(CX, 210);
    ctx.scale(scale, scale);

    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(239, 68, 68, 0.20)';
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 8;
    roundRect(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 28);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    drawDynamicBadge(ctx, 'CLAVADA EN VISTO 💀', 0, -54, '#EF4444', '#FFFFFF', 19);
    drawFittedText(ctx, 'Flyers borrosos y sin cupos', 0, 12, cardMaxTextW, 34);
    drawFittedText(ctx, '«Hola reina, no nos queda lugar» 🤦‍♀️', 0, 52, cardMaxTextW, 23, '500', '#4B5563');
    ctx.restore();
  } else if (isSmartphone) {
    const aProg = clamp((time - 12.4) / 0.35, 0, 1);
    const scale = easeOutBack(aProg);

    ctx.save();
    ctx.translate(CX, 200);
    ctx.scale(scale, scale);

    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(224, 99, 133, 0.25)';
    ctx.shadowBlur = 30;
    roundRect(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 28);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    drawDynamicBadge(ctx, 'BUSCAR CLASES EN 2026 ✨', 0, -52, '#8B5CF6', '#FFFFFF', 19);
    drawFittedText(ctx, 'Cupos Confirmados en Vivo', 0, 12, cardMaxTextW, 34);
    drawFittedText(ctx, 'Filtrás por zona, disciplina y nivel 📍', 0, 52, cardMaxTextW, 23, 'bold', '#10B981');
    ctx.restore();
  } else if (isStudio) {
    const rProg = clamp((time - 21.4) / 0.35, 0, 1);
    const scale = easeOutBack(rProg);

    ctx.save();
    ctx.translate(CX, 210);
    ctx.scale(scale, scale);

    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(224, 99, 133, 0.28)';
    ctx.shadowBlur = 32;
    ctx.shadowOffsetY = 8;
    roundRect(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 28);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.strokeStyle = '#FAD2E1';
    ctx.lineWidth = 3;
    roundRect(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 28);
    ctx.stroke();

    drawDynamicBadge(ctx, 'RESERVÁS EN 1 TOQUE 🚀', 0, -56, '#E06385', '#FFFFFF', 19);
    drawFittedText(ctx, 'Directo al Estudio sin Esperas', 0, 14, cardMaxTextW, 36);
    drawFittedText(ctx, 'Entrenás con amigas como en un videoclip 🎬', 0, 54, cardMaxTextW, 24, 'bold', '#10B981');
    ctx.restore();
  } else if (isPodium) {
    const cProg = clamp((time - 25.6) / 0.35, 0, 1);
    const scale = easeOutBack(cProg);

    ctx.save();
    ctx.translate(CX, 210);
    ctx.scale(scale, scale);

    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(224, 99, 133, 0.35)';
    ctx.shadowBlur = 35;
    roundRect(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 30);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    drawDynamicBadge(ctx, 'VOLVÉ A DISFRUTAR DE BAILAR 🔥', 0, -55, '#E06385', '#FFFFFF', 20);
    drawFittedText(ctx, 'Descargá Bailapp Gratis', 0, 14, cardMaxTextW, 38);
    drawFittedText(ctx, 'Enlace en bio • bailapp.com.ar 👆', 0, 56, cardMaxTextW, 25, 'bold', '#E06385');
    ctx.restore();
  }

  // 3. Subtítulos Dinámicos Autoadaptables (Capa 3)
  const currentSub = subtitles.find(s => time >= s.start && time < s.end);
  if (currentSub) {
    const subProg = clamp((time - currentSub.start) / 0.25, 0, 1);

    ctx.save();
    ctx.globalAlpha = subProg;
    ctx.translate(CX, 1630);

    const maxWidth = 860;
    let fontSize = 32;
    ctx.font = `bold ${fontSize}px Inter, -apple-system, sans-serif`;

    let lines = wrapWordsToLines(ctx, currentSub.text, maxWidth);
    if (lines.length > 2) {
      fontSize = 27;
      ctx.font = `bold ${fontSize}px Inter, -apple-system, sans-serif`;
      lines = wrapWordsToLines(ctx, currentSub.text, maxWidth);
    }

    // Calcular ancho máximo real de las líneas obtenidas
    let maxLineWidth = 0;
    lines.forEach(l => {
      const w = ctx.measureText(l).width;
      if (w > maxLineWidth) maxLineWidth = w;
    });

    const lineHeight = fontSize * 1.35;
    const boxHeight = lines.length * lineHeight + 38;
    const boxWidth = Math.min(maxLineWidth + 70, 940);

    ctx.fillStyle = 'rgba(28, 25, 29, 0.88)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 6;
    roundRect(ctx, -boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 22);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.strokeStyle = 'rgba(224, 99, 133, 0.45)';
    ctx.lineWidth = 2.5;
    roundRect(ctx, -boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 22);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const startY = -(lines.length - 1) * (lineHeight / 2);
    lines.forEach((line, lIdx) => {
      const lineY = startY + lIdx * lineHeight;
      ctx.fillStyle = '#FFF8FB';
      ctx.font = `bold ${fontSize}px Inter, -apple-system, sans-serif`;
      ctx.fillText(line, 0, lineY);
    });

    ctx.restore();
  }

  // 4. Botón CTA Persistente en los últimos segundos
  if (time >= 24.0) {
    const ctaProg = clamp((time - 24.0) / 0.4, 0, 1);
    const ctaScale = easeOutBack(ctaProg);

    ctx.save();
    ctx.translate(CX, 1780);
    ctx.scale(ctaScale, ctaScale);

    ctx.fillStyle = '#E06385';
    ctx.shadowColor = 'rgba(224, 99, 133, 0.5)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 8;
    roundRect(ctx, -260, -42, 520, 84, 42);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 30px Inter, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Descargar Bailapp 📲', 0, 0);
    ctx.restore();
  }
};

// ----------------------------------------------------------------------------
// 5. CONTROLES INTERACTIVOS Y SINCRONIZACIÓN DE AUDIO
// ----------------------------------------------------------------------------
const btnPlay = document.getElementById('btn-play');
const btnRestart = document.getElementById('btn-restart');
const timeSlider = document.getElementById('time-slider');
const timeDisplay = document.getElementById('time-display');
const btnSpeed = document.getElementById('btn-speed');
const btnSound = document.getElementById('btn-sound');

let isPlaying = false;
let currentTime = 0;
let playbackSpeed = 1.0;
let soundEnabled = true;
let lastTimestamp = null;

const audioObj = new Audio('audio/mix.wav');
audioObj.preload = 'auto';

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
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
      if (audioObj && soundEnabled) {
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

if (btnSpeed) {
  const speeds = [1.0, 1.5, 2.0, 0.5];
  let sIdx = 0;
  btnSpeed.addEventListener('click', () => {
    sIdx = (sIdx + 1) % speeds.length;
    playbackSpeed = speeds[sIdx];
    btnSpeed.textContent = `${playbackSpeed}x`;
    if (audioObj) audioObj.playbackRate = playbackSpeed;
  });
}

if (btnSound) {
  btnSound.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    btnSound.textContent = soundEnabled ? '🔊 Sonido ON' : '🔇 Sonido OFF';
    if (audioObj) audioObj.muted = !soundEnabled;
  });
}

stepTime(0);
window.READY = true;
