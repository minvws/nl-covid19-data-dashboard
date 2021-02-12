import { formatNumber, Municipal, Regionaal } from '@corona-dashboard/common';
import css from '@styled-system/css';
import {
  Axis,
  buildChartTheme,
  GlyphSeries,
  Grid,
  LineSeries,
  Tooltip,
  XYChart,
} from '@visx/xychart';
import { RenderTooltipParams } from '@visx/xychart/lib/components/Tooltip';
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { isPresent } from 'ts-is-present';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import { colors } from '~/style/theme';
import { formatDate } from '~/utils/formatDate';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { TimeframeOption } from '~/utils/timeframe';
import { Box } from '../base';
import { Legenda, LegendItem } from '../legenda';
import { Select } from '../select';
import { ValueAnnotation } from '../value-annotation';
import {
  SewerChartValue,
  useSewerChartValues,
  useSewerStationSelectProps,
  getMax,
} from './logic';

const theme = buildChartTheme({
  backgroundColor: '#fff',
  colors: ['#30475e', colors.data.primary],
  tickLength: 10,
  gridColor: '#c4c4c4',
  gridColorDark: '#c4c4c4',
});

interface SewerChartProps {
  data: Regionaal | Municipal;
  timeframe: TimeframeOption;
  valueAnnotation: string;
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

const accessors = {
  xAccessor: (x?: SewerChartValue) => x && x.date,
  yAccessor: (x?: SewerChartValue) => x && x.value,
};

function formatAxisX(date: Date) {
  return formatDate(date, 'axis');
}

export function SewerChart({
  data,
  text,
  timeframe,
  valueAnnotation,
}: SewerChartProps) {
  const [displayOutliers, setDisplayOutliers] = useState(false);
  const { averageValues, stationValues } = useSewerChartValues(
    data,
    timeframe,
    text.average_label_text
  );

  const sewerStationSelectProps = useSewerStationSelectProps(stationValues);

  const selectedStationValues = useMemo(() => {
    const name = sewerStationSelectProps.value;
    return name ? stationValues.filter((x) => x.name === name) : [];
  }, [stationValues, sewerStationSelectProps.value]);

  const maxAverageValue = getMax(averageValues, accessors.yAccessor);
  const maxStationValue = getMax(stationValues, accessors.yAccessor);
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
  const stationValuesFiltered = useMemo(() => {
    return hasOutliers && !displayOutliers
      ? stationValues.filter((x) => x.value <= lineMax)
      : stationValues;
  }, [displayOutliers, hasOutliers, lineMax, stationValues]);

  const hasSelectedStationValues = selectedStationValues
    ? selectedStationValues.length > 0
    : false;

  const legendaItems: LegendItem[] = [
    stationValuesFiltered.length > 0
      ? {
          color: 'rgba(89, 89, 89, 0.3)',
          label: text.secondary_label_text,
          shape: 'circle' as const,
        }
      : undefined,
    {
      color: hasSelectedStationValues
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
  ].filter(isPresent);

  return (
    <Box spacing={4}>
      {valueAnnotation && (
        <ValueAnnotation mb={2}>{valueAnnotation}</ValueAnnotation>
      )}
      {sewerStationSelectProps.options.length > 0 && (
        <Box display="flex" justifyContent="flex-end">
          <Select
            placeholder={text.select_station_placeholder}
            {...sewerStationSelectProps}
          />
        </Box>
      )}

      {hasOutliers && (
        <ToggleOutliersButton
          onClick={() => setDisplayOutliers(!displayOutliers)}
        >
          {displayOutliers ? text.hide_outliers : text.display_outliers}
        </ToggleOutliersButton>
      )}

      <XYChart
        height={300}
        xScale={{ type: 'time' }}
        yScale={{ type: 'linear' }}
        theme={theme}
      >
        <Axis orientation="bottom" tickFormat={formatAxisX} />
        <Axis orientation="left" numTicks={3} />
        <text x="0" y="25" fontSize={12} fill="#495057">
          {valueAnnotation}
        </text>
        <Grid rows columns={false} numTicks={3} />

        {stationValuesFiltered.length > 0 && (
          <GlyphSeries
            dataKey="stationValues"
            data={stationValuesFiltered}
            size={4}
            enableEvents={false}
            colorAccessor={() => `rgba(89, 89, 89, 0.3)`}
            {...accessors}
          />
        )}

        <LineSeries
          dataKey="averageValues"
          data={averageValues}
          enableEvents={!hasSelectedStationValues}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={5}
          stroke={
            hasSelectedStationValues ? colors.data.neutral : colors.data.primary
          }
          {...accessors}
        />

        {hasSelectedStationValues && (
          <LineSeries
            dataKey="selectedStationValues"
            data={selectedStationValues}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={5}
            stroke={colors.data.secondary}
            {...accessors}
          />
        )}

        <Tooltip<SewerChartValue>
          showVerticalCrosshair
          snapTooltipToDatumY
          showSeriesGlyphs
          snapTooltipToDatumX
          applyPositionStyle
          renderTooltip={SewerTooltip}
          detectBounds
          style={{ pointerEvents: 'none', zIndex: 9999 }}
          glyphStyle={{
            fill: hasSelectedStationValues
              ? colors.data.secondary
              : colors.data.primary,
          }}
        />
      </XYChart>

      <Box>
        <Legenda items={legendaItems} />
      </Box>
    </Box>
  );
}

const ToggleOutliersButton = styled.button(
  css({
    background: 'tileGray',
    border: 0,
    p: 1,
    color: 'blue',
    width: '100%',
    cursor: 'pointer',
  })
);

function SewerTooltip({ tooltipData }: RenderTooltipParams<SewerChartValue>) {
  const datum = tooltipData?.nearestDatum;

  if (!datum) return null;

  return (
    <div
      css={css({
        bg: 'white',
        boxShadow: 'rgba(33, 33, 33, 0.2) 0px 1px 2px',
        pointerEvents: 'none',
        zIndex: 1000,
        borderRadius: 1,
      })}
    >
      <TooltipContent title={datum.datum.name}>
        <div css={css({ whiteSpace: 'nowrap' })}>
          <b>{formatNumber(datum.datum.value)} per 100.000</b> inwoners
        </div>
      </TooltipContent>
    </div>
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
