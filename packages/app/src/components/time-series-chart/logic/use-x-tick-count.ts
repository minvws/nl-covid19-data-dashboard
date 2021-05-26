import { isDateSeries, TimestampedValue } from '@corona-dashboard/common';
import { useMemo } from 'react';
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

export function useXTickCount<T extends TimestampedValue>(
  values: T[],
  chartWidth: number
) {
  const chartBreakpoints = useChartBreakpoints(chartWidth);

  return useMemo(() => {
    const isDateValues = isDateSeries(values);

    const type = isDateValues ? 'date' : 'span';
    const period = values.length < 36 ? 'short' : 'long';

    const screenSize = sizes.find(
      (x) => chartBreakpoints[x] && xTickConfigurations[x]
    );

    const xTickCount = screenSize
      ? xTickConfigurations[screenSize]?.[type][period] ?? 2
      : 2;

    return [xTickCount, chartBreakpoints] as const;
  }, [values, chartBreakpoints]);
}
