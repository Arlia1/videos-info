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
// BAILAPP 3D — REEL VIRAL: "CUANDO ENCONTRÁS TU CREW DE BAILE" (24.5s)
// ============================================================================

const W = 1080;
const H = 1920;
const CX = W / 2;
const CY = H / 2;
window.DUR = 24.5;

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
camera.position.set(0, 3.2, 8.4);
camera.lookAt(0, 1.25, 0);

// Lighting
const hemiLight = new THREE.HemisphereLight('#FFF0F5', '#E5D0D8', 1.2);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight('#FFF9E6', 1.45);
dirLight.position.set(5, 12, 8);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.bias = -0.0004;
scene.add(dirLight);

const rimLight = new THREE.DirectionalLight('#FAD2E1', 0.85);
rimLight.position.set(-6, 6, -4);
scene.add(rimLight);

// ----------------------------------------------------------------------------
// 2. ESCENARIOS PROCEDURALES MODULARES (CERO ESCENA DE TELÉFONO)
// ----------------------------------------------------------------------------
const stageBedroom = createStageBedroom();
scene.add(stageBedroom);

const studioObj = createStageStudio();
const stageStudio = studioObj.stage;
const subwoofers = studioObj.subwoofers;
stageStudio.visible = false;
scene.add(stageStudio);

const stagePodium = createStagePodium();
stagePodium.visible = false;
scene.add(stagePodium);

// ----------------------------------------------------------------------------
// 3. CARTELES FLOTANTES 3D CON TEXTO REAL Y NÍTIDO
// ----------------------------------------------------------------------------
function createFrustrationTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 236, 28);
  ctx.fill();
  ctx.strokeStyle = '#EF4444';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.roundRect(30, 26, 452, 44, 14);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ESPACIO REDUCIDO 🤦‍♀️', 256, 56);

  ctx.fillStyle = '#1F1D2B';
  ctx.font = 'bold 36px Inter, sans-serif';
  ctx.fillText('Toma 48 rechazada 🗑️', 256, 125);
  ctx.fillStyle = '#6B7280';
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.fillText('"Me choqué la cama otra vez"', 256, 175);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

function createStudioCrewTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 280;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#1F1D2B';
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 260, 28);
  ctx.fill();
  ctx.strokeStyle = '#E06385';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.fillStyle = '#E06385';
  ctx.font = '900 48px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ESTUDIO REAL ✨', 256, 80);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 28px Inter, sans-serif';
  ctx.fillText('COMO EN UN VIDEOCLIP 🪩', 256, 140);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '500 22px Inter, sans-serif';
  ctx.fillText('Reggaetón • Heels • K-Pop • Twerk', 256, 200);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

function createPodiumBadgeTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 220;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#E06385';
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 200, 28);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 40px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TU CREW TE ESPERA 👯‍♀️', 256, 75);

  ctx.fillStyle = '#FFF5F8';
  ctx.font = 'bold 26px Inter, sans-serif';
  ctx.fillText('bailapp.com.ar • Link en bio ⚡', 256, 140);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

const signFrustGeo = new THREE.PlaneGeometry(1.9, 0.95);
const signFrustMat = new THREE.MeshBasicMaterial({ map: createFrustrationTexture(), transparent: true, side: THREE.DoubleSide });
const signFrustMesh = new THREE.Mesh(signFrustGeo, signFrustMat);
signFrustMesh.position.set(0.7, 2.2, 0.6);
scene.add(signFrustMesh);

const signCrewGeo = new THREE.PlaneGeometry(2.1, 1.15);
const signCrewMat = new THREE.MeshBasicMaterial({ map: createStudioCrewTexture(), transparent: true, side: THREE.DoubleSide });
const signCrewMesh = new THREE.Mesh(signCrewGeo, signCrewMat);
signCrewMesh.position.set(0, 2.3, 0);
signCrewMesh.visible = false;
scene.add(signCrewMesh);

const signPodiumGeo = new THREE.PlaneGeometry(2.0, 0.85);
const signPodiumMat = new THREE.MeshBasicMaterial({ map: createPodiumBadgeTexture(), transparent: true, side: THREE.DoubleSide });
const signPodiumMesh = new THREE.Mesh(signPodiumGeo, signPodiumMat);
signPodiumMesh.position.set(0, 2.45, 0.5);
signPodiumMesh.visible = false;
scene.add(signPodiumMesh);

// ----------------------------------------------------------------------------
// 4. PERSONAJES 3D CON VOLUMEN Y APOYO EXACTO EN EL SUELO
// ----------------------------------------------------------------------------
// Personaje 1: Chica en el cuarto
const charBedroom = createBedroomGirl();
charBedroom.root.position.set(-0.35, 0, 0.35);
scene.add(charBedroom.root);

// Personajes 2, 3 y 4: Las 3 bailarinas del estudio (Crew)
const charCrewA = createStudioDancerA();
charCrewA.root.position.set(-0.85, 0, 0.2);
charCrewA.root.visible = false;
scene.add(charCrewA.root);

const charCrewB = createStudioDancerB();
charCrewB.root.position.set(0.85, 0, 0.2);
charCrewB.root.visible = false;
scene.add(charCrewB.root);

const charCrewC = createStudioDancerC();
charCrewC.root.position.set(0, 0, -0.3);
charCrewC.root.visible = false;
scene.add(charCrewC.root);

