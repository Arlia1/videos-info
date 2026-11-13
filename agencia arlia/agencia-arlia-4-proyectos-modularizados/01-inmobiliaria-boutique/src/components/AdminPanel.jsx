import React, { useState } from 'react';
import { Plus, Trash2, RotateCcw } from 'lucide-react';
import { INITIAL_PROPERTIES } from '../data/initialProperties';

export default function AdminPanel({ properties, setProperties }) {
  const [form, setForm] = useState({
    code: 'ARL-0501',
    title: '',
    operation: 'Venta',
    type: 'Departamento',
    zone: 'Avellaneda Centro',
    address: '',
    price: 125000,
    currency: 'USD',
    expenses: 95000,
    totalM2: 85,
    coveredM2: 75,
    rooms: 3,
    bathrooms: 2,
    garage: true,
    description: ''
  });

  const handleAdd = e => {
    e.preventDefault();
    if (!form.title || !form.address) return;
    const newProp = {
      ...form,
      id: 'prop-' + Date.now(),
      price: Number(form.price),
      expenses: Number(form.expenses),
      totalM2: Number(form.totalM2),
      coveredM2: Number(form.coveredM2),
      rooms: Number(form.rooms),
      bathrooms: Number(form.bathrooms),
      status: 'Disponible',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80'
    };
    setProperties([newProp, ...properties]);
    setForm({ ...form, title: '', address: '', description: '' });
  };

  const handleDelete = id => {
    setProperties(properties.filter(p => p.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <span className="font-mono text-xs text-[#C8A97E] uppercase tracking-widest">
            Backoffice Inmobiliario // CRUD Persistente
          </span>
          <h2 className="font-serif text-3xl text-white">Consola de Administración de Cartera</h2>
        </div>
        <button
          onClick={() => setProperties(INITIAL_PROPERTIES)}
          className="px-4 py-2 border border-zinc-700 text-xs font-mono uppercase flex items-center gap-2 hover:border-[#C8A97E]"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Restaurar Demo Inicial
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario Alta */}
        <form onSubmit={handleAdd} className="bg-zinc-900/50 border border-zinc-800 p-6 space-y-4">
          <h3 className="font-mono text-xs uppercase tracking-wider text-[#C8A97E] mb-2">
            Publicar Nueva Propiedad
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Código (ARL-0501)"
              value={form.code}
              onChange={e => setForm({ ...form, code: e.target.value })}
              className="bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white"
            />
            <select
              value={form.operation}
              onChange={e => setForm({ ...form, operation: e.target.value })}
              className="bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white"
            >
              <option value="Venta">Venta</option>
              <option value="Alquiler">Alquiler</option>
              <option value="Pozo">Pozo</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Título editorial de la propiedad *"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Zona (ej. Wilde)"
              value={form.zone}
              onChange={e => setForm({ ...form, zone: e.target.value })}
              className="bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white"
            />
            <input
              type="text"
              placeholder="Dirección exacta *"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              className="bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white"
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input
              type="number"
              placeholder="Precio USD"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              className="bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white"
            />
            <input
              type="number"
              placeholder="m² Totales"
              value={form.totalM2}
              onChange={e => setForm({ ...form, totalM2: e.target.value })}
              className="bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white"
            />
            <input
              type="number"
              placeholder="Ambientes"
              value={form.rooms}
              onChange={e => setForm({ ...form, rooms: e.target.value })}
              className="bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white"
            />
          </div>
          <textarea
            rows="3"
            placeholder="Memoria descriptiva y detalles constructivos..."
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 p-3 text-xs text-white"
          />
          <button
            type="submit"
            className="w-full py-3 bg-[#C8A97E] text-black font-mono text-xs uppercase font-bold flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Incorporar al Catálogo
          </button>
        </form>

        {/* Tabla Inventario */}
        <div className="lg:col-span-2 bg-zinc-900/30 border border-zinc-800 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 font-mono text-[11px] text-zinc-400 uppercase">
                <th className="p-4">Código</th>
                <th className="p-4">Propiedad</th>
                <th className="p-4">Zona</th>
                <th className="p-4">Valor</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs">
              {properties.map(p => (
                <tr key={p.id} className="hover:bg-zinc-900/60">
                  <td className="p-4 font-mono text-[#C8A97E]">{p.code}</td>
                  <td className="p-4 font-medium text-white">{p.title}</td>
                  <td className="p-4 text-zinc-400">{p.zone}</td>
                  <td className="p-4 font-mono tabular-nums text-white">
                    {p.currency} {p.price.toLocaleString('es-AR')}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Eliminar propiedad"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
