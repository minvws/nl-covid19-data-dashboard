import { findLastIndex } from 'lodash';
import { isFilled, isPresent } from 'ts-is-present';

export function countTrailingNullValues<T>(values: T[], property?: keyof T) {
  const predicate = isPresent(property)
    ? (d: T) => isFilled(d[property])
    : (d: T) => isFilled(d);

  return values.length - findLastIndex<T>(values, predicate) - 1;
}
