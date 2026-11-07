// Art Deco Ballerina — Erté / Cassandre / Lempicka figure language
// Elongated graceful limbs, rose-gold leotard & geometric tutu, gold-rimmed planes, pointe shoes.
import { C, TAU, clamp, lerp, mix, goldGrad, gline, toPath, airbrush, fan, sparkle } from './engine/deco.js';

export const BALLET_PINK = {
  base: '#d86e88',
  light: '#f7a8bb',
  shadow: '#6e1e32',
  tutu: '#f28da3',
  tutuLight: '#ffe3eb',
  tutuDark: '#8b2940',
  ribbon: '#e88aa1',
  skin: '#f5cdb5',
  skinLight: '#ffe9db',
  skinDark: '#b87c61',
  hair: '#140f12',
  hairGold: '#e5c158',
};

// Helper: capsule for limbs
function capsule(x0, y0, r0, x1, y1, r1) {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || .001, a = Math.atan2(dy, dx);
  const s = clamp((r0 - r1) / L, -.99, .99), b = Math.acos(s);
  const p = new Path2D();
  p.arc(x0, y0, r0, a + b, a - b + TAU, false);
  p.arc(x1, y1, r1, a - b, a + b, false);
  p.closePath();
  return p;
}

// Faceted limb with light from upper-left
function drawLimb(g, x0, y0, r0, x1, y1, r1, colBase, colLight, colDark, rim = 1) {
  const p = capsule(x0, y0, r0, x1, y1, r1);
  const minX = Math.min(x0, x1) - r0, minY = Math.min(y0, y1) - r0;
  const maxX = Math.max(x0, x1) + r0, maxY = Math.max(y0, y1) + r0;
  const gr = g.createLinearGradient(minX, minY, maxX, maxY);
  gr.addColorStop(0, colLight);
  gr.addColorStop(0.45, colBase);
  gr.addColorStop(1, colDark);
  g.fillStyle = gr;
  g.fill(p);
  if (rim) {
    g.save();
    g.clip(p);
    g.translate(-1.2, -1.2);
    g.strokeStyle = C.gold2;
    g.lineWidth = rim * 1.5;
    g.stroke(p);
    g.restore();
  }
}

/**
 * Draw Stylized Art Deco Ballerina
 * pose: 'stand' | 'tired' | 'releve' | 'arabesque' | 'leap' | 'pirouette'
 */
