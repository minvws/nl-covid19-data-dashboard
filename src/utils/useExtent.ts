import { useMemo } from 'react';

/**
 * This hook returns the minimum and maximum values for the given array.
 * Optionally a predicate can be passed in to extract the number values from the given array.
 *
 * @param collection the given array
 * @param predicate the optional predicate
 */
export default function useExtent(
  collection?: any[],
  predicate?: (item: any) => number
): [number, number] | undefined {
  return useMemo(() => {
    if (!collection?.length) {
      return undefined;
    }
    const numberCollection = predicate
      ? collection.map<number>(predicate)
      : collection;

    const min = Math.min(...numberCollection);
    const max = Math.max(...numberCollection);
    return [min !== Infinity ? min : 0, max !== -Infinity ? max : 0];
  }, [collection, predicate]);
}
