// Shots definition for Bailapp (Art Deco vertical 1080x1920)
import { C, TAU, clamp, lerp, seg, ss, eo, eio, mix, rgba, goldGrad, gline, airbrush, sunburst, archFrame, fan, sparkle, glow, chevrons } from './engine/deco.js';
import * as T from './engine/type.js';
import * as B from './engine/bulbs.js';
import { drawBallerina, BALLET_PINK } from './ballerina.js';

const W = 1080;
const H = 1920;
const CX = W / 2;

// Background ground for all scenes
function bg(g, top = '#140c13', bot = '#070507') {
  const gr = g.createLinearGradient(0, 0, 0, H);
  gr.addColorStop(0, top);
  gr.addColorStop(1, bot);
  g.fillStyle = gr;
  g.fillRect(0, 0, W, H);
  // Vignette
  const vig = g.createRadialGradient(CX, H / 2, 300, CX, H / 2, 1050);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.65)');
  g.fillStyle = vig;
  g.fillRect(0, 0, W, H);
}

// Global Art Deco border for vertical 9:16 frame
function decoFrame(g) {
  const m = 38;
  gline(g, [[m, m], [W - m, m], [W - m, H - m], [m, H - m]], { w: 2.4, closed: true });
  gline(g, [[m + 10, m + 10], [W - m - 10, m + 10], [W - m - 10, H - m - 10], [m + 10, H - m - 10]], { w: 1.0, closed: true });
  // Corner stepped fan accents
  [[m, m], [W - m, m], [W - m, H - m], [m, H - m]].forEach(([cx, cy], i) => {
    const a0 = i * Math.PI / 2;
    fan(g, cx, cy, 32, { a0, a1: a0 + Math.PI / 2, ribs: 5, fill: BALLET_PINK.base, ring: 0.3 });
  });
}

// ==========================================
// SHOT 1: El Reloj y la Espera (t: 0.0 - 4.0s)
// ==========================================
export function drawShot1(g, t) {
  g.save();
  // Camera push-in
  const camZoom = lerp(1.0, 1.05, clamp(t / 4.0));
  g.translate(CX, H / 2);
  g.scale(camZoom, camZoom);
  g.translate(-CX, -H / 2);

  bg(g, '#180e15', '#080507');

  // Stepped Arch in background
  archFrame(g, CX, 1380, 780, 1150, { rings: 3, gap: 16, steps: 4, crown: 'round', fill: '#140811' });

  // Giant Roman Clock face at upper center
  const clockY = 560;
  T.clockFace(g, CX, clockY, 210, {
    h: 10 + t * 0.5,
    m: (t * 30) % 60,
    lit: 0.8 + 0.1 * Math.sin(t * 6.0),
    face: '#12070e'
  });

  // Pendulum swinging below clock
  const pendAngle = Math.sin(t * 4.8) * 0.22;
  g.save();
  g.translate(CX, clockY + 200);
  g.rotate(pendAngle);
  gline(g, [[0, 0], [0, 260]], { w: 3.5, color: C.gold1 });
  g.beginPath();
  g.arc(0, 275, 42, 0, TAU);
  g.fillStyle = goldGrad(g, -42, 233, 42, 317, { sheen: (t * 0.5) % 1.0 });
  g.fill();
  g.strokeStyle = C.goldHi;
  g.lineWidth = 2.0;
  g.stroke();
  g.restore();

  // Floating frustration tags ("¿HORARIOS?", "¿PRECIOS AL DM?")
  const p1 = clamp((t - 0.4) / 0.7);
  if (p1 > 0) {
    T.titleBar(g, '¿PRECIOS AL PRIVADO?', CX, 1080, {
      p: p1,
      size: 34,
      sub: 'SIN RESPUESTA HACE 3 DÍAS',
      subSize: 18,
      wings: true
    });
  }

  const p2 = clamp((t - 1.4) / 0.7);
  if (p2 > 0) {
    T.titleBar(g, '¿QUEDAN CUPOS?', CX, 1260, {
      p: p2,
      size: 30,
      sub: 'CONSULTAR POR WHATSAPP',
      subSize: 16,
      wings: false
    });
  }

  // Ballerina silhouette looking at the clock (subtle breath motion)
  const breathY = Math.sin(t * 3.5) * 3.0;
  drawBallerina(g, {
    x: CX,
    y: 1560 + breathY,
    s: 2.2,
    pose: 'releve',
    t,
    facing: 1
  });

  // Top header
  T.goldText(g, 'EL DILEMA DE LA DANZA', CX, 140, { size: 36, font: T.FONTS.title, track: 8 });

  // Subtitle
  T.subtitleCard(g, '¿Horas esperando que te pasen los horarios por DM?', {
    p: clamp(t / 0.5),
    cx: CX,
    cy: 1770,
    size: 32
  });

  decoFrame(g);
  g.restore();
}

