import { assert } from './assert';

export function wrapAroundLength(value: number, length: number) {
  assert(length > 0, 'Can not wrap around length zero');

  const maxValue = length - 1;

  if (value > maxValue) {
    return 0;
  }

  if (value < 0) {
    return maxValue;
  }

  return value;
}
