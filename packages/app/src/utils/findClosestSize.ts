import { imageResizeTargets } from '@corona-dashboard/common/src/config';

// find closest resized element
export function findClosestSize(width: number) {
  return imageResizeTargets.reduce((a: number, b: number) => {
    const aDiff = Math.abs(a - width);
    const bDiff = Math.abs(b - width);

    if (aDiff == bDiff) {
      return a > b ? a : b;
    } else {
      return bDiff < aDiff ? b : a;
    }
  });
}
