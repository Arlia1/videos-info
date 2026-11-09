// Bailapp — Video Viral Reel: "Terapia de Endorfinas a las 19 hs"
// Duración: 30.5 segundos @ 24 fps (1080x1920)
// Safe Zone Subtítulos: Y = 1370 px

const cv = document.getElementById('c');
const g = cv.getContext('2d');

const W = 1080;
const H = 1920;
const CX = W / 2;

// Load Character Assets (All on authentic Humaaans Rig)
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
  console.log('Personajes Humaaans cargados para Reel Terapia de Endorfinas!');
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
// DIBUJO DE PERSONAJE VECTORIAL HUMAAANS
// -------------------------------------------------------------
function drawCharacter(g, name, x, y, scale = 1.0, rot = 0, alpha = 1.0) {
  const img = assets[name];
  if (!img) return;

  g.save();
  g.globalAlpha = alpha;
  g.translate(x, y);
  g.rotate((rot * Math.PI) / 180);
  g.scale(scale, scale);

  const iw = img.naturalWidth || 540;
  const ih = img.naturalHeight || 960;
  const targetH = 820;
  const targetW = (iw / ih) * targetH;

  // Sombra suave en el piso
  g.fillStyle = 'rgba(0, 0, 0, 0.08)';
  g.beginPath();
  g.ellipse(0, 0, targetW * 0.38, 22, 0, 0, Math.PI * 2);
  g.fill();

  // Dibujar personaje centrado en la base
  g.drawImage(img, -targetW / 2, -targetH, targetW, targetH);

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
// FONDOS PASTEL SEGÚN ESTADO DE ÁNIMO
// -------------------------------------------------------------
function drawStudioBackground(g, mood = 'party', t = 0) {
  g.save();
  
  const grad = g.createLinearGradient(0, 0, 0, H);
  if (mood === 'tired') {
    // Fondo frío, cansado, lofi
    grad.addColorStop(0, '#EAE6E8');
    grad.addColorStop(0.5, '#DFD8DE');
    grad.addColorStop(1, '#D0C8D2');
  } else if (mood === 'office') {
    // Tarde agotadora de trabajo
    grad.addColorStop(0, '#EDE7EC');
    grad.addColorStop(0.5, '#E5DCE3');
    grad.addColorStop(1, '#D8CAD5');
  } else {
    // Party & Endorfinas: Dulce pastel vibrante Bailapp
    grad.addColorStop(0, '#FFF5F8');
    grad.addColorStop(0.35, '#FCE8F0');
    grad.addColorStop(0.75, '#FAD2E1');
    grad.addColorStop(1, '#F3C5D8');
  }

  g.fillStyle = grad;
  g.fillRect(0, 0, W, H);

  // Círculos abstractos suaves
  const pulse = Math.sin(t * 3) * 20;
  g.fillStyle = mood === 'party' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.25)';
  g.beginPath();
  g.arc(CX - 280, 420 + pulse, 360, 0, Math.PI * 2);
  g.fill();

  g.beginPath();
  g.arc(CX + 320, 1050 - pulse, 440, 0, Math.PI * 2);
  g.fill();

  // Piso de madera clara de estudio de danza
  g.fillStyle = mood === 'party' ? '#F6DFD6' : '#DFD4CD';
  roundRect(g, -50, 1530, W + 100, 420, 60);
  g.fill();
  g.strokeStyle = 'rgba(0, 0, 0, 0.04)';
  g.lineWidth = 3;
  for (let i = 0; i < 7; i++) {
    g.beginPath();
    g.moveTo(-50, 1560 + i * 50);
    g.lineTo(W + 50, 1560 + i * 50);
    g.stroke();
  }

  // Destellos de fiesta si es mood party
  if (mood === 'party') {
    for (let i = 0; i < 14; i++) {
      const sx = (Math.sin(i * 123.4 + t * 2) * 0.5 + 0.5) * W;
      const sy = 160 + ((i * 85 + t * 140) % 1150);
      const rad = 4 + (i % 5) * 3;
      const col = ['#E06385', '#D81B60', '#FAD2E1', '#FFF'][i % 4];
      g.fillStyle = col;
      g.globalAlpha = 0.55 + Math.sin(t * 6 + i) * 0.3;
      g.beginPath();
      g.arc(sx, sy, rad, 0, Math.PI * 2);
      g.fill();
    }
  }

  g.restore();
}

