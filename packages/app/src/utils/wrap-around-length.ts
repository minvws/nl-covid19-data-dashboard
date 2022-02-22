import { assert } from './assert';

/**
 * If the given value is greater than the given length it will return zero,
 * if the value is smaller than zero it return the given length -1,
 * otherwise it returns the given value
 */
export function wrapAroundLength(value: number, length: number) {
  assert(
    length > 0,
    `[${wrapAroundLength.name}] Can not wrap around length zero`
  );

  const maxValue = length - 1;

  if (value > maxValue) {
    return 0;
  }

  if (value < 0) {
    return maxValue;
  }

  return value;
}
