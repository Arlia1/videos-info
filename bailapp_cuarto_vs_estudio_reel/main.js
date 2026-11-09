// Bailapp — Video Viral Reel: "Coreo en tu Cuarto vs. Estudio Real (Twerk, Dancehall, Commercial, Reggaetón)"
// Duración: 27.5 segundos @ 24 fps (1080x1920)
// Safe Zone Subtítulos: Y = 1370 px

const cv = document.getElementById('c');
const g = cv.getContext('2d');

const W = 1080;
const H = 1920;
const CX = W / 2;

// Load Character Assets (All on Humaaans Rig)
const assets = {};
const charNames = [
  'character_dancehall',
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
        console.warn(`Could not load ${name}, using fallback`);
        resolve();
      };
    });
  });
  await Promise.all(promises);
  console.log('Personajes Humaaans cargados para Reel Cuarto vs Estudio!');
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
// FONDO ESTUDIO SOFT PASTEL
// -------------------------------------------------------------
function drawStudioBackground(g, mood = 'party', t = 0) {
  g.save();
  
  const grad = g.createLinearGradient(0, 0, 0, H);
  if (mood === 'room') {
    grad.addColorStop(0, '#FFF0F5');
    grad.addColorStop(0.5, '#FDE8E8');
    grad.addColorStop(1, '#FBD5D5');
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
    
    g.fillStyle = 'rgba(255, 246, 249, 0.75)';
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

  // Piso de danza estilo nórdico rosado
  const floorY = archY + 760;
  const floorGrad = g.createLinearGradient(0, floorY, 0, archY + archH);
  floorGrad.addColorStop(0, '#F5DFE8');
  floorGrad.addColorStop(1, '#EAC2D2');
  g.fillStyle = floorGrad;
  g.fillRect(archX + 10, floorY, archW - 20, archH - 770);

  // Notas musicales si es estudio real
  if (mood === 'party') {
    const notes = ['♪', '♫', '🪩', '✨', '🔥'];
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
// DIBUJAR PERSONAJE HUMAAANS
// -------------------------------------------------------------
function drawCharacter(g, imgName, x, y, scale = 1.0, bob = 0, rot = 0) {
  const img = assets[imgName];
  if (!img) return;

  g.save();
  g.translate(x, y + bob);
  g.rotate(rot);
  g.scale(scale, scale);

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
// ESCENA 1: HOOK — COREO EN TU PIEZA CHOCÁNDOTE CON TODO (0.0s – 6.6s)
// -------------------------------------------------------------
function drawScene1(g, t) {
  drawStudioBackground(g, 'room', t);
  drawHeaderBadge(g, 'Expectativa vs. Realidad • 🛏️', '#E06385');

  const sCard = easeOutBack(clamp(t * 1.5, 0, 1));
  
  // Tarjeta Caos en la Pieza
  g.save();
  g.translate(CX, 340);
  g.scale(sCard, sCard);

  const cw = 860, ch = 200;
  g.fillStyle = '#FFFFFF';
  g.shadowColor = 'rgba(224, 99, 133, 0.25)';
  g.shadowBlur = 32;
  roundRect(g, -cw/2, -ch/2, cw, ch, 32);
  g.fill();
  g.shadowColor = 'transparent';

  g.strokeStyle = '#FF8A80';
  g.lineWidth = 3.5;
  g.stroke();

  g.fillStyle = '#2D242E';
  g.font = '900 28px -apple-system, sans-serif';
  g.textAlign = 'left';
  g.fillText('💃  Bailando la coreo viral en tu cuarto...', -cw/2 + 36, -35);

  g.fillStyle = '#C2185B';
  g.font = '700 22px -apple-system, sans-serif';
  g.fillText('⚠️  Espacio libre: 1 metro cuadrado', -cw/2 + 36, 10);

  g.fillStyle = '#8E7D88';
  g.font = '600 20px -apple-system, sans-serif';
  g.fillText('Pateando la mesita de luz y esquivando la cama 🤕🛏️', -cw/2 + 36, 52);
  g.restore();

  // Obstáculos y personaje esquivando
  const bob = Math.sin(t * 6) * 10;
  const shake = t > 3.0 ? Math.sin(t * 25) * 6 : 0;
  drawCharacter(g, 'character_generico_1', CX + shake, 1260, 1.25, bob, 0.04);

  // Widget de advertencia flotante
  if (t > 2.8) {
    const sWarn = easeOutBack(clamp((t - 2.8) * 2.0, 0, 1));
    g.save();
    g.translate(CX + 240, 720);
    g.scale(sWarn, sWarn);
    g.fillStyle = '#FF5252';
    g.shadowColor = 'rgba(255, 82, 82, 0.4)';
    g.shadowBlur = 20;
    roundRect(g, -160, -30, 320, 60, 30);
    g.fill();
    g.shadowColor = 'transparent';
    g.fillStyle = '#FFFFFF';
    g.font = '800 20px sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('💥 ¡CUIDADO CON LA CAMA!', 0, 0);
    g.restore();
  }

  drawSubtitleSafeZone(g, 'Intentar aprenderte la coreo viral en tu pieza... chocándote contra la cama y pateando la mesita de luz.');
}

// -------------------------------------------------------------
// ESCENA 2: AGITATE — EL DEDO CHIQUITO Y APRETADA (6.6s – 11.7s)
// -------------------------------------------------------------
function drawScene2(g, t) {
  drawStudioBackground(g, 'room', t);
  drawHeaderBadge(g, 'El Dedo Chiquito • 🩹', '#D81B60');

  const dt = t - 6.6;
  const sAlert = easeOutBack(clamp(dt * 1.8, 0, 1));

  // Tarjeta Golpe Relatable
  g.save();
  g.translate(CX, 380);
  g.scale(sAlert, sAlert);

  const aw = 860, ah = 240;
  g.fillStyle = '#FFFFFF';
  g.shadowColor = 'rgba(216, 27, 96, 0.35)';
  g.shadowBlur = 36;
  roundRect(g, -aw/2, -ah/2, aw, ah, 36);
  g.fill();
  g.shadowColor = 'transparent';

  g.strokeStyle = '#D81B60';
  g.lineWidth = 4;
  g.stroke();

  g.fillStyle = '#D81B60';
  g.font = '900 28px -apple-system, sans-serif';
  g.textAlign = 'center';
  g.fillText('🚨 ACCIDENTE CASERO DETECTADO', 0, -50);

  g.fillStyle = '#2D242E';
  g.font = '900 36px -apple-system, sans-serif';
  g.fillText('🦶💥 "El dedo chiquito contra la pata"', 0, 8);

  g.fillStyle = '#8E7D88';
  g.font = '700 22px -apple-system, sans-serif';
  g.fillText('Bailando apretada entre el placard y la silla 😭', 0, 60);
  g.restore();

  // Personaje en pose cómica
  const bob = Math.sin(t * 8) * 6;
  drawCharacter(g, 'character_generico_1', CX, 1260, 1.25, bob, 0.08);

  drawSubtitleSafeZone(g, 'Terminás con el dedo chiquito roto y bailando apretada entre el placard y la silla.');
}

// -------------------------------------------------------------
// ESCENA 3: REFRAME — ESTUDIOS REALES EN BAILAPP (11.7s – 19.5s)
// -------------------------------------------------------------
function drawScene3(g, t) {
  drawStudioBackground(g, 'party', t);
  drawHeaderBadge(g, 'Estudios Reales en Bailapp • 🪩', '#E06385');

  const dt = t - 11.7;
  const sPhone = easeOutBack(clamp(dt * 1.5, 0, 1));

  // CAPA 1: Dúo de bailarinas en flancos laterales (DETRÁS DEL TELÉFONO)
  const bob1 = Math.sin(t * 8) * 12;
  drawCharacter(g, 'character_dancehall', 140, 1280, 1.10, bob1, 0.03);
  drawCharacter(g, 'character_kpop', W - 140, 1280, 1.10, -bob1, -0.03);

  // CAPA 2 & 3: Mockup Smartphone con Clases (SIEMPRE POR ENCIMA DE LOS PERSONAJES)
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
  g.fillText('Bailapp ✨', -pw/2 + 45, -ph/2 + 65);

  g.fillStyle = '#8E7D88';
  g.font = '700 18px -apple-system, sans-serif';
  g.fillText('📍 Estudios reales con espejos gigantes', -pw/2 + 45, -ph/2 + 98);

  // Barra de Búsqueda
  g.fillStyle = '#FFFFFF';
  roundRect(g, -pw/2 + 32, -ph/2 + 145, pw - 64, 52, 26);
  g.fill();
  g.strokeStyle = '#F8C8DC';
  g.lineWidth = 2;
  g.stroke();

  g.fillStyle = '#8E7D88';
  g.font = '600 20px -apple-system, sans-serif';
  g.fillText('🔍  Twerk, Dancehall, Commercial, Afro...', -pw/2 + 56, -ph/2 + 178);

  // Chips matemáticamente ajustados dentro del ancho útil (pw - 64)
  const categories = [
    { label: '🔥 Twerk', active: true },
    { label: '🇯🇲 Dancehall', active: true },
    { label: '👠 Commercial', active: true },
    { label: '🌍 Reggaetón', active: true }
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

  // Lista de Tarjetas
  const classCards = [
    { title: 'Twerk & Booty Isolation', time: 'Hoy 19:00 hs • Espejos gigantes', rating: '★ 5.0 (52)', color: '#FF4081' },
    { title: 'Dancehall Queen Vibes', time: 'Mañana 20:30 hs • Sonido pro', rating: '★ 4.9 (44)', color: '#7C4DFF' },
    { title: 'Commercial Dance & Femme', time: 'Jueves 19:30 hs • Espacio amplio', rating: '★ 5.0 (68)', color: '#FF6D00' },
    { title: 'Reggaetón & Perreo Libre', time: 'Viernes 20:00 hs • Pista completa', rating: '★ 4.9 (80)', color: '#E06385' }
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
  drawSubtitleSafeZone(g, 'En Bailapp encontrás clases de Twerk, Dancehall, Commercial y Reggaetón en estudios reales con espejos gigantes y la mejor vibra.');
}

// -------------------------------------------------------------
// ESCENA 4: ACTION — DEJÁ DE ROMPER LOS MUEBLES (19.5s – 22.5s)
// -------------------------------------------------------------
function drawScene4(g, t) {
  drawStudioBackground(g, 'party', t);
  drawHeaderBadge(g, 'Cuidá tus Muebles • 😂', '#00E676');

  const dt = t - 19.5;
  const sBox = easeOutBack(clamp(dt * 1.8, 0, 1));

  // CAPA 1: Bailarinas celebrando juntas (DETRÁS DE LA TARJETA)
  const bob1 = Math.abs(Math.sin(t * 12)) * -20;
  drawCharacter(g, 'character_dancehall', CX - 220, 1260, 1.25, bob1, 0.05);

  const bob2 = Math.abs(Math.cos(t * 12)) * -20;
  drawCharacter(g, 'character_bachata', CX + 220, 1260, 1.25, bob2, -0.05);

  // CAPA 2 & 3: Tarjeta Cuidá tus Muebles (POR ENCIMA DE LOS PERSONAJES)
  g.save();
  g.translate(CX, 440);
  g.scale(sBox, sBox);

  const bw = 840, bh = 340;
  g.fillStyle = '#FFFFFF';
  g.shadowColor = 'rgba(224, 99, 133, 0.35)';
  g.shadowBlur = 40;
  roundRect(g, -bw/2, -bh/2, bw, bh, 36);
  g.fill();
  g.shadowColor = 'transparent';

  g.strokeStyle = '#00E676';
  g.lineWidth = 4;
  g.stroke();

  g.fillStyle = '#2D242E';
  g.font = '900 36px -apple-system, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'alphabetic';
  g.fillText('¡DEJÁ DE ROMPER LOS MUEBLES!', 0, -60);

  const perks = [
    '✓  Muebles y mesitas de luz a salvo',
    '✓  Dedos del pie 100% intactos',
    '✓  Pista gigante con amigas y luces pro'
  ];

  g.font = '800 24px -apple-system, sans-serif';
  g.fillStyle = '#333';
  g.textAlign = 'left';
  perks.forEach((p, idx) => {
    g.fillText(p, -bw/2 + 60, 0 + idx * 45);
  });
  g.restore();

  // CAPA 4: Subtítulos Safe Zone
  drawSubtitleSafeZone(g, 'Dejá de romper los muebles de tu casa.');
}

// -------------------------------------------------------------
// ESCENA 5: CTA — BAILAPP.COM.AR (22.5s – 27.5s)
// -------------------------------------------------------------
function drawScene5(g, t) {
  drawStudioBackground(g, 'party', t);
  drawHeaderBadge(g, 'Bailapp • Tu Próxima Clase 💖', '#E06385');

  const dt = t - 22.5;
  const sCta = easeOutBack(clamp(dt * 1.5, 0, 1));

  // CAPA 1: Trío de Personajes Humaaans bailando (DETRÁS DE LA TARJETA CTA)
  const bob1 = Math.sin(t * 8) * 12;
  drawCharacter(g, 'character_dancehall', CX - 250, 1320, 1.15, bob1, 0.04);

  const bob2 = Math.cos(t * 8) * 12;
  drawCharacter(g, 'character_kpop', CX, 1320, 1.15, bob2, 0);

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
  g.fillText('Encontrá los mejores estudios cerca tuyo', 0, -85);

  // Botón Principal Pulsante
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
  g.fillText('DESCUBRÍ TU ESTUDIO IDEAL ✨', 0, 11);
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
  const subText = 'Reservá tu clase hoy en bailapp.com.ar. Link en bio.';
  drawSubtitleSafeZone(g, subText);
}

// -------------------------------------------------------------
// RENDERIZADO GLOBAL & INTERACCIÓN
// -------------------------------------------------------------
window.DUR = 27.5;

window.render = async (t) => {
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, W, H);

  if (t < 6.6) {
    drawScene1(g, t);
  } else if (t < 11.7) {
    drawScene2(g, t);
  } else if (t < 19.5) {
    drawScene3(g, t);
  } else if (t < 22.5) {
    drawScene4(g, t);
  } else {
    drawScene5(g, t);
  }
};

window.READY = true;
console.log('Bailapp Cuarto vs Estudio Reel Engine Listo! Duración:', window.DUR);

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
  timeDisplay.innerText = `${mins}:${secs} / 00:27`;
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
