import React from 'react';

export default function ThermalTicketModal({ cartItems, clientInfo, totals, onClose }) {
  if (!cartItems.length) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white text-black font-mono text-xs w-full max-w-[340px] p-5 shadow-2xl">
        <div className="text-center border-b border-dashed border-black pb-3 mb-3">
          <p className="font-bold text-sm">ARLIA LOGÍSTICA MAYORISTA</p>
          <p className="text-[10px]">COMANDA DE PICKING // 58mm SOL58</p>
          <p className="text-[10px]">CUIT: {clientInfo.cuit} • ZONA: {clientInfo.zone}</p>
        </div>

        <div className="space-y-1.5 border-b border-dashed border-black pb-3 mb-3">
          {cartItems.map(item => (
            <div key={item.id}>
              <div className="font-bold">{item.qty}x [{item.sku}] {item.name.slice(0, 24)}</div>
              <div className="flex justify-between text-[11px]">
                <span>{item.tierLabel} (${item.packPrice.toLocaleString('es-AR')})</span>
                <span>${item.subtotal.toLocaleString('es-AR')}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-1 text-[11px] mb-4">
          <div className="flex justify-between">
            <span>PESO LOGÍSTICO:</span>
            <span>{totals.totalWeightKg} KG</span>
          </div>
          <div className="flex justify-between font-bold text-sm pt-1 border-t border-black">
            <span>TOTAL REMITO:</span>
            <span>${totals.grandTotal.toLocaleString('es-AR')}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex-1 bg-black text-white py-2 uppercase font-bold text-[11px]"
          >
            Imprimir 58mm
          </button>
          <button
            onClick={onClose}
            className="px-3 py-2 border border-black uppercase text-[11px]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
