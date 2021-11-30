import { countTrailingNullValues } from './count-trailing-null-values';

/**
 * Right trims all of the null values from the given array.
 * When the property parameter is defined this property will be
 * checked for null on each item.
 *
 * @param values The given array
 * @param property Optional property to checl
 * @returns A new array without the trailing null values
 */
export function trimNullValues<T>(values: T[], property?: keyof T) {
  const numberOfTrailingNulls = countTrailingNullValues(values, property);

  return values.slice(0, -numberOfTrailingNulls);
}
