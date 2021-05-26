import {
  formatStyle,
  isDateSeries,
  TimestampedValue,
} from '@corona-dashboard/common';
import { useMemo } from 'react';
import { useChartBreakpoints } from './use-chart-breakpoints';

interface XAxisTickCountConfiguration {
  date: {
    long: number;
    short: number;
  };
  span: {
    long: number;
    short: number;
  };
}

interface XAxisTickCountConfigurations {
  /**
   * ~420px
   */
  xs?: XAxisTickCountConfiguration;
  /**
   * ~768px
   */
  sm?: XAxisTickCountConfiguration;
  /**
   * ~960px
   */
  md?: XAxisTickCountConfiguration;
  /**
   * ~1200px
   */
  lg?: XAxisTickCountConfiguration;
  /**
   * ~1600px
   */
  xl?: XAxisTickCountConfiguration;
}

const xTickCountConfigurations: XAxisTickCountConfigurations = {
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
  xl: {
    date: {
      long: 8,
      short: 8,
    },
    span: {
      long: 8,
      short: 8,
    },
  },
};

const sizes = ['xl', 'lg', 'md', 'sm', 'xs'] as const;

export type XAxisTickConfiguration = ReturnType<typeof useXTickConfiguration>;

export function useXTickConfiguration<T extends TimestampedValue>(
  values: T[],
  chartWidth: number
) {
  const chartBreakpoints = useChartBreakpoints(chartWidth);

  return useMemo(() => {
    const isDateValues = isDateSeries(values);

    const type = isDateValues ? 'date' : 'span';
    const period = values.length < 36 ? 'short' : 'long';

    const screenSize = sizes.find(
      (x) => chartBreakpoints[x] && xTickCountConfigurations[x]
    );

    const xTickCount = screenSize
      ? xTickCountConfigurations[screenSize]?.[type][period] ?? 2
      : 2;

    const format: formatStyle =
      (xTickCount < 6 && chartBreakpoints.lg) || chartBreakpoints.xl
        ? 'axis-with-year-long'
        : 'axis-with-year';

    return { count: xTickCount, format };
  }, [values, chartBreakpoints]);
}
