type ValuesWithLastValue<T> = {
  values: T[];
  last_value: T;
};

export function adjustDataToLastAccurateValue<T>(
  data: ValuesWithLastValue<T>,
  numberOfItems: number,
  metricProperty?: string
) {
  if (numberOfItems > data.values.length) {
    return data;
  }

  if (metricProperty && metricProperty in data.last_value) {
    return {
      ...data,
      last_value: {
        ...data.last_value,
        [metricProperty]:
          data.values[data.values.length - numberOfItems - 1][
            metricProperty as keyof T
          ],
      },
    };
  }

  return {
    ...data,
    last_value: data.values[data.values.length - numberOfItems - 1],
  };
}

export function isValuesWithLastValue<T>(
  data: any
): data is ValuesWithLastValue<T> {
  return 'values' in data && 'last_value' in data;
}
