import { Threshold } from '@visx/threshold';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { Bounds, SeriesDoubleValue, SeriesItem } from '../logic';

const DEFAULT_FILL_OPACITY = 0.6;

type RangeTrendProps = {
  series: SeriesDoubleValue[];
  color: string;
  fillOpacity?: number;
  bounds: Bounds;
  getX: (v: SeriesItem) => number;
  getY0: (v: SeriesDoubleValue) => number;
  getY1: (v: SeriesDoubleValue) => number;
  id: string;
};

export function RangeTrend({
  series,
  getX,
  getY0,
  getY1,
  bounds,
  color,
  fillOpacity = DEFAULT_FILL_OPACITY,
  id,
}: RangeTrendProps) {
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

interface RangeTrendIconProps {
  color: string;
  fillOpacity?: number;
  width?: number;
  height?: number;
}

export function RangeTrendIcon({
  color,
  fillOpacity = DEFAULT_FILL_OPACITY,
  width = 15,
  height = 15,
}: RangeTrendIconProps) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={color}
        opacity={fillOpacity}
        rx={2}
      />
    </svg>
  );
}