// ==========================================
// SHOT 2: El Piso Inadecuado (t: 4.0 - 8.5s)
// ==========================================
export function drawShot2(g, t) {
  bg(g, '#1a0b12', '#090407');

  // Geometric tiled floor grid with harsh perspective
  const floorY = 1100;
  g.save();
  g.fillStyle = '#0f0b12';
  g.fillRect(0, floorY, W, H - floorY);

  // Hard tile lines
  for (let x = 60; x <= W - 60; x += 140) {
    gline(g, [[x, floorY], [x + (x - CX) * 1.5, H]], { w: 1.2, color: '#33263a' });
  }
  for (let y = floorY; y <= H; y += 120) {
    gline(g, [[0, y], [W, y]], { w: 1.4, color: '#44324f' });
  }

  // Cracks and hazard lines on floor
  const crack = [[CX - 180, floorY + 120], [CX - 80, floorY + 220], [CX + 60, floorY + 180], [CX + 220, floorY + 310]];
  gline(g, crack, { w: 2.6, color: '#d65b7a', glow: 0.5 });
  g.restore();

  // Stepped warning plaque
  T.titleBar(g, 'PISO NO AMORTIGUADO', CX, 380, {
    p: 1.0,
    size: 42,
    sub: 'ALTO IMPACTO · RIESGO EN ARTICULACIONES',
    subSize: 20,
    wings: true
  });

  // Medallion warning badge
  T.floorMedallion(g, '!', CX, 640, 75, { sub: 'PELIGRO' });

  // Ballerina in tired/injury-prevention pose holding ankle on stepped pedestal
  drawBallerina(g, {
    x: CX,
    y: 1380,
    s: 2.6,
    pose: 'tired',
    t,
    facing: 1
  });

  // Subtitle
  T.subtitleCard(g, 'Estudios sin piso flotante que lastiman tus tobillos.', {
    p: clamp((t - 4.0) / 0.6),
    cx: CX,
    cy: 1770,
    size: 32
  });

  decoFrame(g);
}

// ==========================================
// SHOT 3: El Encendido: Bailapp (t: 8.5 - 14.0s)
// ==========================================
let memoSign = null;
export function setPrecomputedSign(s) {
  memoSign = s;
}
export function drawShot3(g, t) {
  bg(g, '#220c18', '#0b040a');

  const localT = t - 8.5;

  // Massive sunburst blooming outward
  const burstP = clamp(localT / 2.0);
  sunburst(g, CX, 700, {
    rays: 54,
    r0: 50,
    r1: 1200 * burstP,
    mode: 'both',
    colorA: 'rgba(232, 138, 161, 0.16)',
    w: 2.2,
    sheen: 0.6,
    glow: 0.6
  });

  // Sparkles
  sparkle(g, CX - 320, 520, 36 * burstP, { color: C.goldHi });
  sparkle(g, CX + 320, 520, 36 * burstP, { color: C.goldHi });
  sparkle(g, CX, 320, 48 * burstP, { color: BALLET_PINK.light });

  // Marquee Bulb sign: BAILAPP
  if (!memoSign) memoSign = B.buildSign('BAILAPP', { size: 140, spacing: 14 });
  const signS = 0.95;
  const signX = CX - (memoSign.w * signS) / 2;
  const signY = 620;

  // Counted light ignition (one letter lights per fraction of second)
  const lettersCount = Math.floor(localT * 3.5);
  B.drawSign(g, memoSign, signX, signY, signS, {
    lit: (li, bi, gi) => {
      if (li < lettersCount) return 1.4;
      if (li === lettersCount) return 1.8;
      return 0.05;
    }
  });

  // Decorative stepped badge below sign
  T.titleBar(g, 'EL MARKETPLACE DE LA DANZA', CX, 980, {
    p: clamp(localT / 1.5),
    size: 32,
    sub: 'ESTUDIOS · PROFESORAS · BAILARINAS',
    subSize: 18,
    wings: true
  });

  // Ballerina rising into triumphant relevé
  drawBallerina(g, {
    x: CX,
    y: 1540,
    s: 2.4,
    pose: 'releve',
    t,
    facing: 1,
    glowAmount: 0.6
  });

  // Subtitle
  T.subtitleCard(g, 'Se acabaron las dudas. Llegó Bailapp.', {
    p: clamp(localT / 0.5),
    cx: CX,
    cy: 1770,
    size: 34
  });

  decoFrame(g);
}

