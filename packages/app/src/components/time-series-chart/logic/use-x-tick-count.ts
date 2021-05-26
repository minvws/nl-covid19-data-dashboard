import { isDateSeries, TimestampedValue } from '@corona-dashboard/common';
import { useChartBreakpoints } from './use-chart-breakpoints';

interface XAxisTickConfiguration {
  date: {
    long: number;
    short: number;
  };
  span: {
    long: number;
    short: number;
  };
}

interface XAxisTickConfigurations {
  /**
   * ~420px
   */
  xs?: XAxisTickConfiguration;
  /**
   * ~768px
   */
  sm?: XAxisTickConfiguration;
  /**
   * ~960px
   */
  md?: XAxisTickConfiguration;
  /**
   * ~1200px
   */
  lg?: XAxisTickConfiguration;
  /**
   * ~1600px
   */
  xl?: XAxisTickConfiguration;
}

const xTickConfigurations: XAxisTickConfigurations = {
  xs: {
    date: {
      long: 3,
      short: 2,
    },
    span: {
      long: 3,
      short: 2,
    },
  },
  sm: {
    date: {
      long: 4,
      short: 3,
    },
    span: {
      long: 4,
      short: 3,
    },
  },
  lg: {
    date: {
      long: 6,
      short: 4,
    },
    span: {
      long: 6,
      short: 4,
    },
  },
};

const sizes = ['xl', 'lg', 'md', 'sm', 'xs'] as const;

export function useXTickCount<T extends TimestampedValue>(
  values: T[],
  chartWidth: number
) {
  const isDateValues = isDateSeries(values);

  const type = isDateValues ? 'date' : 'span';
  const period = values.length < 36 ? 'short' : 'long';

  const breakpoints = useChartBreakpoints(chartWidth);
  const screenSize = sizes.find(
    (x) => breakpoints[x] && xTickConfigurations[x]
  );

  return screenSize ? xTickConfigurations[screenSize]?.[type][period] ?? 2 : 2;
}
