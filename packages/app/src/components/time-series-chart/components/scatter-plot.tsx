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

export function ScatterPlot({
  series: dataSeries,
  color,
  getX,
  getY,
  id,
}: LineTrendProps) {
  const series = useMemo(
    () => dataSeries.filter((x) => isPresent(x.__value)),
    [dataSeries]
  );

  return series.length === 0 ? null : (
    <Group>
      {series.map((data, i) => (
        <circle
          key={i}
          id={`${id}-${i}`}
          r={DEFAULT_DOT_SIZE}
          cx={getX(data)}
          cy={getY(data)}
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
