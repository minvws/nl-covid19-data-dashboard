import { DateSpanValue } from '@corona-dashboard/common';
import { last } from 'lodash';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { TimespanAnnotationConfig } from '~/components/time-series-chart/logic';

export function useGapsDataAnnotations(
  values: DateSpanValue[],
  key: string,
  label: string,
  shortLabel: string
) {
  return useMemo(
    () =>
      values
        .reduce<TimespanAnnotationConfig[]>(
          (acc, x) => {
            if (!x[key]) {
              const annotation =
                last(acc) ??
                ({
                  label,
                  shortLabel,
                } as TimespanAnnotationConfig);
              if (!isDefined(annotation.start)) {
                annotation.start = x.date_start_unix;
                annotation.end = x.date_end_unix;
              } else {
                annotation.end = x.date_end_unix;
              }
            } else {
              acc.push({
                label,
                shortLabel,
              } as TimespanAnnotationConfig);
            }
            return acc;
          },
          [{ label, shortLabel }] as TimespanAnnotationConfig[]
        )
        .filter((x) => isDefined(x.start) && isDefined(x.end)),
    [values, label, key, shortLabel]
  );
}
