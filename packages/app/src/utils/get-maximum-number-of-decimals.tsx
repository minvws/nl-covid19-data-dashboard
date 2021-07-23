/**
 * This utility will return the largest number of decimals used in a list of
 * values. Values like `[1.21, 1.5, 2]` will return `2` (1.21 has two decimals).
 */
export function getMaximumNumberOfDecimals(values: number[]) {
  return values.reduce(
    (max, value) => Math.max(max, value?.toString().split('.')[1]?.length || 0),
    0
  );
}
