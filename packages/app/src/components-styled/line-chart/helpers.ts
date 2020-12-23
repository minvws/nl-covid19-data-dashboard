import { isDefined } from 'ts-is-present';

export type Value = {
  date: number;
  value?: number;
};

/**
 * From all the defined values, extract the highest number so we know how to
 * scale the y-axis
 */
export function calculateYMax(values: Value[], signaalwaarde = -Infinity) {
  const maxValue = values
    .map((x) => x.value)
    .filter(isDefined)
    .reduce((acc, value) => (value > acc ? value : acc), -Infinity);

  /**
   * Value cannot be 0, hence the 1
   * If the value is below signaalwaarde, make sure the signaalwaarde floats in the middle
   */
  return Math.max(maxValue, signaalwaarde * 2, 1);
}
