import React, { useState, useMemo } from 'react';
import { Compass, Layers, Plus, Trash2, ArrowUpRight, AlertTriangle } from 'lucide-react';
import { INITIAL_SERIES, INITIAL_GLASSES, FINISHES } from './data/carpentryCatalog';
import CadBlueprintSvg from './components/CadBlueprintSvg';
import { buildPliegoWhatsAppUrl } from './services/whatsapp.service';

export default function App() {
  const [seriesList, setSeriesList] = useState(INITIAL_SERIES);
  const [glassList, setGlassList] = useState(INITIAL_GLASSES);
  const [tab, setTab] = useState('configurator');

  const [widthCm, setWidthCm] = useState(200);
  const [heightCm, setHeightCm] = useState(210);
  const [leaves, setLeaves] = useState(2);
  const [seriesId, setSeriesId] = useState('a30');
  const [glassId, setGlassId] = useState('dvh_solar');
  const [finishId, setFinishId] = useState('negro');
  const [qty, setQty] = useState(1);

  const [pliego, setPliego] = useState([]);

  const calc = useMemo(() => {
    const serie = seriesList.find(s => s.id === seriesId) || seriesList[0];
    const glass = glassList.find(g => g.id === glassId) || glassList[0];
    const finish = FINISHES.find(f => f.id === finishId) || FINISHES[0];

    const areaM2 = (widthCm / 100) * (heightCm / 100);
    const perimeterMl = ((widthCm + heightCm) * 2) / 100 + leaves * (heightCm / 100);

    const aluminumCost = perimeterMl * serie.pricePerMl * (1 + finish.surchargePct / 100);
    const glassCost = areaM2 * glass.pricePerM2;
    const unitPrice = Math.round(aluminumCost + glassCost);
    const subtotal = unitPrice * qty;
    const structuralWarning = heightCm > serie.maxHeightCm;

    return {
      serie,
      glass,
      finish,
      areaM2: Number(areaM2.toFixed(2)),
      perimeterMl: Number(perimeterMl.toFixed(2)),
      unitPrice,
      subtotal,
      structuralWarning
    };
  }, [widthCm, heightCm, leaves, seriesId, glassId, finishId, qty, seriesList, glassList]);

  const addToPliego = () => {
    setPliego([
      ...pliego,
      {
        id: 'vano-' + Date.now(),
        widthCm,
        heightCm,
        leaves,
        seriesName: calc.serie.name,
        glassName: calc.glass.name,
        qty,
        subtotal: calc.subtotal
      }
    ]);
  };

  const grandTotal = pliego.reduce((acc, i) => acc + i.subtotal, 0);

  return (
    <div className="min-h-screen bg-[#0A0C0E] text-zinc-100">
      <header className="border-b border-zinc-800 bg-[#0E1116] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Compass className="w-6 h-6 text-[#C8A97E]" />
            <div>
              <span className="font-serif text-xl tracking-wider text-white block leading-none">
                ARLIA <span className="text-[#C8A97E] italic">Arquitectura en Aluminio</span>
              </span>
              <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                Cotizador Paramétrico CAD // DVH & Ruptura de Puente Térmico
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setTab('configurator')}
              className={`px-3 py-1.5 font-mono text-xs uppercase ${
                tab === 'configurator' ? 'bg-[#C8A97E] text-black font-bold' : 'text-zinc-400'
              }`}
            >
              Configurador CAD
            </button>
            <button
              onClick={() => setTab('admin')}
              className={`px-3 py-1.5 font-mono text-xs uppercase border border-zinc-700 ${
                tab === 'admin' ? 'bg-white text-black font-bold' : 'text-zinc-300'
              }`}
            >
              /admin Matriz Costos
            </button>
          </div>
        </div>
      </header>

      {tab === 'configurator' ? (
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controles Paramétricos */}
          <div className="lg:col-span-5 bg-zinc-900/50 border border-zinc-800 p-6 space-y-5">
            <h2 className="font-mono text-xs uppercase tracking-widest text-[#C8A97E]">
              Dimensionamiento de Vano (Milímetros / Cm)
            </h2>

            <div>
              <label className="block font-mono text-xs text-zinc-300 mb-1">
                ANCHO DE VANO: {widthCm} cm ({widthCm * 10} mm)
              </label>
              <input
                type="range"
                min="60"
                max="400"
                step="10"
                value={widthCm}
                onChange={e => setWidthCm(Number(e.target.value))}
                className="w-full accent-[#C8A97E]"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-zinc-300 mb-1">
                ALTO DE VANO: {heightCm} cm ({heightCm * 10} mm)
              </label>
              <input
                type="range"
                min="60"
                max="320"
                step="10"
                value={heightCm}
                onChange={e => setHeightCm(Number(e.target.value))}
                className="w-full accent-[#C8A97E]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-xs text-zinc-400 mb-1">CANTIDAD DE HOJAS</label>
                <select
                  value={leaves}
                  onChange={e => setLeaves(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white"
                >
                  <option value={1}>1 Paño / Oscilobatiente</option>
                  <option value={2}>2 Hojas Corredizas</option>
                  <option value={3}>3 Hojas Guía Triple</option>
                  <option value={4}>4 Hojas Encuentro Central</option>
                </select>
              </div>
              <div>
                <label className="block font-mono text-xs text-zinc-400 mb-1">UNIDADES IGUALES</label>
                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={e => setQty(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs text-zinc-400 mb-1">SERIE PERFILERÍA ALUMINIO</label>
              <select
                value={seriesId}
                onChange={e => setSeriesId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white"
              >
                {seriesList.map(s => (
                  <option key={s.id} value={s.id}>{s.name} (${s.pricePerMl.toLocaleString('es-AR')}/ml)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs text-zinc-400 mb-1">COMPOSICIÓN DE VIDRIO</label>
              <select
                value={glassId}
                onChange={e => setGlassId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white"
              >
                {glassList.map(g => (
                  <option key={g.id} value={g.id}>{g.name} (${g.pricePerM2.toLocaleString('es-AR')}/m²)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs text-zinc-400 mb-1">TRATAMIENTO SUPERFICIAL</label>
              <select
                value={finishId}
                onChange={e => setFinishId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white"
              >
                {FINISHES.map(f => (
                  <option key={f.id} value={f.id}>{f.name} (+{f.surchargePct}%)</option>
                ))}
              </select>
            </div>
          </div>

          {/* Plano CAD + Telemetría */}
          <div className="lg:col-span-7 space-y-6">
            <CadBlueprintSvg
              widthCm={widthCm}
              heightCm={heightCm}
              leaves={leaves}
              seriesName={calc.serie.name}
            />

            {calc.structuralWarning && (
              <div className="bg-amber-500/10 border border-amber-500/50 p-4 flex items-center gap-3 text-xs font-mono text-amber-300">
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
                <span>
                  ADVERTENCIA DE INGENIERÍA: La altura de {heightCm} cm supera el límite recomendado para {calc.serie.name} ({calc.serie.maxHeightCm} cm). Se sugiere migrar a A30 New o RPT-60.
                </span>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 font-mono text-xs">
              <div className="bg-zinc-900/60 border border-zinc-800 p-4">
                <span className="text-zinc-500 block">SUPERFICIE VIDRIADA</span>
                <span className="text-white text-lg font-bold">{calc.areaM2} m²</span>
              </div>
              <div className="bg-zinc-900/60 border border-zinc-800 p-4">
                <span className="text-zinc-500 block">ATENUACIÓN ACÚSTICA</span>
                <span className="text-emerald-400 text-lg font-bold">-{calc.serie.baseDb} dB</span>
              </div>
              <div className="bg-zinc-900/60 border border-zinc-800 p-4">
                <span className="text-zinc-500 block">TRANSMITANCIA (K)</span>
                <span className="text-sky-400 text-lg font-bold">{calc.glass.uValue} W/m²K</span>
              </div>
            </div>

            <div className="bg-zinc-900 border border-[#C8A97E]/50 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs text-zinc-400 block">
                  VALOR CALCULADO ({qty} UNID. • {calc.perimeterMl} ML ALUMINIO)
                </span>
                <span className="font-mono text-3xl font-bold text-[#C8A97E] tabular-nums">
                  ${calc.subtotal.toLocaleString('es-AR')} ARS
                </span>
              </div>
              <button
                onClick={addToPliego}
                className="px-6 py-3 bg-[#C8A97E] text-black font-mono text-xs uppercase font-bold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Agregar Vano al Pliego de Obra
              </button>
            </div>

            {/* Pliego Acumulado */}
            {pliego.length > 0 && (
              <div className="bg-zinc-900/40 border border-zinc-800 p-6">
                <h3 className="font-mono text-xs uppercase text-[#C8A97E] mb-4">
                  Pliego de Carpintería Acumulado ({pliego.length} posiciones)
                </h3>
                <div className="space-y-2 mb-4">
                  {pliego.map((item, idx) => (
                    <div key={item.id} className="flex justify-between items-center text-xs font-mono border-b border-zinc-800 pb-2">
                      <span>
                        V-{idx + 1}: {item.widthCm}x{item.heightCm}cm ({item.leaves}h) • {item.seriesName} x{item.qty}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-white">${item.subtotal.toLocaleString('es-AR')}</span>
                        <button
                          onClick={() => setPliego(pliego.filter(p => p.id !== item.id))}
                          className="text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-mono text-base font-bold text-white">
                    Total Pliego: ${grandTotal.toLocaleString('es-AR')} ARS
                  </span>
                  <a
                    href={buildPliegoWhatsAppUrl(pliego, grandTotal)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-emerald-500 text-black font-mono text-xs uppercase font-bold flex items-center gap-1.5"
                  >
                    Enviar Pliego a Ingeniería por WhatsApp <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6">
            <h2 className="font-mono text-sm uppercase text-[#C8A97E] mb-4">
              Matriz de Costos por Metro Lineal de Aluminio
            </h2>
            <div className="space-y-3">
              {seriesList.map((s, idx) => (
                <div key={s.id} className="flex justify-between items-center font-mono text-xs">
                  <span>{s.name}</span>
                  <input
                    type="number"
                    value={s.pricePerMl}
                    onChange={e => {
                      const updated = [...seriesList];
                      updated[idx].pricePerMl = Number(e.target.value);
                      setSeriesList(updated);
                    }}
                    className="bg-zinc-950 border border-zinc-700 px-3 py-1.5 text-[#C8A97E] w-36 text-right"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
