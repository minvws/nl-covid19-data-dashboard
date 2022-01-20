/**
 * Check wether a user is using a touch device.
 * @returns boolean
 */
export function isTouchDevice() {
  return (
    (typeof window !== 'undefined' && 'ontouchstart' in window) ||
    (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0)
  );
}