// -------------------------------------------------------------
// HEADER BADGE SUPERIOR
// -------------------------------------------------------------
function drawHeaderBadge(g, text, tagColor = '#E06385') {
  g.save();
  const bw = 540;
  const bh = 58;
  const bx = (W - bw) / 2;
  const by = 86;

  g.fillStyle = 'rgba(255, 255, 255, 0.95)';
  g.shadowColor = 'rgba(0, 0, 0, 0.08)';
  g.shadowBlur = 16;
  g.shadowOffsetY = 6;
  roundRect(g, bx, by, bw, bh, 29);
  g.fill();
  g.shadowColor = 'transparent';

  g.strokeStyle = '#FAD2E1';
  g.lineWidth = 2;
  g.stroke();

  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillStyle = tagColor;
  g.font = '800 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  g.fillText(text, CX, by + bh / 2 + 1);

  g.restore();
}

// =============================================================
// ESCENAS DE NARRATIVA VIRAL (30.5 Segundos)
// =============================================================

// -------------------------------------------------------------
// ESCENA 1: HOOK — ¿SCROLLEANDO EN LA CAMA? (0.0s – 5.2s)
// -------------------------------------------------------------
function drawScene1(g, t) {
  drawStudioBackground(g, 'tired', t);
  drawHeaderBadge(g, 'Rutina vs. Desconexión • 😴', '#7E7582');

  // CAPA 1: Personaje en reposo/agotado (DETRÁS DE LA TARJETA)
  drawCharacter(g, 'character_generico_1', CX, 1340, 1.25, Math.sin(t * 3) * 2, 0.95);

  // CAPA 2 & 3: Card Cansancio (POR ENCIMA DEL PERSONAJE)
  const sCard = easeOutBack(clamp(t * 1.5, 0, 1));
  g.save();
  g.translate(CX, 440);
  g.scale(sCard, sCard);

  const cw = 880, ch = 380;
  g.fillStyle = '#FFFFFF';
  g.shadowColor = 'rgba(45, 36, 46, 0.12)';
  g.shadowBlur = 36;
  g.shadowOffsetY = 14;
  roundRect(g, -cw/2, -ch/2, cw, ch, 36);
  g.fill();
  g.shadowColor = 'transparent';

  // Badge Estado
  g.fillStyle = '#FFF1F2';
  roundRect(g, -cw/2 + 36, -ch/2 + 34, 310, 48, 24);
  g.fill();
  g.fillStyle = '#E11D48';
  g.font = '800 20px -apple-system, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'alphabetic';
  g.fillText('🛌 MODO SCROLL INFINITO', -cw/2 + 191, -ch/2 + 64);

  // Batería baja
  g.fillStyle = '#EF4444';
  g.font = '700 20px -apple-system, sans-serif';
  g.textAlign = 'right';
  g.fillText('Batería: 12% 🪫', cw/2 - 40, -ch/2 + 64);

  // Gran Texto
  g.fillStyle = '#2D242E';
  g.font = '900 40px -apple-system, sans-serif';
  g.textAlign = 'center';
  g.fillText('¿Terminar el día scrolleando', 0, -25);
  g.fillText('en la cama hasta dormirte?', 0, 25);

  g.fillStyle = '#7E7582';
  g.font = '600 24px -apple-system, sans-serif';
  g.fillText('Horas frente a la pantalla sin descansar de verdad 🥱', 0, 85);

  // Barra de scroll animada
  g.fillStyle = '#F1EFF2';
  roundRect(g, -cw/2 + 40, ch/2 - 50, cw - 80, 16, 8);
  g.fill();
  const scrollW = ((t * 180) % (cw - 80));
  g.fillStyle = '#E06385';
  roundRect(g, -cw/2 + 40, ch/2 - 50, scrollW, 16, 8);
  g.fill();

  g.restore();

  // CAPA 4: Subtítulos Safe Zone
  drawSubtitleSafeZone(g, '¿Quién te dijo que para desconectar tenías que quedarte scrolleando?');
}

