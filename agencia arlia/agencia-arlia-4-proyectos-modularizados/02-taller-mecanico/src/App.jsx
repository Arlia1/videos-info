import React, { useState } from 'react';
import { Wrench, ShieldAlert, Activity } from 'lucide-react';
import { INITIAL_SERVICES, INITIAL_ORDERS } from './data/workshopData';
import QuoteAndScheduler from './components/QuoteAndScheduler';

export default function App() {
  const [tab, setTab] = useState('quote');
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [laborHourRate, setLaborHourRate] = useState(34000);

  return (
    <div className="min-h-screen bg-[#090B0E] text-zinc-100">
      <header className="border-b border-zinc-800 bg-[#0D1017] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500 text-black flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono font-bold tracking-wider text-white block leading-none">
                ARLIA MOTORSPORT
              </span>
              <span className="font-mono text-[10px] text-amber-500 uppercase tracking-widest">
                Ingeniería Mecánica & Diagnóstico Computarizado
              </span>
            </div>
          </div>

          <nav className="flex gap-3">
            <button
              onClick={() => setTab('quote')}
              className={`px-3 py-1.5 font-mono text-xs uppercase ${
                tab === 'quote' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Cotizador & Turnos
            </button>
            <button
              onClick={() => setTab('tracker')}
              className={`px-3 py-1.5 font-mono text-xs uppercase flex items-center gap-1 ${
                tab === 'tracker' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Tablero de Boxes ({orders.length})
            </button>
            <button
              onClick={() => setTab('admin')}
              className={`px-3 py-1.5 font-mono text-xs uppercase border border-zinc-700 ${
                tab === 'admin' ? 'bg-white text-black font-bold' : 'text-zinc-300'
              }`}
            >
              /admin
            </button>
          </nav>
        </div>
      </header>

      {tab === 'quote' && (
        <QuoteAndScheduler
          services={services}
          laborHourRate={laborHourRate}
          orders={orders}
          setOrders={setOrders}
        />
      )}

      {tab === 'tracker' && (
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h2 className="font-mono text-xl text-white mb-6 uppercase">Estado de Unidades en Boxes en Vivo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {orders.map(o => (
              <div key={o.id} className="bg-zinc-900 border border-zinc-800 p-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/40 font-mono text-xs text-amber-400 font-bold">
                    {o.plate}
                  </span>
                  <span className="font-mono text-xs text-zinc-400">{o.time} hs</span>
                </div>
                <h3 className="font-bold text-white text-base mb-1">{o.model}</h3>
                <p className="font-mono text-xs text-zinc-400 mb-4">{o.bay}</p>
                <div className="pt-3 border-t border-zinc-800 flex justify-between items-center font-mono text-xs">
                  <span className="text-emerald-400">{o.status}</span>
                  <span className="text-white font-bold">${o.total.toLocaleString('es-AR')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'admin' && (
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="bg-zinc-900 border border-zinc-800 p-6 mb-8">
            <h2 className="font-mono text-sm uppercase text-amber-500 mb-4">
              Configuración Global de Valor Hora Hombre
            </h2>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={laborHourRate}
                onChange={e => setLaborHourRate(Number(e.target.value))}
                className="bg-zinc-950 border border-zinc-700 px-4 py-2 font-mono text-lg text-amber-400"
              />
              <span className="font-mono text-xs text-zinc-400">
                ARS / Hora (Impacta instantáneamente en todos los presupuestos del cotizador)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
