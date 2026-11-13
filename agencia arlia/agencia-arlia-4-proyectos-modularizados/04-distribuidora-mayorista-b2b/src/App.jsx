import React, { useState, useMemo } from 'react';
import { Package, Truck, Printer, ArrowUpRight, TrendingUp } from 'lucide-react';
import { INITIAL_WHOLESALE_PRODUCTS } from './data/wholesaleCatalog';
import { getTierUnitPackPrice } from './hooks/useWholesalePricing';
import ThermalTicketModal from './components/ThermalTicketModal';
import { buildWholesaleWhatsAppOrder } from './services/whatsapp.service';

export default function App() {
  const [products, setProducts] = useState(INITIAL_WHOLESALE_PRODUCTS);
  const [quantities, setQuantities] = useState({ 'b2b-1': 6, 'b2b-3': 5 });
  const [tab, setTab] = useState('terminal');
  const [showTicket, setShowTicket] = useState(false);
  const [inflationPct, setInflationPct] = useState(6);

  const [clientInfo, setClientInfo] = useState({
    name: 'Autoservicio El Sol SRL',
    cuit: '30-71549201-9',
    zone: 'Ruta Sur 1 (Avellaneda / Sarandí / Wilde)'
  });

  const setQty = (id, val) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(0, val) }));
  };

  const cartItems = useMemo(() => {
    return products
      .map(p => {
        const qty = quantities[p.id] || 0;
        if (qty <= 0) return null;
        const tier = getTierUnitPackPrice(p.basePackPrice, qty);
        return {
          ...p,
          qty,
          tierLabel: tier.tierLabel,
          packPrice: tier.packPrice,
          subtotal: tier.packPrice * qty,
          lineWeight: Number((p.weightKg * qty).toFixed(1))
        };
      })
      .filter(Boolean);
  }, [products, quantities]);

  const totals = useMemo(() => {
    const grandTotal = cartItems.reduce((acc, i) => acc + i.subtotal, 0);
    const totalWeightKg = Number(cartItems.reduce((acc, i) => acc + i.lineWeight, 0).toFixed(1));
    return { grandTotal, totalWeightKg };
  }, [cartItems]);

  const applyMassInflation = () => {
    const factor = 1 + inflationPct / 100;
    setProducts(
      products.map(p => ({
        ...p,
        basePackPrice: Math.round(p.basePackPrice * factor)
      }))
    );
  };

  return (
    <div className="min-h-screen bg-[#080B10] text-zinc-100">
      <header className="border-b border-zinc-800 bg-[#0D1118] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-500 text-black flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono font-bold text-white block leading-none">
                ARLIA LOGÍSTICA // TERMINAL B2B
              </span>
              <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest">
                Abastecimiento Mayorista con Escalas por Volumen
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setTab('terminal')}
              className={`px-3 py-1.5 font-mono text-xs uppercase ${
                tab === 'terminal' ? 'bg-emerald-500 text-black font-bold' : 'text-zinc-400'
              }`}
            >
              Matriz Rápida de Pedido
            </button>
            <button
              onClick={() => setTab('admin')}
              className={`px-3 py-1.5 font-mono text-xs uppercase border border-zinc-700 ${
                tab === 'admin' ? 'bg-white text-black font-bold' : 'text-zinc-300'
              }`}
            >
              /admin Remarcación Masiva
            </button>
          </div>
        </div>
      </header>

      {tab === 'terminal' ? (
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Tabla B2B de Alta Densidad */}
          <div className="lg:col-span-8 bg-zinc-900/40 border border-zinc-800 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950 font-mono text-[11px] text-zinc-400 uppercase">
                  <th className="p-3.5">SKU / Producto</th>
                  <th className="p-3.5">Base (1-4)</th>
                  <th className="p-3.5 text-emerald-400">Estiba (5+ -8%)</th>
                  <th className="p-3.5 text-amber-400">Pallet (15+ -16%)</th>
                  <th className="p-3.5 text-center">Bultos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70 text-xs font-mono">
                {products.map(p => {
                  const qty = quantities[p.id] || 0;
                  const estibaPrice = Math.round(p.basePackPrice * 0.92);
                  const palletPrice = Math.round(p.basePackPrice * 0.84);
                  return (
                    <tr key={p.id} className={qty > 0 ? 'bg-emerald-500/5' : 'hover:bg-zinc-900/50'}>
                      <td className="p-3.5">
                        <span className="text-emerald-400 block text-[10px]">{p.sku} • {p.brand} ({p.unitsPerPack} u/bulto)</span>
                        <span className="font-sans font-medium text-white text-sm">{p.name}</span>
                      </td>
                      <td className="p-3.5 tabular-nums text-zinc-300">${p.basePackPrice.toLocaleString('es-AR')}</td>
                      <td className="p-3.5 tabular-nums text-emerald-400 font-semibold">${estibaPrice.toLocaleString('es-AR')}</td>
                      <td className="p-3.5 tabular-nums text-amber-400 font-semibold">${palletPrice.toLocaleString('es-AR')}</td>
                      <td className="p-3.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setQty(p.id, qty - 1)}
                            className="w-7 h-7 bg-zinc-950 border border-zinc-700 text-white"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={qty}
                            onChange={e => setQty(p.id, Number(e.target.value))}
                            className="w-14 bg-zinc-950 border border-zinc-700 text-center py-1 text-white tabular-nums"
                          />
                          <button
                            onClick={() => setQty(p.id, qty + 1)}
                            className="w-7 h-7 bg-zinc-950 border border-zinc-700 text-emerald-400"
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Manifiesto de Carga y Expedición */}
          <div className="lg:col-span-4">
            <div className="bg-zinc-900 border border-zinc-800 p-6 sticky top-24 space-y-5">
              <div>
                <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest">
                  Manifiesto de Expedición & Reparto
                </span>
                <h3 className="font-mono text-lg font-bold text-white mt-1">{clientInfo.name}</h3>
                <p className="font-mono text-xs text-zinc-400">CUIT: {clientInfo.cuit}</p>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 p-3.5 font-mono text-xs flex items-center justify-between">
                <span className="flex items-center gap-2 text-zinc-400">
                  <Truck className="w-4 h-4 text-emerald-400" /> Peso Total en Camión:
                </span>
                <span className="text-white font-bold">{totals.totalWeightKg} Kg</span>
              </div>

              <div className="space-y-2 max-h-52 overflow-y-auto border-y border-zinc-800 py-3 font-mono text-xs">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-zinc-300">
                      {item.qty}x {item.sku} <span className="text-emerald-400">({item.tierLabel})</span>
                    </span>
                    <span className="text-white tabular-nums">${item.subtotal.toLocaleString('es-AR')}</span>
                  </div>
                ))}
              </div>

              <div>
                <span className="font-mono text-xs text-zinc-400 block">TOTAL REMITO MAYORISTA</span>
                <span className="font-mono text-3xl font-bold text-emerald-400 tabular-nums">
                  ${totals.grandTotal.toLocaleString('es-AR')} ARS
                </span>
              </div>

              <div className="space-y-2.5">
                <a
                  href={buildWholesaleWhatsAppOrder(cartItems, clientInfo, totals)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-emerald-500 text-black font-mono text-xs uppercase font-bold flex items-center justify-center gap-2"
                >
                  Despachar Pedido a Expedición (WhatsApp) <ArrowUpRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setShowTicket(true)}
                  className="w-full py-2.5 border border-zinc-700 text-zinc-200 font-mono text-xs uppercase flex items-center justify-center gap-2 hover:border-white"
                >
                  <Printer className="w-4 h-4" /> Vista Previa Comandera Térmica 58mm
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="bg-zinc-900 border border-zinc-800 p-6">
            <span className="font-mono text-xs text-emerald-400 uppercase">
              Motor de Actualización de Listas (Inflación / Proveedores)
            </span>
            <h2 className="text-xl font-bold text-white mt-1 mb-4">
              Remarcación Porcentual Masiva de Catálogo
            </h2>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={inflationPct}
                onChange={e => setInflationPct(Number(e.target.value))}
                className="bg-zinc-950 border border-zinc-700 px-4 py-2 font-mono text-lg text-emerald-400 w-28"
              />
              <button
                onClick={applyMassInflation}
                className="px-6 py-2.5 bg-emerald-500 text-black font-mono text-xs uppercase font-bold flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" /> Aplicar +{inflationPct}% a Todos los Bultos y Escalas
              </button>
            </div>
          </div>
        </div>
      )}

      {showTicket && (
        <ThermalTicketModal
          cartItems={cartItems}
          clientInfo={clientInfo}
          totals={totals}
          onClose={() => setShowTicket(false)}
        />
      )}
    </div>
  );
}