// -------------------------------------------------------------
// ESCENA 2: AGITATE — SALIR QUEMADA DEL LABURO/FACU A LAS 18 HS (5.2s – 11.2s)
// -------------------------------------------------------------
function drawScene2(g, t) {
  drawStudioBackground(g, 'office', t);
  drawHeaderBadge(g, '18:00 hs • Salida de la facu / oficina 🏢', '#D81B60');

  // CAPA 1: Personaje sosteniendo mochila/cansado (DETRÁS DE LA TARJETA)
  const bob = Math.sin(t * 4) * 4;
  drawCharacter(g, 'character_generico_2', CX, 1340, 1.25, bob, 0.95);

  // CAPA 2 & 3: Tarjeta Agotamiento (POR ENCIMA DEL PERSONAJE)
  const dt = t - 5.2;
  const sCard = easeOutBack(clamp(dt * 1.6, 0, 1));

  g.save();
  g.translate(CX, 440);
  g.scale(sCard, sCard);

  const cw = 880, ch = 400;
  g.fillStyle = '#FFFFFF';
  g.shadowColor = 'rgba(45, 36, 46, 0.15)';
  g.shadowBlur = 36;
  roundRect(g, -cw/2, -ch/2, cw, ch, 36);
  g.fill();

  // Reloj 18:00
  g.fillStyle = '#FFF0F5';
  roundRect(g, -cw/2 + 40, -ch/2 + 35, 260, 50, 25);
  g.fill();
  g.fillStyle = '#E06385';
  g.font = '800 24px -apple-system, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'alphabetic';
  g.fillText('⏰ 18:00 HS EN PUNTO', -cw/2 + 170, -ch/2 + 67);

  // Mails sin leer
  g.fillStyle = '#F3F4F6';
  roundRect(g, cw/2 - 290, -ch/2 + 35, 250, 50, 25);
  g.fill();
  g.fillStyle = '#6B7280';
  g.font = '700 20px -apple-system, sans-serif';
  g.fillText('✉️ 140 Mails sin leer', cw/2 - 165, -ch/2 + 67);

  // Titular
  g.fillStyle = '#2D242E';
  g.font = '900 42px -apple-system, sans-serif';
  g.fillText('La cabeza en mil revoluciones', 0, -20);
  g.fillText('y cero energía en el cuerpo...', 0, 32);

  // Medidor de batería social
  g.fillStyle = '#8E7D88';
  g.font = '700 22px -apple-system, sans-serif';
  g.fillText('Batería social: [■□□□□] 0% 🪫', 0, 92);

  g.fillStyle = '#EF4444';
  g.font = '800 24px -apple-system, sans-serif';
  g.fillText('¡Tu mente necesita desconexión real YA!', 0, 140);

  g.restore();

  // CAPA 4: Subtítulos Safe Zone
  drawSubtitleSafeZone(g, 'Salís quemada de la facu o del laburo a las 6 de la tarde...');
}

