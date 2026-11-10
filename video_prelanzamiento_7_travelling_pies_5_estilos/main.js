import * as THREE from './shared/three.module.js';
import {
  createStudioDancerA,
  createStudioDancerB,
  createStudioDancerC
} from './shared/characters/character_presets.js';
import { createStageStudio } from './shared/stages/stage_studio.js';
import { createStagePodium } from './shared/stages/stage_podium.js';

// ============================================================================
// BAILAPP — PRE-LANZAMIENTO 7: TRAVELLING RASANTE 5 ESTILOS (26.5s)
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

// Camera
const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
camera.position.set(0, 0.22, 2.8);
camera.lookAt(0, 0.15, 0);

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

// Escenarios
const studioObj = createStageStudio();
const stageStudio = studioObj.stage;
const subwoofers = studioObj.subwoofers;
scene.add(stageStudio);

const stagePodium = createStagePodium();
stagePodium.visible = false;
scene.add(stagePodium);

// Bailarinas (formación triangular para cero clipping)
const dancerCenter = createStudioDancerA(); // Urbano / Heels
dancerCenter.root.position.set(0, 0, 0.2);
scene.add(dancerCenter.root);

const dancerLeft = createStudioDancerC(); // Contempo / Clásico
dancerLeft.root.position.set(-0.95, 0, -0.35);
scene.add(dancerLeft.root);

const dancerRight = createStudioDancerB(); // K-Pop
dancerRight.root.position.set(0.95, 0, -0.35);
scene.add(dancerRight.root);

// Podio final
const pod1 = createStudioDancerA();
pod1.root.position.set(0, 0.65, 0);
pod1.root.visible = false;
scene.add(pod1.root);

const pod2 = createStudioDancerB();
pod2.root.position.set(-1.25, 0.42, 0);
pod2.root.visible = false;
scene.add(pod2.root);

const pod3 = createStudioDancerC();
pod3.root.position.set(1.25, 0.30, 0);
pod3.root.visible = false;
scene.add(pod3.root);

// Cartel flotante 3D
function createFederalStylesTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 260;
  const ctx = c.getContext('2d');
  
  ctx.fillStyle = '#1F1D2B';
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 240, 24);
  ctx.fill();
  ctx.strokeStyle = '#10B981';
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.fillStyle = '#10B981';
  ctx.font = '900 28px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('1 SOLA PLATAFORMA 🇦🇷', 256, 55);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px Inter, sans-serif';
  ctx.fillText('Clásico • Urbano • Heels', 256, 110);
  ctx.fillText('Contemporáneo • K-Pop', 256, 150);

  ctx.fillStyle = '#FAD2E1';
  ctx.font = '19px Inter, sans-serif';
  ctx.fillText('Reservá tu lugar en 10 segundos ⚡', 256, 205);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

const signGeo = new THREE.PlaneGeometry(2.1, 1.15);
const signMat = new THREE.MeshBasicMaterial({ map: createFederalStylesTexture(), transparent: true, side: THREE.DoubleSide });
const signMesh = new THREE.Mesh(signGeo, signMat);
signMesh.position.set(0, 2.35, 0.1);
scene.add(signMesh);

// 2D Overlay
const uiCanvas = document.getElementById('ui');
const ui = uiCanvas.getContext('2d');

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function easeOutExpo(x) { return x === 1 ? 1 : 1 - Math.pow(2, -10 * x); }
function easeInOutCubic(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }

function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
}

function fitTextInBox(c, text, boxX, boxY, boxW, boxH, baseSize = 32, minSize = 14) {
  const paddingX = boxW * 0.12;
  const maxW = boxW - (paddingX * 2);
  let size = baseSize;
  c.font = `bold ${size}px Inter, sans-serif`;
  let measured = c.measureText(text).width;
  if (measured > maxW) {
    size = Math.max(minSize, Math.floor(baseSize * (maxW / measured)));
    c.font = `bold ${size}px Inter, sans-serif`;
  }
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText(text, boxX + boxW / 2, boxY + boxH / 2);
}

