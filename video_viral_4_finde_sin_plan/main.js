import * as THREE from './shared/three.module.js';
import { createLowPolyMaterial, buildEnhancedCharacter } from './shared/characters/character_builder.js';
import {
  createBedroomGirl,
  createStudioDancerA,
  createStudioDancerB,
  createStudioDancerC
} from './shared/characters/character_presets.js';
import { createStageLivingRoom } from './shared/stages/stage_livingroom.js';
import { createStageStudio } from './shared/stages/stage_studio.js';
import { createStageSmartphone } from './shared/stages/stage_smartphone.js';
import { createStagePodium } from './shared/stages/stage_podium.js';

// ============================================================================
// BAILAPP — VIDEO VIRAL 4: "EL PLAN DEL FINDE" (23.5s)
// ============================================================================

const W = 1080;
const H = 1920;
const CX = W / 2;
const CY = H / 2;
window.DUR = 23.5;

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
const livingObj = createStageLivingRoom();
const stageLivingRoom = livingObj.stage;
scene.add(stageLivingRoom);

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
function createBoredSignTexture() {
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

  ctx.fillStyle = '#8B5CF6';
  ctx.beginPath();
  ctx.roundRect(30, 26, 452, 44, 14);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SÁBADO SIN PLAN 🛌🥱', 256, 56);

  ctx.fillStyle = '#1F1D2B';
  ctx.font = 'bold 36px Inter, sans-serif';
  ctx.fillText('Scrollear en la cama', 256, 125);
  ctx.fillStyle = '#6B7280';
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.fillText('"¿Y si hacemos algo hoy?"', 256, 175);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

function createPassSignTexture() {
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
  ctx.fillText('CLASES SUELTAS ✨', 256, 100);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 30px Inter, sans-serif';
  ctx.fillText('CERO MATRÍCULA FIJA 🎟️', 256, 165);

  ctx.fillStyle = '#F8C8DC';
  ctx.font = '500 22px Inter, sans-serif';
  ctx.fillText('Lo que sale una merienda • Bailás hoy', 256, 220);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

const signBoredGeo = new THREE.PlaneGeometry(1.65, 0.85);
const signBoredMat = new THREE.MeshBasicMaterial({ map: createBoredSignTexture(), transparent: true, side: THREE.DoubleSide });
const signBoredMesh = new THREE.Mesh(signBoredGeo, signBoredMat);
// Centrado en el frustum (X=0) y con alto despeje vertical (Y=2.70m) sobre la cabeza sentada
signBoredMesh.position.set(0, 2.70, 0.3);
scene.add(signBoredMesh);

const signPassGeo = new THREE.PlaneGeometry(1.65, 1.0);
const signPassMat = new THREE.MeshBasicMaterial({ map: createPassSignTexture(), transparent: true, side: THREE.DoubleSide });
const signPassMesh = new THREE.Mesh(signPassGeo, signPassMat);
signPassMesh.position.set(0, 2.65, 0);
signPassMesh.visible = false;
scene.add(signPassMesh);

// Personajes
const charCasual = createBedroomGirl();
// Grounding dinámico sobre el almohadón del sillón a Y = 0.44m (no fijado en 0.00)
charCasual.root.position.set(-0.35, 0.44, -0.25);
scene.add(charCasual.root);

const charHero = createStudioDancerA();
charHero.root.position.set(-0.65, 0, 0.1);
charHero.root.visible = false;
scene.add(charHero.root);

const charPartner = createStudioDancerB();
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
  { start: 0.1, end: 4.1, line1: "¿Llega el sábado y tu único plan", line2: "es scrollear el celular en la cama?" },
  { start: 4.1, end: 8.8, line1: "En Bailapp no necesitás pagar una matrícula mensual", line2: "carísima para salir a bailar." },
  { start: 8.8, end: 14.3, line1: "Reservás clases sueltas de Dancehall, Twerk o K-Pop", line2: "en tu barrio por lo que sale una merienda." },
  { start: 14.3, end: 18.1, line1: "Vas hoy con amigas, la pasás bomba", line2: "y cortás la rutina con tremenda energía." },
  { start: 18.1, end: 23.2, line1: "Entrá a bailapp.com.ar", line2: "y armá tu plan de hoy." }
];

window.render = async function(time = 0) {
  stageLivingRoom.visible = time < 4.1;
  signBoredMesh.visible = time < 4.1;
  charCasual.root.visible = time < 4.1;

  stageSmartphone.visible = time >= 4.1 && time < 14.3;
  signPassMesh.visible = time >= 4.1 && time < 8.8;

  stageStudio.visible = time >= 14.3 && time < 18.5;
  charHero.root.visible = time >= 14.3;
  charPartner.root.visible = time >= 14.3;

  stagePodium.visible = time >= 18.5;

  if (time < 4.1) {
    const prog = time / 4.1;
    camera.position.set(lerp(-0.4, 0.4, prog), lerp(2.2, 1.9, prog), lerp(7.8, 6.8, prog));
    camera.lookAt(0, 1.15, 0);

    // Postura relajada sentada en el sillón
    charCasual.setPose({
      hipsY: -0.06,
      torsoTilt: 0.18,
      headTilt: 0.22, headTurn: -0.15,
      armLX: -0.1, elbowLX: -0.6,
      armRX: -0.4, elbowRX: -1.0,
      legLX: 1.45, kneeLX: -1.40,
      legRX: 1.40, kneeRX: -1.35
    });
    signBoredMesh.position.y = 2.70 + Math.sin(time * 2.5) * 0.05;
  } else if (time >= 4.1 && time < 8.8) {
    const phTime = time - 4.1;
    const prog = phTime / 4.7;
    camera.position.set(0, lerp(2.2, 1.8, prog), lerp(7.2, 6.2, prog));
    camera.lookAt(0, 1.4, 0);

    signPassMesh.visible = true;
    const scale = easeOutBack(clamp(phTime / 0.5, 0, 1));
    signPassMesh.scale.set(scale, scale, scale);
    signPassMesh.rotation.y = Math.sin(phTime * 1.2) * 0.05;
  } else if (time >= 8.8 && time < 14.3) {
    const phTime = time - 8.8;
    const prog = phTime / 5.5;
    const angle = lerp(-0.25, 0.35, prog);
    camera.position.set(Math.sin(angle) * 7.5, lerp(2.8, 2.5, prog), Math.cos(angle) * 7.5);
    camera.lookAt(0, 1.4, 0);
  } else if (time >= 14.3 && time < 18.5) {
    const stTime = time - 14.3;
    const prog = stTime / 4.2;
    camera.position.set(lerp(-0.6, 0.6, prog), lerp(2.2, 2.5, prog), lerp(6.8, 7.2, prog));
    camera.lookAt(0, 1.15, 0);

    charHero.updateDance(stTime, 'choreo_videoclip', 1.05);
    charPartner.updateDance(stTime + 0.2, 'choreo_videoclip', 1.05);
  } else {
    const pdTime = time - 18.5;
    const prog = pdTime / 5.0;
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

  if (time < 4.1) {
    drawDynamicBadge(ctx, 'EL PLAN DEL FINDE 🛌🥱', 0, -42);
    drawFittedText(ctx, '¿Sábado a la tarde scrolleando en la cama?', 0, 10, 860, 32, '#1F1D2B');
    drawFittedText(ctx, 'Cortá la rutina y llenate de endorfinas con amigas', 0, 48, 860, 20, '#6B7280', '500');
  } else if (time >= 4.1 && time < 14.3) {
    drawDynamicBadge(ctx, 'CLASES SUELTAS SIN MATRÍCULA FIJA 🎟️✨', 0, -42);
    drawFittedText(ctx, 'Dancehall • Twerk • K-Pop • Heels', 0, 10, 860, 32, '#1F1D2B');
    drawFittedText(ctx, 'Por lo que sale una merienda, reservás en 1 toque y vas', 0, 48, 860, 20, '#6B7280', '500');
  } else {
    drawDynamicBadge(ctx, 'ARMÁ TU PLAN DE HOY 📲🪩', 0, -42);
    drawFittedText(ctx, 'Entrá en bailapp.com.ar', 0, 10, 860, 34, '#E06385', '900');
    drawFittedText(ctx, 'Descargá la app y encontrá las clases más copadas', 0, 48, 860, 20, '#1F1D2B', '600');
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
