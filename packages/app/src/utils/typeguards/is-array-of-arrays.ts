export function isArrayOfArrays(
  values: unknown[] | unknown[][]
): values is unknown[][] {
  return Array.isArray(values[0]);
}