export function drawBallerina(g, {
  x = 0,
  y = 0,
  s = 1.0,
  pose = 'releve',
  t = 0,
  facing = 1, // 1 = right, -1 = left
  glowAmount = 0.3,
  ribbons = true,
  tutuFlare = 1.0,
}) {
  g.save();
  g.translate(x, y);
  g.scale(s * facing, s);

  // Soft glow around the dancer
  if (glowAmount > 0) {
    const rad = 140;
    const gg = g.createRadialGradient(0, -90, 10, 0, -90, rad);
    gg.addColorStop(0, 'rgba(232, 138, 161, 0.22)');
    gg.addColorStop(1, 'rgba(232, 138, 161, 0)');
    g.fillStyle = gg;
    g.beginPath();
    g.arc(0, -90, rad, 0, TAU);
    g.fill();
  }

  const P = BALLET_PINK;

  if (pose === 'stand' || pose === 'releve') {
    const relY = pose === 'releve' ? -15 : 0;
    // Legs (elongated streamline)
    // Left leg
    drawLimb(g, -8, -50 + relY, 7, -10, 35 + relY, 5, P.skin, P.skinLight, P.skinDark, 0.8);
    drawLimb(g, -10, 35 + relY, 5, -8, 75 + relY, 3.5, P.skin, P.skinLight, P.skinDark, 0.8);
    // Right leg
    drawLimb(g, 8, -50 + relY, 7, 10, 35 + relY, 5, P.skin, P.skinLight, P.skinDark, 0.8);
    drawLimb(g, 10, 35 + relY, 5, 8, 75 + relY, 3.5, P.skin, P.skinLight, P.skinDark, 0.8);

    // Pointe shoes
    [-8, 8].forEach(lx => {
      g.save();
      g.translate(lx, 75 + relY);
      // Shoe box
      const sp = new Path2D();
      sp.moveTo(-3.5, 0);
      sp.lineTo(3.5, 0);
      sp.lineTo(2.5, 14);
      sp.lineTo(-2.5, 14);
      sp.closePath();
      g.fillStyle = P.base;
      g.fill(sp);
      g.strokeStyle = C.gold1;
      g.lineWidth = 0.8;
      g.stroke(sp);
      // Ribbons criss-cross
      g.beginPath();
      g.moveTo(-3, -12); g.lineTo(3, -4);
      g.moveTo(3, -12); g.lineTo(-3, -4);
      g.strokeStyle = P.ribbon;
      g.lineWidth = 0.9;
      g.stroke();
      g.restore();
    });

    // Torso / Leotard
    const torso = new Path2D();
    torso.moveTo(-11, -95 + relY);
    torso.lineTo(11, -95 + relY);
    torso.lineTo(8, -55 + relY);
    torso.lineTo(-8, -55 + relY);
    torso.closePath();
    const grT = g.createLinearGradient(-11, -95, 11, -55);
    grT.addColorStop(0, P.light);
    grT.addColorStop(0.5, P.base);
    grT.addColorStop(1, P.shadow);
    g.fillStyle = grT;
    g.fill(torso);
    g.strokeStyle = C.gold2;
    g.lineWidth = 1.0;
    g.stroke(torso);

    // Geometric Tutu (Art Deco tiered fan petals)
    g.save();
    g.translate(0, -56 + relY);
    const tutuW = 42 * tutuFlare;
    const tutuH = 14;
    // Layer 1 (dark back)
    fan(g, 0, 0, tutuW * 0.9, { a0: 0, a1: Math.PI, ribs: 9, fill: P.tutuDark, ring: 0.3 });
    // Layer 2 (front stepped plates)
    for (let i = -4; i <= 4; i++) {
      const ang = (i / 5) * 0.9;
      g.save();
      g.rotate(ang);
      const pp = new Path2D();
      pp.moveTo(-5, 0);
      pp.lineTo(5, 0);
      pp.lineTo(4, tutuH + 4);
      pp.lineTo(0, tutuH + 9);
      pp.lineTo(-4, tutuH + 4);
      pp.closePath();
      g.fillStyle = i % 2 === 0 ? P.tutuLight : P.tutu;
      g.fill(pp);
      g.strokeStyle = C.gold1;
      g.lineWidth = 0.7;
      g.stroke(pp);
      g.restore();
    }
    // Waist gold chevron band
    gline(g, [[-10, 0], [0, 4], [10, 0]], { w: 1.8, color: C.gold1 });
    g.restore();

    // Arms: en couronne (curved over head)
    // Left arm
    drawLimb(g, -11, -92 + relY, 4, -22, -125 + relY, 3, P.skin, P.skinLight, P.skinDark, 0.7);
    drawLimb(g, -22, -125 + relY, 3, -12, -145 + relY, 2.5, P.skin, P.skinLight, P.skinDark, 0.7);
    // Right arm
    drawLimb(g, 11, -92 + relY, 4, 22, -125 + relY, 3, P.skin, P.skinLight, P.skinDark, 0.7);
    drawLimb(g, 22, -125 + relY, 3, 12, -145 + relY, 2.5, P.skin, P.skinLight, P.skinDark, 0.7);

    // Hands delicate arched
    [-12, 12].forEach((hx, i) => {
      g.save();
      g.translate(hx, -145 + relY);
      g.beginPath();
      g.arc(0, 0, 2.5, 0, TAU);
      g.fillStyle = P.skinLight;
      g.fill();
      g.restore();
    });

    // Neck & Head
    drawLimb(g, 0, -95 + relY, 3.5, 0, -107 + relY, 3.2, P.skin, P.skinLight, P.skinDark, 0.6);
    // Head (egg shape)
    g.save();
    g.translate(0, -116 + relY);
    const head = new Path2D();
    head.arc(0, 0, 8.5, 0, TAU);
    g.fillStyle = P.skinLight;
    g.fill(head);
    // Hair bun (chignon) + gold ornament
    const bun = new Path2D();
    bun.arc(0, -8.5, 5.5, 0, TAU);
    g.fillStyle = P.hair;
    g.fill(bun);
    g.strokeStyle = C.gold2;
    g.lineWidth = 1.0;
    g.stroke(bun);
    // Gold hairpins/tiara
    sparkle(g, 0, -13, 8, { color: C.gold2 });
    // Eyes: delicate Art Deco closed serene crescent
    g.beginPath();
    g.moveTo(-4, 0); g.quadraticCurveTo(-2, 2, 0, 0);
    g.moveTo(1, 0); g.quadraticCurveTo(3, 2, 5, 0);
    g.strokeStyle = P.hair;
    g.lineWidth = 0.8;
    g.stroke();
    // Crimson lips
    g.beginPath();
    g.arc(0, 4, 1.2, 0, TAU);
    g.fillStyle = P.shadow;
    g.fill();
    g.restore();

  } else if (pose === 'tired') {
    // Sitting / slumped on stepped pedestal, holding ankle
    // Pedestal
    g.save();
    g.fillStyle = '#110d12';
    g.fillRect(-50, 10, 100, 70);
    gline(g, [[-50, 10], [50, 10]], { w: 2, color: C.gold1 });
    gline(g, [[-55, 30], [55, 30]], { w: 1.2, color: C.gold0 });
    g.restore();

    // Body slumped forward
    drawLimb(g, -10, 10, 8, 25, 12, 6, P.skin, P.skinLight, P.skinDark, 0.8);
    drawLimb(g, 25, 12, 6, 28, 65, 4.5, P.skin, P.skinLight, P.skinDark, 0.8);

    // Other leg bent back
    drawLimb(g, -15, 12, 7, -8, 65, 4.5, P.skin, P.skinLight, P.skinDark, 0.8);

    // Torso leaned forward
    const torso = new Path2D();
    torso.moveTo(-15, -35);
    torso.lineTo(5, -42);
    torso.lineTo(0, 8);
    torso.lineTo(-18, 8);
    torso.closePath();
    g.fillStyle = P.shadow;
    g.fill(torso);
    g.strokeStyle = C.gold1;
    g.lineWidth = 0.9;
    g.stroke(torso);

    // Tutu compressed
    fan(g, -10, 8, 32, { a0: -0.2, a1: 2.8, ribs: 7, fill: P.tutuDark, ring: 0.2 });

    // Arm touching sore ankle
    drawLimb(g, -10, -32, 4, 12, -5, 3, P.skin, P.skinLight, P.skinDark, 0.7);
    drawLimb(g, 12, -5, 3, 26, 60, 2.5, P.skin, P.skinLight, P.skinDark, 0.7);

    // Head drooped in fatigue
    g.save();
    g.translate(6, -48);
    g.rotate(0.35);
    const head = new Path2D();
    head.arc(0, 0, 8.5, 0, TAU);
    g.fillStyle = P.skin;
    g.fill(head);
    // Hair bun
    g.beginPath();
    g.arc(-7, -4, 5.5, 0, TAU);
    g.fillStyle = P.hair;
    g.fill();
    g.restore();

  } else if (pose === 'arabesque' || pose === 'leap') {
    const isLeap = pose === 'leap';
    const leapOffset = isLeap ? -40 : 0;

    // Torso arching dynamically
    g.save();
    g.translate(0, leapOffset);
    g.rotate(isLeap ? -0.25 : -0.1);

    // Back leg stretched out
    drawLimb(g, -10, -20, 7.5, -65, isLeap ? -25 : -10, 5, P.skin, P.skinLight, P.skinDark, 0.8);
    drawLimb(g, -65, isLeap ? -25 : -10, 5, -115, isLeap ? -35 : -12, 3.5, P.skin, P.skinLight, P.skinDark, 0.8);
    // Pointe shoe on back leg
    g.save();
    g.translate(-115, isLeap ? -35 : -12);
    g.rotate(-0.2);
    g.fillStyle = P.base;
    g.fillRect(-12, -3, 14, 6);
    g.strokeStyle = C.gold2;
    g.strokeRect(-12, -3, 14, 6);
    g.restore();

    // Front leg stretched forward & down
    drawLimb(g, 10, -20, 7.5, 55, isLeap ? 15 : 40, 5, P.skin, P.skinLight, P.skinDark, 0.8);
    drawLimb(g, 55, isLeap ? 15 : 40, 5, 105, isLeap ? 35 : 85, 3.5, P.skin, P.skinLight, P.skinDark, 0.8);
    // Pointe shoe front
    g.save();
    g.translate(105, isLeap ? 35 : 85);
    g.rotate(0.3);
    g.fillStyle = P.base;
    g.fillRect(0, -3, 14, 6);
    g.strokeStyle = C.gold2;
    g.strokeRect(0, -3, 14, 6);
    g.restore();

    // Tutu flared backwards with motion
    g.save();
    g.translate(-5, -20);
    g.rotate(-0.4);
    fan(g, 0, 0, 48 * tutuFlare, { a0: -Math.PI * 0.7, a1: Math.PI * 0.7, ribs: 11, fill: P.tutu, ring: 0.3 });
    g.restore();

    // Torso
    const torso = new Path2D();
    torso.moveTo(-10, -65);
    torso.lineTo(12, -65);
    torso.lineTo(10, -22);
    torso.lineTo(-8, -22);
    torso.closePath();
    const grT = g.createLinearGradient(-10, -65, 12, -22);
    grT.addColorStop(0, P.light);
    grT.addColorStop(1, P.shadow);
    g.fillStyle = grT;
    g.fill(torso);
    g.strokeStyle = C.gold2;
    g.lineWidth = 1.0;
    g.stroke(torso);

    // Front arm pointing forward/up
    drawLimb(g, 10, -62, 4, 45, -88, 3, P.skin, P.skinLight, P.skinDark, 0.7);
    drawLimb(g, 45, -88, 3, 85, -108, 2.5, P.skin, P.skinLight, P.skinDark, 0.7);

    // Back arm trailing gracefully
    drawLimb(g, -10, -62, 4, -40, -75, 3, P.skin, P.skinLight, P.skinDark, 0.7);
    drawLimb(g, -40, -75, 3, -75, -82, 2.5, P.skin, P.skinLight, P.skinDark, 0.7);

    // Head tilted high with pride
    g.save();
    g.translate(8, -82);
    g.rotate(-0.2);
    const head = new Path2D();
    head.arc(0, 0, 8.5, 0, TAU);
    g.fillStyle = P.skinLight;
    g.fill(head);
    // Hair
    const bun = new Path2D();
    bun.arc(-7, -4, 5.5, 0, TAU);
    g.fillStyle = P.hair;
    g.fill(bun);
    sparkle(g, 2, -10, 10, { color: C.goldHi });
    g.restore();

    g.restore(); // end leap
  }

  g.restore();
}
