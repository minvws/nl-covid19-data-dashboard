/**
 * find closest size, but not smaller than given size. When there's no match
 * it will return the biggest size.
 * eg: `findClosestSize(320, [300, 400]) === 400`
 */
export function findClosestSize(size: number, sizes: number[]) {
  const match = sizes.sort((a, b) => a - b).find((x) => x >= size);
  return match || sizes[sizes.length - 1];
}
