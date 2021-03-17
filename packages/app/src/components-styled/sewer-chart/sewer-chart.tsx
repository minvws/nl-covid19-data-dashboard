import { formatNumber, Municipal, Regionaal } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { localPoint } from '@visx/event';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { Bar, LinePath } from '@visx/shape';
import { transparentize } from 'polished';
import { PointerEvent, useCallback, useMemo, useState } from 'react';
import { isPresent } from 'ts-is-present';
import { useDebouncedCallback } from 'use-debounce';
import { Box } from '~/components-styled/base';
import { Legend } from '~/components-styled/legend';
import { Select } from '~/components-styled/select';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import siteText from '~/locale';
import { colors } from '~/style/theme';
import { formatDate } from '~/utils/formatDate';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { TimeframeOption } from '~/utils/timeframe';
import { useElementSize } from '~/utils/use-element-size';
import { useIsMounted } from '~/utils/use-is-mounted';
import { Path } from './components/path';
import { ScatterPlot } from './components/scatter-plot';
import { ToggleOutlierButton } from './components/toggle-outlier-button';
import { DateTooltip, Tooltip } from './components/tooltip';
import {
  Dimensions,
  getMax,
  SewerChartValue,
  useLineTooltip,
  useSewerChartScales,
  useSewerChartValues,
  useSewerStationSelectProps,
} from './logic';

interface SewerChartProps {
  data: Regionaal | Municipal;
  timeframe: TimeframeOption;
  valueAnnotation: string;
  height?: number;
  text: {
    select_station_placeholder: string;
    average_label_text: string;
    secondary_label_text: string;
    daily_label_text: string;
    range_description: string;
    display_outliers: string;
    hide_outliers: string;
  };
}

