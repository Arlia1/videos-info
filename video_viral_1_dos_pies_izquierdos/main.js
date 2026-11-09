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
// BAILAPP — VIDEO VIRAL 1: "EL MITO DE LOS DOS PIES IZQUIERDOS" (25s)
// ============================================================================
// - Rostros 100% 3D minimalistas (solo ojos y boca limpios).
// - Pies apoyados en el piso real (Y = 0.00).
// - Carteles flotantes 3D con texto nítido.
// - Cámara dinámica continua y sincronización con beat.
// ============================================================================

const W = 1080;
const H = 1920;
const CX = W / 2;
const CY = H / 2;
window.DUR = 25.0;

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
camera.position.set(0, 2.3, 7.6);
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
stageStudio.visible = false;
scene.add(stageStudio);

const phoneObj = createStageSmartphone();
const stageSmartphone = phoneObj.stage;
stageSmartphone.visible = false;
scene.add(stageSmartphone);

const stagePodium = createStagePodium();
stagePodium.visible = false;
scene.add(stagePodium);

// ----------------------------------------------------------------------------
// 3. CARTELES FLOTANTES 3D CON TEXTO REAL
// ----------------------------------------------------------------------------
function createFeetSignTexture() {
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
  ctx.fillText('EL MIEDO NÚMERO 1 🙈', 256, 56);

  ctx.fillStyle = '#1F1D2B';
  ctx.font = 'bold 36px Inter, sans-serif';
  ctx.fillText('¿Dos pies izquierdos? 🦶', 256, 125);
  ctx.fillStyle = '#6B7280';
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.fillText('"No sé bailar nada..."', 256, 175);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

function createStat80Texture() {
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
  ctx.font = '900 78px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('80%', 256, 105);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 30px Inter, sans-serif';
  ctx.fillText('ARRANCA DESDE CERO ✨', 256, 165);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '500 22px Inter, sans-serif';
  ctx.fillText('Nadie te juzga • Clases sin nivel previo', 256, 220);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = true;
  return tex;
}

// 3D Sign Meshes
const signFeetGeo = new THREE.PlaneGeometry(1.9, 0.95);
const signFeetMat = new THREE.MeshBasicMaterial({ map: createFeetSignTexture(), transparent: true, side: THREE.DoubleSide });
const signFeetMesh = new THREE.Mesh(signFeetGeo, signFeetMat);
signFeetMesh.position.set(0.7, 2.15, 0.6);
scene.add(signFeetMesh);

const signStatGeo = new THREE.PlaneGeometry(2.1, 1.25);
const signStatMat = new THREE.MeshBasicMaterial({ map: createStat80Texture(), transparent: true, side: THREE.DoubleSide });
const signStatMesh = new THREE.Mesh(signStatGeo, signStatMat);
signStatMesh.position.set(0, 2.2, 0);
signStatMesh.visible = false;
scene.add(signStatMesh);

// ----------------------------------------------------------------------------
// 4. PERSONAJES 3D LOW-POLY
// ----------------------------------------------------------------------------
// Personaje 1: Bailarina en el cuarto (Bedroom Girl)
const charCasual = createBedroomGirl();
charCasual.root.position.set(0, 0, 0.2);
scene.add(charCasual.root);

// Personaje 2: Hero Estudio (Raspberry Diva)
const charHero = createStudioDancerA();
charHero.root.position.set(-0.65, 0, 0.1);
charHero.root.visible = false;
scene.add(charHero.root);

// Personaje 3: Partner Estudio (Lavender K-Pop)
const charPartner = createStudioDancerB();
charPartner.root.position.set(0.65, 0, 0.1);
charPartner.root.visible = false;
scene.add(charPartner.root);

// ----------------------------------------------------------------------------
// 5. CANVAS 2D UI OVERLAY
// ----------------------------------------------------------------------------
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

// Subtitles
const subtitles = [
  { start: 0.1, end: 3.9, line1: "¿Pensás que tenés dos pies izquierdos", line2: "y que bailar no es para vos?" },
  { start: 3.9, end: 7.4, line1: "Todas arrancamos creyendo", line2: "que íbamos a pasar vergüenza..." },
  { start: 7.4, end: 11.9, line1: "Pero en Bailapp el 80% de las personas", line2: "nunca antes pisó un salón." },
  { start: 11.9, end: 15.8, line1: "Filtrás por clases desde cero en tu barrio,", line2: "reservás tu lugar en diez segundos..." },
  { start: 15.8, end: 19.9, line1: "...y descubrís que la vergüenza", line2: "se va en los primeros diez minutos." },
  { start: 19.9, end: 24.8, line1: "Entrá a bailapp.com.ar", line2: "y reservá tu clase hoy." }
];

// ----------------------------------------------------------------------------
// 6. RENDER LOOP
// ----------------------------------------------------------------------------
window.render = async function(time = 0) {
  // Manejo de visibilidad de escenarios
  stageBedroom.visible = time < 7.4;
  signFeetMesh.visible = time < 7.4;
  charCasual.root.visible = time < 7.4;

  stageSmartphone.visible = time >= 7.4 && time < 16.5;
  signStatMesh.visible = time >= 7.4 && time < 11.9;

  stageStudio.visible = time >= 16.5 && time < 21.5;
  charHero.root.visible = time >= 16.5;
  charPartner.root.visible = time >= 16.5;

  stagePodium.visible = time >= 21.5;

  // Cámara dinámica y animación por escena
  if (time < 7.4) {
    // Escena 1: Cuarto y tropezón torpe
    const prog = time / 7.4;
    camera.position.set(lerp(-0.4, 0.4, prog), lerp(2.2, 1.9, prog), lerp(7.8, 6.8, prog));
    camera.lookAt(0, 1.15, 0);

    // Animación de torpeza cómica
    const stepSwing = Math.sin(time * 3.5);
    charCasual.setPose({
      hipsY: -0.04,
      hipSway: stepSwing * 0.15,
      torsoTilt: 0.18,
      headTilt: 0.22, headTurn: -0.15,
      armLX: -0.2, elbowLX: -0.8,
      armRX: 0.3, elbowRX: -0.4,
      legLX: stepSwing * 0.25,
      legRX: -stepSwing * 0.25
    });

    signFeetMesh.position.y = 2.1 + Math.sin(time * 2.0) * 0.05;
    signFeetMesh.rotation.y = Math.sin(time * 1.5) * 0.08;
  } else if (time >= 7.4 && time < 11.9) {
    // Escena 2: Revelación de la estadística 80%
    const phTime = time - 7.4;
    const prog = phTime / 4.5;
    camera.position.set(0, lerp(2.2, 1.8, prog), lerp(7.2, 6.2, prog));
    camera.lookAt(0, 1.4, 0);

    signStatMesh.visible = true;
    const scale = easeOutBack(clamp(phTime / 0.5, 0, 1));
    signStatMesh.scale.set(scale, scale, scale);
    signStatMesh.rotation.y = Math.sin(phTime * 1.2) * 0.05;
  } else if (time >= 11.9 && time < 16.5) {
    // Escena 3: Smartphone 3D giratorio
    const phTime = time - 11.9;
    const prog = phTime / 4.6;
    const angle = lerp(-0.25, 0.35, prog);
    camera.position.set(Math.sin(angle) * 7.5, lerp(2.8, 2.5, prog), Math.cos(angle) * 7.5);
    camera.lookAt(0, 1.4, 0);
  } else if (time >= 16.5 && time < 21.5) {
    // Escena 4: Estudio de danza enérgico
    const stTime = time - 16.5;
    const prog = stTime / 5.0;
    camera.position.set(lerp(-0.6, 0.6, prog), lerp(2.2, 2.5, prog), lerp(6.8, 7.2, prog));
    camera.lookAt(0, 1.15, 0);

    charHero.updateDance(stTime, 'choreo_videoclip', 1.05);
    charPartner.updateDance(stTime + 0.2, 'choreo_videoclip', 1.05);
  } else {
    // Escena 5: Podio y celebración
    const pdTime = time - 21.5;
    const prog = pdTime / 3.5;
    camera.position.set(0, lerp(2.4, 3.6, prog), lerp(7.2, 8.0, prog));
    camera.lookAt(0, 1.35, 0);

    stagePodium.rotation.y = pdTime * 0.15;
    charHero.updateDance(pdTime, 'celebrate_victory', 1.0);
    charPartner.updateDance(pdTime + 0.15, 'celebrate_victory', 0.95);
  }

  renderer.render(scene, camera);

  // --------------------------------------------------------------------------
  // UI 2D OVERLAYS
  // --------------------------------------------------------------------------
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

  if (time < 7.4) {
    drawDynamicBadge(ctx, 'EL MITO DE LOS DOS PIES IZQUIERDOS 🦶🙈', 0, -42);
    drawFittedText(ctx, '¿Sentís que el baile no es para vos?', 0, 10, 860, 32, '#1F1D2B');
    drawFittedText(ctx, 'El 90% arranca con el mismo miedo a pasar vergüenza', 0, 48, 860, 20, '#6B7280', '500');
  } else if (time >= 7.4 && time < 16.5) {
    drawDynamicBadge(ctx, 'CLASES PARA PRINCIPIANTES DESDE CERO ✨', 0, -42);
    drawFittedText(ctx, 'Cero Juicios • Solo Ganas de Divertirse', 0, 10, 860, 32, '#1F1D2B');
    drawFittedText(ctx, 'Filtrás por tu barrio y asegurás tu lugar en segundos', 0, 48, 860, 20, '#6B7280', '500');
  } else if (time >= 16.5 && time < 21.5) {
    drawDynamicBadge(ctx, 'A LOS 10 MINUTOS SE FUE LA TIMIDEZ 🔥', 0, -42);
    drawFittedText(ctx, 'La Música y la Buena Onda Hacen Magia', 0, 10, 860, 32, '#1F1D2B');
    drawFittedText(ctx, 'Estudios con piso de madera, espejos gigantes y alta crew', 0, 48, 860, 20, '#6B7280', '500');
  } else {
    drawDynamicBadge(ctx, 'DA EL PRIMER PASO HOY 📲🩰', 0, -42);
    drawFittedText(ctx, 'Entrá en bailapp.com.ar', 0, 10, 860, 34, '#E06385', '900');
    drawFittedText(ctx, 'Descargá la app gratis y encontrá tu primera clase', 0, 48, 860, 20, '#1F1D2B', '600');
  }
  ctx.restore();

  // Subtitles Capsule
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
