/**
 * AGENCIA ARLIA — VIRAL HIGH-RETENTION 2D COMMERCIAL ENGINE (1080x1920)
 * Nicho: Pet Shops y Veterinarias
 * Viral Mechanics Engineered Into Code:
 *   1. Top Retention Progress Bar + Live Loss/Gain Ticker
 *   2. Pattern-Interrupt Micro Camera Shake & Red/Emerald Flash Transitions
 *   3. Animated Money-Drain Counter in Act 1 & Unread Message Escalation in Act 2
 *   4. Interactive Finger-Tap Cursor in Act 3 + Hard-Clamped Zero-Overflow Text Engine
 *   5. 1:1 Dynamic Audio Timeline Sync (Zero Audio Overlap, Elastic Duration)
 */

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const W = 1080;
const H = 1920;
const CX = W / 2;
const CY = H / 2;

/*__TIMINGS_START__*/const TIMINGS = { total_dur: 28.34, acts: [{"act": 1, "id": "act1_hook_petshop", "start": 0.0, "end": 5.487, "vo_start": 0.22, "vo_end": 5.234, "vo_dur": 5.014}, {"act": 2, "id": "act2_dolor_petshop", "start": 5.487, "end": 11.216, "vo_start": 5.694, "vo_end": 10.963, "vo_dur": 5.269}, {"act": 3, "id": "act3_solucion_petshop", "start": 11.216, "end": 17.421, "vo_start": 11.423, "vo_end": 17.168, "vo_dur": 5.745}, {"act": 4, "id": "act4_impacto_petshop", "start": 17.421, "end": 22.524, "vo_start": 17.628, "vo_end": 22.271, "vo_dur": 4.643}, {"act": 5, "id": "act5_cta_petshop", "start": 22.524, "end": 28.34, "vo_start": 22.731, "vo_end": 26.989, "vo_dur": 4.258}] };/*__TIMINGS_END__*/

const DUR = TIMINGS.total_dur;
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
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t, s = 1.70158) => (t = t - 1) * t * ((s + 1) * t + s) + 1;
const easeOutElastic = (t) => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

function formatARS(num) {
  return '$' + Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

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
function fitText(g, text, x, y, maxWidth, initialSize, weight = '800', family = '"Plus Jakarta Sans", sans-serif', minSize = 12) {
  let size = initialSize;
  const safeMaxW = Math.max(40, maxWidth - 10);
  g.font = `${weight} ${size}px ${family}`;
  while (g.measureText(text).width > safeMaxW && size > minSize) {
    size -= 1;
    g.font = `${weight} ${size}px ${family}`;
  }
  g.fillText(text, x, y, safeMaxW);
  return size;
}

function fitMultilineText(g, text, x, centerY, maxWidth, maxLines, initialSize, lineHeightRatio = 1.26, weight = '800', family = '"Plus Jakarta Sans", sans-serif', secondLineColor = null, maxTotalHeight = null) {
  let size = initialSize;
  let lines = [];
  const safeMaxW = Math.max(60, maxWidth - 14);

  while (size >= 14) {
    g.font = `${weight} ${size}px ${family}`;
    const words = text.split(' ');
    lines = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
      const testLine = currentLine + ' ' + words[i];
      if (g.measureText(testLine).width <= safeMaxW) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = words[i];
      }
    }
    lines.push(currentLine);

    const allFitWidth = lines.every(line => g.measureText(line).width <= safeMaxW);
    const totalH = lines.length * (size * lineHeightRatio);
    const fitsHeight = !maxTotalHeight || totalH <= maxTotalHeight;

    if (lines.length <= maxLines && allFitWidth && fitsHeight) {
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
    g.fillText(line, x, startY + idx * lineHeight, safeMaxW);
  });
}

