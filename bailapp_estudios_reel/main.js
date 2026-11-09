// Bailapp — Video Viral Reel: "Salas Llenas para Estudios de Danza" (V2)
// Duración: 25.5 segundos @ 24 fps (1080x1920)
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
  console.log('Personajes de Bailapp cargados con éxito para V2!');
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
  
  const paddingH = 30; // Margen lateral generoso
  const dotRadius = 6;
  const dotGap = 16;
  
  // Ancho dinámico exacto al texto:
  const bw = Math.round(textWidth + paddingH * 2 + dotRadius * 2 + dotGap);
  const bh = 60;
  const bx = Math.round((W - bw) / 2); // Siempre centrado absoluto
  const by = 80;

  // Cápsula contenedora
  g.fillStyle = '#FFFFFF';
  g.shadowColor = 'rgba(224, 99, 133, 0.18)';
  g.shadowBlur = 24;
  g.shadowOffsetY = 8;
  roundRect(g, bx, by, bw, bh, 30);
  g.fill();
  g.shadowColor = 'transparent';

  // Borde fino pastel
  g.strokeStyle = '#FAD2E1';
  g.lineWidth = 2.5;
  g.stroke();

  // Indicador dot con color vivo
  const dotX = bx + paddingH + dotRadius;
  const dotY = by + bh / 2;
  g.fillStyle = '#E06385';
  g.beginPath();
  g.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
  g.fill();

  // Texto perfectamente alineado y contenido dentro de la cápsula
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
  
  // Card de fondo blanca suave
  g.fillStyle = 'rgba(255, 255, 255, 0.98)';
  g.shadowColor = 'rgba(224, 99, 133, 0.22)';
  g.shadowBlur = 32;
  g.shadowOffsetY = 12;
  roundRect(g, pillX, subY, pillW, pillH, 36);
  g.fill();
  g.shadowColor = 'transparent';

  // Borde sutil pastel
  g.strokeStyle = '#F8C8DC';
  g.lineWidth = 2.5;
  g.stroke();

  // Tipografía & Centrado Anti-Desborde
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
// FONDO ARQUITECTÓNICO ESTUDIO DE DANZA SOFT PASTEL
// -------------------------------------------------------------
function drawStudioBackground(g, mood = 'empty') {
  g.save();
  
  // Fondo degradado general
  const grad = g.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#FFF5F8');
  grad.addColorStop(0.45, '#FDEBF2');
  grad.addColorStop(1, '#FBD4E3');
  g.fillStyle = grad;
  g.fillRect(0, 0, W, H);

  // Panel arquitectónico central Art Deco
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

  // Espejos verticales
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

    // Brillo diagonal
    g.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(mx + 30, my + 60);
    g.lineTo(mx + 110, my + 680);
    g.stroke();
  }

  // Barra de danza a lo largo de los espejos
  g.strokeStyle = '#D8A3B8';
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(archX + 30, archY + 480);
  g.lineTo(archX + archW - 30, archY + 480);
  g.stroke();

  // Soportes de la barra
  for (let sx = archX + 160; sx < archX + archW - 100; sx += 260) {
    g.fillStyle = '#C2849D';
    g.fillRect(sx - 4, archY + 480, 8, 80);
  }

  // Piso de danza
  const floorY = archY + 760;
  const floorGrad = g.createLinearGradient(0, floorY, 0, archY + archH);
  floorGrad.addColorStop(0, '#F5DFE8');
  floorGrad.addColorStop(1, '#EAC2D2');
  g.fillStyle = floorGrad;
  g.fillRect(archX + 10, floorY, archW - 20, archH - 770);

  // Tablones de piso
  g.strokeStyle = 'rgba(224, 99, 133, 0.25)';
  g.lineWidth = 1.5;
  for (let px = archX + 70; px < archX + archW; px += 95) {
    g.beginPath();
    g.moveTo(px, floorY);
    g.lineTo(px + (px - CX) * 0.25, archY + archH - 10);
    g.stroke();
  }

  g.restore();
}

