import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play, Pause, RotateCcw, Download, Volume2, VolumeX, Sparkles, Code,
  Video, Layers, Mic, Settings, Check, Copy, ChevronRight, AlertTriangle,
  Zap, TrendingUp, ShoppingBag, MessageCircle, RefreshCw, Sliders, ShieldCheck,
  CheckCircle2, Flame, ArrowRight, Smartphone
} from 'lucide-react';

/**
 * ============================================================================
 * AGENCIA ARLIA — VIDEO PUBLICITARIO OFICIAL (1080x1920 • 9:16 VERTICAL)
 * ============================================================================
 * Estética: Limpia, prestigiosa, dark luxury 2D con ingeniería de video viral.
 * - Fondo: Obsidiana a Azul Noche profundo con grilla técnica sutil.
 * - Líneas cinéticas: Splines bezier continuos con nodos luminosos y estelas.
 * - Smartphone 2D: Mockup de titanio con reflejo de cristal y Dynamic Island.
 * - 5 Actos de Retención:
 *    1. Fuga de Capital (-30% Comisiones)
 *    2. WhatsApp Caos (Burbujas en cascada + Alerta de cancelación)
 *    3. Solución (Catálogo Gourmet Web + Comanda Directa en 1 Clic)
 *    4. Impacto Rentabilidad (0% Comisión + 100% Margen Neto)
 *    5. Cierre de Prestigio (Insignia Orbital Agencia Arlia + CTA Demo)
 * ============================================================================
 */

export interface AgenciaArliaProps {
  voiceOverUrl?: string;
  autoPlay?: boolean;
}

// Math & Motion Easing Functions
const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutQuad = (t: number) => t * (2 - t);
const easeOutBack = (t: number, s = 1.70158) => (t = t - 1) * t * ((s + 1) * t + s) + 1;
const easeOutElastic = (t: number) => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number | { tl?: number; tr?: number; br?: number; bl?: number }
) {
  let r = { tl: 0, tr: 0, br: 0, bl: 0 };
  if (typeof radius === 'number') {
    r = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    r = Object.assign(r, radius);
  }
  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + width - r.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r.tr);
  ctx.lineTo(x + width, y + height - r.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r.br, y + height);
  ctx.lineTo(x + r.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r.bl);
  ctx.lineTo(x, y + r.tl);
  ctx.quadraticCurveTo(x, y, x + r.tl, y);
  ctx.closePath();
}

// Continuous Kinetic Vector Splines with Traveling Glowing Nodes
const SPLINES = [
  { baseX: 160, amp: 45, freq: 0.003, speed: 1.2, width: 1.5, color: 'rgba(56, 189, 248, 0.25)', dotColor: '#38BDF8', dotSpeed: 0.08, dotOffset: 0.1 },
  { baseX: 320, amp: 60, freq: 0.0025, speed: 0.9, width: 2.0, color: 'rgba(37, 99, 235, 0.35)', dotColor: '#60A5FA', dotSpeed: 0.06, dotOffset: 0.45 },
  { baseX: 480, amp: 35, freq: 0.004, speed: 1.5, width: 1.2, color: 'rgba(56, 189, 248, 0.20)', dotColor: '#38BDF8', dotSpeed: 0.11, dotOffset: 0.75 },
  { baseX: 600, amp: 50, freq: 0.0035, speed: 1.1, width: 1.8, color: 'rgba(16, 185, 129, 0.30)', dotColor: '#34D399', dotSpeed: 0.07, dotOffset: 0.25 },
  { baseX: 760, amp: 65, freq: 0.0028, speed: 0.8, width: 2.0, color: 'rgba(37, 99, 235, 0.30)', dotColor: '#60A5FA', dotSpeed: 0.09, dotOffset: 0.60 },
  { baseX: 920, amp: 40, freq: 0.0032, speed: 1.3, width: 1.5, color: 'rgba(56, 189, 248, 0.22)', dotColor: '#38BDF8', dotSpeed: 0.08, dotOffset: 0.90 }
];

