const EXPEDITION_PHONE = '5491100000000';

export function buildWholesaleWhatsAppOrder(cartItems, clientInfo, totals) {
  const lines = [
    `*NOTA DE PEDIDO MAYORISTA B2B // ARLIA LOGÍSTICA*`,
    `---------------------------------------------`,
    `*Razón Social / Comercio:* ${clientInfo.name}`,
    `*CUIT:* ${clientInfo.cuit}`,
    `*Ruta de Reparto:* ${clientInfo.zone}`,
    ``,
    `*DETALLE DE BULTOS:*`,
    ...cartItems.map(
      i => `• ${i.qty} bultos [${i.sku}] ${i.name} (${i.tierLabel}) -> $${i.subtotal.toLocaleString('es-AR')}`
    ),
    ``,
    `*Peso Total de Carga:* ${totals.totalWeightKg} Kg`,
    `*TOTAL FACTURACIÓN:* *$${totals.grandTotal.toLocaleString('es-AR')} ARS*`
  ];
  return `https://wa.me/${EXPEDITION_PHONE}?text=${encodeURIComponent(lines.join('\n'))}`;
}