// -------------------------------------------------------------
// ESCENA 3: REFRAME — 19:00 HS ¡TERAPIA DE ENDORFINAS EN BAILAPP! (11.2s – 16.5s)
// -------------------------------------------------------------
function drawScene3(g, t) {
  drawStudioBackground(g, 'party', t);
  drawHeaderBadge(g, '19:00 hs • Inyección de Endorfinas ✨', '#E06385');

  // CAPA 1: Dos bailarinas rompiéndola con el nuevo rig Humaaans (DETRÁS DEL BANNER)
  const bounce1 = Math.sin(t * 12) * 16;
  const rot1 = Math.sin(t * 8) * 5;
  drawCharacter(g, 'character_dancehall', CX - 220, 1340 + bounce1, 1.25, rot1, 1.0);

  const bounce2 = Math.cos(t * 12) * 16;
  const rot2 = -Math.sin(t * 8) * 5;
  drawCharacter(g, 'character_kpop', CX + 220, 1340 + bounce2, 1.22, rot2, 1.0);

  // CAPA 2 & 3: Big Energy Banner (POR ENCIMA DE LOS PERSONAJES)
  const dt = t - 11.2;
  const sTop = easeOutBack(clamp(dt * 1.8, 0, 1));

  g.save();
  g.translate(CX, 340);
  g.scale(sTop, sTop);

  const bw = 900, bh = 220;
  g.fillStyle = '#FFFFFF';
  g.shadowColor = 'rgba(224, 99, 133, 0.35)';
  g.shadowBlur = 40;
  g.shadowOffsetY = 14;
  roundRect(g, -bw/2, -bh/2, bw, bh, 36);
  g.fill();
  g.shadowColor = 'transparent';

  g.strokeStyle = '#FAD2E1';
  g.lineWidth = 3;
  g.stroke();

  g.fillStyle = '#E06385';
  g.font = '900 32px -apple-system, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'alphabetic';
  g.fillText('⚡ ¡19:00 HS: CLASE DE BAILE CON AMIGAS!', 0, -45);

  // Chips de disciplinas
  const chips = [
    { label: 'Dancehall 🇯🇲', col: '#FEF08A', tc: '#854D0E', x: -270 },
    { label: 'Twerk 🔥', col: '#FCE7F3', tc: '#9D174D', x: 0 },
    { label: 'Commercial 🪩', col: '#E0E7FF', tc: '#3730A3', x: 270 }
  ];

  chips.forEach(c => {
    g.fillStyle = c.col;
    roundRect(g, c.x - 120, 0, 240, 52, 26);
    g.fill();
    g.fillStyle = c.tc;
    g.font = '800 22px -apple-system, sans-serif';
    g.fillText(c.label, c.x, 32);
  });

  g.fillStyle = '#6B7280';
  g.font = '600 20px -apple-system, sans-serif';
  g.fillText('Cero exigencia • 100% desconexión mental', 0, 78);

  g.restore();

  // CAPA 4: Subtítulos Safe Zone
  drawSubtitleSafeZone(g, '¡A las 19 hs entrás a tu clase de Dancehall, Twerk o Commercial!');
}

// -------------------------------------------------------------
// ESCENA 4: REFRAME — EL BEAT, LAS AMIGAS Y CERO ESTRÉS (16.5s – 21.5s)
// -------------------------------------------------------------
function drawScene4(g, t) {
  drawStudioBackground(g, 'party', t);
  drawHeaderBadge(g, 'El Baile Sana • ✨🪩', '#D81B60');

  // CAPA 1: Bailarinas juntas disfrutando con alta energía (DETRÁS DEL BANNER)
  const beatHop = Math.abs(Math.sin(t * 10)) * 25;
  drawCharacter(g, 'character_dancehall', CX - 220, 1340 - beatHop, 1.25, Math.sin(t * 10) * 4, 1.0);
  drawCharacter(g, 'character_bachata', CX + 220, 1340 - beatHop, 1.25, -Math.sin(t * 10) * 4, 1.0);

  // CAPA 2 & 3: Medidor de Endorfinas Explodiendo (POR ENCIMA DE LOS PERSONAJES)
  const dt = t - 16.5;
  g.save();
  g.translate(CX, 340);

  const mw = 900, mh = 220;
  g.fillStyle = '#FFFFFF';
  g.shadowColor = 'rgba(216, 27, 96, 0.3)';
  g.shadowBlur = 36;
  roundRect(g, -mw/2, -mh/2, mw, mh, 36);
  g.fill();
  g.shadowColor = 'transparent';

  g.fillStyle = '#D81B60';
  g.font = '900 32px -apple-system, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'alphabetic';
  g.fillText('🔥 ESTRÉS: 0%  •  ENDORFINAS: 1000% 🚀', 0, -42);

  // Barra de carga de energía
  g.fillStyle = '#FFF0F5';
  roundRect(g, -mw/2 + 40, -5, mw - 80, 36, 18);
  g.fill();

  const prog = clamp(dt * 0.7 + 0.35, 0, 1);
  const fillGrad = g.createLinearGradient(-mw/2 + 40, 0, mw/2 - 40, 0);
  fillGrad.addColorStop(0, '#E06385');
  fillGrad.addColorStop(1, '#D81B60');
  g.fillStyle = fillGrad;
  roundRect(g, -mw/2 + 40, -5, (mw - 80) * prog, 36, 18);
  g.fill();

  g.fillStyle = '#2D242E';
  g.font = '800 22px -apple-system, sans-serif';
  g.fillText('Suena el tema, cantás a los gritos y te reseteás la mente 💃✨', 0, 68);

  g.restore();

  // CAPA 4: Subtítulos Safe Zone
  drawSubtitleSafeZone(g, 'Suena el beat con amigas y el estrés desaparece en un toque.');
}

