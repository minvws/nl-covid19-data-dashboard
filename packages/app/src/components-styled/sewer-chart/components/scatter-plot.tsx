import { Group } from '@visx/group';
import { memo } from 'react';

interface ScatterPlotProps<T> {
  data: T[];
  getX: (datum: T) => number;
  getY: (datum: T) => number;
  color: string;
  r: number;
}

export const ScatterPlot = memo(
  ScatterPlotUnmemoized
) as typeof ScatterPlotUnmemoized;

function ScatterPlotUnmemoized<T extends { id: string }>({
  data,
  getX,
  getY,
  color,
  r,
}: ScatterPlotProps<T>) {
  return (
    <Group>
      {data.map((datum) => (
        <circle
          key={datum.id}
          cx={getX(datum)}
          cy={getY(datum)}
          fill={color}
          r={r}
        />
      ))}
    </Group>
  );
}
