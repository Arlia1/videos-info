import * as THREE from './shared/three.module.js';
import {
  createStudioDancerA,
  createStudioDancerB,
  createStudioDancerC
} from './shared/characters/character_presets.js';
import { createStageStudio } from './shared/stages/stage_studio.js';
import { createStagePodium } from './shared/stages/stage_podium.js';

// ============================================================================
// BAILAPP — PRE-LANZAMIENTO 8: ALERTA ESTUDIOS DE DANZA ARGENTINA (31.0s)
// ============================================================================

const W = 1080;
const H = 1920;
const CX = W / 2;
const CY = H / 2;
window.DUR = 31.0;

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
camera.position.set(0, 1.4, 4.2);
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

// Escenarios
const studioObj = createStageStudio();
const stageStudio = studioObj.stage;
const subwoofers = studioObj.subwoofers;
scene.add(stageStudio);

const stagePodium = createStagePodium();
stagePodium.visible = false;
scene.add(stagePodium);

// Bailarinas
const dancerA = createStudioDancerA();
dancerA.root.position.set(0, 0, 0.2);
scene.add(dancerA.root);

const dancerB = createStudioDancerB();
dancerB.root.position.set(0.95, 0, -0.35);
dancerB.root.visible = false;
scene.add(dancerB.root);

const dancerC = createStudioDancerC();
dancerC.root.position.set(-0.95, 0, -0.35);
dancerC.root.visible = false;
scene.add(dancerC.root);

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
function createStudiosB2BTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 280;
  const ctx = c.getContext('2d');
  
  ctx.fillStyle = '#1F1D2B';
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 260, 24);
  ctx.fill();
  ctx.strokeStyle = '#E06385';
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.fillStyle = '#E06385';
  ctx.font = '900 28px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ESTUDIOS DE DANZA 🇦🇷', 256, 55);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px Inter, sans-serif';
  ctx.fillText('Clásico • Urbano • Heels', 256, 110);
  ctx.fillText('Contemporáneo • K-Pop', 256, 150);

  ctx.fillStyle = '#10B981';
  ctx.font = 'bold 20px Inter, sans-serif';
  ctx.fillText('Cero planillas • Reservas automáticas ⚡', 256, 210);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

const signGeo = new THREE.PlaneGeometry(2.2, 1.2);
const signMat = new THREE.MeshBasicMaterial({ map: createStudiosB2BTexture(), transparent: true, side: THREE.DoubleSide });
const signMesh = new THREE.Mesh(signGeo, signMat);
signMesh.position.set(0, 2.35, 0.2);
scene.add(signMesh);

// UI 2D
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
  { start: 0.1, end: 6.0, line1: "Si tenés o coordinás un estudio de danza", line2: "en Argentina... guardá este video 🩰🇦🇷" },
  { start: 6.0, end: 14.5, line1: "Tus clases de urbano, heels, contemporáneo,", line2: "clásico y K-Pop llenas... sin planillas colapsadas 📆⚡" },
  { start: 14.5, end: 23.0, line1: "Bailapp llega para conectar a miles de personas con sus", line2: "estudios favoritos en todo el país con reservas automáticas 🎟️✨" },
  { start: 23.0, end: 31.0, line1: "Arrobá a tu estudio acá abajo para que se entere antes,", line2: "o andá creando tu cuenta en bailapp.com.ar 👇" }
];

window.render = async function(time = 0) {
  const t = clamp(time, 0, window.DUR);

  const isIntro = t < 7.0;
  const isAscent = t >= 7.0 && t < 15.5;
  const isOrbit = t >= 15.5 && t < 23.5;
  const isCTA = t >= 23.5;

  stageStudio.visible = !isCTA;
  stagePodium.visible = isCTA;
  signMesh.visible = isIntro || isAscent;

  dancerA.root.visible = !isCTA;
  dancerB.root.visible = isAscent || isOrbit;
  dancerC.root.visible = isAscent || isOrbit;

  pod1.root.visible = isCTA;
  pod2.root.visible = isCTA;
  pod3.root.visible = isCTA;

  if (isIntro) {
    // Snap zoom rápido a la entrada del estudio
    const prog = clamp(t / 0.45, 0, 1);
    const ease = easeOutExpo(prog);
    camera.position.x = lerp(1.5, 0.0, ease);
    camera.position.y = lerp(2.0, 1.4, ease);
    camera.position.z = lerp(5.5, 3.8, ease);
    camera.lookAt(0, 1.25, 0);

    dancerA.updateDance(t, 'heels', 1.4);
  } else if (isAscent) {
    // Travelling ascendente rápido (Crane up)
    const prog = (t - 7.0) / 8.5;
    camera.position.x = Math.sin(t * 0.8) * 0.3;
    camera.position.y = lerp(1.4, 2.5, easeInOutCubic(prog));
    camera.position.z = lerp(3.8, 4.8, easeInOutCubic(prog));
    camera.lookAt(0, 1.2, 0);

    dancerA.updateDance(t, 'pop', 1.6);
    dancerB.updateDance(t + 0.2, 'heels', 1.5);
    dancerC.updateDance(t + 0.4, 'vogue', 1.4);

    signMesh.position.y = 2.35 + Math.sin(t * 2.0) * 0.05;
  } else if (isOrbit) {
    // Paneo circular veloz sobrevolando el salón
    const prog = (t - 15.5) / 8.0;
    const angle = lerp(-0.8, 0.8, easeInOutCubic(prog));
    const rad = 4.4;
    camera.position.x = Math.sin(angle) * rad;
    camera.position.z = Math.cos(angle) * rad;
    camera.position.y = 1.75 + Math.sin(t * 1.8) * 0.15;
    camera.lookAt(0, 1.2, 0);

    dancerA.updateDance(t, 'heels', 1.8);
    dancerB.updateDance(t + 0.2, 'pop', 1.8);
    dancerC.updateDance(t + 0.4, 'pop', 1.8);
  } else {
    // Bajada frontal rápida (Crane down) al podio
    const prog = clamp((t - 23.5) / 0.6, 0, 1);
    const ease = easeOutExpo(prog);
    camera.position.x = 0;
    camera.position.y = lerp(2.4, 1.75, ease);
    camera.position.z = lerp(6.5, 5.2, ease);
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
  ui.fillStyle = '#E06385';
  roundRect(ui, 60, 40, (W - 120) * (t / window.DUR), 8, 4);
  ui.fill();

  // Badge superior
  drawBadgePill(ui, 'ESTUDIOS DE DANZA 🇦🇷', CX, 110, {
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
      ui.strokeStyle = 'rgba(224, 99, 133, 0.40)';
      ui.lineWidth = 2;
      ui.stroke();

      ui.fillStyle = '#FFFFFF';
      ui.font = 'bold 30px Inter, sans-serif';
      ui.textAlign = 'center';
      ui.textBaseline = 'middle';
      ui.fillText(sub.line1, CX, boxY + 44);

      ui.fillStyle = '#FAD2E1';
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
    ui.strokeStyle = '#E06385';
    ui.lineWidth = 4;
    ui.stroke();

    ui.fillStyle = '#FFFFFF';
    fitTextInBox(ui, 'AVISALE A TU ESTUDIO FAVORITO 👇', cardX, cardY + 20, cardW, 40, 32, 20);

    const btnW = 560;
    const btnH = 64;
    const btnX = CX - btnW / 2;
    const btnY = cardY + 90;

    ui.fillStyle = '#E06385';
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
