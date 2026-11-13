import { useMemo } from 'react';
import { VEHICLE_SEGMENTS, PART_TIERS } from '../data/workshopData';

export function useQuoteCalculator({ selectedServiceIds, services, segmentId, tierId, laborHourRate }) {
  return useMemo(() => {
    const segment = VEHICLE_SEGMENTS.find(s => s.id === segmentId) || VEHICLE_SEGMENTS[0];
    const tier = PART_TIERS.find(t => t.id === tierId) || PART_TIERS[1];
    const chosen = services.filter(s => selectedServiceIds.includes(s.id));

    const totalHours = chosen.reduce((acc, s) => acc + s.hours * segment.multiplier, 0);
    const laborTotal = Math.round(totalHours * laborHourRate);
    const partsTotal = Math.round(
      chosen.reduce((acc, s) => acc + s.basePartsArs * segment.multiplier * tier.multiplier, 0)
    );

    return {
      chosen,
      segment,
      tier,
      totalHours: Number(totalHours.toFixed(1)),
      laborTotal,
      partsTotal,
      grandTotal: laborTotal + partsTotal
    };
  }, [selectedServiceIds, services, segmentId, tierId, laborHourRate]);
}
