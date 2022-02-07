/**
 * Check wether a user is using a touch device.
 * @returns boolean
 */
export function isTouchDevice() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches
  );
}
