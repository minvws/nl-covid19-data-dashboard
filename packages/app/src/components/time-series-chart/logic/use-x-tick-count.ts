import {
  assert,
  isDateSeries,
  isDateSpanSeries,
  TimestampedValue,
} from '@corona-dashboard/common';
import { useBreakpoints } from '~/utils/use-breakpoints';

interface XTickConfiguration {
  date: {
    long: { count: number; format?: any };
    short: { count: number; format?: any };
  };
  span: {
    long: { count: number; format?: any };
    short: { count: number; format?: any };
  };
}

interface XTickConfigurations {
  /**
   * ~420px
   */
  xs?: XTickConfiguration;
  /**
   * ~768px
   */
  sm?: XTickConfiguration;
  /**
   * ~960px
   */
  md?: XTickConfiguration;
  /**
   * ~1200px
   */
  lg?: XTickConfiguration;
  /**
   * ~1600px
   */
  xl?: XTickConfiguration;
}

const xTickConfigurations: XTickConfigurations = {
  xs: {
    date: {
      long: { count: 3 },
      short: { count: 2 },
    },
    span: {
      long: { count: 3 },
      short: { count: 2 },
    },
  },
  sm: {
    date: {
      long: { count: 4 },
      short: { count: 3 },
    },
    span: {
      long: { count: 4 },
      short: { count: 3 },
    },
  },
  lg: {
    date: {
      long: { count: 6 },
      short: { count: 4 },
    },
    span: {
      long: { count: 6 },
      short: { count: 4 },
    },
  },
};

const sizes = ['xl', 'lg', 'md', 'sm', 'xs'] as const;

export function useXTickCount<T extends TimestampedValue>(values: T[]) {
  const isDateValues = isDateSeries(values);
  const isDateSpanValues = isDateSpanSeries(values);
  assert(isDateValues || isDateSpanValues, 'Unknown date series encountered');

  const type = isDateValues ? 'date' : 'span';
  const period = values.length < 36 ? 'short' : 'long';

  const breakpoints = useBreakpoints(true);
  const screenSize = sizes.find(
    (x) => breakpoints[x] && xTickConfigurations[x]
  );

  return screenSize
    ? xTickConfigurations[screenSize]?.[type][period].count ?? 2
    : 2;
}
