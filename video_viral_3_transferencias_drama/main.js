import * as THREE from './shared/three.module.js';
import { createLowPolyMaterial, buildEnhancedCharacter } from './shared/characters/character_builder.js';
import {
  createBedroomGirl,
  createStudioDancerA,
  createStudioDancerB,
  createStudioDancerC
} from './shared/characters/character_presets.js';
import { createStageReception } from './shared/stages/stage_reception.js';
import { createStageStudio } from './shared/stages/stage_studio.js';
import { createStageSmartphone } from './shared/stages/stage_smartphone.js';
import { createStagePodium } from './shared/stages/stage_podium.js';

// ============================================================================
// BAILAPP — VIDEO VIRAL 3: "EL DRAMA DE LAS TRANSFERENCIAS" (26.5s)
// ============================================================================

const W = 1080;
const H = 1920;
const CX = W / 2;
const CY = H / 2;
window.DUR = 26.5;

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
const receptionObj = createStageReception();
const stageReception = receptionObj.stage;
scene.add(stageReception);

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
function createReceiptSignTexture() {
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
  ctx.fillText('COMPROBANTE FANTASMA 🧾❌', 256, 56);

  ctx.fillStyle = '#1F1D2B';
  ctx.font = 'bold 34px Inter, sans-serif';
  ctx.fillText('Transferencia $4.500', 256, 125);
  ctx.fillStyle = '#6B7280';
  ctx.font = 'bold 22px Inter, sans-serif';
  ctx.fillText('"¿De quién es este alias?"', 256, 175);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

function createQRPassSignTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 300;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#1F1D2B';
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 280, 28);
  ctx.fill();
  ctx.strokeStyle = '#10B981';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.fillStyle = '#10B981';
  ctx.font = '900 64px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PASE DIGITAL QR ✅', 256, 95);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 28px Inter, sans-serif';
  ctx.fillText('COBRO AUTOMÁTICO 📱', 256, 160);

  ctx.fillStyle = '#A7F3D0';
  ctx.font = '500 22px Inter, sans-serif';
  ctx.fillText('Cero Excel • Cero WhatsApp', 256, 215);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

const signReceiptGeo = new THREE.PlaneGeometry(1.65, 0.85);
const signReceiptMat = new THREE.MeshBasicMaterial({ map: createReceiptSignTexture(), transparent: true, side: THREE.DoubleSide });
const signReceiptMesh = new THREE.Mesh(signReceiptGeo, signReceiptMat);
// Centrado en X=0 (dentro del frustum vertical 9:16) y con alto despeje vertical (Y=2.70m) sobre la cabeza (Y=1.80m)
signReceiptMesh.position.set(0, 2.70, 0.4);
scene.add(signReceiptMesh);

const signQRGeo = new THREE.PlaneGeometry(1.65, 1.0);
const signQRMat = new THREE.MeshBasicMaterial({ map: createQRPassSignTexture(), transparent: true, side: THREE.DoubleSide });
const signQRMesh = new THREE.Mesh(signQRGeo, signQRMat);
signQRMesh.position.set(0, 2.65, 0);
signQRMesh.visible = false;
scene.add(signQRMesh);

// Personajes
const charCasual = createBedroomGirl();
// Ubicado detrás del mostrador de recepción de forma natural
charCasual.root.position.set(0, 0, -0.1);
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
  { start: 0.1, end: 5.0, line1: "¿Seguís pidiendo comprobante de transferencia", line2: "por WhatsApp para anotar gente a tu clase?" },
  { start: 5.0, end: 11.6, line1: "Entre los mensajes sin nombre, el banco colgado", line2: "y el Excel desactualizado, perdés horas todos los días." },
  { start: 11.6, end: 18.5, line1: "Con Bailapp tus alumnas pagan directo en la app,", line2: "reservan en 10 segundos y reciben su pase digital con QR." },
  { start: 18.5, end: 21.4, line1: "Cero confusiones, cero estrés.", line2: "Tu tiempo de vuelta para bailar." },
  { start: 21.4, end: 26.2, line1: "Sumá tu academia gratis", line2: "en bailapp.com.ar" }
];

