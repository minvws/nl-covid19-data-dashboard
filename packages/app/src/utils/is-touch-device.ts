/**
 * Check wether a user is using a touch device.
 * @returns boolean
 */
export function isTouchDevice() {
  return typeof window !== 'undefined' && ('ontouchstart' in window || window.navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches);
}
