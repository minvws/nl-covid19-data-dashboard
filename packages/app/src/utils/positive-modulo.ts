/**
 * Always give back a positive number based on your current and maximum.
 * For example positiveModulo(8, 5) => 3
 *
 * https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
 */
export function positiveModulo(current: number, max: number) {
  return ((current % max) + max) % max;
}
