/**
 * The ChartContainer replaces combines most top-level components with some of
 * what used to be part of ChartAxes. The axes themselves have instead been
 * moved to the component root, to avoid prop drilling and keep things open.
 */
import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Bar } from '@visx/shape';
import { TickFormatter } from '@visx/axis';
import { localPoint } from '@visx/event';
import { Point } from '@visx/point';
import { scaleBand } from '@visx/scale';
import { bisectLeft, extent } from 'd3-array';
import { ScaleTime } from 'd3-scale';
import React, { useCallback, useMemo, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components-styled/base';
import { Legenda, LegendItem, LegendShape } from '~/components-styled/legenda';
import {
  ChartPadding,
  ChartScales,
  ComponentCallbackFunction,
  defaultPadding,
} from '~/components-styled/line-chart/components';
import { ChartAxes } from './components/chart-axes';
import {
  isDateSpanValue,
  isDateValue,
  TimestampedValue,
} from '@corona-dashboard/common';
import { Text } from '~/components-styled/typography';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import text from '~/locale/index';
import { colors } from '~/style/theme';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { TimeframeOption } from '~/utils/timeframe';

/**
 * Importing unchanged logic and components from line-chart since this is
 * considered a fork.
 */
import {
  HoverPoint,
  Marker,
  Trend,
} from '~/components-styled/line-chart/components';
import {
  calculateYMax,
  getTrendData,
  TrendValue,
} from '~/components-styled/line-chart/logic';
import { defaultStyles, TooltipWithBounds, useTooltip } from '@visx/tooltip';
import styled from 'styled-components';
import css from '@styled-system/css';
import { useBreakpoints } from '~/utils/useBreakpoints';

const tooltipStyles = {
  ...defaultStyles,
  padding: 0,
  zIndex: 100,
};

// type TooltipData<T extends TimestampedValue> = {
//   value: T;
//   key: keyof T;
//   seriesConfig: SeriesConfig<T>[];
// };

// const dateToValue = (d: Date) => d.valueOf() / 1000;

export type ChartContainerProps {
  // values: T[];
  // seriesConfig: SeriesConfig<T>[];
  children: React.ReactNode;
  width: number;
  height: number;
  onHover: (
    event: React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>,
  ) => void;
  // timeframe?: TimeframeOption;
  // signaalwaarde?: number;
  // formatTooltip?: (
  //   value: T,
  //   key: keyof T,
  //   seriesConfig: SeriesConfig<T>[]
  // ) => React.ReactNode;
  // formatXAxis?: TickFormatter<Date>;
  // formatYAxis?: TickFormatter<number>;
  // hideFill?: boolean;
  valueAnnotation?: string;
  // isPercentage?: boolean;
  // showMarkerLine?: boolean;
  // formatMarkerLabel?: (value: T) => string;
  padding: ChartPadding;
  // showLegend?: boolean;
  // legendItems?: LegendItem[];
  // componentCallback?: ComponentCallbackFunction;
  ariaLabelledBy: string;
  // seriesMax?: number;
  // yTickValues?: number[];
};

export function ChartContainer({
  width,
  height,
  padding,
  ariaLabelledBy,
  valueAnnotation,
  onHover,
  children
}: ChartContainerProps) {

  return (
    <Box>
      {valueAnnotation && (
        <ValueAnnotation mb={2}>{valueAnnotation}</ValueAnnotation>
      )}

      <Box position="relative">
        <svg
          width={width}
          height={height}
          role="img"
          aria-labelledby={ariaLabelledBy}
        >
          <Group left={padding.left} top={padding.top}>
            {children}



            {/**
             * Render the bar on top of the trends because it captures mouse hover when you are above the trend line
             */}
            <Bar
              x={0}
              y={0}
              width={width}
              height={height}
              fill="transparent"
              onTouchStart={onHover}
              onTouchMove={onHover}
              onMouseMove={onHover}
              onMouseLeave={onHover}
            />
          </Group>
        </svg>
      </Box>
    </Box>
  );
}

function getDate(x: TrendValue) {
  return x.__date;
}

function formatDefaultTooltip<T extends TimestampedValue>(
  value: T,
  key: keyof T,
  _seriesConfig: SeriesConfig<T>[],
  isPercentage?: boolean
) {
  // default tooltip assumes one line is rendered:

  const numberValue = (value[key] as unknown) as number;

  if (isDateValue(value)) {
    return (
      <>
        <Text as="span" fontWeight="bold">
          {`${formatDateFromSeconds(value.date_unix)}: `}
        </Text>
        {isPercentage
          ? `${formatPercentage(numberValue)}%`
          : formatNumber(numberValue)}
      </>
    );
  } else if (isDateSpanValue(value)) {
    const dateStartString = formatDateFromSeconds(
      value.date_start_unix,
      'day-month'
    );
    const dateEndString = formatDateFromSeconds(
      value.date_end_unix,
      'day-month'
    );

    return (
      <>
        <Text as="span" fontWeight="bold">
          {`${dateStartString} - ${dateEndString}: `}
        </Text>
        {isPercentage
          ? `${formatPercentage(numberValue)}%`
          : formatNumber(numberValue)}
      </>
    );
  }

  throw new Error(
    `Invalid value passed to format tooltip function: ${JSON.stringify(value)}`
  );
}

export const TooltipContainer = styled.div(
  css({
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    minWidth: 72,
    color: 'body',
    backgroundColor: 'white',
    lineHeight: 2,
    borderColor: 'border',
    borderWidth: '1px',
    borderStyle: 'solid',
    px: 2,
    py: 1,
    fontSize: 1,
  })
);
