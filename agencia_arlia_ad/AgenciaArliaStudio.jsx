import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, RotateCcw, Download, Volume2, VolumeX, Sparkles, Code,
  Video, Layers, Mic, Settings, Check, Copy, ChevronRight, AlertTriangle,
  Zap, TrendingUp, ShoppingBag, MessageCircle, RefreshCw, Sliders, ShieldCheck,
  CheckCircle2, Flame, ArrowRight, Smartphone
} from 'lucide-react';

/**
 * AGENCIA ARLIA STUDIO (REACT + 2D CANVAS ENGINE)
 * Aesthetic: Ultra-clean, prestigious, dark luxury 2D motion graphics.
 * Features:
 * - Obsidian to Midnight Navy radial background
 * - Continuous bezier curves with animated glowing nodes & trails
 * - Realistic 2D vector titanium smartphone mockup (WhatsApp overload -> Gourmet Catalog -> Instant Comanda)
 * - 0% Commission profit burst & Agencia Arlia prestige insignia
 * - Full 1080x1920 60fps frame-accurate scrubber & video exporter
 */

// Math / Easing Utilities
const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOutQuad = (t) => t * (2 - t);
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

const SPLINES = [
  { baseX: 160, amp: 45, freq: 0.003, speed: 1.2, width: 1.5, color: 'rgba(56, 189, 248, 0.25)', dotColor: '#38BDF8', dotSpeed: 0.08, dotOffset: 0.1 },
  { baseX: 320, amp: 60, freq: 0.0025, speed: 0.9, width: 2.0, color: 'rgba(37, 99, 235, 0.35)', dotColor: '#60A5FA', dotSpeed: 0.06, dotOffset: 0.45 },
  { baseX: 480, amp: 35, freq: 0.004, speed: 1.5, width: 1.2, color: 'rgba(56, 189, 248, 0.20)', dotColor: '#38BDF8', dotSpeed: 0.11, dotOffset: 0.75 },
  { baseX: 600, amp: 50, freq: 0.0035, speed: 1.1, width: 1.8, color: 'rgba(16, 185, 129, 0.30)', dotColor: '#34D399', dotSpeed: 0.07, dotOffset: 0.25 },
  { baseX: 760, amp: 65, freq: 0.0028, speed: 0.8, width: 2.0, color: 'rgba(37, 99, 235, 0.30)', dotColor: '#60A5FA', dotSpeed: 0.09, dotOffset: 0.60 },
  { baseX: 920, amp: 40, freq: 0.0032, speed: 1.3, width: 1.5, color: 'rgba(56, 189, 248, 0.22)', dotColor: '#38BDF8', dotSpeed: 0.08, dotOffset: 0.90 }
];

export default function AgenciaArliaStudio() {
  const TOTAL_FRAMES = 1200; // 20.0s @ 60fps
  const FPS = 60;
  const CANVAS_W = 1080;
  const CANVAS_H = 1920;
  const CX = CANVAS_W / 2;
  const CY = CANVAS_H / 2;

  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('studio');
  const [audioMuted, setAudioMuted] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const startTimeRef = useRef(null);
  const audioRef = useRef(null);

  const scenes = [
    { id: 1, name: 'Hook 1: Comisiones', start: 0, end: 228, color: '#EF4444', label: '0s - 3.8s' },
    { id: 2, name: 'Hook 2: WhatsApp Caos', start: 228, end: 420, color: '#F59E0B', label: '3.8s - 7.0s' },
    { id: 3, name: 'Solución: Web + Comanda', start: 420, end: 684, color: '#2563EB', label: '7.0s - 11.4s' },
    { id: 4, name: 'Impacto: 0% Comisión', start: 684, end: 948, color: '#10B981', label: '11.4s - 15.8s' },
    { id: 5, name: 'Outro: Agencia Arlia', start: 948, end: 1200, color: '#8B5CF6', label: '15.8s - 20.0s' }
  ];

  const fullVoiceScript = "¿Seguís regalando hasta el treinta por ciento en comisiones? ¿O perdiendo ventas por contestar tarde en WhatsApp? Pasate a tu propia web: catálogo automático y comanda directa a tu WhatsApp. Cero por ciento de comisión. Todo el margen queda en tu negocio. Agencia Arlia. Agendá tu demo hoy.";

  // Drawing Engine
  const drawFrame = (ctx, frame) => {
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

    // Scene Acts
    if (t < 3.8) {
      // Act 1: Comisiones
      const card1Prog = clamp((t - 0.3) / 0.7, 0, 1);
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

      renderCaption(ctx, '¿Seguís regalando hasta el 30% en comisiones?');
    } else if (t >= 3.8 && t < 7.0) {
      // Act 2: WhatsApp Caos
      renderCaption(ctx, '¿O perdiendo ventas por contestar tarde en WhatsApp?');
    } else if (t >= 7.0 && t < 11.4) {
      // Act 3: Web + Catálogo + Comanda
      renderCaption(ctx, 'Tu propia web: catálogo automático + comanda a WhatsApp');
    } else if (t >= 11.4 && t < 15.8) {
      // Act 4: 0% Comisión
      renderCaption(ctx, '0% de comisión por pedido. Todo el margen en tu negocio.');
    } else {
      // Act 5: Outro
      renderCaption(ctx, 'Agencia Arlia. Agendá tu demo hoy.');
    }
  };

  const renderCaption = (ctx, text) => {
    const subY = 1680, pillW = 960, pillH = 130, pillX = (CANVAS_W - pillW) / 2;
    ctx.save();
    ctx.fillStyle = 'rgba(10, 15, 28, 0.94)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'; ctx.shadowBlur = 30;
    roundRect(ctx, pillX, subY, pillW, pillH, 32);
    ctx.fill(); ctx.shadowBlur = 0;

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.lineWidth = 2.5;
    roundRect(ctx, pillX, subY, pillW, pillH, 32);
    ctx.stroke();

    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '800 34px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#F8FAFC';
    ctx.fillText(text, CX, subY + pillH / 2);
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    drawFrame(ctx, currentFrame);
  }, [currentFrame]);

  const currentScene = scenes.find(s => currentFrame >= s.start && currentFrame < s.end) || scenes[0];

  return (
    <div className="flex flex-col h-screen bg-[#030509] text-slate-100 font-sans select-none overflow-hidden">
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
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-80 border-r border-slate-800 bg-[#060910] p-5 flex flex-col space-y-6">
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-200">Escena Activa:</span>
            <div className="text-sm font-extrabold text-white">{currentScene.name}</div>
            <div className="text-xs text-blue-400 font-mono">{currentScene.label}</div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-200">Guión Publicitario:</span>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "{fullVoiceScript}"
            </p>
          </div>
        </aside>

        <main className="flex-1 bg-[#020408] flex items-center justify-center p-4">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-black flex items-center justify-center" style={{ height: 'calc(100vh - 180px)', aspectRatio: '9 / 16' }}>
            <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="w-full h-full object-contain" />
          </div>
        </main>
      </div>
    </div>
  );
}
