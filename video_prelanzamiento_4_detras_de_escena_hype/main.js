import * as THREE from './shared/three.module.js';
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
// BAILAPP — PRE-LANZAMIENTO 4: EL DETRÁS DE ESCENA (6 MESES DE CÓDIGO) (31.5s)
// ============================================================================

const W = 1080;
const H = 1920;
const CX = W / 2;
const CY = H / 2;
window.DUR = 31.5;

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
// 2. ESCENARIOS PROCEDURALES MODULARES
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
// 3. CARTELES FLOTANTES 3D
// ----------------------------------------------------------------------------
function createCodingBuildTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 280;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#1F1D2B';
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 260, 28);
  ctx.fill();
  ctx.strokeStyle = '#8B5CF6';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.fillStyle = '#8B5CF6';
  ctx.beginPath();
  ctx.roundRect(30, 24, 452, 44, 14);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BUILDING IN PUBLIC • ARGENTINA 💻🇦🇷', 256, 54);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 30px Inter, sans-serif';
  ctx.fillText('6 MESES DE CÓDIGO EN SECRETO', 256, 120);
  ctx.fillStyle = '#C4B5FD';
  ctx.font = 'bold 22px Inter, sans-serif';
  ctx.fillText('Mapeando academias en tiempo real 🗺️', 256, 170);
  ctx.fillText('Para que reserves en 1 toque ✨', 256, 215);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

function createAllStylesHypeTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 260;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#1F1D2B';
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 240, 28);
  ctx.fill();
  ctx.strokeStyle = '#10B981';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.fillStyle = '#10B981';
  ctx.font = '900 32px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FALTAN POCOS DÍAS ⏳✨', 256, 68);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 28px Inter, sans-serif';
  ctx.fillText('Heels • K-Pop • Twerk • Reggaetón', 256, 128);

  ctx.fillStyle = '#FAD2E1';
  ctx.font = 'bold 22px Inter, sans-serif';
  ctx.fillText('Todo en tu celu estés donde estés 🎟️', 256, 185);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

function createAccountLinkCTA() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 240;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#E06385';
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 220, 28);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 36px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CREÁ TU CUENTA HOY 🎟️', 256, 75);

  ctx.fillStyle = '#FFF5F8';
  ctx.font = 'bold 26px Inter, sans-serif';
  ctx.fillText('bailapp.com.ar • Link en bio ⚡', 256, 128);
  ctx.fillText('Asegurá tu lugar antes del estreno 🪩', 256, 175);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

const signCodeGeo = new THREE.PlaneGeometry(2.1, 1.15);
const signCodeMat = new THREE.MeshBasicMaterial({ map: createCodingBuildTexture(), transparent: true, side: THREE.DoubleSide });
const signCodeMesh = new THREE.Mesh(signCodeGeo, signCodeMat);
signCodeMesh.position.set(0.7, 2.25, 0.6);
scene.add(signCodeMesh);

const signHypeGeo = new THREE.PlaneGeometry(2.1, 1.15);
const signHypeMat = new THREE.MeshBasicMaterial({ map: createAllStylesHypeTexture(), transparent: true, side: THREE.DoubleSide });
const signHypeMesh = new THREE.Mesh(signHypeGeo, signHypeMat);
signHypeMesh.position.set(0, 2.3, 0);
signHypeMesh.visible = false;
scene.add(signHypeMesh);

const signCTALinkGeo = new THREE.PlaneGeometry(2.0, 0.95);
const signCTALinkMat = new THREE.MeshBasicMaterial({ map: createAccountLinkCTA(), transparent: true, side: THREE.DoubleSide });
const signCTALinkMesh = new THREE.Mesh(signCTALinkGeo, signCTALinkMat);
signCTALinkMesh.position.set(0, 2.45, 0.5);
signCTALinkMesh.visible = false;
scene.add(signCTALinkMesh);

// ----------------------------------------------------------------------------
// 4. PERSONAJES 3D
// ----------------------------------------------------------------------------
const charCasual = createBedroomGirl({ hasPhone: true });
charCasual.root.position.set(-0.35, 0, 0.35);
scene.add(charCasual.root);

const charStudioA = createStudioDancerA();
charStudioA.root.position.set(-0.75, 0, 0.2);
charStudioA.root.visible = false;
scene.add(charStudioA.root);

