import { first } from 'lodash';
import { SeriesSingleValue } from './series';

export type SplitPoint = {
  value: number;
  color: string;
  label: string;
};

export type Segment = { items: SeriesSingleValue[]; splitIndex: number };

export function splitSeriesIntoSegments(
  series: SeriesSingleValue[],
  splitPoints: SplitPoint[]
) {
  let segmentCounter = 0;

  /**
   * Keep a running split index. Whenever the value enters a different
   * split-point it is detected by a change in index, and the loop will start
   * recording items to a new segment. The initial segment split index is based
   * on the value of the first series item.
   */
  let runningSplitIndex = findSplitIndexForValue(
    splitPoints,
    first(series)?.__value
  );

  const segments: Segment[] = [{ items: [], splitIndex: runningSplitIndex }];

  for (const item of series) {
    const splitIndex = findSplitIndexForValue(splitPoints, item.__value);

    if (splitIndex !== runningSplitIndex) {
      segments[++segmentCounter] = { items: [], splitIndex };
      runningSplitIndex = splitIndex;
    }

    segments[segmentCounter].items.push(item);
  }

  return segments;
}

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
