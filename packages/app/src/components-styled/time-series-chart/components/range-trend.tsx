import { AreaClosed } from '@visx/shape';
import { PositionScale } from '@visx/shape/lib/types';
import { MouseEvent, TouchEvent } from 'react';
import { SeriesValue } from '../logic';

export type RangeTrendProps = {
  seriesLow: SeriesValue[];
  seriesHigh: SeriesValue[];
  color: string;
  fillOpacity?: number;
  strokeWidth?: number;
  style?: 'solid' | 'striped';
  getX: (v: SeriesValue) => number;
  getY: (v: SeriesValue) => number;
  yScale: PositionScale;
  onHover: (event: TouchEvent<SVGElement> | MouseEvent<SVGElement>) => void;
};

export function RangeTrend({
  seriesLow,
  seriesHigh: __seriesHigh,
  fillOpacity = 0.05,
  strokeWidth,
  color,
  getX,
  getY,
  yScale,
  onHover,
}: RangeTrendProps) {
  return (
    /**
     * @TODO implement range rendering
     */
    <AreaClosed
      style={{ pointerEvents: 'all' }}
      data={seriesLow}
      x={getX}
      y={getY}
      fill={color}
      fillOpacity={fillOpacity}
      yScale={yScale}
      stroke={color}
      strokeWidth={strokeWidth}
      onTouchStart={onHover}
      onMouseLeave={onHover}
      onMouseOver={onHover}
      onMouseMove={onHover}
    />
  );
}
