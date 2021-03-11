import { LinePath } from '@visx/shape';
import { MouseEvent, TouchEvent, useCallback, useMemo, useState } from 'react';
import { isPresent } from 'ts-is-present';
import { SeriesItem, SeriesSingleValue } from '../logic';

export type LineStyle = 'solid' | 'dashed';

export type LineTrendProps = {
  series: SeriesSingleValue[];
  color: string;
  style?: 'solid' | 'dashed';
  strokeWidth?: number;
  getX: (v: SeriesItem) => number;
  getY: (v: SeriesSingleValue) => number;
  onHover: (event: TouchEvent<SVGElement> | MouseEvent<SVGElement>) => void;
};

export function LineTrend({
  series,
  style = 'solid',
  strokeWidth = 2,
  color,
  getX,
  getY,
  onHover,
}: LineTrendProps) {
  const [isHovered, setIsHovered] = useState(false);

  const nonNullSeries = useMemo(
    () => series.filter((x) => isPresent(x.__value)),
    [series]
  );

  const handleHover = useCallback(
    (event: TouchEvent<SVGElement> | MouseEvent<SVGElement>) => {
      const isLeave = event.type === 'mouseleave';
      setIsHovered(!isLeave);
      onHover(event);
    },
    [onHover]
  );

  const strokeDasharray = style === 'dashed' ? 4 : undefined;

  return (
    <LinePath
      data={nonNullSeries}
      x={getX}
      y={getY}
      stroke={color}
      strokeWidth={isHovered ? strokeWidth + 1 : strokeWidth}
      strokeDasharray={strokeDasharray}
      onTouchStart={handleHover}
      onMouseLeave={handleHover}
      onMouseOver={handleHover}
      onMouseMove={handleHover}
    />
  );
}
