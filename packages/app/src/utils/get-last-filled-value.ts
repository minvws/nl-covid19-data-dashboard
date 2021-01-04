import { every } from 'lodash';
import { isFilled } from 'ts-is-present';
import { Metric } from '~/components/choropleth/shared';

/**
 * This function attempts to get the lastValue but then checks whether all
 * properties contain values that are non-null. If null values are detected then
 * we iterate over the values array, starting with the most recent values, and
 * return the first value that is completely filled.
 *
 * If no value is found an exception is thrown.
 */
export function getLastFilledValue<T>(metric: Metric<T>) {
  const lastValue = metric.last_value as Record<string, unknown>;

  if (hasAllPropertiesFilled(lastValue)) {
    return lastValue as T;
  }

  const values = metric.values;

  /**
   * Start iterating over the most recent values. Do not mutate because it will
   * flip the charts x-axis.
   */
  const reversedValues = [...values].reverse() as Record<string, unknown>[];

  for (const value of reversedValues) {
    if (hasAllPropertiesFilled(value)) {
      return value as T;
    }
  }

  throw new Error(
    `Failed to find full non-null object for data shaped like ${JSON.stringify(
      lastValue
    )}`
  );
}

function hasAllPropertiesFilled(x: Record<string, unknown>) {
  return every(Object.values(x), isFilled);
}
