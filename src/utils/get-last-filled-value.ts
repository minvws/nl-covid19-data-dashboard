import { every, get } from 'lodash';
import { isFilled } from 'ts-is-present';
import { MetricKeys } from '~/components/choropleth/shared';
import { assert } from './assert';

/**
 * This function attempts to get the lastValue but then checks whether all
 * properties contain values that are non-null. If null values are detected then
 * we iterate over the values array, starting with the most recent values, and
 * return the first value that is completely filled.
 *
 * If no value is found an exception is thrown.
 */
export function getLastFilledValue<T>(
  data: T,
  metricName: ValueOf<MetricKeys<T>>
) {
  const lastValue = get(data, [
    (metricName as unknown) as string,
    'last_value',
  ]);

  if (hasAllPropertiesFilled(lastValue)) {
    return lastValue;
  }

  // console.log('+++ get last full item from values array');
  const values = get(data, [(metricName as unknown) as string, 'values']);

  assert(values, `Unable to find ${metricName}.values[]`);

  /**
   * Start iterating over the most recent values. Do not mutate because it will
   * flip the charts x-axis.
   */
  const reversedValues = [...values].reverse() as Record<string, unknown>[];

  for (const value of reversedValues) {
    if (hasAllPropertiesFilled(value)) {
      return value;
    }
  }
  throw new Error(
    `Failed to find full non-null object for ${metricName}.values[]}`
  );
}

function hasAllPropertiesFilled(x: Record<string, unknown>) {
  return every(Object.values(x), isFilled);
}
