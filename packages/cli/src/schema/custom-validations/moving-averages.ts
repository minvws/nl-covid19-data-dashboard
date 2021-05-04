import set from 'lodash/set';
import { isDefined } from 'ts-is-present';
import { JSONValue } from './types';

function hasValuesProperty(
  input: [string, JSONValue]
): input is [string, { values: Record<string, JSONValue>[] }] {
  return (
    input[1] !== null &&
    typeof input[1] === 'object' &&
    input[1].hasOwnProperty('values')
  );
}

export function validateMovingAverages(input: Record<string, JSONValue>) {
  const result = Object.entries(input)
    // first filter out all the non-metric properties (we only want the ones with a values collection)
    .filter(hasValuesProperty)
    // Then filter out all the metrics that contain no properties with a '_moving_average' suffix
    .filter(([_p, value]) => hasMovingAverages(value.values[0]))
    // Map to objects that ONLY contain the moving average properties
    .map(([propertyName, value]) => ({
      [propertyName]: value.values.map((x: Record<string, unknown>) => {
        const movingAverageProperties = findMovingAverages(x);
        return movingAverageProperties.reduce(
          (aggr, p) => set(aggr, p, x[p]),
          {} as Record<string, unknown>
        );
      }),
    }))
    // Perform the validations on those moving averages (make sure the first six items have explicit NULL values and check if there are no non-consecutive values in the rest of the array)
    .map((x) =>
      Object.entries(x).map(([propertyName, values]) => {
        const propsWithValuesInFirstSixEntries = hasValuesInFirstSixEntries(
          values
        );
        if (propsWithValuesInFirstSixEntries.length) {
          return `${propertyName} has non NULL values in the first six items of metric ${propsWithValuesInFirstSixEntries.join(
            ' and '
          )}`;
        }
        const propsWithNonConsecutiveValues = hasNonConsecutiveValues(values);
        if (propsWithNonConsecutiveValues.length) {
          return `${propertyName} has non consecutive values in metric ${propsWithNonConsecutiveValues.join(
            ' and '
          )}`;
        }
        return undefined;
      })
    )
    .flat()
    .filter(isDefined);

  return result.length ? result : undefined;
}

function hasNonConsecutiveValues(values: Record<string, unknown>[]) {
  const propertyNames = Object.keys(values[0]);
  return propertyNames.filter((propertyName) =>
    hasNonConsecutiveValuesInMetric(propertyName, values)
  );
}

function hasNonConsecutiveValuesInMetric(
  propertyName: string,
  collection: Record<string, unknown>[]
) {
  const values = collection.slice(6).map((x) => x[propertyName]);
  let lastValue;

  for (const value of values) {
    if (lastValue === null && value !== null) {
      return true;
    }

    lastValue = value;
  }

  return false;
}

function hasValuesInFirstSixEntries(values: Record<string, unknown>[]) {
  return values
    .slice(0, 5)
    .map((x) =>
      Object.entries(x).map(([propertyName, value]) =>
        value !== null ? propertyName : undefined
      )
    )
    .flat()
    .filter((x, index, arr) => index === arr.indexOf(x))
    .filter(isDefined);
}

function hasMovingAverages(input: Record<string, unknown>) {
  return findMovingAverages(input).length > 0;
}

function findMovingAverages(input: Record<string, unknown>) {
  return Object.keys(input).filter((x) => x.endsWith('_moving_average'));
}
