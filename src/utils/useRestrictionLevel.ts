import { useMemo } from 'react';
import { RegionalRestrictionValue } from '~/types/data';

const codes = [1, 2, 3, 4, 401, 402, 41];

export function useRestrictionLevel(values: RegionalRestrictionValue[]) {
  return useMemo(() => {
    const top = values.reduce((max, item) => {
      return Math.max(max, codes.indexOf(item.escalation_level));
    }, 0);
    return codes[top];
  }, [values]);
}
