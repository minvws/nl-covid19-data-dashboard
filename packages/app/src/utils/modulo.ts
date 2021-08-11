/**
 * Always give back a positive number based on your current and maximum.
 * For example floorMudulo8, 5) => 3
 */

export function floorModulo(current: number, max: number) {
  return ((current % max) + max) % max;
}
