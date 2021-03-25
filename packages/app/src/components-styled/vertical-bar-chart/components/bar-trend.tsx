import { PositionScale } from '@visx/shape/lib/types';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { first, last } from 'lodash';
import { MouseEvent, TouchEvent, useMemo, memo } from 'react';
import {
  SeriesItem,
  SeriesSingleValue,
} from '~/components-styled/time-series-chart/logic';

type BarTrendProps = {
  series: SeriesSingleValue[];
  color: string;
  secondaryColor?: string;
  getX: (v: SeriesItem) => number;
  getY: (v: SeriesSingleValue) => number;
  yScale: PositionScale;
  barWidth: number;
  onHover: (
    event: TouchEvent<SVGElement> | MouseEvent<SVGElement>,
    index: number
  ) => void;
};

export const BarTrend = memo(function BarTrend({
  series,
  color,
  secondaryColor = color,
  getX,
  getY,
  yScale,
  barWidth,
  onHover,
}: BarTrendProps) {
  const hoverBarHeight = useMemo(() => {
    const range = yScale.range();
    return Math.abs((first(range) as number) - (last(range) as number));
  }, [yScale]);

  const getRectPosition = getRectPositionFunction(
    yScale(0) as number,
    getX,
    getY
  );

  return (
    <Group>
      {series.map((value, index) => {
        const barId = `bar-${index}`;
        const fillColor = value.__value
          ? value.__value > 0
            ? color
            : secondaryColor
          : 'transparent';

        const { x, y, height } = getRectPosition(value);
        return (
          <Group
            onMouseLeave={(e) => onHover(e, index)}
            onMouseMove={(e) => onHover(e, index)}
            onTouchStart={(e) => onHover(e, index)}
          >
            <Bar
              /**
               * The captures mouse movements that align vertically
               * with the bar
               */
              id={`${barId}-hover`}
              key={`${barId}-hover`}
              fill={'transparent'}
              x={x}
              y={0}
              width={barWidth}
              height={hoverBarHeight}
            />
            <Bar
              id={barId}
              key={barId}
              fill={fillColor}
              x={x}
              y={y}
              width={barWidth}
              height={height}
            />
          </Group>
        );
      })}
    </Group>
  );
});

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
      height: Math.abs(zeroPosition - valuePosition),
    };
  };
}