window.render = async function(time = 0) {
  stageReception.visible = time < 5.0;
  signReceiptMesh.visible = time < 5.0;
  charCasual.root.visible = time < 5.0;

  stageSmartphone.visible = time >= 5.0 && time < 18.5;
  signQRMesh.visible = time >= 5.0 && time < 11.6;

  stageStudio.visible = time >= 18.5 && time < 22.5;
  charHero.root.visible = time >= 18.5;
  charPartner.root.visible = time >= 18.5;

  stagePodium.visible = time >= 22.5;

  if (time < 5.0) {
    const prog = time / 5.0;
    camera.position.set(lerp(-0.4, 0.4, prog), lerp(2.2, 1.9, prog), lerp(7.8, 6.8, prog));
    camera.lookAt(0, 1.15, 0);

    charCasual.setPose({
      hipsY: -0.04,
      torsoTilt: 0.22,
      headTilt: 0.25, headTurn: -0.15,
      armLX: -0.1, elbowLX: -0.75,
      armRX: -0.5, armRZ: 0.15, elbowRX: -1.2,
    });
    signReceiptMesh.position.y = 2.70 + Math.sin(time * 2.5) * 0.05;
  } else if (time >= 5.0 && time < 11.6) {
    const phTime = time - 5.0;
    const prog = phTime / 6.6;
    camera.position.set(0, lerp(2.2, 1.8, prog), lerp(7.2, 6.2, prog));
    camera.lookAt(0, 1.4, 0);

    signQRMesh.visible = true;
    const scale = easeOutBack(clamp(phTime / 0.5, 0, 1));
    signQRMesh.scale.set(scale, scale, scale);
    signQRMesh.rotation.y = Math.sin(phTime * 1.2) * 0.05;
  } else if (time >= 11.6 && time < 18.5) {
    const phTime = time - 11.6;
    const prog = phTime / 6.9;
    const angle = lerp(-0.25, 0.35, prog);
    camera.position.set(Math.sin(angle) * 7.5, lerp(2.8, 2.5, prog), Math.cos(angle) * 7.5);
    camera.lookAt(0, 1.4, 0);
  } else if (time >= 18.5 && time < 22.5) {
    const stTime = time - 18.5;
    const prog = stTime / 4.0;
    camera.position.set(lerp(-0.6, 0.6, prog), lerp(2.2, 2.5, prog), lerp(6.8, 7.2, prog));
    camera.lookAt(0, 1.15, 0);

    charHero.updateDance(stTime, 'choreo_videoclip', 1.05);
    charPartner.updateDance(stTime + 0.2, 'choreo_videoclip', 1.05);
  } else {
    const pdTime = time - 22.5;
    const prog = pdTime / 4.0;
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

  if (time < 5.0) {
    drawDynamicBadge(ctx, 'LA ODISEA DE LAS TRANSFERENCIAS 💸🤯', 0, -42);
    drawFittedText(ctx, '¿Comprobantes de pago sin nombre ni DNI?', 0, 10, 860, 32, '#1F1D2B');
    drawFittedText(ctx, 'Perdés horas revisando el banco y anotando en cuadernos', 0, 48, 860, 20, '#6B7280', '500');
  } else if (time >= 5.0 && time < 18.5) {
    drawDynamicBadge(ctx, 'AUTOMATIZACIÓN TOTAL EN BAILAPP 🚀📱', 0, -42);
    drawFittedText(ctx, 'Pago Instantáneo • Pase Digital con QR', 0, 10, 860, 32, '#1F1D2B');
    drawFittedText(ctx, 'Tus alumnas pagan en 1 toque y entran escaneando', 0, 48, 860, 20, '#6B7280', '500');
  } else {
    drawDynamicBadge(ctx, 'SUMÁ TU ACADEMIA GRATIS 🩰✨', 0, -42);
    drawFittedText(ctx, 'Entrá en bailapp.com.ar', 0, 10, 860, 34, '#E06385', '900');
    drawFittedText(ctx, 'Modernizá tus cobros y llená tus salas sin estrés', 0, 48, 860, 20, '#1F1D2B', '600');
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
