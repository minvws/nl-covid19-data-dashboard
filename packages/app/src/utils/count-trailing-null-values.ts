import { findLastIndex } from 'lodash';
import { isFilled, isPresent } from 'ts-is-present';

/**
 * Return the number of trailing null values from the given value array.
 * If a property name is specified it is used to check each value item's
 * property for null.
 *
 * @param values - The given array
 * @param property - Optional property to check
 * @returns The index of the last element in the array meeting the predicate
 */
export const countTrailingNullValues = <T>(values: T[], property?: keyof T) => {
  const predicate = isPresent(property) ? (value: T) => isFilled(value[property]) : (value: T) => isFilled(value);

  return values.length - findLastIndex<T>(values, predicate) - 1;
};
