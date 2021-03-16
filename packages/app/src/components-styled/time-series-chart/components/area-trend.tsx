import { TimestampedValue } from '@corona-dashboard/common';
import { AreaClosed, LinePath } from '@visx/shape';
import { PositionScale } from '@visx/shape/lib/types';
import { MouseEvent, TouchEvent, useCallback, useState } from 'react';
import { AreaSeriesDefinition, SeriesItem, SeriesSingleValue } from '../logic';

const DEFAULT_FILL_OPACITY = 0.2;
const DEFAULT_STROKE_WIDTH = 2;

type AreaTrendProps = {
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
  fillOpacity = DEFAULT_FILL_OPACITY,
  strokeWidth = DEFAULT_STROKE_WIDTH,
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

interface AreaTrendIconProps<T extends TimestampedValue> {
  config: AreaSeriesDefinition<T>;
  width?: number;
  height?: number;
}

export function AreaTrendIcon<T extends TimestampedValue>({
  config,
  width = 15,
  height = 15,
}: AreaTrendIconProps<T>) {
  const {
    color,
    fillOpacity = DEFAULT_FILL_OPACITY,
    strokeWidth = DEFAULT_STROKE_WIDTH,
  } = config;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <line
        stroke={color}
        strokeWidth={strokeWidth}
        x1={0}
        y1={strokeWidth / 2}
        x2={width}
        y2={strokeWidth / 2}
      />
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
