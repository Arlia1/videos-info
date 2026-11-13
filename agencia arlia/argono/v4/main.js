/**
 * AGENCIA ARLIA — HIGH-END 2D COMMERCIAL MOTION ENGINE (1080x1920)
 * Vertical: Gastronomía (Antes vs Después: 30% Comisión vs Web Propia 0%)
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

// 0. BRAND LOGO IMAGE LOADER (logo_cutout)
const brandLogo = new Image();
let brandLogoLoaded = false;

const LOGO_CANDIDATES = [
  'logo_cutout.png',
  'logo_cutout.webp',
  'logo_cutout.svg',
  'logo_cutout.jpg',
  'logo_cutout',
  'assets/logo_cutout.png',
  'assets/logo_cutout.webp'
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

const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));
const lerp = (a, b, t) => a + (b - a) * t;
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

    if (lines.length <= maxLines && lines.every(l => g.measureText(l).width <= maxWidth)) {
      break;
    }
    size -= 1;
  }

  const lineHeight = size * lineHeightRatio;
  const totalHeight = (lines.length - 1) * lineHeight;
  const startY = centerY - totalHeight / 2;

  lines.forEach((line, idx) => {
    g.fillStyle = (secondLineColor && idx > 0) ? secondLineColor : g.fillStyle;
    g.fillText(line, x, startY + idx * lineHeight, maxWidth);
  });
}

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
}

function drawKineticSubtitle(text, alpha = 1.0) {
  if (!text) return;
  ctx.save();
  ctx.globalAlpha = clamp(alpha, 0, 1);

  const subY = 1675, pillW = 960, pillH = 140, pillX = (W - pillW) / 2;
  ctx.fillStyle = 'rgba(10, 15, 28, 0.94)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 30;
  roundRect(ctx, pillX, subY, pillW, pillH, 32);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
  ctx.lineWidth = 2.5;
  roundRect(ctx, pillX, subY, pillW, pillH, 32);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#F8FAFC';
  fitMultilineText(ctx, text, CX, subY + pillH / 2, pillW - 70, 2, 32, 1.3, '800', '"Plus Jakarta Sans", sans-serif', '#38BDF8');
  ctx.restore();
}

function drawHeaderBadge(mode = 'antes') {
  ctx.save();
  const bw = 420, bh = 58, bx = CX - bw / 2, by = 80;

  ctx.fillStyle = mode === 'antes' ? 'rgba(127, 29, 29, 0.85)' : 'rgba(6, 95, 70, 0.85)';
  ctx.strokeStyle = mode === 'antes' ? '#EF4444' : '#10B981';
  ctx.lineWidth = 1.5;
  roundRect(ctx, bx, by, bw, bh, 29);
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  fitText(ctx, mode === 'antes' ? '🔴 EL ANTES (Comisiones Altas)' : '🟢 EL DESPUÉS (Tu Web Propia)', CX, by + bh / 2, bw - 30, 18, '900');
  ctx.restore();
}

// RENDER ACTS (Antes vs Después)
function render(t) {
  t = clamp(t, 0, DUR);
  ctx.clearRect(0, 0, W, H);
  drawPrestigeBackground(t);

  const cardW = 880, cardPad = 55, maxTextW = cardW - cardPad * 2;

  if (t < 8.0) {
    // --- BLOQUE ANTES (0.0s - 8.0s) ---
    drawHeaderBadge('antes');

    // Pill Roja Superior
    const pillY = 220;
    ctx.save();
    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2.5;
    roundRect(ctx, CX - 320, pillY, 640, 68, 34);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#EF4444';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    fitText(ctx, '⚠️ 30% DE COMISIÓN REGALADA', CX, pillY + 34, 600, 23, '900');
    ctx.restore();

    // Tarjeta -30%
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
    ctx.lineWidth = 3.5;
    roundRect(ctx, CX - cardW / 2, 420, cardW, 290, 32);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#94A3B8'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    fitText(ctx, 'Apps de delivery tradicionales:', CX - cardW / 2 + cardPad, 420 + 78, maxTextW, 28, '700');
    ctx.fillStyle = '#EF4444';
    fitText(ctx, '-30% POR CADA PEDIDO', CX - cardW / 2 + cardPad, 420 + 195, maxTextW, 72, '900');
    ctx.restore();

    // Tarjeta WhatsApp explotado
    if (t > 3.5) {
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
      ctx.lineWidth = 3;
      roundRect(ctx, CX - cardW / 2, 760, cardW, 250, 28);
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = '#94A3B8'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      fitText(ctx, 'Atención manual en WhatsApp:', CX - cardW / 2 + cardPad, 760 + 70, maxTextW, 28, '700');
      ctx.fillStyle = '#FFFFFF';
      fitText(ctx, '💬 CHATS COLAPSADOS', CX - cardW / 2 + cardPad, 760 + 165, maxTextW, 60, '900');
      ctx.restore();
    }

    drawKineticSubtitle('¿Antes? Pagando hasta el 30% de comisión en apps de delivery y con el WhatsApp explotado.', clamp(t / 0.4, 0, 1));

  } else if (t >= 8.0 && t < 15.8) {
    // --- BLOQUE DESPUÉS (8.0s - 15.8s) ---
    drawHeaderBadge('despues');

    const pillY = 220;
    ctx.save();
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2.5;
    roundRect(ctx, CX - 340, pillY, 680, 68, 34);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#10B981';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    fitText(ctx, '🚀 TU PROPIA WEB DE PEDIDOS', CX, pillY + 34, 640, 23, '900');
    ctx.restore();

    // Tarjeta Solución Web
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
    ctx.lineWidth = 3.5;
    roundRect(ctx, CX - cardW / 2, 420, cardW, 290, 32);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#94A3B8'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    fitText(ctx, 'Catálogo automático interactivo:', CX - cardW / 2 + cardPad, 420 + 78, maxTextW, 28, '700');
    ctx.fillStyle = '#10B981';
    fitText(ctx, '📋 COMANDA DIRECTA A WHATSAPP', CX - cardW / 2 + cardPad, 420 + 195, maxTextW, 52, '900');
    ctx.restore();

    // Tarjeta 0% Comisión
    if (t > 11.5) {
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
      ctx.lineWidth = 3;
      roundRect(ctx, CX - cardW / 2, 760, cardW, 250, 28);
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = '#94A3B8'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      fitText(ctx, 'Rentabilidad final por venta:', CX - cardW / 2 + cardPad, 760 + 70, maxTextW, 28, '700');
      ctx.fillStyle = '#FFFFFF';
      fitText(ctx, '0% COMISIÓN • 100% TUYO', CX - cardW / 2 + cardPad, 760 + 165, maxTextW, 58, '900');
      ctx.restore();
    }

    drawKineticSubtitle(t < 13.2 ? '¿Después? Tu propia web de pedidos con catálogo automático y comanda directa a tu WhatsApp.' : 'Todo el margen es para tu local.', clamp((t - 8.0) / 0.4, 0, 1));

  } else {
    // --- BLOQUE OUTRO & CTA (15.8s - 20.0s) ---
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
    ctx.beginPath(); ctx.arc(0, 0, 250, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.rotate(rot2);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([50, 25]);
    ctx.beginPath(); ctx.arc(0, 0, 300, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();

    const glowGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, 260);
    glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.38)');
    glowGrad.addColorStop(0.5, 'rgba(37, 99, 235, 0.16)');
    glowGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath(); ctx.arc(0, 0, 260, 0, Math.PI * 2); ctx.fill();

    ctx.scale(logoScale, logoScale);

    if (brandLogoLoaded && brandLogo.naturalWidth > 0) {
      const maxBox = 400;
      const imgRatio = brandLogo.naturalWidth / brandLogo.naturalHeight;
      let drawW = maxBox, drawH = maxBox;
      if (imgRatio > 1) { drawH = maxBox / imgRatio; } else { drawW = maxBox * imgRatio; }

      ctx.shadowColor = 'rgba(56, 189, 248, 0.55)';
      ctx.shadowBlur = 35;
      ctx.drawImage(brandLogo, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.shadowBlur = 0;
    }
    ctx.restore();

    ctx.save();
    ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.shadowColor = 'rgba(56, 189, 248, 0.5)'; ctx.shadowBlur = 25;
    fitText(ctx, 'AGENCIA ARLIA', CX, 1040, 920, 86, '900');
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#38BDF8';
    fitText(ctx, 'SISTEMAS WEB PARA GASTRONOMÍA', CX, 1105, 920, 30, '700', '"Inter", sans-serif');
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
    ctx.fill(); ctx.shadowBlur = 0;

    ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    fitText(ctx, 'Pedí presupuesto por MD 💬', 0, 0, ctaW - 70, 42, '900');
    ctx.restore();

    drawKineticSubtitle('Agencia Arlia. Pedí presupuesto por MD.', clamp(localT / 0.4, 0, 1));
  }
}

window.render = render;

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
      if (audio) { audio.currentTime = 0; audio.play().catch(() => {}); }
    }
    render(currentTime);
    animId = requestAnimationFrame(loop);
  }
}

function togglePlay() {
  isPlaying = !isPlaying;
  if (isPlaying) {
    lastTimestamp = null;
    if (audio) { audio.currentTime = currentTime; audio.play().catch(() => {}); }
    animId = requestAnimationFrame(loop);
  } else {
    if (audio) audio.pause();
    if (animId) cancelAnimationFrame(animId);
  }
}

canvas.addEventListener('click', togglePlay);
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
});

tryLoadNextLogo();