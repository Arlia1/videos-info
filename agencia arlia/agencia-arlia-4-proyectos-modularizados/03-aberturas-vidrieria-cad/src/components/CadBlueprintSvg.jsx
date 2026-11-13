import React from 'react';

export default function CadBlueprintSvg({ widthCm, heightCm, leaves, seriesName }) {
  const maxDim = Math.max(widthCm, heightCm, 100);
  const scale = 240 / maxDim;
  const drawW = Math.max(80, Math.round(widthCm * scale));
  const drawH = Math.max(80, Math.round(heightCm * scale));
  const startX = (340 - drawW) / 2;
  const startY = (300 - drawH) / 2;

  return (
    <div className="bg-[#0B0E14] border border-zinc-800 p-4 flex flex-col items-center">
      <div className="w-full flex justify-between font-mono text-[10px] text-zinc-400 mb-2">
        <span>ESCALA VECTORIAL DINÁMICA // CAD-2D</span>
        <span className="text-[#C8A97E]">{seriesName}</span>
      </div>
      <svg viewBox="0 0 340 300" className="w-full max-w-[360px] h-auto">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#182030" strokeWidth="0.7" />
          </pattern>
        </defs>
        <rect width="340" height="300" fill="url(#grid)" />

        {/* Marco Exterior */}
        <rect
          x={startX}
          y={startY}
          width={drawW}
          height={drawH}
          fill="#101824"
          stroke="#C8A97E"
          strokeWidth="4"
        />

        {/* Hojas Divisorias */}
        {Array.from({ length: leaves }).map((_, idx) => {
          const leafW = drawW / leaves;
          const lx = startX + idx * leafW;
          return (
            <g key={idx}>
              <rect
                x={lx + 4}
                y={startY + 4}
                width={leafW - 8}
                height={drawH - 8}
                fill="rgba(56, 189, 248, 0.08)"
                stroke="#94A3B8"
                strokeWidth="1.5"
              />
              {/* Flecha de apertura o reflejo */}
              <line
                x1={lx + 14}
                y1={startY + drawH - 16}
                x2={lx + leafW - 14}
                y2={startY + 16}
                stroke="rgba(200, 169, 126, 0.35)"
                strokeDasharray="4 2"
              />
            </g>
          );
        })}

        {/* Cota Horizontal */}
        <line x1={startX} y1={startY + drawH + 18} x2={startX + drawW} y2={startY + drawH + 18} stroke="#C8A97E" strokeWidth="1" />
        <text x={startX + drawW / 2} y={startY + drawH + 30} textAnchor="middle" fill="#C8A97E" fontSize="10" fontFamily="monospace">
          ANCHO: {widthCm * 10} mm ({widthCm} cm)
        </text>

        {/* Cota Vertical */}
        <text
          x={startX - 12}
          y={startY + drawH / 2}
          textAnchor="middle"
          fill="#C8A97E"
          fontSize="10"
          fontFamily="monospace"
          transform={`rotate(-90, ${startX - 12}, ${startY + drawH / 2})`}
        >
          ALTO: {heightCm * 10} mm
        </text>
      </svg>
    </div>
  );
}
