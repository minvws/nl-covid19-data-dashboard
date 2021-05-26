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
  value?: number | null
) {
  const index = findSplitIndexForValue(splitPoints, value);

  return splitPoints[index];
}

export function findSplitIndexForValue(
  splitPoints: SplitPoint[],
  value?: number | null
) {
  /**
   * If the value is 0 or null we return the first split
   */
  if (!value) {
    return 0;
  }

  const index = splitPoints.findIndex((split) => split.value > value);

  return index === -1 ? splitPoints.length - 1 : index;
}
