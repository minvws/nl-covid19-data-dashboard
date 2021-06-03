import {
  isDateSpanValue,
  isDateValue,
  TimestampedValue,
} from '@corona-dashboard/common';
import { last } from 'lodash';
import { useMemo } from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import { TimespanAnnotationConfig } from './common';

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

            let currentAnnotation = last(newItems);
            if (
              !isDefined(currentAnnotation) ||
              !isNaN(currentAnnotation.end)
            ) {
              currentAnnotation = { start: startDate, end: NaN, label };
              newItems.push(currentAnnotation);
            }

            // If this is either the last item in the list or the next
            // item in the list has a valid property, this means the current
            // annotation ends here, so we assign the end date.
            if (
              index === array.length - 1 ||
              isPresent(array[index + 1]?.[property])
            ) {
              currentAnnotation.end = endDate;
            }
          }
          return newItems;
        },
        []
      ),
    [values, property, label]
  );
}
