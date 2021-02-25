import { AreaClosed } from '@visx/shape';
import { PositionScale } from '@visx/shape/lib/types';
import { MouseEvent, TouchEvent } from 'react';
import { TrendValue } from '../logic';

export type AreaTrendProps = {
  trend: TrendValue[];
  color: string;
  fillOpacity?: number;
  strokeWidth?: number;
  style?: 'solid' | 'striped';
  getX: (v: TrendValue) => number;
  getY: (v: TrendValue) => number;
  yScale: PositionScale;
  onHover: (event: TouchEvent<SVGElement> | MouseEvent<SVGElement>) => void;
};

export function AreaTrend({
  trend,
  fillOpacity = 0.05,
  strokeWidth,
  color,
  getX,
  getY,
  yScale,
  onHover,
}: AreaTrendProps) {
  return (
    <AreaClosed
      style={{ pointerEvents: 'all' }}
      data={trend}
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
