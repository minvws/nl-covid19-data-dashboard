import { assert } from '~/utils/assert';

export function getItemFromArray<T>(arr: T[], index: number): T {
  const item = arr[index];
  assert(index >= 0 && index < arr.length, `Index ${index} is out of range`);
  return item;
}
