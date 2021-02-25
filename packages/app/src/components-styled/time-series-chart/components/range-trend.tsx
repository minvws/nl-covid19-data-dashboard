import { AreaClosed } from '@visx/shape';
import { PositionScale } from '@visx/shape/lib/types';
import { MouseEvent, TouchEvent } from 'react';
import { TrendValue } from '../logic';

export type RangeTrendProps = {
  lowTrend: TrendValue[];
  highTrend: TrendValue[];
  color: string;
  fillOpacity?: number;
  strokeWidth?: number;
  style?: 'solid' | 'striped';
  getX: (v: TrendValue) => number;
  getY: (v: TrendValue) => number;
  yScale: PositionScale;
  onHover: (event: TouchEvent<SVGElement> | MouseEvent<SVGElement>) => void;
};

export function RangeTrend({
  lowTrend,
  highTrend: __highTrend,
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
      data={lowTrend}
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
