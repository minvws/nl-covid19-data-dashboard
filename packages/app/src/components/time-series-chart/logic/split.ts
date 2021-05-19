import { isPresent } from 'ts-is-present';
import { first, last } from 'lodash';

export type SplitPoint = {
  value: number;
  color: string;
  label: string;
};

/**
 * Find the split point belonging to the given value.
 *
 * Each split is defined with a value that is the boundary to the next color. So
 * we can pick the first split where the value is below the split value.
 *
 * Not entirely sure that the logic should be here, since values can also be
 * null and what icon/color do you want to show in something like the tooltip. I
 * went for the first split point.
 */
export function findSplitPointForValue(
  splitPoints: SplitPoint[],
  value: number | null
) {
  if (!isPresent(value)) {
    first(splitPoints) as SplitPoint;
  }

  for (const split of splitPoints) {
    if (isPresent(value) && value < split.value) {
      return split;
    }
  }

  return last(splitPoints) as SplitPoint;
}
