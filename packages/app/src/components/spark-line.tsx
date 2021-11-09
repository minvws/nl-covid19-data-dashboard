import type { KeysOfType, TimestampedValue } from '@corona-dashboard/common';
import { colors } from '@corona-dashboard/common';
import { scaleLinear } from '@visx/scale';
import { AreaClosed, LinePath } from '@visx/shape';
import { first, last } from 'lodash';
import { isPresent } from 'ts-is-present';

const STEP_WIDTH = 5;
const HEIGHT = 24;
const NUMBER_OF_POINTS = 7;
const MARKER_RADIUS = 3;

type SparkLineProps<T extends TimestampedValue> = {
  averageProperty: KeysOfType<T, number | null, true>;
  data: T[];
};

function getDate<T extends TimestampedValue>(value?: T) {
  if (value === undefined) {
    return 0;
  }

  if ('date_unix' in value) {
    return value.date_unix;
  }

  return value.date_start_unix;
}

export function SparkLine<T extends TimestampedValue>(
  props: SparkLineProps<T>
) {
  const { data, averageProperty } = props;

  const values = data.slice(-NUMBER_OF_POINTS);

  const min = Math.min(0, ...values.map((d) => d[averageProperty] ?? 0));
  const max = Math.max(0.1, ...values.map((d) => d[averageProperty] ?? 0));

  const xScale = scaleLinear({
    domain: [getDate(first(values)), getDate(last(values))],
    range: [0, STEP_WIDTH * NUMBER_OF_POINTS - MARKER_RADIUS],
  });

  const yScale = scaleLinear({
    domain: [min, max],
    range: [HEIGHT - MARKER_RADIUS, MARKER_RADIUS],
  });

  function getX(dataPoint: T) {
    return xScale(getDate(dataPoint));
  }

  function getY(dataPoint: T) {
    return yScale(dataPoint[averageProperty]);
  }

  const nonNullValues = values.filter((x) => isPresent(x[averageProperty]));
  const lastValue = last(nonNullValues);

  return (
    <svg
      width="100%"
      height={HEIGHT}
      role="img"
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${STEP_WIDTH * NUMBER_OF_POINTS} ${HEIGHT}`}
    >
      <LinePath
        data={nonNullValues}
        x={getX}
        y={getY}
        stroke={colors.data.primary}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <AreaClosed
        data={nonNullValues}
        x={getX}
        y={getY}
        fill={colors.data.primary}
        fillOpacity={0.3}
        yScale={yScale}
      />
      {lastValue && (
        <circle
          cx={getX(lastValue)}
          cy={getY(lastValue)}
          r={MARKER_RADIUS}
          fill={colors.data.primary}
        />
      )}
    </svg>
  );
}
