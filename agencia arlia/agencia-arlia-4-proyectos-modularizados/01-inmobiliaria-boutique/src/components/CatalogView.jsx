import React, { useState, useMemo } from 'react';
import { MapPin, Maximize2, BedDouble, Car, ArrowUpRight, Search } from 'lucide-react';
import { buildPropertyWhatsAppUrl } from '../services/whatsapp.service';

export default function CatalogView({ properties }) {
  const [operation, setOperation] = useState('Todas');
  const [zone, setZone] = useState('Todas');
  const [search, setSearch] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);

  const zones = useMemo(() => ['Todas', ...new Set(properties.map(p => p.zone))], [properties]);

  const filtered = useMemo(() => {
    return properties.filter(p => {
      const matchOp = operation === 'Todas' || p.operation === operation;
      const matchZone = zone === 'Todas' || p.zone === zone;
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.code.toLowerCase().includes(search.toLowerCase()) ||
                          p.address.toLowerCase().includes(search.toLowerCase());
      return matchOp && matchZone && matchSearch;
    });
  }, [properties, operation, zone, search]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Editorial Hero */}
      <div className="mb-12 border-b border-zinc-800 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#C8A97E] mb-3">
            Arquitectura Residencial & Activos Comerciales
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-white font-normal leading-tight">
            Curaduría Inmobiliaria en <span className="italic text-[#C8A97E]">Zona Sur</span>
          </h1>
        </div>
        <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
          Selección auditada de residencias de autor, semipisos y lotes estratégicos en Avellaneda, Quilmes y corredor sur.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-zinc-900/70 border border-zinc-800 p-4 mb-10">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Buscar por código (ARL-0104), calle o palabra clave..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 pl-10 pr-4 py-2.5 text-sm text-white focus:border-[#C8A97E] outline-none"
          />
        </div>
        <select
          value={operation}
          onChange={e => setOperation(e.target.value)}
          className="bg-zinc-950 border border-zinc-800 px-4 py-2.5 text-sm text-white focus:border-[#C8A97E] outline-none"
        >
          <option value="Todas">Operación: Todas</option>
          <option value="Venta">Venta</option>
          <option value="Alquiler">Alquiler</option>
          <option value="Pozo">Emprendimiento / Pozo</option>
        </select>
        <select
          value={zone}
          onChange={e => setZone(e.target.value)}
          className="bg-zinc-950 border border-zinc-800 px-4 py-2.5 text-sm text-white focus:border-[#C8A97E] outline-none"
        >
          {zones.map(z => (
            <option key={z} value={z}>Zona: {z}</option>
          ))}
        </select>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map(prop => (
          <article
            key={prop.id}
            className="group border border-zinc-800/90 bg-zinc-900/30 hover:border-[#C8A97E]/60 transition duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative h-72 overflow-hidden bg-zinc-950">
                <img
                  src={prop.image}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-90"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-black/80 backdrop-blur-md border border-zinc-700 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-[#C8A97E]">
                    {prop.operation}
                  </span>
                  <span className="bg-black/80 backdrop-blur-md px-3 py-1 font-mono text-[11px] text-zinc-300">
                    {prop.code}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/85 backdrop-blur-md border border-[#C8A97E]/40 px-4 py-1.5">
                  <span className="font-mono text-lg font-semibold text-white tabular-nums">
                    {prop.currency} {prop.price.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C8A97E]" />
                  <span>{prop.zone} — {prop.address}</span>
                </div>
                <h2 className="font-serif text-2xl text-white mb-3 group-hover:text-[#C8A97E] transition">
                  {prop.title}
                </h2>
                <p className="text-zinc-400 text-sm line-clamp-2 mb-6">
                  {prop.description}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-5 text-xs font-mono text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-[#C8A97E]" /> {prop.totalM2} m²
                </span>
                <span className="flex items-center gap-1.5">
                  <BedDouble className="w-3.5 h-3.5 text-[#C8A97E]" /> {prop.rooms} Amb.
                </span>
                {prop.garage && (
                  <span className="flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-[#C8A97E]" /> Cochera
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedProperty(prop)}
                  className="px-3 py-2 border border-zinc-700 text-xs font-mono uppercase hover:border-white transition"
                >
                  Dossier
                </button>
                <a
                  href={buildPropertyWhatsAppUrl(prop)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#C8A97E] text-black font-mono text-xs uppercase font-semibold flex items-center gap-1 hover:bg-[#d8bc96] transition"
                >
                  WhatsApp <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Modal Dossier */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-[#C8A97E]/50 max-w-2xl w-full p-8 relative">
            <button
              onClick={() => setSelectedProperty(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white font-mono text-xs border border-zinc-800 px-2.5 py-1"
            >
              CERRAR [ESC]
            </button>
            <span className="font-mono text-xs text-[#C8A97E] uppercase tracking-widest">
              Ficha Técnica // {selectedProperty.code}
            </span>
            <h3 className="font-serif text-3xl text-white mt-1 mb-4">{selectedProperty.title}</h3>
            <p className="text-zinc-300 text-sm leading-relaxed mb-6">{selectedProperty.description}</p>
            <div className="grid grid-cols-3 gap-4 border-y border-zinc-800 py-4 mb-6 font-mono text-xs">
              <div>
                <span className="text-zinc-500 block">SUPERFICIE TOTAL</span>
                <span className="text-white text-base">{selectedProperty.totalM2} m² ({selectedProperty.coveredM2} m² cub.)</span>
              </div>
              <div>
                <span className="text-zinc-500 block">VALOR</span>
                <span className="text-[#C8A97E] text-base">{selectedProperty.currency} {selectedProperty.price.toLocaleString('es-AR')}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">EXPENSAS</span>
                <span className="text-white text-base">${selectedProperty.expenses.toLocaleString('es-AR')} ARS</span>
              </div>
            </div>
            <div className="flex justify-end">
              <a
                href={buildPropertyWhatsAppUrl(selectedProperty)}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-[#C8A97E] text-black font-mono text-xs uppercase font-bold tracking-wider"
              >
                Solicitar Visita Privada por WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
