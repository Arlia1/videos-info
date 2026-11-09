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
// BAILAPP — VIDEO VIRAL 5: "HEELS GLOW UP" (24.5s)
// ============================================================================

const W = 1080;
const H = 1920;
const CX = W / 2;
const CY = H / 2;
window.DUR = 24.5;

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

const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
camera.position.set(0, 2.3, 7.6);
camera.lookAt(0, 1.25, 0);

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

// Escenarios
const stageBedroom = createStageBedroom();
scene.add(stageBedroom);

const studioObj = createStageStudio();
const stageStudio = studioObj.stage;
stageStudio.visible = false;
scene.add(stageStudio);

const phoneObj = createStageSmartphone();
const stageSmartphone = phoneObj.stage;
stageSmartphone.visible = false;
scene.add(stageSmartphone);

const stagePodium = createStagePodium();
stagePodium.visible = false;
scene.add(stagePodium);

// 3D Floating Signs
function createHeelsSignTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 236, 28);
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
  ctx.fillText('HEELS DESDE CERO 👠✨', 256, 56);

  ctx.fillStyle = '#1F1D2B';
  ctx.font = 'bold 36px Inter, sans-serif';
  ctx.fillText('Técnica & Caminata', 256, 125);
  ctx.fillStyle = '#6B7280';
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.fillText('"Desbloqueá tu seguridad"', 256, 175);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

function createGlowSignTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 300;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#1F1D2B';
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 280, 28);
  ctx.fill();
  ctx.strokeStyle = '#E06385';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.fillStyle = '#E06385';
  ctx.font = '900 68px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GLOW UP TOTAL 🔥', 256, 100);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 28px Inter, sans-serif';
  ctx.fillText('POSTURA & AUTOESTIMA 💃', 256, 165);

  ctx.fillStyle = '#F8C8DC';
  ctx.font = '500 22px Inter, sans-serif';
  ctx.fillText('Profes que te cuidan y potencian', 256, 220);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

const signHeelsGeo = new THREE.PlaneGeometry(1.65, 0.85);
const signHeelsMat = new THREE.MeshBasicMaterial({ map: createHeelsSignTexture(), transparent: true, side: THREE.DoubleSide });
const signHeelsMesh = new THREE.Mesh(signHeelsGeo, signHeelsMat);
// Centrado en el frustum (X=0) y con alto despeje vertical (Y=2.70m) sobre la cabeza
signHeelsMesh.position.set(0, 2.70, 0.35);
scene.add(signHeelsMesh);

const signGlowGeo = new THREE.PlaneGeometry(1.65, 1.0);
const signGlowMat = new THREE.MeshBasicMaterial({ map: createGlowSignTexture(), transparent: true, side: THREE.DoubleSide });
const signGlowMesh = new THREE.Mesh(signGlowGeo, signGlowMat);
signGlowMesh.position.set(0, 2.65, 0);
signGlowMesh.visible = false;
scene.add(signGlowMesh);

// Personajes
const charCasual = createBedroomGirl();
charCasual.root.position.set(0, 0, 0.2);
scene.add(charCasual.root);

const charHero = createStudioDancerA();
charHero.root.position.set(-0.65, 0, 0.1);
charHero.root.visible = false;
scene.add(charHero.root);

const charPartner = createStudioDancerC();
charPartner.root.position.set(0.65, 0, 0.1);
charPartner.root.visible = false;
scene.add(charPartner.root);

// UI 2D Canvas
const uiCanvas = document.getElementById('ui');
const ctx = uiCanvas.getContext('2d');

function lerp(a, b, t) { return a + (b - a) * t; }
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

function drawDynamicBadge(c, text, cx, cy, options = {}) {
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
  { start: 0.1, end: 4.7, line1: "Hay una versión tuya súper empoderada", line2: "esperando ponerse tacos y salir a bailar." },
  { start: 4.7, end: 10.2, line1: "Si creés que Heels es solo para profesionales,", line2: "estás muy equivocada." },
  { start: 10.2, end: 17.2, line1: "En Bailapp encontrás clases de técnica y postura", line2: "desde cero, con profes que potencian tu seguridad." },
  { start: 17.2, end: 19.3, line1: "Animáte al glow up.", line2: "Desbloqueá tu mejor versión." },
  { start: 19.3, end: 24.2, line1: "Entrá a bailapp.com.ar", line2: "y reservá tu clase hoy." }
];

