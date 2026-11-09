import * as THREE from './three.module.js';
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
// BAILAPP — REEL LOW-POLY 3D VIRAL V2 (ENHANCED POLY CHARACTERS & MODULAR STAGES)
// ============================================================================
// Personajes: 100% 3D nativos con siluetas orgánicas facetadas (cilindros 8-10 lados,
// esferas 12x10, ojos almendrados expresivos, extremidades cónicas y zapatillas chunky).
// Escenarios: Modulares dinámicos importados desde bailapp_shared_3d/
// Cero partículas dispersas • Cero desbordes de texto • Capas estrictas
// ============================================================================

const W = 1080;
const H = 1920;
const CX = W / 2;
const CY = H / 2;
window.DUR = 24.5;

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
renderer.toneMappingExposure = 1.08;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#FFF5F8');
scene.fog = new THREE.FogExp2('#FFF5F8', 0.02);

// Cámara Isométrica Diorama
const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
camera.position.set(0, 3.8, 9.0);
camera.lookAt(0, 1.25, 0);

// Iluminación Facetada Escultórica
const hemiLight = new THREE.HemisphereLight('#FFF0F5', '#E5D0D8', 1.15);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight('#FFF9E6', 1.4);
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

// ----------------------------------------------------------------------------
// 2. CONSTRUCCIÓN Y CARGA DE ESCENARIOS MODULARES (SHARED STAGES)
// ----------------------------------------------------------------------------
// Escenario 1 & 2: Cuarto
const stageBedroom = createStageBedroom();
scene.add(stageBedroom);

// Ícono 3D de Notificación flotante de frustración (Capa 1)
const notif3D = new THREE.Group();
notif3D.position.set(-0.75, 2.55, 0.8);
const notifBgGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.06, 16);
const notifBgMat = createLowPolyMaterial('#E06385');
const notifBg = new THREE.Mesh(notifBgGeo, notifBgMat);
notifBg.rotation.x = Math.PI / 2;
notif3D.add(notifBg);

const notifDotGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.08, 12);
const notifDotMat = createLowPolyMaterial('#FFFFFF');
const notifDot = new THREE.Mesh(notifDotGeo, notifDotMat);
notifDot.position.set(0, 0, 0.04);
notifDot.rotation.x = Math.PI / 2;
notif3D.add(notifDot);
stageBedroom.add(notif3D);

// Personaje 3D en el cuarto (Enhanced-Poly)
const charBedroom = createBedroomGirl();
charBedroom.root.scale.set(0.70, 0.70, 0.70);
charBedroom.root.position.set(-0.70, 0, 0.55);
charBedroom.root.rotation.y = 0.30;
stageBedroom.add(charBedroom.root);

// Escenario 3: Estudio Profesional Bailapp
const { stage: stageStudio, subwoofers } = createStageStudio();
scene.add(stageStudio);

// Personajes 3D en el Estudio (Enhanced-Poly Dancers)
const charStudioA = createStudioDancerA();
charStudioA.root.scale.set(0.72, 0.72, 0.72);
charStudioA.root.position.set(-1.05, 0, 0.85);
stageStudio.add(charStudioA.root);

const charStudioB = createStudioDancerB();
charStudioB.root.scale.set(0.72, 0.72, 0.72);
charStudioB.root.position.set(1.05, 0, 0.85);
stageStudio.add(charStudioB.root);

// Escenario 4: Smartphone 3D App Showcase
const { stage: stageSmartphone, phoneGroup, cards: cards3D } = createStageSmartphone();
phoneGroup.scale.set(0.76, 0.76, 0.76);
scene.add(stageSmartphone);

// Personajes flanqueando el smartphone (visibles en márgenes seguros)
const charPhoneLeft = createStudioDancerA({ hasPhone: true });
charPhoneLeft.root.scale.set(0.66, 0.66, 0.66);
charPhoneLeft.root.position.set(-1.42, 0.15, 0.85);
charPhoneLeft.root.rotation.y = 0.35;
stageSmartphone.add(charPhoneLeft.root);

const charPhoneRight = createStudioDancerC({ hasPhone: true });
charPhoneRight.root.scale.set(0.66, 0.66, 0.66);
charPhoneRight.root.position.set(1.42, 0.15, 0.85);
charPhoneRight.root.rotation.y = -0.35;
stageSmartphone.add(charPhoneRight.root);

// Escenario 5: Podio de Celebración
const stagePodium = createStagePodium();
scene.add(stagePodium);

// 3 Personajes celebrando en el podio
const charPodiumCenter = createStudioDancerA();
charPodiumCenter.root.scale.set(0.62, 0.62, 0.62);
charPodiumCenter.root.position.set(0, 0.65, 0.2);
stagePodium.add(charPodiumCenter.root);

