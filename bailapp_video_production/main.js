// Bailapp - Video Viral Motion Graphics Engine (1080x1920 @ 24fps)
// Version 2: Flujo acelerado (26.1s), tipografía perfectamente centrada, sin desbordes.

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
  console.log('All character assets loaded for v2!');
}

await loadAssets();

// Global Math / Easing utilities
function clamp(v, min = 0, max = 1) { return Math.max(min, Math.min(max, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function easeOutQuad(t) { return t * (2 - t); }
function easeOutBack(t, s = 1.70158) { return (t = t - 1) * t * ((s + 1) * t + s) + 1; }

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

// Top Brand Badge (Always centered)
function drawHeaderBadge(g, title = 'Bailapp') {
  g.save();
  const bw = 360;
  const bh = 64;
  const bx = (W - bw) / 2;
  const by = 80;

  g.fillStyle = '#FFFFFF';
  g.shadowColor = 'rgba(224, 99, 133, 0.15)';
  g.shadowBlur = 24;
  g.shadowOffsetY = 10;
  roundRect(g, bx, by, bw, bh, 32);
  g.fill();
  g.shadowColor = 'transparent';

  g.strokeStyle = '#FAD2E1';
  g.lineWidth = 2.5;
  g.stroke();

  // Dot
  g.fillStyle = '#E06385';
  g.beginPath();
  g.arc(bx + 35, by + bh / 2, 7, 0, Math.PI * 2);
  g.fill();

  // Text
  g.font = '800 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  g.fillStyle = '#2D242E';
  g.textAlign = 'left';
  g.textBaseline = 'middle';
  g.fillText(title, bx + 55, by + bh / 2 + 1);

  g.restore();
}

// Bulletproof Subtitle Safe Zone (38% from bottom = Y around 1370)
// Completely fixes off-center text and overflow bugs!
function drawSubtitleSafeZone(g, text) {
  const subY = 1370;
  const pillW = 960;
  const pillH = 130;
  const pillX = (W - pillW) / 2;

  g.save();
  
  // Background Card
  g.fillStyle = 'rgba(255, 255, 255, 0.96)';
  g.shadowColor = 'rgba(216, 27, 96, 0.14)';
  g.shadowBlur = 28;
  g.shadowOffsetY = 12;
  roundRect(g, pillX, subY, pillW, pillH, 36);
  g.fill();
  g.shadowColor = 'transparent';

  // Pink Accent Border
  g.strokeStyle = '#FAD2E1';
  g.lineWidth = 3;
  g.stroke();

  // Text Centering Logic
  g.textAlign = 'center';
  g.textBaseline = 'middle';

  const maxCharsPerLine = 38;
  let lines = [];

  if (text.length <= maxCharsPerLine) {
    lines = [text];
  } else {
    const words = text.split(' ');
    let mid = Math.ceil(words.length / 2);
    lines = [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
  }

  if (lines.length === 1) {
    g.font = '800 34px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    g.fillStyle = '#2D242E';
    g.fillText(lines[0], CX, subY + pillH / 2);
  } else {
    g.font = '800 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    g.fillStyle = '#2D242E';
    g.fillText(lines[0], CX, subY + 44);
    g.fillText(lines[1], CX, subY + 86);
  }

  g.restore();
}

// ========================================================
// SCENE 1: Hook de Mensajes sin responder (t: 0.0s - 4.25s)
// ========================================================
function drawScene1(g, t) {
  // Soft pink blush gradient
  const gr = g.createLinearGradient(0, 0, 0, H);
  gr.addColorStop(0, '#FFF7FA');
  gr.addColorStop(0.5, '#FDECF2');
  gr.addColorStop(1, '#FBD4E3');
  g.fillStyle = gr;
  g.fillRect(0, 0, W, H);

  // Background architectural arch
  g.save();
  g.fillStyle = 'rgba(255, 255, 255, 0.85)';
  roundRect(g, 70, 160, 940, 1400, 470);
  g.fill();
  g.restore();

  drawHeaderBadge(g, 'Bailapp • Clases en vivo');

  // Character 1 on the right
  const charProgress = easeOutBack(clamp(t / 0.6));
  const charX = lerp(850, 490, charProgress);
  const charY = 460 + Math.sin(t * 3.0) * 5;

  if (assets['character_generico_1']) {
    g.save();
    g.drawImage(assets['character_generico_1'], charX, charY, 540, 810);
    g.restore();
  }

  // Left Column Chat Bubbles
  const cardW = 410;
  
  // Card 1 (t = 0.3s)
  if (t > 0.3) {
    const p1 = easeOutBack(clamp((t - 0.3) / 0.5));
    const y1 = 280;
    const x1 = lerp(-450, 70, p1);
    
    g.save();
    g.fillStyle = '#FFFFFF';
    g.shadowColor = 'rgba(0,0,0,0.08)';
    g.shadowBlur = 18;
    g.shadowOffsetY = 8;
    roundRect(g, x1, y1, cardW, 110, 24);
    g.fill();
    g.shadowColor = 'transparent';
    g.strokeStyle = '#FCE4EC';
    g.lineWidth = 2;
    g.stroke();

    g.font = '700 20px -apple-system, BlinkMacSystemFont, sans-serif';
    g.fillStyle = '#382E39';
    g.textAlign = 'left';
    g.fillText('Hola! ¿Tienen lugar para', x1 + 25, y1 + 45);
    g.fillText('la clase de hoy a las 19hs?', x1 + 25, y1 + 75);
    g.restore();
  }

  // Card 2 (t = 1.3s)
  if (t > 1.3) {
    const p2 = easeOutBack(clamp((t - 1.3) / 0.5));
    const y2 = 420;
    const x2 = lerp(-450, 70, p2);
    
    g.save();
    g.fillStyle = '#FFFFFF';
    g.shadowColor = 'rgba(0,0,0,0.08)';
    g.shadowBlur = 18;
    g.shadowOffsetY = 8;
    roundRect(g, x2, y2, cardW, 110, 24);
    g.fill();
    g.shadowColor = 'transparent';
    g.strokeStyle = '#FCE4EC';
    g.lineWidth = 2;
    g.stroke();

    g.font = '700 20px -apple-system, BlinkMacSystemFont, sans-serif';
    g.fillStyle = '#382E39';
    g.textAlign = 'left';
    g.fillText('¿A qué hora arranca Heels?', x2 + 25, y2 + 45);
    g.fillText('¿Quedan cupos disponibles?', x2 + 25, y2 + 75);
    g.restore();
  }

  // Card 3: Alert Badge (t = 2.2s)
  if (t > 2.2) {
    const p3 = easeOutBack(clamp((t - 2.2) / 0.4));
    const y3 = 560;
    const x3 = lerp(-450, 70, p3);
    const pulse = 1.0 + 0.04 * Math.sin(t * 8);

    g.save();
    g.translate(x3 + cardW / 2, y3 + 55);
    g.scale(pulse, pulse);
    g.translate(-(x3 + cardW / 2), -(y3 + 55));

    g.fillStyle = '#FFEBEE';
    g.shadowColor = 'rgba(229, 57, 53, 0.25)';
    g.shadowBlur = 22;
    roundRect(g, x3, y3, cardW, 100, 24);
    g.fill();
    g.shadowColor = 'transparent';
    g.strokeStyle = '#FFCDD2';
    g.lineWidth = 2;
    g.stroke();

    g.font = '800 22px -apple-system, BlinkMacSystemFont, sans-serif';
    g.fillStyle = '#D32F2F';
    g.textAlign = 'left';
    g.fillText('🔴 Visto hace 2 días', x3 + 25, y3 + 45);
    g.font = '600 17px -apple-system, BlinkMacSystemFont, sans-serif';
    g.fillStyle = '#78909C';
    g.fillText('[Sin respuesta del estudio]', x3 + 25, y3 + 75);
    g.restore();
  }

  // Subtitle
  drawSubtitleSafeZone(g, '¿Cuántos mensajes mandaste para que te claven el visto?');
}

// ========================================================
// SCENE 2: El Flyer Ilegible & Sin Cupo (t: 4.25s - 10.73s)
// ========================================================
function drawScene2(g, t) {
  const st = t - 4.25;

  const gr = g.createLinearGradient(0, 0, 0, H);
  gr.addColorStop(0, '#FFF6F2');
  gr.addColorStop(0.5, '#FDEAE2');
  gr.addColorStop(1, '#FCD0C2');
  g.fillStyle = gr;
  g.fillRect(0, 0, W, H);

  drawHeaderBadge(g, 'La pesadilla de buscar clases');

  // Character 2 pointing frustrated
  const charProgress = easeOutQuad(clamp(st / 0.6));
  const charX = lerp(850, 480, charProgress);
  const charY = 460 + Math.sin(st * 3.0) * 5;

  if (assets['character_generico_2']) {
    g.save();
    g.drawImage(assets['character_generico_2'], charX, charY, 540, 810);
    g.restore();
  }

  // Left Flyer Card
  const flyerProgress = easeOutBack(clamp(st / 0.7));
  const flyerX = lerp(-450, 75, flyerProgress);
  const flyerY = 270;
  const flyerW = 410;
  const flyerH = 530;

  g.save();
  g.translate(flyerX + flyerW / 2, flyerY + flyerH / 2);
  g.rotate(-0.03 + Math.sin(st * 2.0) * 0.02);
  g.translate(-(flyerX + flyerW / 2), -(flyerY + flyerH / 2));

  // Flyer base
  g.fillStyle = '#FDF6E2';
  g.shadowColor = 'rgba(0,0,0,0.12)';
  g.shadowBlur = 25;
  g.shadowOffsetY = 12;
  roundRect(g, flyerX, flyerY, flyerW, flyerH, 24);
  g.fill();
  g.shadowColor = 'transparent';
  g.strokeStyle = '#D4A373';
  g.lineWidth = 3;
  g.stroke();

  // Flyer headers
  g.font = '900 24px -apple-system, sans-serif';
  g.fillStyle = '#C0392B';
  g.textAlign = 'left';
  g.fillText('*** HORARIOS 2021 ***', flyerX + 25, flyerY + 55);

  g.font = '700 16px -apple-system, sans-serif';
  g.fillStyle = '#2C3E50';
  g.fillText('(Hacé zoom para leer la letra chica)', flyerX + 25, flyerY + 90);

  // Fake lines
  for (let i = 0; i < 8; i++) {
    g.fillStyle = i % 2 === 0 ? '#BDC3C7' : '#95A5A6';
    const lw = 280 + (i * 19) % 70;
    roundRect(g, flyerX + 25, flyerY + 125 + i * 28, lw, 12, 6);
    g.fill();
  }

  // Big Stamp: "CUPO LLENO"
  if (st > 2.5) {
    const stampP = easeOutBack(clamp((st - 2.5) / 0.35));
    g.save();
    g.translate(flyerX + flyerW / 2, flyerY + 360);
    g.rotate(-0.22);
    g.scale(stampP, stampP);

    g.strokeStyle = '#E74C3C';
    g.lineWidth = 6;
    g.strokeRect(-160, -45, 320, 90);

    g.font = '900 36px "Arial Black", sans-serif';
    g.fillStyle = '#E74C3C';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('CUPO LLENO', 0, 0);
    g.restore();
  }

  g.restore();

  // Subtitle
  drawSubtitleSafeZone(g, 'O peor: un flyer ilegible o te enterás que no hay cupo.');
}

// ========================================================
// SCENE 3: La Solución — Bailapp (t: 10.73s - 17.45s)
// ========================================================
function drawScene3(g, t) {
  const st = t - 10.73;

  // Clean radiant pastel
  const gr = g.createLinearGradient(0, 0, 0, H);
  gr.addColorStop(0, '#FFFFFF');
  gr.addColorStop(0.4, '#FFF0F5');
  gr.addColorStop(1, '#FAD2E1');
  g.fillStyle = gr;
  g.fillRect(0, 0, W, H);

  drawHeaderBadge(g, 'Bailapp • Tu lugar confirmado');

  // Modern UI Card in Center
  const cardW = 920;
  const cardH = 820;
  const cardX = (W - cardW) / 2;
  const cardY = 220;

  g.save();
  g.fillStyle = '#FFFFFF';
  g.shadowColor = 'rgba(216, 27, 96, 0.14)';
  g.shadowBlur = 35;
  g.shadowOffsetY = 16;
  roundRect(g, cardX, cardY, cardW, cardH, 44);
  g.fill();
  g.shadowColor = 'transparent';
  g.strokeStyle = '#FAD2E1';
  g.lineWidth = 3;
  g.stroke();

  // Header inside card
  g.font = '900 38px -apple-system, sans-serif';
  g.fillStyle = '#D94680';
  g.textAlign = 'left';
  g.fillText('🩰 Bailapp', cardX + 50, cardY + 70);

  g.font = '700 20px -apple-system, sans-serif';
  g.fillStyle = '#8E7C89';
  g.fillText('Clases disponibles hoy en tu zona', cardX + 50, cardY + 110);

  // 4 Filter Pills perfectly centered inside 920px card
  const pills = ['TODAS', 'URBANO', 'HEELS', 'BALLET'];
  const activeIdx = st > 1.2 ? (st > 2.8 ? 2 : 1) : 0;
  const pillW = 185;
  const pillGap = 20;
  const totalPillsW = 4 * pillW + 3 * pillGap; // 800px
  const startPillsX = cardX + (cardW - totalPillsW) / 2;

  pills.forEach((p, idx) => {
    const px = startPillsX + idx * (pillW + pillGap);
    const py = cardY + 150;
    const ph = 52;
    const isActive = idx === activeIdx;

    g.fillStyle = isActive ? '#E06385' : '#FCEEF3';
    roundRect(g, px, py, pillW, ph, 26);
    g.fill();

    g.font = '800 18px -apple-system, sans-serif';
    g.fillStyle = isActive ? '#FFFFFF' : '#8E7C89';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(p, px + pillW / 2, py + ph / 2);
  });

  // Inner Class Card
  const innerCardW = 820;
  const innerCardH = 490;
  const innerCardX = cardX + (cardW - innerCardW) / 2;
  const innerCardY = cardY + 235;

  g.fillStyle = '#FFF8FA';
  roundRect(g, innerCardX, innerCardY, innerCardW, innerCardH, 32);
  g.fill();
  g.strokeStyle = '#F8BBD0';
  g.lineWidth = 2;
  g.stroke();

  // Studio text details
  g.textAlign = 'left';
  g.font = '800 28px -apple-system, sans-serif';
  g.fillStyle = '#2D242E';
  g.fillText('Estudio Flow Dance • Palermo', innerCardX + 40, innerCardY + 50);

  g.font = '600 21px -apple-system, sans-serif';
  g.fillStyle = '#6E5C6A';
  g.fillText('Heels Technique & Groove • Intermedio', innerCardX + 40, innerCardY + 95);
  g.fillText('Hoy a las 19:30 hs (Duración 90 min)', innerCardX + 40, innerCardY + 130);

  // Live spots indicator
  const spotPulse = 1.0 + 0.03 * Math.sin(st * 7);
  g.save();
  g.translate(innerCardX + 40, innerCardY + 175);
  g.scale(spotPulse, spotPulse);
  g.fillStyle = '#E8F8F5';
  roundRect(g, 0, 0, 310, 48, 24);
  g.fill();
  g.font = '800 17px -apple-system, sans-serif';
  g.fillStyle = '#058C68';
  g.fillText('🟢 4 CUPOS EN VIVO', 20, 29);
  g.restore();

  // Action Button
  const isBooked = st > 3.2;
  const btnW = 740;
  const btnH = 80;
  const btnX = innerCardX + (innerCardW - btnW) / 2;
  const btnY = innerCardY + 265;

  g.fillStyle = isBooked ? '#06D6A0' : '#E06385';
  g.shadowColor = isBooked ? 'rgba(6, 214, 160, 0.4)' : 'rgba(224, 99, 133, 0.4)';
  g.shadowBlur = 24;
  g.shadowOffsetY = 10;
  roundRect(g, btnX, btnY, btnW, btnH, 40);
  g.fill();
  g.shadowColor = 'transparent';

  g.font = '900 26px -apple-system, sans-serif';
  g.fillStyle = '#FFFFFF';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(isBooked ? '¡CUPO CONFIRMADO AL INSTANTE! ✓' : 'RESERVAR LUGAR AHORA', btnX + btnW / 2, btnY + btnH / 2);

  if (isBooked) {
    g.font = '700 19px -apple-system, sans-serif';
    g.fillStyle = '#058C68';
    g.fillText('Confirmación y recordatorio automático en la app', innerCardX + innerCardW / 2, innerCardY + 385);
  }

  g.restore();

  // Subtitle
  drawSubtitleSafeZone(g, 'En Bailapp filtrás por estilo, ves cupos y reservás.');
}

// ========================================================
// SCENE 4: Trío de Bailarinas (t: 17.45s - 21.14s)
// ========================================================
function drawScene4(g, t) {
  const st = t - 17.45;

  const gr = g.createLinearGradient(0, 0, 0, H);
  gr.addColorStop(0, '#FFF5F8');
  gr.addColorStop(0.5, '#FCE4EC');
  gr.addColorStop(1, '#F8BBD0');
  g.fillStyle = gr;
  g.fillRect(0, 0, W, H);

  drawHeaderBadge(g, 'Todos los estilos y niveles');

  g.font = '900 44px -apple-system, sans-serif';
  g.fillStyle = '#2D242E';
  g.textAlign = 'center';
  g.fillText('Tu lugar está esperándote', CX, 220);

  // Trio of Dancers: Urbano (Left), Heels (Center), Ballet (Right)
  const p1 = easeOutBack(clamp(st / 0.5));
  const p2 = easeOutBack(clamp((st - 0.15) / 0.5));
  const p3 = easeOutBack(clamp((st - 0.3) / 0.5));

  // 1. Urban Dancer (Left)
  if (assets['character_urbano']) {
    g.save();
    const x = lerp(-250, 30, p1);
    g.drawImage(assets['character_urbano'], x, 500, 420, 630);
    g.fillStyle = '#FFFFFF';
    roundRect(g, x + 120, 460, 160, 40, 20);
    g.fill();
    g.font = '800 16px sans-serif';
    g.fillStyle = '#E06385';
    g.fillText('URBANO', x + 200, 485);
    g.restore();
  }

  // 2. Ballet Dancer (Right)
  if (assets['character_ballet']) {
    g.save();
    const x = lerp(W + 100, 630, p3);
    g.drawImage(assets['character_ballet'], x, 500, 420, 630);
    g.fillStyle = '#FFFFFF';
    roundRect(g, x + 130, 460, 160, 40, 20);
    g.fill();
    g.font = '800 16px sans-serif';
    g.fillStyle = '#E06385';
    g.fillText('BALLET', x + 210, 485);
    g.restore();
  }

  // 3. Heels Dancer (Center Hero with Stilettos)
  if (assets['character_heels']) {
    g.save();
    const y = lerp(H, 460, p2);
    g.drawImage(assets['character_heels'], 310, y, 460, 690);
    g.fillStyle = '#FFFFFF';
    roundRect(g, 460, y - 40, 160, 40, 20);
    g.fill();
    g.font = '800 16px sans-serif';
    g.fillStyle = '#E06385';
    g.fillText('HEELS', 540, y - 15);
    g.restore();
  }

  // Subtitle
  drawSubtitleSafeZone(g, 'De principiante a avanzado, en los mejores estudios.');
}

// ========================================================
// SCENE 5: Outro / CTA Viral (t: 21.14s - 26.11s)
// (Sin "la app de danza del cono sur", 100% centrado y balanceado)
// ========================================================
function drawScene5(g, t) {
  const st = t - 21.14;

  const gr = g.createLinearGradient(0, 0, 0, H);
  gr.addColorStop(0, '#FFFFFF');
  gr.addColorStop(0.5, '#FFF0F5');
  gr.addColorStop(1, '#FAD2E1');
  g.fillStyle = gr;
  g.fillRect(0, 0, W, H);

  // Big Central Brand Card
  const cardW = 920;
  const cardH = 880;
  const cardX = (W - cardW) / 2;
  const cardY = 280;

  g.save();
  g.fillStyle = '#FFFFFF';
  g.shadowColor = 'rgba(216, 27, 96, 0.16)';
  g.shadowBlur = 40;
  g.shadowOffsetY = 18;
  roundRect(g, cardX, cardY, cardW, cardH, 48);
  g.fill();
  g.shadowColor = 'transparent';
  g.strokeStyle = '#FAD2E1';
  g.lineWidth = 3.5;
  g.stroke();

  // Logo Icon
  g.font = '80px sans-serif';
  g.textAlign = 'center';
  g.fillText('🩰', CX, cardY + 120);

  // Brand Name
  g.font = '900 68px -apple-system, sans-serif';
  g.fillStyle = '#D94680';
  g.fillText('Bailapp', CX, cardY + 215);

  // Tagline (Aesthetic & punchy - NO CONO SUR)
  g.font = '700 28px -apple-system, sans-serif';
  g.fillStyle = '#382E39';
  g.fillText('Encontrá tu clase y reservá en un toque', CX, cardY + 280);

  // 3 Feature Badges
  const features = ['✓ Cupos confirmados en vivo', '✓ Todos los estilos y niveles', '✓ Reservá tu lugar al instante'];
  features.forEach((feat, i) => {
    g.font = '700 24px -apple-system, sans-serif';
    g.fillStyle = '#2D242E';
    g.fillText(feat, CX, cardY + 365 + i * 48);
  });

  // App Store / Google Play Pills perfectly centered
  const storePillW = 270;
  const storePillGap = 24;
  const totalStoreW = 2 * storePillW + storePillGap; // 564px
  const storeStartX = CX - totalStoreW / 2;

  g.fillStyle = '#FCEEF3';
  roundRect(g, storeStartX, cardY + 535, storePillW, 58, 29);
  g.fill();
  g.font = '800 18px sans-serif';
  g.fillStyle = '#382E39';
  g.fillText(' App Store', storeStartX + storePillW / 2, cardY + 570);

  g.fillStyle = '#FCEEF3';
  roundRect(g, storeStartX + storePillW + storePillGap, cardY + 535, storePillW, 58, 29);
  g.fill();
  g.font = '800 18px sans-serif';
  g.fillStyle = '#382E39';
  g.fillText('▶ Google Play', storeStartX + storePillW + storePillGap + storePillW / 2, cardY + 570);

  // Big Pulsing CTA Button
  const pulse = 1.0 + 0.03 * Math.sin(st * 6);
  const btnW = 760;
  const btnH = 92;
  const btnX = CX - btnW / 2;
  const btnY = cardY + 675;

  g.save();
  g.translate(CX, btnY + btnH / 2);
  g.scale(pulse, pulse);
  g.translate(-CX, -(btnY + btnH / 2));

  g.fillStyle = '#E06385';
  g.shadowColor = 'rgba(224, 99, 133, 0.42)';
  g.shadowBlur = 28;
  g.shadowOffsetY = 12;
  roundRect(g, btnX, btnY, btnW, btnH, 46);
  g.fill();
  g.shadowColor = 'transparent';

  g.font = '900 32px -apple-system, sans-serif';
  g.fillStyle = '#FFFFFF';
  g.fillText('DESCARGÁ BAILAPP GRATIS', CX, btnY + btnH / 2 + 2);
  g.restore();

  g.restore();

  // Subtitle
  drawSubtitleSafeZone(g, 'Descargá Bailapp gratis y andá a bailar. 🩰');
}

// ========================================================
// GLOBAL RENDER FUNCTION (26.11 seconds total)
// ========================================================
window.DUR = 26.11;

window.render = async (t) => {
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, W, H);

  if (t < 4.25) {
    drawScene1(g, t);
  } else if (t < 10.73) {
    drawScene2(g, t);
  } else if (t < 17.45) {
    drawScene3(g, t);
  } else if (t < 21.14) {
    drawScene4(g, t);
  } else {
    drawScene5(g, t);
  }
};

window.READY = true;
console.log('Bailapp Engine V2 Ready! Duration:', window.DUR);
