import { formatNumber, Municipal, Regionaal } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { localPoint } from '@visx/event';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { ParentSize } from '@visx/responsive';
import { LinePath } from '@visx/shape';
import { PointerEvent, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { isPresent } from 'ts-is-present';
import { Box } from '~/components-styled/base';
import { Select } from '~/components-styled/select';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import { colors } from '~/style/theme';
import { formatDate } from '~/utils/formatDate';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { TimeframeOption } from '~/utils/timeframe';
import { Legenda } from '../legenda';
import {
  Dimensions,
  useScatterTooltip,
  useSelectedStationValues,
  useSewerChartScales,
  useSewerChartValues,
  useSewerStationSelectProps,
} from './logic-2';

export type SewerChart2Props = {
  data: Regionaal | Municipal;
  timeframe: TimeframeOption;
  valueAnnotation: string;
  width?: number;
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
};

export function SewerChart2(props: SewerChart2Props) {
  const { data, timeframe, valueAnnotation, width, height = 300, text } = props;

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

  const dimensions = useMemo<Dimensions>(() => {
    const padding = { top: 20, right: 10, bottom: 30, left: 50 };
    const bounds = {
      width: (width || 0) - padding.left - padding.right,
      height: height - padding.top - padding.bottom,
    };
    return { padding, bounds };
  }, [height, width]);

  const scales = useSewerChartScales(
    useMemo(() => [...averageValues, ...stationValuesFiltered], [
      averageValues,
      stationValuesFiltered,
    ]),
    dimensions.bounds
  );

  const scatterTooltip = useScatterTooltip({
    values: stationValuesFiltered,
    scales,
    dimensions,
  });

  const handlePointerMove = useCallback(
    (evt: PointerEvent<SVGSVGElement>) => {
      // find the nearest polygon to the current mouse position
      const point = localPoint(evt);

      if (!point) return;

      scatterTooltip.findClosest({
        x: point.x - dimensions.padding.left,
        y: point.y - dimensions.padding.top,
      });
    },
    [dimensions, scatterTooltip]
  );

  const handlePointerUp = useCallback(() => {
    if (scatterTooltip.datum) {
      sewerStationSelectProps.onChange(scatterTooltip.datum.name);
    }
  }, [scatterTooltip.datum, sewerStationSelectProps]);

  const tickValuesY = useMemo(
    () => [
      scales.yScale.domain()[0],
      scales.yScale.domain()[1] / 2,
      scales.yScale.domain()[1],
    ],
    [scales.yScale]
  );

  const hasSelectedStation = !!sewerStationSelectProps.value;

  /**
   * Make sure we have a width by recursively wrapping this component inside
   * a ParentSize component.
   */
  if (width === undefined) {
    return (
      <ParentSize>
        {(parent) => <SewerChart2 {...props} width={parent.width} />}
      </ParentSize>
    );
  }

  return (
    <Box>
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

        {hasOutliers && (
          <Box
            ml={dimensions.padding.left}
            mr={dimensions.padding.right}
            position="relative"
            /**
             * The margin-bottom has been eyeballed to visually attach the
             * button to the graph, not sure how future-proof this is.
             */
            mb={-19}
          >
            <ToggleOutliersButton
              onClick={() => setDisplayOutliers(!displayOutliers)}
            >
              {displayOutliers ? text.hide_outliers : text.display_outliers}
            </ToggleOutliersButton>
          </Box>
        )}

        <svg
          width={width}
          height={height}
          role="img"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{ cursor: scatterTooltip.datum ? 'pointer' : 'default' }}
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

            <Group>
              {stationValuesFiltered.map((datum) => (
                <circle
                  key={datum.id}
                  cx={scales.getX(datum)}
                  cy={scales.getY(datum)}
                  fill={
                    scatterTooltip.datum === datum
                      ? colors.data.benchmark
                      : 'rgba(89, 89, 89, 0.3)'
                  }
                  r={3}
                  css={css({
                    transitionProperty: 'fill',
                    transitionDuration:
                      scatterTooltip.datum === datum ? '75ms' : '225ms',
                  })}
                />
              ))}
            </Group>

            <LinePath
              data={averageValues}
              x={scales.getX}
              y={scales.getY}
              stroke={
                hasSelectedStation ? colors.data.neutral : colors.data.primary
              }
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {hasSelectedStation && (
              <LinePath
                data={selectedStationValues}
                x={scales.getX}
                y={scales.getY}
                strokeWidth={5}
                stroke={colors.data.secondary}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </Group>
        </svg>
      </Box>

      <Box>
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
    </Box>
  );
}

// function SewerTooltip() {
//   // const datum = tooltipData?.nearestDatum;

//   // if (!datum) return null;

//   // const value = datum.datum.value
//   const title = 'foo bar';
//   const value = 1234;

//   return (
//     <div
//       css={css({
//         bg: 'white',
//         boxShadow: 'rgba(33, 33, 33, 0.2) 0px 1px 2px',
//         pointerEvents: 'none',
//         zIndex: 1000,
//         borderRadius: 1,
//       })}
//     >
//       <TooltipContent title={title}>
//         <div css={css({ whiteSpace: 'nowrap' })}>
//           <b>{formatNumber(value)} per 100.000</b> inwoners
//         </div>
//       </TooltipContent>
//     </div>
//   );
// }

const ToggleOutliersButton = styled.button(
  css({
    bg: 'rgba(218, 218, 218, 0.2)',
    border: 0,
    p: 1,
    color: 'blue',
    width: '100%',
    cursor: 'pointer',
    height: '26px',
    fontSize: 1,
    '&:hover': { bg: 'rgba(218, 218, 218, 0.3)' },
  })
);
