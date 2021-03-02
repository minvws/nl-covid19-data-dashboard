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
import { Legenda } from '~/components-styled/legenda';
import { Select } from '~/components-styled/select';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import siteText from '~/locale';
import { colors } from '~/style/theme';
import { formatDate } from '~/utils/formatDate';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { TimeframeOption } from '~/utils/timeframe';
import { useElementSize } from '~/utils/use-element-size';
import { ScatterPlot } from './components/scatter-plot';
import { ToggleOutlierButton } from './components/toggle-outlier-button';
import { DateTooltip, Tooltip } from './components/tooltip';
import {
  Dimensions,
  useLineTooltip,
  useSelectedStationValues,
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

  /**
   * Grab width and default to 400 (SSR)
   */
  const [sizeRef, { width }] = useElementSize<HTMLDivElement>(400);

  /**
   * State for toggling outliers visibility
   */
  const [displayOutliers, setDisplayOutliers] = useState(false);

  /**
   * filter and shape data for our line-chart and scatter plot
   */
  const { averageValues, stationValues } = useSewerChartValues(data, timeframe);
  /**
   * create props for the station select dropdown
   */
  const sewerStationSelectProps = useSewerStationSelectProps(stationValues);
  const hasSelectedStation = !!sewerStationSelectProps.value;

  /**
   * get filtered station values based on the `displayOutliers`-toggle
   */
  const {
    stationValuesFiltered,
    hasOutliers,
    selectedStationValues,
    outlierValues,
  } = useSelectedStationValues(
    sewerStationSelectProps.value,
    stationValues,
    averageValues,
    displayOutliers
  );

  /**
   * cache paddings and bounds between renders
   */
  const dimensions = useMemo<Dimensions>(() => {
    const padding = {
      top: 20,
      right: 10,
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
    useMemo(() => [...averageValues, ...stationValuesFiltered], [
      averageValues,
      stationValuesFiltered,
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
    values: hasSelectedStation ? selectedStationValues : averageValues,
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
        position="relative"
        /**
         * The margin-bottom has been eyeballed to visually attach the
         * button to the graph, not sure how future-proof this is.
         */
        mb={-38}
        zIndex={1}
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
          width={width}
          height={52}
          role="img"
          style={{ pointerEvents: 'none' }}
        >
          {outlierValues && (
            <Group left={dimensions.padding.left}>
              <ScatterPlot
                data={outlierValues}
                getX={scales.getX}
                getY={() => 26}
                color="rgba(89, 89, 89, 0.8)"
                radius={4}
                dottedOutline
              />
            </Group>
          )}
        </svg>
        <svg
          role="img"
          width={width}
          height={height}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          style={{
            touchAction: 'pan-y', // allow vertical scroll, but capture horizontal
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
                x={lineTooltip.point.x - 4}
                width={8}
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
              data={stationValuesFiltered}
              getX={scales.getX}
              getY={scales.getY}
              color="rgba(89, 89, 89, 0.3)"
              radius={2}
            />

            <LinePath
              data={averageValues}
              x={scales.getX}
              y={scales.getY}
              stroke={
                hasSelectedStation ? colors.data.neutral : colors.data.primary
              }
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {hasSelectedStation && (
              <LinePath
                data={selectedStationValues}
                x={scales.getX}
                y={scales.getY}
                strokeWidth={4}
                stroke={colors.data.secondary}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
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

        {lineTooltip.datum && lineTooltip.point && (
          <DateTooltip
            bounds={{ left: 0, top: 0, right: width, bottom: height }}
            x={lineTooltip.point.x + dimensions.padding.left}
            y={dimensions.bounds.height + dimensions.padding.top + 2}
          >
            {formatDate(lineTooltip.datum?.dateMs)}
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
              <b>{lineTooltip.datum.value} per 100.000</b>
            </Box>{' '}
            {siteText.common.inwoners}
          </Tooltip>
        )}
      </Box>

      <Legenda
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
          stationValuesFiltered.length > 0
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
