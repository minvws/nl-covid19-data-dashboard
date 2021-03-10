import { AreaClosed, LinePath } from '@visx/shape';
import { PositionScale } from '@visx/shape/lib/types';
import { MouseEvent, TouchEvent, useCallback, useState } from 'react';
import { SeriesItem, SeriesSingleValue } from '../logic';

export type AreaTrendProps = {
  series: SeriesSingleValue[];
  color: string;
  fillOpacity?: number;
  strokeWidth?: number;
  style?: 'solid' | 'striped';
  getX: (v: SeriesItem) => number;
  getY: (v: SeriesSingleValue) => number;
  yScale: PositionScale;
  onHover: (event: TouchEvent<SVGElement> | MouseEvent<SVGElement>) => void;
};

export function AreaTrend({
  series,
  fillOpacity = 0.2,
  strokeWidth = 2,
  color,
  getX,
  getY,
  yScale,
  onHover,
}: AreaTrendProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = useCallback(
    (event: TouchEvent<SVGElement> | MouseEvent<SVGElement>) => {
      const isLeave = event.type === 'mouseleave';
      setIsHovered(!isLeave);
      onHover(event);
    },
    [onHover]
  );

  return (
    <>
      <LinePath
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
        data={series}
        x={getX}
        y={getY}
        fill={color}
        fillOpacity={fillOpacity}
        yScale={yScale}
        onTouchStart={handleHover}
        onMouseLeave={handleHover}
        onMouseOver={handleHover}
        onMouseMove={handleHover}
      />
    </>
  );
}
