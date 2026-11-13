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

  const [currentFrame, setCurrentFrame] = useState(1020); // Previewing Act 5 with logo_cutout
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

    if (t >= 15.8) {
      const localT = t - 15.8;
      const enterProg = clamp(localT / 0.7, 0, 1);
      const logoScale = easeOutBack(enterProg);
      const logoY = 610;

      ctx.save();
      ctx.translate(CX, logoY);
      ctx.scale(logoScale, logoScale);

      if (logoRef.current && logoRef.current.naturalWidth > 0) {
        const maxBox = 400;
        const ratio = logoRef.current.naturalWidth / logoRef.current.naturalHeight;
        const drawW = ratio > 1 ? maxBox : maxBox * ratio;
        const drawH = ratio > 1 ? maxBox / ratio : maxBox;
        ctx.drawImage(logoRef.current, -drawW / 2, -drawH / 2, drawW, drawH);
      }
      ctx.restore();

      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      fitText(ctx, 'AGENCIA ARLIA', CX, 1040, 920, 86, '900');

      ctx.fillStyle = '#38BDF8';
      fitText(ctx, 'DESARROLLO WEB PARA INMOBILIARIAS', CX, 1105, 920, 30, '700', '"Inter", sans-serif');
    }
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