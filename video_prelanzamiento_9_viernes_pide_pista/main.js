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
// BAILAPP — PRE-LANZAMIENTO 9: VIERNES 19:00 TU CUERPO PIDE PISTA (29.5s)
// ============================================================================

const W = 1080;
const H = 1920;
const CX = W / 2;
const CY = H / 2;
window.DUR = 29.5;

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

// Bailarina en el cuarto/cama (grounding en Y = 0.70 o sentada en borde)
const charCasual = createBedroomGirl();
charCasual.root.position.set(0, 0.70, -0.2); // Contacto en colchón
scene.add(charCasual.root);

// Bailarinas del estudio
const dancerHero = createStudioDancerA();
dancerHero.root.position.set(0, 0, 0);
dancerHero.root.visible = false;
scene.add(dancerHero.root);

const dancerSide = createStudioDancerB();
dancerSide.root.position.set(0.95, 0, -0.35);
dancerSide.root.visible = false;
scene.add(dancerSide.root);

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
  { start: 0.1, end: 6.0, line1: "¿Por qué un viernes a la tarde tu cabeza quiere bailar", line2: "y tu cuerpo sigue atrapado en una silla? 💻😴" },
  { start: 6.0, end: 14.0, line1: "La semana fue larguísima y tu cuerpo pide a gritos", line2: "esa clase de urbano, heels o contempo que venís postergando 🔥" },
  { start: 14.0, end: 21.5, line1: "Muy pronto vas a poder salir de cursar o trabajar", line2: "y reservar tu clase en un toque desde el celular 🎟️📱" },
  { start: 21.5, end: 29.5, line1: "No lo patees más: andá creando tu cuenta en bailapp.com.ar", line2: "y arrobá a tu amiga para arrancar juntas 👇👯‍♀️" }
];

window.render = async function(time = 0) {
  const t = clamp(time, 0, window.DUR);

  const isRoom = t < 6.5;
  const isWhipToStudio = t >= 6.5 && t < 14.5;
  const isChoreoFast = t >= 14.5 && t < 22.0;
  const isCTA = t >= 22.0;

  stageBedroom.visible = isRoom;
  stageStudio.visible = !isRoom && !isCTA;
  stagePodium.visible = isCTA;

  charCasual.root.visible = isRoom;
  dancerHero.root.visible = !isRoom && !isCTA;
  dancerSide.root.visible = !isRoom && !isCTA;

  pod1.root.visible = isCTA;
  pod2.root.visible = isCTA;
  pod3.root.visible = isCTA;

  if (isRoom) {
    // Cámara en el cuarto, plano medio melancólico
    camera.position.x = Math.sin(t * 0.8) * 0.2;
    camera.position.y = 1.45;
    camera.position.z = 4.0;
    camera.lookAt(0, 1.15, 0);

    charCasual.setPose({
      torsoTilt: 0.12,
      headPitch: 0.18,
      armLY: 0.3, armRY: 0.3
    });
  } else if (isWhipToStudio) {
    // Whip pan supersónico de 250ms
    const whipT = clamp((t - 6.5) / 0.25, 0, 1);
    if (whipT < 1.0) {
      camera.position.x = lerp(0.0, 3.5, whipT);
      camera.rotation.y = lerp(0.0, 0.8, whipT);
    } else {
      const prog = (t - 6.75) / 7.75;
      camera.position.x = lerp(-0.8, 0.0, easeInOutCubic(prog));
      camera.position.y = 1.35;
      camera.position.z = lerp(4.6, 3.6, easeInOutCubic(prog));
      camera.rotation.y = 0;
      camera.lookAt(0, 1.25, 0);
    }

    dancerHero.updateDance(t, 'heels', 1.6);
    dancerSide.updateDance(t + 0.3, 'pop', 1.5);
  } else if (isChoreoFast) {
    // Travelling frontal acelerado y órbita
    const prog = (t - 14.5) / 7.5;
    const angle = lerp(-0.6, 0.6, easeInOutCubic(prog));
    const rad = 4.0;
    camera.position.x = Math.sin(angle) * rad;
    camera.position.z = Math.cos(angle) * rad;
    camera.position.y = 1.55 + Math.sin(t * 2.0) * 0.12;
    camera.lookAt(0, 1.25, 0);

    dancerHero.updateDance(t, 'pop', 1.9);
    dancerSide.updateDance(t + 0.2, 'heels', 1.8);
  } else {
    // Podio final
    const prog = clamp((t - 22.0) / 0.5, 0, 1);
    const ease = easeOutExpo(prog);
    camera.position.x = 0;
    camera.position.y = lerp(2.2, 1.75, ease);
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
  ui.fillStyle = '#E06385';
  roundRect(ui, 60, 40, (W - 120) * (t / window.DUR), 8, 4);
  ui.fill();

  // Badge superior
  drawBadgePill(ui, 'VIERNES DE DANZA 🇦🇷', CX, 110, {
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
    fitTextInBox(ui, 'ANDÁ CREANDO TU CUENTA GRATIS 👇', cardX, cardY + 20, cardW, 40, 32, 20);

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
