import {
  formatStyle,
  isDateSpanValue,
  isDateValue,
  TimestampedValue,
} from '@corona-dashboard/common';
import { last } from 'lodash';
import { useMemo } from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import { useIntl } from '~/intl';
import { TimespanAnnotationConfig } from './common';

export function useGappedLineAnnotations<T extends TimestampedValue>(
  values: T[],
  property: keyof T,
  label: string
) {
  const { formatDateFromSeconds } = useIntl();

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
              currentAnnotation.label = formatLabel(
                currentAnnotation,
                formatDateFromSeconds
              );
            }
          }
          return newItems;
        },
        []
      ),
    [values, property, label, formatDateFromSeconds]
  );
}

function formatLabel(
  annotation: TimespanAnnotationConfig,
  formatDateFromSeconds: (seconds: number, style?: formatStyle) => string
) {
  const start = formatDateFromSeconds(annotation.start, 'axis');
  const end = formatDateFromSeconds(annotation.end, 'axis');
  return `${start} - ${end}: ${annotation.label}`;
}
