import { PositionScale } from '@visx/shape/lib/types';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { isPresent } from 'ts-is-present';
import { first, last } from 'lodash';
import { useCallback, MouseEvent, TouchEvent, useMemo, memo } from 'react';
import {
  SeriesItem,
  SeriesSingleValue,
} from '~/components/time-series-chart/logic';

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
  const nonNullSeries = useMemo(
    () => series.filter((x) => isPresent(x.__value)),
    [series]
  );

  const hoverBarHeight = useMemo(() => {
    const range = yScale.range();
    return Math.abs((first(range) as number) - (last(range) as number));
  }, [yScale]);

  const getRectPosition = useCallback(
    (value: SeriesSingleValue) => {
      const valuePosition = getY(value);
      const zeroPosition = yScale(0) as number;

      return {
        x: getX(value),
        y: Math.min(zeroPosition, valuePosition),
        height: Math.abs(zeroPosition - valuePosition),
      };
    },
    [yScale, getX, getY]
  );

  return (
    <Group>
      {nonNullSeries.map((item, index) => {
        const fillColor = item.__value
          ? item.__value > 0
            ? color
            : secondaryColor
          : 'transparent';

        const { x, y, height } = getRectPosition(item);
        return (
          <Group
            key={`bar-${index}`}
            onMouseLeave={(e) => onHover(e, index)}
            onMouseMove={(e) => onHover(e, index)}
            onTouchStart={(e) => onHover(e, index)}
          >
            <Bar
              /**
               * This captures mouse movements that align vertically
               * with the bar
               */
              fill={'transparent'}
              x={x}
              y={0}
              width={barWidth}
              height={hoverBarHeight}
            />
            <Bar
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
