import { countLeadingNullValues } from './count-leading-null-values';

/**
 * Trims all the leading null values from the given array.
 * When the property parameter is defined, this property will be
 * checked for null on each item.
 *
 * @param values - The given array
 * @param property - Optional property to check
 * @returns The existing array without the leading null values
 */
export const trimLeadingNullValues = <T>(values: T[], property?: keyof T) => {
  const numberOfLeadingNulls = countLeadingNullValues(values, property);

  return values.slice(numberOfLeadingNulls);
};
