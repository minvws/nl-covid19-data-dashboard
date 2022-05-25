import { DAY_IN_SECONDS } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { SeriesItem, SeriesSingleValue } from '../logic';
import { Group } from '@visx/group';

const DEFAULT_DOT_SIZE = 3;

type LineTrendProps = {
  series: SeriesSingleValue[];
  color: string;
  getX: (v: SeriesItem) => number;
  getY: (v: SeriesSingleValue) => number;
  id: string;
};

export function ScatterPlot({ series, color, getX, getY, id }: LineTrendProps) {
  const nonNullSeries = useMemo(() => {
    let nonNull = series.filter((x) => isPresent(x.__value));
    if (nonNull.length === 1) {
      nonNull = [
        {
          __date_unix: nonNull[0].__date_unix - DAY_IN_SECONDS,
          __value: nonNull[0].__value,
        },
        {
          __date_unix: nonNull[0].__date_unix + DAY_IN_SECONDS,
          __value: nonNull[0].__value,
        },
      ];
    }
    return nonNull;
  }, [series]);

  if (!nonNullSeries.length) {
    return null;
  }

  return (
    <Group>
      {nonNullSeries.map((d, i) => (
        <circle
          key={i}
          id={`${id}-${i}`}
          r={DEFAULT_DOT_SIZE}
          cx={getX(d)}
          cy={getY(d)}
          fill={color}
        />
      ))}
    </Group>
  );
}

interface ScatterPlotIconProps {
  color: string;
  radius?: number;
  width?: number;
  height?: number;
}

export function ScatterPlotIcon({
  color,
  width = 15,
  height = 15,
  radius = 3,
}: ScatterPlotIconProps) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <circle
        r={Math.min(width / 2, radius)}
        fill={color}
        cy={height / 2}
        cx={width / 2}
      />
    </svg>
  );
}
