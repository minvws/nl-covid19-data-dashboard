import { isDefined } from 'ts-is-present';

export function validateMovingAverages(input: Record<string, any>) {
  const result = Object.entries(input)
    // first filter out all the non-metric properties (we only want the ones with a values collection)
    .filter(([_p, value]) => value.hasOwnProperty('values'))
    // Then filter out all the metrics that contain no properties with a '_moving_average' suffix
    .filter(([_p, value]) => hasMovingAverages(value.values[0]))
    // Map to objects that ONLY contain the moving average properties
    .map(([propertyName, value]) => ({
      [propertyName]: value.values.map((x: Record<string, unknown>) => {
        const movingAverageProperties = findMovingAverages(x);
        return movingAverageProperties.reduce((aggr, p) => {
          aggr[p] = x[p];
          return aggr;
        }, {} as Record<string, unknown>);
      }),
    }))
    // Perform the validations on those moving averages
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
        const propsWithNonConsecutiveNullValues = hasNonConsecutiveNullValues(
          values
        );
        if (propsWithNonConsecutiveNullValues.length) {
          return `${propertyName} has non consecutive NULL values in metric ${propsWithNonConsecutiveNullValues.join(
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

function hasNonConsecutiveNullValues(values: Record<string, unknown>[]) {
  const trailingValues = values.slice(6);
  if (!trailingValues.length) {
    return [];
  }
  const propertyNames = Object.keys(trailingValues[0]);
  return propertyNames.filter((propertyName) =>
    hasNonConsecutiveNullValuesInMetric(propertyName, trailingValues)
  );
}

function hasNonConsecutiveNullValuesInMetric(
  propertyName: string,
  collection: Record<string, unknown>[]
) {
  let i = -1;
  let currentValue: unknown = '-';
  while (isDefined(currentValue)) {
    currentValue = collection[++i]?.[propertyName];
    if (currentValue === null) {
      while (currentValue === null) {
        currentValue = collection[++i]?.[propertyName];
      }
      if (
        currentValue !== null &&
        currentValue !== undefined &&
        i < collection.length
      ) {
        return true;
      }
    }
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
