import { useMemo } from 'react';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { EscalationLevel } from '~/domain/restrictions/type';
import { assert } from './assert';

export function useEscalationColor(level?: EscalationLevel) {
  return useMemo(() => {
    assert(
      level !== undefined,
      'Cannot resolve an escalation color for an undefined level'
    );

    const escalationThresholds = regionThresholds.escalation_levels.level;

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
