import { useMemo } from 'react';
import {
  escalationColors,
  EscalationLevelType,
} from '~/domain/escalation-level/common';
import { useIntl } from '~/intl';
import { assert } from '~/utils/assert';

/**
 *  Returns the associated color and title for the given escalation level
 *
 * @param level The given escalation level
 * @returns a color and title
 */
export function useEscalationLevel(level: EscalationLevelType) {
  const { siteText } = useIntl();

  return useMemo(() => {
    const escalationColor = escalationColors.find(
      (x) => x.level === level
    )?.color;

    assert(
      escalationColor,
      `Cannot resolve an escalation color for level '${level}'`
    );

    return {
      color: escalationColor,
      title: siteText.national_escalation_levels.types[`${level}`].title,
    };
  }, [level, siteText]);
}
