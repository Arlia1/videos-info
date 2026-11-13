const WORKSHOP_PHONE = '5491100000000';

export function buildWorkshopQuoteWhatsApp({ plate, vehicleModel, quote, slot }) {
  const lines = [
    `*ORDEN DE PRESUPUESTO & TURNO // ARLIA MOTORSPORT*`,
    `--------------------------------------------`,
    `*Dominio / Patente:* ${plate || 'A confirmar'}`,
    `*Vehículo:* ${vehicleModel || quote.segment.name}`,
    `*Calidad de Repuestos:* ${quote.tier.name} (Garantía: ${quote.tier.warranty})`,
    `*Turno Solicitado:* ${slot.date} a las ${slot.time} hs (${slot.bay})`,
    ``,
    `*TRABAJOS SELECCIONADOS:*`,
    ...quote.chosen.map(s => `• [${s.code}] ${s.name}`),
    ``,
    `*Mano de Obra (${quote.totalHours} hs):* $${quote.laborTotal.toLocaleString('es-AR')}`,
    `*Repuestos e Insumos:* $${quote.partsTotal.toLocaleString('es-AR')}`,
    `*TOTAL ESTIMADO:* *$${quote.grandTotal.toLocaleString('es-AR')} ARS*`
  ];

  return `https://wa.me/${WORKSHOP_PHONE}?text=${encodeURIComponent(lines.join('\n'))}`;
}
