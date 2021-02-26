import { Group } from '@visx/group';
import { memo } from 'react';

interface ScatterPlotProps<T> {
  data: T[];
  getX: (datum: T) => number;
  getY: (datum: T) => number;
  color: string;
  radius: number;
  dottedOutline?: boolean;
}

export const ScatterPlot = memo(
  ScatterPlotUnmemoized
) as typeof ScatterPlotUnmemoized;

function ScatterPlotUnmemoized<T extends { id: string }>({
  data,
  getX,
  getY,
  color,
  radius: r,
  dottedOutline: dotted,
}: ScatterPlotProps<T>) {
  return (
    <Group>
      {data.map((datum) => (
        <circle
          key={datum.id}
          cx={getX(datum)}
          cy={getY(datum)}
          fill={dotted ? 'none' : color}
          r={r}
          strokeDasharray={dotted ? '1,1' : undefined}
          stroke={dotted ? color : undefined}
        />
      ))}
    </Group>
  );
}
