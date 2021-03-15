import { TimestampedValue } from '@corona-dashboard/common';
import { LinePath } from '@visx/shape';
import { MouseEvent, TouchEvent, useCallback, useState } from 'react';
import { LineSeriesDefinition, SeriesItem, SeriesSingleValue } from '../logic';

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
      data={series}
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

interface LineTrendIconProps<T extends TimestampedValue> {
  config: LineSeriesDefinition<T>;
  width?: number;
  height?: number;
}

export function LineTrendIcon<T extends TimestampedValue>({
  config,
  width = 15,
  height = 15,
}: LineTrendIconProps<T>) {
  const {
    color,
    strokeWidth = DEFAULT_STROKE_WIDTH,
    style = DEFAULT_STYLE,
  } = config;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <line
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={style === 'dashed' ? 4 : undefined}
        x1={0}
        y1={height / 2}
        x2={width}
        y2={height / 2}
      />
    </svg>
  );
}
