import { LinePath } from '@visx/shape';
import { Threshold } from '@visx/threshold';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { Bounds, SeriesDoubleValue, SeriesItem } from '../logic';

const DEFAULT_FILL_OPACITY = 0.6;

type StackedAreaTrendProps = {
  series: SeriesDoubleValue[];
  color: string;
  fillOpacity?: number;
  strokeWidth?: number;
  bounds: Bounds;
  getX: (v: SeriesItem) => number;
  getY0: (v: SeriesDoubleValue) => number;
  getY1: (v: SeriesDoubleValue) => number;
  id: string;
};

export function StackedAreaTrend({
  series,
  getX,
  getY0,
  getY1,
  bounds,
  color,
  fillOpacity = DEFAULT_FILL_OPACITY,
  strokeWidth = 2,
  id,
}: StackedAreaTrendProps) {
  const nonNullSeries = useMemo(
    () =>
      series.filter((x) => isPresent(x.__value_a) && isPresent(x.__value_b)),
    [series]
  );

  const isBottomSeries = series.map(getY0).every((x) => x === bounds.height);

  return (
    <g>
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
          id,
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

      {/**
       * The following LinePath is used as separator between series. The bottom
       * serie, which should touch the X-axis, shouldn't render its linePath
       * because that would overlap with the X-axis.
       */}
      {!isBottomSeries && strokeWidth > 0 && (
        <LinePath
          data={nonNullSeries}
          x={getX}
          y={getY0}
          stroke="white"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </g>
  );
}

interface StackedAreaTrendIconProps {
  color: string;
  fillOpacity?: number;
  width?: number;
  height?: number;
}

export function StackedAreaTrendIcon({
  color,
  fillOpacity = DEFAULT_FILL_OPACITY,
  width = 15,
  height = 15,
}: StackedAreaTrendIconProps) {
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