function drawBadgePill(c, text, cx, cy, options = {}) {
  const bg = options.bg || '#E06385';
  const fg = options.fg || '#FFFFFF';
  const font = options.font || 'bold 22px Inter, sans-serif';
  c.save();
  c.font = font;
  const tw = c.measureText(text).width;
  const pw = tw + 40;
  const ph = 40;
  c.fillStyle = bg;
  roundRect(c, cx - pw / 2, cy - ph / 2, pw, ph, 14);
  c.fill();
  c.fillStyle = fg;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText(text, cx, cy);
  c.restore();
}

const subtitles = [
  { start: 0.1, end: 5.5, line1: "Si bailás clásico, urbano, heels,", line2: "contemporáneo o K-Pop... frená el scroll ya 🛑" },
  { start: 5.5, end: 13.0, line1: "Se terminaron las 20 pestañas abiertas", line2: "buscando dónde tomar clases en tu ciudad 📱" },
  { start: 13.0, end: 19.5, line1: "Bailapp centraliza los mejores estudios de danza", line2: "de toda Argentina en una sola plataforma 🇦🇷✨" },
  { start: 19.5, end: 26.5, line1: "Entrá a bailapp.com.ar, andá creando tu cuenta", line2: "y arrobá a tu profe de danza acá abajo 👇" }
];

