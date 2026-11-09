// Bailapp — Video Viral Reel: "Gym vs. Clases de Baile (K-Pop, Commercial, Bachata, Reggaetón)"
// Duración: 32.0 segundos @ 24 fps (1080x1920)
// Safe Zone Subtítulos: Y = 1370 px

const cv = document.getElementById('c');
const g = cv.getContext('2d');

const W = 1080;
const H = 1920;
const CX = W / 2;

// Load Character Assets
const assets = {};
const charNames = [
  'character_kpop',
  'character_bachata',
  'character_urbano',
  'character_heels',
  'character_ballet',
  'character_generico_1',
  'character_generico_2'
];

async function loadAssets() {
  const promises = charNames.map(name => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = `assets/${name}.png`;
      img.onload = () => { assets[name] = img; resolve(); };
      img.onerror = () => {
        console.warn(`Could not load ${name}, using placeholder fallback`);
        resolve();
      };
    });
  });
  await Promise.all(promises);
  console.log('Personajes cargados para Bailapp Viral Glowup Reel!');
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
function drawHeaderBadge(g, text, dotColor = '#E06385') {
  g.save();
  g.font = '800 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  
  const textMetrics = g.measureText(text);
  const textWidth = textMetrics.width;
  
  const paddingH = 32;
  const dotRadius = 6;
  const dotGap = 16;
  
  const bw = Math.round(textWidth + paddingH * 2 + dotRadius * 2 + dotGap);
  const bh = 60;
  const bx = Math.round((W - bw) / 2);
  const by = 80;

  g.fillStyle = '#FFFFFF';
  g.shadowColor = 'rgba(224, 99, 133, 0.20)';
  g.shadowBlur = 26;
  g.shadowOffsetY = 8;
  roundRect(g, bx, by, bw, bh, 30);
  g.fill();
  g.shadowColor = 'transparent';

  g.strokeStyle = '#FAD2E1';
  g.lineWidth = 2.5;
  g.stroke();

  const dotX = bx + paddingH + dotRadius;
  const dotY = by + bh / 2;
  g.fillStyle = dotColor;
  g.beginPath();
  g.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
  g.fill();

  g.fillStyle = '#2D242E';
  g.textAlign = 'left';
  g.textBaseline = 'middle';
  g.fillText(text, dotX + dotRadius + dotGap, by + bh / 2 + 1);

  g.restore();
}

