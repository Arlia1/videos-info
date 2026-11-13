/**
 * AGENCIA ARLIA — HIGH-END 2D COMMERCIAL MOTION ENGINE (1080x1920)
 * Formato: ANTES vs DESPUÉS — Mayoristas y Distribuidoras
 * Zero-Overflow Text Engine + Real Brand Logo Loader (logo_cutout)
 * Target duration: 20.0s (deterministic frame-accurate rendering).
 */

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const W = 1080;
const H = 1920;
const CX = W / 2;
const CY = H / 2;
const DUR = 20.0;
window.DUR = DUR;

// -------------------------------------------------------------
// 0. BRAND LOGO IMAGE LOADER (logo_cutout)
// -------------------------------------------------------------
const brandLogo = new Image();
let brandLogoLoaded = false;

const LOGO_CANDIDATES = [
  'logo_cutout.png',
  'logo_cutout.webp',
  'logo_cutout.svg',
  'logo_cutout.jpg',
  'logo_cutout',
  '../logo_cutout.png',
  '../logo_cutout.webp',
  '../logo_cutout',
  'assets/logo_cutout.png'
];
let logoTryIdx = 0;

function tryLoadNextLogo() {
  if (logoTryIdx >= LOGO_CANDIDATES.length) {
    render(0);
    window.READY = true;
    return;
  }
  brandLogo.src = LOGO_CANDIDATES[logoTryIdx++];
}

brandLogo.onload = () => {
  brandLogoLoaded = true;
  render(currentTime || 0);
  window.READY = true;
};

brandLogo.onerror = () => {
  tryLoadNextLogo();
};

// Math & Easing Helpers
const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOutQuad = (t) => t * (2 - t);
const easeOutBack = (t, s = 1.70158) => (t = t - 1) * t * ((s + 1) * t + s) + 1;
const easeOutElastic = (t) => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

function roundRect(ctx, x, y, width, height, radius) {
  if (typeof radius === 'number') {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    radius = Object.assign({ tl: 0, tr: 0, br: 0, bl: 0 }, radius);
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
}

// -------------------------------------------------------------
// ZERO-OVERFLOW TEXT ENGINE (SAFE-FIT & MULTI-LINE WRAPPING)
// -------------------------------------------------------------
function fitText(g, text, x, y, maxWidth, initialSize, weight = '800', family = '"Plus Jakarta Sans", sans-serif', minSize = 14) {
  let size = initialSize;
  g.font = `${weight} ${size}px ${family}`;
  while (g.measureText(text).width > maxWidth && size > minSize) {
    size -= 1;
    g.font = `${weight} ${size}px ${family}`;
  }
  g.fillText(text, x, y, maxWidth);
  return size;
}

function fitMultilineText(g, text, x, centerY, maxWidth, maxLines, initialSize, lineHeightRatio = 1.28, weight = '800', family = '"Plus Jakarta Sans", sans-serif', secondLineColor = null) {
  let size = initialSize;
  let lines = [];

  while (size >= 16) {
    g.font = `${weight} ${size}px ${family}`;
    const words = text.split(' ');
    lines = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
      const testLine = currentLine + ' ' + words[i];
      if (g.measureText(testLine).width <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = words[i];
      }
    }
    lines.push(currentLine);

    const allFitWidth = lines.every(line => g.measureText(line).width <= maxWidth);
    if (lines.length <= maxLines && allFitWidth) {
      break;
    }
    size -= 1;
  }

  const lineHeight = size * lineHeightRatio;
  const totalHeight = (lines.length - 1) * lineHeight;
  const startY = centerY - totalHeight / 2;
  const primaryColor = g.fillStyle;

  lines.forEach((line, idx) => {
    if (secondLineColor && idx > 0) {
      g.fillStyle = secondLineColor;
    } else {
      g.fillStyle = primaryColor;
    }
    g.fillText(line, x, startY + idx * lineHeight, maxWidth);
  });
}

// -------------------------------------------------------------
// 1. BACKGROUND ENGINE: DARK LUXURY MESH, LINES & MOVING NODES
// -------------------------------------------------------------
const SPLINES = [
  { baseX: 160, amp: 45, freq: 0.003, speed: 1.2, width: 1.5, color: 'rgba(56, 189, 248, 0.25)', dotColor: '#38BDF8', dotSpeed: 0.08, dotOffset: 0.1 },
  { baseX: 320, amp: 60, freq: 0.0025, speed: 0.9, width: 2.0, color: 'rgba(37, 99, 235, 0.35)', dotColor: '#60A5FA', dotSpeed: 0.06, dotOffset: 0.45 },
  { baseX: 480, amp: 35, freq: 0.004, speed: 1.5, width: 1.2, color: 'rgba(56, 189, 248, 0.20)', dotColor: '#38BDF8', dotSpeed: 0.11, dotOffset: 0.75 },
  { baseX: 600, amp: 50, freq: 0.0035, speed: 1.1, width: 1.8, color: 'rgba(16, 185, 129, 0.30)', dotColor: '#34D399', dotSpeed: 0.07, dotOffset: 0.25 },
  { baseX: 760, amp: 65, freq: 0.0028, speed: 0.8, width: 2.0, color: 'rgba(37, 99, 235, 0.30)', dotColor: '#60A5FA', dotSpeed: 0.09, dotOffset: 0.60 },
  { baseX: 920, amp: 40, freq: 0.0032, speed: 1.3, width: 1.5, color: 'rgba(56, 189, 248, 0.22)', dotColor: '#38BDF8', dotSpeed: 0.08, dotOffset: 0.90 }
];

