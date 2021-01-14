// find closest resized element
export function findClosestSize(width: number) {
  const sizes = [320, 640, 768, 1024, 1280, 1536, 2048];

  return sizes.reduce((a, b) => {
    const aDiff = Math.abs(a - width);
    const bDiff = Math.abs(b - width);

    if (aDiff == bDiff) {
      return a > b ? a : b;
    } else {
      return bDiff < aDiff ? b : a;
    }
  });
}
