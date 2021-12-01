import { findLastIndex } from 'lodash';
import { isFilled, isPresent } from 'ts-is-present';

/**
 * Return the number of trailing null values from the given value array.
 * If a property name is specified it is used to check each value item's
 * property for null.
 */
export function countTrailingNullValues<T>(values: T[], property?: keyof T) {
  const predicate = isPresent(property)
    ? (d: T) => isFilled(d[property])
    : (d: T) => isFilled(d);

  return values.length - findLastIndex<T>(values, predicate) - 1;
}