// ==========================================
// SHOT 4: Las Puertas del Gran Estudio (t: 14.0 - 20.0s)
// ==========================================
export function drawShot4(g, t) {
  bg(g, '#1a0c16', '#090408');

  const localT = t - 14.0;
  const doorOpen = eio(clamp(localT / 2.2));

  // Grand Parquet Wooden Dance Floor in background (revealed behind doors)
  const floorTop = 950;
  g.save();
  g.fillStyle = '#26171d';
  g.fillRect(80, floorTop, W - 160, H - floorTop);
  // Parquet chevrons (herringbone wooden floor)
  chevrons(g, 120, W - 120, floorTop + 20, {
    n: 12,
    h: 40,
    rows: 14,
    gap: 32
  });
  g.restore();

  // 3 Verified Features Cards inside the studio
  const badges = [
    { title: 'PISTA TÉCNICA AMORTIGUADA', sub: 'MADERA SUSPENDIDA · CERO IMPACTO', y: 440 },
    { title: 'MAESTRAS VERIFICADAS', sub: 'CLÁSICO · CONTEMPO · URBANO', y: 620 },
    { title: 'RESERVA INSTANTÁNEA', sub: 'HORARIOS Y CUPOS EN TIEMPO REAL', y: 800 },
  ];

  badges.forEach((b, i) => {
    const bp = clamp((localT - 0.5 - i * 0.4) / 0.8);
    if (bp > 0) {
      T.titleBar(g, b.title, CX, b.y, {
        p: bp,
        size: 28,
        sub: b.sub,
        subSize: 16,
        wings: true
      });
    }
  });

  // Symmetric Double Doors splitting along center seam
  const doorW = W / 2 - 40;
  const doorShift = doorOpen * (doorW + 20);

  // Left Door Leaf
  g.save();
  g.translate(-doorShift, 0);
  g.fillStyle = '#120910';
  g.fillRect(40, 180, doorW, H - 360);
  gline(g, [[40, 180], [40 + doorW, 180], [40 + doorW, H - 180], [40, H - 180]], { w: 3, closed: true });
  // Door panel motifs
  for (let dy = 320; dy < H - 360; dy += 340) {
    fan(g, 40 + doorW / 2, dy, 90, { ribs: 9, fill: BALLET_PINK.shadow, ring: 0.3 });
  }
  g.restore();

  // Right Door Leaf
  g.save();
  g.translate(doorShift, 0);
  g.fillStyle = '#120910';
  g.fillRect(CX, 180, doorW, H - 360);
  gline(g, [[CX, 180], [CX + doorW, 180], [CX + doorW, H - 180], [CX, H - 180]], { w: 3, closed: true });
  for (let dy = 320; dy < H - 360; dy += 340) {
    fan(g, CX + doorW / 2, dy, 90, { ribs: 9, fill: BALLET_PINK.shadow, ring: 0.3 });
  }
  g.restore();

  // Ballerina stepping joyfully through the open threshold
  if (doorOpen > 0.3) {
    drawBallerina(g, {
      x: CX,
      y: 1540,
      s: 2.3,
      pose: 'releve',
      t,
      facing: 1,
      glowAmount: 0.4
    });
  }

  // Subtitle
  T.subtitleCard(g, 'Salas con piso técnico certificado y reserva en un toque.', {
    p: clamp(localT / 0.5),
    cx: CX,
    cy: 1770,
    size: 32
  });

  decoFrame(g);
}

