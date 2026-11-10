import * as THREE from './shared/three.module.js';
import {
  createBedroomGirl,
  createStudioDancerA,
  createStudioDancerB,
  createStudioDancerC
} from './shared/characters/character_presets.js';
import { createStageStudio } from './shared/stages/stage_studio.js';
import { createStagePodium } from './shared/stages/stage_podium.js';

// ============================================================================
// BAILAPP — PRE-LANZAMIENTO 6: EL TEST ULTRA RÁPIDO DE ESTILOS (28.0s)
// ============================================================================

const W = 1080;
const H = 1920;
const CX = W / 2;
const CY = H / 2;
window.DUR = 28.0;

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
camera.position.set(0, 1.4, 3.8);
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
// ESCENARIOS Y PROPS
// ----------------------------------------------------------------------------
const studioObj = createStageStudio();
const stageStudio = studioObj.stage;
const subwoofers = studioObj.subwoofers;
scene.add(stageStudio);

const stagePodium = createStagePodium();
stagePodium.visible = false;
scene.add(stagePodium);

// ----------------------------------------------------------------------------
// PERSONAJES (5 Estilos: Urbano, Heels, Contempo, Clásico, K-Pop)
// ----------------------------------------------------------------------------
// Bailarina Hero A (Urbano / Heels)
const dancerHero = createStudioDancerA();
dancerHero.root.position.set(0, 0, 0);
scene.add(dancerHero.root);

// Bailarina B (K-Pop)
const dancerKPop = createStudioDancerB();
dancerKPop.root.position.set(0.95, 0, -0.4);
dancerKPop.root.visible = false;
scene.add(dancerKPop.root);

// Bailarina C (Contemporáneo / Clásico)
const dancerContempo = createStudioDancerC();
dancerContempo.root.position.set(-0.95, 0, -0.4);
dancerContempo.root.visible = false;
scene.add(dancerContempo.root);

// Podio final (3 bailarinas)
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

// ----------------------------------------------------------------------------
// CARTELES 3D CON CONTENCIÓN ESTRICTA DE TEXTO
// ----------------------------------------------------------------------------
function createStyleCardsTexture() {
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
  ctx.fillText('5 ESTILOS DE DANZA ⚡', 256, 55);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px Inter, sans-serif';
  ctx.fillText('Urbano • Heels • Contempo', 256, 115);
  ctx.fillText('Danza Clásica • K-Pop Choreo', 256, 160);

  ctx.fillStyle = '#FAD2E1';
  ctx.font = '19px Inter, sans-serif';
  ctx.fillText('Todas las academias de Argentina 🇦🇷', 256, 220);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

const signStylesGeo = new THREE.PlaneGeometry(2.2, 1.2);
const signStylesMat = new THREE.MeshBasicMaterial({ map: createStyleCardsTexture(), transparent: true, side: THREE.DoubleSide });
const signStylesMesh = new THREE.Mesh(signStylesGeo, signStylesMat);
signStylesMesh.position.set(0, 2.35, 0.2); // Despeje vertical seguro sobre coronilla
scene.add(signStylesMesh);

// ----------------------------------------------------------------------------
// 2D OVERLAY CANVAS & SAFE TEXT FIT
// ----------------------------------------------------------------------------
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
  const paddingX = boxW * 0.12; // 12% padding lateral
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
  { start: 0.1, end: 6.5, line1: "¿Naciste para el clásico, el urbano", line2: "o para romper la pista en tacos de heels? 👠🔥" },
  { start: 6.5, end: 14.5, line1: "No importa si vas por el flow del K-Pop o el contemporáneo:", line2: "se viene una nueva forma de elegir cómo y dónde bailar ✨" },
  { start: 14.5, end: 21.5, line1: "Muy pronto vas a poder reservar tu lugar", line2: "en cualquier estudio del país en menos de 10 segundos ⏱️⚡" },
  { start: 21.5, end: 28.0, line1: "Andá creando tu cuenta en bailapp.com.ar", line2: "y arrobá a tu estudio para que no se quede afuera 👇" }
];