window.render = async function(time = 0) {
  const t = clamp(time, 0, window.DUR);

  const isGroundLevel = t < 5.8;
  const isCraneUp = t >= 5.8 && t < 13.5;
  const isOrbitFast = t >= 13.5 && t < 20.0;
  const isCTA = t >= 20.0;

  stageStudio.visible = !isCTA;
  stagePodium.visible = isCTA;
  signMesh.visible = isCraneUp || isOrbitFast;

  dancerCenter.root.visible = !isCTA;
  dancerLeft.root.visible = !isCTA;
  dancerRight.root.visible = !isCTA;

  pod1.root.visible = isCTA;
  pod2.root.visible = isCTA;
  pod3.root.visible = isCTA;

  if (isGroundLevel) {
    // Travelling rasante ultra rápido a nivel de pies
    const prog = t / 5.8;
    camera.position.x = lerp(-1.2, 0.4, prog);
    camera.position.y = 0.20 + Math.sin(t * 3.0) * 0.03;
    camera.position.z = lerp(2.8, 1.9, prog);
    camera.lookAt(0, 0.15, 0);

    dancerCenter.updateDance(t, 'heels', 1.6);
    dancerLeft.updateDance(t + 0.3, 'pop', 1.5);
    dancerRight.updateDance(t + 0.6, 'vogue', 1.4);
  } else if (isCraneUp) {
    // Crane up vertical explosivo
    const prog = clamp((t - 5.8) / 0.7, 0, 1);
    const ease = easeOutExpo(prog);
    camera.position.x = lerp(0.4, 0.0, ease);
    camera.position.y = lerp(0.20, 2.45, ease);
    camera.position.z = lerp(1.9, 4.4, ease);
    camera.lookAt(0, 1.25, 0);

    dancerCenter.updateDance(t, 'pop', 1.8);
    dancerLeft.updateDance(t + 0.2, 'pop', 1.8);
    dancerRight.updateDance(t + 0.4, 'pop', 1.8);
  } else if (isOrbitFast) {
    // Órbita lateral rápida en arco
    const prog = (t - 13.5) / 6.5;
    const angle = lerp(-0.7, 0.7, easeInOutCubic(prog));
    const rad = 4.2;
    camera.position.x = Math.sin(angle) * rad;
    camera.position.z = Math.cos(angle) * rad;
    camera.position.y = 1.65 + Math.sin(t * 2.0) * 0.15;
    camera.lookAt(0, 1.2, 0);

    dancerCenter.updateDance(t, 'heels', 1.6);
    dancerLeft.updateDance(t + 0.2, 'vogue', 1.5);
    dancerRight.updateDance(t + 0.4, 'pop', 1.7);
  } else {
    // Podio final
    const prog = clamp((t - 20.0) / 0.5, 0, 1);
    const ease = easeOutExpo(prog);
    camera.position.x = 0;
    camera.position.y = lerp(2.1, 1.75, ease);
    camera.position.z = lerp(6.2, 5.2, ease);
    camera.lookAt(0, 1.2, 0);

    pod1.updateDance(t, 'heels', 1.3);
    pod2.updateDance(t + 0.2, 'pop', 1.3);
    pod3.updateDance(t + 0.4, 'vogue', 1.3);
  }

  if (subwoofers && stageStudio.visible) {
    const pulse = 1.0 + Math.max(0, Math.sin(t * 13.0)) * 0.14;
    subwoofers.forEach(sub => sub.scale.set(1, pulse, 1));
  }

  renderer.render(scene, camera);

  // UI Canvas
  ui.clearRect(0, 0, W, H);

  // Barra de progreso
  ui.fillStyle = 'rgba(255, 255, 255, 0.35)';
  roundRect(ui, 60, 40, W - 120, 8, 4);
  ui.fill();
  ui.fillStyle = '#10B981';
  roundRect(ui, 60, 40, (W - 120) * (t / window.DUR), 8, 4);
  ui.fill();

  // Badge superior
  drawBadgePill(ui, 'PRE-LANZAMIENTO OFICIAL 🇦🇷', CX, 110, {
    bg: 'rgba(31, 29, 43, 0.90)',
    fg: '#FFFFFF',
    font: 'bold 24px Inter, sans-serif'
  });

  // Subtítulos
  for (const sub of subtitles) {
    if (t >= sub.start && t < sub.end) {
      const boxW = 920;
      const boxH = 140;
      const boxX = CX - boxW / 2;
      const boxY = 1380;

      ui.fillStyle = 'rgba(31, 29, 43, 0.88)';
      roundRect(ui, boxX, boxY, boxW, boxH, 22);
      ui.fill();
      ui.strokeStyle = 'rgba(16, 185, 129, 0.40)';
      ui.lineWidth = 2;
      ui.stroke();

      ui.fillStyle = '#FFFFFF';
      ui.font = 'bold 30px Inter, sans-serif';
      ui.textAlign = 'center';
      ui.textBaseline = 'middle';
      ui.fillText(sub.line1, CX, boxY + 44);

      ui.fillStyle = '#D1FAE5';
      ui.font = 'bold 26px Inter, sans-serif';
      ui.fillText(sub.line2, CX, boxY + 92);
      break;
    }
  }

  if (isCTA) {
    const cardW = 880;
    const cardH = 190;
    const cardX = CX - cardW / 2;
    const cardY = 1680;

    ui.fillStyle = '#1F1D2B';
    roundRect(ui, cardX, cardY, cardW, cardH, 28);
    ui.fill();
    ui.strokeStyle = '#10B981';
    ui.lineWidth = 4;
    ui.stroke();

    ui.fillStyle = '#FFFFFF';
    fitTextInBox(ui, 'ANDÁ CREANDO TU CUENTA GRATIS 👇', cardX, cardY + 20, cardW, 40, 32, 20);

    const btnW = 560;
    const btnH = 64;
    const btnX = CX - btnW / 2;
    const btnY = cardY + 90;

    ui.fillStyle = '#10B981';
    roundRect(ui, btnX, btnY, btnW, btnH, 18);
    ui.fill();

    ui.fillStyle = '#FFFFFF';
    fitTextInBox(ui, 'bailapp.com.ar', btnX, btnY, btnW, btnH, 30, 20);
  } else {
    drawBadgePill(ui, 'bailapp.com.ar • Argentina', CX, 1820, {
      bg: 'rgba(255, 255, 255, 0.90)',
      fg: '#2D242E',
      font: 'bold 22px Inter, sans-serif'
    });
  }
};

window.READY = true;
