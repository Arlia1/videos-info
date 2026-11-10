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
import { createStagePodium } from './shared/stages/stage_podium.js';

// ============================================================================
// BAILAPP — REEL LOW-POLY 3D VIRAL: "EL DRAMA DEL DM VS BAILAPP" (31s)
// ============================================================================
// - Rostros 100% limpios y luminosos.
// - Pelo con volumen 3D y raya al medio en V invertida según referencia.
// - Cero escena de smartphone gigante: transición directa a estudio de danza.
// - Carteles flotantes 3D con texto nítido.
// - Personajes con pies firmemente apoyados en el piso real (Y = 0.00).
// ============================================================================

const W = 1080;
const H = 1920;
const CX = W / 2;
const CY = H / 2;
window.DUR = 31.0;

// 1. WebGL Renderer
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

// Camera
const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
camera.position.set(0.8, 3.4, 9.2);
camera.lookAt(0, 1.25, 0);

// Lighting
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
// 2. TEXTURAS PARA CARTELES FLOTANTES 3D
// ----------------------------------------------------------------------------
function createDMTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(10, 10, 620, 300, 28);
  ctx.fill();

  ctx.strokeStyle = '#FAD2E1';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.fillStyle = '#E06385';
  ctx.beginPath();
  ctx.roundRect(30, 28, 220, 38, 14);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 20px Inter, sans-serif';
  ctx.fillText('INSTAGRAM DM • 19:02', 45, 54);

  ctx.fillStyle = '#1F2937';
  ctx.font = 'bold 30px Inter, sans-serif';
  ctx.fillText('«Hola! ¿Quedan cupos para hoy?»', 35, 120);

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

  ctx.fillStyle = '#2D242E';
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 660, 24);
  ctx.fill();

  ctx.strokeStyle = '#EF4444';
  ctx.lineWidth = 8;
  ctx.stroke();

  ctx.fillStyle = '#F8C8DC';
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('★ ACADEMIA DE DANZA ★', 256, 65);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 42px Inter, sans-serif';
  ctx.fillText('URBANO & HEELS', 256, 135);

  ctx.fillStyle = '#D1D5DB';
  ctx.font = '24px Inter, sans-serif';
  ctx.fillText('Jueves 19:30 hs • Sala Principal', 256, 185);

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

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '18px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Tipografía ilegible • Mensaje fuera de hora', 256, 620);

  const tex = new THREE.CanvasTexture(canvas);
  tex.generateMipmaps = true;
  return tex;
}

function createInstantBookingTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1F1D2B';
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 280, 28);
  ctx.fill();

  ctx.strokeStyle = '#10B981';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.fillStyle = '#10B981';
  ctx.font = '900 32px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚡ RESERVA EN 10 SEGUNDOS', 256, 65);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 34px Inter, sans-serif';
  ctx.fillText('CUPO CONFIRMADO AL TOQUE', 256, 125);

  ctx.fillStyle = '#FAD2E1';
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.fillText('Pase digital QR en tu celu 🎟️', 256, 180);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '500 20px Inter, sans-serif';
  ctx.fillText('Sin DMs • Sin esperas • Sin drama', 256, 235);

  const tex = new THREE.CanvasTexture(canvas);
  tex.generateMipmaps = true;
  return tex;
}

// ----------------------------------------------------------------------------
// 3. ESCENARIOS PROCEDURALES MODULARES (CERO TELÉFONO EN ESCENA 2)
// ----------------------------------------------------------------------------
// 1. Escenario del Cuarto
const stageBedroom = createStageBedroom();
scene.add(stageBedroom);

const dmBubbleGeo = new THREE.BoxGeometry(1.7, 0.85, 0.05);
const dmBubbleMat = new THREE.MeshStandardMaterial({ map: createDMTexture(), roughness: 0.35, metalness: 0.05 });
const dmBubble3D = new THREE.Mesh(dmBubbleGeo, dmBubbleMat);
dmBubble3D.position.set(-0.65, 2.35, 1.1);
dmBubble3D.castShadow = true;
stageBedroom.add(dmBubble3D);

const flyerGeo = new THREE.BoxGeometry(1.2, 1.6, 0.05);
const flyerMat = new THREE.MeshStandardMaterial({ map: createFlyerTexture(), roughness: 0.35, metalness: 0.05 });
const flyerGroup = new THREE.Mesh(flyerGeo, flyerMat);
flyerGroup.position.set(1.25, 2.15, 0.65);
flyerGroup.rotation.y = -0.38;
flyerGroup.castShadow = true;
stageBedroom.add(flyerGroup);

const charCasual = createBedroomGirl({ hasPhone: true });
charCasual.root.scale.set(0.72, 0.72, 0.72);
charCasual.root.position.set(-0.45, 0, 0.55);
charCasual.root.rotation.y = 0.25;
stageBedroom.add(charCasual.root);