// -------------------------------------------------------------
// ESCENA 5: ACTION — FILTRÁ POR HORARIO EN BAILAPP (21.5s – 26.5s)
// -------------------------------------------------------------
function drawScene5(g, t) {
  drawStudioBackground(g, 'party', t);
  drawHeaderBadge(g, 'Encontrá tu clase en Bailapp • 📱', '#E06385');

  const dt = t - 21.5;
  const sPhone = easeOutBack(clamp(dt * 1.6, 0, 1));

  g.save();
  g.translate(CX, 620);
  g.scale(sPhone, sPhone);

  const pw = 700, ph = 840;
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

  // App Bar
  g.fillStyle = '#FFF5F8';
  roundRect(g, -pw/2 + 16, -ph/2 + 16, pw - 32, 100, 30);
  g.fill();

  g.fillStyle = '#E06385';
  g.font = '900 32px -apple-system, sans-serif';
  g.textAlign = 'left';
  g.fillText('Bailapp ✨', -pw/2 + 45, -ph/2 + 65);

  g.fillStyle = '#8E7D88';
  g.font = '700 18px -apple-system, sans-serif';
  g.fillText('Filtro: Clases de 18:00 a 21:00 hs', -pw/2 + 45, -ph/2 + 96);

  // Cards de clases disponibles
  const classes = [
    { title: 'Dancehall Principiantes', time: 'Hoy 19:00 hs', studio: 'Groove Dance Studio', tag: 'CUPOS DISPONIBLES 🔥' },
    { title: 'Twerk Flow & Coreo', time: 'Hoy 19:30 hs', studio: 'Vibra Dance Centro', tag: 'ÚLTIMOS 3 LUGARES' },
    { title: 'Commercial Pop Girls', time: 'Hoy 20:00 hs', studio: 'Urban Academy', tag: 'DESDE CERO' }
  ];

  classes.forEach((c, idx) => {
    const cy = -ph/2 + 140 + idx * 175;
    g.fillStyle = idx === 0 ? '#FFF5F8' : '#FAF8FA';
    roundRect(g, -pw/2 + 30, cy, pw - 60, 155, 24);
    g.fill();

    g.strokeStyle = idx === 0 ? '#E06385' : '#EAE6E8';
    g.lineWidth = idx === 0 ? 3 : 1.5;
    g.stroke();

    g.fillStyle = '#2D242E';
    g.font = '800 24px -apple-system, sans-serif';
    g.textAlign = 'left';
    g.fillText(c.title, -pw/2 + 55, cy + 42);

    g.fillStyle = '#8E7D88';
    g.font = '600 18px -apple-system, sans-serif';
    g.fillText(`⏰ ${c.time} • 📍 ${c.studio}`, -pw/2 + 55, cy + 78);

    // Botón Reservar
    g.fillStyle = '#E06385';
    roundRect(g, pw/2 - 220, cy + 96, 170, 44, 22);
    g.fill();
    g.fillStyle = '#FFFFFF';
    g.font = '800 18px -apple-system, sans-serif';
    g.textAlign = 'center';
    g.fillText('RESERVAR', pw/2 - 135, cy + 124);

    // Badge de cupo
    g.fillStyle = idx === 0 ? '#D81B60' : '#4B5563';
    g.font = '800 16px -apple-system, sans-serif';
    g.textAlign = 'left';
    g.fillText(c.tag, -pw/2 + 55, cy + 124);
  });

  // Botón Confirmar Selección
  const btnPulse = 1.0 + Math.sin(t * 6) * 0.03;
  g.save();
  g.translate(0, ph/2 - 70);
  g.scale(btnPulse, btnPulse);
  g.fillStyle = '#D81B60';
  g.shadowColor = 'rgba(216, 27, 96, 0.4)';
  g.shadowBlur = 24;
  roundRect(g, -pw/2 + 40, -32, pw - 80, 64, 32);
  g.fill();
  g.shadowColor = 'transparent';

  g.fillStyle = '#FFFFFF';
  g.font = '900 24px -apple-system, sans-serif';
  g.textAlign = 'center';
  g.fillText('Elegir tu clase hoy en Bailapp ⚡', 0, 8);
  g.restore();

  g.restore();

  drawSubtitleSafeZone(g, 'Buscá tu estudio más cercano, filtrá por horario y reservá tu clase.');
}

