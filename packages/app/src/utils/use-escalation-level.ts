import { useMemo } from 'react';
import {
  NationalRestrictionValue,
  RegionalRestrictionValue,
} from '@corona-dashboard/common';

const codes = [1, 2, 3, 4, 401, 402, 41];

export function useEscalationLevel(
  values: (RegionalRestrictionValue | NationalRestrictionValue)[]
) {
  return useMemo(() => {
    const top = Math.max(
      ...values.map((item) => codes.indexOf(item.escalation_level))
    );
    return codes[top];
  }, [values]);
}
