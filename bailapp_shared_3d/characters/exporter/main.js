import * as THREE from './three.module.js';
import { createLowPolyMaterial } from './character_builder.js';
import {
  createBedroomGirl,
  createStudioDancerA,
  createStudioDancerB,
  createStudioDancerC
} from './character_presets.js';

const W = 1080;
const H = 1920;
const CX = W / 2;

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

// Lighting
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
const stageGeo = new THREE.CylinderGeometry(3.2, 3.4, 0.2, 32);
const stageMat = createLowPolyMaterial('#FAD2E1', 0.85);
const stage = new THREE.Mesh(stageGeo, stageMat);
stage.position.y = -0.1;
stage.receiveShadow = true;
scene.add(stage);

// Characters
const chars = [
  {
    id: 'raspberry_diva',
    title: 'Raspberry Diva (Hero Principal)',
    sub: 'Crop Top Frambuesa • Biker Shorts • Ojos y Boca 3D',
    instance: createStudioDancerA(),
    pose: {
      hipsY: 0.02, hipSway: 0.08, torsoSway: -0.04,
      armLX: -0.32, armLZ: -0.35, elbowLX: -0.55,
      armRX: -0.15, armRZ: 0.38, elbowRX: -0.85,
      headTilt: -0.03, headTurn: 0.04,
      legLX: -0.08, legLZ: -0.06, legRX: 0.10, legLZ: 0.06,
    }
  },
  {
    id: 'bedroom_girl',
    title: 'Bedroom Practice (Bailarina Casera)',
    sub: 'Buzo Oversize Carbón • Jogger Pastel • Ojos y Boca 3D',
    instance: createBedroomGirl(),
    pose: {
      hipsY: -0.02, hipSway: -0.06, torsoTilt: 0.08,
      armLX: 0.15, armLZ: -0.25, elbowLX: -0.4,
      armRX: -0.35, armRZ: 0.30, elbowRX: -0.6,
      headTilt: 0.04, headTurn: -0.10,
      legLX: 0.08, legLZ: -0.05, legRX: -0.08, legLZ: 0.05,
    }
  },
  {
    id: 'lavender_kpop',
    title: 'Lavender K-Pop (Coreografía Dinámica)',
    sub: 'Top Lila • Shorts Pastel • Coleta Alta • Ojos y Boca 3D',
    instance: createStudioDancerB(),
    pose: {
      hipsY: 0.03, hipSway: 0.10, torsoSway: -0.05,
      armLX: -0.45, armLZ: -0.40, elbowLX: -0.9,
      armRX: 0.20, armRZ: 0.25, elbowRX: -0.3,
      headTilt: -0.04, headTurn: 0.12,
      legLX: -0.12, legLZ: -0.08, legRX: 0.08, legLZ: 0.08,
    }
  },
  {
    id: 'mint_urban',
    title: 'Mint Urban Heels (Estilo Comercial)',
    sub: 'Top Verde Menta • Shorts Nude • Bob Cut • Ojos y Boca 3D',
    instance: createStudioDancerC(),
    pose: {
      hipsY: 0.01, hipSway: -0.08, torsoSway: 0.04,
      armLX: 0.10, armLZ: -0.22, elbowLX: -0.5,
      armRX: -0.40, armRZ: 0.42, elbowRX: -0.95,
      headTilt: 0.05, headTurn: -0.08,
      legLX: 0.10, legLZ: -0.06, legRX: -0.10, legLZ: 0.06,
    }
  }
];

// Add all to scene hidden initially
chars.forEach(c => {
  c.instance.setPose(c.pose);
  c.instance.root.visible = false;
  scene.add(c.instance.root);
});

// Dual Cameras: Close-Up and Full-Body
const cameraCloseup = new THREE.PerspectiveCamera(26, W / (H * 0.52), 0.1, 50);
cameraCloseup.position.set(0.06, 1.62, 1.35);
cameraCloseup.lookAt(0, 1.58, 0);

const cameraFull = new THREE.PerspectiveCamera(32, W / (H * 0.48), 0.1, 50);
cameraFull.position.set(0.0, 1.05, 3.4);
cameraFull.lookAt(0, 0.95, 0);

// Lineup Camera
const cameraLineup = new THREE.PerspectiveCamera(36, W / H, 0.1, 50);
cameraLineup.position.set(0.0, 1.35, 4.4);
cameraLineup.lookAt(0, 0.95, 0);

const uiCanvas = document.getElementById('ui');
const ctx = uiCanvas.getContext('2d');

function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
  c.closePath();
}

