import { useMemo } from 'react';
import { regionThresholds } from '~/components/choropleth/region-thresholds';

export function useEscalationColor(level?: number) {
  return useMemo(() => {
    if (level === undefined) {
      return '#000000';
    }

    const escalationThresholds =
      regionThresholds.escalation_levels.escalation_level;

    const escalationColor =
      escalationThresholds.find((threshold) => threshold.threshold === level)
        ?.color ?? '#000000';

    return escalationColor;
  }, [level]);
}
