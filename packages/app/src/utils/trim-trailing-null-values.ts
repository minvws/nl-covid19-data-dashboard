import { countTrailingNullValues } from './count-trailing-null-values';

/**
 * Trims all the trailing null values from the given array.
 * When the property parameter is defined, this property will be
 * checked for null on each item.
 *
 * @param values - The given array
 * @param property - Optional property to check
 * @returns A new array without the trailing null values
 */
export const trimTrailingNullValues = <T>(values: T[], property?: keyof T) => {
  const numberOfTrailingNulls = countTrailingNullValues(values, property);
  if (!numberOfTrailingNulls) return values;

  return values.slice(0, -numberOfTrailingNulls);
};
