import * as THREE from './shared/three.module.js';
import { createLowPolyMaterial, buildEnhancedCharacter } from './shared/characters/character_builder.js';
import {
  createBedroomGirl,
  createStudioDancerA,
  createStudioDancerB,
  createStudioDancerC
} from './shared/characters/character_presets.js';
import { createStageGym } from './shared/stages/stage_gym.js';
import { createStageStudio } from './shared/stages/stage_studio.js';
import { createStageSmartphone } from './shared/stages/stage_smartphone.js';
import { createStagePodium } from './shared/stages/stage_podium.js';

// ============================================================================
// BAILAPP — VIDEO VIRAL 2: "GYM ABURRIDO VS DANZA" (25s)
// ============================================================================
// - Escenario Gym dedicado procedural (stage_gym.js con cinta de correr y pesas).
// - Personaje posicionado dinámicamente sobre la cinta (Y = 0.23m).
// - Carteles flotantes 100% dentro del frustum 9:16 y sin tocar la cabeza.
// - Cámara con movimiento dinámico continuo (Dolly, Tilt, Crane).
// - Aislamiento escénico estricto.
// ============================================================================

const W = 1080;
const H = 1920;
const CX = W / 2;
const CY = H / 2;
window.DUR = 25.0;

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
const gymObj = createStageGym();
const stageGym = gymObj.stage;
scene.add(stageGym);

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
function createGymSignTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 236, 28);
  ctx.fill();
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.fillStyle = '#6B7280';
  ctx.beginPath();
  ctx.roundRect(30, 26, 452, 44, 14);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CINTA DE CORRER 🥱', 256, 56);

  ctx.fillStyle = '#1F1D2B';
  ctx.font = 'bold 36px Inter, sans-serif';
  ctx.fillText('45 min mirando la pared', 256, 125);
  ctx.fillStyle = '#EF4444';
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.fillText('Sufriendo cada segundo 💀', 256, 175);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

function createDanceSignTexture() {
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
  ctx.font = '900 72px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('-600 KCAL 🔥', 256, 100);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 28px Inter, sans-serif';
  ctx.fillText('BAILANDO CON AMIGAS 🪩', 256, 165);

  ctx.fillStyle = '#F8C8DC';
  ctx.font = '500 22px Inter, sans-serif';
  ctx.fillText('Endorfinas • Cero aburrimiento', 256, 220);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

const signGymGeo = new THREE.PlaneGeometry(1.65, 0.82);
const signGymMat = new THREE.MeshBasicMaterial({ map: createGymSignTexture(), transparent: true, side: THREE.DoubleSide });
const signGymMesh = new THREE.Mesh(signGymGeo, signGymMat);
// Posicionado a Y = 2.70m con amplio despeje vertical sobre la cabeza (Y=1.85m) y centrado en X=0 (dentro del frustum)
signGymMesh.position.set(0, 2.70, 0.35);
scene.add(signGymMesh);

const signDanceGeo = new THREE.PlaneGeometry(1.75, 1.02);
const signDanceMat = new THREE.MeshBasicMaterial({ map: createDanceSignTexture(), transparent: true, side: THREE.DoubleSide });
const signDanceMesh = new THREE.Mesh(signDanceGeo, signDanceMat);
signDanceMesh.position.set(0, 2.60, 0.2);
signDanceMesh.visible = false;
scene.add(signDanceMesh);

// Personajes
const charCasual = createBedroomGirl();
// Calibrado dinámicamente sobre la banda de la cinta de correr a Y = 0.23m (no fijado en 0.00)
charCasual.root.position.set(0, 0.23, 0.15);
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
  { start: 0.1, end: 4.8, line1: "¿Hacés 45 minutos de cinta mirando una pared", line2: "sufriendo cada segundo?" },
  { start: 4.8, end: 10.6, line1: "El gimnasio tradicional te aburre porque tu cerebro", line2: "necesita música, ritmo y desconexión real." },
  { start: 10.6, end: 17.4, line1: "En una sola clase de baile quemás más de 600 calorías", line2: "sin darte cuenta, saltando y riéndote con amigas." },
  { start: 17.4, end: 19.8, line1: "Cambiá la rutina por danza.", line2: "Tu cuerpo te lo va a agradecer." },
  { start: 19.8, end: 24.8, line1: "Entrá a bailapp.com.ar", line2: "y elegí tu clase de hoy." }
];

