import { isPresent } from 'ts-is-present';
import { countTrailingNullValues } from './count-trailing-null-values';

type ValuesWithLastValue<T> = {
  values: T[];
  last_value: T;
};

/**
 *
 */
export function adjustDataToLastAccurateValue<T>(
  data: ValuesWithLastValue<T>,
  metricProperty?: keyof T
) {
  const numberOfTrailingNullValues = countTrailingNullValues(
    data.values,
    metricProperty
  );

  if (
    numberOfTrailingNullValues >= data.values.length ||
    numberOfTrailingNullValues === 0
  ) {
    return data;
  }

  if (metricProperty && metricProperty in data.last_value) {
    return {
      ...data,
      last_value: {
        ...data.last_value,
        [metricProperty]:
          data.values[data.values.length - numberOfTrailingNullValues - 1][
            metricProperty as keyof T
          ],
      },
    };
  }

  return {
    ...data,
    last_value:
      data.values[data.values.length - numberOfTrailingNullValues - 1],
  };
}

export function isValuesWithLastValue<T>(
  data: any
): data is ValuesWithLastValue<T> {
  if (isPresent(data) && typeof data === 'object') {
    return 'values' in data && 'last_value' in data;
  }
  return false;
}
