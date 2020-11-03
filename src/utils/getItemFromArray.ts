import { assert } from '~/utils/assert';

export function getItemFromArray<T>(arr: T[], index: number): T {
  assert(index >= 0 && index < arr.length, `Index ${index} is out of range`);
  const item = arr[index];
  return item;
}
