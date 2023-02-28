import { findIndex } from 'lodash';
import { isFilled, isPresent } from 'ts-is-present';

/**
 * Return the number of leading null values from the given value array.
 * If a property name is specified it is used to check each value item's
 * property for null.
 */
export const countLeadingNullValues = <T>(values: T[], property?: keyof T) => {
  const predicate = isPresent(property) ? (d: T) => isFilled(d[property]) : (d: T) => isFilled(d);

  return findIndex<T>(values, predicate);
};