export const AgenciaArliaVideo: React.FC<AgenciaArliaProps> = ({
  voiceOverUrl = 'audio/mix.wav',
  autoPlay = false
}) => {
  const TOTAL_FRAMES = 1200; // 20.0s @ 60fps
  const FPS = 60;
  const CANVAS_W = 1080;
  const CANVAS_H = 1920;
  const CX = CANVAS_W / 2;
  const CY = CANVAS_H / 2;

  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [activeTab, setActiveTab] = useState<'studio' | 'remotion'>('studio');
  const [audioMuted, setAudioMuted] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scenes = [
    { id: 1, name: 'Acto 1: Fuga de Comisiones', start: 0, end: 228, color: '#EF4444', label: '0.0s - 3.8s' },
    { id: 2, name: 'Acto 2: Caos en WhatsApp', start: 228, end: 420, color: '#F59E0B', label: '3.8s - 7.0s' },
    { id: 3, name: 'Acto 3: Web Propia + Comanda', start: 420, end: 684, color: '#2563EB', label: '7.0s - 11.4s' },
    { id: 4, name: 'Acto 4: 0% Comisión & 100% Margen', start: 684, end: 948, color: '#10B981', label: '11.4s - 15.8s' },
    { id: 5, name: 'Acto 5: Agencia Arlia Demo', start: 948, end: 1200, color: '#8B5CF6', label: '15.8s - 20.0s' }
  ];

  const fullVoiceScript =
    "¿Seguís regalando hasta el treinta por ciento en comisiones? ¿O perdiendo ventas por contestar tarde en WhatsApp? Pasate a tu propia web: catálogo automático y comanda directa a tu WhatsApp. Cero por ciento de comisión. Todo el margen queda en tu negocio. Agencia Arlia. Agendá tu demo hoy.";

  // Smartphone Dimensions
  const PHONE = { w: 780, h: 1180, r: 54, screenR: 42, bezel: 14 };

  const drawSmartphone = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale = 1,
    tiltDeg = 0,
    screenRenderer?: (g: CanvasRenderingContext2D, sx: number, sy: number, sw: number, sh: number) => void
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.rotate((tiltDeg * Math.PI) / 180);

    const hw = PHONE.w / 2;
    const hh = PHONE.h / 2;

    // Ambient Shadow
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 60;
    ctx.shadowOffsetY = 35;
    roundRect(ctx, -hw, -hh, PHONE.w, PHONE.h, PHONE.r);
    ctx.fill();
    ctx.restore();

    // Titanium Rim
    const titaniumGrad = ctx.createLinearGradient(-hw, -hh, hw, hh);
    titaniumGrad.addColorStop(0, '#2D3748');
    titaniumGrad.addColorStop(0.5, '#1A202C');
    titaniumGrad.addColorStop(1, '#0F172A');
    ctx.fillStyle = titaniumGrad;
    roundRect(ctx, -hw, -hh, PHONE.w, PHONE.h, PHONE.r);
    ctx.fill();

    // Metallic Highlight Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 2.5;
    roundRect(ctx, -hw, -hh, PHONE.w, PHONE.h, PHONE.r);
    ctx.stroke();

    const sw = PHONE.w - PHONE.bezel * 2;
    const sh = PHONE.h - PHONE.bezel * 2;
    const sx = -sw / 2;
    const sy = -sh / 2;

    // Screen Mask
    ctx.fillStyle = '#06090F';
    roundRect(ctx, sx, sy, sw, sh, PHONE.screenR);
    ctx.fill();

    ctx.save();
    roundRect(ctx, sx, sy, sw, sh, PHONE.screenR);
    ctx.clip();

    if (screenRenderer) {
      screenRenderer(ctx, sx, sy, sw, sh);
    }

    // Specular Glass Sheen
    const sheenGrad = ctx.createLinearGradient(sx, sy, sx + sw * 1.2, sy + sh);
    sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
    sheenGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.03)');
    sheenGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sheenGrad;
    ctx.fillRect(sx, sy, sw, sh);
    ctx.restore();

    // Dynamic Island
    const diW = 140, diH = 34, diX = -diW / 2, diY = sy + 16;
    ctx.fillStyle = '#000000';
    roundRect(ctx, diX, diY, diW, diH, 17);
    ctx.fill();

    ctx.fillStyle = '#0D1117';
    ctx.beginPath();
    ctx.arc(diX + 32, diY + diH / 2, 6.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(diX + diW - 32, diY + diH / 2, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const renderCaption = (ctx: CanvasRenderingContext2D, text: string) => {
    const subY = 1680, pillW = 960, pillH = 130, pillX = (CANVAS_W - pillW) / 2;
    ctx.save();
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
      ctx.fillStyle = '#F8FAFC';
      ctx.fillText(words.slice(0, mid).join(' '), CX, subY + 45);
      ctx.fillStyle = '#38BDF8';
      ctx.fillText(words.slice(mid).join(' '), CX, subY + 88);
    } else {
      ctx.fillStyle = '#F8FAFC';
      ctx.fillText(text, CX, subY + pillH / 2);
    }
    ctx.restore();
  };

  const drawMasterFrame = (ctx: CanvasRenderingContext2D, frame: number) => {
    const t = frame / FPS;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // 1. Prestigious Background
    const bgGrad = ctx.createRadialGradient(CX, CY - 200, 150, CX, CY, 1250);
    bgGrad.addColorStop(0, '#0C1630');
    bgGrad.addColorStop(0.45, '#070D1E');
    bgGrad.addColorStop(1, '#03050A');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Architectural Grid
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= CANVAS_W; x += 90) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_H); ctx.stroke();
    }
    for (let y = 0; y <= CANVAS_H; y += 90) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke();
    }
    ctx.restore();

    // Splines & Moving Nodes
    SPLINES.forEach((sp, idx) => {
      ctx.save();
      ctx.lineWidth = sp.width;
      ctx.strokeStyle = sp.color;

      const points = [];
      const steps = 40;
      const dy = CANVAS_H / steps;
      for (let i = 0; i <= steps; i++) {
        const y = i * dy;
        const x = sp.baseX + Math.sin(y * sp.freq + t * sp.speed + idx) * sp.amp + Math.cos(y * 0.0015 - t * 0.5) * (sp.amp * 0.4);
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

      const halo = ctx.createRadialGradient(nodeX, nodeY, 2, nodeX, nodeY, 24);
      halo.addColorStop(0, sp.dotColor);
      halo.addColorStop(0.4, sp.dotColor + '55');
      halo.addColorStop(1, sp.dotColor + '00');
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(nodeX, nodeY, 24, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = sp.dotColor;
      ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(nodeX, nodeY, 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
    });

    // Top Header Badge
    ctx.save();
    const bw = 380, bh = 58, bx = CX - bw / 2, by = 80;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, bx, by, bw, bh, 29);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#10B981';
    ctx.shadowColor = '#10B981'; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(bx + 32, by + bh / 2, 6, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 20px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText('AGENCIA ARLIA', bx + 52, by + bh / 2 - 1);
    ctx.fillStyle = '#38BDF8';
    ctx.font = '700 13px "Inter", monospace';
    ctx.fillText('• SISTEMA WEB', bx + 225, by + bh / 2);
    ctx.restore();

    // -------------------------------------------------------------
    // ACT 1: HOOK 1 (0.0s - 3.8s) — Fuga de Capital / Comisiones
    // -------------------------------------------------------------
    if (t < 3.8) {
      const enter = clamp(t / 0.6, 0, 1);
      const pillY = lerp(-100, 240, easeOutBack(enter));
      ctx.save();
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2.5;
      roundRect(ctx, CX - 270, pillY, 540, 68, 34);
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = '#EF4444';
      ctx.font = '900 24px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('⚠️ ALERTA DE PÉRDIDA EN TU LOCAL', CX, pillY + 34);
      ctx.restore();

      const card1Prog = clamp((t - 0.4) / 0.7, 0, 1);
      const card1Y = lerp(1200, 440, easeOutBack(card1Prog));
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = 'rgba(239, 68, 68, 0.45)';
      ctx.shadowBlur = 35;
      roundRect(ctx, CX - 440, card1Y, 880, 290, 32);
      ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;

      ctx.fillStyle = '#94A3B8'; ctx.font = '700 30px "Inter", sans-serif';
      ctx.textAlign = 'left'; ctx.fillText('Comisión cobrada por Apps de Delivery:', CX - 380, card1Y + 75);
      ctx.fillStyle = '#EF4444'; ctx.font = '900 102px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('-30% PERDIDO', CX - 380, card1Y + 195);
      ctx.restore();

      if (t > 1.2) {
        const card2Prog = clamp((t - 1.2) / 0.6, 0, 1);
        const card2Y = lerp(1300, 780, easeOutBack(card2Prog));
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.lineWidth = 3;
        roundRect(ctx, CX - 440, card2Y, 880, 240, 28);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = '#94A3B8'; ctx.font = '700 28px "Inter", sans-serif';
        ctx.textAlign = 'left'; ctx.fillText('Pérdida mensual promedio estimada:', CX - 380, card2Y + 68);
        ctx.fillStyle = '#FFFFFF'; ctx.font = '900 80px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('-$450.000 / mes', CX - 380, card2Y + 170);
        ctx.restore();
      }

      renderCaption(ctx, '¿Seguís regalando hasta el 30% en comisiones?');
    }

    // -------------------------------------------------------------
    // ACT 2: HOOK 2 (3.8s - 7.0s) — Caos en WhatsApp / Smartphone
    // -------------------------------------------------------------
    else if (t >= 3.8 && t < 7.0) {
      const localT = t - 3.8;
      const enterProg = clamp(localT / 0.7, 0, 1);
      const phoneY = lerp(1600, 820, easeOutBack(enterProg));
      const tilt = Math.sin(localT * 1.5) * 1.2;

      drawSmartphone(ctx, CX, phoneY, 1.0, tilt, (g, sx, sy, sw, sh) => {
        g.fillStyle = '#0F1E29';
        g.fillRect(sx, sy, sw, 130);

        g.fillStyle = '#25D366';
        g.beginPath(); g.arc(sx + 75, sy + 70, 30, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#FFFFFF'; g.font = '900 28px sans-serif';
        g.textAlign = 'center'; g.fillText('🍔', sx + 75, sy + 78);

        g.fillStyle = '#FFFFFF'; g.font = '800 28px "Plus Jakarta Sans", sans-serif';
        g.textAlign = 'left'; g.fillText('WhatsApp Pedidos Local', sx + 125, sy + 62);
        g.fillStyle = '#22C55E'; g.font = '600 20px "Inter", sans-serif';
        g.fillText('🟢 En línea • 14 chats pendientes', sx + 125, sy + 95);

        g.fillStyle = '#080E14';
        g.fillRect(sx, sy + 130, sw, sh - 130);

        const chats = [
          { text: 'Hola! ¿Tienen stock de la Doble Bacon?', delay: 0.3, type: 'user' },
          { text: '¿Cuánto demora el envío hasta Belgrano?', delay: 0.9, type: 'user' },
          { text: '¿Me pasan el menú actualizado con precios?', delay: 1.6, type: 'user' },
          { text: '❌ Cancelame, tardaron 40 min en responder.', delay: 2.2, type: 'danger' }
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
              g.fill(); g.stroke();
              g.fillStyle = '#FCA5A5'; g.font = '800 26px "Plus Jakarta Sans", sans-serif';
              g.textAlign = 'left'; g.fillText(chat.text, 30, 72);
            } else {
              g.fillStyle = '#1F2C34'; g.strokeStyle = '#2A3942'; g.lineWidth = 1.5;
              roundRect(g, 0, 0, sw - 120, 120, 20);
              g.fill(); g.stroke();
              g.fillStyle = '#E9EDEF'; g.font = '600 26px "Inter", sans-serif';
              g.textAlign = 'left'; g.fillText(chat.text, 30, 68);
            }
            g.restore();
          }
        });

        if (localT > 2.0) {
          const pulse = 1 + Math.sin(t * 12) * 0.05;
          g.save();
          g.translate(0, sy + sh - 110);
          g.scale(pulse, pulse);
          g.fillStyle = '#EF4444';
          g.shadowColor = 'rgba(239, 68, 68, 0.8)'; g.shadowBlur = 30;
          roundRect(g, -240, -45, 480, 90, 45);
          g.fill(); g.shadowBlur = 0;
          g.fillStyle = '#FFFFFF'; g.font = '900 28px "Plus Jakarta Sans", sans-serif';
          g.textAlign = 'center'; g.textBaseline = 'middle';
          g.fillText('🔥 14 CHATS SIN RESPONDER', 0, 0);
          g.restore();
        }
      });

      renderCaption(ctx, '¿O perdiendo ventas por contestar tarde en WhatsApp?');
    }

    // -------------------------------------------------------------
    // ACT 3: SOLUTION (7.0s - 11.4s) — Web Propia + Catálogo + Comanda
    // -------------------------------------------------------------
    else if (t >= 7.0 && t < 11.4) {
      const localT = t - 7.0;
      const tilt = Math.sin(localT * 1.2) * 0.8;

      drawSmartphone(ctx, CX, 820, 1.04, tilt, (g, sx, sy, sw, sh) => {
        if (localT < 3.0) {
          g.fillStyle = '#0F172A';
          g.fillRect(sx, sy, sw, 150);

          g.fillStyle = '#38BDF8'; g.font = '900 32px "Plus Jakarta Sans", sans-serif';
          g.textAlign = 'left'; g.fillText('BURGER KINGDOM 🍔', sx + 40, sy + 75);

          g.fillStyle = '#10B981'; g.font = '600 22px "Inter", sans-serif';
          g.fillText('🟢 Abierto • Entrega 30 min • Agencia Arlia Web', sx + 40, sy + 115);

          const products = [
            { name: 'Doble Smash Bacon Burger', price: '$8.500', desc: 'Carne premium, bacon, cheddar', emoji: '🍔', added: localT > 0.8 },
            { name: 'Papas Rústicas Trufadas', price: '$3.200', desc: 'Aceite de trufa, parmesano', emoji: '🍟', added: localT > 1.7 },
            { name: 'Bebida Artesanal 500ml', price: '$2.100', desc: 'Limonada menta & jengibre', emoji: '🥤', added: false }
          ];

          products.forEach((prod, i) => {
            const cardY = sy + 180 + i * 220;
            g.fillStyle = '#161F30'; g.strokeStyle = '#26344A'; g.lineWidth = 2;
            roundRect(g, sx + 30, cardY, sw - 60, 195, 22);
            g.fill(); g.stroke();

            g.fillStyle = '#223046';
            roundRect(g, sx + 45, cardY + 22, 150, 150, 18);
            g.fill();
            g.font = '72px sans-serif'; g.textAlign = 'center';
            g.fillText(prod.emoji, sx + 120, cardY + 120);

            g.fillStyle = '#FFFFFF'; g.font = '800 26px "Plus Jakarta Sans", sans-serif';
            g.textAlign = 'left'; g.fillText(prod.name, sx + 215, cardY + 62);
            g.fillStyle = '#94A3B8'; g.font = '500 20px "Inter", sans-serif';
            g.fillText(prod.desc, sx + 215, cardY + 98);
            g.fillStyle = '#10B981'; g.font = '900 32px "Plus Jakarta Sans", sans-serif';
            g.fillText(prod.price, sx + 215, cardY + 148);

            const btnW = 150, btnH = 55, btnX = sx + sw - 200, btnY = cardY + 110;
            if (prod.added) {
              g.fillStyle = '#10B981';
              roundRect(g, btnX, btnY, btnW, btnH, 14);
              g.fill();
              g.fillStyle = '#FFFFFF'; g.font = '800 22px "Plus Jakarta Sans", sans-serif';
              g.textAlign = 'center'; g.fillText('✓ Listo', btnX + btnW / 2, btnY + 35);
            } else {
              g.fillStyle = '#2563EB';
              roundRect(g, btnX, btnY, btnW, btnH, 14);
              g.fill();
              g.fillStyle = '#FFFFFF'; g.font = '700 22px "Plus Jakarta Sans", sans-serif';
              g.textAlign = 'center'; g.fillText('+ Agregar', btnX + btnW / 2, btnY + 35);
            }
          });

          // Floating Cart Bar
          const cartY = sy + sh - 130;
          const itemCount = localT > 1.7 ? '2 items' : localT > 0.8 ? '1 item' : '0 items';
          const totalCost = localT > 1.7 ? '$11.700' : localT > 0.8 ? '$8.500' : '$0';
          g.fillStyle = '#10B981';
          roundRect(g, sx + 30, cartY, sw - 60, 95, 24);
          g.fill();
          g.fillStyle = '#FFFFFF'; g.font = '900 28px "Plus Jakarta Sans", sans-serif';
          g.textAlign = 'left'; g.fillText(`🛍️ Ver Pedido (${itemCount})`, sx + 60, cartY + 58);
          g.textAlign = 'right'; g.fillText(`${totalCost} ➔`, sx + sw - 60, cartY + 58);
        } else {
          // Instant WhatsApp Ticket
          const tickProg = clamp((localT - 3.0) / 0.5, 0, 1);
          const ticketY = lerp(sy + sh, sy + 40, easeOutBack(tickProg));
          g.fillStyle = '#0B131E'; g.fillRect(sx, sy, sw, sh);

          g.fillStyle = '#22C55E';
          roundRect(g, sx + 30, ticketY, sw - 60, 110, 22);
          g.fill();
          g.fillStyle = '#FFFFFF'; g.font = '900 28px "Plus Jakarta Sans", sans-serif';
          g.textAlign = 'center'; g.fillText('🟢 COMANDA ENVIADA A WHATSAPP', sx + sw / 2, ticketY + 65);

          const boxY = ticketY + 140;
          g.fillStyle = '#162032'; g.strokeStyle = '#2C3E5B'; g.lineWidth = 2.5;
          roundRect(g, sx + 40, boxY, sw - 80, 780, 26);
          g.fill(); g.stroke();

          g.fillStyle = '#38BDF8'; g.font = '800 26px "Inter", monospace';
          g.textAlign = 'left'; g.fillText('📋 TICKET AUTOMÁTICO #4092', sx + 75, boxY + 70);
          g.fillStyle = '#F8FAFC'; g.font = '700 26px "Inter", sans-serif';
          g.fillText('• 1x Doble Smash Bacon Burger', sx + 75, boxY + 210);
          g.fillText('• 1x Papas Rústicas Trufadas', sx + 75, boxY + 270);
          g.fillStyle = '#10B981'; g.font = '900 48px "Plus Jakarta Sans", sans-serif';
          g.fillText('TOTAL: $11.700', sx + 75, boxY + 420);
        }
      });

      renderCaption(ctx, 'Tu propia web: catálogo automático + comanda a WhatsApp');
    }

    // -------------------------------------------------------------
    // ACT 4: IMPACT (11.4s - 15.8s) — 0% Comisión & 100% Margen
    // -------------------------------------------------------------
    else if (t >= 11.4 && t < 15.8) {
      const localT = t - 11.4;
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
      ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;

      ctx.fillStyle = '#10B981';
      ctx.font = '900 120px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('0% COMISIÓN', 0, -20);
      ctx.fillStyle = '#FFFFFF'; ctx.font = '800 32px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('SIN INTERMEDIARIOS • PEDIDOS DIRECTOS', 0, 75);
      ctx.restore();

      const barProg = clamp((localT - 0.5) / 0.8, 0, 1);
      const barY = 880;

      // Apps de Delivery Bar
      ctx.save();
      ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
      roundRect(ctx, CX - 440, barY, 880, 120, 22);
      ctx.fill();
      ctx.fillStyle = '#EF4444';
      roundRect(ctx, CX - 440, barY, 616, 120, 22);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF'; ctx.font = '800 28px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText('Apps de Delivery (70% Margen • -30% Perdido)', CX - 410, barY + 60);
      ctx.restore();

      // Agencia Arlia Bar
      const arliaW = lerp(0, 880, easeOutQuad(barProg));
      ctx.save();
      ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
      roundRect(ctx, CX - 440, barY + 160, 880, 140, 26);
      ctx.fill();
      ctx.fillStyle = '#10B981';
      roundRect(ctx, CX - 440, barY + 160, arliaW, 140, 26);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF'; ctx.font = '900 34px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText('🚀 Tu Web con Agencia Arlia (100% MARGEN NETO)', CX - 410, barY + 230);
      ctx.restore();

      renderCaption(ctx, '0% de comisión por pedido. Todo el margen en tu negocio.');
    }

    // -------------------------------------------------------------
    // ACT 5: OUTRO & CTA (15.8s - 20.0s) — Insignia & Agendá tu Demo
    // -------------------------------------------------------------
    else {
      const localT = t - 15.8;
      const enterProg = clamp(localT / 0.7, 0, 1);
      const logoScale = easeOutBack(enterProg);
      const logoY = 620;

      ctx.save();
      ctx.translate(CX, logoY);

      // Orbital Rings
      ctx.save();
      ctx.rotate(localT * 0.25);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)'; ctx.lineWidth = 3;
      ctx.setLineDash([30, 20]);
      ctx.beginPath(); ctx.arc(0, 0, 240, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.rotate(-localT * 0.18);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)'; ctx.lineWidth = 2.5;
      ctx.setLineDash([50, 25]);
      ctx.beginPath(); ctx.arc(0, 0, 290, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();

      // Shield Crest
      ctx.scale(logoScale, logoScale);
      const shieldGrad = ctx.createLinearGradient(-150, -150, 150, 150);
      shieldGrad.addColorStop(0, '#2563EB');
      shieldGrad.addColorStop(1, '#10B981');
      ctx.fillStyle = '#0F172A';
      ctx.strokeStyle = shieldGrad; ctx.lineWidth = 6;
      ctx.shadowColor = 'rgba(37, 99, 235, 0.7)'; ctx.shadowBlur = 40;
      ctx.beginPath(); ctx.arc(0, 0, 180, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.shadowBlur = 0;

      // Stylized Wing Curves
      ctx.strokeStyle = '#38BDF8'; ctx.lineWidth = 6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-35, 30);
      ctx.bezierCurveTo(-110, -30, -130, -100, -50, -120);
      ctx.bezierCurveTo(-25, -80, -15, -40, -35, 30); ctx.stroke();

      ctx.beginPath(); ctx.moveTo(35, 30);
      ctx.bezierCurveTo(110, -30, 130, -100, 50, -120);
      ctx.bezierCurveTo(25, -80, 15, -40, 35, 30); ctx.stroke();

      ctx.fillStyle = '#10B981';
      ctx.beginPath(); ctx.moveTo(0, -135); ctx.lineTo(24, -70); ctx.lineTo(44, -10);
      ctx.lineTo(0, 65); ctx.lineTo(-44, -10); ctx.lineTo(-24, -70); ctx.closePath(); ctx.fill();
      ctx.restore();

      // Brand Typography
      ctx.save();
      ctx.fillStyle = '#FFFFFF'; ctx.font = '900 86px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center'; ctx.fillText('AGENCIA ARLIA', CX, 1010);
      ctx.fillStyle = '#38BDF8'; ctx.font = '700 30px "Inter", sans-serif';
      ctx.fillText('DESARROLLO WEB & AUTOMATIZACIÓN', CX, 1075);
      ctx.restore();

      // CTA Button
      const ctaPulse = 1 + Math.sin(localT * 8) * 0.04;
      ctx.save();
      ctx.translate(CX, 1260); ctx.scale(ctaPulse, ctaPulse);
      const ctaGrad = ctx.createLinearGradient(-350, 0, 350, 0);
      ctaGrad.addColorStop(0, '#2563EB'); ctaGrad.addColorStop(1, '#10B981');
      ctx.fillStyle = ctaGrad; ctx.shadowColor = 'rgba(37, 99, 235, 0.85)'; ctx.shadowBlur = 40;
      roundRect(ctx, -350, -65, 700, 130, 65); ctx.fill(); ctx.shadowBlur = 0;

      ctx.fillStyle = '#FFFFFF'; ctx.font = '900 42px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('Agendá tu demo hoy 🚀', 0, 0);
      ctx.restore();

      // URL
      ctx.save();
      ctx.fillStyle = '#CBD5E1'; ctx.font = '700 32px "Inter", sans-serif';
      ctx.textAlign = 'center'; ctx.fillText('🌐 agenciaarlia.com', CX, 1420);
      ctx.restore();

      renderCaption(ctx, 'Agencia Arlia. Agendá tu demo hoy.');
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (isPlaying) {
      startTimeRef.current = performance.now() - (currentFrame / FPS) * 1000;
      const animate = (now: number) => {
        if (!startTimeRef.current) startTimeRef.current = now;
        const elapsed = (now - startTimeRef.current) / 1000;
        let nextFrame = Math.floor(elapsed * FPS);

        if (nextFrame >= TOTAL_FRAMES) {
          nextFrame = 0;
          startTimeRef.current = now;
          if (audioRef.current && !audioMuted) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
        }

        setCurrentFrame(nextFrame);
        drawMasterFrame(ctx, nextFrame);
        requestRef.current = requestAnimationFrame(animate);
      };
      requestRef.current = requestAnimationFrame(animate);

      if (audioRef.current && !audioMuted) {
        audioRef.current.play().catch(() => {});
      }
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      drawMasterFrame(ctx, currentFrame);
      if (audioRef.current) audioRef.current.pause();
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, currentFrame, audioMuted]);

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = parseInt(e.target.value, 10);
    setCurrentFrame(f);
    if (audioRef.current) audioRef.current.currentTime = f / FPS;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) drawMasterFrame(ctx, f);
    }
  };

  const handleExportWebM = async () => {
    setIsExporting(true);
    setIsPlaying(false);
    setExportProgress(0);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const stream = canvas.captureStream(FPS);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm',
      videoBitsPerSecond: 16000000
    });

    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'agencia-arlia-vertical-ad-1080p.webm';
      a.click();
      setIsExporting(false);
      setExportProgress(100);
    };

    mediaRecorder.start();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let f = 0;
    const interval = setInterval(() => {
      drawMasterFrame(ctx, f);
      f++;
      setExportProgress(Math.floor((f / TOTAL_FRAMES) * 100));
      if (f >= TOTAL_FRAMES) {
        clearInterval(interval);
        mediaRecorder.stop();
      }
    }, 1000 / FPS);
  };

  const remotionConfigCode = `// Root.tsx — Remotion 1080x1920 24/60fps Configuration for Agencia Arlia
import { Composition } from 'remotion';
import { AgenciaArliaVideo } from './AgenciaArliaVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AgenciaArliaAd"
      component={AgenciaArliaVideo}
      durationInFrames={1200} // 20.0s @ 60fps (or 480 @ 24fps)
      fps={60}
      width={1080}
      height={1920}
      defaultProps={{
        voiceOverUrl: 'audio/mix.wav'
      }}
    />
  );
};

// Render command via CLI:
// npx remotion render AgenciaArliaAd out/agencia-arlia-final.mp4 --codec=h264
`;

  const copyCode = () => {
    navigator.clipboard.writeText(remotionConfigCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const currentScene = scenes.find((s) => currentFrame >= s.start && currentFrame < s.end) || scenes[0];

  return (
    <div className="flex flex-col h-screen bg-[#030509] text-slate-100 font-sans select-none overflow-hidden">
      {/* Audio Element */}
      <audio ref={audioRef} src={voiceOverUrl} preload="auto" />

      {/* HEADER */}
      <header className="h-16 border-b border-slate-800 bg-[#070B13] px-6 flex items-center justify-between z-20">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-blue-500/20">
            A
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight text-white">AGENCIA ARLIA</span>
              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2 py-0.5 rounded-full font-semibold">
                1080x1920 • 60FPS Prestige Studio
              </span>
            </div>
            <p className="text-xs text-slate-400">Video Publicitario 2D de Alta Conversión</p>
          </div>
        </div>

        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'studio' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Studio Canvas</span>
          </button>
          <button
            onClick={() => setActiveTab('remotion')}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'remotion' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Remotion Root (.tsx)</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportWebM}
            disabled={isExporting}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
            <span>{isExporting ? `Exportando (${exportProgress}%)` : 'Exportar Video 1080p'}</span>
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'studio' ? (
          <>
            <aside className="w-80 border-r border-slate-800 bg-[#060910] p-5 flex flex-col space-y-5 overflow-y-auto">
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-slate-200">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold">Acto Activo ({currentScene.id}/5)</span>
                </div>
                <div className="text-sm font-extrabold text-white">{currentScene.name}</div>
                <div className="text-xs text-blue-400 font-mono">{currentScene.label}</div>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-200">Guión de Locución Oficial:</span>
                <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  "{fullVoiceScript}"
                </p>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-200">Especificaciones:</span>
                <ul className="text-xs text-slate-400 space-y-1.5 font-mono">
                  <li className="flex justify-between"><span>Resolución:</span><span className="text-slate-200">1080 x 1920 (9:16)</span></li>
                  <li className="flex justify-between"><span>Duración:</span><span className="text-slate-200">20.0s (1200 frames)</span></li>
                  <li className="flex justify-between"><span>Voz:</span><span className="text-slate-200">es-AR-TomasNeural</span></li>
                  <li className="flex justify-between"><span>Loudness:</span><span className="text-slate-200">-14.0 LUFS</span></li>
                </ul>
              </div>
            </aside>

            <main className="flex-1 bg-[#020408] flex items-center justify-center p-4 relative overflow-hidden">
              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-black flex items-center justify-center"
                style={{ height: 'calc(100vh - 180px)', aspectRatio: '9 / 16' }}
              >
                <canvas
                  ref={canvasRef}
                  width={CANVAS_W}
                  height={CANVAS_H}
                  className="w-full h-full object-contain"
                />

                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-mono font-bold text-slate-200 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>FRAME {currentFrame} / {TOTAL_FRAMES}</span>
                  <span>({(currentFrame / FPS).toFixed(2)}s)</span>
                </div>
              </div>
            </main>
          </>
        ) : (
          <div className="flex-1 bg-[#03060C] p-8 overflow-y-auto font-mono text-xs text-slate-300">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div>
                  <h3 className="font-bold text-sm text-white">Remotion Configuration & CLI Script</h3>
                  <p className="text-slate-400 text-xs">Pega este archivo en tu proyecto de Remotion para renderizado automatizado por terminal.</p>
                </div>
                <button
                  onClick={copyCode}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-sans font-bold text-xs transition-all"
                >
                  {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? '¡Copiado!' : 'Copiar Código (.tsx)'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 p-6 rounded-2xl border border-slate-800 overflow-x-auto text-emerald-400 leading-relaxed">
                {remotionConfigCode}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER TIMELINE */}
      <footer className="h-24 border-t border-slate-800 bg-[#070B13] px-6 flex flex-col justify-center space-y-2 z-20">
        <div className="relative h-2 w-full bg-slate-900 rounded-full overflow-hidden flex">
          {scenes.map((s) => (
            <div
              key={s.id}
              style={{ width: `${((s.end - s.start) / TOTAL_FRAMES) * 100}%`, backgroundColor: s.color }}
              className="h-full opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              title={s.name}
              onClick={() => {
                setCurrentFrame(s.start);
                if (audioRef.current) audioRef.current.currentTime = s.start / FPS;
              }}
            />
          ))}
        </div>

        <div className="flex items-center justify-between space-x-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 transition-all"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <button
              onClick={() => {
                setCurrentFrame(0);
                setIsPlaying(false);
                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                  audioRef.current.pause();
                }
              }}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setAudioMuted(!audioMuted)}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all"
            >
              {audioMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>

          <div className="flex-1 flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max={TOTAL_FRAMES}
              value={currentFrame}
              onChange={handleScrub}
              className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="font-mono text-xs font-bold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            {Math.floor(currentFrame / FPS).toString().padStart(2, '0')}:
            {((currentFrame % FPS) * (1000 / FPS / 10)).toFixed(0).padStart(2, '0')} / 00:20.00
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AgenciaArliaVideo;