// Personajes en el podio (alturas exactas: 0.65m, 0.42m, 0.30m)
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
// 5. CANVAS 2D UI & SUBTÍTULOS
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
  { start: 0.1, end: 3.2, line1: "¿Entrenar el trend viral en un metro cuadrado?", line2: "Sin espacio y chocándote todo 🤦‍♀️" },
  { start: 3.2, end: 7.8, line1: "Te chocás la cama, el placard", line2: "y grabás 50 tomas frustradas..." },
  { start: 7.8, end: 12.5, line1: "En un estudio real con espejos gigantes y amigas", line2: "¡te sentís en un videoclip! 🪩✨" },
  { start: 12.5, end: 16.8, line1: "Encontrá los mejores estudios y disciplinas", line2: "cerca tuyo en Bailapp." },
  { start: 16.8, end: 24.5, line1: "Reservá tu clase hoy en bailapp.com.ar", line2: "Enlace en bio • Tu crew te espera 👯‍♀️" }
];

// ----------------------------------------------------------------------------
// 6. RENDER LOOP DETERMINISTA
// ----------------------------------------------------------------------------
window.render = async function(time = 0) {
  const t = clamp(time, 0, window.DUR);

  // Escenario 1: Cuarto frustrante (0 a 7.8s)
  stageBedroom.visible = t < 7.8;
  signFrustMesh.visible = t < 7.8;
  charBedroom.root.visible = t < 7.8;

  // Escenario 2: Estudio real con crew (7.8 a 16.8s) -> NUNCA SMARTPHONE SOLO
  stageStudio.visible = t >= 7.8 && t < 16.8;
  signCrewMesh.visible = t >= 7.8 && t < 16.8;
  charCrewA.root.visible = t >= 7.8 && t < 16.8;
  charCrewB.root.visible = t >= 7.8 && t < 16.8;
  charCrewC.root.visible = t >= 7.8 && t < 16.8;

  // Escenario 3: Podio celebración final (16.8 a 24.5s)
  stagePodium.visible = t >= 16.8;
  signPodiumMesh.visible = t >= 16.8;
  charPodium1.root.visible = t >= 16.8;
  charPodium2.root.visible = t >= 16.8;
  charPodium3.root.visible = t >= 16.8;

  // Animaciones por Fase
  if (t < 7.8) {
    // Fase Cuarto
    camera.position.set(Math.sin(t * 0.25) * 0.4, 2.9, 8.0);
    camera.lookAt(0, 1.25, 0);

    if (t < 3.2) {
      charBedroom.updateDance(t, 'frustrated_practice', 0.95);
    } else {
      charBedroom.setPose({
        hipsY: -0.10,
        torsoTilt: 0.30,
        headTilt: 0.35,
        armLX: -0.2, elbowLX: -0.85,
        armRX: -0.15, elbowRX: -0.85,
        legLX: 0.1, kneeLX: 0.25,
        legRX: -0.1, kneeRX: 0.25,
      });
      if (charBedroom.parts.browL && charBedroom.parts.browR) {
        charBedroom.parts.browL.rotation.z = 0.22;
        charBedroom.parts.browR.rotation.z = -0.22;
      }
    }
    signFrustMesh.position.y = 2.2 + Math.sin(t * 2.5) * 0.05;
  } else if (t < 16.8) {
    // Fase Estudio Crew
    const stTime = t - 7.8;
    camera.position.set(Math.sin(stTime * 0.35) * 0.8, 3.2, 8.2);
    camera.lookAt(0, 1.25, 0);

    charCrewA.updateDance(stTime, 'choreo_videoclip', 1.0);
    charCrewB.updateDance(stTime + 0.12, 'choreo_videoclip', 1.0);
    charCrewC.updateDance(stTime + 0.25, 'choreo_videoclip', 1.0);

    // Conos de subwoofers vibrando con el drop
    const bassPulse = 1.0 + Math.sin(stTime * 14.0) * 0.12;
    if (subwoofers) {
      subwoofers.forEach((cone) => cone.scale.set(bassPulse, bassPulse, 1.0));
    }

    signCrewMesh.position.y = 2.3 + Math.sin(stTime * 2.0) * 0.05;
  } else {
    // Fase Podio Celebración
    const pdTime = t - 16.8;
    camera.position.set(Math.sin(pdTime * 0.3) * 0.5, 3.6, 8.6);
    camera.lookAt(0, 1.35, 0);

    stagePodium.rotation.y = pdTime * 0.15;

    charPodium1.updateDance(pdTime, 'celebrate_victory', 1.0);
    charPodium2.updateDance(pdTime + 0.15, 'celebrate_victory', 0.95);
    charPodium3.updateDance(pdTime + 0.30, 'celebrate_victory', 1.05);

    signPodiumMesh.position.y = 2.45 + Math.sin(pdTime * 2.5) * 0.05;
  }

  // Render 3D
  renderer.render(scene, camera);

  // Render 2D UI Overlay
  ctx.clearRect(0, 0, W, H);

  // Barra de progreso
  const progressRatio = t / window.DUR;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.fillRect(40, 24, W - 80, 8);
  ctx.fillStyle = '#E06385';
  roundRect(ctx, 40, 24, (W - 80) * progressRatio, 8, 4);
  ctx.fill();

  // Header dinámico
  if (t < 7.8) {
    drawBadge(ctx, 'LA PIEZA NO ES UN SALÓN 🚫🛏️', CX, 85, { bg: '#EF4444' });
  } else if (t < 16.8) {
    drawBadge(ctx, 'TU CREW DE BAILE TE ESPERA 👯‍♀️🪩', CX, 85, { bg: '#E06385' });
  } else {
    drawBadge(ctx, 'SUMATE A LA COMUNIDAD ✨📱', CX, 85, { bg: '#10B981' });
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

  // Footer CTA constante
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
