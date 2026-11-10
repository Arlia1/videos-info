import * as THREE from './three.module.js';
import { createLowPolyMaterial } from './lib/character_builder.js';
import { createStudioDancerA } from './lib/character_presets.js';

const W = 1080;
const H = 1920;
const CX = W / 2;

// 1. Scene & Renderer
const webglCanvas = document.getElementById('webgl');
const renderer = new THREE.WebGLRenderer({
  canvas: webglCanvas,
  antialias: true,
  preserveDrawingBuffer: true,
});
renderer.setSize(W, H);
renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#FFF5F8');

// Lighting for Character Showcase
const hemiLight = new THREE.HemisphereLight('#FFF0F5', '#E2CFD8', 1.25);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight('#FFFBF0', 1.4);
dirLight.position.set(4, 8, 6);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.bias = -0.0004;
scene.add(dirLight);

const rimLight = new THREE.DirectionalLight('#FAD2E1', 0.9);
rimLight.position.set(-5, 5, -3);
scene.add(rimLight);

const fillLight = new THREE.DirectionalLight('#FFF0F5', 0.5);
fillLight.position.set(0, 2, 4);
scene.add(fillLight);

// Pedestal Stage
const stageGeo = new THREE.CylinderGeometry(2.2, 2.4, 0.2, 32);
const stageMat = createLowPolyMaterial('#FAD2E1', 0.85);
const stage = new THREE.Mesh(stageGeo, stageMat);
stage.position.y = -0.1;
stage.receiveShadow = true;
scene.add(stage);

// Hero Character: Raspberry Diva
const hero = createStudioDancerA({
  irisColor: '#3A2016'
});
hero.root.position.set(0, 0, 0);
hero.root.rotation.y = 0.08; // Slight 3/4 turn towards camera
scene.add(hero.root);

// Confident, expressive pose
hero.setPose({
  hipsY: 0.02,
  hipSway: 0.08,
  torsoSway: -0.04,
  armLX: -0.32, armLZ: -0.35, elbowLX: -0.55,
  armRX: -0.15, armRZ: 0.38, elbowRX: -0.85,
  headTilt: -0.03, headTurn: 0.04,
  legLX: -0.08, legLZ: -0.06,
  legRX: 0.10, legLZ: 0.06,
});

// Two Cameras for the Dual Approval Presentation:
// 1. Camera Close-Up (Face & Bust Portrait)
const cameraCloseup = new THREE.PerspectiveCamera(26, W / (H * 0.52), 0.1, 50);
cameraCloseup.position.set(0.08, 1.62, 1.35);
cameraCloseup.lookAt(0, 1.58, 0);

// 2. Camera Full Body
const cameraFull = new THREE.PerspectiveCamera(32, W / (H * 0.48), 0.1, 50);
cameraFull.position.set(0.0, 1.05, 3.4);
cameraFull.lookAt(0, 0.95, 0);

// 2. UI Overlay Canvas
const uiCanvas = document.getElementById('ui');
const ctx = uiCanvas.getContext('2d');

function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
  c.closePath();
}

window.render = async function(t = 0) {
  renderer.autoClear = false;
  renderer.clear();
  renderer.setScissorTest(true);

  // Top Viewport: Hero Close-Up (Face & Bust Portrait)
  // In WebGL, (0, 0) is bottom-left
  const topY = Math.round(H * 0.46);
  const topH = H - topY;
  renderer.setViewport(0, topY, W, topH);
  renderer.setScissor(0, topY, W, topH);
  renderer.render(scene, cameraCloseup);

  // Bottom Viewport: Full Body Presentation
  const botH = topY;
  renderer.setViewport(0, 0, W, botH);
  renderer.setScissor(0, 0, W, botH);
  renderer.render(scene, cameraFull);

  renderer.setScissorTest(false);

  // --- UI OVERLAYS ---
  ctx.clearRect(0, 0, W, H);

  // Top Header Card
  ctx.save();
  ctx.translate(CX, 105);

  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(224, 99, 133, 0.25)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 6;
  roundRect(ctx, -480, -65, 960, 130, 24);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  ctx.strokeStyle = '#FAD2E1';
  ctx.lineWidth = 2.5;
  roundRect(ctx, -480, -65, 960, 130, 24);
  ctx.stroke();

  // Badge Chip
  ctx.fillStyle = '#E06385';
  roundRect(ctx, -210, -52, 420, 32, 12);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('NUEVO ROSTRO 100% 3D MINIMALISTA ✨', 0, -36);

  ctx.fillStyle = '#1F1D2B';
  ctx.font = 'bold 30px Inter, sans-serif';
  ctx.fillText('Diseño Simple y Limpio: Solo Ojos y Boca', 0, 12);

  ctx.fillStyle = '#6B7280';
  ctx.font = '500 20px Inter, sans-serif';
  ctx.fillText('Estética Low-Poly estilizada pura • Sin sobrecarga • Máxima claridad', 0, 44);
  ctx.restore();

  // Floating Face Feature Callouts (Left & Right)
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.strokeStyle = '#FCE7F0';
  ctx.lineWidth = 2;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
  ctx.shadowBlur = 12;

  // Eye detail chip
  roundRect(ctx, 40, 420, 260, 68, 16);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#1F1D2B';
  ctx.font = 'bold 18px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('👀 Ojos 3D Limpios', 58, 448);
  ctx.fillStyle = '#E06385';
  ctx.font = '600 15px Inter, sans-serif';
  ctx.fillText('Esclera blanca + Iris + Brillo', 58, 472);

  // Smile detail chip
  roundRect(ctx, W - 300, 420, 260, 68, 16);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#1F1D2B';
  ctx.font = 'bold 18px Inter, sans-serif';
  ctx.fillText('👄 Sonrisa Radiante 3D', W - 282, 448);
  ctx.fillStyle = '#E06385';
  ctx.font = '600 15px Inter, sans-serif';
  ctx.fillText('Arco coral 3D + Dientes blancos', W - 282, 472);

  ctx.restore();

  // Middle Divider Bar separating Top Closeup and Bottom Full Body
  const dividerY = topY;
  ctx.save();
  ctx.strokeStyle = '#FAD2E1';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(60, dividerY);
  ctx.lineTo(W - 60, dividerY);
  ctx.stroke();

  // Central Divider Badge
  ctx.fillStyle = '#E06385';
  roundRect(ctx, CX - 180, dividerY - 20, 360, 40, 20);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VISTA DE CUERPO ENTERO Y POSTURA', CX, dividerY);
  ctx.restore();

  // Bottom Footer Specs Card
  ctx.save();
  ctx.translate(CX, H - 90);

  ctx.fillStyle = '#1F1D2B';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 4;
  roundRect(ctx, -480, -60, 960, 120, 22);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  ctx.strokeStyle = '#E06385';
  ctx.lineWidth = 2;
  roundRect(ctx, -480, -60, 960, 120, 22);
  ctx.stroke();

  ctx.fillStyle = '#F8C8DC';
  ctx.font = 'bold 20px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ESPECIFICACIONES DE CALIDAD APROBADAS:', 0, -28);

  ctx.fillStyle = '#F9FAFB';
  ctx.font = '500 19px Inter, sans-serif';
  ctx.fillText('Pies 100% apoyados en piso (Y = 0.00) • Suela chunky • Proporción atlética orgánica', 0, 5);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '500 16px Inter, sans-serif';
  ctx.fillText('Listo para generar el video viral completo tras tu aprobación.', 0, 34);
  ctx.restore();
};

window.render(0);
window.READY = true;
