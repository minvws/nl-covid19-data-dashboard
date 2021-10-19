import { countTrailingNullValues } from './count-trailing-null-values';

export function trimNullValues<T>(values: T[], property?: keyof T) {
  const numberOfTrailingNulls = countTrailingNullValues(values, property);

  return values.slice(0, -numberOfTrailingNulls);
}
