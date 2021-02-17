import { Group } from '@visx/group';
import { memo } from 'react';
import { motion } from 'framer-motion';

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
  radius,
  dottedOutline: dotted,
}: ScatterPlotProps<T>) {
  return (
    <Group>
      {data.map((datum) => (
        <motion.circle
          key={datum.id}
          r={radius}
          fill={dotted ? 'none' : color}
          strokeDasharray={dotted ? '1,1' : undefined}
          stroke={dotted ? color : undefined}
          initial={{
            cx: getX(datum),
            cy: getY(datum),
          }}
          animate={{
            cx: getX(datum),
            cy: getY(datum),
          }}
        />
      ))}
    </Group>
  );
}
