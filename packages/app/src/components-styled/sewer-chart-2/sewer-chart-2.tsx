import {
  formatNumber,
  Municipal,
  Regionaal,
  TimestampedValue,
} from '@corona-dashboard/common';
/**
 * Code loosely based on
 * https://codesandbox.io/s/github/airbnb/visx/tree/master/packages/visx-demo/src/sandboxes/visx-barstack
 */
import css from '@styled-system/css';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { ParentSize } from '@visx/responsive';
import { scaleLinear, scaleTime } from '@visx/scale';
import { LinePath } from '@visx/shape';
import { NumberValue } from 'd3-scale';
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';
import { colors } from '~/style/theme';
import { formatDate } from '~/utils/formatDate';
import { TimeframeOption } from '~/utils/timeframe';
import { useBreakpoints } from '~/utils/useBreakpoints';
import {
  getMax,
  SewerChartValue,
  useSewerChartValues,
  useSewerStationSelectProps,
} from './logic-2';

export type Config<T extends TimestampedValue> = {
  metricProperty: keyof T;
  color: string;
  legendLabel: string;
};

export type SewerChart2Props = {
  data: Regionaal | Municipal;
  timeframe: TimeframeOption;
  valueAnnotation: string;
  width?: number;
  text: {
    select_station_placeholder: string;
    average_label_text: string;
    secondary_label_text: string;
    daily_label_text: string;
    range_description: string;
    display_outliers: string;
    hide_outliers: string;
  };
};

function formatDateString(dateOrNumber: Date | NumberValue) {
  const date =
    dateOrNumber instanceof Date
      ? dateOrNumber
      : new Date(dateOrNumber as number);

  return formatDate(date, 'axis');
}

const accessors = {
  xAccessor: (x?: SewerChartValue) => x && x.date,
  yAccessor: (x?: SewerChartValue) => x && x.value,
};

export function SewerChart2(props: SewerChart2Props) {
  /**
   * Destructuring here and not above, so we can easily switch between optional
   * passed-in formatter functions or their default counterparts that have the
   * same name.
   */
  const { data, timeframe, valueAnnotation, width, text } = props;

  const [displayOutliers, setDisplayOutliers] = useState(false);
  const { valuesAverage, valuesStation } = useSewerChartValues(
    data,
    timeframe,
    text.average_label_text
  );

  const breakpoints = useBreakpoints();

  const isExtraSmallScreen = !breakpoints.sm;
  const isTinyScreen = !breakpoints.xs;

  const padding = useMemo(
    () =>
      ({
        top: 20,
        right: isExtraSmallScreen ? 0 : 30,
        bottom: 30,
        left: 50,
      } as const),
    [isExtraSmallScreen]
  );

  const height = isExtraSmallScreen ? 200 : 400;

  const sewerStationSelectProps = useSewerStationSelectProps(valuesStation);

  const selectedStationValues = useMemo(() => {
    const name = sewerStationSelectProps.value;
    return name ? valuesStation.filter((x) => x.name === name) : [];
  }, [valuesStation, sewerStationSelectProps.value]);

  const maxAverageValue = getMax(valuesAverage, accessors.yAccessor);
  const maxStationValue = getMax(valuesStation, accessors.yAccessor);
  const selectedStationMax = selectedStationValues
    ? getMax(selectedStationValues, accessors.yAccessor)
    : 0;

  /**
   * max value is multiplied by 1.2 to display points close above the line
   */
  const lineMax = 1.2 * Math.max(maxAverageValue, selectedStationMax);
  const hasOutliers = maxStationValue >= lineMax;

  /**
   * Get values of a selected station in order to draw a line
   */
  const valuesStationFiltered = useMemo(() => {
    return hasOutliers && !displayOutliers
      ? valuesStation.filter((x) => x.value <= lineMax)
      : valuesStation;
  }, [displayOutliers, hasOutliers, lineMax, valuesStation]);

  /**
   * Recursive call the chart when the width is not yet missing
   */
  if (width === undefined) {
    return (
      <ParentSize>
        {(parent) => <SewerChart2 {...props} width={parent.width} />}
      </ParentSize>
    );
  }

  const xMax = width - padding.left - padding.right;
  const yMax = height - padding.top - padding.bottom;

  const bounds = {
    width: width - padding.left - padding.right,
    height: height - padding.top - padding.bottom,
  };

  const allValues = [...valuesAverage, ...valuesStationFiltered];
  const valuesX = allValues.map((x) => x.dateMs);
  const valuesY = allValues.map((x) => x.value);

  const xScale = scaleTime<number>({
    domain: [Math.min(...valuesX), Math.max(...valuesX)],
  }).range([0, xMax]);

  const yScale = scaleLinear<number>({
    domain: [Math.min(...valuesY), Math.max(...valuesY)],
    nice: true,
  }).range([yMax, 0]);

  return (
    <Box>
      <Box position="relative">
        {hasOutliers && (
          <Box ml={padding.left} mr={padding.right}>
            <ToggleOutliersButton
              onClick={() => setDisplayOutliers(!displayOutliers)}
            >
              {displayOutliers ? text.hide_outliers : text.display_outliers}
            </ToggleOutliersButton>
          </Box>
        )}
        <br />

        <svg width={width} height={height} role="img">
          <Group left={padding.left} top={padding.top}>
            <GridRows
              scale={yScale}
              width={bounds.width}
              numTicks={3}
              stroke={colors.data.axis}
            />
            <AxisBottom
              scale={xScale}
              top={bounds.height}
              numTicks={Math.floor(width / 200)} // approx 200px per tick
              stroke={colors.data.axis}
              tickFormat={formatDateString}
              tickLabelProps={() => {
                return {
                  textAnchor: 'middle',
                  fill: colors.data.axisLabels,
                  fontSize: 12,
                };
              }}
              hideTicks
            />
            <AxisLeft
              scale={yScale}
              numTicks={3}
              hideTicks
              hideAxisLine
              stroke={colors.data.axis}
              tickFormat={(x) => formatNumber(x as number)}
              tickLabelProps={() => ({
                fill: colors.data.axisLabels,
                fontSize: 12,
                dx: 0,
                textAnchor: 'end',
                verticalAnchor: 'middle',
              })}
            />

            {valuesStationFiltered.map((x, index) => (
              <circle
                key={`${index}${x.value}`}
                fill="rgba(89, 89, 89, 0.3)"
                r={3}
                cx={xScale(x.dateMs)}
                cy={yScale(x.value)}
              />
            ))}

            <LinePath
              data={valuesAverage}
              x={(x) => xScale(x.dateMs)}
              y={(x) => yScale(x.value)}
              stroke={colors.data.primary}
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Group>
        </svg>
      </Box>
    </Box>
  );
}

/**
 * TooltipContainer from LineChart did not seem to be very compatible with the
 * design for this chart, so this is something to look at later.
 */
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

const Square = styled.span<{ color: string }>((x) =>
  css({
    display: 'inline-block',
    backgroundColor: x.color,
    width: 15,
    height: 15,
  })
);

const ToggleOutliersButton = styled.button(
  css({
    background: 'tileGray',
    border: 0,
    p: 1,
    color: 'blue',
    width: '100%',
    cursor: 'pointer',
    height: '26px',
  })
);
