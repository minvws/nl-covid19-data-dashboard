import { sizes } from '@corona-dashboard/common';

// find closest resized element
export function findClosestSize(width: number) {
  return sizes.reduce((a: number, b: number) => {
    const aDiff = Math.abs(a - width);
    const bDiff = Math.abs(b - width);

    if (aDiff == bDiff) {
      return a > b ? a : b;
    } else {
      return bDiff < aDiff ? b : a;
    }
  });
}
