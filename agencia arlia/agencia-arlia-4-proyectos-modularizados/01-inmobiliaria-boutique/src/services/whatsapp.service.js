const DEFAULT_PHONE = '5491100000000';

export function buildPropertyWhatsAppUrl(property, customMessage = '') {
  const text = [
    `*DOSSIER PRIVADO // ARLIA PROPIEDADES*`,
    `----------------------------------`,
    `*Ref:* ${property.code}`,
    `*Propiedad:* ${property.title}`,
    `*Ubicación:* ${property.address} (${property.zone})`,
    `*Operación:* ${property.operation} - ${property.currency} ${property.price.toLocaleString('es-AR')}`,
    customMessage ? `\n*Consulta:* ${customMessage}` : `\nSolicito coordinar visita privada y recibir ficha técnica completa.`
  ].join('\n');

  return `https://wa.me/${DEFAULT_PHONE}?text=${encodeURIComponent(text)}`;
}