const charPodiumLeft = createStudioDancerB();
charPodiumLeft.root.scale.set(0.62, 0.62, 0.62);
charPodiumLeft.root.position.set(-1.25, 0.42, 0.4);
charPodiumLeft.root.rotation.y = 0.35;
stagePodium.add(charPodiumLeft.root);

const charPodiumRight = createStudioDancerC();
charPodiumRight.root.scale.set(0.62, 0.62, 0.62);
charPodiumRight.root.position.set(1.25, 0.30, 0.4);
charPodiumRight.root.rotation.y = -0.35;
stagePodium.add(charPodiumRight.root);

// ----------------------------------------------------------------------------
// 3. CANVAS 2D UI & OVERLAYS (CAPA 2, 3 & 4)
// ----------------------------------------------------------------------------
const uiCanvas = document.getElementById('ui');
const ctx = uiCanvas.getContext('2d');

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function easeOutBack(x) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

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
 * Función estricta para evitar desbordes de texto.
 */
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

// Subtítulos sincronizados según timestamps de subtitles.vtt
const subtitles = [
  { start: 0.1, end: 3.2, text: '¿Entrenar el trend viral en un metro cuadrado?' },
  { start: 3.2, end: 7.8, text: 'Te chocás la cama, el placard y grabás 50 tomas frustradas...' },
  { start: 7.8, end: 12.5, text: 'En un estudio real con espejos gigantes y amigas te sentís en un videoclip!' },
  { start: 12.5, end: 16.8, text: 'Encontrá los mejores estudios y disciplinas cerca tuyo en Bailapp.' },
  { start: 16.8, end: 24.5, text: 'Reservá tu clase hoy en bailapp.com.ar. Enlace en bio.' },
];

