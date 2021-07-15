export function getConsistentNumberFormatter(
  values: number[],
  format: (
    value: number,
    options?: {
      maximumFractionDigits?: number;
      minimumFractionDigits?: number;
    }
  ) => string
) {
  const numOfDecimals = values.reduce((max, value) => {
    return Math.max(max, value?.toString().split('.')[1]?.length || 0);
  }, 0);

  return (value: number) => {
    return format(value, {
      minimumFractionDigits: numOfDecimals,
      maximumFractionDigits: numOfDecimals,
    });
  };
}

export function getMaxNumOfDecimals(values: number[]) {
  return values.reduce(
    (max, value) => Math.max(max, value?.toString().split('.')[1]?.length || 0),
    0
  );
}
