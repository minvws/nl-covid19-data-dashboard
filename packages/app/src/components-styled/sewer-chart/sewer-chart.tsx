import { formatNumber, Municipal, Regionaal } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Label } from '@visx/annotation';
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
import { Tooltip } from './components/tooltip';
import {
  Dimensions,
  useLineTooltip,
  usePointDistance,
  useScatterTooltip,
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
   * Call tooltip hooks for determining which datum should have "hover"-focus.
   */
  const scatterTooltip = useScatterTooltip({
    values: stationValuesFiltered,
    scales,
    dimensions,
  });

  const lineTooltip = useLineTooltip({
    values: hasSelectedStation ? selectedStationValues : averageValues,
    scales,
    dimensions,
  });

  /**
   * For touch devices we'll measure pointer movement distance in order to
   * prevent simulating a "click" (highlight a specific line) when someone has
   * been "panning/dragging" instead of clicking.
   */
  const pointDistance = usePointDistance();
  const handlePointerDown = useCallback(
    (evt: PointerEvent<SVGSVGElement>) => {
      const point = localPoint(evt);
      if (point) pointDistance.start(point);
    },
    [pointDistance]
  );

  const handlePointerMove = useCallback(
    (evt: PointerEvent<SVGSVGElement>) => {
      // find the nearest polygon to the current mouse position
      const point = localPoint(evt);
      if (!point) return;

      /**
       * update pan distance
       */
      pointDistance.add(point);
      /**
       * find new tooltip datums to highlight
       */
      scatterTooltip.findClosest(point);
      lineTooltip.findClosest(point);
    },
    [lineTooltip, pointDistance, scatterTooltip]
  );

  const handlePointerUp = useCallback(() => {
    /**
     * update selected line when pan-distance is below threshold and when
     * the pointer is currently close to a scatter value
     */
    if (pointDistance.distanceRef.current < 10 && scatterTooltip.datum) {
      sewerStationSelectProps.onChange(scatterTooltip.datum.name);
    }
  }, [
    pointDistance.distanceRef,
    scatterTooltip.datum,
    sewerStationSelectProps,
  ]);

  /**
   * hide tooltips when focus is lost
   */
  const clearTooltips = useDebouncedCallback(() => {
    scatterTooltip.clear();
    lineTooltip.clear();
  }, 300);

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
        mb={-19}
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
          role="img"
          width={width}
          height={height}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          style={{
            cursor: scatterTooltip.datum ? 'pointer' : 'default',
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

            {lineTooltip.datum && lineTooltip.point && (
              <Label
                x={lineTooltip.point.x}
                y={dimensions.bounds.height + 2}
                title={formatDate(lineTooltip.datum?.dateMs)}
                horizontalAnchor="middle"
                verticalAnchor="start"
                backgroundFill="#fff"
                showAnchorLine={false}
                fontColor={colors.data.benchmark}
                titleFontSize={14}
                titleFontWeight={'bold'}
                backgroundPadding={6}
              />
            )}

            <AxisLeft
              scale={scales.yScale}
              tickValues={tickValuesY}
              hideTicks
              hideAxisLine
              stroke={colors.data.axis}
              tickFormat={formatNumber}
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
              r={2}
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

            {scatterTooltip.point && (
              <circle
                r={2}
                fill={colors.data.benchmark}
                cx={scatterTooltip.point.x}
                cy={scatterTooltip.point.y}
                css={css({
                  willChange: 'transform',
                  transitionProperty: 'cx, cy',
                  transitionDuration: '75ms',
                  transitionTimingFunction: 'ease-out',
                })}
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
          stationValuesFiltered.length > 0
            ? {
                color: 'rgba(89, 89, 89, 0.3)',
                label: text.secondary_label_text,
                shape: 'circle' as const,
              }
            : undefined,
          {
            color: hasSelectedStation
              ? colors.data.neutral
              : colors.data.primary,
            label: text.average_label_text,
            shape: 'line' as const,
          },
          sewerStationSelectProps.value
            ? {
                color: colors.data.secondary,
                label: replaceVariablesInText(text.daily_label_text, {
                  name: sewerStationSelectProps.value,
                }),
                shape: 'line' as const,
              }
            : undefined,
        ].filter(isPresent)}
      />
    </Box>
  );
}
