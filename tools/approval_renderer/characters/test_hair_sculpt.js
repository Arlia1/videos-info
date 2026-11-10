// Test different hair construction geometries in Three.js
import * as THREE from './three.module.js';

export function createSolidHair(type, hairMat, accentMat) {
  const g = new THREE.Group();

  if (type === 'curtain_sculpt') {
    // 1. Skull cap: closed sphere sitting higher and scaled
    const cap = new THREE.Mesh(
      new THREE.SphereGeometry(0.235, 12, 10),
      hairMat
    );
    cap.position.set(0, 0.12, -0.03);
    cap.scale.set(1.05, 1.05, 1.02);
    cap.castShadow = true;
    g.add(cap);

    // Front curtain bangs: two thick wedge blocks with chamfered look
    [-1, 1].forEach(side => {
      // Front arch
      const f = new THREE.Mesh(
        new THREE.BoxGeometry(0.11, 0.06, 0.08),
        hairMat
      );
      f.position.set(side * 0.075, 0.17, 0.15);
      f.rotation.z = -side * 0.28;
      f.rotation.y = side * 0.22;
      g.add(f);

      // Side temple lock
      const s = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.22, 0.10),
        hairMat
      );
      s.position.set(side * 0.17, 0.08, 0.06);
      s.rotation.z = -side * 0.12;
      g.add(s);
    });

    // Back cascade
    [-0.14, 0, 0.14].forEach(x => {
      const b = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.50, 6), hairMat);
      b.position.set(x, -0.10, -0.16);
      b.rotation.x = -0.18;
      g.add(b);
    });
  }

  return g;
}
