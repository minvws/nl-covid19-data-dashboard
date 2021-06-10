import { isDateSpanValue, TimestampedValue } from '@corona-dashboard/common';
import { isBoolean } from 'lodash';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { useIntl } from '~/intl';
import { TimespanAnnotationConfig } from './common';

const HALF_DAY_IN_SECONDS = 12 * 60 * 60;

/**
 * This hook scans the given values collection for items with invalid/incomplete
 * data and creates a list of TimespanAnnotationConfigs for them.
 *
 * If a list item is invalid/incomplete is determined by the given property. The value can
 * either be a boolean or a nullable value. This way the scenario is supported where a
 * single property indicates whether the entire object is invalid, or a single property
 * is simply checked for null value.
 *
 */
export function useGappedLineAnnotations<T extends TimestampedValue>(
  values: T[],
  property: keyof T,
  label: string
) {
  const { formatDateFromSeconds } = useIntl();

  return useMemo(() => {
    return values.reduce<TimespanAnnotationConfig[]>((newItems, item) => {
      const value = item[property] as unknown;
      if (!hasValue(value) && isDateSpanValue(item)) {
        newItems.push({
          start: item.date_start_unix,
          end: item.date_end_unix,
          label,
        });
      }
      return newItems;
    }, []);
  }, [values, property, label, formatDateFromSeconds]);
}

function hasValue(value: unknown) {
  return isBoolean(value) ? value === true : isPresent(value);
}
