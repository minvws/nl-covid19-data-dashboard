import { isDefined } from 'ts-is-present';

export function validateMovingAverages(input: Record<string, any>) {
  const result = Object.entries(input)
    .filter(([_p, value]) => value.hasOwnProperty('values'))
    .filter(([_p, value]) => hasMovingAverages(value.values[0]))
    .map(([propertyName, value]) => ({
      [propertyName]: value.values.map((x: Record<string, unknown>) => {
        const movingAverageProperties = findMovingAverages(x);
        return movingAverageProperties.reduce((aggr, p) => {
          aggr[p] = x[p];
          return aggr;
        }, {} as Record<string, unknown>);
      }),
    }))
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
        const propsWithNullValuesInOtherEntries = hasNullValuesInOtherEntries(
          values
        );
        if (propsWithNullValuesInOtherEntries.length) {
          return `${propertyName} has NULL values in items above index 5 of metric ${propsWithNullValuesInOtherEntries.join(
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

function hasNullValuesInOtherEntries(values: Record<string, unknown>[]) {
  return values
    .slice(6)
    .map((x) =>
      Object.entries(x).map(([propertyName, value]) =>
        value === null ? propertyName : undefined
      )
    )
    .flat()
    .filter((x, index, arr) => index === arr.indexOf(x))
    .filter(isDefined);
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
