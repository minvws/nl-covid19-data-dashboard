import { AreaClosed, LinePath } from '@visx/shape';
import { PositionScale } from '@visx/shape/lib/types';
import { MouseEvent, TouchEvent, useState } from 'react';
import { SeriesValue } from '../logic';

export type AreaTrendProps = {
  series: SeriesValue[];
  color: string;
  fillOpacity?: number;
  strokeWidth?: number;
  style?: 'solid' | 'striped';
  getX: (v: SeriesValue) => number;
  getY: (v: SeriesValue) => number;
  yScale: PositionScale;
  onHover: (event: TouchEvent<SVGElement> | MouseEvent<SVGElement>) => void;
};

export function AreaTrend({
  series,
  fillOpacity = 0.05,
  strokeWidth = 2,
  color,
  getX,
  getY,
  yScale,
  onHover,
}: AreaTrendProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = (
    event: TouchEvent<SVGElement> | MouseEvent<SVGElement>
  ) => {
    const isLeave = event.type === 'mouseleave';
    setIsHovered(!isLeave);
    onHover(event);
  };

  return (
    <>
      <LinePath
        style={{ pointerEvents: 'all' }}
        data={series}
        x={getX}
        y={getY}
        stroke={color}
        strokeWidth={isHovered ? strokeWidth + 1 : strokeWidth}
        onTouchStart={handleHover}
        onMouseLeave={handleHover}
        onMouseOver={handleHover}
        onMouseMove={handleHover}
      />
      <AreaClosed
        style={{ pointerEvents: 'all' }}
        data={series}
        x={getX}
        y={getY}
        fill={color}
        fillOpacity={fillOpacity}
        yScale={yScale}
        // stroke={color}
        // strokeWidth={strokeWidth}
        onTouchStart={handleHover}
        onMouseLeave={handleHover}
        onMouseOver={handleHover}
        onMouseMove={handleHover}
      />
    </>
  );
}
