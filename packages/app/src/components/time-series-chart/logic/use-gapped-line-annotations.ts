import {
  isDateSpanValue,
  isDateValue,
  TimestampedValue,
} from '@corona-dashboard/common';
import { isBoolean, last } from 'lodash';
import { useMemo } from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import { TimespanAnnotationConfig } from './common';

const HALF_DAY_IN_SECONDS = 12 * 60 * 60;

/**
 * This hook scans the given values collection for consecutive items with invalid/incomplete
 * data and creates a list of TimespanAnnotationConfigs for them.
 *
 * If a list item is invalid/incomplete is determined by the given property. The value can
 * either be a boolean or a nullable value. This way the scenario is supported where a
 * single property indicates whether the entire object is invalid, or a single property
 * is simply checked for null value.
 *
 * The date or start date (in case we're dealing with timespans) of the first invalid item
 * is used as the start date for the TimespanAnnotationConfig, the date or end date of the last one
 * for each list of consecutive invalid/incomplete values is used as the end date.
 *
 * Simplified, when given this array: [validItem, invalidItem1, validItem, invalidItem2, invalidItem3, validItem]
 * the hook will yield two TimespanAnnotationConfigs.
 * Where the first config has a start and enddate equal to the start and end of invalidItem1 and the second
 * config has a start and enddate equal to the start of invalidItem1 and end of invalidItem2.
 *
 */
export function useGappedLineAnnotations<T extends TimestampedValue>(
  values: T[],
  property: keyof T,
  label: string
) {
  return useMemo(() => {
    return values.reduce<TimespanAnnotationConfig[]>(
      (newItems, item, index, array) => {
        const value = item[property] as unknown;
        if (!hasValue(value)) {
          const startDate =
            (isDateValue(item)
              ? item.date_unix
              : isDateSpanValue(item)
              ? item.date_start_unix
              : NaN) - HALF_DAY_IN_SECONDS;

          const endDate =
            (isDateValue(item)
              ? item.date_unix
              : isDateSpanValue(item)
              ? item.date_end_unix
              : NaN) + HALF_DAY_IN_SECONDS;

          let currentAnnotation = last(newItems);
          if (!isDefined(currentAnnotation) || !isNaN(currentAnnotation.end)) {
            currentAnnotation = { start: startDate, end: NaN, label };
            newItems.push(currentAnnotation);
          }

          /**
           * If this is either the last item in the list or the next
           * item in the list has a valid property, this means the current
           * annotation ends here, so we assign the end date.
           */
          if (
            index === array.length - 1 ||
            hasValue(array[index + 1]?.[property])
          ) {
            currentAnnotation.end = endDate;
          }
        }
        return newItems;
      },
      []
    );
  }, [values, property, label]);
}

function hasValue(value: unknown) {
  return isBoolean(value) ? value === true : isPresent(value);
}
