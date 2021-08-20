import { DateSpanValue } from '@corona-dashboard/common';
import { last } from 'lodash';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { TimespanAnnotationConfig } from '~/components/time-series-chart/logic';

export function useUnreliableDataAnnotations(
  values: (DateSpanValue & { is_reliable: boolean })[],
  label: string
) {
  return useMemo(
    () =>
      values
        .reduce<TimespanAnnotationConfig[]>(
          (acc, x) => {
            if (!x.is_reliable) {
              const annotation =
                last(acc) ??
                ({ label, fill: 'dotted' } as TimespanAnnotationConfig);
              if (!isDefined(annotation.start)) {
                annotation.start = x.date_start_unix;
                annotation.end = x.date_end_unix;
              } else {
                annotation.end = x.date_end_unix;
              }
            } else {
              acc.push({ label, fill: 'dotted' } as TimespanAnnotationConfig);
            }
            return acc;
          },
          [{ label, fill: 'dotted' }] as TimespanAnnotationConfig[]
        )
        .filter((x) => isDefined(x.start) && isDefined(x.end)),
    [values, label]
  );
}