export function SewerChart(props: SewerChartProps) {
  const { data, timeframe, valueAnnotation, height = 300, text } = props;

  const [sizeRef, { width }] = useElementSize<HTMLDivElement>(840);

  /**
   * We enable animations slighly after the component is mounted (1ms).
   * This prevents an initial animation from the SSR width `840` to the
   * actual container width.
   */
  const isMounted = useIsMounted({ delayMs: 1 });

  /**
   * State for toggling outliers visibility
   */
  const [displayOutliers, setDisplayOutliers] = useState(false);

  /**
   * filter and shape data for our line-chart and scatter plot
   */
  const [averageLineData, stationScatterData] = useSewerChartValues(
    data,
    timeframe
  );

  /**
   * create props for the station select dropdown
   */
  const sewerStationSelectProps = useSewerStationSelectProps(
    stationScatterData
  );
  const hasSelectedStation = !!sewerStationSelectProps.value;

  /**
   * get filtered station values
   */
  const selectedLineData = useMemo(() => {
    return sewerStationSelectProps.value
      ? stationScatterData.filter(
          (x) => x.name === sewerStationSelectProps.value
        )
      : [];
  }, [stationScatterData, sewerStationSelectProps.value]);

  /**
   * Here we determine the outlier limit: find the highest line-value and
   * multiply it by 1.5 in order to display station values which are close to
   * the highest value.
   */
  const outlierLimit =
    Math.max(
      getMax(averageLineData, (x) => x.value),
      getMax(selectedLineData, (x) => x.value)
    ) * 1.5;

  /**
   * If there's a station value GTE than the max line, it means we have outliers
   * we might not want to display, based on the incoming boolean
   */
  const hasOutliers =
    getMax(stationScatterData, (x) => x.value) >= outlierLimit;

  /**
   * scatter data with outliers limited to the limit when applicable
   */
  const stationScatterDataLimited = useMemo(
    () =>
      stationScatterData.map((x) => ({
        ...x,
        /**
         * Users can toggle outlier visibility. When they are "hidden" the outliers
         * will still be rendered but with their value set to the outlier-limit.
         * Then we can visually nudge those a few pixels so they appear to be
         * rendered inside the toggle button.
         *
         */
        value:
          displayOutliers || x.value < outlierLimit ? x.value : outlierLimit,
      })),
    [displayOutliers, outlierLimit, stationScatterData]
  );

  /**
   * cache paddings and bounds between renders
   */
  const dimensions = useMemo<Dimensions>(() => {
    const padding = {
      top: 20,
      right: 35,
      bottom: 30,
      left: 50,
    };

    const bounds = {
      width: width - padding.left - padding.right,
      height: height - padding.top - padding.bottom,
    };
    return { padding, bounds };
  }, [height, width]);

  /**
   * Get scales and "value -> coordinate" getters (getX, getY)
   */
  const scales = useSewerChartScales(
    useMemo(() => [...averageLineData, ...stationScatterDataLimited], [
      averageLineData,
      stationScatterDataLimited,
    ]),
    dimensions.bounds
  );

  /**
   * Manually set Y axis values, as per design
   */
  const tickValuesY = useMemo(
    () => [
      scales.yScale.domain()[0],
      scales.yScale.domain()[1] / 2,
      scales.yScale.domain()[1],
    ],
    [scales.yScale]
  );

  /**
   * Call tooltip hook for determining which datum should have "hover"-focus.
   */
  const lineTooltip = useLineTooltip({
    values: hasSelectedStation ? selectedLineData : averageLineData,
    scales,
    dimensions,
  });

  const handlePointerMove = useCallback(
    (evt: PointerEvent<SVGSVGElement>) => {
      // find the nearest polygon to the current mouse position
      const point = localPoint(evt);
      if (!point) return;

      /**
       * find new tooltip datums to highlight
       */
      lineTooltip.findClosest(point);
    },
    [lineTooltip]
  );

  /**
   * hide tooltip when focus is lost after small delay
   */
  const clearTooltips = useDebouncedCallback(() => lineTooltip.clear(), 300);

  const handlePointerLeave = useCallback(() => {
    clearTooltips.callback();
  }, [clearTooltips]);

  const getScatterY = useCallback(
    (x: SewerChartValue) => {
      /**
       * return default value when we display outliers or when the value is
       * lower than the outlier limit
       */
      if (displayOutliers || x.value !== outlierLimit) {
        return scales.getY(x);
      }

      /**
       * When the condition above fails it means we're handling an outlier-value.
       * We'll apply a static Y position to display those "below" the
       * toggle-button
       */
      return -12;
    },
    [displayOutliers, outlierLimit, scales]
  );

  return (
    <Box position="relative">
      {sewerStationSelectProps.options.length > 0 && (
        <Box display="flex" justifyContent="flex-end">
          <Select
            placeholder={text.select_station_placeholder}
            {...sewerStationSelectProps}
          />
        </Box>
      )}

      {valueAnnotation && (
        <ValueAnnotation mb={2}>{valueAnnotation}</ValueAnnotation>
      )}

      <Box
        ml={dimensions.padding.left}
        mr={dimensions.padding.right}
        /**
         * The margin-bottom has been eyeballed to visually attach the
         * button to the graph, not sure how future-proof this is.
         */
        mb={-19}
      >
        <ToggleOutlierButton
          disabled={!hasOutliers}
          onClick={() => setDisplayOutliers(!displayOutliers)}
        >
          {displayOutliers ? text.hide_outliers : text.display_outliers}
        </ToggleOutlierButton>
      </Box>

      <Box position="relative" ref={sizeRef} css={css({ userSelect: 'none' })}>
        <svg
          role="img"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          style={{
            touchAction: 'pan-y', // allow vertical scroll, but capture horizontal
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <Group left={dimensions.padding.left} top={dimensions.padding.top}>
            <GridRows
              scale={scales.yScale}
              width={dimensions.bounds.width}
              tickValues={tickValuesY}
              stroke={colors.data.axis}
            />

            <AxisBottom
              scale={scales.xScale}
              top={dimensions.bounds.height}
              hideTicks
              numTicks={Math.floor(width / 200)} // approx 200px per tick
              stroke={colors.data.axis}
              tickFormat={(x) => formatDate(x as number, 'axis')}
              tickLabelProps={() => ({
                fill: colors.data.axisLabels,
                fontSize: 14,
                textAnchor: 'middle',
              })}
            />

            {lineTooltip.point && (
              <Bar
                x={
                  lineTooltip.datum.dateStartMs
                    ? scales.xScale(lineTooltip.datum.dateStartMs)
                    : lineTooltip.point.x - 4
                }
                width={
                  lineTooltip.datum.dateStartMs
                    ? scales.xScale(lineTooltip.datum.dateEndMs) -
                      scales.xScale(lineTooltip.datum.dateStartMs)
                    : 8
                }
                height={dimensions.bounds.height}
                fill="rgba(192, 232, 252, 0.5)"
                css={css({
                  willChange: 'transform',
                  transitionProperty: 'x',
                  transitionDuration: '75ms',
                  transitionTimingFunction: 'ease-out',
                })}
              />
            )}

            <AxisLeft
              scale={scales.yScale}
              tickValues={tickValuesY}
              hideTicks
              hideAxisLine
              stroke={colors.data.axis}
              tickFormat={(x) => formatNumber(x as number)}
              tickLabelProps={() => ({
                fill: colors.data.axisLabels,
                fontSize: 14,
                dx: 0,
                textAnchor: 'end',
                verticalAnchor: 'middle',
              })}
            />

            <ScatterPlot
              isAnimated={isMounted}
              data={stationScatterDataLimited}
              getX={scales.getX}
              getY={getScatterY}
              color="rgba(89, 89, 89, 0.3)"
              radius={2}
              /**
               * disable animations when the timeframe changes
               */
              key={timeframe}
            />

            <LinePath x={scales.getX} y={scales.getY}>
              {({ path }) => (
                <Path
                  isAnimated={isMounted}
                  fill="transparent"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  path={path(averageLineData) || ''}
                  stroke={
                    hasSelectedStation
                      ? colors.data.neutral
                      : colors.data.primary
                  }
                  strokeWidth={4}
                  /**
                   * disable animations when the timeframe changes
                   */
                  key={timeframe}
                />
              )}
            </LinePath>

            {hasSelectedStation && (
              <LinePath
                x={scales.getX}
                y={scales.getY}
                key={sewerStationSelectProps.value}
              >
                {({ path }) => (
                  <Path
                    isAnimated={isMounted}
                    fill="transparent"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    path={path(selectedLineData) || ''}
                    stroke={colors.data.secondary}
                    strokeWidth={4}
                    /**
                     * disable animations when the timeframe changes
                     */
                    key={timeframe}
                  />
                )}
              </LinePath>
            )}

            {lineTooltip.point && (
              <Group left={lineTooltip.point.x} top={lineTooltip.point.y}>
                <circle
                  r={12}
                  fill={transparentize(
                    0.6,
                    hasSelectedStation
                      ? colors.data.secondary
                      : colors.data.primary
                  )}
                />
                <circle r={7} fill="#fff" />
                <circle
                  r={5}
                  fill={
                    hasSelectedStation
                      ? colors.data.secondary
                      : colors.data.primary
                  }
                />
              </Group>
            )}
          </Group>
        </svg>

        {lineTooltip.datum && (
          <DateTooltip
            bounds={{ left: 0, top: 0, right: width, bottom: height }}
            x={lineTooltip.point.x + dimensions.padding.left}
            y={dimensions.bounds.height + dimensions.padding.top + 2}
          >
            {lineTooltip.datum.dateStartMs ? (
              <>
                {formatDate(lineTooltip.datum.dateStartMs, 'axis')}
                {' – '}
                {formatDate(lineTooltip.datum.dateEndMs, 'axis')}
              </>
            ) : (
              formatDate(lineTooltip.datum.dateMs, 'axis')
            )}
          </DateTooltip>
        )}

        {lineTooltip.point && lineTooltip.datum && (
          <Tooltip
            title={
              hasSelectedStation
                ? lineTooltip.datum.name
                : text.average_label_text
            }
            bounds={{ left: 0, top: 0, right: width, bottom: height }}
            x={lineTooltip.point.x + dimensions.padding.left}
            y={lineTooltip.point.y + dimensions.padding.top}
          >
            <Box display="inline-block">
              <b>
                {formatNumber(lineTooltip.datum.value)} per{' '}
                {formatNumber(100_000)}
              </b>
            </Box>{' '}
            {siteText.common.inwoners}
          </Tooltip>
        )}
      </Box>

      <Legend
        items={[
          sewerStationSelectProps.value
            ? {
                color: colors.data.secondary,
                label: replaceVariablesInText(text.daily_label_text, {
                  name: sewerStationSelectProps.value,
                }),
                shape: 'line' as const,
              }
            : undefined,
          {
            color: hasSelectedStation
              ? colors.data.neutral
              : colors.data.primary,
            label: text.average_label_text,
            shape: 'line' as const,
          },
          stationScatterDataLimited.length > 0
            ? {
                color: 'rgba(89, 89, 89, 0.3)',
                label: text.secondary_label_text,
                shape: 'circle' as const,
              }
            : undefined,
        ].filter(isPresent)}
      />
    </Box>
  );
}
