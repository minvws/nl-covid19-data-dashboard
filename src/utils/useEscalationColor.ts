import { useMemo } from 'react';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { ChoroplethThresholds } from '~/components/choropleth/shared';

export function useEscalationColor(level: number | undefined) {
  return useMemo(() => {
    if (level === undefined) {
      return '#000000';
    }

    const escalationThresholds = (regionThresholds.escalation_levels as ChoroplethThresholds)
      .thresholds;

    const escalationColor =
      escalationThresholds.find((threshold) => threshold.threshold === level)
        ?.color ?? '#000000';

    return escalationColor;
  }, [level]);
}
