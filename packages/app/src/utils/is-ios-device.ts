export function isIOSDevice() {
  return /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
}