// ----------------------------------------------------------------------------
// 4. BUCLE DE RENDERIZADO DETERMINISTA (window.render(t))
// ----------------------------------------------------------------------------
window.render = async function(t) {
  const time = clamp(t, 0, window.DUR);

  // ---------------------------------------------------------
  // A. TRANSICIÓN DE ESCENARIOS 3D (Modular Low-Poly Stage Swapping)
  // ---------------------------------------------------------
  const isBedroom = time < 7.8;
  const isStudio = time >= 7.8 && time < 12.6;
  const isPhone = time >= 12.6 && time < 16.8;
  const isPodium = time >= 16.8;

  stageBedroom.visible = isBedroom;
  stageStudio.visible = isStudio;
  stageSmartphone.visible = isPhone;
  stagePodium.visible = isPodium;

  // Animación del Cuarto (t = 0.0 - 7.8s)
  if (isBedroom) {
    camera.position.set(Math.sin(time * 0.15) * 0.5, 3.8, 8.8);
    camera.lookAt(0, 1.25, 0);

    if (time < 3.2) {
      // Intento de baile frustrado en espacio reducido
      charBedroom.updateDance(time, 'frustrated_practice', 0.95);
      notif3D.scale.set(0, 0, 0);
    } else {
      // Tropiezo y frustración (t = 3.2 - 7.8s)
      const prog = clamp((time - 3.2) / 0.4, 0, 1);
      const notifScale = easeOutBack(prog);
      notif3D.scale.set(notifScale, notifScale, notifScale);
      notif3D.rotation.y = time * 1.5;

      // Postura encorvada
      charBedroom.setPose({
        hipsY: -0.10,
        torsoTilt: 0.32,
        headTilt: 0.35,
        armLX: -0.2,
        elbowLX: -0.9,
        armRX: -0.15,
        elbowRX: -0.85,
        legLX: 0.1,
        kneeLX: 0.25,
        legRX: -0.1,
        kneeRX: 0.25,
      });
      charBedroom.parts.browL.rotation.z = 0.22;
      charBedroom.parts.browR.rotation.z = -0.22;
    }
  }

  // Animación del Estudio (t = 7.8 - 12.6s)
  if (isStudio) {
    const stTime = time - 7.8;
    // Paneo suave de cámara en el estudio
    camera.position.set(Math.sin(stTime * 0.35) * 0.7, 3.6, 8.6);
    camera.lookAt(0, 1.2, 0);

    // Choreo videoclip sincronizada entre ambas bailarinas
    charStudioA.updateDance(stTime, 'choreo_videoclip', 1.0);
    charStudioB.updateDance(stTime, 'choreo_videoclip', 1.0);

    // Pulsos en los conos de subwoofers
    const bassPulse = 1.0 + Math.sin(stTime * 14.0) * 0.14;
    subwoofers.forEach((cone) => {
      cone.scale.set(bassPulse, bassPulse, 1.0);
    });
  }

  // Animación del Smartphone 3D (t = 12.6 - 16.8s)
  if (isPhone) {
    const phTime = time - 12.6;
    camera.position.set(0, 3.7, 9.2);
    camera.lookAt(0, 1.35, 0);

    // Rotación suave isometrizada del smartphone
    phoneGroup.rotation.y = Math.sin(phTime * 1.2) * 0.18;
    phoneGroup.rotation.x = 0.08 + Math.cos(phTime * 1.0) * 0.04;

    // Animación escalonada de las tarjetas en la pantalla
    cards3D.forEach((cGroup, idx) => {
      const cardDelay = 0.2 + idx * 0.25;
      const cProg = clamp((phTime - cardDelay) / 0.45, 0, 1);
      const cScale = easeOutBack(cProg);
      cGroup.scale.set(cScale, cScale, cScale);
    });

    // Bailarinas flanqueando el teléfono
    charPhoneLeft.updateDance(phTime, 'choreo_videoclip', 0.85);
    charPhoneRight.updateDance(phTime + 0.3, 'choreo_videoclip', 0.85);
  }

  // Animación del Podio Final y Celebración (t = 16.8 - 24.5s)
  if (isPodium) {
    const pdTime = time - 16.8;
    camera.position.set(Math.sin(pdTime * 0.25) * 0.5, 3.9, 8.9);
    camera.lookAt(0, 1.3, 0);

    stagePodium.rotation.y = pdTime * 0.12;

    // 3 bailarinas celebrando
    charPodiumCenter.updateDance(pdTime, 'celebrate_victory', 1.0);
    charPodiumLeft.updateDance(pdTime + 0.15, 'celebrate_victory', 0.95);
    charPodiumRight.updateDance(pdTime + 0.30, 'celebrate_victory', 1.05);
  }

  // Render 3D Three.js
  renderer.render(scene, camera);

  // ---------------------------------------------------------
  // B. RENDERIZADO 2D UI (Capa 2, 3 & 4)
  // ---------------------------------------------------------
  ctx.clearRect(0, 0, W, H);

  // 1. Barra de progreso superior
  const progressRatio = time / window.DUR;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.fillRect(40, 24, W - 80, 8);
  ctx.fillStyle = '#E06385';
  roundRect(ctx, 40, 24, (W - 80) * progressRatio, 8, 4);
  ctx.fill();

  // 2. Tarjetas de contexto según escena (Capa 2 - 100% sobre 3D)
  if (time < 3.2) {
    // Hook inicial
    const hProg = clamp(time / 0.35, 0, 1);
    const scale = easeOutBack(hProg);

    ctx.save();
    ctx.translate(CX, 210);
    ctx.scale(scale, scale);

    // Tarjeta blanca limpia
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(224, 99, 133, 0.25)';
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 8;
    roundRect(ctx, -430, -90, 860, 180, 28);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Borde acento
    ctx.strokeStyle = '#FAD2E1';
    ctx.lineWidth = 3;
    roundRect(ctx, -430, -90, 860, 180, 28);
    ctx.stroke();

    // Chip
    ctx.fillStyle = '#E06385';
    roundRect(ctx, -140, -74, 280, 36, 14);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Inter, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('EXPECTATIVA VS REALIDAD', 0, -56);

    // Texto principal
    ctx.fillStyle = '#1F1D2B';
    ctx.font = 'bold 36px Inter, -apple-system, sans-serif';
    ctx.fillText('¿Entrenar en 1 metro cuadrado?', 0, 16);

    ctx.fillStyle = '#6B7280';
    ctx.font = '500 24px Inter, -apple-system, sans-serif';
    ctx.fillText('El clásico intento viral en tu pieza...', 0, 56);
    ctx.restore();
  } else if (time >= 3.2 && time < 7.8) {
    // Tarjeta de Agitación / Frustración
    const fProg = clamp((time - 3.2) / 0.35, 0, 1);
    const scale = easeOutBack(fProg);

    ctx.save();
    ctx.translate(CX, 210);
    ctx.scale(scale, scale);

    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(239, 68, 68, 0.20)';
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 8;
    roundRect(ctx, -430, -85, 860, 170, 28);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#EF4444';
    roundRect(ctx, -130, -70, 260, 36, 14);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('50 TOMAS FRUSTRADAS 💥', 0, -52);

    ctx.fillStyle = '#1F1D2B';
    ctx.font = 'bold 34px Inter, sans-serif';
    ctx.fillText('Te chocás la cama y el placard', 0, 0);

    ctx.fillStyle = '#4B5563';
    ctx.font = '500 22px Inter, sans-serif';
    ctx.fillText('Sin espacio, sin feedback, sin energía...', 0, 42);
    ctx.restore();
  } else if (time >= 7.8 && time < 12.6) {
    // Tarjeta de Reframe (Estudio Real)
    const rProg = clamp((time - 7.8) / 0.35, 0, 1);
    const scale = easeOutBack(rProg);

    ctx.save();
    ctx.translate(CX, 210);
    ctx.scale(scale, scale);

    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(224, 99, 133, 0.28)';
    ctx.shadowBlur = 32;
    ctx.shadowOffsetY = 8;
    roundRect(ctx, -440, -90, 880, 180, 28);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.strokeStyle = '#FAD2E1';
    ctx.lineWidth = 3;
    roundRect(ctx, -440, -90, 880, 180, 28);
    ctx.stroke();

    ctx.fillStyle = '#E06385';
    roundRect(ctx, -150, -74, 300, 36, 14);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ESTUDIO REAL BAILAPP ✨', 0, -56);

    ctx.fillStyle = '#1F1D2B';
    ctx.font = 'bold 36px Inter, sans-serif';
    ctx.fillText('¡Espejos Gigantes y Pista Libre!', 0, 14);

    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillText('Bailás con amigas y te sentís en un videoclip 🎬', 0, 54);
    ctx.restore();
  } else if (time >= 12.6 && time < 16.8) {
    // Tarjeta App Solución
    const aProg = clamp((time - 12.6) / 0.35, 0, 1);
    const scale = easeOutBack(aProg);

    ctx.save();
    ctx.translate(CX, 200);
    ctx.scale(scale, scale);

    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(224, 99, 133, 0.25)';
    ctx.shadowBlur = 30;
    roundRect(ctx, -430, -80, 860, 160, 28);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#8B5CF6';
    roundRect(ctx, -140, -66, 280, 36, 14);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ENCONTRÁ TU CLASE 📍', 0, -48);

    ctx.fillStyle = '#1F1D2B';
    ctx.font = 'bold 34px Inter, sans-serif';
    ctx.fillText('Todos los estudios en una sola app', 0, 6);

    ctx.fillStyle = '#6B7280';
    ctx.font = '500 22px Inter, sans-serif';
    ctx.fillText('Filtrá por disciplina, nivel y zona', 0, 44);
    ctx.restore();
  } else if (time >= 16.8) {
    // Tarjeta Final de Conversión
    const cProg = clamp((time - 16.8) / 0.35, 0, 1);
    const scale = easeOutBack(cProg);

    ctx.save();
    ctx.translate(CX, 210);
    ctx.scale(scale, scale);

    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(224, 99, 133, 0.35)';
    ctx.shadowBlur = 35;
    roundRect(ctx, -440, -90, 880, 180, 30);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#E06385';
    roundRect(ctx, -160, -74, 320, 38, 16);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TU PRIMERA CLASE HOY 🔥', 0, -55);

    ctx.fillStyle = '#1F1D2B';
    ctx.font = 'bold 38px Inter, sans-serif';
    ctx.fillText('Reservá fácil en bailapp.com.ar', 0, 14);

    ctx.fillStyle = '#E06385';
    ctx.font = 'bold 26px Inter, sans-serif';
    ctx.fillText('Enlace directo en el perfil 👆', 0, 56);
    ctx.restore();
  }

  // 3. Subtítulos dinámicos de alta visibilidad (Capa 3)
  const currentSub = subtitles.find(s => time >= s.start && time < s.end);
  if (currentSub) {
    const subProg = clamp((time - currentSub.start) / 0.25, 0, 1);
    const subAlpha = subProg;

    ctx.save();
    ctx.globalAlpha = subAlpha;
    ctx.translate(CX, 1630);

    const maxWidth = 860;
    let fontSize = 34;
    ctx.font = `bold ${fontSize}px Inter, -apple-system, sans-serif`;

    let lines = wrapWordsToLines(ctx, currentSub.text, maxWidth);
    if (lines.length > 2) {
      fontSize = 28;
      ctx.font = `bold ${fontSize}px Inter, -apple-system, sans-serif`;
      lines = wrapWordsToLines(ctx, currentSub.text, maxWidth);
    }

    const lineHeight = fontSize * 1.35;
    const boxHeight = lines.length * lineHeight + 42;
    const boxWidth = Math.min(maxWidth + 80, 940);

    // Fondo cápsula oscura traslúcida con borde frambuesa suave
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

    // Render de texto con resaltado de palabras clave
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
  if (time >= 18.0) {
    const ctaProg = clamp((time - 18.0) / 0.4, 0, 1);
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

// Inicialización
stepTime(0);
window.READY = true;