window.render = async function(time = 0) {
  stageGym.visible = time < 4.8;
  signGymMesh.visible = time < 4.8;
  charCasual.root.visible = time < 4.8;

  stageSmartphone.visible = time >= 4.8 && time < 17.4;
  signDanceMesh.visible = time >= 4.8 && time < 10.6;

  stageStudio.visible = time >= 17.4 && time < 20.5;
  charHero.root.visible = time >= 17.4;
  charPartner.root.visible = time >= 17.4;

  stagePodium.visible = time >= 20.5;

  if (time < 4.8) {
    const prog = time / 4.8;
    camera.position.set(lerp(-0.4, 0.4, prog), lerp(2.2, 1.9, prog), lerp(7.8, 6.8, prog));
    camera.lookAt(0, 1.15, 0);

    const stepSwing = Math.sin(time * 2.0);
    charCasual.setPose({
      hipsY: -0.04,
      torsoTilt: 0.15,
      headTilt: 0.20, headTurn: -0.10,
      armLX: -0.1, elbowLX: -0.4,
      armRX: -0.1, elbowRX: -0.4,
      legLX: stepSwing * 0.15,
      legRX: -stepSwing * 0.15
    });

    signGymMesh.position.y = 2.70 + Math.sin(time * 2.0) * 0.05;
  } else if (time >= 4.8 && time < 10.6) {
    const phTime = time - 4.8;
    const prog = phTime / 5.8;
    camera.position.set(0, lerp(2.2, 1.8, prog), lerp(7.2, 6.2, prog));
    camera.lookAt(0, 1.4, 0);

    signDanceMesh.visible = true;
    const scale = easeOutBack(clamp(phTime / 0.5, 0, 1));
    signDanceMesh.scale.set(scale, scale, scale);
    signDanceMesh.rotation.y = Math.sin(phTime * 1.2) * 0.05;
  } else if (time >= 10.6 && time < 17.4) {
    const phTime = time - 10.6;
    const prog = phTime / 6.8;
    const angle = lerp(-0.25, 0.35, prog);
    camera.position.set(Math.sin(angle) * 7.5, lerp(2.8, 2.5, prog), Math.cos(angle) * 7.5);
    camera.lookAt(0, 1.4, 0);
  } else if (time >= 17.4 && time < 20.5) {
    const stTime = time - 17.4;
    const prog = stTime / 3.1;
    camera.position.set(lerp(-0.6, 0.6, prog), lerp(2.2, 2.5, prog), lerp(6.8, 7.2, prog));
    camera.lookAt(0, 1.15, 0);

    charHero.updateDance(stTime, 'choreo_videoclip', 1.1);
    charPartner.updateDance(stTime + 0.2, 'choreo_videoclip', 1.1);
  } else {
    const pdTime = time - 20.5;
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

  if (time < 4.8) {
    drawDynamicBadge(ctx, 'FITNESS TRADICIONAL VS DANZA 🏃‍♀️🥱', 0, -42);
    drawFittedText(ctx, '¿Sufriendo en la cinta de correr?', 0, 10, 860, 32, '#1F1D2B');
    drawFittedText(ctx, 'Tu cuerpo necesita endorfinas, música y diversión real', 0, 48, 860, 20, '#6B7280', '500');
  } else if (time >= 4.8 && time < 17.4) {
    drawDynamicBadge(ctx, 'QUEMÁ 600 KCAL BAILANDO CON AMIGAS 🔥', 0, -42);
    drawFittedText(ctx, 'Reggaetón • Heels • Dancehall • Urbano', 0, 10, 860, 32, '#1F1D2B');
    drawFittedText(ctx, 'Entrenar sin darte cuenta mientras la pasás increíble', 0, 48, 860, 20, '#6B7280', '500');
  } else {
    drawDynamicBadge(ctx, 'CAMBIÁ LA RUTINA POR DANZA 📲🪩', 0, -42);
    drawFittedText(ctx, 'Entrá en bailapp.com.ar', 0, 10, 860, 34, '#E06385', '900');
    drawFittedText(ctx, 'Descargá la app y elegí tu clase de hoy en tu barrio', 0, 48, 860, 20, '#1F1D2B', '600');
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