// 2. Escenario del Estudio de Danza (Reemplaza al smartphone gigante)
const studioObj = createStageStudio();
const stageStudio = studioObj.stage;
const subwoofers = studioObj.subwoofers;
stageStudio.visible = false;
scene.add(stageStudio);

const instantSignGeo = new THREE.PlaneGeometry(2.1, 1.25);
const instantSignMat = new THREE.MeshBasicMaterial({ map: createInstantBookingTexture(), transparent: true, side: THREE.DoubleSide });
const instantSignMesh = new THREE.Mesh(instantSignGeo, instantSignMat);
instantSignMesh.position.set(0, 2.35, 0);
instantSignMesh.visible = false;
scene.add(instantSignMesh);

const charStudioA = createStudioDancerA();
charStudioA.root.position.set(-0.75, 0, 0.2);
charStudioA.root.visible = false;
scene.add(charStudioA.root);

const charStudioB = createStudioDancerB();
charStudioB.root.position.set(0.75, 0, 0.2);
charStudioB.root.visible = false;
scene.add(charStudioB.root);

// 3. Escenario del Podio de Celebración
const stagePodium = createStagePodium();
stagePodium.visible = false;
scene.add(stagePodium);

const charPodium1 = createStudioDancerA();
charPodium1.root.position.set(0, 0.65, 0.2);
charPodium1.root.visible = false;
scene.add(charPodium1.root);

const charPodium2 = createStudioDancerB();
charPodium2.root.position.set(-1.25, 0.42, 0.4);
charPodium2.root.visible = false;
scene.add(charPodium2.root);

const charPodium3 = createStudioDancerC();
charPodium3.root.position.set(1.25, 0.30, 0.4);
charPodium3.root.visible = false;
scene.add(charPodium3.root);

// ----------------------------------------------------------------------------
// 4. CANVAS 2D UI & OVERLAYS
// ----------------------------------------------------------------------------
const uiCanvas = document.getElementById('ui');
const ctx = uiCanvas.getContext('2d');

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function easeOutBack(x) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
  c.closePath();
}

function drawBadge(c, text, cx, cy, options = {}) {
  const bg = options.bg || '#E06385';
  const fg = options.fg || '#FFFFFF';
  const font = options.font || 'bold 22px Inter, sans-serif';
  c.save();
  c.font = font;
  const tw = c.measureText(text).width;
  const pw = tw + 36;
  const ph = 38;
  c.fillStyle = bg;
  roundRect(c, cx - pw / 2, cy - ph / 2, pw, ph, 14);
  c.fill();
  c.fillStyle = fg;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText(text, cx, cy);
  c.restore();
}

function drawFittedText(c, text, cx, cy, maxW, baseFontSize, color, weight = 'bold') {
  c.save();
  c.fillStyle = color;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  let size = baseFontSize;
  c.font = `${weight} ${size}px Inter, sans-serif`;
  while (c.measureText(text).width > maxW && size > 16) {
    size -= 1;
    c.font = `${weight} ${size}px Inter, sans-serif`;
  }
  c.fillText(text, cx, cy);
  c.restore();
}

const subtitles = [
  { start: 0.1, end: 5.7, line1: "¿Alguna vez mandaste mensaje a una academia", line2: "y te respondieron cuando la clase ya había terminado? 💀" },
  { start: 5.7, end: 12.4, line1: "Flyers ilegibles en historias destacadas,", line2: "mensajes clavados en visto y llegar al estudio sin lugar." },
  { start: 12.4, end: 16.5, line1: "Buscar clases de danza en 2026", line2: "no puede ser tan difícil." },
  { start: 16.5, end: 21.4, line1: "Con Bailapp filtrás por zona, disciplina y nivel", line2: "con cupos confirmados en vivo ✨" },
  { start: 21.4, end: 25.6, line1: "Reservás en 10 segundos", line2: "y vas directo a entrenar como en un videoclip 🪩🔥" },
  { start: 25.6, end: 31.0, line1: "Descargá Bailapp gratis en el link de bio", line2: "y volvé a disfrutar de tu danza 👯‍♀️" }
];

