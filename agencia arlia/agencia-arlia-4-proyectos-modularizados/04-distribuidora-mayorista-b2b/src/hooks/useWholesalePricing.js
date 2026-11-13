export function getTierUnitPackPrice(basePackPrice, qty) {
  if (qty >= 15) {
    return {
      tierLabel: 'Pallet (-16%)',
      packPrice: Math.round(basePackPrice * 0.84),
      discountPct: 16
    };
  }
  if (qty >= 5) {
    return {
      tierLabel: 'Media Estiba (-8%)',
      packPrice: Math.round(basePackPrice * 0.92),
      discountPct: 8
    };
  }
  return {
    tierLabel: 'Base Bulto',
    packPrice: basePackPrice,
    discountPct: 0
  };
}
