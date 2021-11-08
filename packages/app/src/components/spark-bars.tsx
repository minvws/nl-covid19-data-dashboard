import type { KeysOfType, TimestampedValue } from '@corona-dashboard/common';
import { colors } from '@corona-dashboard/common';
import { scaleLinear } from '@visx/scale';

const BAR_WIDTH = 5;
const BAR_HEIGHT = 16;
const BORDER_HEIGHT = 2;

type SparkBarsProps<T extends TimestampedValue> = {
  averageProperty: KeysOfType<T, number | null, true>;
  data: T[];
};

export function SparkBars<T extends TimestampedValue>(
  props: SparkBarsProps<T>
) {
  const { data, averageProperty } = props;

  const last7Days = data.slice(-7);

  const min = Math.min(0, ...last7Days.map((d) => d[averageProperty]));
  // the max y domain is at least 5 so we have decent visuals for lower values
  const max = Math.max(5, ...last7Days.map((d) => d[averageProperty]));

  const y = scaleLinear({
    domain: [min, max],
    range: [BAR_HEIGHT, 0],
    round: true,
    nice: true,
  });

  return (
    <svg
      width="100%"
      height={BAR_HEIGHT + BORDER_HEIGHT}
      role="img"
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${BAR_WIDTH * 7} ${BAR_HEIGHT + BORDER_HEIGHT}`}
    >
      {last7Days.map((d, i) => (
        <rect
          key={'date_unix' in d ? d.date_unix : d.date_start_unix}
          x={i * BAR_WIDTH}
          width={BAR_WIDTH}
          opacity="0.5"
          y={y(Math.max(0, d[averageProperty]))}
          height={d[averageProperty] >= 0 ? y(0) - y(d[averageProperty]) : y(0)}
          fill={
            d[averageProperty] >= 0
              ? colors.data.positive
              : colors.data.negative
          }
        />
      ))}
      <rect
        x={0}
        width={BAR_WIDTH * last7Days.length}
        height={BORDER_HEIGHT}
        fill={colors.silver}
        y={BAR_HEIGHT}
      />
    </svg>
  );
}
