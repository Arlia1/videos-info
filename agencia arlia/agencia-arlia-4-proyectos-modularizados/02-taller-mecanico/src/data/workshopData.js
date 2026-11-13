export const INITIAL_SERVICES = [
  { id: 'srv-1', code: 'MNT-01', name: 'Service Oficial Sintético + 4 Filtros + Escaneo OBDII', category: 'Mantenimiento', hours: 1.5, basePartsArs: 92000 },
  { id: 'srv-2', code: 'DIST-02', name: 'Kit Distribución Completa + Bomba de Agua + Poly-V', category: 'Motor', hours: 5.5, basePartsArs: 215000 },
  { id: 'srv-3', code: 'FRN-03', name: 'Reemplazo Pastillas y Rectificado de Discos Delanteros', category: 'Frenos', hours: 2.0, basePartsArs: 84000 },
  { id: 'srv-4', code: 'SUS-04', name: 'Cambio de Amortiguadores Delanteros + Cazoletas + Alineación 3D', category: 'Suspensión', hours: 3.5, basePartsArs: 240000 },
  { id: 'srv-5', code: 'EMB-05', name: 'Kit de Embrague Completo + Crapodina Hidráulica', category: 'Transmisión', hours: 6.5, basePartsArs: 310000 },
  { id: 'srv-6', code: 'INJ-06', name: 'Limpieza por Ultrasonido de Inyectores + Cuerpo Mariposa', category: 'Inyección', hours: 2.5, basePartsArs: 38000 }
];

export const VEHICLE_SEGMENTS = [
  { id: 'city', name: 'Hatchback / Sedán Compacto (Cronos, Etios, Gol, 208)', multiplier: 1.0 },
  { id: 'suv', name: 'SUV / Mediano (Corolla, Taos, Compass, Cruze)', multiplier: 1.25 },
  { id: 'pickup', name: 'Pick-Up / Utilitario Pesado (Hilux, Amarok, Ranger, Sprinter)', multiplier: 1.45 },
  { id: 'premium', name: 'Alta Gama / Turbo Alemán (Audi, BMW, Mercedes-Benz)', multiplier: 1.75 }
];

export const PART_TIERS = [
  { id: 'oem', name: 'Originales Legítimos (OEM Concesionario)', multiplier: 1.35, warranty: '12 meses / 20.000 km' },
  { id: 'first', name: '1ra Marca Homologada (Bosch / SKF / Mann / Sachs)', multiplier: 1.0, warranty: '6 meses / 10.000 km' },
  { id: 'alt', name: 'Alternativo Estándar Verificado', multiplier: 0.78, warranty: '3 meses / 5.000 km' }
];

export const INITIAL_ORDERS = [
  { id: 'ord-101', plate: 'AF 492 LK', model: 'Toyota Hilux SRX 2.8 TDI', bay: 'Box 1 (Elevador 4T)', status: 'En Elevador / Desarme', total: 485000, time: '09:00' },
  { id: 'ord-102', plate: 'AD 810 ZZ', model: 'VW Golf GTI MK7', bay: 'Box 3 (Diagnóstico Electrónico)', status: 'Control de Calidad / Prueba', total: 198000, time: '11:00' },
  { id: 'ord-103', plate: 'AE 104 PQ', model: 'Peugeot 208 Feline', bay: 'Box 2 (Tren Delantero)', status: 'Listo para Retirar', total: 142000, time: '14:30' }
];
