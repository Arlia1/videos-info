// Bailapp — Video Viral Reel: "Chau WhatsApp y Comprobantes, Hola Automatización"
// Duración: 26.5 segundos @ 24 fps (1080x1920)
// Con badges superiores dinámicos auto-ajustables y centrado responsivo

const cv = document.getElementById('c');
const g = cv.getContext('2d');

const W = 1080;
const H = 1920;
const CX = W / 2;

// Load Character Assets
const assets = {};
const charNames = ['character_generico_1', 'character_generico_2', 'character_urbano', 'character_heels', 'character_ballet'];

async function loadAssets() {
  const promises = charNames.map(name => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = `assets/${name}.png`;
      img.onload = () => { assets[name] = img; resolve(); };
      img.onerror = (e) => reject(`Failed to load ${name}: ${e}`);
    });
  });
  await Promise.all(promises);
  console.log('Personajes de Bailapp cargados con éxito para WhatsApp Reel!');
}

await loadAssets();

// Global Math / Easing Utilities
function clamp(v, min = 0, max = 1) { return Math.max(min, Math.min(max, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function easeOutQuad(t) { return t * (2 - t); }
function easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
function easeOutBack(t, s = 1.70158) { return (t = t - 1) * t * ((s + 1) * t + s) + 1; }
function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; }

// Helper for rounded rectangles
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// -------------------------------------------------------------
// BADGE SUPERIOR AUTO-AJUSTABLE Y CENTRADO DINÁMICAMENTE
// -------------------------------------------------------------
function drawHeaderBadge(g, text) {
  g.save();
  g.font = '800 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  
  const textMetrics = g.measureText(text);
  const textWidth = textMetrics.width;
  
  const paddingH = 30;
  const dotRadius = 6;
  const dotGap = 16;
  
  const bw = Math.round(textWidth + paddingH * 2 + dotRadius * 2 + dotGap);
  const bh = 60;
  const bx = Math.round((W - bw) / 2);
  const by = 80;

  g.fillStyle = '#FFFFFF';
  g.shadowColor = 'rgba(224, 99, 133, 0.18)';
  g.shadowBlur = 24;
  g.shadowOffsetY = 8;
  roundRect(g, bx, by, bw, bh, 30);
  g.fill();
  g.shadowColor = 'transparent';

  g.strokeStyle = '#FAD2E1';
  g.lineWidth = 2.5;
  g.stroke();

  const dotX = bx + paddingH + dotRadius;
  const dotY = by + bh / 2;
  g.fillStyle = '#E06385';
  g.beginPath();
  g.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
  g.fill();

  g.fillStyle = '#2D242E';
  g.textAlign = 'left';
  g.textBaseline = 'middle';
  g.fillText(text, dotX + dotRadius + dotGap, by + bh / 2 + 1);

  g.restore();
}

// -------------------------------------------------------------
// CAPA 4: SUBTÍTULOS EN SAFE ZONE INVIOLABLE (ALTO CONTRASTE Y PREVENCIÓN DE DESBORDE)
// -------------------------------------------------------------
function drawSubtitleSafeZone(g, text) {
  const subY = 1370;
  const pillW = 960;
  const pillH = 140;
  const pillX = (W - pillW) / 2;
  const maxW = pillW - 90; // Margen interno de seguridad (870px)

  g.save();
  
  g.fillStyle = 'rgba(255, 255, 255, 0.98)';
  g.shadowColor = 'rgba(224, 99, 133, 0.22)';
  g.shadowBlur = 32;
  g.shadowOffsetY = 12;
  roundRect(g, pillX, subY, pillW, pillH, 36);
  g.fill();
  g.shadowColor = 'transparent';

  g.strokeStyle = '#F8C8DC';
  g.lineWidth = 2.5;
  g.stroke();

  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillStyle = '#2D242E';

  function wrapWordsToLines(words, maxLineWidth) {
    const lines = [];
    let curLine = '';
    for (let i = 0; i < words.length; i++) {
      const test = curLine ? curLine + ' ' + words[i] : words[i];
      if (g.measureText(test).width <= maxLineWidth) {
        curLine = test;
      } else {
        if (curLine) lines.push(curLine);
        curLine = words[i];
      }
    }
    if (curLine) lines.push(curLine);
    return lines;
  }

  const words = text.split(' ');
  let fontSize = 33;
  g.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  let lines = wrapWordsToLines(words, maxW);

  if (lines.length > 2) {
    fontSize = 27;
    g.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    lines = wrapWordsToLines(words, maxW);
  }

  while (lines.length > 2 && fontSize > 18) {
    fontSize -= 2;
    g.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    lines = wrapWordsToLines(words, maxW);
  }

  if (lines.length === 1) {
    g.font = '800 34px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    g.fillText(lines[0], CX, subY + pillH / 2);
  } else if (lines.length === 2) {
    const lineHeight = fontSize + 12;
    const startY = subY + (pillH / 2) - (lineHeight / 2);
    g.fillText(lines[0], CX, startY);
    g.fillText(lines[1], CX, startY + lineHeight);
  } else {
    const lineHeight = fontSize + 8;
    const startY = subY + (pillH / 2) - lineHeight;
    lines.slice(0, 3).forEach((line, idx) => {
      g.fillText(line, CX, startY + idx * lineHeight);
    });
  }

  g.restore();
}

// -------------------------------------------------------------
// FONDO ESTUDIO SOFT PASTEL
// -------------------------------------------------------------
function drawStudioBackground(g, mood = 'night') {
  g.save();
  
  const grad = g.createLinearGradient(0, 0, 0, H);
  if (mood === 'night') {
    grad.addColorStop(0, '#FFF0F5');
    grad.addColorStop(0.5, '#FCE4EC');
    grad.addColorStop(1, '#F8BBD0');
  } else {
    grad.addColorStop(0, '#FFF5F8');
    grad.addColorStop(0.45, '#FDEBF2');
    grad.addColorStop(1, '#FBD4E3');
  }
  g.fillStyle = grad;
  g.fillRect(0, 0, W, H);

  // Panel arquitectónico central
  const archW = 960;
  const archH = 1180;
  const archX = (W - archW) / 2;
  const archY = 160;

  g.fillStyle = '#FFFFFF';
  g.shadowColor = 'rgba(224, 99, 133, 0.12)';
  g.shadowBlur = 40;
  g.shadowOffsetY = 15;
  roundRect(g, archX, archY, archW, archH, 50);
  g.fill();
  g.shadowColor = 'transparent';

  g.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  g.lineWidth = 4;
  g.stroke();

  // Espejos
  for (let i = 0; i < 3; i++) {
    const mx = archX + 40 + i * 295;
    const my = archY + 50;
    const mw = 280;
    const mh = 700;
    
    g.fillStyle = 'rgba(255, 246, 249, 0.7)';
    roundRect(g, mx, my, mw, mh, 24);
    g.fill();
    g.strokeStyle = '#FAD2E1';
    g.lineWidth = 2;
    g.stroke();

    g.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(mx + 30, my + 60);
    g.lineTo(mx + 110, my + 680);
    g.stroke();
  }

  // Barra de danza
  g.strokeStyle = '#D8A3B8';
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(archX + 30, archY + 480);
  g.lineTo(archX + archW - 30, archY + 480);
  g.stroke();

  // Piso de danza
  const floorY = archY + 760;
  const floorGrad = g.createLinearGradient(0, floorY, 0, archY + archH);
  floorGrad.addColorStop(0, '#F5DFE8');
  floorGrad.addColorStop(1, '#EAC2D2');
  g.fillStyle = floorGrad;
  g.fillRect(archX + 10, floorY, archW - 20, archH - 770);

  g.restore();
}

// -------------------------------------------------------------
// ESCENA 1: HOOK — "SON LAS 11 DE LA NOCHE Y SEGUÍS EN WHATSAPP" (t: 0.0s – 5.0s)
// -------------------------------------------------------------
function drawScene1(g, t) {
  drawStudioBackground(g, 'night');
  drawHeaderBadge(g, 'El infierno de WhatsApp • 💬');

  // Widget Reloj Digital 23:00 hs
  const clockW = 440;
  const clockH = 100;
  const clockX = CX - clockW / 2;
  const clockY = 240;

  g.save();
  g.fillStyle = '#2D242E';
  g.shadowColor = 'rgba(0, 0, 0, 0.15)';
  g.shadowBlur = 24;
  roundRect(g, clockX, clockY, clockW, clockH, 25);
  g.fill();
  g.shadowColor = 'transparent';

  g.strokeStyle = '#E06385';
  g.lineWidth = 2.5;
  g.stroke();

  g.font = '800 36px monospace';
  g.fillStyle = '#E06385';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('🌙 23:00 HS', CX, clockY + clockH / 2);
  g.restore();

  // Tarjeta de Notificaciones Acumuladas
  const cardScale = easeOutBack(clamp(t * 1.6, 0, 1));
  g.save();
  g.translate(CX - 150, 480);
  g.scale(cardScale, cardScale);
  
  const cw = 500, ch = 120;
  g.fillStyle = 'rgba(255, 255, 255, 0.96)';
  g.shadowColor = 'rgba(37, 211, 102, 0.25)';
  g.shadowBlur = 28;
  roundRect(g, -cw/2, -ch/2, cw, ch, 24);
  g.fill();
  g.shadowColor = 'transparent';

  g.strokeStyle = '#25D366';
  g.lineWidth = 3;
  g.stroke();

  g.fillStyle = '#075E54';
  g.font = '800 24px sans-serif';
  g.textAlign = 'left';
  g.fillText('💬 WhatsApp Business', -cw/2 + 30, -14);
  g.fillStyle = '#E06385';
  g.font = '800 22px sans-serif';
  g.fillText('38 mensajes sin responder para mañana', -cw/2 + 30, 26);
  g.restore();

  // Personaje: Dueña del estudio con celular (character_generico_1)
  const char = assets['character_generico_1'];
  if (char) {
    const enterX = lerp(W + 50, CX + 60, easeOutQuad(clamp(t * 1.5, 0, 1)));
    const breathY = Math.sin(t * 3.5) * 6;
    g.drawImage(char, enterX, 620 + breathY, 440, 660);
  }

  drawSubtitleSafeZone(g, 'Son las 11 de la noche... y seguís respondiendo mensajes.');
}

// -------------------------------------------------------------
// ESCENA 2: AGITACIÓN — COMPROBANTES, EXCEL Y CANCELACIONES (t: 5.0s – 11.8s)
// -------------------------------------------------------------
function drawScene2(g, t) {
  drawStudioBackground(g, 'night');
  drawHeaderBadge(g, 'El caos manual de cada día • 📑');

  const st = t - 5.0;

  // Personaje dueña abrumada (character_generico_2)
  const char = assets['character_generico_2'];
  if (char) {
    g.drawImage(char, CX + 80, 620, 430, 650);
  }

  // Tarjeta 1: "¿Me pasás el alias?"
  if (st > 0.2) {
    const s1 = easeOutBack(clamp((st - 0.2) * 2.2, 0, 1));
    g.save();
    g.translate(CX - 240, 390);
    g.scale(s1, s1);
    g.fillStyle = '#FFFFFF';
    g.shadowColor = 'rgba(0, 0, 0, 0.12)';
    g.shadowBlur = 24;
    roundRect(g, -240, -50, 480, 100, 22);
    g.fill();
    g.strokeStyle = '#FAD2E1';
    g.lineWidth = 2;
    g.stroke();

    g.font = '800 22px sans-serif';
    g.fillStyle = '#2D242E';
    g.textAlign = 'left';
    g.fillText('💬 "¿Me pasás el alias? Te transfiero..."', -210, -10);
    g.font = '700 18px sans-serif';
    g.fillStyle = '#7E747C';
    g.fillText('Esperando comprobante hace 3 días', -210, 24);
    g.restore();
  }

  // Tarjeta 2: Planilla Excel descontrolada
  if (st > 1.8) {
    const s2 = easeOutBack(clamp((st - 1.8) * 2.2, 0, 1));
    g.save();
    g.translate(CX - 220, 560);
    g.scale(s2, s2);
    g.fillStyle = '#FFF8E1';
    g.shadowColor = 'rgba(255, 179, 0, 0.2)';
    g.shadowBlur = 24;
    roundRect(g, -250, -55, 500, 110, 22);
    g.fill();
    g.strokeStyle = '#FFB300';
    g.lineWidth = 2.5;
    g.stroke();

    g.font = '800 22px sans-serif';
    g.fillStyle = '#E65100';
    g.textAlign = 'left';
    g.fillText('📊 Planilla Excel / Cuaderno manual', -220, -14);
    g.font = '700 18px sans-serif';
    g.fillStyle = '#D81B60';
    g.fillText('Tachones, sobrecupos y pagos sin conciliar', -220, 24);
    g.restore();
  }

  // Tarjeta 3: Cancelación 10 minutos antes
  if (st > 3.6) {
    const s3 = easeOutBack(clamp((st - 3.6) * 2.2, 0, 1));
    g.save();
    g.translate(CX - 230, 750);
    g.scale(s3, s3);
    g.fillStyle = '#FFEBEE';
    g.shadowColor = 'rgba(211, 47, 47, 0.25)';
    g.shadowBlur = 26;
    roundRect(g, -240, -55, 480, 110, 22);
    g.fill();
    g.strokeStyle = '#D32F2F';
    g.lineWidth = 2.5;
    g.stroke();

    g.font = '800 22px sans-serif';
    g.fillStyle = '#C62828';
    g.textAlign = 'left';
    g.fillText('🔴 18:45 hs: "Ay perdón, no llego!"', -210, -14);
    g.font = '700 18px sans-serif';
    g.fillStyle = '#7E747C';
    g.fillText('Cupo reservado de palabra... que nadie pagó', -210, 24);
    g.restore();
  }

  drawSubtitleSafeZone(g, 'Pedir comprobantes, chequear transferencias... para que te cancelen.');
}

// -------------------------------------------------------------
// ESCENA 3: EL REFRAME — BAILAPP AUTOMATIZA TODO (t: 11.8s – 17.1s)
// -------------------------------------------------------------
function drawScene3(g, t) {
  drawStudioBackground(g, 'day');
  drawHeaderBadge(g, 'Automatización total • ✨');

  const st = t - 11.8;

  // Mockup Smartphone iPhone en el centro
  const phoneEnter = easeOutBack(clamp(st * 1.5, 0, 1));
  const pw = 420;
  const ph = 840;
  const px = CX - pw / 2 - 140;
  const py = 320;

  g.save();
  g.translate(CX - 140, py + ph / 2);
  g.scale(phoneEnter, phoneEnter);
  g.translate(-(CX - 140), -(py + ph / 2));

  // Chasis iPhone
  g.fillStyle = '#2D242E';
  g.shadowColor = 'rgba(224, 99, 133, 0.35)';
  g.shadowBlur = 45;
  g.shadowOffsetY = 20;
  roundRect(g, px, py, pw, ph, 55);
  g.fill();
  g.shadowColor = 'transparent';

  // Pantalla OLED
  g.fillStyle = '#FFF8FA';
  roundRect(g, px + 12, py + 12, pw - 24, ph - 24, 45);
  g.fill();

  // Dynamic Island
  g.fillStyle = '#111';
  roundRect(g, px + pw/2 - 55, py + 22, 110, 28, 14);
  g.fill();

  // Header App
  g.font = '800 26px sans-serif';
  g.fillStyle = '#E06385';
  g.textAlign = 'left';
  g.fillText('Bailapp', px + 35, py + 95);

  g.font = '700 16px sans-serif';
  g.fillStyle = '#7E747C';
  g.fillText('Tu Grilla Automatizada', px + 35, py + 125);

  // Tarjeta de Clase Automatizada
  const appCardY = py + 160;
  g.fillStyle = '#FFFFFF';
  g.shadowColor = 'rgba(0,0,0,0.06)';
  g.shadowBlur = 14;
  roundRect(g, px + 25, appCardY, pw - 50, 230, 22);
  g.fill();
  g.shadowColor = 'transparent';

  g.font = '800 20px sans-serif';
  g.fillStyle = '#2D242E';
  g.fillText('Clase Heels — 19:00 hs', px + 45, appCardY + 40);

  g.font = '700 16px sans-serif';
  g.fillStyle = '#4CAF50';
  g.fillText('● 18 / 18 Cupos Confirmados', px + 45, appCardY + 70);

  // Badge Pago Automático
  g.fillStyle = '#E8F5E9';
  roundRect(g, px + 45, appCardY + 95, pw - 90, 40, 14);
  g.fill();
  g.font = '800 15px sans-serif';
  g.fillStyle = '#2E7D32';
  g.textAlign = 'center';
  g.fillText('💳 PAGOS ACREDITADOS AL 100%', px + pw/2, appCardY + 120);

  // Botón Estado
  g.fillStyle = '#E06385';
  roundRect(g, px + 45, appCardY + 155, pw - 90, 48, 18);
  g.fill();
  g.font = '800 16px sans-serif';
  g.fillStyle = '#FFF';
  g.fillText('SALA COMPLETA Y PAGADA', px + pw/2, appCardY + 185);

  // Segunda tarjeta en app
  g.fillStyle = '#FFFFFF';
  roundRect(g, px + 25, appCardY + 255, pw - 50, 150, 22);
  g.fill();
  g.font = '800 18px sans-serif';
  g.fillStyle = '#2D242E';
  g.textAlign = 'left';
  g.fillText('Danza Urbana — 20:30 hs', px + 45, appCardY + 295);
  g.font = '700 15px sans-serif';
  g.fillStyle = '#4CAF50';
  g.fillText('● 16 alumnas abonaron online', px + 45, appCardY + 325);

  g.restore();

  // Bailarinas entrando (character_heels & character_urbano)
  const charHeels = assets['character_heels'];
  if (charHeels) {
    const enterH = lerp(W + 50, CX + 140, easeOutQuad(clamp(st * 1.4, 0, 1)));
    g.drawImage(charHeels, enterH, 630, 400, 680);
  }

  const charUrbano = assets['character_urbano'];
  if (charUrbano && st > 1.2) {
    const enterU = lerp(-400, CX - 480, easeOutQuad(clamp((st - 1.2) * 1.5, 0, 1)));
    g.drawImage(charUrbano, enterU, 670, 390, 640);
  }

  drawSubtitleSafeZone(g, 'Basta de perder tiempo: tus alumnas reservan y pagan en Bailapp.');
}

// -------------------------------------------------------------
// ESCENA 4: PAZ MENTAL — CERO SOBRECUPOS, PLATA ASEGURADA (t: 17.1s – 21.5s)
// -------------------------------------------------------------
function drawScene4(g, t) {
  drawStudioBackground(g, 'day');
  drawHeaderBadge(g, 'Cero sobrecupos, cero estrés • 🩰');

  const st = t - 17.1;

  // Barra de Estado
  const prog = clamp(easeOutBack(st * 0.9), 0.3, 1.0);
  const barW = 760;
  const barH = 50;
  const barX = (W - barW) / 2;
  const barY = 240;

  g.save();
  g.fillStyle = '#FFFFFF';
  g.shadowColor = 'rgba(0,0,0,0.08)';
  g.shadowBlur = 18;
  roundRect(g, barX, barY, barW, barH, 25);
  g.fill();
  g.shadowColor = 'transparent';

  const fillGrad = g.createLinearGradient(barX, 0, barX + barW * prog, 0);
  fillGrad.addColorStop(0, '#E06385');
  fillGrad.addColorStop(1, '#4CAF50');
  g.fillStyle = fillGrad;
  roundRect(g, barX + 4, barY + 4, (barW - 8) * prog, barH - 8, 21);
  g.fill();

  g.font = '900 22px sans-serif';
  g.fillStyle = '#FFFFFF';
  g.textAlign = 'center';
  g.fillText(`GRILLA EN PILOTO AUTOMÁTICO: 100% ASEGURADO`, CX, barY + 32);
  g.restore();

  // Notificaciones automáticas de tranquilidad
  const notifs = [
    { text: '✨ Reserva y pago directo: Valentina (Heels)', time: 0.2, y: 340 },
    { text: '💰 Transferencia automática sin enviar comprobante', time: 1.2, y: 440 },
    { text: '🔒 Cupo protegido: Cero cancelaciones sin cargo', time: 2.2, y: 540 }
  ];

  notifs.forEach(n => {
    if (st > n.time) {
      const s = easeOutBack(clamp((st - n.time) * 2.2, 0, 1));
      g.save();
      g.translate(CX, n.y);
      g.scale(s, s);
      g.fillStyle = 'rgba(255, 255, 255, 0.96)';
      g.shadowColor = 'rgba(224, 99, 133, 0.2)';
      g.shadowBlur = 24;
      roundRect(g, -280, -32, 560, 64, 32);
      g.fill();
      g.strokeStyle = '#FAD2E1';
      g.lineWidth = 2;
      g.stroke();

      g.font = '800 20px sans-serif';
      g.fillStyle = '#2D242E';
      g.textAlign = 'center';
      g.fillText(n.text, 0, 7);
      g.restore();
    }
  });

  // Bailarinas felices en el estudio
  const cBallet = assets['character_ballet'];
  if (cBallet) {
    g.drawImage(cBallet, CX - 460, 630, 360, 650);
  }
  const cHeels = assets['character_heels'];
  if (cHeels) {
    g.drawImage(cHeels, CX - 180, 610, 380, 670);
  }
  const cGen1 = assets['character_generico_1'];
  if (cGen1) {
    g.drawImage(cGen1, CX + 120, 630, 370, 640);
  }

  drawSubtitleSafeZone(g, 'Tu grilla se organiza sola, sin sobrecupos y con la plata asegurada.');
}

// -------------------------------------------------------------
// ESCENA 5: CLÍMAX & CTA — "AUTOMATIZÁ TU ESTUDIO GRATIS" (t: 21.5s – 26.5s)
// -------------------------------------------------------------
function drawScene5(g, t) {
  drawStudioBackground(g, 'cta');
  drawHeaderBadge(g, 'Sumá tu estudio gratis • 🩰');

  const st = t - 21.5;

  // Gran Tarjeta de Conversión
  const enterCard = easeOutBack(clamp(st * 1.8, 0, 1));
  const cardW = 880;
  const cardH = 960;
  const cardX = (W - cardW) / 2;
  const cardY = 240;

  g.save();
  g.translate(CX, cardY + cardH / 2);
  g.scale(enterCard, enterCard);
  g.translate(-CX, -(cardY + cardH / 2));

  // Fondo Card
  g.fillStyle = '#FFFFFF';
  g.shadowColor = 'rgba(216, 27, 96, 0.24)';
  g.shadowBlur = 50;
  g.shadowOffsetY = 22;
  roundRect(g, cardX, cardY, cardW, cardH, 50);
  g.fill();
  g.shadowColor = 'transparent';

  g.strokeStyle = '#FAD2E1';
  g.lineWidth = 3;
  g.stroke();

  // Logo Bailapp
  g.font = '900 68px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  g.fillStyle = '#E06385';
  g.textAlign = 'center';
  g.fillText('Bailapp', CX, cardY + 120);

  g.font = '800 28px sans-serif';
  g.fillStyle = '#2D242E';
  g.fillText('Automatizá las reservas de tu academia', CX, cardY + 175);

  // Chips de Disciplinas
  const chips = ['Cobro 100% Automático', 'Cero Fricción en WhatsApp', 'Cupos Seguros'];
  const chipStartX = CX - 390;
  chips.forEach((c, i) => {
    const cx = chipStartX + i * 265;
    const cy = cardY + 240;
    g.fillStyle = '#FFF1F5';
    roundRect(g, cx, cy, 250, 52, 20);
    g.fill();
    g.strokeStyle = '#F8C8DC';
    g.lineWidth = 1.5;
    g.stroke();

    g.font = '800 17px sans-serif';
    g.fillStyle = '#D81B60';
    g.textAlign = 'center';
    g.fillText(`✨ ${c}`, cx + 125, cy + 32);
  });

  // Ventajas destacadas para dueños de estudio
  const benY = cardY + 390;
  const benefits = [
    '✓ Sin perseguir comprobantes de transferencia',
    '✓ Las alumnas reservan y pagan en un toque',
    '✓ Tu grilla de cupos sincronizada en vivo'
  ];

  benefits.forEach((b, idx) => {
    g.font = '700 24px sans-serif';
    g.fillStyle = '#443D43';
    g.textAlign = 'center';
    g.fillText(b, CX, benY + idx * 56);
  });

  // Gran Botón Pulsante CTA
  const pulse = 1.0 + 0.035 * Math.sin(st * 7);
  const btnW = 740;
  const btnH = 100;
  const btnX = CX - btnW / 2;
  const btnY = cardY + 625;

  g.save();
  g.translate(CX, btnY + btnH / 2);
  g.scale(pulse, pulse);
  g.translate(-CX, -(btnY + btnH / 2));

  g.fillStyle = '#E06385';
  g.shadowColor = 'rgba(224, 99, 133, 0.45)';
  g.shadowBlur = 32;
  g.shadowOffsetY = 14;
  roundRect(g, btnX, btnY, btnW, btnH, 50);
  g.fill();
  g.shadowColor = 'transparent';

  g.font = '900 32px -apple-system, sans-serif';
  g.fillStyle = '#FFFFFF';
  g.textAlign = 'center';
  g.fillText('AUTOMATIZÁ TU ESTUDIO GRATIS', CX, btnY + btnH / 2 + 10);
  g.restore();

  // Sub-indicador de perfil
  g.font = '800 24px sans-serif';
  g.fillStyle = '#7E747C';
  g.textAlign = 'center';
  g.fillText('📲 Link directo en la bio de nuestro perfil', CX, cardY + 785);

  // Badge URL oficial
  const urlText = 'bailapp.com.ar';
  g.font = '800 24px sans-serif';
  const urlMetrics = g.measureText(urlText);
  const urlW = Math.round(urlMetrics.width + 48);
  const urlH = 46;
  const urlX = Math.round(CX - urlW / 2);
  const urlY = cardY + 815;
  g.fillStyle = '#FFF1F5';
  roundRect(g, urlX, urlY, urlW, urlH, 23);
  g.fill();
  g.strokeStyle = '#FAD2E1';
  g.lineWidth = 2;
  g.stroke();

  g.fillStyle = '#E06385';
  g.textBaseline = 'middle';
  g.fillText(urlText, CX, urlY + urlH / 2 + 1);
  g.textBaseline = 'alphabetic';

  g.restore();

  drawSubtitleSafeZone(g, 'Sumate gratis y olvidate de WhatsApp. Link en bio.');
}

// -------------------------------------------------------------
// RENDERIZADO GLOBAL & INTERACCIÓN
// -------------------------------------------------------------
window.DUR = 26.5;

window.render = async (t) => {
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, W, H);

  if (t < 5.0) {
    drawScene1(g, t);
  } else if (t < 11.8) {
    drawScene2(g, t);
  } else if (t < 17.1) {
    drawScene3(g, t);
  } else if (t < 21.5) {
    drawScene4(g, t);
  } else {
    drawScene5(g, t);
  }
};

window.READY = true;
console.log('Bailapp WhatsApp Reel Engine Listo! Duración:', window.DUR);

// -------------------------------------------------------------
// CONTROLES INTERACTIVOS PARA NAVEGADOR
// -------------------------------------------------------------
const btnPlay = document.getElementById('btn-play');
const btnRestart = document.getElementById('btn-restart');
const timeSlider = document.getElementById('time-slider');
const timeDisplay = document.getElementById('time-display');
const btnSpeed = document.getElementById('btn-speed');
const btnSound = document.getElementById('btn-sound');
const stageContainer = document.getElementById('stage-container');

function resizePreview() {
  const availableW = window.innerWidth - 60;
  const availableH = window.innerHeight - 120;
  const scale = Math.min(availableW / W, availableH / H, 1.0);
  stageContainer.style.transform = `scale(${scale})`;
}
window.addEventListener('resize', resizePreview);
resizePreview();

const bgAudio = new Audio('audio/mix.wav');
let isAudioEnabled = true;

let isPlaying = false;
let currentTime = 0;
let playbackSpeed = 1.0;
let lastTimestamp = 0;

function updateDisplay() {
  timeSlider.value = currentTime;
  const mins = Math.floor(currentTime / 60).toString().padStart(2, '0');
  const secs = Math.floor(currentTime % 60).toString().padStart(2, '0');
  timeDisplay.innerText = `${mins}:${secs} / 00:26`;
}

function tick(timestamp) {
  if (!lastTimestamp) lastTimestamp = timestamp;
  const delta = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  if (isPlaying) {
    currentTime += delta * playbackSpeed;
    if (currentTime >= window.DUR) {
      currentTime = window.DUR;
      pause();
    }
    updateDisplay();
  }

  window.render(currentTime);

  if (isPlaying) {
    requestAnimationFrame(tick);
  }
}

function play() {
  isPlaying = true;
  lastTimestamp = 0;
  btnPlay.innerText = '⏸ Pausar';
  if (isAudioEnabled) {
    bgAudio.currentTime = currentTime;
    bgAudio.playbackRate = playbackSpeed;
    bgAudio.play().catch(() => {});
  }
  requestAnimationFrame(tick);
}

function pause() {
  isPlaying = false;
  btnPlay.innerText = '▶ Reproducir';
  bgAudio.pause();
}

btnPlay.addEventListener('click', () => {
  if (isPlaying) pause();
  else {
    if (currentTime >= window.DUR) currentTime = 0;
    play();
  }
});

btnRestart.addEventListener('click', () => {
  currentTime = 0;
  updateDisplay();
  play();
});

timeSlider.addEventListener('input', (e) => {
  pause();
  currentTime = parseFloat(e.target.value);
  updateDisplay();
  window.render(currentTime);
});

const speeds = [1.0, 1.5, 2.0, 0.5];
let speedIdx = 0;
btnSpeed.addEventListener('click', () => {
  speedIdx = (speedIdx + 1) % speeds.length;
  playbackSpeed = speeds[speedIdx];
  btnSpeed.innerText = `${playbackSpeed.toFixed(1)}x`;
  bgAudio.playbackRate = playbackSpeed;
});

btnSound.addEventListener('click', () => {
  isAudioEnabled = !isAudioEnabled;
  btnSound.innerText = isAudioEnabled ? '🔊 Sonido ON' : '🔇 Sonido OFF';
  if (!isAudioEnabled) bgAudio.pause();
  else if (isPlaying) {
    bgAudio.currentTime = currentTime;
    bgAudio.play().catch(() => {});
  }
});

window.render(0);
