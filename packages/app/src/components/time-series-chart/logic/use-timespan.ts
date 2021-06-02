import {
  isDateSeries,
  isDateSpanSeries,
  TimestampedValue,
} from '@corona-dashboard/common';
import { useMemo } from 'react';

export function useTimespan<T extends TimestampedValue>(values: T[]) {
  return useMemo(() => {
    if (!values.length) {
      return NaN;
    }

    if (isDateSeries(values)) {
      return 1;
    } else if (isDateSpanSeries(values)) {
      const value = values[0];
      return value.date_end_unix - value.date_start_unix;
    }

    return NaN;
  }, [values]);
}