function wrapWordsToLines(g, text, maxW) {
  const words = text.trim().split(/\s+/);
  const lines = [];
  let current = '';
  for (const w of words) {
    const test = current ? current + ' ' + w : w;
    if (g.measureText(test).width <= maxW) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// -------------------------------------------------------------
// SAFE ZONE MANDATORIA PARA SUBTÍTULOS (Y = 1370)
// -------------------------------------------------------------
function drawSubtitleSafeZone(g, text) {
  const subY = 1370;
  const pillW = 960;
  const pillH = 132;
  const pillX = (W - pillW) / 2;
  const maxW = pillW - 90; // 870 px de ancho máximo útil (45 px de margen interior a cada lado)

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

  let fontSize = 33;
  g.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  let lines = wrapWordsToLines(g, text, maxW);

  if (lines.length === 2) {
    fontSize = 29;
    g.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    lines = wrapWordsToLines(g, text, maxW);
  } else if (lines.length >= 3) {
    fontSize = 23;
    g.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    lines = wrapWordsToLines(g, text, maxW);
  }

  // Reducción preventiva si alguna palabra o línea aún supera maxW
  while (fontSize > 16) {
    let overflow = false;
    for (const l of lines) {
      if (g.measureText(l).width > maxW) {
        overflow = true;
        break;
      }
    }
    if (!overflow) break;
    fontSize -= 1;
    g.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    lines = wrapWordsToLines(g, text, maxW);
  }

  if (lines.length === 1) {
    g.fillText(lines[0], CX, subY + pillH / 2);
  } else if (lines.length === 2) {
    const spacing = 38;
    const startY = subY + pillH / 2 - spacing / 2;
    g.fillText(lines[0], CX, startY);
    g.fillText(lines[1], CX, startY + spacing);
  } else {
    const spacing = 31;
    const startY = subY + pillH / 2 - spacing;
    g.fillText(lines[0], CX, startY);
    g.fillText(lines[1], CX, startY + spacing);
    g.fillText(lines[2], CX, startY + spacing * 2);
  }

  g.restore();
}

// -------------------------------------------------------------
// FONDO ESTUDIO SOFT PASTEL CON DETALLES ESCÉNICOS
// -------------------------------------------------------------
function drawStudioBackground(g, mood = 'party', t = 0) {
  g.save();
  
  const grad = g.createLinearGradient(0, 0, 0, H);
  if (mood === 'gym') {
    grad.addColorStop(0, '#F1F5F9');
    grad.addColorStop(0.5, '#E2E8F0');
    grad.addColorStop(1, '#CBD5E1');
  } else if (mood === 'party') {
    grad.addColorStop(0, '#FFF5F8');
    grad.addColorStop(0.45, '#FDEBF2');
    grad.addColorStop(1, '#FBD4E3');
  } else {
    grad.addColorStop(0, '#FFF8FA');
    grad.addColorStop(0.5, '#FCE8F0');
    grad.addColorStop(1, '#F9D1E1');
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

  // Espejos de estudio con reflejos
  for (let i = 0; i < 3; i++) {
    const mx = archX + 40 + i * 295;
    const my = archY + 50;
    const mw = 280;
    const mh = 700;
    
    g.fillStyle = mood === 'gym' ? 'rgba(241, 245, 249, 0.7)' : 'rgba(255, 246, 249, 0.75)';
    roundRect(g, mx, my, mw, mh, 24);
    g.fill();
    g.strokeStyle = mood === 'gym' ? '#CBD5E1' : '#FAD2E1';
    g.lineWidth = 2;
    g.stroke();

    // Reflejo diagonal
    g.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(mx + 30, my + 60);
    g.lineTo(mx + 110, my + 680);
    g.stroke();
  }

  // Barra de danza
  g.strokeStyle = mood === 'gym' ? '#94A3B8' : '#D8A3B8';
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(archX + 30, archY + 480);
  g.lineTo(archX + archW - 30, archY + 480);
  g.stroke();

  // Piso de danza estilo madera nórdica rosada
  const floorY = archY + 760;
  const floorGrad = g.createLinearGradient(0, floorY, 0, archY + archH);
  if (mood === 'gym') {
    floorGrad.addColorStop(0, '#CBD5E1');
    floorGrad.addColorStop(1, '#94A3B8');
  } else {
    floorGrad.addColorStop(0, '#F5DFE8');
    floorGrad.addColorStop(1, '#EAC2D2');
  }
  g.fillStyle = floorGrad;
  g.fillRect(archX + 10, floorY, archW - 20, archH - 770);

  // Destellos y notas musicales flotantes si es fiesta
  if (mood === 'party') {
    const notes = ['♪', '♫', '🪩', '✨', '💖'];
    g.font = '28px sans-serif';
    for (let i = 0; i < 6; i++) {
      const nx = archX + 100 + (i * 140) + Math.sin(t * 3 + i) * 20;
      const ny = archY + 120 + ((t * 40 + i * 90) % 550);
      const alpha = 0.25 + 0.25 * Math.sin(t * 4 + i);
      g.fillStyle = `rgba(224, 99, 133, ${alpha})`;
      g.fillText(notes[i % notes.length], nx, ny);
    }
  }

  g.restore();
}

// -------------------------------------------------------------
// DIBUJAR PERSONAJE CON ANIMACIÓN SUAVE
// -------------------------------------------------------------
function drawCharacter(g, imgName, x, y, scale = 1.0, bob = 0, rot = 0) {
  const img = assets[imgName];
  if (!img) return;

  g.save();
  g.translate(x, y + bob);
  g.rotate(rot);
  g.scale(scale, scale);

  // Sombra suave en los pies
  g.fillStyle = 'rgba(216, 27, 96, 0.15)';
  g.beginPath();
  g.ellipse(0, 0, 110 * scale, 24 * scale, 0, 0, Math.PI * 2);
  g.fill();

  const iw = img.width;
  const ih = img.height;
  const drawW = 340;
  const drawH = (ih / iw) * drawW;

  g.drawImage(img, -drawW / 2, -drawH + 15, drawW, drawH);
  g.restore();
}

// -------------------------------------------------------------
// ESCENA 1: HOOK — GYM VS. BAILAR K-POP / COMMERCIAL / BACHATA (0.0s – 7.8s)
// -------------------------------------------------------------
function drawScene1(g, t) {
  drawStudioBackground(g, 'party', t);
  drawHeaderBadge(g, 'Dilema Viral • Gym vs. Baile 🪩', '#E06385');

  // Tarjeta Comparativa Dividida
  const cardScale = easeOutBack(clamp(t * 1.5, 0, 1));
  
  // 1. Tarjeta Gym (Gris y Aburrida)
  g.save();
  g.translate(CX, 300);
  g.scale(cardScale, cardScale);
  
  const gw = 860, gh = 150;
  g.fillStyle = '#FFFFFF';
  g.shadowColor = 'rgba(100, 116, 139, 0.20)';
  g.shadowBlur = 24;
  roundRect(g, -gw/2, -gh/2, gw, gh, 24);
  g.fill();
  g.shadowColor = 'transparent';
  g.strokeStyle = '#E2E8F0';
  g.lineWidth = 3;
  g.stroke();

  // Contenido Gym
  g.fillStyle = '#64748B';
  g.font = '800 24px -apple-system, sans-serif';
  g.textAlign = 'left';
  g.fillText('🥱  40 min trotando en la cinta mirando una pared', -gw/2 + 32, -18);
  
  // Barra de progreso lenta
  const barW = gw - 64;
  g.fillStyle = '#F1F5F9';
  roundRect(g, -gw/2 + 32, 10, barW, 20, 10);
  g.fill();
  
  const progW = barW * 0.12;
  g.fillStyle = '#94A3B8';
  roundRect(g, -gw/2 + 32, 10, progW, 20, 10);
  g.fill();

  g.fillStyle = '#94A3B8';
  g.font = '700 18px -apple-system, sans-serif';
  g.fillText('Minuto 3:12... parece una eternidad 🐌', -gw/2 + 32, 54);
  g.restore();

  // 2. Tarjeta Versus
  const sVs = easeOutBack(clamp((t - 1.2) * 2.0, 0, 1));
  if (t > 1.2) {
    g.save();
    g.translate(CX, 420);
    g.scale(sVs, sVs);
    g.fillStyle = '#D81B60';
    g.shadowColor = 'rgba(216, 27, 96, 0.4)';
    g.shadowBlur = 18;
    roundRect(g, -70, -28, 140, 56, 28);
    g.fill();
    g.shadowColor = 'transparent';
    g.fillStyle = '#FFFFFF';
    g.font = '900 22px sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('VS', 0, 0);
    g.restore();
  }

  // 3. Tarjeta Baile Viral (Pastel Vibrante)
  if (t > 1.8) {
    const sDance = easeOutBack(clamp((t - 1.8) * 1.6, 0, 1));
    g.save();
    g.translate(CX, 570);
    g.scale(sDance, sDance);

    const dw = 860, dh = 180;
    const danceGrad = g.createLinearGradient(-dw/2, -dh/2, dw/2, dh/2);
    danceGrad.addColorStop(0, '#FFFFFF');
    danceGrad.addColorStop(1, '#FFF0F5');
    g.fillStyle = danceGrad;
    g.shadowColor = 'rgba(224, 99, 133, 0.35)';
    g.shadowBlur = 32;
    g.shadowOffsetY = 10;
    roundRect(g, -dw/2, -dh/2, dw, dh, 28);
    g.fill();
    g.shadowColor = 'transparent';
    g.strokeStyle = '#E06385';
    g.lineWidth = 3.5;
    g.stroke();

    g.fillStyle = '#2D242E';
    g.font = '900 28px -apple-system, sans-serif';
    g.textAlign = 'left';
    g.fillText('🪩  K-Pop • Commercial Dance • Bachata', -dw/2 + 36, -30);

    // Badges de estilos
    const styles = [
      { text: '🇰🇷 K-Pop Choreo', bg: '#FCE4EC', color: '#C2185B' },
      { text: '👠 Commercial', bg: '#EDE7F6', color: '#512DA8' },
      { text: '💃 Bachata Flow', bg: '#FFF3E0', color: '#E65100' }
    ];

    let startX = -dw/2 + 36;
    styles.forEach((item) => {
      g.font = '800 18px sans-serif';
      const tw = g.measureText(item.text).width + 30;
      g.fillStyle = item.bg;
      roundRect(g, startX, 15, tw, 42, 21);
      g.fill();
      g.fillStyle = item.color;
      g.fillText(item.text, startX + 15, 42);
      startX += tw + 14;
    });

    g.restore();
  }

  // Personajes Humaaans: K-Pop y Bachata entrando y bailando
  if (t > 2.5) {
    const popT = clamp((t - 2.5) * 1.5, 0, 1);
    const bob1 = Math.sin(t * 8) * 12;
    const rot1 = Math.sin(t * 4) * 0.04;
    
    // Character K-Pop a la izquierda
    const kpopX = lerp(CX - 320, CX - 190, easeOutBack(popT));
    drawCharacter(g, 'character_kpop', kpopX, 1260, 1.25, bob1, rot1);

    // Character Bachata a la derecha
    const bob2 = Math.cos(t * 8) * 12;
    const rot2 = -Math.sin(t * 4) * 0.04;
    const bachataX = lerp(CX + 320, CX + 190, easeOutBack(popT));
    drawCharacter(g, 'character_bachata', bachataX, 1260, 1.25, bob2, rot2);

    // Banner Modo Videoclip
    const sBadge = easeOutBack(clamp((t - 3.2) * 2.0, 0, 1));
    g.save();
    g.translate(CX, 760);
    g.scale(sBadge, sBadge);
    g.fillStyle = '#E06385';
    g.shadowColor = 'rgba(224, 99, 133, 0.4)';
    g.shadowBlur = 24;
    roundRect(g, -260, -32, 520, 64, 32);
    g.fill();
    g.shadowColor = 'transparent';
    g.fillStyle = '#FFFFFF';
    g.font = '900 24px sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('✨ Sintiéndote en tu propio videoclip ✨', 0, 0);
    g.restore();
  }

  drawSubtitleSafeZone(g, 'Hacer 40 minutos de cinta en el gym... o bailar K-Pop, Commercial y Bachata sintiéndote en tu videoclip.');
}

// -------------------------------------------------------------
// ESCENA 2: CONTRATSTE VIRAL — SEGUNDOS DEL GYM VS. 600 KCAL CANTANDO (7.8s – 16.4s)
// -------------------------------------------------------------
function drawScene2(g, t) {
  const isGymPhase = t < 11.2;

  if (isGymPhase) {
    // FASE GYM: Contás los segundos para irte (7.8s - 11.2s)
    drawStudioBackground(g, 'gym', t);
    drawHeaderBadge(g, 'Eternidad en la Cinta • ⏱️', '#64748B');

    const dt = t - 7.8;
    const sClock = easeOutBack(clamp(dt * 2.0, 0, 1));

    g.save();
    g.translate(CX, 440);
    g.scale(sClock, sClock);

    const cw = 760, ch = 320;
    g.fillStyle = '#FFFFFF';
    g.shadowColor = 'rgba(100, 116, 139, 0.25)';
    g.shadowBlur = 36;
    roundRect(g, -cw/2, -ch/2, cw, ch, 36);
    g.fill();
    g.shadowColor = 'transparent';
    g.strokeStyle = '#CBD5E1';
    g.lineWidth = 4;
    g.stroke();

    g.fillStyle = '#64748B';
    g.font = '800 26px sans-serif';
    g.textAlign = 'center';
    g.fillText('CRONÓMETRO DE LA CINTA', 0, -85);

    const secs = (dt * 1.5).toFixed(1);
    g.fillStyle = '#1E293B';
    g.font = '900 90px monospace';
    g.fillText(`00:0${Math.floor(secs)}:${Math.floor((dt * 45) % 60).toString().padStart(2, '0')}`, 0, 10);

    g.fillStyle = '#EF4444';
    g.font = '800 24px sans-serif';
    g.fillText('🥱 "¿Pasaron 10 minutos o 10 segundos?"', 0, 95);
    g.restore();

    drawCharacter(g, 'character_generico_1', CX, 1260, 1.25, Math.sin(t * 2) * 5, 0.05);

    drawSubtitleSafeZone(g, 'En el gym contás los segundos para irte.');
  } else {
    // FASE BAILE: Quemás 600 calorías cantando a los gritos (11.2s - 16.4s)
    drawStudioBackground(g, 'party', t);
    drawHeaderBadge(g, 'Glow Up & Endorfinas • 🔥', '#E06385');

    const dt = t - 11.2;
    const sExplode = easeOutBack(clamp(dt * 2.2, 0, 1));

    // Contador de Calorías
    g.save();
    g.translate(CX, 380);
    g.scale(sExplode, sExplode);

    const kw = 840, kh = 220;
    const kGrad = g.createLinearGradient(-kw/2, 0, kw/2, 0);
    kGrad.addColorStop(0, '#FF4081');
    kGrad.addColorStop(1, '#E06385');
    g.fillStyle = kGrad;
    g.shadowColor = 'rgba(216, 27, 96, 0.45)';
    g.shadowBlur = 40;
    roundRect(g, -kw/2, -kh/2, kw, kh, 36);
    g.fill();
    g.shadowColor = 'transparent';

    g.fillStyle = '#FFFFFF';
    g.textAlign = 'center';
    g.font = '900 26px -apple-system, sans-serif';
    g.fillText('🔥 QUEMANDO CALORÍAS CON AMIGAS 🔥', 0, -50);

    const currentKcal = Math.min(620, Math.floor(lerp(200, 620, easeOutQuad(clamp(dt * 0.8, 0, 1)))));
    g.font = '900 80px -apple-system, sans-serif';
    g.fillText(`- ${currentKcal} kcal`, 0, 30);

    g.font = '800 22px -apple-system, sans-serif';
    g.fillText('Sin darte cuenta y cantando a los gritos 🎤✨', 0, 75);
    g.restore();

    // Ecualizador animado
    g.save();
    g.translate(CX, 580);
    const bars = 18;
    const barWidth = 24;
    const barGap = 16;
    const totalW = bars * (barWidth + barGap);
    let startX = -totalW / 2;

    for (let i = 0; i < bars; i++) {
      const bh = 30 + Math.abs(Math.sin(t * 12 + i * 0.7)) * 70;
      const bGrad = g.createLinearGradient(0, -bh, 0, 0);
      bGrad.addColorStop(0, '#E06385');
      bGrad.addColorStop(1, '#FAD2E1');
      g.fillStyle = bGrad;
      roundRect(g, startX + i * (barWidth + barGap), -bh, barWidth, bh, 8);
      g.fill();
    }
    g.restore();

    // Dúo de personajes bailando al ritmo
    const bob1 = Math.abs(Math.sin(t * 10)) * -22;
    const rot1 = Math.sin(t * 6) * 0.08;
    drawCharacter(g, 'character_kpop', CX - 220, 1260, 1.25, bob1, rot1);

    const bob2 = Math.abs(Math.cos(t * 10)) * -22;
    const rot2 = -Math.sin(t * 6) * 0.08;
    drawCharacter(g, 'character_bachata', CX + 220, 1260, 1.25, bob2, rot2);

    drawSubtitleSafeZone(g, 'Bailando quemás 600 calorías cantando a los gritos y con la música al palo.');
  }
}

// -------------------------------------------------------------
// ESCENA 3: EXPLORÁ EN BAILAPP — K-POP, COMMERCIAL, BACHATA, REGGAETÓN (16.4s – 23.2s)
// -------------------------------------------------------------
function drawScene3(g, t) {
  drawStudioBackground(g, 'party', t);
  drawHeaderBadge(g, 'Descubrí en Bailapp • 📱', '#E06385');

  const dt = t - 16.4;
  const sPhone = easeOutBack(clamp(dt * 1.5, 0, 1));

  // CAPA 1: Personajes asomándose en los flancos laterales (DETRÁS DEL TELÉFONO)
  const bob = Math.sin(t * 6) * 10;
  drawCharacter(g, 'character_kpop', 140, 1280, 1.10, bob, 0.03);
  drawCharacter(g, 'character_bachata', W - 140, 1280, 1.10, -bob, -0.03);

  // CAPA 2 & 3: Smartphone Mockup con la App de Bailapp (POR ENCIMA DE LOS PERSONAJES)
  g.save();
  g.translate(CX, 620);
  g.scale(sPhone, sPhone);

  const pw = 680, ph = 820;
  
  g.fillStyle = '#FFFFFF';
  g.shadowColor = 'rgba(224, 99, 133, 0.35)';
  g.shadowBlur = 48;
  g.shadowOffsetY = 16;
  roundRect(g, -pw/2, -ph/2, pw, ph, 44);
  g.fill();
  g.shadowColor = 'transparent';
  g.strokeStyle = '#FAD2E1';
  g.lineWidth = 4;
  g.stroke();

  // Header App
  g.fillStyle = '#FFF5F8';
  roundRect(g, -pw/2 + 16, -ph/2 + 16, pw - 32, 110, 32);
  g.fill();

  g.fillStyle = '#E06385';
  g.font = '900 30px -apple-system, sans-serif';
  g.textAlign = 'left';
  g.textBaseline = 'alphabetic';
  g.fillText('Bailapp ✨', -pw/2 + 45, -ph/2 + 65);

  g.fillStyle = '#8E7D88';
  g.font = '700 18px -apple-system, sans-serif';
  g.fillText('📍 Clases virales cerca de vos', -pw/2 + 45, -ph/2 + 98);

  // Barra de Búsqueda
  g.fillStyle = '#FFFFFF';
  roundRect(g, -pw/2 + 32, -ph/2 + 145, pw - 64, 52, 26);
  g.fill();
  g.strokeStyle = '#F8C8DC';
  g.lineWidth = 2;
  g.stroke();

  g.fillStyle = '#8E7D88';
  g.font = '600 20px -apple-system, sans-serif';
  g.fillText('🔍  K-Pop, Commercial, Bachata, Reggaetón...', -pw/2 + 56, -ph/2 + 178);

  // Chips de Categorías perfectamente contenidos en (pw - 64)
  const categories = [
    { label: '🇰🇷 K-Pop', active: true },
    { label: '👠 Commercial', active: true },
    { label: '💃 Bachata', active: true },
    { label: '🔥 Reggaetón', active: true }
  ];

  const gap = 8;
  const totalInnerW = pw - 64; // 616 px
  const chipW = Math.floor((totalInnerW - gap * (categories.length - 1)) / categories.length); // 148 px
  const startChipX = -pw/2 + 32;

  categories.forEach((cat, idx) => {
    const isLit = Math.floor(dt * 2) % categories.length === idx;
    const cx = startChipX + idx * (chipW + gap);
    g.fillStyle = isLit ? '#E06385' : '#FFF0F5';
    roundRect(g, cx, -ph/2 + 215, chipW, 40, 20);
    g.fill();
    g.fillStyle = isLit ? '#FFFFFF' : '#D81B60';
    g.font = '800 15px sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(cat.label, cx + chipW / 2, -ph/2 + 236);
  });

  // Lista de Tarjetas de Clases
  const classCards = [
    { title: 'K-Pop Idol Choreography', time: 'Hoy 19:30 hs • 4 cupos', rating: '★ 4.9 (48)', color: '#FF4081' },
    { title: 'Commercial Dance & Femme', time: 'Mañana 20:00 hs • 2 cupos', rating: '★ 5.0 (62)', color: '#7C4DFF' },
    { title: 'Bachata Sensual & Flow', time: 'Viernes 20:30 hs • Últimos lugares', rating: '★ 4.9 (39)', color: '#FF6D00' },
    { title: 'Reggaetón & Perreo Intenso', time: 'Sábado 18:00 hs • Fiesta total', rating: '★ 5.0 (85)', color: '#E06385' }
  ];

  classCards.forEach((card, idx) => {
    const cy = -ph/2 + 280 + idx * 125;
    g.fillStyle = '#FFFFFF';
    g.strokeStyle = '#FAD2E1';
    g.lineWidth = 2;
    roundRect(g, -pw/2 + 32, cy, pw - 64, 110, 24);
    g.fill();
    g.stroke();

    g.fillStyle = card.color;
    roundRect(g, -pw/2 + 44, cy + 18, 10, 74, 5);
    g.fill();

    g.fillStyle = '#2D242E';
    g.font = '800 22px -apple-system, sans-serif';
    g.textAlign = 'left';
    g.textBaseline = 'alphabetic';
    g.fillText(card.title, -pw/2 + 68, cy + 42);

    g.fillStyle = '#8E7D88';
    g.font = '600 17px -apple-system, sans-serif';
    g.fillText(card.time, -pw/2 + 68, cy + 72);

    g.fillStyle = '#E06385';
    g.font = '800 17px -apple-system, sans-serif';
    g.fillText(card.rating, -pw/2 + 68, cy + 96);

    // Botón Reservar
    g.fillStyle = '#FFF0F5';
    roundRect(g, pw/2 - 160, cy + 32, 110, 46, 23);
    g.fill();
    g.fillStyle = '#E06385';
    g.font = '800 16px sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('Reservar', pw/2 - 105, cy + 56);
  });

  g.restore();

  // CAPA 4: Subtítulos Safe Zone
  drawSubtitleSafeZone(g, 'Con Bailapp encontrás las clases más virales de tu ciudad: K-Pop, Commercial, Bachata y Reggaetón.');
}

// -------------------------------------------------------------
// ESCENA 4: RESERVAS EN UN TOQUE Y DIRECTO A LA PISTA (23.2s – 26.5s)
// -------------------------------------------------------------
function drawScene4(g, t) {
  drawStudioBackground(g, 'party', t);
  drawHeaderBadge(g, 'Lugar Asegurado en Pista • 🎟️', '#00E676');

  const dt = t - 23.2;
  const sTicket = easeOutBack(clamp(dt * 1.8, 0, 1));

  // CAPA 1: Personajes celebrando (DETRÁS DEL TICKET)
  const bob1 = Math.abs(Math.sin(t * 12)) * -20;
  drawCharacter(g, 'character_kpop', CX - 240, 1260, 1.25, bob1, 0.05);
  
  const bob2 = Math.abs(Math.cos(t * 12)) * -20;
  drawCharacter(g, 'character_urbano', CX, 1260, 1.25, bob2, 0);

  const bob3 = Math.abs(Math.sin(t * 12 + 1)) * -20;
  drawCharacter(g, 'character_bachata', CX + 240, 1260, 1.25, bob3, -0.05);

  // CAPA 2 & 3: Tarjeta Boleto VIP de Reserva (POR ENCIMA DE LOS PERSONAJES)
  g.save();
  g.translate(CX, 440);
  g.scale(sTicket, sTicket);

  const tw = 840, th = 380;
  g.fillStyle = '#FFFFFF';
  g.shadowColor = 'rgba(224, 99, 133, 0.35)';
  g.shadowBlur = 40;
  g.shadowOffsetY = 15;
  roundRect(g, -tw/2, -th/2, tw, th, 36);
  g.fill();
  g.shadowColor = 'transparent';

  g.strokeStyle = '#00E676';
  g.lineWidth = 4;
  g.stroke();

  // Checkmark Icon
  g.fillStyle = '#E8F5E9';
  g.beginPath();
  g.arc(0, -90, 52, 0, Math.PI * 2);
  g.fill();

  g.fillStyle = '#00C853';
  g.font = '900 50px sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('✓', 0, -90);

  g.fillStyle = '#2D242E';
  g.font = '900 36px -apple-system, sans-serif';
  g.textBaseline = 'alphabetic';
  g.fillText('¡RESERVA CONFIRMADA!', 0, -10);

  g.fillStyle = '#666';
  g.font = '700 24px -apple-system, sans-serif';
  g.fillText('Tu lugar está guardado. Cero filas, directo a bailar 🪩', 0, 45);

  // Badge Pase
  g.fillStyle = '#FFF0F5';
  roundRect(g, -240, 85, 480, 56, 28);
  g.fill();
  g.fillStyle = '#E06385';
  g.font = '900 22px sans-serif';
  g.textBaseline = 'middle';
  g.fillText('🎟️ PASE DIRECTO A LA PISTA', 0, 114);

  g.restore();

  // Confetti
  g.save();
  for (let i = 0; i < 35; i++) {
    const cx = (i * 97 + dt * 180) % W;
    const cy = 200 + ((i * 133 + dt * 350) % 700);
    const cr = (i % 3 + 3);
    const colors = ['#E06385', '#FF4081', '#00E676', '#FFD700', '#7C4DFF'];
    g.fillStyle = colors[i % colors.length];
    g.beginPath();
    g.arc(cx, cy, cr, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();

  // CAPA 4: Subtítulos Safe Zone
  drawSubtitleSafeZone(g, 'Reservás en un toque y vas directo a la pista.');
}

// -------------------------------------------------------------
// ESCENA 5: CALL TO ACTION VIRAL — BAILAPP.COM.AR (26.5s – 32.0s)
// -------------------------------------------------------------
function drawScene5(g, t) {
  drawStudioBackground(g, 'party', t);
  drawHeaderBadge(g, 'Bailapp • Tu Próxima Clase 💖', '#E06385');

  const dt = t - 26.5;
  const sCta = easeOutBack(clamp(dt * 1.5, 0, 1));

  // CAPA 1: Trío de Personajes bailando en sintonía (DETRÁS DE LA TARJETA CTA)
  const bob1 = Math.sin(t * 8) * 12;
  drawCharacter(g, 'character_kpop', CX - 250, 1320, 1.15, bob1, 0.04);

  const bob2 = Math.cos(t * 8) * 12;
  drawCharacter(g, 'character_urbano', CX, 1320, 1.15, bob2, 0);

  const bob3 = Math.sin(t * 8 + 2) * 12;
  drawCharacter(g, 'character_bachata', CX + 250, 1320, 1.15, bob3, -0.04);

  // CAPA 2 & 3: Tarjeta de Llamado a la Acción (POR ENCIMA DE LOS PERSONAJES)
  g.save();
  g.translate(CX, 440);
  g.scale(sCta, sCta);

  const cw = 880, ch = 440;
  g.fillStyle = '#FFFFFF';
  g.shadowColor = 'rgba(224, 99, 133, 0.40)';
  g.shadowBlur = 48;
  g.shadowOffsetY = 16;
  roundRect(g, -cw/2, -ch/2, cw, ch, 40);
  g.fill();
  g.shadowColor = 'transparent';

  g.strokeStyle = '#FAD2E1';
  g.lineWidth = 3.5;
  g.stroke();

  // Logo / Título
  g.fillStyle = '#2D242E';
  g.font = '900 48px -apple-system, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'alphabetic';
  g.fillText('Bailapp ✨', 0, -130);

  g.fillStyle = '#8E7D88';
  g.font = '700 24px -apple-system, sans-serif';
  g.fillText('La plataforma de clases de baile más viral', 0, -85);

  // Botón Principal
  const btnPulse = 1.0 + Math.sin(t * 6) * 0.03;
  g.save();
  g.scale(btnPulse, btnPulse);
  
  const bw = 640, bh = 84;
  const btnGrad = g.createLinearGradient(-bw/2, 0, bw/2, 0);
  btnGrad.addColorStop(0, '#FF4081');
  btnGrad.addColorStop(1, '#E06385');
  g.fillStyle = btnGrad;
  g.shadowColor = 'rgba(216, 27, 96, 0.5)';
  g.shadowBlur = 28;
  g.shadowOffsetY = 8;
  roundRect(g, -bw/2, -bh/2 + 10, bw, bh, 42);
  g.fill();
  g.shadowColor = 'transparent';

  g.fillStyle = '#FFFFFF';
  g.font = '900 28px -apple-system, sans-serif';
  g.textBaseline = 'middle';
  g.fillText('DESCUBRÍ TU CLASE VIRAL ✨', 0, 11);
  g.restore();

  // Enlace Web Oficial Mandatorio
  g.fillStyle = '#FFF0F5';
  roundRect(g, -260, 105, 520, 60, 30);
  g.fill();
  g.strokeStyle = '#E06385';
  g.lineWidth = 2.5;
  g.stroke();

  g.fillStyle = '#E06385';
  g.font = '900 26px monospace';
  g.textBaseline = 'middle';
  g.fillText('🌐  bailapp.com.ar', 0, 136);

  g.restore();

  // CAPA 4: Subtítulos Safe Zone
  const subText = t < 29.8
    ? 'Cambiá tu rutina hoy en bailapp.com.ar.'
    : 'Cambiá tu rutina hoy en bailapp.com.ar. Link en bio.';
  drawSubtitleSafeZone(g, subText);
}

// -------------------------------------------------------------
// RENDERIZADO GLOBAL & INTERACCIÓN
// -------------------------------------------------------------
window.DUR = 32.0;

window.render = async (t) => {
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, W, H);

  if (t < 7.8) {
    drawScene1(g, t);
  } else if (t < 16.4) {
    drawScene2(g, t);
  } else if (t < 23.2) {
    drawScene3(g, t);
  } else if (t < 26.5) {
    drawScene4(g, t);
  } else {
    drawScene5(g, t);
  }
};

window.READY = true;
console.log('Bailapp Viral Glowup Reel Engine Listo! Duración:', window.DUR);

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
  timeDisplay.innerText = `${mins}:${secs} / 00:32`;
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
