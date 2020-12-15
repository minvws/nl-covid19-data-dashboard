import { useMemo } from 'react';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { assert } from './assert';

export function useEscalationColor(level?: 1 | 2 | 3 | 4) {
  return useMemo(() => {
    assert(
      level !== undefined,
      'Cannot resolve an escalation color for an undefined level'
    );

    const escalationThresholds =
      regionThresholds.escalation_levels.escalation_level;

    const escalationColor = escalationThresholds.find(
      (threshold) => threshold.threshold === level
    )?.color;

    assert(
      escalationColor,
      `Cannot resolve an escalation color for level '${level}'`
    );

    return escalationColor;
  }, [level]);
}
