import type { KeysOfType, TimestampedValue } from '@corona-dashboard/common';
import { scaleLinear } from '@visx/scale';
import { colors } from '~/style/theme';
import { Box } from './base';

const BAR_WIDTH = 6;
const BAR_HEIGHT = 24;

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
    <Box as="span" mr="3" aria-hidden="true">
      <svg
        width={7 * BAR_WIDTH}
        height={BAR_HEIGHT}
        role="img"
        aria-hidden="true"
        focusable="false"
      >
        {last7Days.map((d, i) => (
          <rect
            key={'date_unix' in d ? d.date_unix : d.date_start_unix}
            x={i * BAR_WIDTH}
            width={BAR_WIDTH}
            y={y(Math.max(0, d[averageProperty]))}
            height={
              d[averageProperty] >= 0 ? y(0) - y(d[averageProperty]) : y(0)
            }
            fill={
              d[averageProperty] >= 0
                ? colors.data.positive
                : colors.data.negative
            }
          />
        ))}
      </svg>
    </Box>
  );
}
