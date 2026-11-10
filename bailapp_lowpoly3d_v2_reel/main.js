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
// BAILAPP 3D — REEL VIRAL: "¿POR DÓNDE ARRANCAR A BAILAR?" (24.5s)
// ============================================================================
// - Rostros 100% limpios y proporciones low-poly anatómicas.
// - Pelo con volumen 3D aprobado de referencia.
// - Cero escena de teléfono: transición directa a estudio de baile real.
// - Pies apoyados en el suelo real (Y = 0.00).
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
camera.position.set(0, 3.4, 8.8);
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
// 2. ESCENARIOS PROCEDURALES MODULARES (CERO TELÉFONO)
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
function createCatalogSearchTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 260;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 240, 28);
  ctx.fill();
  ctx.strokeStyle = '#FAD2E1';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.fillStyle = '#E06385';
  ctx.beginPath();
  ctx.roundRect(30, 26, 452, 44, 14);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('¿DÓNDE APRENDER? 🗺️', 256, 56);

  ctx.fillStyle = '#1F1D2B';
  ctx.font = 'bold 34px Inter, sans-serif';
  ctx.fillText('15 Cuentas de Instagram 📱', 256, 125);
  ctx.fillStyle = '#6B7280';
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.fillText('Formularios caídos y dudas sin fin...', 256, 180);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

function createAllStylesTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 280;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#1F1D2B';
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 260, 28);
  ctx.fill();
  ctx.strokeStyle = '#10B981';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.fillStyle = '#10B981';
  ctx.font = '900 32px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TODOS LOS ESTILOS EN UN LUGAR ✨', 256, 70);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 30px Inter, sans-serif';
  ctx.fillText('Dancehall • Heels • K-Pop', 256, 130);
  ctx.fillText('Urbano • Salsa • Twerk', 256, 175);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '500 20px Inter, sans-serif';
  ctx.fillText('Filtrá por barrio y nivel en Bailapp', 256, 230);

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
  ctx.fillText('DESCUBRÍ TU PASIÓN 🩰✨', 256, 75);

  ctx.fillStyle = '#FFF5F8';
  ctx.font = 'bold 26px Inter, sans-serif';
  ctx.fillText('bailapp.com.ar • Link en bio ⚡', 256, 140);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

const signSearchGeo = new THREE.PlaneGeometry(1.9, 0.95);
const signSearchMat = new THREE.MeshBasicMaterial({ map: createCatalogSearchTexture(), transparent: true, side: THREE.DoubleSide });
const signSearchMesh = new THREE.Mesh(signSearchGeo, signSearchMat);
signSearchMesh.position.set(0.7, 2.2, 0.6);
scene.add(signSearchMesh);

const signStylesGeo = new THREE.PlaneGeometry(2.1, 1.15);
const signStylesMat = new THREE.MeshBasicMaterial({ map: createAllStylesTexture(), transparent: true, side: THREE.DoubleSide });
const signStylesMesh = new THREE.Mesh(signStylesGeo, signStylesMat);
signStylesMesh.position.set(0, 2.3, 0);
signStylesMesh.visible = false;
scene.add(signStylesMesh);

const signPodiumGeo = new THREE.PlaneGeometry(2.0, 0.85);
const signPodiumMat = new THREE.MeshBasicMaterial({ map: createPodiumBadgeTexture(), transparent: true, side: THREE.DoubleSide });
const signPodiumMesh = new THREE.Mesh(signPodiumGeo, signPodiumMat);
signPodiumMesh.position.set(0, 2.45, 0.5);
signPodiumMesh.visible = false;
scene.add(signPodiumMesh);

// ----------------------------------------------------------------------------
// 4. PERSONAJES 3D CON VOLUMEN Y APOYO EN EL SUELO
// ----------------------------------------------------------------------------
// Chica en el cuarto
const charBedroom = createBedroomGirl({ hasPhone: true });
charBedroom.root.position.set(-0.35, 0, 0.35);
scene.add(charBedroom.root);

// Bailarinas en el estudio
const charStudioA = createStudioDancerA();
charStudioA.root.position.set(-0.75, 0, 0.2);
charStudioA.root.visible = false;
scene.add(charStudioA.root);

const charStudioB = createStudioDancerB();
charStudioB.root.position.set(0.75, 0, 0.2);
charStudioB.root.visible = false;
scene.add(charStudioB.root);

// Podio final
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
  { start: 16.8, end: 24.5, line1: "Reservá tu clase hoy en bailapp.com.ar", line2: "Enlace en bio • Descubrí tu pasión 🩰" }
];

// ----------------------------------------------------------------------------
// 6. RENDER LOOP DETERMINISTA
// ----------------------------------------------------------------------------
window.render = async function(time = 0) {
  const t = clamp(time, 0, window.DUR);

  stageBedroom.visible = t < 7.8;
  signSearchMesh.visible = t < 7.8;
  charBedroom.root.visible = t < 7.8;

  stageStudio.visible = t >= 7.8 && t < 16.8;
  signStylesMesh.visible = t >= 7.8 && t < 16.8;
  charStudioA.root.visible = t >= 7.8 && t < 16.8;
  charStudioB.root.visible = t >= 7.8 && t < 16.8;

  stagePodium.visible = t >= 16.8;
  signPodiumMesh.visible = t >= 16.8;
  charPodium1.root.visible = t >= 16.8;
  charPodium2.root.visible = t >= 16.8;
  charPodium3.root.visible = t >= 16.8;

  if (t < 7.8) {
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
    signSearchMesh.position.y = 2.2 + Math.sin(t * 2.5) * 0.05;
  } else if (t < 16.8) {
    const stTime = t - 7.8;
    camera.position.set(Math.sin(stTime * 0.35) * 0.8, 3.2, 8.2);
    camera.lookAt(0, 1.25, 0);

    charStudioA.updateDance(stTime, 'choreo_videoclip', 1.0);
    charStudioB.updateDance(stTime + 0.15, 'choreo_videoclip', 1.0);

    if (subwoofers) {
      const bassPulse = 1.0 + Math.sin(stTime * 14.0) * 0.12;
      subwoofers.forEach((cone) => cone.scale.set(bassPulse, bassPulse, 1.0));
    }

    signStylesMesh.position.y = 2.3 + Math.sin(stTime * 2.0) * 0.05;
  } else {
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

  // Render 2D UI
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
    drawBadge(ctx, '¿DÓNDE APRENDER A BAILAR? 🗺️📱', CX, 85, { bg: '#374151' });
  } else if (t < 16.8) {
    drawBadge(ctx, 'TODOS LOS RITMOS EN UN SOLO LUGAR ✨', CX, 85, { bg: '#E06385' });
  } else {
    drawBadge(ctx, 'RESERVÁ HOY EN BAILAPP ⚡💃', CX, 85, { bg: '#10B981' });
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
