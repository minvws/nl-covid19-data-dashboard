import { TrendValue } from '../logic';
import { ChartPadding } from './chart-axes';
import { Group } from '@visx/group';
import { scaleBand } from '@visx/scale';
import { Bar } from '@visx/shape';
import { useMemo } from 'react';

interface TimespanMarkerProps {
  data: TrendValue[];
  padding: ChartPadding;
  width: number;
  height: number;
  onHover: (
    event: React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>,
    seriesIndex: number
  ) => void;
}

export function TimespanMarker(props: TimespanMarkerProps) {
  const { data, padding, width, height, onHover } = props;

  const xMax = width - padding.left - padding.right;
  const yMax = height - padding.top - padding.bottom;

  function getDate(x: TrendValue) {
    return x.__date;
  }

  const xScale = useMemo(
    () =>
      scaleBand<Date>({
        range: [0, xMax],
        round: true,
        domain: data.map(getDate),
        padding: 0.01, // @TODO make 0 this is only for debugging
      }),
    [xMax, data]
  );

  return (
    <Group>
      {data.map((x, index) => {
        const barWidth = xScale.bandwidth();
        const barX = xScale(getDate(x));
        const barY = 0;

        return (
          <Bar
            key={`bar-${index}`}
            x={barX}
            y={barY}
            width={barWidth}
            height={yMax}
            fill="rgba(23, 233, 217, .5)"
            /**
             * The timespan bars are also used to capture hover behavior for the
             * trend points so that if you hover in the vertical band of a point
             * we can lookup and highlight it. We pass along the index of the
             * timespan because then we know where to look. If we are rendering
             * only a single trend line, this index would give us the point
             * without having to search for the nearest.
             */
            onTouchStart={(event) => onHover(event, index)}
            onTouchMove={(event) => onHover(event, index)}
            onMouseMove={(event) => onHover(event, index)}
            onMouseLeave={(event) => onHover(event, index)}
          />
        );
      })}
    </Group>
  );
}
