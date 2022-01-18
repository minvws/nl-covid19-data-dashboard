/**
 * Check wether a user is using a touch device.
 * @returns boolean
 */
export function isTouch() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
