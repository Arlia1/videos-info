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
// BAILAPP — PRE-LANZAMIENTO 5: EL PACTO DE AMIGAS (30.0s)
// ============================================================================

const W = 1080;
const H = 1920;
const CX = W / 2;
const CY = H / 2;
window.DUR = 30.0;

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
function createFriendsPactTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 280;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#1F1D2B';
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 260, 28);
  ctx.fill();
  ctx.strokeStyle = '#F472B6';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.fillStyle = '#F472B6';
  ctx.beginPath();
  ctx.roundRect(30, 24, 452, 44, 14);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('EL PACTO DE AMIGAS 📱👯‍♀️', 256, 54);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 30px Inter, sans-serif';
  ctx.fillText('«¡AMIGA TENEMOS QUE IR!»', 256, 120);
  ctx.fillStyle = '#FAD2E1';
  ctx.font = 'bold 22px Inter, sans-serif';
  ctx.fillText('50 coreos mandadas • Cero clases 🫠', 256, 170);
  ctx.fillText('Se les acabaron las excusas 😂🔥', 256, 215);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

function createTogetherInstantTexture() {
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
  ctx.fillText('RESERVAN JUNTAS EN 10s ⚡', 256, 68);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 28px Inter, sans-serif';
  ctx.fillText('Heels • Reggaetón • Twerk • K-Pop', 256, 128);

  ctx.fillStyle = '#FAD2E1';
  ctx.font = 'bold 22px Inter, sans-serif';
  ctx.fillText('En toda Argentina muy pronto 🪩✨', 256, 185);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

function createTagFriendCTA() {
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
  ctx.fillText('ARROBALA ACÁ ABAJO 👇', 256, 75);

  ctx.fillStyle = '#FFF5F8';
  ctx.font = 'bold 26px Inter, sans-serif';
  ctx.fillText('Para que no se haga la sorda 👯‍♀️', 256, 128);
  ctx.fillText('Creá tu cuenta en bailapp.com.ar ⚡', 256, 175);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

const signFriendsGeo = new THREE.PlaneGeometry(2.1, 1.15);
const signFriendsMat = new THREE.MeshBasicMaterial({ map: createFriendsPactTexture(), transparent: true, side: THREE.DoubleSide });
const signFriendsMesh = new THREE.Mesh(signFriendsGeo, signFriendsMat);
signFriendsMesh.position.set(0.7, 2.25, 0.6);
scene.add(signFriendsMesh);

const signTogGeo = new THREE.PlaneGeometry(2.1, 1.15);
const signTogMat = new THREE.MeshBasicMaterial({ map: createTogetherInstantTexture(), transparent: true, side: THREE.DoubleSide });
const signTogMesh = new THREE.Mesh(signTogGeo, signTogMat);
signTogMesh.position.set(0, 2.3, 0);
signTogMesh.visible = false;
scene.add(signTogMesh);

const signTagFrGeo = new THREE.PlaneGeometry(2.0, 0.95);
const signTagFrMat = new THREE.MeshBasicMaterial({ map: createTagFriendCTA(), transparent: true, side: THREE.DoubleSide });
const signTagFrMesh = new THREE.Mesh(signTagFrGeo, signTagFrMat);
signTagFrMesh.position.set(0, 2.45, 0.5);
signTagFrMesh.visible = false;
scene.add(signTagFrMesh);

// ----------------------------------------------------------------------------
// 4. PERSONAJES 3D (LAS DOS AMIGAS)
// ----------------------------------------------------------------------------
const charFriend1 = createBedroomGirl({ hasPhone: true });
charFriend1.root.position.set(-0.65, 0, 0.35);
scene.add(charFriend1.root);

const charFriend2 = createStudioDancerB({ hasPhone: true });
charFriend2.root.position.set(0.65, 0, 0.35);
scene.add(charFriend2.root);

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
  { start: 0.1, end: 4.5, line1: "Mandale este video a esa amiga con la que hace 1 año", line2: "dicen que van a arrancar clases de baile 📱👯‍♀️" },
  { start: 4.5, end: 11.5, line1: "Se mandan 40 coreos de TikTok por semana", line2: "pero coordinar horarios y pedir cupo es un dolor de cabeza 😂" },
  { start: 11.5, end: 20.0, line1: "Muy pronto en toda Argentina llega Bailapp:", line2: "eligen el estilo que quieren y reservan juntas en 10s 🪩✨" },
  { start: 20.0, end: 30.0, line1: "Andá creando tu cuenta en bailapp.com.ar", line2: "y arrobá a tu amiga acá abajo 👇👀" }
];

// ----------------------------------------------------------------------------
// 6. RENDER LOOP
// ----------------------------------------------------------------------------
window.render = async function(time = 0) {
  const t = clamp(time, 0, window.DUR);

  stageBedroom.visible = t < 11.5;
  signFriendsMesh.visible = t < 11.5;
  charFriend1.root.visible = t < 11.5;
  charFriend2.root.visible = t < 11.5;

  stageStudio.visible = t >= 11.5 && t < 20.0;
  signTogMesh.visible = t >= 11.5 && t < 20.0;
  charStudioA.root.visible = t >= 11.5 && t < 20.0;
  charStudioB.root.visible = t >= 11.5 && t < 20.0;

  stagePodium.visible = t >= 20.0;
  signTagFrMesh.visible = t >= 20.0;
  charPodium1.root.visible = t >= 20.0;
  charPodium2.root.visible = t >= 20.0;
  charPodium3.root.visible = t >= 20.0;

  if (t < 11.5) {
    camera.position.set(Math.sin(t * 0.2) * 0.4, 2.9, 8.0);
    camera.lookAt(0, 1.25, 0);
    charFriend1.updateDance(t, 'frustrated_practice', 0.85);
    charFriend2.updateDance(t + 0.3, 'frustrated_practice', 0.85);
    signFriendsMesh.position.y = 2.25 + Math.sin(t * 2.2) * 0.05;
  } else if (t < 20.0) {
    const stTime = t - 11.5;
    camera.position.set(Math.sin(stTime * 0.35) * 0.8, 3.2, 8.2);
    camera.lookAt(0, 1.25, 0);

    charStudioA.updateDance(stTime, 'choreo_videoclip', 1.0);
    charStudioB.updateDance(stTime + 0.15, 'choreo_videoclip', 1.0);

    if (subwoofers) {
      const bassPulse = 1.0 + Math.sin(stTime * 14.0) * 0.12;
      subwoofers.forEach((cone) => cone.scale.set(bassPulse, bassPulse, 1.0));
    }
    signTogMesh.position.y = 2.3 + Math.sin(stTime * 2.0) * 0.05;
  } else {
    const pdTime = t - 20.0;
    camera.position.set(Math.sin(pdTime * 0.3) * 0.5, 3.6, 8.6);
    camera.lookAt(0, 1.35, 0);

    stagePodium.rotation.y = pdTime * 0.15;
    charPodium1.updateDance(pdTime, 'celebrate_victory', 1.0);
    charPodium2.updateDance(pdTime + 0.15, 'celebrate_victory', 0.95);
    charPodium3.updateDance(pdTime + 0.30, 'celebrate_victory', 1.05);

    signTagFrMesh.position.y = 2.45 + Math.sin(pdTime * 2.5) * 0.05;
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
  if (t < 11.5) {
    drawBadge(ctx, 'EL PACTO DE AMIGAS 📱👯‍♀️', CX, 85, { bg: '#F472B6' });
  } else if (t < 20.0) {
    drawBadge(ctx, 'SE LES ACABARON LAS EXCUSAS 🪩✨', CX, 85, { bg: '#E06385' });
  } else {
    drawBadge(ctx, 'ARROBALA ACÁ ABAJO 👇🎟️', CX, 85, { bg: '#10B981' });
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