// -------------------------------------------------------------
// ESCENA 6: FINAL CTA — ENTRÁ A BAILAPP.COM.AR (26.5s – 30.5s)
// -------------------------------------------------------------
function drawScene6(g, t) {
  drawStudioBackground(g, 'party', t);
  drawHeaderBadge(g, 'Tu momento de desconexión ✨', '#E06385');

  // CAPA 1: Trío de bailarinas celebrando (DETRÁS DE LA TARJETA)
  const danceBob = Math.sin(t * 10) * 12;
  drawCharacter(g, 'character_kpop', CX - 280, 1320 - danceBob, 1.15, Math.sin(t * 6) * 5, 0.95);
  drawCharacter(g, 'character_dancehall', CX, 1320 + danceBob, 1.18, 0, 1.0);
  drawCharacter(g, 'character_bachata', CX + 280, 1320 - danceBob, 1.15, -Math.sin(t * 6) * 5, 0.95);

  const dt = t - 26.5;
  const sCta = easeOutBack(clamp(dt * 1.6, 0, 1));

  // CAPA 2 & 3: Gran Tarjeta de Conversión (POR ENCIMA DE LOS PERSONAJES)
  g.save();
  g.translate(CX, 460);
  g.scale(sCta, sCta);

  const cw = 880, ch = 520;
  g.fillStyle = '#FFFFFF';
  g.shadowColor = 'rgba(224, 99, 133, 0.45)';
  g.shadowBlur = 54;
  g.shadowOffsetY = 18;
  roundRect(g, -cw/2, -ch/2, cw, ch, 44);
  g.fill();
  g.shadowColor = 'transparent';

  g.strokeStyle = '#FAD2E1';
  g.lineWidth = 4;
  g.stroke();

  // Logo Bailapp
  g.fillStyle = '#E06385';
  g.font = '900 56px -apple-system, sans-serif';
  g.textAlign = 'center';
  g.fillText('Bailapp ✨', 0, -170);

  g.fillStyle = '#2D242E';
  g.font = '900 38px -apple-system, sans-serif';
  g.fillText('El antídoto al estrés', 0, -100);
  g.fillText('está en la pista de baile', 0, -50);

  g.fillStyle = '#8E7D88';
  g.font = '600 24px -apple-system, sans-serif';
  g.fillText('Encontrá los mejores estudios y disciplinas', 0, 10);
  g.fillText('de tu ciudad en un solo lugar', 0, 48);

  // BOTÓN OFICIAL CON DOMINIO BAILAPP.COM.AR
  const btnPulse = 1.0 + Math.sin(t * 8) * 0.04;
  g.save();
  g.translate(0, 150);
  g.scale(btnPulse, btnPulse);

  g.fillStyle = '#D81B60';
  g.shadowColor = 'rgba(216, 27, 96, 0.55)';
  g.shadowBlur = 32;
  g.shadowOffsetY = 10;
  roundRect(g, -360, -50, 720, 100, 50);
  g.fill();
  g.shadowColor = 'transparent';

  // Shimmer
  const shimX = ((t * 600) % 1100) - 550;
  const sGrad = g.createLinearGradient(shimX - 100, 0, shimX + 100, 0);
  sGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  sGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.45)');
  sGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  g.fillStyle = sGrad;
  roundRect(g, -360, -50, 720, 100, 50);
  g.fill();

  g.fillStyle = '#FFFFFF';
  g.font = '900 40px -apple-system, sans-serif';
  g.textAlign = 'center';
  g.fillText('👉 bailapp.com.ar 👈', 0, 14);
  g.restore();

  g.fillStyle = '#E06385';
  g.font = '800 22px -apple-system, sans-serif';
  g.fillText('Link directo en la bio • Cupos limitados', 0, 235);

  g.restore();

  // CAPA 4: Subtítulos Safe Zone
  drawSubtitleSafeZone(g, 'Entrá a bailapp.com.ar • Link en bio.');
}

