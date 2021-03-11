import { Threshold } from '@visx/threshold';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { useUniqueId } from '~/utils/useUniqueId';
import { Bounds, SeriesDoubleValue, SeriesItem } from '../logic';

export type RangeTrendProps = {
  series: SeriesDoubleValue[];
  color: string;
  fillOpacity?: number;
  strokeWidth?: number;
  style?: 'solid' | 'hatched';
  bounds: Bounds;
  getX: (v: SeriesItem) => number;
  getY0: (v: SeriesDoubleValue) => number;
  getY1: (v: SeriesDoubleValue) => number;
};

export function RangeTrend({
  series,
  getX,
  getY0,
  getY1,
  bounds,
  color,
  fillOpacity = 0.6,
}: RangeTrendProps) {
  const id = useUniqueId();

  const nonNullSeries = useMemo(
    () =>
      series.filter((x) => isPresent(x.__value_a) && isPresent(x.__value_b)),
    [series]
  );

  return (
    /**
     * @TODO further implement styling. Not sure if Threshold is the best Visx
     * component to accomplish this.
     */
    <Threshold<SeriesDoubleValue>
      id={id}
      data={nonNullSeries}
      x={getX}
      y0={getY0}
      y1={getY1}
      clipAboveTo={0}
      clipBelowTo={bounds.height}
      belowAreaProps={{
        fill: color,
        fillOpacity,
      }}
      /**
       * When "value a" becomes higher than "value b", this will render the fill
       * in with different properties. We probably don't need this if our range
       * is always just a low and high value where the low never exceeds the
       * high.
       */
      aboveAreaProps={{
        fill: color,
        fillOpacity,
      }}
    />
  );
}
