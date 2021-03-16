import { LinePath } from '@visx/shape';
import { MouseEvent, TouchEvent, useCallback, useMemo, useState } from 'react';
import { isPresent } from 'ts-is-present';
import { SeriesItem, SeriesSingleValue } from '../logic';

export type LineStyle = 'solid' | 'dashed';

const DEFAULT_STYLE = 'solid';
const DEFAULT_STROKE_WIDTH = 2;

type LineTrendProps = {
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
  style = DEFAULT_STYLE,
  strokeWidth = DEFAULT_STROKE_WIDTH,
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
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

interface LineTrendIconProps {
  color: string;
  style?: 'solid' | 'dashed';
  strokeWidth?: number;
  width?: number;
  height?: number;
}

export function LineTrendIcon({
  color,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  style = DEFAULT_STYLE,
  width = 15,
  height = 15,
}: LineTrendIconProps) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <line
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={style === 'dashed' ? 4 : undefined}
        strokeLinecap="round"
        strokeLinejoin="round"
        x1={2}
        y1={height / 2}
        x2={width - 2}
        y2={height / 2}
      />
    </svg>
  );
}