// ----------------------------------------------------------------------------
// RENDER LOOP
// ----------------------------------------------------------------------------
window.render = async function(time = 0) {
  const t = clamp(time, 0, window.DUR);

  const isIntro = t < 7.5;
  const isOrbit = t >= 7.5 && t < 16.5;
  const isChoreo = t >= 16.5 && t < 22.5;
  const isCTA = t >= 22.5;

  stageStudio.visible = !isCTA;
  stagePodium.visible = isCTA;
  signStylesMesh.visible = isOrbit;

  dancerHero.root.visible = !isCTA;
  dancerKPop.root.visible = isOrbit || isChoreo;
  dancerContempo.root.visible = isOrbit || isChoreo;

  pod1.root.visible = isCTA;
  pod2.root.visible = isCTA;
  pod3.root.visible = isCTA;

  // CÁMARA ULTRA RÁPIDA Y CINEMÁTICA
  if (isIntro) {
    // Whip-in rápido en los primeros 400ms y snap cuts
    const prog = clamp(t / 0.45, 0, 1);
    const ease = easeOutExpo(prog);
    camera.position.x = lerp(1.8, 0.0, ease);
    camera.position.y = lerp(1.9, 1.35, ease);
    camera.position.z = lerp(4.8, 3.4, ease);
    camera.lookAt(0, 1.25, 0);

    // Swap rítmico de poses al compás (cada 0.8s)
    const beatPhase = Math.floor(t / 0.8) % 4;
    dancerHero.updateDance(t, beatPhase % 2 === 0 ? 'heels' : 'pop', 1.8);
  } else if (isOrbit) {
    // Órbita rápida de 120 grados
    const prog = (t - 7.5) / 9.0;
    const angle = lerp(-0.6, 0.8, easeInOutCubic(prog));
    const rad = 4.2;
    camera.position.x = Math.sin(angle) * rad;
    camera.position.z = Math.cos(angle) * rad;
    camera.position.y = 1.45 + Math.sin(t * 1.5) * 0.15;
    camera.lookAt(0, 1.25, 0);

    dancerHero.updateDance(t, 'heels', 1.4);
    dancerKPop.updateDance(t + 0.3, 'pop', 1.5);
    dancerContempo.updateDance(t + 0.6, 'vogue', 1.3);

    // Oscilación suave del cartel flotante
    signStylesMesh.position.y = 2.35 + Math.sin(t * 2.0) * 0.06;
  } else if (isChoreo) {
    // Snap zoom hacia el centro del estudio
    const prog = clamp((t - 16.5) / 0.5, 0, 1);
    const ease = easeOutExpo(prog);
    camera.position.x = lerp(0.5, 0.0, ease);
    camera.position.y = lerp(1.6, 1.25, ease);
    camera.position.z = lerp(4.0, 3.1, ease);
    camera.lookAt(0, 1.15, 0);

    dancerHero.updateDance(t * 1.2, 'pop', 2.0);
    dancerKPop.updateDance(t * 1.2 + 0.2, 'pop', 2.0);
    dancerContempo.updateDance(t * 1.2 + 0.4, 'pop', 2.0);
  } else {
    // Dolly out rápido al podio final
    const prog = clamp((t - 22.5) / 0.6, 0, 1);
    const ease = easeOutExpo(prog);
    camera.position.x = 0;
    camera.position.y = lerp(2.2, 1.75, ease);
    camera.position.z = lerp(6.5, 5.2, ease);
    camera.lookAt(0, 1.2, 0);

    pod1.updateDance(t, 'heels', 1.2);
    pod2.updateDance(t + 0.2, 'pop', 1.2);
    pod3.updateDance(t + 0.4, 'vogue', 1.2);
  }

  // Pulsación rítmica de subwoofers
  if (subwoofers && stageStudio.visible) {
    const pulse = 1.0 + Math.max(0, Math.sin(t * 13.0)) * 0.14;
    subwoofers.forEach(sub => sub.scale.set(1, pulse, 1));
  }

  renderer.render(scene, camera);

  // --------------------------------------------------------------------------
  // DIBUJO DE INTERFAZ 2D (SAFE ZONES & CERO DESBORDES)
  // --------------------------------------------------------------------------
  ui.clearRect(0, 0, W, H);

  // 1. Barra de progreso superior
  ui.fillStyle = 'rgba(255, 255, 255, 0.35)';
  roundRect(ui, 60, 40, W - 120, 8, 4);
  ui.fill();
  ui.fillStyle = '#E06385';
  roundRect(ui, 60, 40, (W - 120) * (t / window.DUR), 8, 4);
  ui.fill();

  // 2. Badge superior
  drawBadgePill(ui, 'PRE-LANZAMIENTO OFICIAL 🇦🇷', CX, 110, {
    bg: 'rgba(31, 29, 43, 0.90)',
    fg: '#FFFFFF',
    font: 'bold 24px Inter, sans-serif'
  });

  // 3. Subtítulos dinámicos con contenedor seguro
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

  // 4. Tarjeta permanente o botón CTA
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

    // Botón web destacado
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
    // Chip discreto inferior
    drawBadgePill(ui, 'bailapp.com.ar • Argentina', CX, 1820, {
      bg: 'rgba(255, 255, 255, 0.90)',
      fg: '#2D242E',
      font: 'bold 22px Inter, sans-serif'
    });
  }
};

window.READY = true;