function drawPrestigeBackground(t) {
  const bgGrad = ctx.createRadialGradient(CX, CY - 200, 150, CX, CY, 1250);
  bgGrad.addColorStop(0, '#0C1630');
  bgGrad.addColorStop(0.45, '#070D1E');
  bgGrad.addColorStop(1, '#03050A');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  const gridStep = 90;
  for (let x = 0; x <= W; x += gridStep) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y <= H; y += gridStep) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
  for (let x = gridStep * 2; x < W; x += gridStep * 3) {
    for (let y = gridStep * 2; y < H; y += gridStep * 3) {
      ctx.fillRect(x - 3, y - 1, 6, 2);
      ctx.fillRect(x - 1, y - 3, 2, 6);
    }
  }
  ctx.restore();

  ctx.save();
  const orb1X = CX + Math.sin(t * 0.8) * 220;
  const orb1Y = CY - 350 + Math.cos(t * 0.6) * 160;
  const g1 = ctx.createRadialGradient(orb1X, orb1Y, 20, orb1X, orb1Y, 480);
  g1.addColorStop(0, t < 7.8 ? 'rgba(239, 68, 68, 0.18)' : 'rgba(37, 99, 235, 0.22)');
  g1.addColorStop(1, 'rgba(37, 99, 235, 0)');
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, W, H);

  const orb2X = CX + Math.cos(t * 0.9) * 260;
  const orb2Y = CY + 380 + Math.sin(t * 0.7) * 180;
  const g2 = ctx.createRadialGradient(orb2X, orb2Y, 20, orb2X, orb2Y, 520);
  g2.addColorStop(0, 'rgba(16, 185, 129, 0.18)');
  g2.addColorStop(1, 'rgba(16, 185, 129, 0)');
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  SPLINES.forEach((sp, idx) => {
    ctx.save();
    ctx.lineWidth = sp.width;
    ctx.strokeStyle = sp.color;

    const points = [];
    const steps = 40;
    const dy = H / steps;

    for (let i = 0; i <= steps; i++) {
      const y = i * dy;
      const x = sp.baseX +
        Math.sin(y * sp.freq + t * sp.speed + idx) * sp.amp +
        Math.cos(y * 0.0015 - t * 0.5) * (sp.amp * 0.4);
      points.push({ x, y });
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.stroke();

    const progress = (t * sp.dotSpeed + sp.dotOffset) % 1.0;
    const pointIdx = Math.floor(progress * (points.length - 1));
    const nextIdx = Math.min(pointIdx + 1, points.length - 1);
    const subProg = (progress * (points.length - 1)) - pointIdx;

    const nodeX = lerp(points[pointIdx].x, points[nextIdx].x, subProg);
    const nodeY = lerp(points[pointIdx].y, points[nextIdx].y, subProg);

    const haloGrad = ctx.createRadialGradient(nodeX, nodeY, 2, nodeX, nodeY, 24);
    haloGrad.addColorStop(0, sp.dotColor);
    haloGrad.addColorStop(0.4, sp.dotColor + '55');
    haloGrad.addColorStop(1, sp.dotColor + '00');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(nodeX, nodeY, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = sp.dotColor;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(nodeX, nodeY, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  });
}

// -------------------------------------------------------------
// 2. VECTOR SMARTPHONE ENGINE
// -------------------------------------------------------------
const PHONE = {
  w: 780,
  h: 1180,
  r: 54,
  screenR: 42,
  bezel: 14
};

function drawSmartphone(x, y, scale = 1, tiltDeg = 0, screenRenderer) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.rotate((tiltDeg * Math.PI) / 180);

  const hw = PHONE.w / 2;
  const hh = PHONE.h / 2;

  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 35;
  roundRect(ctx, -hw, -hh, PHONE.w, PHONE.h, PHONE.r);
  ctx.fill();
  ctx.restore();

  const titaniumGrad = ctx.createLinearGradient(-hw, -hh, hw, hh);
  titaniumGrad.addColorStop(0, '#2D3748');
  titaniumGrad.addColorStop(0.5, '#1A202C');
  titaniumGrad.addColorStop(1, '#0F172A');
  ctx.fillStyle = titaniumGrad;
  roundRect(ctx, -hw, -hh, PHONE.w, PHONE.h, PHONE.r);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.lineWidth = 2.5;
  roundRect(ctx, -hw, -hh, PHONE.w, PHONE.h, PHONE.r);
  ctx.stroke();

  const sw = PHONE.w - PHONE.bezel * 2;
  const sh = PHONE.h - PHONE.bezel * 2;
  const sx = -sw / 2;
  const sy = -sh / 2;

  ctx.fillStyle = '#06090F';
  roundRect(ctx, sx, sy, sw, sh, PHONE.screenR);
  ctx.fill();

  ctx.save();
  roundRect(ctx, sx, sy, sw, sh, PHONE.screenR);
  ctx.clip();

  if (typeof screenRenderer === 'function') {
    screenRenderer(ctx, sx, sy, sw, sh);
  }

  const sheenGrad = ctx.createLinearGradient(sx, sy, sx + sw * 1.2, sy + sh);
  sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
  sheenGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.03)');
  sheenGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = sheenGrad;
  ctx.fillRect(sx, sy, sw, sh);

  ctx.restore();

  const diW = 140;
  const diH = 34;
  const diX = -diW / 2;
  const diY = sy + 16;

  ctx.fillStyle = '#000000';
  roundRect(ctx, diX, diY, diW, diH, 17);
  ctx.fill();

  ctx.fillStyle = '#10B981';
  ctx.beginPath();
  ctx.arc(diX + diW - 32, diY + diH / 2, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// -------------------------------------------------------------
// 3. SUBTITLE SAFE ZONE & KINETIC CAPTIONS (ZERO-OVERFLOW)
// -------------------------------------------------------------
function drawKineticSubtitle(text, alpha = 1.0) {
  if (!text) return;
  ctx.save();
  ctx.globalAlpha = clamp(alpha, 0, 1);

  const subY = 1675;
  const pillW = 960;
  const pillH = 140;
  const pillX = (W - pillW) / 2;

  ctx.fillStyle = 'rgba(10, 15, 28, 0.94)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 30;
  roundRect(ctx, pillX, subY, pillW, pillH, 32);
  ctx.fill();
  ctx.shadowBlur = 0;

  const borderGrad = ctx.createLinearGradient(pillX, subY, pillX + pillW, subY);
  borderGrad.addColorStop(0, 'rgba(37, 99, 235, 0.6)');
  borderGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.8)');
  borderGrad.addColorStop(1, 'rgba(16, 185, 129, 0.6)');
  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 2.5;
  roundRect(ctx, pillX, subY, pillW, pillH, 32);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#F8FAFC';

  fitMultilineText(ctx, text, CX, subY + pillH / 2, pillW - 70, 2, 32, 1.3, '800', '"Plus Jakarta Sans", sans-serif', '#38BDF8');

  ctx.restore();
}

function drawStateBadge(mode) {
  ctx.save();
  const bw = 540;
  const bh = 60;
  const bx = CX - bw / 2;
  const by = 80;

  if (mode === 'antes') {
    ctx.fillStyle = 'rgba(127, 29, 29, 0.88)';
    ctx.strokeStyle = '#EF4444';
  } else if (mode === 'despues') {
    ctx.fillStyle = 'rgba(6, 95, 70, 0.88)';
    ctx.strokeStyle = '#10B981';
  } else {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
  }

  ctx.lineWidth = 2;
  roundRect(ctx, bx, by, bw, bh, 30);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const label = mode === 'antes'
    ? '🔴 EL ANTES • PLANILLAS EXCEL Y ERRORES'
    : mode === 'despues'
    ? '🟢 EL DESPUÉS • PORTAL MAYORISTA 24/7'
    : 'AGENCIA ARLIA • SISTEMAS B2B';
  fitText(ctx, label, CX, by + bh / 2, bw - 40, 20, '900');
  ctx.restore();
}

// -------------------------------------------------------------
// 4. ACT-BY-ACT SCENE GRAPH (ANTES vs DESPUÉS)
// -------------------------------------------------------------

// ACT 1: EL ANTES - PARTE 1 (0.0s - 3.8s)
function renderAct1(t) {
  drawStateBadge('antes');

  const enter = clamp(t / 0.6, 0, 1);
  const easeEnter = easeOutBack(enter);

  const pillW = 680;
  const pillY = lerp(-100, 235, easeEnter);
  ctx.save();
  ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
  ctx.strokeStyle = '#EF4444';
  ctx.lineWidth = 2.5;
  roundRect(ctx, CX - pillW / 2, pillY, pillW, 68, 34);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#EF4444';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  fitText(ctx, '⚠️ PEDIDOS MAYORISTAS LENTOS Y CONFUSOS', CX, pillY + 34, pillW - 50, 23, '900');
  ctx.restore();

  const cardW = 880;
  const cardPad = 55;
  const maxTextW = cardW - cardPad * 2;
  const card1Prog = clamp((t - 0.35) / 0.7, 0, 1);
  const card1Y = lerp(1200, 440, easeOutBack(card1Prog));

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
  ctx.lineWidth = 3.5;
  ctx.shadowColor = 'rgba(239, 68, 68, 0.45)';
  ctx.shadowBlur = 35;
  roundRect(ctx, CX - cardW / 2, card1Y, cardW, 290, 32);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#94A3B8';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  fitText(ctx, 'Listas de precios en Excel / PDF:', CX - cardW / 2 + cardPad, card1Y + 78, maxTextW, 28, '700', '"Inter", sans-serif');

  ctx.fillStyle = '#EF4444';
  fitText(ctx, 'INCÓMODO EN EL CELULAR', CX - cardW / 2 + cardPad, card1Y + 195, maxTextW, 74, '900');
  ctx.restore();

  if (t > 1.15) {
    const card2Prog = clamp((t - 1.15) / 0.6, 0, 1);
    const card2Y = lerp(1300, 780, easeOutBack(card2Prog));

    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(239, 68, 68, 0.3)';
    ctx.shadowBlur = 25;
    roundRect(ctx, CX - cardW / 2, card2Y, cardW, 240, 28);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#94A3B8';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    fitText(ctx, 'Cargar pedidos artículo por artículo:', CX - cardW / 2 + cardPad, card2Y + 70, maxTextW, 28, '700', '"Inter", sans-serif');

    ctx.fillStyle = '#FFFFFF';
    fitText(ctx, 'ERRORES Y FALTANTES', CX - cardW / 2 + cardPad, card2Y + 165, maxTextW, 62, '900');
    ctx.restore();
  }

  if (t > 1.75) {
    const barProg = clamp((t - 1.75) / 1.5, 0, 1);
    const fillW = lerp(770, 220, barProg);

    ctx.save();
    ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
    roundRect(ctx, CX - cardW / 2, 1070, cardW, 160, 24);
    ctx.fill();

    ctx.fillStyle = '#EF4444';
    ctx.shadowColor = 'rgba(239, 68, 68, 0.6)';
    ctx.shadowBlur = 20;
    roundRect(ctx, CX - cardW / 2 + cardPad, 1145, fillW, 50, 14);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#F8FAFC';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    fitText(ctx, 'El comerciante se cansa de esperar cotización y le compra a otro proveedor', CX - cardW / 2 + cardPad, 1120, maxTextW, 25, '700', '"Inter", sans-serif');
    ctx.restore();
  }

  drawKineticSubtitle('¿Antes? Clientes pidiendo con planillas de Excel confusas o audios eternos.', clamp(t / 0.4, 0, 1));
}

// ACT 2: EL ANTES - PARTE 2 (3.8s - 7.8s) — Caos en WhatsApp
function renderAct2(t) {
  drawStateBadge('antes');

  const localT = t - 3.8;
  const enterProg = clamp(localT / 0.7, 0, 1);
  const phoneY = lerp(1600, 820, easeOutBack(enterProg));
  const tilt = Math.sin(localT * 1.5) * 1.2;

  drawSmartphone(CX, phoneY, 1.0, tilt, (g, sx, sy, sw, sh) => {
    g.fillStyle = '#0F1E29';
    g.fillRect(sx, sy, sw, 130);

    g.fillStyle = '#25D366';
    g.beginPath();
    g.arc(sx + 70, sy + 70, 28, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#FFFFFF';
    g.font = '900 26px sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('📦', sx + 70, sy + 72);

    g.fillStyle = '#FFFFFF';
    g.textAlign = 'left';
    g.textBaseline = 'alphabetic';
    fitText(g, 'WhatsApp Pedidos Mayorista', sx + 115, sy + 62, sw - 145, 27, '800');
    g.fillStyle = '#EF4444';
    fitText(g, '🔴 22 comercios esperando cotización final', sx + 115, sy + 96, sw - 145, 19, '700', '"Inter", sans-serif');

    g.fillStyle = '#080E14';
    g.fillRect(sx, sy + 130, sw, sh - 130);

    const chats = [{'text': 'Hola! Te pasé una foto anotada en papel con 30 ítems.', 'delay': 0.25, 'type': 'user'}, {'text': '¿Cuál es el mínimo de compra? ¿Descuentan por bulto?', 'delay': 0.85, 'type': 'user'}, {'text': '¿De qué colores queda curva completa en stock?', 'delay': 1.45, 'type': 'user'}, {'text': '❌ Tardaron 2 días en armarme el presupuesto, ya compré.', 'delay': 2.05, 'type': 'danger'}];

    chats.forEach((chat, idx) => {
      if (localT >= chat.delay) {
        const bProg = clamp((localT - chat.delay) / 0.4, 0, 1);
        const bScale = easeOutBack(bProg);
        const bY = sy + 175 + idx * 165;

        g.save();
        g.translate(sx + 35, bY);
        g.scale(bScale, bScale);

        if (chat.type === 'danger') {
          const bW = sw - 70;
          g.fillStyle = 'rgba(239, 68, 68, 0.22)';
          g.strokeStyle = '#EF4444';
          g.lineWidth = 3;
          roundRect(g, 0, 0, bW, 130, 22);
          g.fill();
          g.stroke();

          g.fillStyle = '#FCA5A5';
          g.textAlign = 'left';
          g.textBaseline = 'middle';
          fitText(g, chat.text, 26, 65, bW - 52, 24, '800');
        } else {
          const bW = sw - 90;
          g.fillStyle = '#1F2C34';
          g.strokeStyle = '#2A3942';
          g.lineWidth = 1.5;
          roundRect(g, 0, 0, bW, 125, 20);
          g.fill();
          g.stroke();

          g.fillStyle = '#E9EDEF';
          g.textAlign = 'left';
          g.textBaseline = 'middle';
          fitText(g, chat.text, 26, 52, bW - 52, 24, '600', '"Inter", sans-serif');

          g.fillStyle = '#8696A0';
          g.font = '500 17px monospace';
          g.textAlign = 'right';
          g.fillText('18:45', bW - 22, 102);
        }
        g.restore();
      }
    });

    if (localT > 1.95) {
      const pulse = 1 + Math.sin(t * 12) * 0.04;
      const badgeW = 560;
      g.save();
      g.translate(0, sy + sh - 105);
      g.scale(pulse, pulse);

      g.fillStyle = '#EF4444';
      g.shadowColor = 'rgba(239, 68, 68, 0.8)';
      g.shadowBlur = 30;
      roundRect(g, -badgeW / 2, -44, badgeW, 88, 44);
      g.fill();
      g.shadowBlur = 0;

      g.fillStyle = '#FFFFFF';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      fitText(g, '🔥 VENDEDORES ATRAPADOS CARGANDO DATOS', 0, 0, badgeW - 50, 25, '900');
      g.restore();
    }
  });

  drawKineticSubtitle('Y tu equipo perdiendo el día armando presupuestos a mano en WhatsApp.', clamp((t - 3.8) / 0.4, 0, 1));
}

// ACT 3: EL DESPUÉS - PARTE 1 (7.8s - 12.2s) — Web Interactiva + Ticket WhatsApp
function renderAct3(t) {
  drawStateBadge('despues');

  const localT = t - 7.8;
  const phoneY = 820;
  const tilt = Math.sin(localT * 1.2) * 0.8;

  drawSmartphone(CX, phoneY, 1.04, tilt, (g, sx, sy, sw, sh) => {
    if (localT < 2.9) {
      g.fillStyle = '#0F172A';
      g.fillRect(sx, sy, sw, 150);

      g.fillStyle = '#38BDF8';
      g.textAlign = 'left';
      g.textBaseline = 'alphabetic';
      fitText(g, 'PORTAL MAYORISTA B2B 📦', sx + 35, sy + 72, sw - 70, 28, '900');

      g.fillStyle = '#10B981';
      fitText(g, '🟢 Mínimo $250.000 • Escala por Bulto • Stock Real', sx + 35, sy + 114, sw - 70, 20, '600', '"Inter", sans-serif');

      const rawItems = [{'name': 'Pack x12 Unidades Línea Premium', 'price': '$144.000 / Pack', 'desc': 'Costo unit: $12.000 • Stock disponible: 85 packs', 'emoji': '📦'}, {'name': 'Caja Master x24 Artículos Surtidos', 'price': '$216.000 / Caja', 'desc': 'Descuento -15% aplicado • Envío a Expreso', 'emoji': '🏷️'}, {'name': 'Combo Reposición Rápida Locales', 'price': '$190.000 / Combo', 'desc': 'Los 10 productos más vendidos del mes', 'emoji': '🔥'}];
      const items = rawItems.map((it, idx) => ({
        ...it,
        selected: idx === 0 ? localT > 0.75 : idx === 1 ? localT > 1.6 : false
      }));

      const cardW = sw - 60;
      const textStartX = sx + 205;
      const btnW = 148;
      const btnX = sx + sw - 30 - btnW - 18;
      const infoMaxW = cardW - 190;

      items.forEach((item, i) => {
        const cardY = sy + 180 + i * 220;

        g.fillStyle = '#161F30';
        g.strokeStyle = '#26344A';
        g.lineWidth = 2;
        roundRect(g, sx + 30, cardY, cardW, 195, 22);
        g.fill();
        g.stroke();

        g.fillStyle = '#223046';
        roundRect(g, sx + 45, cardY + 22, 145, 150, 18);
        g.fill();
        g.font = '68px sans-serif';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText(item.emoji, sx + 117, cardY + 98);

        g.fillStyle = '#FFFFFF';
        g.textAlign = 'left';
        g.textBaseline = 'alphabetic';
        fitText(g, item.name, textStartX, cardY + 56, infoMaxW, 24, '800');

        g.fillStyle = '#38BDF8';
        fitText(g, item.desc, textStartX, cardY + 92, infoMaxW, 18, '600', '"Inter", sans-serif');

        const priceMaxW = (btnX - textStartX) - 16;
        g.fillStyle = '#10B981';
        fitText(g, item.price, textStartX, cardY + 148, priceMaxW, 28, '900');

        const btnH = 54;
        const btnY = cardY + 112;

        if (item.selected) {
          g.fillStyle = '#10B981';
          g.shadowColor = 'rgba(16, 185, 129, 0.4)';
          g.shadowBlur = 15;
          roundRect(g, btnX, btnY, btnW, btnH, 14);
          g.fill();
          g.shadowBlur = 0;

          g.fillStyle = '#FFFFFF';
          g.textAlign = 'center';
          g.textBaseline = 'middle';
          fitText(g, '✓ En Carrito', btnX + btnW / 2, btnY + btnH / 2, btnW - 20, 20, '800');
        } else {
          g.fillStyle = '#2563EB';
          roundRect(g, btnX, btnY, btnW, btnH, 14);
          g.fill();

          g.fillStyle = '#FFFFFF';
          g.textAlign = 'center';
          g.textBaseline = 'middle';
          fitText(g, '+ Sumar Pack', btnX + btnW / 2, btnY + btnH / 2, btnW - 20, 20, '700');
        }
      });

      if (localT >= 0.70 && localT <= 1.05) {
        const rProg = (localT - 0.70) / 0.35;
        g.strokeStyle = `rgba(56, 189, 248, ${1 - rProg})`;
        g.lineWidth = 4;
        g.beginPath();
        g.arc(btnX + btnW / 2, sy + 180 + 139, rProg * 45, 0, Math.PI * 2);
        g.stroke();
      }

      const cartY = sy + sh - 130;
      g.fillStyle = '#10B981';
      g.shadowColor = 'rgba(16, 185, 129, 0.6)';
      g.shadowBlur = 25;
      roundRect(g, sx + 30, cartY, cardW, 95, 24);
      g.fill();
      g.shadowBlur = 0;

      g.fillStyle = '#FFFFFF';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      fitText(g, '📦 Enviar Orden Mayorista a WhatsApp ➔', sx + sw / 2, cartY + 48, cardW - 50, 25, '900');
    } else {
      const tickProg = clamp((localT - 2.9) / 0.5, 0, 1);
      const ticketY = lerp(sy + sh, sy + 40, easeOutBack(tickProg));
      const cardW = sw - 60;
      const boxW = sw - 80;
      const innerMaxW = boxW - 70;

      g.fillStyle = '#0B131E';
      g.fillRect(sx, sy, sw, sh);

      g.fillStyle = '#22C55E';
      g.shadowColor = 'rgba(34, 197, 94, 0.5)';
      g.shadowBlur = 20;
      roundRect(g, sx + 30, ticketY, cardW, 110, 22);
      g.fill();
      g.shadowBlur = 0;

      g.fillStyle = '#FFFFFF';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      fitText(g, '🟢 ORDEN MAYORISTA EN TU WHATSAPP', sx + sw / 2, ticketY + 55, cardW - 40, 25, '900');

      const boxY = ticketY + 140;
      g.fillStyle = '#162032';
      g.strokeStyle = '#2C3E5B';
      g.lineWidth = 2.5;
      roundRect(g, sx + 40, boxY, boxW, 780, 26);
      g.fill();
      g.stroke();

      const leftX = sx + 75;
      g.fillStyle = '#38BDF8';
      g.textAlign = 'left';
      g.textBaseline = 'alphabetic';
      fitText(g, '📋 PEDIDO B2B #1084', leftX, boxY + 70, innerMaxW, 25, '800', '"Inter", monospace');

      g.fillStyle = '#94A3B8';
      fitText(g, 'Comercio: Distribuidora Norte (CUIT 30-71...)', leftX, boxY + 115, innerMaxW, 21, '600', '"Inter", sans-serif');

      g.strokeStyle = '#2E3E56';
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(leftX, boxY + 150);
      g.lineTo(sx + sw - 75, boxY + 150);
      g.stroke();

      g.fillStyle = '#FFFFFF';
      fitText(g, '• 3x Pack x12 Línea Premium ($432.000)', leftX, boxY + 210, innerMaxW, 22, '700', '"Inter", sans-serif');
      fitText(g, '• 2x Caja Master x24 Surtidos ($432.000)', leftX, boxY + 270, innerMaxW, 22, '700', '"Inter", sans-serif');

      g.beginPath();
      g.moveTo(leftX, boxY + 330);
      g.lineTo(sx + sw - 75, boxY + 330);
      g.stroke();

      g.fillStyle = '#10B981';
      fitText(g, 'TOTAL NETO: $864.000', leftX, boxY + 420, innerMaxW, 42, '900');

      g.fillStyle = '#38BDF8';
      fitText(g, '✓ Supera mínimo mayorista • Stock reservado', leftX, boxY + 480, innerMaxW, 22, '700', '"Inter", sans-serif');
      fitText(g, '✓ Listo para facturar y despachar por expreso', leftX, boxY + 530, innerMaxW, 22, '700', '"Inter", sans-serif');

      const pillBoxW = boxW - 70;
      g.fillStyle = 'rgba(56, 189, 248, 0.15)';
      roundRect(g, leftX, boxY + 620, pillBoxW, 70, 16);
      g.fill();
      g.fillStyle = '#38BDF8';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      fitText(g, '⚡ Automatizado al instante • Agencia Arlia', sx + sw / 2, boxY + 655, pillBoxW - 30, 21, '800');
    }
  });

  drawKineticSubtitle('¿Después? Tu portal mayorista con compra mínima, bultos y pedido a tu WhatsApp.', clamp((t - 7.8) / 0.4, 0, 1));
}

// ACT 4: EL DESPUÉS - IMPACTO (12.2s - 15.8s)
function renderAct4(t) {
  drawStateBadge('despues');

  const localT = t - 12.2;

  ctx.save();
  const shockGrad = ctx.createRadialGradient(CX, 620, 50, CX, 620, 950);
  shockGrad.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
  shockGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
  ctx.fillStyle = shockGrad;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  const cardW = 880;
  const maxInnerW = cardW - 80;
  const popProg = clamp(localT / 0.6, 0, 1);
  const popScale = lerp(0.5, 1.0, easeOutElastic(popProg));

  ctx.save();
  ctx.translate(CX, 540);
  ctx.scale(popScale, popScale);

  ctx.fillStyle = 'rgba(10, 20, 36, 0.96)';
  ctx.strokeStyle = '#10B981';
  ctx.lineWidth = 5;
  ctx.shadowColor = 'rgba(16, 185, 129, 0.8)';
  ctx.shadowBlur = 45;
  roundRect(ctx, -cardW / 2, -180, cardW, 360, 38);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#10B981';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  fitText(ctx, 'VENTAS X3 EN B2B', 0, -25, maxInnerW, 74, '900');

  ctx.fillStyle = '#FFFFFF';
  fitText(ctx, 'TUS CLIENTES REPONEN MERCADERÍA SOLOS 24/7', 0, 75, maxInnerW, 30, '800');
  ctx.restore();

  const barProg = clamp((localT - 0.4) / 0.8, 0, 1);
  const barY = 880;

  ctx.save();
  ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
  roundRect(ctx, CX - cardW / 2, barY, cardW, 120, 22);
  ctx.fill();

  ctx.fillStyle = '#EF4444';
  roundRect(ctx, CX - cardW / 2, barY, 460, 120, 22);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  fitText(ctx, 'Antes: Tomar Pedidos a Mano (Cuello de Botella)', CX - cardW / 2 + 35, barY + 60, cardW - 70, 26, '800');
  ctx.restore();

  const arliaW = lerp(0, cardW, easeOutQuad(barProg));
  ctx.save();
  ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
  roundRect(ctx, CX - cardW / 2, barY + 160, cardW, 140, 26);
  ctx.fill();

  ctx.fillStyle = '#10B981';
  ctx.shadowColor = 'rgba(16, 185, 129, 0.7)';
  ctx.shadowBlur = 30;
  roundRect(ctx, CX - cardW / 2, barY + 160, arliaW, 140, 26);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  fitText(ctx, '🚀 Después: Catálogo Mayorista Web (AUTOGESTIÓN)', CX - cardW / 2 + 35, barY + 230, cardW - 70, 29, '900');
  ctx.restore();

  if (localT > 1.0) {
    const boxAlpha = clamp((localT - 1.0) / 0.5, 0, 1);
    const calloutW = 840;
    ctx.save();
    ctx.globalAlpha = boxAlpha;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    roundRect(ctx, CX - calloutW / 2, 1240, calloutW, 110, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    fitText(ctx, '🚛 Más pedidos cerrados sin sumar más vendedores', CX, 1295, calloutW - 60, 28, '800');
    ctx.restore();
  }

  drawKineticSubtitle('Tus clientes reponen stock solos y tu depósito despacha el triple.', clamp((t - 12.2) / 0.4, 0, 1));
}

// ACT 5: OUTRO & CTA (15.8s - 20.0s) — Con tu imagen real `logo_cutout`
function renderAct5(t) {
  drawStateBadge('outro');

  const localT = t - 15.8;
  const enterProg = clamp(localT / 0.7, 0, 1);
  const logoScale = easeOutBack(enterProg);

  const logoY = 610;

  ctx.save();
  ctx.translate(CX, logoY);

  const rot1 = localT * 0.25;
  const rot2 = -localT * 0.18;

  ctx.save();
  ctx.rotate(rot1);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.30)';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([30, 20]);
  ctx.beginPath();
  ctx.arc(0, 0, 250, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.rotate(rot2);
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([50, 25]);
  ctx.beginPath();
  ctx.arc(0, 0, 300, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  const glowGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, 260);
  glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.38)');
  glowGrad.addColorStop(0.5, 'rgba(37, 99, 235, 0.16)');
  glowGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 260, 0, Math.PI * 2);
  ctx.fill();

  ctx.scale(logoScale, logoScale);

  if (brandLogoLoaded && brandLogo.naturalWidth > 0) {
    const maxBox = 400;
    const imgRatio = brandLogo.naturalWidth / brandLogo.naturalHeight;
    let drawW = maxBox;
    let drawH = maxBox;
    if (imgRatio > 1) {
      drawH = maxBox / imgRatio;
    } else {
      drawW = maxBox * imgRatio;
    }

    ctx.shadowColor = 'rgba(56, 189, 248, 0.55)';
    ctx.shadowBlur = 35;
    ctx.drawImage(brandLogo, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.shadowBlur = 0;
  }

  ctx.restore();

  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
  ctx.shadowBlur = 25;
  fitText(ctx, 'AGENCIA ARLIA', CX, 1040, 920, 86, '900');
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#38BDF8';
  fitText(ctx, 'CATÁLOGOS B2B PARA MAYORISTAS Y DISTRIBUIDORAS', CX, 1105, 920, 30, '700', '"Inter", sans-serif');
  ctx.restore();

  const ctaW = 780;
  const ctaPulse = 1 + Math.sin(localT * 8) * 0.04;
  ctx.save();
  ctx.translate(CX, 1310);
  ctx.scale(ctaPulse, ctaPulse);

  const ctaGrad = ctx.createLinearGradient(-ctaW / 2, 0, ctaW / 2, 0);
  ctaGrad.addColorStop(0, '#2563EB');
  ctaGrad.addColorStop(1, '#10B981');

  ctx.fillStyle = ctaGrad;
  ctx.shadowColor = 'rgba(37, 99, 235, 0.85)';
  ctx.shadowBlur = 40;
  roundRect(ctx, -ctaW / 2, -68, ctaW, 136, 68);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  fitText(ctx, 'Pedí presupuesto por MD 💬', 0, 0, ctaW - 70, 42, '900');
  ctx.restore();

  drawKineticSubtitle('Agencia Arlia. Pedí presupuesto por MD.', clamp((t - 15.8) / 0.4, 0, 1));
}

// -------------------------------------------------------------
// 5. MASTER FRAME RENDERER (DETERMINISTIC window.render(t))
// -------------------------------------------------------------
function render(t) {
  t = clamp(t, 0, DUR);

  ctx.clearRect(0, 0, W, H);

  drawPrestigeBackground(t);

  if (t < 3.8) {
    renderAct1(t);
  } else if (t >= 3.8 && t < 7.8) {
    renderAct2(t);
  } else if (t >= 7.8 && t < 12.2) {
    renderAct3(t);
  } else if (t >= 12.2 && t < 15.8) {
    renderAct4(t);
  } else {
    renderAct5(t);
  }
}

window.render = render;

// -------------------------------------------------------------
// 6. CLEAN CLICK/SPACEBAR PLAYBACK FOR BROWSER PREVIEW (NO HUD)
// -------------------------------------------------------------
const audio = document.getElementById('audio');
let isPlaying = false;
let currentTime = 0;
let lastTimestamp = null;
let animId = null;

function loop(timestamp) {
  if (!lastTimestamp) lastTimestamp = timestamp;
  const delta = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  if (isPlaying) {
    currentTime += delta;
    if (currentTime >= DUR) {
      currentTime = 0;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    }
    render(currentTime);
    animId = requestAnimationFrame(loop);
  }
}

function togglePlay() {
  isPlaying = !isPlaying;
  if (isPlaying) {
    lastTimestamp = null;
    if (audio) {
      audio.currentTime = currentTime;
      audio.play().catch(() => {});
    }
    animId = requestAnimationFrame(loop);
  } else {
    if (audio) audio.pause();
    if (animId) cancelAnimationFrame(animId);
  }
}

canvas.addEventListener('click', togglePlay);
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    togglePlay();
  }
});

tryLoadNextLogo();