const charStudioB = createStudioDancerB();
charStudioB.root.position.set(0.75, 0, 0.2);
charStudioB.root.visible = false;
scene.add(charStudioB.root);

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
  { start: 0.1, end: 4.5, line1: "Estuvimos 6 meses programando esto en secreto", line2: "para que nunca más tengas que rogar por un cupo 💻✨" },
  { start: 4.5, end: 12.0, line1: "Mapeamos las mejores academias del país", line2: "e integramos horarios en vivo para simplificarlo todo." },
  { start: 12.0, end: 21.5, line1: "En pocos días vas a reservar Heels, K-Pop, Twerk", line2: "y Reggaetón en 10 segundos estés donde estés 🪩🔥" },
  { start: 21.5, end: 31.5, line1: "Andá creando tu cuenta gratis en el link de bio", line2: "en bailapp.com.ar para tenerla lista 📱⚡" }
];

// ----------------------------------------------------------------------------
// 6. RENDER LOOP
// ----------------------------------------------------------------------------
window.render = async function(time = 0) {
  const t = clamp(time, 0, window.DUR);

  stageBedroom.visible = t < 12.0;
  signCodeMesh.visible = t < 12.0;
  charCasual.root.visible = t < 12.0;

  stageStudio.visible = t >= 12.0 && t < 21.5;
  signHypeMesh.visible = t >= 12.0 && t < 21.5;
  charStudioA.root.visible = t >= 12.0 && t < 21.5;
  charStudioB.root.visible = t >= 12.0 && t < 21.5;

  stagePodium.visible = t >= 21.5;
  signCTALinkMesh.visible = t >= 21.5;
  charPodium1.root.visible = t >= 21.5;
  charPodium2.root.visible = t >= 21.5;
  charPodium3.root.visible = t >= 21.5;

  if (t < 12.0) {
    camera.position.set(Math.sin(t * 0.2) * 0.4, 2.9, 8.0);
    camera.lookAt(0, 1.25, 0);
    charCasual.updateDance(t, 'frustrated_practice', 0.85);
    signCodeMesh.position.y = 2.25 + Math.sin(t * 2.2) * 0.05;
  } else if (t < 21.5) {
    const stTime = t - 12.0;
    camera.position.set(Math.sin(stTime * 0.35) * 0.8, 3.2, 8.2);
    camera.lookAt(0, 1.25, 0);

    charStudioA.updateDance(stTime, 'choreo_videoclip', 1.0);
    charStudioB.updateDance(stTime + 0.15, 'choreo_videoclip', 1.0);

    if (subwoofers) {
      const bassPulse = 1.0 + Math.sin(stTime * 14.0) * 0.12;
      subwoofers.forEach((cone) => cone.scale.set(bassPulse, bassPulse, 1.0));
    }
    signHypeMesh.position.y = 2.3 + Math.sin(stTime * 2.0) * 0.05;
  } else {
    const pdTime = t - 21.5;
    camera.position.set(Math.sin(pdTime * 0.3) * 0.5, 3.6, 8.6);
    camera.lookAt(0, 1.35, 0);

    stagePodium.rotation.y = pdTime * 0.15;
    charPodium1.updateDance(pdTime, 'celebrate_victory', 1.0);
    charPodium2.updateDance(pdTime + 0.15, 'celebrate_victory', 0.95);
    charPodium3.updateDance(pdTime + 0.30, 'celebrate_victory', 1.05);

    signCTALinkMesh.position.y = 2.45 + Math.sin(pdTime * 2.5) * 0.05;
  }

  renderer.render(scene, camera);

  // 2D UI
  ctx.clearRect(0, 0, W, H);

  // Progress Bar
  const progressRatio = t / window.DUR;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.fillRect(40, 24, W - 80, 8);
  ctx.fillStyle = '#E06385';
  roundRect(ctx, 40, 24, (W - 80) * progressRatio, 8, 4);
  ctx.fill();

  // Header dinámico
  if (t < 12.0) {
    drawBadge(ctx, 'DETRÁS DE ESCENA • 6 MESES 💻✨', CX, 85, { bg: '#8B5CF6' });
  } else if (t < 21.5) {
    drawBadge(ctx, 'SE VIENE EL ESTRENO 🪩🇦🇷', CX, 85, { bg: '#E06385' });
  } else {
    drawBadge(ctx, 'ANDÁ CREANDO TU CUENTA 🎟️📱', CX, 85, { bg: '#10B981' });
  }

  // Subtitles
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
