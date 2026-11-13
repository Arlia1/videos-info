import React, { useState } from 'react';
import { Wrench, Calendar, CheckCircle2, ArrowUpRight, Clock, Shield } from 'lucide-react';
import { VEHICLE_SEGMENTS, PART_TIERS } from '../data/workshopData';
import { useQuoteCalculator } from '../hooks/useQuoteCalculator';
import { buildWorkshopQuoteWhatsApp } from '../services/whatsapp.service';

export default function QuoteAndScheduler({ services, laborHourRate, orders, setOrders }) {
  const [selectedServiceIds, setSelectedServiceIds] = useState(['srv-1']);
  const [segmentId, setSegmentId] = useState('city');
  const [tierId, setTierId] = useState('first');
  const [plate, setPlate] = useState('AF 720 KM');
  const [vehicleModel, setVehicleModel] = useState('VW Taos Highline 250 TSI');
  const [slot, setSlot] = useState({ date: '2026-11-16', time: '09:00', bay: 'Box 1 (Elevador 4T)' });

  const quote = useQuoteCalculator({
    selectedServiceIds,
    services,
    segmentId,
    tierId,
    laborHourRate
  });

  const toggleService = id => {
    setSelectedServiceIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBookOrder = () => {
    if (quote.chosen.length === 0) return;
    const newOrder = {
      id: 'ord-' + Date.now(),
      plate: plate.toUpperCase(),
      model: vehicleModel,
      bay: slot.bay,
      status: 'Turno Confirmado',
      total: quote.grandTotal,
      time: slot.time
    };
    setOrders([newOrder, ...orders]);
    window.open(buildWorkshopQuoteWhatsApp({ plate, vehicleModel, quote, slot }), '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Configurador Técnico */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-zinc-900/60 border border-zinc-800 p-6">
          <span className="font-mono text-xs text-amber-500 uppercase tracking-widest">
            Paso 01 // Parámetros del Vehículo
          </span>
          <h2 className="text-xl font-bold text-white mt-1 mb-4">Identificación de Unidad y Segmento</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-mono text-xs text-zinc-400 mb-1">PATENTE MERCOSUR</label>
              <input
                type="text"
                value={plate}
                onChange={e => setPlate(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 font-mono text-sm uppercase text-amber-400"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-zinc-400 mb-1">MARCA / MODELO / MOTORIZACIÓN</label>
              <input
                type="text"
                value={vehicleModel}
                onChange={e => setVehicleModel(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm text-white"
              />
            </div>
          </div>

          <label className="block font-mono text-xs text-zinc-400 mb-2">COMPLEJIDAD MECÁNICA POR SEGMENTO</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {VEHICLE_SEGMENTS.map(seg => (
              <button
                key={seg.id}
                onClick={() => setSegmentId(seg.id)}
                className={`p-3 text-left border text-xs transition flex justify-between items-center ${
                  segmentId === seg.id
                    ? 'border-amber-500 bg-amber-500/10 text-white'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <span>{seg.name}</span>
                <span className="font-mono text-amber-400">x{seg.multiplier}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selección de Intervenciones */}
        <div className="bg-zinc-900/60 border border-zinc-800 p-6">
          <span className="font-mono text-xs text-amber-500 uppercase tracking-widest">
            Paso 02 // Intervenciones Mecánicas
          </span>
          <h2 className="text-xl font-bold text-white mt-1 mb-4">Catálogo de Operaciones Tarifadas</h2>
          <div className="space-y-2.5">
            {services.map(srv => {
              const active = selectedServiceIds.includes(srv.id);
              return (
                <div
                  key={srv.id}
                  onClick={() => toggleService(srv.id)}
                  className={`p-4 border cursor-pointer transition flex items-center justify-between ${
                    active ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className={`w-5 h-5 ${active ? 'text-amber-500' : 'text-zinc-700'}`} />
                    <div>
                      <span className="font-mono text-[11px] text-amber-400 block">{srv.code} • {srv.category}</span>
                      <span className="text-sm font-medium text-white">{srv.name}</span>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <span className="text-zinc-400 block">{srv.hours} hs MO</span>
                    <span className="text-white">Base Rep: ${srv.basePartsArs.toLocaleString('es-AR')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calidad de Repuestos y Agenda */}
        <div className="bg-zinc-900/60 border border-zinc-800 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="font-mono text-xs text-amber-500 uppercase">Paso 03 // Grado de Repuestos</span>
            <div className="mt-3 space-y-2">
              {PART_TIERS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTierId(t.id)}
                  className={`w-full p-3 text-left border text-xs ${
                    tierId === t.id ? 'border-amber-500 bg-amber-500/10 text-white' : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                  }`}
                >
                  <div className="font-semibold">{t.name}</div>
                  <div className="font-mono text-[11px] text-zinc-400">Garantía escrita: {t.warranty}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="font-mono text-xs text-amber-500 uppercase">Paso 04 // Reserva de Elevador (Box)</span>
            <div className="mt-3 space-y-3">
              <input
                type="date"
                value={slot.date}
                onChange={e => setSlot({ ...slot, date: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs font-mono text-white"
              />
              <select
                value={slot.time}
                onChange={e => setSlot({ ...slot, time: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs font-mono text-white"
              >
                <option value="08:30">08:30 hs (Apertura Técnica)</option>
                <option value="10:30">10:30 hs (Media Mañana)</option>
                <option value="14:00">14:00 hs (Turno Tarde)</option>
              </select>
              <select
                value={slot.bay}
                onChange={e => setSlot({ ...slot, bay: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs font-mono text-white"
              >
                <option value="Box 1 (Elevador 4T)">Box 1 (Elevador 4 Columnas)</option>
                <option value="Box 2 (Tren Delantero)">Box 2 (Alineadora 3D & Frenos)</option>
                <option value="Box 3 (Diagnóstico Electrónico)">Box 3 (Laboratorio Inyección)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen Liquidación Técnica */}
      <div className="lg:col-span-1">
        <div className="bg-zinc-900 border border-amber-500/40 p-6 sticky top-24">
          <div className="border-b border-zinc-800 pb-4 mb-4">
            <span className="font-mono text-[11px] text-amber-500 uppercase tracking-widest">
              Liquidación Técnica Precisa
            </span>
            <h3 className="text-xl font-bold text-white mt-1">{vehicleModel}</h3>
            <span className="inline-block mt-1 px-2 py-0.5 bg-zinc-950 border border-zinc-700 font-mono text-xs text-amber-400">
              DOMINIO: {plate}
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono border-b border-zinc-800 pb-4 mb-4">
            <div className="flex justify-between text-zinc-400">
              <span>Valor Hora Hombre Taller:</span>
              <span className="text-white">${laborHourRate.toLocaleString('es-AR')}/h</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-500" /> Tiempo Estimado:</span>
              <span className="text-white">{quote.totalHours} hs</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Mano de Obra Total:</span>
              <span className="text-white tabular-nums">${quote.laborTotal.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Repuestos ({quote.tier.id.toUpperCase()}):</span>
              <span className="text-white tabular-nums">${quote.partsTotal.toLocaleString('es-AR')}</span>
            </div>
          </div>

          <div className="mb-6">
            <span className="font-mono text-xs text-zinc-400 block">PRESUPUESTO FINAL LLAVE EN MANO</span>
            <span className="font-mono text-3xl font-bold text-amber-400 tabular-nums">
              ${quote.grandTotal.toLocaleString('es-AR')} ARS
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono mt-2">
              <Shield className="w-3.5 h-3.5" /> Garantía: {quote.tier.warranty}
            </div>
          </div>

          <button
            onClick={handleBookOrder}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition"
          >
            Confirmar Turno y Enviar WhatsApp <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
