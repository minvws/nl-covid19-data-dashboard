import { useMemo } from 'react';
import {
  EscalationLevelType,
  escalationThresholds,
} from '~/domain/escalation-level/common';
import { getEscalationLevelIndexKey } from '~/domain/escalation-level/get-escalation-level';
import { useIntl } from '~/intl';
import { assert } from '~/utils/assert';

export function useEscalationLevel(level: EscalationLevelType) {
  const { siteText } = useIntl();

  return useMemo(() => {
    const escalationColor = escalationThresholds.find(
      (threshold) => threshold.threshold === level
    )?.color;

    assert(
      escalationColor,
      `Cannot resolve an escalation color for level '${level}'`
    );

    return {
      color: escalationColor,
      text: siteText.escalatie_niveau.types[getEscalationLevelIndexKey(level)]
        .titel,
    };
  }, [level, siteText]);
}
