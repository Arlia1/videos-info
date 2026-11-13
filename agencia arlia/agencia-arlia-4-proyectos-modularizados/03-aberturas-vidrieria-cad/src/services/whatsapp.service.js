const FACTORY_PHONE = '5491100000000';

export function buildPliegoWhatsAppUrl(pliegoItems, grandTotal) {
  const lines = [
    `*PLIEGO TÉCNICO DE CARPINTERÍA // ARLIA ARQUITECTURA*`,
    `------------------------------------------------`,
    ...pliegoItems.map(
      (item, i) =>
        `*V-${i + 1}:* ${item.widthCm}x${item.heightCm}cm (${item.leaves} hojas) | ${item.seriesName} | ${item.glassName} | Cant: ${item.qty} -> $${item.subtotal.toLocaleString('es-AR')}`
    ),
    `------------------------------------------------`,
    `*TOTAL DE OBRA ESTIMADO:* *$${grandTotal.toLocaleString('es-AR')} ARS*`,
    `Solicito medición láser en obra y verificación de vanos.`
  ];
  return `https://wa.me/${FACTORY_PHONE}?text=${encodeURIComponent(lines.join('\n'))}`;
}