// -------------------------------------------------------------
// MAIN RENDER LOOP / EXPORT PARA VIDEO.MJS
// -------------------------------------------------------------
window.DUR = 30.5;

window.render = async (t) => {
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, W, H);

  if (t < 5.2) {
    drawScene1(g, t);
  } else if (t < 11.2) {
    drawScene2(g, t);
  } else if (t < 16.5) {
    drawScene3(g, t);
  } else if (t < 21.5) {
    drawScene4(g, t);
  } else if (t < 26.5) {
    drawScene5(g, t);
  } else {
    drawScene6(g, t);
  }
};

window.READY = true;
console.log('Bailapp Terapia de Endorfinas Reel Engine Listo! Duración:', window.DUR);

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
  if (!stageContainer) return;
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
  if (!timeSlider || !timeDisplay) return;
  timeSlider.value = currentTime;
  const mins = Math.floor(currentTime / 60).toString().padStart(2, '0');
  const secs = Math.floor(currentTime % 60).toString().padStart(2, '0');
  timeDisplay.innerText = `${mins}:${secs} / 00:30`;
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
  if (btnPlay) btnPlay.innerText = '⏸ Pausar';
  if (isAudioEnabled) {
    bgAudio.currentTime = currentTime;
    bgAudio.playbackRate = playbackSpeed;
    bgAudio.play().catch(() => {});
  }
  requestAnimationFrame(tick);
}

function pause() {
  isPlaying = false;
  if (btnPlay) btnPlay.innerText = '▶ Reproducir';
  bgAudio.pause();
}

if (btnPlay) {
  btnPlay.addEventListener('click', () => {
    if (isPlaying) pause();
    else {
      if (currentTime >= window.DUR) currentTime = 0;
      play();
    }
  });
}

if (btnRestart) {
  btnRestart.addEventListener('click', () => {
    currentTime = 0;
    updateDisplay();
    play();
  });
}

if (timeSlider) {
  timeSlider.addEventListener('input', (e) => {
    pause();
    currentTime = parseFloat(e.target.value);
    updateDisplay();
    window.render(currentTime);
  });
}

const speeds = [1.0, 1.5, 2.0, 0.5];
let speedIdx = 0;
if (btnSpeed) {
  btnSpeed.addEventListener('click', () => {
    speedIdx = (speedIdx + 1) % speeds.length;
    playbackSpeed = speeds[speedIdx];
    btnSpeed.innerText = `${playbackSpeed.toFixed(1)}x`;
    bgAudio.playbackRate = playbackSpeed;
  });
}

if (btnSound) {
  btnSound.addEventListener('click', () => {
    isAudioEnabled = !isAudioEnabled;
    btnSound.innerText = isAudioEnabled ? '🔊 Sonido ON' : '🔇 Sonido OFF';
    if (!isAudioEnabled) bgAudio.pause();
    else if (isPlaying) {
      bgAudio.currentTime = currentTime;
      bgAudio.play().catch(() => {});
    }
  });
}

window.render(0);

