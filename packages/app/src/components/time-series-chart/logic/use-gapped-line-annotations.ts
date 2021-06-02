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
      values.reduce<TimespanAnnotationConfig[]>(
        (newItems, item, index, array) => {
          if (!isPresent(item[property])) {
            const startDate = isDateValue(item)
              ? item.date_unix
              : isDateSpanValue(item)
              ? item.date_start_unix
              : NaN;

            const endDate = isDateValue(item)
              ? item.date_unix
              : isDateSpanValue(item)
              ? item.date_end_unix
              : NaN;

            let current = last(newItems);
            if (!isDefined(current) || !isNaN(current.end)) {
              current = { start: startDate, end: NaN, label };
              newItems.push(current);
            }

            if (
              index === array.length - 1 ||
              isPresent(array[index + 1]?.[property])
            ) {
              current.end = endDate;
            }
          }
          return newItems;
        },
        []
      ),
    [values, property, label]
  );
}