// ----------------------------------------------------------------------------
// 5. RENDER LOOP DETERMINISTA (window.render(t))
// ----------------------------------------------------------------------------
window.render = async function(time = 0) {
  const t = clamp(time, 0, window.DUR);

  // Control de escenarios:
  // t < 12.4s: Cuarto con los carteles 3D de DM
  // 12.4s <= t < 25.6s: Estudio real de baile con las 2 bailarinas
  // t >= 25.6s: Podio de celebración
  stageBedroom.visible = t < 12.4;
  stageStudio.visible = t >= 12.4 && t < 25.6;
  instantSignMesh.visible = t >= 12.4 && t < 21.4;
  charStudioA.root.visible = t >= 12.4 && t < 25.6;
  charStudioB.root.visible = t >= 12.4 && t < 25.6;

  stagePodium.visible = t >= 25.6;
  charPodium1.root.visible = t >= 25.6;
  charPodium2.root.visible = t >= 25.6;
  charPodium3.root.visible = t >= 25.6;

  if (t < 12.4) {
    // Cámara en el cuarto
    camera.position.set(0.8 + Math.sin(t * 0.2) * 0.3, 3.4, 9.2);
    camera.lookAt(0, 1.25, 0);

    // Animación de frustración y espera
    charCasual.updateDance(t, 'frustrated_practice', 0.85);

    // Animación flotante de carteles
    dmBubble3D.position.y = 2.35 + Math.sin(t * 2.2) * 0.05;
    flyerGroup.position.y = 2.15 + Math.cos(t * 1.8) * 0.05;
  } else if (t < 25.6) {
    // Cámara en el estudio
    const stTime = t - 12.4;
    camera.position.set(Math.sin(stTime * 0.35) * 0.7, 3.2, 8.4);
    camera.lookAt(0, 1.25, 0);

    charStudioA.updateDance(stTime, 'choreo_videoclip', 1.0);
    charStudioB.updateDance(stTime + 0.15, 'choreo_videoclip', 1.0);

    if (subwoofers) {
      const bassPulse = 1.0 + Math.sin(stTime * 14.0) * 0.12;
      subwoofers.forEach((cone) => cone.scale.set(bassPulse, bassPulse, 1.0));
    }

    instantSignMesh.position.y = 2.35 + Math.sin(stTime * 2.0) * 0.05;
  } else {
    // Podio
    const pdTime = t - 25.6;
    camera.position.set(Math.sin(pdTime * 0.3) * 0.5, 3.6, 8.6);
    camera.lookAt(0, 1.35, 0);

    stagePodium.rotation.y = pdTime * 0.15;

    charPodium1.updateDance(pdTime, 'celebrate_victory', 1.0);
    charPodium2.updateDance(pdTime + 0.15, 'celebrate_victory', 0.95);
    charPodium3.updateDance(pdTime + 0.30, 'celebrate_victory', 1.05);
  }

  // Render 3D
  renderer.render(scene, camera);

  // Render 2D UI
  ctx.clearRect(0, 0, W, H);

  // Barra de progreso
  const progressRatio = t / window.DUR;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.fillRect(40, 24, W - 80, 8);
  ctx.fillStyle = '#E06385';
  roundRect(ctx, 40, 24, (W - 80) * progressRatio, 8, 4);
  ctx.fill();

  // Badge superior dinámico
  if (t < 12.4) {
    drawBadge(ctx, 'EL DRAMA DE LOS DMs 📱💀', CX, 85, { bg: '#EF4444' });
  } else if (t < 25.6) {
    drawBadge(ctx, 'RESERVA EN 10 SEGUNDOS ⚡🎟️', CX, 85, { bg: '#10B981' });
  } else {
    drawBadge(ctx, 'VOLVÉ A DISFRUTAR TU DANZA ✨🪩', CX, 85, { bg: '#E06385' });
  }

  // Subtítulos
  for (const s of subtitles) {
    if (t >= s.start && t < s.end) {
      const cy = 1420;
      const boxW = 960;
      const boxH = s.line2 ? 140 : 90;

      ctx.save();
      ctx.fillStyle = 'rgba(25, 20, 28, 0.88)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
      ctx.shadowBlur = 24;
      roundRect(ctx, CX - boxW / 2, cy - boxH / 2, boxW, boxH, 24);
      ctx.fill();
      ctx.shadowColor = 'transparent';

      ctx.strokeStyle = '#FAD2E1';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      if (s.line2) {
        drawFittedText(ctx, s.line1, CX, cy - 25, boxW - 60, 34, '#FFFFFF');
        drawFittedText(ctx, s.line2, CX, cy + 25, boxW - 60, 34, '#FAD2E1');
      } else {
        drawFittedText(ctx, s.line1, CX, cy, boxW - 60, 36, '#FFFFFF');
      }
      ctx.restore();
      break;
    }
  }

  // Footer CTA
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  roundRect(ctx, CX - 260, 1800, 520, 58, 29);
  ctx.fill();
  ctx.strokeStyle = '#FAD2E1';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#E06385';
  ctx.font = 'bold 22px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('bailapp.com.ar • Link en bio ⚡', CX, 1829);
  ctx.restore();
};

window.READY = true;
