// ============================================================================
// BAILAPP 3D SHARED ASSET LIBRARY: STAGE PODIUM (PODIO DE CELEBRACIÓN FINAL)
// ============================================================================

import * as THREE from '../three.module.js';
import { createLowPolyMaterial } from '../characters/character_builder.js';

export function createStagePodium() {
  const stage = new THREE.Group();

  // 1. Base principal hexagonal facetada amplia
  const baseGeo = new THREE.CylinderGeometry(2.6, 2.8, 0.22, 6);
  const baseMat = createLowPolyMaterial('#FAD2E1', 0.85);
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = -0.11;
  base.receiveShadow = true;
  stage.add(base);

  // 2. Podio central escalonado en 3 alturas (1º al centro, 2º a la izquierda, 3º a la derecha)
  // Centro (Puesto 1 - altura 0.65)
  const centerGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.65, 6);
  const centerMat = createLowPolyMaterial('#E06385', 0.7);
  const centerPodium = new THREE.Mesh(centerGeo, centerMat);
  centerPodium.position.set(0, 0.325, 0.2);
  centerPodium.castShadow = true;
  centerPodium.receiveShadow = true;
  stage.add(centerPodium);

  // Izquierda (Puesto 2 - altura 0.42)
  const leftGeo = new THREE.CylinderGeometry(0.72, 0.80, 0.42, 6);
  const leftMat = createLowPolyMaterial('#8B5CF6', 0.75);
  const leftPodium = new THREE.Mesh(leftGeo, leftMat);
  leftPodium.position.set(-1.25, 0.21, 0.4);
  leftPodium.castShadow = true;
  leftPodium.receiveShadow = true;
  stage.add(leftPodium);

  // Derecha (Puesto 3 - altura 0.30)
  const rightGeo = new THREE.CylinderGeometry(0.72, 0.80, 0.30, 6);
  const rightMat = createLowPolyMaterial('#10B981', 0.75);
  const rightPodium = new THREE.Mesh(rightGeo, rightMat);
  rightPodium.position.set(1.25, 0.15, 0.4);
  rightPodium.castShadow = true;
  rightPodium.receiveShadow = true;
  stage.add(rightPodium);

  // 3. Gran placa de conversión 3D en el podio central con la marca
  const logoCanvas = document.createElement('canvas');
  logoCanvas.width = 512;
  logoCanvas.height = 160;
  const ctx = logoCanvas.getContext('2d');

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(8, 8, 496, 144, 20);
  ctx.fill();

  ctx.fillStyle = '#E06385';
  ctx.font = 'bold 36px Inter, sans-serif';
  ctx.fillText('✨ BAILAPP ✨', 125, 62);

  ctx.fillStyle = '#1F2937';
  ctx.font = 'bold 32px Inter, sans-serif';
  ctx.fillText('bailapp.com.ar', 120, 115);

  const logoTex = new THREE.CanvasTexture(logoCanvas);
  const logoMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.38, 0.04),
    new THREE.MeshStandardMaterial({ map: logoTex, roughness: 0.3 })
  );
  logoMesh.position.set(0, 0.32, 1.05);
  stage.add(logoMesh);

  return stage;
}