// ==========================================
// SHOT 5: El Gran Salto (t: 20.0 - 25.5s)
// ==========================================
export function drawShot5(g, t) {
  bg(g, '#240d1c', '#0c050b');

  const localT = t - 20.0;

  // Busby Berkeley rotating kaleidoscope in background
  const rot = localT * 0.4;
  g.save();
  g.translate(CX, 750);
  g.rotate(rot);

  // Concentric fan rings
  const rings = 4;
  for (let i = 0; i < rings; i++) {
    const r = 240 + i * 150;
    const a = (i * Math.PI) / 4;
    g.save();
    g.rotate(a);
    fan(g, r, 0, 75, { ribs: 5, fill: i % 2 === 0 ? BALLET_PINK.base : BALLET_PINK.shadow, ring: 0.25 });
    fan(g, -r, 0, 75, { ribs: 5, fill: i % 2 === 0 ? BALLET_PINK.base : BALLET_PINK.shadow, ring: 0.25 });
    fan(g, 0, r, 75, { ribs: 5, fill: i % 2 === 0 ? BALLET_PINK.base : BALLET_PINK.shadow, ring: 0.25 });
    fan(g, 0, -r, 75, { ribs: 5, fill: i % 2 === 0 ? BALLET_PINK.base : BALLET_PINK.shadow, ring: 0.25 });
    g.restore();
  }
  g.restore();

  // Floating speed lines radiating outwards
  sunburst(g, CX, 750, {
    rays: 36,
    r0: 220,
    r1: 850,
    mode: 'lines',
    w: 2.0,
    colorA: 'rgba(232,138,161,0.35)',
    glow: 0.5
  });

  // Ballerina in full mid-air grand jeté
  const leapY = 750 + Math.sin(localT * 3.0) * 35;
  drawBallerina(g, {
    x: CX,
    y: leapY,
    s: 3.2,
    pose: 'leap',
    t,
    facing: 1,
    glowAmount: 0.7,
    tutuFlare: 1.25
  });

  // Top banner
  T.titleBar(g, 'EL ARTE DE BAILAR', CX, 180, {
    p: 1.0,
    size: 38,
    sub: 'LIBRE · SEGURA · EN TU MEJOR NIVEL',
    subSize: 18,
    wings: true
  });

  // Subtitle
  T.subtitleCard(g, 'Enfócate en tu arte. Elige tus maestras y tus salas.', {
    p: clamp(localT / 0.5),
    cx: CX,
    cy: 1770,
    size: 32
  });

  decoFrame(g);
}

// ==========================================
// SHOT 6: Monograma y Marquee Final (t: 25.5 - 30.0s)
// ==========================================
let memoFinalSign = null;
export function drawShot6(g, t) {
  bg(g, '#1e0a17', '#080307');

  const localT = t - 25.5;

  // Towering architectural ziggurat backdrop
  archFrame(g, CX, 1500, 840, 1300, {
    rings: 4,
    gap: 18,
    steps: 5,
    crown: 'point',
    fill: '#150612'
  });

  // Radial sunburst behind logo
  sunburst(g, CX, 580, {
    rays: 48,
    r0: 80,
    r1: 900,
    mode: 'both',
    colorA: 'rgba(232, 138, 161, 0.18)',
    w: 2.2,
    glow: 0.8
  });

  // Signature Bailapp Marquee
  if (!memoSign) memoSign = B.buildSign('BAILAPP', { size: 140, spacing: 14 });
  const signS = 1.05;
  const signX = CX - (memoSign.w * signS) / 2;
  const signY = 500;

  // Chase lights effect on marquee bulbs
  const chase = Math.floor(localT * 12);
  B.drawSign(g, memoSign, signX, signY, signS, {
    lit: (li, bi, gi) => ((gi + chase) % 4 === 0 ? 1.6 : 1.1)
  });

  // Central Ballerina Emblem Medallion
  T.floorMedallion(g, 'B', CX, 880, 95, { sub: 'DANZA' });

  // Tagline & Value proposition
  T.titleBar(g, 'EL ESCENARIO QUE MERECES', CX, 1140, {
    p: clamp(localT / 0.8),
    size: 34,
    sub: 'DESCARGA LA APP Y RESERVA HOY',
    subSize: 20,
    wings: true
  });

  // Download store badges in Art Deco plaques
  const storeP = clamp((localT - 0.8) / 0.8);
  if (storeP > 0) {
    T.titleBar(g, 'APP STORE  ·  GOOGLE PLAY', CX, 1320, {
      p: storeP,
      size: 26,
      sub: 'BAILAPP.COM',
      subSize: 18,
      wings: false
    });
  }

  // Small serene ballerina in relevé at bottom
  drawBallerina(g, {
    x: CX,
    y: 1600,
    s: 1.8,
    pose: 'releve',
    t,
    facing: 1,
    glowAmount: 0.5
  });

  // Subtitle
  T.subtitleCard(g, 'Bailapp · El marketplace para la danza. Descárgala ya.', {
    p: clamp(localT / 0.4),
    cx: CX,
    cy: 1770,
    size: 32
  });

  decoFrame(g);
}

// Master Shot Router
export function renderShotAt(g, t) {
  if (t < 4.0) return drawShot1(g, t);
  if (t < 8.5) return drawShot2(g, t);
  if (t < 14.0) return drawShot3(g, t);
  if (t < 20.0) return drawShot4(g, t);
  if (t < 25.5) return drawShot5(g, t);
  return drawShot6(g, t);
}
