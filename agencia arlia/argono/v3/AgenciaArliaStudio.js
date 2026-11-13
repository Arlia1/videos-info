import React, { useState, useEffect, useRef } from 'react';

const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOutBack = (t, s = 1.70158) => (t = t - 1) * t * ((s + 1) * t + s) + 1;

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
}

export default function AgenciaArliaStudio() {
  const FPS = 60;
  const CANVAS_W = 1080;
  const CANVAS_H = 1920;
  const CX = CANVAS_W / 2;
  const CY = CANVAS_H / 2;

  const [currentFrame] = useState(0);
  const canvasRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = 'logo_cutout.png';
    img.onload = () => {
      logoRef.current = img;
      const canvas = canvasRef.current;
      if (canvas) drawFrame(canvas.getContext('2d'), currentFrame);
    };
  }, []);

  const drawFrame = (ctx, frame) => {
    const t = frame / FPS;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    const bgGrad = ctx.createRadialGradient(CX, CY - 200, 150, CX, CY, 1250);
    bgGrad.addColorStop(0, '#0C1630');
    bgGrad.addColorStop(0.45, '#070D1E');
    bgGrad.addColorStop(1, '#03050A');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    const cardW = 880;
    const cardPad = 55;
    const maxTextW = cardW - cardPad * 2;
    const card1Prog = clamp((t - 0.35) / 0.7, 0, 1);
    const card1Y = lerp(1200, 440, easeOutBack(card1Prog));

    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
    ctx.lineWidth = 3.5;
    roundRect(ctx, CX - cardW / 2, card1Y, cardW, 290, 32);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#94A3B8';
    ctx.textAlign = 'left';
    fitText(ctx, 'Frenar el trabajo en el elevador por teléfono:', CX - cardW / 2 + cardPad, card1Y + 78, maxTextW, 28, '700', '"Inter", sans-serif');
    ctx.fillStyle = '#EF4444';
    fitText(ctx, '+2 HS PERDIDAS / DÍA', CX - cardW / 2 + cardPad, card1Y + 195, maxTextW, 74, '900');
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawFrame(canvas.getContext('2d'), currentFrame);
  }, [currentFrame]);

  return (
    <div className="flex flex-col h-screen bg-[#030509] text-slate-100 font-sans select-none overflow-hidden items-center justify-center p-4">
      <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="h-full object-contain rounded-2xl border border-slate-800" />
    </div>
  );
}