// -------------------------------------------------------------
// ESCENA 1: HOOK — "¿ABRÍS LA SALA Y NO LLEGA NADIE?" (t: 0.0s – 4.1s)
// -------------------------------------------------------------
function drawScene1(g, t) {
  drawStudioBackground(g, 'empty');
  drawHeaderBadge(g, 'Bailapp para Estudios • 🩰');

  // Reloj de pared girando
  const clockX = CX - 220;
  const clockY = 320;
  g.save();
  g.fillStyle = '#FFFFFF';
  g.shadowColor = 'rgba(0, 0, 0, 0.08)';
  g.shadowBlur = 18;
  g.beginPath();
  g.arc(clockX, clockY, 65, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = '#E06385';
  g.lineWidth = 4;
  g.stroke();

  const angle = t * Math.PI * 1.6;
  g.strokeStyle = '#2D242E';
  g.lineWidth = 4;
  g.lineCap = 'round';
  g.beginPath();
  g.moveTo(clockX, clockY);
  g.lineTo(clockX + Math.cos(angle) * 45, clockY + Math.sin(angle) * 45);
  g.stroke();

  g.lineWidth = 5;
  g.beginPath();
  g.moveTo(clockX, clockY);
  g.lineTo(clockX + Math.cos(Math.PI / 3) * 30, clockY + Math.sin(Math.PI / 3) * 30);
  g.stroke();
  g.restore();

  // Cartel de estado flotante
  const cardScale = easeOutBack(clamp(t * 1.8, 0, 1));
  g.save();
  g.translate(CX - 140, 520);
  g.scale(cardScale, cardScale);
  
  const cw = 440, ch = 110;
  g.fillStyle = 'rgba(255, 255, 255, 0.94)';
  g.shadowColor = 'rgba(216, 27, 96, 0.16)';
  g.shadowBlur = 24;
  roundRect(g, -cw/2, -ch/2, cw, ch, 24);
  g.fill();
  g.strokeStyle = '#FAD2E1';
  g.lineWidth = 2;
  g.stroke();

  g.fillStyle = '#E06385';
  g.font = '800 22px sans-serif';
  g.textAlign = 'left';
  g.fillText('🔴 SALA 1 — CLASE 19:00', -cw/2 + 30, -10);
  g.fillStyle = '#7E747C';
  g.font = '700 20px sans-serif';
  g.fillText('Alumnas confirmadas: 0 / 18', -cw/2 + 30, 25);
  g.restore();

  // Personaje: Profe esperando (character_generico_2)
  const char = assets['character_generico_2'];
  if (char) {
    const enterX = lerp(W + 50, CX + 60, easeOutQuad(clamp(t * 1.6, 0, 1)));
    const breathY = Math.sin(t * 3.5) * 6;
    g.drawImage(char, enterX, 620 + breathY, 440, 660);
  }

  drawSubtitleSafeZone(g, '¿Abrís la sala, tenés todo listo... y no llega nadie?');
}

// -------------------------------------------------------------
// ESCENA 2: LA FRICCIÓN — FLYERS & VISTOS CLAVADOS (t: 4.1s – 8.7s)
// -------------------------------------------------------------
function drawScene2(g, t) {
  drawStudioBackground(g, 'empty');
  drawHeaderBadge(g, 'El algoritmo de Instagram • 📱');

  const st = t - 4.1;

  // Personaje profe con celular
  const char = assets['character_generico_1'];
  if (char) {
    g.drawImage(char, CX + 70, 620, 430, 650);
  }

  // Tarjeta 1: Notificación de historia ignorada
  if (st > 0.2) {
    const s1 = easeOutBack(clamp((st - 0.2) * 2.2, 0, 1));
    g.save();
    g.translate(CX - 250, 420);
    g.scale(s1, s1);
    g.fillStyle = '#FFFFFF';
    g.shadowColor = 'rgba(0, 0, 0, 0.12)';
    g.shadowBlur = 24;
    roundRect(g, -240, -55, 480, 110, 24);
    g.fill();
    g.strokeStyle = '#FAD2E1';
    g.lineWidth = 2;
    g.stroke();

    g.font = '800 24px sans-serif';
    g.fillStyle = '#D81B60';
    g.textAlign = 'left';
    g.fillText('📸 Flyer en historias de Instagram', -210, -12);
    g.font = '600 20px sans-serif';
    g.fillStyle = '#7E747C';
    g.fillText('Visto por 18 personas • 0 mensajes', -210, 22);
    g.restore();
  }

  // Tarjeta 2: Chat con visto clavado
  if (st > 1.6) {
    const s2 = easeOutBack(clamp((st - 1.6) * 2.2, 0, 1));
    g.save();
    g.translate(CX - 230, 610);
    g.scale(s2, s2);
    g.fillStyle = '#FFFFFF';
    g.shadowColor = 'rgba(0, 0, 0, 0.14)';
    g.shadowBlur = 24;
    roundRect(g, -250, -65, 500, 130, 24);
    g.fill();
    g.strokeStyle = '#E06385';
    g.lineWidth = 2.5;
    g.stroke();

    g.font = '800 22px sans-serif';
    g.fillStyle = '#2D242E';
    g.textAlign = 'left';
    g.fillText('💬 "¿Hola! Info de precios para Heels?"', -220, -18);
    g.font = '700 20px sans-serif';
    g.fillStyle = '#0288D1';
    g.fillText('✓✓ Leído 17:15 (Sin respuesta)', -220, 22);
    g.restore();
  }

  // Tarjeta 3: Alcance cayendo
  if (st > 2.8) {
    const s3 = easeOutBack(clamp((st - 2.8) * 2.2, 0, 1));
    g.save();
    g.translate(CX - 240, 810);
    g.scale(s3, s3);
    g.fillStyle = '#FFF1F5';
    g.shadowColor = 'rgba(216, 27, 96, 0.15)';
    g.shadowBlur = 20;
    roundRect(g, -230, -50, 460, 100, 22);
    g.fill();
    g.strokeStyle = '#E06385';
    g.lineWidth = 2;
    g.stroke();

    g.font = '800 24px sans-serif';
    g.fillStyle = '#C2185B';
    g.textAlign = 'center';
    g.fillText('📉 Alcance orgánico: -74%', 0, 8);
    g.restore();
  }

  drawSubtitleSafeZone(g, 'Te matás armando flyers, subís historias, y te clavan el visto.');
}

// -------------------------------------------------------------
// ESCENA 3: EL REFRAME — LAS ALUMNAS ESTÁN EN BAILAPP (t: 8.7s – 15.2s)
// -------------------------------------------------------------
function drawScene3(g, t) {
  drawStudioBackground(g, 'transition');
  drawHeaderBadge(g, 'Las alumnas buscan acá • ✨');

  const st = t - 8.7;

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

  // App Bailapp
  g.font = '800 26px sans-serif';
  g.fillStyle = '#E06385';
  g.textAlign = 'left';
  g.fillText('Bailapp', px + 35, py + 95);

  g.font = '700 16px sans-serif';
  g.fillStyle = '#7E747C';
  g.fillText('Estudios cerca de tu zona', px + 35, py + 125);

  // Tarjeta de Estudio
  const appCardY = py + 160;
  g.fillStyle = '#FFFFFF';
  g.shadowColor = 'rgba(0,0,0,0.06)';
  g.shadowBlur = 14;
  roundRect(g, px + 25, appCardY, pw - 50, 220, 22);
  g.fill();
  g.shadowColor = 'transparent';

  g.font = '800 20px sans-serif';
  g.fillStyle = '#2D242E';
  g.fillText('Tu Estudio de Danza', px + 45, appCardY + 40);

  g.font = '600 16px sans-serif';
  g.fillStyle = '#E06385';
  g.fillText('📍 A 400m • Palermo', px + 45, appCardY + 70);

  // Tags de estilos
  const tagY = appCardY + 105;
  ['Heels', 'Urbano', 'Ballet'].forEach((tag, idx) => {
    g.fillStyle = '#FFF1F5';
    roundRect(g, px + 45 + idx * 85, tagY, 78, 32, 12);
    g.fill();
    g.font = '700 14px sans-serif';
    g.fillStyle = '#D81B60';
    g.textAlign = 'center';
    g.fillText(tag, px + 45 + idx * 85 + 39, tagY + 21);
  });

  // Botón Reservar
  g.fillStyle = '#E06385';
  roundRect(g, px + 45, appCardY + 155, pw - 90, 44, 18);
  g.fill();
  g.font = '800 16px sans-serif';
  g.fillStyle = '#FFF';
  g.textAlign = 'center';
  g.fillText('RESERVAR CLASE', px + pw/2, appCardY + 183);

  // Segunda tarjeta en app
  g.fillStyle = '#FFFFFF';
  roundRect(g, px + 25, appCardY + 245, pw - 50, 160, 22);
  g.fill();
  g.font = '800 18px sans-serif';
  g.fillStyle = '#2D242E';
  g.textAlign = 'left';
  g.fillText('Clase Heels — 19:00 hs', px + 45, appCardY + 285);
  g.font = '700 15px sans-serif';
  g.fillStyle = '#4CAF50';
  g.fillText('● 16 alumnas reservaron hoy', px + 45, appCardY + 315);

  g.restore();

  // Bailarinas entrando por los laterales
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

  drawSubtitleSafeZone(g, 'El problema no son tus clases: es que las alumnas ya no buscan en Instagram. Están en Bailapp.');
}

// -------------------------------------------------------------
// ESCENA 4: SALAS LLENAS — CUPOS COMPLETOS (t: 15.2s – 20.8s)
// -------------------------------------------------------------
function drawScene4(g, t) {
  drawStudioBackground(g, 'full');
  drawHeaderBadge(g, 'Salas llenas en tu barrio • 🔥');

  const st = t - 15.2;

  // Barra de Ocupación Superior Animándose hacia 100%
  const prog = clamp(easeOutBack(st * 0.75), 0.25, 1.0);
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

  // Relleno de progreso
  const fillGrad = g.createLinearGradient(barX, 0, barX + barW * prog, 0);
  fillGrad.addColorStop(0, '#E06385');
  fillGrad.addColorStop(1, '#4CAF50');
  g.fillStyle = fillGrad;
  roundRect(g, barX + 4, barY + 4, (barW - 8) * prog, barH - 8, 21);
  g.fill();

  g.font = '900 22px sans-serif';
  g.fillStyle = '#FFFFFF';
  g.textAlign = 'center';
  g.fillText(`OCUPACIÓN: ${Math.round(prog * 100)}% COMPLETO`, CX, barY + 32);
  g.restore();

  // Notificaciones flotantes de reservas directas
  const notifs = [
    { text: '✨ Martina reservó: Heels Principiante', time: 0.2, y: 340 },
    { text: '🔥 Camila reservó: Danza Urbana', time: 1.4, y: 440 },
    { text: '🩰 Julieta reservó: Ballet Clásico', time: 2.6, y: 540 }
  ];

  notifs.forEach(n => {
    if (st > n.time) {
      const s = easeOutBack(clamp((st - n.time) * 2.2, 0, 1));
      g.save();
      g.translate(CX, n.y);
      g.scale(s, s);
      g.fillStyle = 'rgba(255, 255, 255, 0.95)';
      g.shadowColor = 'rgba(224, 99, 133, 0.2)';
      g.shadowBlur = 24;
      roundRect(g, -270, -32, 540, 64, 32);
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

  // Múltiples bailarinas en la sala (Comunidad Bailapp)
  const cBallet = assets['character_ballet'];
  if (cBallet) {
    g.drawImage(cBallet, CX - 480, 630, 360, 650);
  }
  const cHeels = assets['character_heels'];
  if (cHeels) {
    g.drawImage(cHeels, CX - 220, 610, 380, 670);
  }
  const cUrbano = assets['character_urbano'];
  if (cUrbano) {
    g.drawImage(cUrbano, CX + 30, 620, 380, 660);
  }
  const cGen1 = assets['character_generico_1'];
  if (cGen1) {
    g.drawImage(cGen1, CX + 240, 640, 340, 630);
  }

  drawSubtitleSafeZone(g, 'Cientos de chicas en tu barrio buscando heels, urbano y ballet listas para reservar hoy.');
}

// -------------------------------------------------------------
// ESCENA 5: CLÍMAX & CTA — "SUMÁ TU ESTUDIO GRATIS" (t: 20.8s – 25.5s)
// -------------------------------------------------------------
function drawScene5(g, t) {
  drawStudioBackground(g, 'cta');
  drawHeaderBadge(g, 'Sumá tu estudio gratis • 🩰');

  const st = t - 20.8;

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
  g.fillText('La plataforma para llenar tus clases', CX, cardY + 175);

  // Chips de Disciplinas
  const chips = ['Heels', 'Urbano', 'Ballet', 'Contemporáneo', 'Ritmos'];
  const chipStartX = CX - 370;
  chips.forEach((c, i) => {
    const cx = chipStartX + (i % 3) * 255;
    const cy = cardY + 235 + Math.floor(i / 3) * 65;
    g.fillStyle = '#FFF1F5';
    roundRect(g, cx, cy, 240, 50, 20);
    g.fill();
    g.strokeStyle = '#F8C8DC';
    g.lineWidth = 1.5;
    g.stroke();

    g.font = '800 20px sans-serif';
    g.fillStyle = '#D81B60';
    g.textAlign = 'center';
    g.fillText(`✨ ${c}`, cx + 120, cy + 32);
  });

  // Ventajas destacadas para dueños de estudio
  const benY = cardY + 410;
  const benefits = [
    '✓ Sin costo de suscripción inicial',
    '✓ Reservas directas de alumnas de tu zona',
    '✓ Visibilidad garantizada sin pagar publicidad'
  ];

  benefits.forEach((b, idx) => {
    g.font = '700 24px sans-serif';
    g.fillStyle = '#443D43';
    g.textAlign = 'center';
    g.fillText(b, CX, benY + idx * 54);
  });

  // Gran Botón Pulsante CTA
  const pulse = 1.0 + 0.035 * Math.sin(st * 7);
  const btnW = 720;
  const btnH = 100;
  const btnX = CX - btnW / 2;
  const btnY = cardY + 630;

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

  g.font = '900 34px -apple-system, sans-serif';
  g.fillStyle = '#FFFFFF';
  g.textAlign = 'center';
  g.fillText('SUMÁ TU ESTUDIO GRATIS', CX, btnY + btnH / 2 + 10);
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

  drawSubtitleSafeZone(g, 'Sumá tu estudio gratis y llená tus salas. Link en bio.');
}

// -------------------------------------------------------------
// RENDERIZADO GLOBAL & INTERACCIÓN
// -------------------------------------------------------------
window.DUR = 25.5;

window.render = async (t) => {
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, W, H);

  if (t < 4.1) {
    drawScene1(g, t);
  } else if (t < 8.7) {
    drawScene2(g, t);
  } else if (t < 15.2) {
    drawScene3(g, t);
  } else if (t < 20.8) {
    drawScene4(g, t);
  } else {
    drawScene5(g, t);
  }
};

window.READY = true;
console.log('Bailapp Reel Engine V2 Listo! Duración:', window.DUR);

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

// Auto-scale stage to fit screen
function resizePreview() {
  const availableW = window.innerWidth - 60;
  const availableH = window.innerHeight - 120;
  const scale = Math.min(availableW / W, availableH / H, 1.0);
  stageContainer.style.transform = `scale(${scale})`;
}
window.addEventListener('resize', resizePreview);
resizePreview();

// Audio Element
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
  timeDisplay.innerText = `${mins}:${secs} / 00:25`;
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

// Initial render frame at t=0
window.render(0);
