// ============================================================================
// BAILAPP 3D SHARED ASSET LIBRARY: STAGE RECEPTION / OFFICE (DIORAMA RECEPCIÓN)
// ============================================================================
// Diseñado para escenas de profesores, dueños de estudio o gestión:
// - Mostrador de recepción con laptop, cuadernos, recibos y lámpara.
// - Pared trasera de estudio con zócalos y listones de madera decorativos.
// - Plataforma limpia para evitar solapamientos entre transiciones de corte.
// ============================================================================

import * as THREE from '../three.module.js';
import { createLowPolyMaterial } from '../characters/character_builder.js';

export function createStageReception() {
  const stage = new THREE.Group();

  // 1. Suelo de recepción (madera clara pastel facetada)
  const floorGeo = new THREE.BoxGeometry(4.2, 0.2, 4.2);
  const floorMat = createLowPolyMaterial('#F3E8E2', 0.85);
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.y = -0.1;
  floor.receiveShadow = true;
  stage.add(floor);

  // Alfombra pastel de recepción
  const rugGeo = new THREE.BoxGeometry(2.4, 0.03, 1.8);
  const rugMat = createLowPolyMaterial('#FCE7F0', 0.95);
  const rug = new THREE.Mesh(rugGeo, rugMat);
  rug.position.set(0, 0.015, 0.3);
  rug.receiveShadow = true;
  stage.add(rug);

  // 2. Pared de fondo
  const wallMat = createLowPolyMaterial('#FFF5F8', 0.9);
  const backWallGeo = new THREE.BoxGeometry(4.2, 3.8, 0.15);
  const backWall = new THREE.Mesh(backWallGeo, wallMat);
  backWall.position.set(0, 1.8, -2.1);
  backWall.receiveShadow = true;
  stage.add(backWall);

  // Listones de madera decorativos (estilo estudio moderno)
  const slattedMat = createLowPolyMaterial('#D8B4A6', 0.85);
  for (let x = -1.8; x <= 1.8; x += 0.3) {
    const slatGeo = new THREE.BoxGeometry(0.08, 3.2, 0.04);
    const slat = new THREE.Mesh(slatGeo, slattedMat);
    slat.position.set(x, 1.8, -2.0);
    stage.add(slat);
  }

  // Cuadro decorativo en la pared (logo o danza)
  const frameGeo = new THREE.BoxGeometry(1.6, 0.9, 0.06);
  const frameMat = createLowPolyMaterial('#FFFFFF');
  const frame = new THREE.Mesh(frameGeo, frameMat);
  frame.position.set(0, 2.3, -1.95);
  stage.add(frame);

  const innerCanvas = document.createElement('canvas');
  innerCanvas.width = 512;
  innerCanvas.height = 256;
  const ictx = innerCanvas.getContext('2d');
  ictx.fillStyle = '#E06385';
  ictx.fillRect(0, 0, 512, 256);
  ictx.fillStyle = '#FFFFFF';
  ictx.font = 'bold 36px Inter, sans-serif';
  ictx.textAlign = 'center';
  ictx.fillText('ACADEMIA DE DANZA 🩰', 256, 110);
  ictx.font = '500 24px Inter, sans-serif';
  ictx.fillText('Recepción & Inscripciones', 256, 165);

  const frameTex = new THREE.CanvasTexture(innerCanvas);
  const artGeo = new THREE.PlaneGeometry(1.5, 0.8);
  const artMat = new THREE.MeshBasicMaterial({ map: frameTex });
  const art = new THREE.Mesh(artGeo, artMat);
  art.position.set(0, 2.3, -1.91);
  stage.add(art);

  // 3. Mostrador de Recepción (Desk)
  // Desk frontal: ancho 2.2m, alto 0.90m, profundidad 0.70m
  const deskGroup = new THREE.Group();
  deskGroup.position.set(0, 0, 0.4);
  stage.add(deskGroup);

  const deskTopGeo = new THREE.BoxGeometry(2.2, 0.08, 0.75);
  const deskTopMat = createLowPolyMaterial('#E5D5D0');
  const deskTop = new THREE.Mesh(deskTopGeo, deskTopMat);
  deskTop.position.y = 0.86;
  deskTop.castShadow = true;
  deskTop.receiveShadow = true;
  deskGroup.add(deskTop);

  const deskBaseGeo = new THREE.BoxGeometry(2.1, 0.82, 0.65);
  const deskBaseMat = createLowPolyMaterial('#FAF0F3');
  const deskBase = new THREE.Mesh(deskBaseGeo, deskBaseMat);
  deskBase.position.y = 0.41;
  deskBase.castShadow = true;
  deskBase.receiveShadow = true;
  deskGroup.add(deskBase);

  // 4. Objetos sobre el mostrador
  // Laptop abierta
  const laptopMat = createLowPolyMaterial('#374151');
  const laptopBaseGeo = new THREE.BoxGeometry(0.38, 0.02, 0.28);
  const laptopBase = new THREE.Mesh(laptopBaseGeo, laptopMat);
  laptopBase.position.set(-0.45, 0.91, 0.4);
  laptopBase.rotation.y = 0.15;
  stage.add(laptopBase);

  const laptopScreenGeo = new THREE.BoxGeometry(0.38, 0.25, 0.02);
  const laptopScreen = new THREE.Mesh(laptopScreenGeo, laptopMat);
  laptopScreen.position.set(-0.47, 1.02, 0.27);
  laptopScreen.rotation.x = -0.25;
  laptopScreen.rotation.y = 0.15;
  stage.add(laptopScreen);

  // Pantalla con "Excel desactualizado / chats de WhatsApp"
  const lScreenCanvas = document.createElement('canvas');
  lScreenCanvas.width = 256;
  lScreenCanvas.height = 160;
  const lsCtx = lScreenCanvas.getContext('2d');
  lsCtx.fillStyle = '#1E293B';
  lsCtx.fillRect(0, 0, 256, 160);
  lsCtx.fillStyle = '#EF4444';
  lsCtx.fillRect(10, 10, 236, 24);
  lsCtx.fillStyle = '#FFFFFF';
  lsCtx.font = 'bold 12px Inter, sans-serif';
  lsCtx.fillText('Excel: 48 Chats Sin Leer ⏳', 18, 26);
  lsCtx.fillStyle = '#38BDF8';
  for (let i = 45; i < 150; i += 18) {
    lsCtx.fillRect(15, i, 226, 10);
  }
  const lTex = new THREE.CanvasTexture(lScreenCanvas);
  const lFaceGeo = new THREE.PlaneGeometry(0.35, 0.22);
  const lFaceMat = new THREE.MeshBasicMaterial({ map: lTex });
  const lFace = new THREE.Mesh(lFaceGeo, lFaceMat);
  lFace.position.set(-0.47, 1.02, 0.285);
  lFace.rotation.x = -0.25;
  lFace.rotation.y = 0.15;
  stage.add(lFace);

  // Pila de recibos / papeles desordenados
  const paperMat = createLowPolyMaterial('#FFFFFF');
  for (let i = 0; i < 4; i++) {
    const pGeo = new THREE.BoxGeometry(0.24, 0.015, 0.32);
    const p = new THREE.Mesh(pGeo, paperMat);
    p.position.set(0.4 + i * 0.02, 0.91 + i * 0.016, 0.38 + i * 0.01);
    p.rotation.y = (i - 1.5) * 0.12;
    p.castShadow = true;
    stage.add(p);
  }

  // Lapicero cilíndrico pastel
  const penCupGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.11, 10);
  const penCupMat = createLowPolyMaterial('#E06385');
  const penCup = new THREE.Mesh(penCupGeo, penCupMat);
  penCup.position.set(0.12, 0.95, 0.45);
  stage.add(penCup);

  // Planta decorativa sobre el mostrador
  const plantPotGeo = new THREE.CylinderGeometry(0.08, 0.06, 0.14, 12);
  const plantPotMat = createLowPolyMaterial('#D8B4A6');
  const pot = new THREE.Mesh(plantPotGeo, plantPotMat);
  pot.position.set(0.85, 0.97, 0.35);
  stage.add(pot);

  const plantLeafGeo = new THREE.DodecahedronGeometry(0.14, 0);
  const plantLeafMat = createLowPolyMaterial('#70A288');
  const plantLeaves = new THREE.Mesh(plantLeafGeo, plantLeafMat);
  plantLeaves.position.set(0.85, 1.12, 0.35);
  stage.add(plantLeaves);

  return { stage, deskY: 0.90 };
}
