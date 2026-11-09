// ============================================================================
// BAILAPP 3D SHARED ASSET LIBRARY: STAGE SMARTPHONE (APP SHOWCASE 3D)
// ============================================================================

import * as THREE from '../three.module.js';
import { createLowPolyMaterial } from '../characters/character_builder.js';

export function createStageSmartphone() {
  const stage = new THREE.Group();

  // 1. Base pedestal suave
  const baseGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.25, 20);
  const baseMat = createLowPolyMaterial('#FCE7F0', 0.85);
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = -0.125;
  base.receiveShadow = true;
  stage.add(base);

  // 2. Chasis del Smartphone iPhone 3D facetado
  const phoneGroup = new THREE.Group();
  phoneGroup.position.set(0, 1.45, 0);
  stage.add(phoneGroup);

  // Cuerpo metálico / chasis
  const bodyGeo = new THREE.BoxGeometry(1.65, 3.25, 0.14);
  const bodyMat = createLowPolyMaterial('#2D242E', 0.35, 0.4);
  const phoneBody = new THREE.Mesh(bodyGeo, bodyMat);
  phoneBody.castShadow = true;
  phoneGroup.add(phoneBody);

  // Bisel dorado/rosado metálico
  const edgeGeo = new THREE.BoxGeometry(1.68, 3.28, 0.12);
  const edgeMat = createLowPolyMaterial('#F8C8DC', 0.3, 0.7);
  const phoneEdge = new THREE.Mesh(edgeGeo, edgeMat);
  phoneGroup.add(phoneEdge);

  // Pantalla de cristal
  const screenGeo = new THREE.BoxGeometry(1.52, 3.08, 0.02);
  const screenMat = createLowPolyMaterial('#FFFFFF', 0.2, 0.1);
  const phoneScreen = new THREE.Mesh(screenGeo, screenMat);
  phoneScreen.position.z = 0.075;
  phoneGroup.add(phoneScreen);

  // Dynamic Island / Cámara frontal
  const notchGeo = new THREE.BoxGeometry(0.32, 0.07, 0.025);
  const notchMat = createLowPolyMaterial('#111827');
  const notch = new THREE.Mesh(notchGeo, notchMat);
  notch.position.set(0, 1.38, 0.08);
  phoneGroup.add(notch);

  // Módulo de triple cámara trasera
  const camBumpGeo = new THREE.BoxGeometry(0.55, 0.55, 0.04);
  const camBumpMat = createLowPolyMaterial('#374151');
  const camBump = new THREE.Mesh(camBumpGeo, camBumpMat);
  camBump.position.set(-0.45, 1.15, -0.09);
  phoneGroup.add(camBump);

  // 3. Tarjetas interactivas flotantes 3D en la pantalla
  const cards = [];
  const cardData = [
    { title: 'DANCEHALL', level: 'Principiantes', loc: 'Estudio Danza Viva • Lun 19hs', color: '#E06385', tag: 'CUPOS LIMITADOS' },
    { title: 'HEELS DESDE CERO', level: 'Técnica & Confianza', loc: 'Baila Estudio Palermo • Mié 20hs', color: '#8B5CF6', tag: '🔥 POPULAR' },
    { title: 'K-POP CHOREO', level: 'Trend Videoclip', loc: 'Studio K Belgrano • Sáb 16hs', color: '#10B981', tag: 'NUEVO' },
  ];

  cardData.forEach((c, idx) => {
    const cardGroup = new THREE.Group();
    cardGroup.position.set(0, 0.75 - idx * 0.82, 0.10);
    phoneGroup.add(cardGroup);

    // Fondo de la tarjeta con textura canvas dinámica
    const cardCanvas = document.createElement('canvas');
    cardCanvas.width = 512;
    cardCanvas.height = 230;
    const ctx = cardCanvas.getContext('2d');

    // Fondo redondeado con gradiente
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(10, 10, 492, 210, 24);
    ctx.fill();

    // Borde de acento
    ctx.strokeStyle = c.color;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(10, 10, 492, 210, 24);
    ctx.stroke();

    // Badge
    ctx.fillStyle = c.color;
    ctx.beginPath();
    ctx.roundRect(30, 26, 170, 34, 12);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.fillText(c.tag, 42, 50);

    // Título de la disciplina
    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 30px Inter, sans-serif';
    ctx.fillText(c.title, 30, 98);

    // Subtítulo
    ctx.fillStyle = '#6B7280';
    ctx.font = '22px Inter, sans-serif';
    ctx.fillText(c.level, 30, 134);

    // Ubicación y horario
    ctx.fillStyle = '#374151';
    ctx.font = '500 20px Inter, sans-serif';
    ctx.fillText(c.loc, 30, 170);

    // Botón Reservar
    ctx.fillStyle = c.color;
    ctx.beginPath();
    ctx.roundRect(360, 142, 124, 46, 14);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.fillText('Reservar', 378, 172);

    const cardTex = new THREE.CanvasTexture(cardCanvas);
    cardTex.generateMipmaps = true;

    const cardMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.36, 0.62, 0.03),
      new THREE.MeshStandardMaterial({
        map: cardTex,
        roughness: 0.4,
        metalness: 0.05,
      })
    );
    cardMesh.castShadow = true;
    cardGroup.add(cardMesh);
    cards.push(cardGroup);
  });

  return { stage, phoneGroup, cards };
}
