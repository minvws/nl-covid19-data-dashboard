import {
  DateSpanValue,
  DateValue,
  TimestampedValue,
} from '@corona-dashboard/common';
import { last } from 'lodash';
import { useMemo } from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import { TimespanAnnotationConfig } from './common';

function isDateValue(value: TimestampedValue): value is DateValue {
  return isDefined((value as DateValue).date_unix);
}

function isDateSpanValue(value: TimestampedValue): value is DateSpanValue {
  return isDefined((value as DateSpanValue).date_start_unix);
}

export function useGappedLineAnnotations<T extends TimestampedValue>(
  values: T[],
  property: keyof T,
  label: string
) {
  return useMemo(
    () =>
      values
        .reduce<{ start: number; end: number }[]>(
          (newItems, item, index, array) => {
            if (!isPresent(item[property])) {
              let current = last(newItems);

              const startDate = isDateValue(item)
                ? item.date_unix
                : isDateSpanValue(item)
                ? item.date_start_unix
                : 0;

              const endDate = isDateValue(item)
                ? item.date_unix
                : isDateSpanValue(item)
                ? item.date_end_unix
                : 0;

              if (!isDefined(current)) {
                current = { start: startDate, end: -1 };
                newItems.push(current);
              }

              if (
                !isDefined(array[index + 1]) ||
                isPresent(array[index + 1]?.[property])
              ) {
                current.end = endDate;
              }
            }
            return newItems;
          },
          []
        )
        .map<TimespanAnnotationConfig>((item) => ({
          start: item.start,
          end: item.end,
          label,
        })),
    [values, property, label]
  );
}
