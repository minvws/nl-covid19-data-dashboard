import { findLastIndex } from 'lodash';
import { isPresent } from 'ts-is-present';

export function countTrailingNullValues<T>(values: T[], property?: keyof T) {
  return isPresent(property)
    ? values.length - findLastIndex(values, (d) => d[property] !== null) - 1
    : values.length - findLastIndex(values, (d) => d !== null);
}
