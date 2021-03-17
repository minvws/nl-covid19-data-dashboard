import { TimestampedValue } from '@corona-dashboard/common';
import { LinePath } from '@visx/shape';
import { PositionScale } from '@visx/shape/lib/types';
import { Group } from '@visx/group';
import { MouseEvent, TouchEvent, useCallback, useState } from 'react';
import { SeriesItem, SeriesSingleValue } from '../logic';

type BarTrendProps = {
  series: SeriesSingleValue[];
  color: string;
  getX: (v: SeriesItem) => number;
  getY: (v: SeriesSingleValue) => number;
  yScale: PositionScale;
  onHover: (event: TouchEvent<SVGElement> | MouseEvent<SVGElement>) => void;
};

export function BarTrend({
  series,
  color,
  getX,
  getY,
  yScale,
  onHover,
}: BarTrendProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = useCallback(
    (event: TouchEvent<SVGElement> | MouseEvent<SVGElement>) => {
      const isLeave = event.type === 'mouseleave';
      setIsHovered(!isLeave);
      onHover(event);
    },
    [onHover]
  );

  const getRectPosition = getRectPositionFunction(yScale(0), getX, getY);

  return (
    <Group>
      {series.map((value, index) => {
        const barId = `bar-${index}`;
        const fillColor = color;

        const { x, y, width, height } = getRectPosition(value);
        return (
          <rect
            id={barId}
            key={barId}
            fill={fillColor}
            onMouseLeave={handleHover}
            onMouseMove={handleHover}
            onTouchStart={handleHover}
            x={x}
            y={y}
            width={width}
            height={height}
          />
        );
      })}
    </Group>
  );
}

function getRectPositionFunction(
  zeroPosition: number,
  getX: (v: SeriesItem) => number,
  getY: (v: SeriesSingleValue) => number
) {
  return function getRectPosition(value: SeriesSingleValue) {
    const valuePosition = getY(value);

    return {
      x: getX(value),
      y: Math.min(zeroPosition, valuePosition),
      width: 10,
      height: Math.abs(zeroPosition - valuePosition),
    };
  };
}
