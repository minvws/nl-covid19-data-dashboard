import { isFilled, isPresent } from 'ts-is-present';

/**
 * Return the number of leading null values from the given value array.
 * If a property name is specified it is used to check each value item's
 * property for null.
 *
 * @param values - The given array
 * @param property - Optional property to check
 * @returns The index of the last element in the array meeting the predicate
 */
export const countLeadingNullValues = <T>(values: T[], property?: keyof T) => {
  const predicate = (value: T) => isFilled(isPresent(property) ? value[property] : value);

  return values.findIndex((value) => predicate(value));
};