window.render = async function(time = 0) {
  stageBedroom.visible = time < 4.7;
  signHeelsMesh.visible = time < 4.7;
  charCasual.root.visible = time < 4.7;

  stageSmartphone.visible = time >= 4.7 && time < 17.2;
  signGlowMesh.visible = time >= 4.7 && time < 10.2;

  stageStudio.visible = time >= 17.2 && time < 20.0;
  charHero.root.visible = time >= 17.2;
  charPartner.root.visible = time >= 17.2;

  stagePodium.visible = time >= 20.0;

  if (time < 4.7) {
    const prog = time / 4.7;
    camera.position.set(lerp(-0.4, 0.4, prog), lerp(2.2, 1.9, prog), lerp(7.8, 6.8, prog));
    camera.lookAt(0, 1.15, 0);

    charCasual.setPose({
      hipsY: -0.04,
      torsoTilt: 0.12,
      headTilt: 0.18, headTurn: -0.10,
      armLX: -0.1, elbowLX: -0.5,
      armRX: -0.3, elbowRX: -0.8,
    });
    signHeelsMesh.position.y = 2.70 + Math.sin(time * 2.5) * 0.05;
  } else if (time >= 4.7 && time < 10.2) {
    const phTime = time - 4.7;
    const prog = phTime / 5.5;
    camera.position.set(0, lerp(2.2, 1.8, prog), lerp(7.2, 6.2, prog));
    camera.lookAt(0, 1.4, 0);

    signGlowMesh.visible = true;
    const scale = easeOutBack(clamp(phTime / 0.5, 0, 1));
    signGlowMesh.scale.set(scale, scale, scale);
    signGlowMesh.rotation.y = Math.sin(phTime * 1.2) * 0.05;
  } else if (time >= 10.2 && time < 17.2) {
    const phTime = time - 10.2;
    const prog = phTime / 7.0;
    const angle = lerp(-0.25, 0.35, prog);
    camera.position.set(Math.sin(angle) * 7.5, lerp(2.8, 2.5, prog), Math.cos(angle) * 7.5);
    camera.lookAt(0, 1.4, 0);
  } else if (time >= 17.2 && time < 20.0) {
    const stTime = time - 17.2;
    const prog = stTime / 2.8;
    camera.position.set(lerp(-0.6, 0.6, prog), lerp(2.2, 2.5, prog), lerp(6.8, 7.2, prog));
    camera.lookAt(0, 1.15, 0);

    charHero.updateDance(stTime, 'choreo_videoclip', 1.05);
    charPartner.updateDance(stTime + 0.2, 'choreo_videoclip', 1.05);
  } else {
    const pdTime = time - 20.0;
    const prog = pdTime / 4.5;
    camera.position.set(0, lerp(2.4, 3.6, prog), lerp(7.2, 8.0, prog));
    camera.lookAt(0, 1.35, 0);

    stagePodium.rotation.y = pdTime * 0.15;
    charHero.updateDance(pdTime, 'celebrate_victory', 1.0);
    charPartner.updateDance(pdTime + 0.15, 'celebrate_victory', 0.95);
  }

  renderer.render(scene, camera);

  // UI 2D Overlays
  ctx.clearRect(0, 0, W, H);

  // Header Card
  ctx.save();
  ctx.translate(CX, 140);
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(224, 99, 133, 0.25)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 6;
  roundRect(ctx, -460, -75, 920, 150, 24);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  ctx.strokeStyle = '#FAD2E1';
  ctx.lineWidth = 3;
  roundRect(ctx, -460, -75, 920, 150, 24);
  ctx.stroke();

  if (time < 4.7) {
    drawDynamicBadge(ctx, 'HEELS & AUTOESTIMA 👠✨', 0, -42);
    drawFittedText(ctx, '¿Ganas de bailar en tacos pero te da cosa?', 0, 10, 860, 32, '#1F1D2B');
    drawFittedText(ctx, 'La actitud y la seguridad se entrenan paso a paso', 0, 48, 860, 20, '#6B7280', '500');
  } else if (time >= 4.7 && time < 17.2) {
    drawDynamicBadge(ctx, 'TÉCNICA Y CAMINATA DESDE CERO 💃🔥', 0, -42);
    drawFittedText(ctx, 'Commercial Heels • Postura • Empoderamiento', 0, 10, 860, 32, '#1F1D2B');
    drawFittedText(ctx, 'Profes que te cuidan los apoyos y potencian tu brillo', 0, 48, 860, 20, '#6B7280', '500');
  } else {
    drawDynamicBadge(ctx, 'ANIMATE AL GLOW UP 📲👠', 0, -42);
    drawFittedText(ctx, 'Entrá en bailapp.com.ar', 0, 10, 860, 34, '#E06385', '900');
    drawFittedText(ctx, 'Descargá la app y reservá tu clase de Heels hoy', 0, 48, 860, 20, '#1F1D2B', '600');
  }
  ctx.restore();

  // Subtitles
  const curSub = subtitles.find(s => time >= s.start && time < s.end);
  if (curSub) {
    ctx.save();
    ctx.translate(CX, 1420);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 4;
    roundRect(ctx, -470, -55, 940, 110, 22);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.strokeStyle = '#FAD2E1';
    ctx.lineWidth = 2.5;
    roundRect(ctx, -470, -55, 940, 110, 22);
    ctx.stroke();

    drawFittedText(ctx, curSub.line1, 0, -18, 900, 28, '#1F1D2B', 'bold');
    drawFittedText(ctx, curSub.line2, 0, 20, 900, 26, '#E06385', 'bold');
    ctx.restore();
  }
};

window.render(0);
window.READY = true;
