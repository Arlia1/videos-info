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
// BAILAPP — PRE-LANZAMIENTO 1: LA FILTRACIÓN / SECRETO NACIONAL (28.5s)
// ============================================================================

const W = 1080;
const H = 1920;
const CX = W / 2;
const CY = H / 2;
window.DUR = 28.5;

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
function createSecretSignTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 260;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#1F1D2B';
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 240, 28);
  ctx.fill();
  ctx.strokeStyle = '#E06385';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.fillStyle = '#E06385';
  ctx.beginPath();
  ctx.roundRect(30, 26, 452, 44, 14);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TOP SECRET • CONFIDENCIAL 🤫🔒', 256, 56);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 34px Inter, sans-serif';
  ctx.fillText('ALGO GRANDE SE VIENE', 256, 125);
  ctx.fillStyle = '#9CA3AF';
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.fillText('Para toda la danza en Argentina ✨', 256, 180);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

function createAllStudiosTexture() {
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
  ctx.fillText('TODAS LAS ACADEMIAS EN 1 APP ✨', 256, 70);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 30px Inter, sans-serif';
  ctx.fillText('Heels • K-Pop • Twerk • Urbano', 256, 130);
  ctx.fillText('Reservás en 10s sin mensajes 🪩', 256, 175);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '500 20px Inter, sans-serif';
  ctx.fillText('Muy pronto en toda Argentina', 256, 230);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

function createPodiumCTA() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 220;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#E06385';
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 200, 28);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 38px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ANDÁ CREANDO TU CUENTA 🎟️', 256, 75);

  ctx.fillStyle = '#FFF5F8';
  ctx.font = 'bold 26px Inter, sans-serif';
  ctx.fillText('bailapp.com.ar • Link en bio ⚡', 256, 140);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

const signSecretGeo = new THREE.PlaneGeometry(1.9, 0.95);
const signSecretMat = new THREE.MeshBasicMaterial({ map: createSecretSignTexture(), transparent: true, side: THREE.DoubleSide });
const signSecretMesh = new THREE.Mesh(signSecretGeo, signSecretMat);
signSecretMesh.position.set(0.7, 2.2, 0.6);
scene.add(signSecretMesh);

const signAllGeo = new THREE.PlaneGeometry(2.1, 1.15);
const signAllMat = new THREE.MeshBasicMaterial({ map: createAllStudiosTexture(), transparent: true, side: THREE.DoubleSide });
const signAllMesh = new THREE.Mesh(signAllGeo, signAllMat);
signAllMesh.position.set(0, 2.3, 0);
signAllMesh.visible = false;
scene.add(signAllMesh);

const signPodiumGeo = new THREE.PlaneGeometry(2.0, 0.85);
const signPodiumMat = new THREE.MeshBasicMaterial({ map: createPodiumCTA(), transparent: true, side: THREE.DoubleSide });
const signPodiumMesh = new THREE.Mesh(signPodiumGeo, signPodiumMat);
signPodiumMesh.position.set(0, 2.45, 0.5);
signPodiumMesh.visible = false;
scene.add(signPodiumMesh);

// ----------------------------------------------------------------------------
// 4. PERSONAJES 3D
// ----------------------------------------------------------------------------
const charBedroom = createBedroomGirl();
charBedroom.root.position.set(-0.35, 0, 0.35);
scene.add(charBedroom.root);

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
  { start: 0.1, end: 4.0, line1: "No le cuentes a nadie, pero si bailás en Argentina", line2: "guardate este video ya 🤫🔒" },
  { start: 4.0, end: 11.5, line1: "Estamos terminando de armar algo en secreto", line2: "que va a cambiar la forma de ir a bailar para siempre." },
  { start: 11.5, end: 19.5, line1: "Imaginate ver las mejores academias del país", line2: "y reservar tu clase en segundos sin mandar mensajes 🪩✨" },
  { start: 19.5, end: 28.5, line1: "El estreno oficial está muy cerca.", line2: "Andá creando tu cuenta en bailapp.com.ar 📱🎟️" }
];

// ----------------------------------------------------------------------------
// 6. RENDER LOOP
// ----------------------------------------------------------------------------
window.render = async function(time = 0) {
  const t = clamp(time, 0, window.DUR);

  stageBedroom.visible = t < 11.5;
  signSecretMesh.visible = t < 11.5;
  charBedroom.root.visible = t < 11.5;

  stageStudio.visible = t >= 11.5 && t < 19.5;
  signAllMesh.visible = t >= 11.5 && t < 19.5;
  charStudioA.root.visible = t >= 11.5 && t < 19.5;
  charStudioB.root.visible = t >= 11.5 && t < 19.5;

  stagePodium.visible = t >= 19.5;
  signPodiumMesh.visible = t >= 19.5;
  charPodium1.root.visible = t >= 19.5;
  charPodium2.root.visible = t >= 19.5;
  charPodium3.root.visible = t >= 19.5;

  if (t < 11.5) {
    camera.position.set(Math.sin(t * 0.2) * 0.4, 2.9, 8.0);
    camera.lookAt(0, 1.25, 0);
    charBedroom.updateDance(t, 'frustrated_practice', 0.9);
    signSecretMesh.position.y = 2.2 + Math.sin(t * 2.2) * 0.05;
  } else if (t < 19.5) {
    const stTime = t - 11.5;
    camera.position.set(Math.sin(stTime * 0.35) * 0.8, 3.2, 8.2);
    camera.lookAt(0, 1.25, 0);

    charStudioA.updateDance(stTime, 'choreo_videoclip', 1.0);
    charStudioB.updateDance(stTime + 0.15, 'choreo_videoclip', 1.0);

    if (subwoofers) {
      const bassPulse = 1.0 + Math.sin(stTime * 14.0) * 0.12;
      subwoofers.forEach((cone) => cone.scale.set(bassPulse, bassPulse, 1.0));
    }
    signAllMesh.position.y = 2.3 + Math.sin(stTime * 2.0) * 0.05;
  } else {
    const pdTime = t - 19.5;
    camera.position.set(Math.sin(pdTime * 0.3) * 0.5, 3.6, 8.6);
    camera.lookAt(0, 1.35, 0);

    stagePodium.rotation.y = pdTime * 0.15;
    charPodium1.updateDance(pdTime, 'celebrate_victory', 1.0);
    charPodium2.updateDance(pdTime + 0.15, 'celebrate_victory', 0.95);
    charPodium3.updateDance(pdTime + 0.30, 'celebrate_victory', 1.05);

    signPodiumMesh.position.y = 2.45 + Math.sin(pdTime * 2.5) * 0.05;
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

  // Dynamic Header Badge
  if (t < 11.5) {
    drawBadge(ctx, 'SECRET DROP • ARGENTINA 🇦🇷🔒', CX, 85, { bg: '#1F1D2B' });
  } else if (t < 19.5) {
    drawBadge(ctx, 'SE VIENE BAILAPP 🪩✨', CX, 85, { bg: '#E06385' });
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
