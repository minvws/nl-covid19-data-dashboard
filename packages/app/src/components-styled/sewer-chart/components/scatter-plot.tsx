import { Group } from '@visx/group';
import { AnimatePresence, motion } from 'framer-motion';
import { memo } from 'react';
import { useIsMotionDisabled } from '~/utils/use-is-motion-disabled';

interface ScatterPlotProps<T> {
  data: T[];
  getX: (datum: T) => number;
  getY: (datum: T) => number;
  color: string;
  radius: number;
  dottedOutline?: boolean;
  isAnimated?: boolean;
}

export const ScatterPlot = memo(
  ScatterPlotUnmemoized
) as typeof ScatterPlotUnmemoized;

function ScatterPlotUnmemoized<T extends { id: string }>(
  props: ScatterPlotProps<T>
) {
  const { data, getX, getY, color, radius, dottedOutline, isAnimated } = props;

  const isMotionDisabled = useIsMotionDisabled();

  if (isAnimated && !isMotionDisabled) {
    return <AnimatedScatterPlot {...props} />;
  }

  return (
    <Group>
      {data.map((datum) => (
        <circle
          key={datum.id}
          r={radius}
          fill={dottedOutline ? 'none' : color}
          strokeDasharray={dottedOutline ? '1,1' : undefined}
          stroke={dottedOutline ? color : undefined}
          cx={getX(datum)}
          cy={getY(datum)}
        />
      ))}
    </Group>
  );
}

function AnimatedScatterPlot<T extends { id: string }>({
  data,
  getX,
  getY,
  color,
  radius,
  dottedOutline,
}: ScatterPlotProps<T>) {
  return (
    <Group>
      <AnimatePresence initial={false}>
        {data.map((datum) => (
          <motion.circle
            key={datum.id}
            r={radius}
            fill={dottedOutline ? 'none' : color}
            strokeDasharray={dottedOutline ? '1,1' : undefined}
            stroke={dottedOutline ? color : undefined}
            initial={{
              cx: getX(datum),
              cy: getY(datum) - 100,
              opacity: 0,
            }}
            exit={{
              cx: getX(datum),
              cy: getY(datum) - 100,
              opacity: 0,
            }}
            animate={{
              cx: getX(datum),
              cy: getY(datum),
              opacity: 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 55,
            }}
          />
        ))}
      </AnimatePresence>
    </Group>
  );
}