window.render = async function(t = 0) {
  const mode = Math.floor(t);

  chars.forEach(c => c.instance.root.visible = false);

  if (mode < 4) {
    // Individual character showcase (Close-up + Full Body)
    const currentChar = chars[mode];
    currentChar.instance.root.visible = true;
    currentChar.instance.root.position.set(0, 0, 0);
    currentChar.instance.root.rotation.y = 0.08;

    renderer.autoClear = false;
    renderer.clear();
    renderer.setScissorTest(true);

    const topY = Math.round(H * 0.46);
    const topH = H - topY;
    renderer.setViewport(0, topY, W, topH);
    renderer.setScissor(0, topY, W, topH);
    renderer.render(scene, cameraCloseup);

    const botH = topY;
    renderer.setViewport(0, 0, W, botH);
    renderer.setScissor(0, 0, W, botH);
    renderer.render(scene, cameraFull);

    renderer.setScissorTest(false);

    // 2D UI Overlay
    ctx.clearRect(0, 0, W, H);

    // Header Card
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

    ctx.fillStyle = '#E06385';
    roundRect(ctx, -210, -52, 420, 32, 12);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CATÁLOGO DE PERSONAJES 3D BAILAPP ✨', 0, -36);

    ctx.fillStyle = '#1F1D2B';
    ctx.font = 'bold 30px Inter, sans-serif';
    ctx.fillText(currentChar.title, 0, 12);

    ctx.fillStyle = '#6B7280';
    ctx.font = '500 20px Inter, sans-serif';
    ctx.fillText(currentChar.sub, 0, 44);
    ctx.restore();

    // Floating badges
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.strokeStyle = '#FCE7F0';
    ctx.lineWidth = 2;

    roundRect(ctx, 40, 420, 260, 68, 16);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#1F1D2B';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('👀 Ojos 3D Limpios', 58, 448);
    ctx.fillStyle = '#E06385';
    ctx.font = '600 15px Inter, sans-serif';
    ctx.fillText('Esclera + Iris + Brillo', 58, 472);

    roundRect(ctx, W - 300, 420, 260, 68, 16);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#1F1D2B';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.fillText('👄 Sonrisa 3D Coral', W - 282, 448);
    ctx.fillStyle = '#E06385';
    ctx.font = '600 15px Inter, sans-serif';
    ctx.fillText('Arco Torus + Dientes blancos', W - 282, 472);
    ctx.restore();

    // Divider
    ctx.save();
    ctx.strokeStyle = '#FAD2E1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(60, topY);
    ctx.lineTo(W - 60, topY);
    ctx.stroke();

    ctx.fillStyle = '#E06385';
    roundRect(ctx, CX - 180, topY - 20, 360, 40, 20);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('VISTA DE CUERPO ENTERO Y POSTURA', CX, topY);
    ctx.restore();

    // Footer
    ctx.save();
    ctx.translate(CX, H - 90);
    ctx.fillStyle = '#1F1D2B';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 20;
    roundRect(ctx, -480, -60, 960, 120, 22);
    ctx.fill();
    ctx.fillStyle = '#F8C8DC';
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ESPECIFICACIONES DE MODELADO LOW-POLY:', 0, -26);
    ctx.fillStyle = '#F9FAFB';
    ctx.font = '500 19px Inter, sans-serif';
    ctx.fillText('Pies en piso real (Y = 0.00) • Suela chunky • Geometría orgánica facetada', 0, 6);
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '500 16px Inter, sans-serif';
    ctx.fillText('Sin planos cuadrados 2D • Flat Shading puro • Almacenado en bailapp_shared_3d', 0, 34);
    ctx.restore();
  } else {
    // Mode 4: Full Lineup
    const positions = [-1.5, -0.5, 0.5, 1.5];
    chars.forEach((c, idx) => {
      c.instance.root.visible = true;
      c.instance.root.position.set(positions[idx] * 0.95, 0, (idx === 1 || idx === 2) ? 0.2 : -0.1);
      c.instance.root.rotation.y = positions[idx] * -0.15;
    });

    renderer.autoClear = true;
    renderer.setViewport(0, 0, W, H);
    renderer.render(scene, cameraLineup);

    ctx.clearRect(0, 0, W, H);

    ctx.save();
    ctx.translate(CX, 140);
    ctx.fillStyle = '#FFFFFF';
    roundRect(ctx, -460, -75, 920, 150, 24);
    ctx.fill();
    ctx.strokeStyle = '#FAD2E1';
    ctx.lineWidth = 3;
    roundRect(ctx, -460, -75, 920, 150, 24);
    ctx.stroke();

    ctx.fillStyle = '#E06385';
    roundRect(ctx, -210, -62, 420, 32, 12);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('LINEUP COMPLETO DE PERSONAJES 3D ✨', 0, -46);

    ctx.fillStyle = '#1F1D2B';
    ctx.font = 'bold 32px Inter, sans-serif';
    ctx.fillText('Elenco Oficial Bailapp Low-Poly', 0, 10);

    ctx.fillStyle = '#6B7280';
    ctx.font = '500 20px Inter, sans-serif';
    ctx.fillText('4 Modelos Modulares Listos para Nuevos Guiones Virales', 0, 44);
    ctx.restore();

    // Footer
    ctx.save();
    ctx.translate(CX, H - 120);
    ctx.fillStyle = '#1F1D2B';
    roundRect(ctx, -460, -60, 920, 120, 22);
    ctx.fill();
    ctx.fillStyle = '#F8C8DC';
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SISTEMA MODULAR COMPARTIDO: bailapp_shared_3d/characters', 0, -22);
    ctx.fillStyle = '#F9FAFB';
    ctx.font = '500 18px Inter, sans-serif';
    ctx.fillText('Todos los modelos comparten proporciones, piso calibrado y rigging', 0, 10);
    ctx.restore();
  }
};

window.render(0);
window.READY = true;