// -------------------------------------------------------------
// VIRAL RETENTION HUD: TOP PROGRESS BAR & FLASH TRANSITIONS
// -------------------------------------------------------------
function drawViralRetentionBar(t, solutionStartT) {
  ctx.save();
  const barH = 12;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(0, 0, W, barH);

  const prog = clamp(t / DUR, 0, 1);
  const grad = ctx.createLinearGradient(0, 0, W * prog, 0);
  if (t < solutionStartT) {
    grad.addColorStop(0, '#EF4444');
    grad.addColorStop(1, '#F97316');
  } else {
    grad.addColorStop(0, '#2563EB');
    grad.addColorStop(0.5, '#38BDF8');
    grad.addColorStop(1, '#10B981');
  }
  ctx.fillStyle = grad;
  ctx.shadowColor = t < solutionStartT ? '#EF4444' : '#10B981';
  ctx.shadowBlur = 16;
  ctx.fillRect(0, 0, W * prog, barH);
  ctx.restore();
}

function drawTransitionFlash(t, acts) {
  acts.forEach((act, idx) => {
    const dt = Math.abs(t - act.start);
    if (dt < 0.18) {
      const alpha = (1 - dt / 0.18) * (idx === 2 ? 0.32 : 0.18);
      ctx.save();
      ctx.fillStyle = idx < 2 ? `rgba(239, 68, 68, ${alpha})` : `rgba(16, 185, 129, ${alpha})`;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
  });
}

function drawFingerCursor(g, x, y, isPressing) {
  g.save();
  g.translate(x, y);
  const scale = isPressing ? 0.86 : 1.0;
  g.scale(scale, scale);

  if (isPressing) {
    g.strokeStyle = 'rgba(56, 189, 248, 0.85)';
    g.lineWidth = 4;
    g.beginPath();
    g.arc(0, 0, 38, 0, Math.PI * 2);
    g.stroke();
  }

  g.fillStyle = 'rgba(255, 255, 255, 0.95)';
  g.shadowColor = 'rgba(0, 0, 0, 0.65)';
  g.shadowBlur = 18;
  g.beginPath();
  g.arc(0, 0, 22, 0, Math.PI * 2);
  g.fill();

  g.strokeStyle = '#2563EB';
  g.lineWidth = 4;
  g.stroke();
  g.restore();
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

function drawPrestigeBackground(t, solutionStartT) {
  const bgGrad = ctx.createRadialGradient(CX, CY - 200, 150, CX, CY, 1250);
  bgGrad.addColorStop(0, t < solutionStartT ? '#1A0B12' : '#0C1630');
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
  g1.addColorStop(0, t < solutionStartT ? 'rgba(239, 68, 68, 0.22)' : 'rgba(37, 99, 235, 0.24)');
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

  const subY = 1665;
  const pillW = 960;
  const pillH = 150;
  const pillX = (W - pillW) / 2;

  ctx.fillStyle = 'rgba(10, 15, 28, 0.95)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 32;
  roundRect(ctx, pillX, subY, pillW, pillH, 32);
  ctx.fill();
  ctx.shadowBlur = 0;

  const borderGrad = ctx.createLinearGradient(pillX, subY, pillX + pillW, subY);
  borderGrad.addColorStop(0, 'rgba(37, 99, 235, 0.65)');
  borderGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.9)');
  borderGrad.addColorStop(1, 'rgba(16, 185, 129, 0.65)');
  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 2.5;
  roundRect(ctx, pillX, subY, pillW, pillH, 32);
  ctx.stroke();

  ctx.save();
  roundRect(ctx, pillX + 16, subY + 12, pillW - 32, pillH - 24, 24);
  ctx.clip();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#F8FAFC';

  fitMultilineText(ctx, text, CX, subY + pillH / 2, pillW - 80, 2, 31, 1.26, '800', '"Plus Jakarta Sans", sans-serif', '#38BDF8', pillH - 34);
  ctx.restore();

  ctx.restore();
}

function drawStateBadge(mode) {
  ctx.save();
  const bw = 660;
  const bh = 62;
  const bx = CX - bw / 2;
  const by = 78;

  if (mode === 'antes') {
    ctx.fillStyle = 'rgba(127, 29, 29, 0.90)';
    ctx.strokeStyle = '#EF4444';
  } else if (mode === 'despues') {
    ctx.fillStyle = 'rgba(6, 95, 70, 0.90)';
    ctx.strokeStyle = '#10B981';
  } else {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
  }

  ctx.lineWidth = 2.5;
  roundRect(ctx, bx, by, bw, bh, 31);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const label = mode === 'antes'
    ? "🔴 EL DOLOR • COMISIONES EN BOLSAS Y DEMORA"
    : mode === 'despues'
    ? "🟢 LA SOLUCIÓN • PET SHOP WEB 0% COMISIÓN"
    : "AGENCIA ARLIA • SISTEMAS PARA PET SHOPS";
  fitText(ctx, label, CX, by + bh / 2, bw - 48, 20, '900');
  ctx.restore();
}

// -------------------------------------------------------------
// 4. ACT-BY-ACT VIRAL SCENE GRAPH
// -------------------------------------------------------------

// ACT 1: VIRAL HOOK + LIVE MONEY-DRAIN COUNTER + CAMERA SHAKE
function renderAct1(localT, actDur) {
  ctx.save();
  // Pattern-interrupt micro camera shake on hook impact (0.05s - 0.45s)
  if (localT > 0.05 && localT < 0.45) {
    const decay = 1 - (localT - 0.05) / 0.40;
    const sx = Math.sin(localT * 95) * 12 * decay;
    const sy = Math.cos(localT * 110) * 8 * decay;
    ctx.translate(sx, sy);
  }

  drawStateBadge('antes');

  const enter = clamp(localT / 0.48, 0, 1);
  const easeEnter = easeOutBack(enter);

  const pillW = 820;
  const pillY = lerp(-100, 215, easeEnter);
  ctx.save();
  ctx.fillStyle = 'rgba(239, 68, 68, 0.18)';
  ctx.strokeStyle = '#EF4444';
  ctx.lineWidth = 2.5;
  roundRect(ctx, CX - pillW / 2, pillY, pillW, 68, 34);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FCA5A5';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  fitText(ctx, "⚠️ ¿CUÁNTO PERDÉS EN COMISIONES Y EN TARDAR EN RESPONDER?", CX, pillY + 34, pillW - 56, 22, '900');
  ctx.restore();

  const cardW = 880;
  const cardPad = 52;
  const maxTextW = cardW - cardPad * 2;
  const card1Prog = clamp((localT - 0.22) / 0.60, 0, 1);
  const card1Y = lerp(1200, 395, easeOutBack(card1Prog));

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
  ctx.lineWidth = 3.5;
  ctx.shadowColor = 'rgba(239, 68, 68, 0.45)';
  ctx.shadowBlur = 35;
  roundRect(ctx, CX - cardW / 2, card1Y, cardW, 285, 32);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.save();
  roundRect(ctx, CX - cardW / 2 + 12, card1Y + 12, cardW - 24, 261, 24);
  ctx.clip();
  ctx.fillStyle = '#94A3B8';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  fitText(ctx, "En bolsas de alimento el margen es ajustado y las Apps te sacan:", CX - cardW / 2 + cardPad, card1Y + 74, maxTextW, 27, '700', '"Inter", sans-serif');

  ctx.fillStyle = '#EF4444';
  fitText(ctx, "-25% DE COMISIÓN", CX - cardW / 2 + cardPad, card1Y + 190, maxTextW, 72, '900');
  ctx.restore();
  ctx.restore();

  if (localT > 0.85) {
    const card2Prog = clamp((localT - 0.85) / 0.55, 0, 1);
    const card2Y = lerp(1300, 725, easeOutBack(card2Prog));

    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.55)';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(239, 68, 68, 0.3)';
    ctx.shadowBlur = 25;
    roundRect(ctx, CX - cardW / 2, card2Y, cardW, 235, 28);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.save();
    roundRect(ctx, CX - cardW / 2 + 12, card2Y + 12, cardW - 24, 211, 20);
    ctx.clip();
    ctx.fillStyle = '#94A3B8';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    fitText(ctx, "Tardar 1 hora en pasar precios por kilo o bolsa:", CX - cardW / 2 + cardPad, card2Y + 68, maxTextW, 27, '700', '"Inter", sans-serif');

    ctx.fillStyle = '#FFFFFF';
    fitText(ctx, "COMPRA EN OTRO LADO", CX - cardW / 2 + cardPad, card2Y + 162, maxTextW, 56, '900');
    ctx.restore();
    ctx.restore();
  }

  // VIRAL LIVE MONEY-DRAIN COUNTER BAR
  if (localT > 1.35) {
    const drainProg = clamp((localT - 1.35) / 2.2, 0, 1);
    const fillW = lerp(776, 180, easeOutCubic(drainProg));
    const lostAmount = lerp(45000, 590000, easeOutCubic(drainProg));

    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.lineWidth = 2.5;
    roundRect(ctx, CX - cardW / 2, 1005, cardW, 215, 28);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FCA5A5';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    fitText(ctx, "Clientes recurrentes que se van • Tiempo perdido pasando precios", CX - cardW / 2 + cardPad, 1062, maxTextW, 24, '700', '"Inter", sans-serif');

    ctx.fillStyle = '#EF4444';
    fitText(ctx, `💸 FUGA MENSUAL ESTIMADA: -${formatARS(lostAmount)}`, CX - cardW / 2 + cardPad, 1122, maxTextW, 38, '900');

    ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
    roundRect(ctx, CX - cardW / 2 + cardPad, 1148, maxTextW, 38, 12);
    ctx.fill();

    ctx.fillStyle = '#EF4444';
    ctx.shadowColor = 'rgba(239, 68, 68, 0.7)';
    ctx.shadowBlur = 18;
    roundRect(ctx, CX - cardW / 2 + cardPad, 1148, fillW, 38, 12);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  drawKineticSubtitle("¿Cuánto perdés en tu pet shop en comisiones y en tardar en responder WhatsApp?", clamp(localT / 0.35, 0, 1));
  ctx.restore();
}

// ACT 2: DOLOR — WHATSAPP COLAPSADO + CONTADOR DE MENSAJES EN VIVO
function renderAct2(localT, actDur) {
  drawStateBadge('antes');

  const enterProg = clamp(localT / 0.60, 0, 1);
  const phoneY = lerp(1600, 820, easeOutBack(enterProg));
  const tilt = Math.sin(localT * 1.6) * 1.1;
  const unreadCount = Math.floor(lerp(12, 52, clamp(localT / 2.8, 0, 1)));

  drawSmartphone(CX, phoneY, 1.0, tilt, (g, sx, sy, sw, sh) => {
    g.fillStyle = '#0F1E29';
    g.fillRect(sx, sy, sw, 130);

    g.fillStyle = '#25D366';
    g.beginPath();
    g.arc(sx + 68, sy + 70, 28, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#FFFFFF';
    g.font = '900 26px sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText("🐾", sx + 68, sy + 72);

    g.fillStyle = '#FFFFFF';
    g.textAlign = 'left';
    g.textBaseline = 'alphabetic';
    fitText(g, "WhatsApp Pedidos Pet Shop", sx + 112, sy + 62, sw - 260, 25, '800');
    g.fillStyle = '#EF4444';
    fitText(g, "🔴 52 consultas de alimento y peluquería", sx + 112, sy + 96, sw - 260, 18, '700', '"Inter", sans-serif');

    // Viral Live Unread Pill inside Phone Header
    const uPillW = 130;
    const uPillX = sx + sw - uPillW - 22;
    g.fillStyle = '#EF4444';
    roundRect(g, uPillX, sy + 48, uPillW, 48, 24);
    g.fill();
    g.fillStyle = '#FFFFFF';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    fitText(g, `+${unreadCount} chats`, uPillX + uPillW / 2, sy + 72, uPillW - 16, 19, '900');

    g.fillStyle = '#080E14';
    g.fillRect(sx, sy + 130, sw, sh - 130);

    const chats = [{"text": "Hola! ¿A cuánto tenés el Royal Canin Medium Adult 15kg?", "delay": 0.2, "type": "user"}, {"text": "¿Tenés pipeta Bravecto para perro de 20 a 40 kilos?", "delay": 0.78, "type": "user"}, {"text": "¿Les queda turno de baño y corte para este sábado?", "delay": 1.32, "type": "user"}, {"text": "❌ Como no me contestaron ya pedí la bolsa en otro pet shop.", "delay": 1.88, "type": "danger"}];

    chats.forEach((chat, idx) => {
      if (localT >= chat.delay) {
        const bProg = clamp((localT - chat.delay) / 0.36, 0, 1);
        const bScale = easeOutBack(bProg);
        const bY = sy + 168 + idx * 165;

        g.save();
        g.translate(sx + 34, bY);
        g.scale(bScale, bScale);

        if (chat.type === 'danger') {
          const bW = sw - 68;
          g.fillStyle = 'rgba(239, 68, 68, 0.24)';
          g.strokeStyle = '#EF4444';
          g.lineWidth = 3;
          roundRect(g, 0, 0, bW, 130, 22);
          g.fill();
          g.stroke();

          g.fillStyle = '#FCA5A5';
          g.textAlign = 'center';
          g.textBaseline = 'middle';
          fitMultilineText(g, chat.text, bW / 2, 65, bW - 48, 2, 23, 1.25, '800', '"Plus Jakarta Sans", sans-serif', null, 105);
        } else {
          const bW = sw - 84;
          g.fillStyle = '#1F2C34';
          g.strokeStyle = '#2A3942';
          g.lineWidth = 1.5;
          roundRect(g, 0, 0, bW, 125, 20);
          g.fill();
          g.stroke();

          g.fillStyle = '#E9EDEF';
          g.textAlign = 'left';
          g.textBaseline = 'middle';
          fitText(g, chat.text, 24, 52, bW - 48, 23, '600', '"Inter", sans-serif');

          g.fillStyle = '#F87171';
          g.font = '700 16px monospace';
          g.textAlign = 'right';
          g.fillText('⏱ Esperando respuesta...', bW - 22, 102);
        }
        g.restore();
      }
    });

    if (localT > 1.80) {
      const pulse = 1 + Math.sin(localT * 14) * 0.038;
      const badgeW = 620;
      g.save();
      g.translate(0, sy + sh - 102);
      g.scale(pulse, pulse);

      g.fillStyle = '#EF4444';
      g.shadowColor = 'rgba(239, 68, 68, 0.85)';
      g.shadowBlur = 32;
      roundRect(g, -badgeW / 2, -44, badgeW, 88, 44);
      g.fill();
      g.shadowBlur = 0;

      g.fillStyle = '#FFFFFF';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      fitText(g, "🔥 PERDÉS LA VENTA DE HOY Y LA DE TODOS LOS MESES", 0, 0, badgeW - 52, 24, '900');
      g.restore();
    }
  });

  drawKineticSubtitle("Cuando el plato está vacío quieren pedir ya; si tardás, compran en otro local.", clamp(localT / 0.35, 0, 1));
}

// ACT 3: NOSOTROS LO SOLUCIONAMOS — INTERACTIVE TAP CURSOR + TICKET WHATSAPP
function renderAct3(localT, actDur) {
  drawStateBadge('despues');

  const phoneY = 820;
  const tilt = Math.sin(localT * 1.2) * 0.8;
  const switchTime = actDur * 0.56;

  drawSmartphone(CX, phoneY, 1.04, tilt, (g, sx, sy, sw, sh) => {
    if (localT < switchTime) {
      g.fillStyle = '#0F172A';
      g.fillRect(sx, sy, sw, 150);

      g.fillStyle = '#38BDF8';
      g.textAlign = 'left';
      g.textBaseline = 'alphabetic';
      fitText(g, "TU PET SHOP & VETE ONLINE 🐾", sx + 35, sy + 70, sw - 70, 27, '900');

      g.fillStyle = '#10B981';
      fitText(g, "🟢 Alimentos por Marca/Kilo • Pipetas • Turnos Peluquería", sx + 35, sy + 114, sw - 70, 20, '600', '"Inter", sans-serif');

      const rawItems = [{"name": "Royal Canin Medium Adult Bolsa 15 Kg", "price": "$68.900", "desc": "Envío Gratis en Zona • Stock Permanente", "emoji": "🐶"}, {"name": "Comprimido Bravecto 20 a 40 Kg (12 Sem)", "price": "$42.500", "desc": "Antipulgas y Garrapatas • Original", "emoji": "💊"}, {"name": "Turno Baño, Corte Higiénico y Deslanado", "price": "Sáb 11:00 hs", "desc": "Peluquería Canina • Reserva con Seña", "emoji": "🛁"}];
      const items = rawItems.map((it, idx) => ({
        ...it,
        selected: idx === 0 ? localT > 0.65 : idx === 1 ? localT > 1.35 : false
      }));

      const cardW = sw - 60;
      const textStartX = sx + 205;
      const btnW = 152;
      const btnX = sx + sw - 30 - btnW - 18;
      const infoMaxW = cardW - 195;

      items.forEach((item, i) => {
        const cardY = sy + 180 + i * 220;

        g.fillStyle = '#161F30';
        g.strokeStyle = item.selected ? '#10B981' : '#26344A';
        g.lineWidth = item.selected ? 2.5 : 2;
        roundRect(g, sx + 30, cardY, cardW, 195, 22);
        g.fill();
        g.stroke();

        g.fillStyle = '#223046';
        roundRect(g, sx + 45, cardY + 22, 145, 150, 18);
        g.fill();
        g.font = '66px sans-serif';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText(item.emoji, sx + 117, cardY + 98);

        g.fillStyle = '#FFFFFF';
        g.textAlign = 'left';
        g.textBaseline = 'alphabetic';
        fitText(g, item.name, textStartX, cardY + 56, infoMaxW, 23, '800');

        g.fillStyle = '#38BDF8';
        fitText(g, item.desc, textStartX, cardY + 92, infoMaxW, 18, '600', '"Inter", sans-serif');

        const priceMaxW = (btnX - textStartX) - 18;
        g.fillStyle = '#10B981';
        fitText(g, item.price, textStartX, cardY + 148, priceMaxW, 27, '900');

        const btnH = 54;
        const btnY = cardY + 112;

        if (item.selected) {
          g.fillStyle = '#10B981';
          g.shadowColor = 'rgba(16, 185, 129, 0.45)';
          g.shadowBlur = 15;
          roundRect(g, btnX, btnY, btnW, btnH, 14);
          g.fill();
          g.shadowBlur = 0;

          g.fillStyle = '#FFFFFF';
          g.textAlign = 'center';
          g.textBaseline = 'middle';
          fitText(g, "✓ En Carrito", btnX + btnW / 2, btnY + btnH / 2, btnW - 22, 19, '800');
        } else {
          g.fillStyle = '#2563EB';
          roundRect(g, btnX, btnY, btnW, btnH, 14);
          g.fill();

          g.fillStyle = '#FFFFFF';
          g.textAlign = 'center';
          g.textBaseline = 'middle';
          fitText(g, "+ Sumar", btnX + btnW / 2, btnY + btnH / 2, btnW - 22, 19, '700');
        }
      });

      const cartY = sy + sh - 130;
      g.fillStyle = '#10B981';
      g.shadowColor = 'rgba(16, 185, 129, 0.65)';
      g.shadowBlur = 25;
      roundRect(g, sx + 30, cartY, cardW, 95, 24);
      g.fill();
      g.shadowBlur = 0;

      g.fillStyle = '#FFFFFF';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      fitText(g, "🐾 Enviar Pedido Directo a WhatsApp ➔", sx + sw / 2, cartY + 48, cardW - 56, 24, '900');

      // Animated Interactive Finger Cursor Tapping Items -> Checkout Bar
      const tap1X = btnX + btnW / 2;
      const tap1Y = sy + 180 + 139;
      const tap2X = btnX + btnW / 2;
      const tap2Y = sy + 400 + 139;
      const tap3X = sx + sw / 2 + 120;
      const tap3Y = cartY + 48;

      let curX = tap1X;
      let curY = tap1Y;
      let pressing = false;

      if (localT < 0.85) {
        curX = tap1X;
        curY = lerp(tap1Y + 120, tap1Y, clamp(localT / 0.55, 0, 1));
        pressing = localT >= 0.58 && localT <= 0.80;
      } else if (localT < 1.65) {
        const p = clamp((localT - 0.85) / 0.45, 0, 1);
        curX = lerp(tap1X, tap2X, easeOutQuad(p));
        curY = lerp(tap1Y, tap2Y, easeOutQuad(p));
        pressing = localT >= 1.28 && localT <= 1.52;
      } else {
        const p = clamp((localT - 1.65) / 0.45, 0, 1);
        curX = lerp(tap2X, tap3X, easeOutQuad(p));
        curY = lerp(tap2Y, tap3Y, easeOutQuad(p));
        pressing = localT >= 2.10;
      }
      drawFingerCursor(g, curX, curY, pressing);

    } else {
      const tickProg = clamp((localT - switchTime) / 0.45, 0, 1);
      const ticketY = lerp(sy + sh, sy + 40, easeOutBack(tickProg));
      const cardW = sw - 60;
      const boxW = sw - 80;
      const innerMaxW = boxW - 76;

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
      fitText(g, "🟢 PEDIDO PET SHOP EN TU WHATSAPP", sx + sw / 2, ticketY + 55, cardW - 48, 24, '900');

      const boxY = ticketY + 140;
      g.fillStyle = '#162032';
      g.strokeStyle = '#2C3E5B';
      g.lineWidth = 2.5;
      roundRect(g, sx + 40, boxY, boxW, 780, 26);
      g.fill();
      g.stroke();

      const leftX = sx + 78;
      g.fillStyle = '#38BDF8';
      g.textAlign = 'left';
      g.textBaseline = 'alphabetic';
      fitText(g, "🧾 PEDIDO DIRECTO #912 (0% COMISIÓN)", leftX, boxY + 70, innerMaxW, 24, '800', '"Inter", monospace');

      g.fillStyle = '#94A3B8';
      fitText(g, "Cliente: Sofía R. (Mascota: Thor) • Envío Hoy", leftX, boxY + 115, innerMaxW, 21, '600', '"Inter", sans-serif');

      g.strokeStyle = '#2E3E56';
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(leftX, boxY + 150);
      g.lineTo(sx + sw - 78, boxY + 150);
      g.stroke();

      g.fillStyle = '#FFFFFF';
      fitText(g, "• 1x Royal Canin Medium 15 Kg ($68.900)", leftX, boxY + 210, innerMaxW, 22, '700', '"Inter", sans-serif');
      fitText(g, "• 1x Bravecto 20-40 Kg ($42.500)", leftX, boxY + 270, innerMaxW, 22, '700', '"Inter", sans-serif');

      g.beginPath();
      g.moveTo(leftX, boxY + 330);
      g.lineTo(sx + sw - 78, boxY + 330);
      g.stroke();

      g.fillStyle = '#10B981';
      fitText(g, "TOTAL INTEGRO: $111.400", leftX, boxY + 420, innerMaxW, 40, '900');

      g.fillStyle = '#38BDF8';
      fitText(g, "✓ Ganancia 100% limpia en cada bolsa", leftX, boxY + 480, innerMaxW, 22, '700', '"Inter", sans-serif');
      fitText(g, "✓ Recordatorio de recompra el mes que viene", leftX, boxY + 530, innerMaxW, 22, '700', '"Inter", sans-serif');

      const pillBoxW = boxW - 76;
      g.fillStyle = 'rgba(56, 189, 248, 0.15)';
      roundRect(g, leftX, boxY + 620, pillBoxW, 70, 16);
      g.fill();
      g.fillStyle = '#38BDF8';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      fitText(g, '⚡ Nosotros lo solucionamos • Agencia Arlia', sx + sw / 2, boxY + 655, pillBoxW - 36, 21, '800');
    }
  });

  drawKineticSubtitle("Nosotros lo solucionamos: tienda web con marcas, kilos y turnos a tu WhatsApp.", clamp(localT / 0.35, 0, 1));
}

// ACT 4: IMPACTO Y RESULTADOS (0% COMISIONES / RESPUESTA INSTANTÁNEA)
function renderAct4(localT, actDur) {
  drawStateBadge('despues');

  ctx.save();
  const shockGrad = ctx.createRadialGradient(CX, 620, 50, CX, 620, 950);
  shockGrad.addColorStop(0, 'rgba(16, 185, 129, 0.38)');
  shockGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
  ctx.fillStyle = shockGrad;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  const cardW = 880;
  const maxInnerW = cardW - 88;
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
  fitText(ctx, "100% TU MARGEN", 0, -25, maxInnerW, 70, '900');

  ctx.fillStyle = '#FFFFFF';
  fitText(ctx, "RECOMPRA MENSUAL EN 10 SEGUNDOS", 0, 75, maxInnerW, 29, '800');
  ctx.restore();

  const barProg = clamp((localT - 0.35) / 0.75, 0, 1);
  const barY = 880;

  ctx.save();
  ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
  roundRect(ctx, CX - cardW / 2, barY, cardW, 120, 22);
  ctx.fill();

  ctx.fillStyle = '#EF4444';
  roundRect(ctx, CX - cardW / 2, barY, 440, 120, 22);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  fitText(ctx, "Antes: Apps que comen tu margen + Chats lentos", CX - cardW / 2 + 36, barY + 60, cardW - 72, 25, '800');
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
  fitText(ctx, "🚀 Con Arlia: VENTA DIRECTA Y CLIENTE FIEL", CX - cardW / 2 + 36, barY + 230, cardW - 72, 28, '900');
  ctx.restore();

  if (localT > 0.85) {
    const boxAlpha = clamp((localT - 0.85) / 0.45, 0, 1);
    const calloutW = 840;
    ctx.save();
    ctx.globalAlpha = boxAlpha;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2.5;
    roundRect(ctx, CX - calloutW / 2, 1240, calloutW, 110, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    fitText(ctx, "✨ Convertí cada bolsa en un cliente fijo todos los meses", CX, 1295, calloutW - 64, 27, '800');
    ctx.restore();
  }

  drawKineticSubtitle("Cero comisiones por bolsa vendida, recompra rápida y clientes fidelizados.", clamp(localT / 0.35, 0, 1));
}

// ACT 5: OUTRO & CTA — AGENCIA ARLIA + LOGO CUTOUT
function renderAct5(localT, actDur) {
  drawStateBadge('outro');

  const enterProg = clamp(localT / 0.65, 0, 1);
  const logoScale = easeOutBack(enterProg);

  const logoY = 600;

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
  } else {
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(0, 0, 140, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    fitText(ctx, 'AA', 0, 5, 180, 96, '900');
  }

  ctx.restore();

  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
  ctx.shadowBlur = 25;
  fitText(ctx, 'AGENCIA ARLIA', CX, 1035, 900, 84, '900');
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#38BDF8';
  fitText(ctx, "TIENDAS WEB Y TURNOS PARA PET SHOPS Y VETERINARIAS", CX, 1100, 900, 28, '700', '"Inter", sans-serif');
  ctx.restore();

  const ctaW = 820;
  const ctaPulse = 1 + Math.sin(localT * 8.5) * 0.04;
  ctx.save();
  ctx.translate(CX, 1305);
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
  fitText(ctx, "Pedí tu Demo sin cargo por MD 💬", 0, 0, ctaW - 76, 40, '900');
  ctx.restore();

  drawKineticSubtitle("Agencia Arlia. Mandanos un MD hoy y pedí tu demo sin cargo.", clamp(localT / 0.35, 0, 1));
}

// -------------------------------------------------------------
// 5. MASTER FRAME RENDERER (DETERMINISTIC window.render(t))
// -------------------------------------------------------------
function render(t) {
  t = clamp(t, 0, DUR);

  ctx.clearRect(0, 0, W, H);

  const acts = TIMINGS.acts;
  const a1 = acts[0];
  const a2 = acts[1];
  const a3 = acts[2];
  const a4 = acts[3];
  const a5 = acts[4];

  drawPrestigeBackground(t, a3.start);

  if (t < a2.start) {
    renderAct1(t - a1.start, a1.end - a1.start);
  } else if (t >= a2.start && t < a3.start) {
    renderAct2(t - a2.start, a2.end - a2.start);
  } else if (t >= a3.start && t < a4.start) {
    renderAct3(t - a3.start, a3.end - a3.start);
  } else if (t >= a4.start && t < a5.start) {
    renderAct4(t - a4.start, a4.end - a4.start);
  } else {
    renderAct5(t - a5.start, a5.end - a5.start);
  }

  drawTransitionFlash(t, acts);
  drawViralRetentionBar(t, a3.start);
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
