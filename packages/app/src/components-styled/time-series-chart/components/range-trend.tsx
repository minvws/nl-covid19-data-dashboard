import { TimestampedValue } from '@corona-dashboard/common';
import { Threshold } from '@visx/threshold';
import { useUniqueId } from '~/utils/useUniqueId';
import {
  Bounds,
  RangeSeriesDefinition,
  SeriesDoubleValue,
  SeriesItem,
} from '../logic';

const DEFAULT_FILL_OPACITY = 0.6;

type RangeTrendProps = {
  series: SeriesDoubleValue[];
  color: string;
  fillOpacity?: number;
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
  fillOpacity = DEFAULT_FILL_OPACITY,
}: RangeTrendProps) {
  const id = useUniqueId();

  return (
    /**
     * @TODO further implement styling. Not sure if Threshold is the best Visx
     * component to accomplish this.
     */
    <Threshold<SeriesDoubleValue>
      id={id}
      data={series}
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

interface RangeTrendIconProps<T extends TimestampedValue> {
  config: RangeSeriesDefinition<T>;
  width?: number;
  height?: number;
}

export function RangeTrendIcon<T extends TimestampedValue>({
  config,
  width = 15,
  height = 15,
}: RangeTrendIconProps<T>) {
  const { color, fillOpacity = DEFAULT_FILL_OPACITY } = config;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={color}
        opacity={fillOpacity}
      />
    </svg>
  );
}
