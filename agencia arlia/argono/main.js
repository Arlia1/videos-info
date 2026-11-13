/**
 * AGENCIA ARLIA — HIGH-END 2D COMMERCIAL MOTION ENGINE (1080x1920)
 * Vertical: Fábricas & Mueblerías (Catálogo Interactivo + Cotizador WhatsApp)
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

// Math & Easing Helpers
const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOutQuad = (t) => t * (2 - t);
const easeOutBack = (t, s = 1.70158) => (t = t - 1) * t * ((s + 1) * t + s) + 1;
const easeOutElastic = (t) => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

// Rounded Rect Utility
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
  g1.addColorStop(0, 'rgba(37, 99, 235, 0.22)');
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

    const trailLen = 8;
    for (let k = 1; k <= trailLen; k++) {
      const tProg = (progress - k * 0.008 + 1.0) % 1.0;
      const tIdx = Math.floor(tProg * (points.length - 1));
      const tSub = (tProg * (points.length - 1)) - tIdx;
      const trX = lerp(points[tIdx].x, points[Math.min(tIdx + 1, points.length - 1)].x, tSub);
      const trY = lerp(points[tIdx].y, points[Math.min(tIdx + 1, points.length - 1)].y, tSub);
      const trAlpha = (1 - k / trailLen) * 0.35;

      ctx.fillStyle = sp.dotColor;
      ctx.globalAlpha = trAlpha;
      ctx.beginPath();
      ctx.arc(trX, trY, 3.5 * (1 - k / trailLen), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

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

  ctx.fillStyle = '#0D1117';
  ctx.beginPath();
  ctx.arc(diX + 32, diY + diH / 2, 6.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.beginPath();
  ctx.arc(diX + 30, diY + diH / 2 - 2, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#10B981';
  ctx.beginPath();
  ctx.arc(diX + diW - 32, diY + diH / 2, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// -------------------------------------------------------------
// 3. SUBTITLE SAFE ZONE & KINETIC CAPTIONS
// -------------------------------------------------------------
function drawKineticSubtitle(text, highlightWord = '', alpha = 1.0) {
  if (!text) return;
  ctx.save();
  ctx.globalAlpha = clamp(alpha, 0, 1);

  const subY = 1680;
  const pillW = 960;
  const pillH = 130;
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
  ctx.font = '800 34px "Plus Jakarta Sans", sans-serif';

  if (text.length > 40) {
    const words = text.split(' ');
    const mid = Math.ceil(words.length / 2);
    const line1 = words.slice(0, mid).join(' ');
    const line2 = words.slice(mid).join(' ');

    ctx.fillStyle = '#F8FAFC';
    ctx.fillText(line1, CX, subY + 45);
    ctx.fillStyle = '#38BDF8';
    ctx.fillText(line2, CX, subY + 88);
  } else {
    ctx.fillStyle = '#F8FAFC';
    ctx.fillText(text, CX, subY + pillH / 2);
  }

  ctx.restore();
}

function drawHeaderBadge() {
  ctx.save();
  const bw = 420;
  const bh = 58;
  const bx = CX - bw / 2;
  const by = 80;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, bx, by, bw, bh, 29);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#10B981';
  ctx.shadowColor = '#10B981';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(bx + 32, by + bh / 2, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 20px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('AGENCIA ARLIA', bx + 52, by + bh / 2 - 1);

  ctx.fillStyle = '#38BDF8';
  ctx.font = '700 13px "Inter", monospace';
  ctx.fillText('• CATÁLOGOS WEB', bx + 225, by + bh / 2);

  ctx.restore();
}

// -------------------------------------------------------------
// 4. ACT-BY-ACT SCENE GRAPH (FÁBRICAS Y MUEBLERÍAS)
// -------------------------------------------------------------

// ACT 1: HOOK 1 (0.0s - 3.8s) — El problema del PDF pesado
function renderAct1(t) {
  const enter = clamp(t / 0.6, 0, 1);
  const easeEnter = easeOutBack(enter);

  const pillY = lerp(-100, 240, easeEnter);
  ctx.save();
  ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
  ctx.strokeStyle = '#EF4444';
  ctx.lineWidth = 2.5;
  roundRect(ctx, CX - 290, pillY, 580, 68, 34);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#EF4444';
  ctx.font = '900 24px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('⚠️ CATÁLOGO PDF OBSOLETO Y PESADO', CX, pillY + 34);
  ctx.restore();

  // Main Hero Card: ARCHIVO 45 MB
  const card1Prog = clamp((t - 0.35) / 0.7, 0, 1);
  const card1Y = lerp(1200, 440, easeOutBack(card1Prog));

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
  ctx.lineWidth = 3.5;
  ctx.shadowColor = 'rgba(239, 68, 68, 0.45)';
  ctx.shadowBlur = 35;
  roundRect(ctx, CX - 440, card1Y, 880, 290, 32);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#94A3B8';
  ctx.font = '700 30px "Inter", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Catálogo_Muebles_2026_Final.pdf:', CX - 380, card1Y + 75);

  ctx.fillStyle = '#EF4444';
  ctx.font = '900 94px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('45 MB • NO ABRE', CX - 380, card1Y + 195);
  ctx.restore();

  // Secondary Card: Precios Desactualizados
  if (t > 1.15) {
    const card2Prog = clamp((t - 1.15) / 0.6, 0, 1);
    const card2Y = lerp(1300, 780, easeOutBack(card2Prog));

    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(239, 68, 68, 0.3)';
    ctx.shadowBlur = 25;
    roundRect(ctx, CX - 440, card2Y, 880, 240, 28);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#94A3B8';
    ctx.font = '700 28px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Resultado en el celular de tu cliente:', CX - 380, card2Y + 68);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 68px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('SIN PRECIOS NI MEDIDAS', CX - 380, card2Y + 165);
    ctx.restore();
  }

  // Abandonment Bar
  if (t > 1.75) {
    const barProg = clamp((t - 1.75) / 1.5, 0, 1);
    const fillW = lerp(800, 240, barProg);

    ctx.save();
    ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
    roundRect(ctx, CX - 440, 1070, 880, 160, 24);
    ctx.fill();

    ctx.fillStyle = '#EF4444';
    ctx.shadowColor = 'rgba(239, 68, 68, 0.6)';
    ctx.shadowBlur = 20;
    roundRect(ctx, CX - 400, 1145, fillW, 50, 14);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#F8FAFC';
    ctx.font = '700 26px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('70% de los clientes abandona antes de descargar el PDF', CX - 400, 1120);
    ctx.restore();
  }

  drawKineticSubtitle('¿Seguís mandando catálogos en PDF pesados que nadie abre?', 'PDF', clamp(t / 0.4, 0, 1));
}

// ACT 2: HOOK 2 (3.8s - 7.0s) — Caos en WhatsApp pasando medidas y precios
function renderAct2(t) {
  const localT = t - 3.8;
  const enterProg = clamp(localT / 0.7, 0, 1);
  const phoneY = lerp(1600, 820, easeOutBack(enterProg));
  const tilt = Math.sin(localT * 1.5) * 1.2;

  drawSmartphone(CX, phoneY, 1.0, tilt, (g, sx, sy, sw, sh) => {
    g.fillStyle = '#0F1E29';
    g.fillRect(sx, sy, sw, 130);

    g.fillStyle = '#25D366';
    g.beginPath();
    g.arc(sx + 75, sy + 70, 30, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#FFFFFF';
    g.font = '900 28px sans-serif';
    g.textAlign = 'center';
    g.fillText('🛋️', sx + 75, sy + 78);

    g.fillStyle = '#FFFFFF';
    g.font = '800 28px "Plus Jakarta Sans", sans-serif';
    g.textAlign = 'left';
    g.fillText('WhatsApp Ventas Fábrica', sx + 125, sy + 62);
    g.fillStyle = '#22C55E';
    g.font = '600 20px "Inter", sans-serif';
    g.fillText('🟢 En línea • 19 consultas sin cotizar', sx + 125, sy + 95);

    g.fillStyle = '#080E14';
    g.fillRect(sx, sy + 130, sw, sh - 130);

    const chats = [
      { text: 'Hola! ¿En qué medidas viene el sillón Esquinero?', delay: 0.25, type: 'user' },
      { text: '¿Qué colores de pana antimanchas tienen?', delay: 0.85, type: 'user' },
      { text: '¿El precio de la lista PDF sigue vigente?', delay: 1.5, type: 'user' },
      { text: '❌ No me abre el PDF, compré en otro lado.', delay: 2.1, type: 'danger' }
    ];

    chats.forEach((chat, idx) => {
      if (localT >= chat.delay) {
        const bProg = clamp((localT - chat.delay) / 0.4, 0, 1);
        const bScale = easeOutBack(bProg);
        const bY = sy + 180 + idx * 165;

        g.save();
        g.translate(sx + 40, bY);
        g.scale(bScale, bScale);

        if (chat.type === 'danger') {
          g.fillStyle = 'rgba(239, 68, 68, 0.22)';
          g.strokeStyle = '#EF4444';
          g.lineWidth = 3;
          roundRect(g, 0, 0, sw - 80, 130, 22);
          g.fill();
          g.stroke();

          g.fillStyle = '#FCA5A5';
          g.font = '800 26px "Plus Jakarta Sans", sans-serif';
          g.textAlign = 'left';
          g.fillText(chat.text, 30, 72);
        } else {
          g.fillStyle = '#1F2C34';
          g.strokeStyle = '#2A3942';
          g.lineWidth = 1.5;
          roundRect(g, 0, 0, sw - 120, 120, 20);
          g.fill();
          g.stroke();

          g.fillStyle = '#E9EDEF';
          g.font = '600 26px "Inter", sans-serif';
          g.textAlign = 'left';
          g.fillText(chat.text, 30, 68);

          g.fillStyle = '#8696A0';
          g.font = '500 18px monospace';
          g.textAlign = 'right';
          g.fillText('18:15', sw - 145, 98);
        }
        g.restore();
      }
    });

    if (localT > 1.95) {
      const pulse = 1 + Math.sin(t * 12) * 0.05;
      g.save();
      g.translate(0, sy + sh - 110);
      g.scale(pulse, pulse);

      g.fillStyle = '#EF4444';
      g.shadowColor = 'rgba(239, 68, 68, 0.8)';
      g.shadowBlur = 30;
      roundRect(g, -260, -45, 520, 90, 45);
      g.fill();
      g.shadowBlur = 0;

      g.fillStyle = '#FFFFFF';
      g.font = '900 26px "Plus Jakarta Sans", sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('🔥 HORAS PERDIDAS COTIZANDO A MANO', 0, 0);
      g.restore();
    }
  });

  drawKineticSubtitle('¿O perdiendo horas pasando precios y medidas por WhatsApp?', 'WhatsApp', clamp((t - 3.8) / 0.4, 0, 1));
}

// ACT 3: SOLUTION (7.0s - 11.4s) — Catálogo Web Interactivo (Telas, Medidas y Precios) + Pedido a WhatsApp
function renderAct3(t) {
  const localT = t - 7.0;
  const phoneY = 820;
  const tilt = Math.sin(localT * 1.2) * 0.8;

  drawSmartphone(CX, phoneY, 1.04, tilt, (g, sx, sy, sw, sh) => {
    if (localT < 3.0) {
      g.fillStyle = '#0F172A';
      g.fillRect(sx, sy, sw, 150);

      g.fillStyle = '#38BDF8';
      g.font = '900 30px "Plus Jakarta Sans", sans-serif';
      g.textAlign = 'left';
      g.fillText('MUEBLES & DISEÑO • CATÁLOGO 🛋️', sx + 40, sy + 72);

      g.fillStyle = '#10B981';
      g.font = '600 21px "Inter", sans-serif';
      g.fillText('🟢 Precios al día • Variantes de Tela y Medida', sx + 40, sy + 112);

      const products = [
        {
          name: 'Sillón Chesterfield 3 Cuerpos',
          price: '$680.000',
          desc: 'Medida: 2.20x0.95m • Tela: Pana Gris',
          emoji: '🛋️',
          added: localT > 0.8
        },
        {
          name: 'Mesa Comedor Roble Macizo',
          price: '$490.000',
          desc: 'Medida: 2.00x1.00m • Lustre Natural',
          emoji: '🪑',
          added: localT > 1.7
        },
        {
          name: 'Rack TV Nórdico Paraíso',
          price: '$260.000',
          desc: 'Medida: 1.80x0.55m • Puertas Laqueadas',
          emoji: '📺',
          added: false
        }
      ];

      products.forEach((prod, i) => {
        const cardY = sy + 180 + i * 220;

        g.fillStyle = '#161F30';
        g.strokeStyle = '#26344A';
        g.lineWidth = 2;
        roundRect(g, sx + 30, cardY, sw - 60, 195, 22);
        g.fill();
        g.stroke();

        g.fillStyle = '#223046';
        roundRect(g, sx + 45, cardY + 22, 150, 150, 18);
        g.fill();
        g.font = '72px sans-serif';
        g.textAlign = 'center';
        g.fillText(prod.emoji, sx + 120, cardY + 120);

        g.fillStyle = '#FFFFFF';
        g.font = '800 25px "Plus Jakarta Sans", sans-serif';
        g.textAlign = 'left';
        g.fillText(prod.name, sx + 215, cardY + 58);

        g.fillStyle = '#38BDF8';
        g.font = '600 19px "Inter", sans-serif';
        g.fillText(prod.desc, sx + 215, cardY + 95);

        g.fillStyle = '#10B981';
        g.font = '900 32px "Plus Jakarta Sans", sans-serif';
        g.fillText(prod.price, sx + 215, cardY + 148);

        const btnW = 155;
        const btnH = 55;
        const btnX = sx + sw - 205;
        const btnY = cardY + 110;

        if (prod.added) {
          g.fillStyle = '#10B981';
          g.shadowColor = 'rgba(16, 185, 129, 0.4)';
          g.shadowBlur = 15;
          roundRect(g, btnX, btnY, btnW, btnH, 14);
          g.fill();
          g.shadowBlur = 0;

          g.fillStyle = '#FFFFFF';
          g.font = '800 22px "Plus Jakarta Sans", sans-serif';
          g.textAlign = 'center';
          g.fillText('✓ Elegido', btnX + btnW / 2, btnY + 35);
        } else {
          g.fillStyle = '#2563EB';
          roundRect(g, btnX, btnY, btnW, btnH, 14);
          g.fill();

          g.fillStyle = '#FFFFFF';
          g.font = '700 22px "Plus Jakarta Sans", sans-serif';
          g.textAlign = 'center';
          g.fillText('+ Cotizar', btnX + btnW / 2, btnY + 35);
        }
      });

      if (localT >= 0.75 && localT <= 1.1) {
        const rProg = (localT - 0.75) / 0.35;
        g.strokeStyle = `rgba(56, 189, 248, ${1 - rProg})`;
        g.lineWidth = 4;
        g.beginPath();
        g.arc(sx + sw - 125, sy + 180 + 137, rProg * 45, 0, Math.PI * 2);
        g.stroke();
      }

      const cartY = sy + sh - 130;
      const itemCount = localT > 1.7 ? '2 muebles' : localT > 0.8 ? '1 mueble' : '0 muebles';
      const totalCost = localT > 1.7 ? '$1.170.000' : localT > 0.8 ? '$680.000' : '$0';

      g.fillStyle = '#10B981';
      g.shadowColor = 'rgba(16, 185, 129, 0.6)';
      g.shadowBlur = 25;
      roundRect(g, sx + 30, cartY, sw - 60, 95, 24);
      g.fill();
      g.shadowBlur = 0;

      g.fillStyle = '#FFFFFF';
      g.font = '900 26px "Plus Jakarta Sans", sans-serif';
      g.textAlign = 'left';
      g.fillText(`📋 Enviar Pedido (${itemCount})`, sx + 55, cartY + 58);

      g.textAlign = 'right';
      g.fillText(`${totalCost} ➔`, sx + sw - 55, cartY + 58);
    } else {
      // 3.0s+ in scene: Instant WhatsApp Order Quote Ticket
      const tickProg = clamp((localT - 3.0) / 0.5, 0, 1);
      const ticketY = lerp(sy + sh, sy + 40, easeOutBack(tickProg));

      g.fillStyle = '#0B131E';
      g.fillRect(sx, sy, sw, sh);

      g.fillStyle = '#22C55E';
      g.shadowColor = 'rgba(34, 197, 94, 0.5)';
      g.shadowBlur = 20;
      roundRect(g, sx + 30, ticketY, sw - 60, 110, 22);
      g.fill();
      g.shadowBlur = 0;

      g.fillStyle = '#FFFFFF';
      g.font = '900 27px "Plus Jakarta Sans", sans-serif';
      g.textAlign = 'center';
      g.fillText('🟢 PEDIDO DETALLADO EN TU WHATSAPP', sx + sw / 2, ticketY + 65);

      const boxY = ticketY + 140;
      g.fillStyle = '#162032';
      g.strokeStyle = '#2C3E5B';
      g.lineWidth = 2.5;
      roundRect(g, sx + 40, boxY, sw - 80, 780, 26);
      g.fill();
      g.stroke();

      g.fillStyle = '#38BDF8';
      g.font = '800 25px "Inter", monospace';
      g.textAlign = 'left';
      g.fillText('📋 ORDEN DE FÁBRICA #814', sx + 75, boxY + 70);

      g.fillStyle = '#94A3B8';
      g.font = '600 21px "Inter", sans-serif';
      g.fillText('Cliente: Estudio Sur • Envío a Nordelta', sx + 75, boxY + 115);

      g.strokeStyle = '#2E3E56';
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(sx + 75, boxY + 150);
      g.lineTo(sx + sw - 75, boxY + 150);
      g.stroke();

      g.fillStyle = '#FFFFFF';
      g.font = '700 23px "Inter", sans-serif';
      g.fillText('• 1x Sillón Chesterfield (2.20m • Pana Gris)', sx + 75, boxY + 210);
      g.fillText('• 1x Mesa Roble Macizo (2.00x1.00m)', sx + 75, boxY + 270);

      g.beginPath();
      g.moveTo(sx + 75, boxY + 330);
      g.lineTo(sx + sw - 75, boxY + 330);
      g.stroke();

      g.fillStyle = '#10B981';
      g.font = '900 46px "Plus Jakarta Sans", sans-serif';
      g.fillText('TOTAL: $1.170.000', sx + 75, boxY + 420);

      g.fillStyle = '#38BDF8';
      g.font = '700 23px "Inter", sans-serif';
      g.fillText('✓ Medidas y tapizados ya seleccionados', sx + 75, boxY + 480);
      g.fillText('✓ Listo para señar y pasar a taller', sx + 75, boxY + 530);

      g.fillStyle = 'rgba(56, 189, 248, 0.15)';
      roundRect(g, sx + 75, boxY + 620, sw - 150, 70, 16);
      g.fill();
      g.fillStyle = '#38BDF8';
      g.font = '800 22px "Plus Jakarta Sans", sans-serif';
      g.textAlign = 'center';
      g.fillText('⚡ Sin perder tiempo • Sistema Agencia Arlia', sx + sw / 2, boxY + 665);
    }
  });

  drawKineticSubtitle('Pasate a tu catálogo web interactivo: telas, medidas y precios al instante.', 'interactivo', clamp((t - 7.0) / 0.4, 0, 1));
}

// ACT 4: IMPACT (11.4s - 15.8s) — Actualizá precios en 1 clic & recibí pedidos listos
function renderAct4(t) {
  const localT = t - 11.4;

  ctx.save();
  const shockGrad = ctx.createRadialGradient(CX, 620, 50, CX, 620, 950);
  shockGrad.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
  shockGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
  ctx.fillStyle = shockGrad;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

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
  roundRect(ctx, -440, -180, 880, 360, 38);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#10B981';
  ctx.font = '900 100px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PRECIOS EN 1 CLIC', 0, -25);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 30px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('OLVIDATE DE REHACER ARCHIVOS PDF', 0, 75);
  ctx.restore();

  const barProg = clamp((localT - 0.5) / 0.8, 0, 1);
  const barY = 880;

  // Bar 1: Catálogo PDF Tradicional
  ctx.save();
  ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
  roundRect(ctx, CX - 440, barY, 880, 120, 22);
  ctx.fill();

  ctx.fillStyle = '#EF4444';
  roundRect(ctx, CX - 440, barY, 520, 120, 22);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 26px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('Catálogo PDF (Precios Viejos • Ventas Perdidas)', CX - 410, barY + 60);
  ctx.restore();

  // Bar 2: Catálogo Web Agencia Arlia
  const arliaW = lerp(0, 880, easeOutQuad(barProg));
  ctx.save();
  ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
  roundRect(ctx, CX - 440, barY + 160, 880, 140, 26);
  ctx.fill();

  ctx.fillStyle = '#10B981';
  ctx.shadowColor = 'rgba(16, 185, 129, 0.7)';
  ctx.shadowBlur = 30;
  roundRect(ctx, CX - 440, barY + 160, arliaW, 140, 26);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 31px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('🚀 Tu Catálogo Web (100% ACTUALIZADO 24/7)', CX - 410, barY + 230);
  ctx.restore();

  if (localT > 1.2) {
    const boxAlpha = clamp((localT - 1.2) / 0.5, 0, 1);
    ctx.save();
    ctx.globalAlpha = boxAlpha;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    roundRect(ctx, CX - 410, 1240, 820, 110, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38BDF8';
    ctx.font = '800 31px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🛠️ Recibí pedidos listos para pasar a fábrica', CX, 1295);
    ctx.restore();
  }

  drawKineticSubtitle('Actualizá tus precios en un clic y recibí pedidos listos para fabricar.', 'un clic', clamp((t - 11.4) / 0.4, 0, 1));
}

// ACT 5: OUTRO & CTA (15.8s - 20.0s) — Agencia Arlia Prestige Emblem & "Pedí presupuesto por MD"
function renderAct5(t) {
  const localT = t - 15.8;
  const enterProg = clamp(localT / 0.7, 0, 1);
  const logoScale = easeOutBack(enterProg);

  const logoY = 640;

  ctx.save();
  ctx.translate(CX, logoY);

  const rot1 = localT * 0.25;
  const rot2 = -localT * 0.18;

  ctx.save();
  ctx.rotate(rot1);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.lineWidth = 3;
  ctx.setLineDash([30, 20]);
  ctx.beginPath();
  ctx.arc(0, 0, 240, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.rotate(rot2);
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([50, 25]);
  ctx.beginPath();
  ctx.arc(0, 0, 290, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.scale(logoScale, logoScale);

  const shieldGrad = ctx.createLinearGradient(-150, -150, 150, 150);
  shieldGrad.addColorStop(0, '#2563EB');
  shieldGrad.addColorStop(1, '#10B981');

  ctx.fillStyle = '#0F172A';
  ctx.strokeStyle = shieldGrad;
  ctx.lineWidth = 6;
  ctx.shadowColor = 'rgba(37, 99, 235, 0.7)';
  ctx.shadowBlur = 40;
  ctx.beginPath();
  ctx.arc(0, 0, 180, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(-35, 30);
  ctx.bezierCurveTo(-110, -30, -130, -100, -50, -120);
  ctx.bezierCurveTo(-25, -80, -15, -40, -35, 30);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(35, 30);
  ctx.bezierCurveTo(110, -30, 130, -100, 50, -120);
  ctx.bezierCurveTo(25, -80, 15, -40, 35, 30);
  ctx.stroke();

  ctx.fillStyle = '#10B981';
  ctx.beginPath();
  ctx.moveTo(0, -135);
  ctx.lineTo(24, -70);
  ctx.lineTo(44, -10);
  ctx.lineTo(0, 65);
  ctx.lineTo(-44, -10);
  ctx.lineTo(-24, -70);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = '#FFFFFF';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(0, -25, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();

  // Brand Typography
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 86px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
  ctx.shadowBlur = 25;
  ctx.fillText('AGENCIA ARLIA', CX, 1040);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#38BDF8';
  ctx.font = '700 30px "Inter", sans-serif';
  ctx.fillText('CATÁLOGOS WEB PARA FÁBRICAS Y MUEBLERÍAS', CX, 1105);
  ctx.restore();

  // High-Conversion CTA Button: "Pedí presupuesto por MD 💬"
  const ctaPulse = 1 + Math.sin(localT * 8) * 0.04;
  ctx.save();
  ctx.translate(CX, 1310);
  ctx.scale(ctaPulse, ctaPulse);

  const ctaGrad = ctx.createLinearGradient(-390, 0, 390, 0);
  ctaGrad.addColorStop(0, '#2563EB');
  ctaGrad.addColorStop(1, '#10B981');

  ctx.fillStyle = ctaGrad;
  ctx.shadowColor = 'rgba(37, 99, 235, 0.85)';
  ctx.shadowBlur = 40;
  roundRect(ctx, -390, -68, 780, 136, 68);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 42px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Pedí presupuesto por MD 💬', 0, 0);
  ctx.restore();

  drawKineticSubtitle('Agencia Arlia. Pedí presupuesto por MD.', 'Pedí presupuesto', clamp((t - 15.8) / 0.4, 0, 1));
}

// -------------------------------------------------------------
// 5. MASTER FRAME RENDERER (DETERMINISTIC window.render(t))
// -------------------------------------------------------------
function render(t) {
  t = clamp(t, 0, DUR);

  ctx.clearRect(0, 0, W, H);

  drawPrestigeBackground(t);
  drawHeaderBadge();

  if (t < 3.8) {
    renderAct1(t);
  } else if (t >= 3.8 && t < 7.0) {
    renderAct2(t);
  } else if (t >= 7.0 && t < 11.4) {
    renderAct3(t);
  } else if (t >= 11.4 && t < 15.8) {
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

// Initial Frame Render
render(0);

// Signal to headless render harness (video.mjs) that page is ready
window.READY = true;