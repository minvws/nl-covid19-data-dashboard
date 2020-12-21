import React, { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { HighchartsWrapper } from '~/components/highcharts-wrapper';
import text from '~/locale/index';
import { assert } from '~/utils/assert';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { getFilteredValues, TimeframeOption } from '~/utils/timeframe';
import { Value } from './lineChartWithWeekTooltip';

interface LineConfig {
  color: string;
  legendLabel: string;
}

const SIGNAALWAARDE_Z_INDEX = 5;

export interface MultipleLineChartProps {
  values: Value[][];
  linesConfig: LineConfig[];
  signaalwaarde?: number;
  timeframe?: TimeframeOption;
}

function getChartOptions(
  values: Value[][],
  linesConfig: LineConfig[],
  signaalwaarde?: number
) {
  const yMax = values.reduce((max, list) => {
    const listMax = calculateYMax(list, signaalwaarde);
    return Math.max(max, listMax);
  }, 0);

  const categories = values
    .flatMap((value) => value.map((value) => value.date.toString()))
    .filter((date, index, self) => self.indexOf(date) === index);

  const options: Highcharts.Options = {
    chart: {
      alignTicks: true,
      animation: false,
      backgroundColor: 'transparent',
      borderColor: '#000',
      borderRadius: 0,
      borderWidth: 0,
      colorCount: 10,
      displayErrors: true,
      height: 275,
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      lineColor: '#C4C4C4',
      gridLineColor: '#ca005d',
      type: 'datetime',
      title: {
        text: null,
      },
      categories: categories,
      labels: {
        align: 'right',
        // types say `rotation` needs to be a number,
        // but that doesn’t work.
        rotation: '0' as any,
        formatter: function () {
          return this.isFirst || this.isLast
            ? formatDateFromSeconds(this.value, 'axis')
            : '';
        },
      },
      crosshair: true,
    },
    tooltip: {
      backgroundColor: '#FFF',
      borderColor: '#01689B',
      borderRadius: 0,
      shared: true,
      useHTML: true,
      formatter: function (): string {
        const contextObjects = this
          .points as Highcharts.TooltipFormatterContextObject[];

        const percentage = (contextObjects[1].y * 100) / contextObjects[0].y;

        const { originalData } = (contextObjects[0].point as unknown) as {
          originalData: Value;
        };

        return `${formatDateFromSeconds(
          originalData.week.start,
          'short'
        )} - ${formatDateFromSeconds(originalData.week.end, 'short')}<br/>
        <span style="height: 0.5em;width: 0.5em;background-color: ${
          linesConfig[0].color
        };border-radius: 50%;display: inline-block;"></span> ${formatNumber(
          contextObjects[0].y
        )}<br/>
        <span style="height: 0.5em;width: 0.5em;background-color: ${
          linesConfig[1].color
        };border-radius: 50%;display: inline-block;"></span> ${formatNumber(
          contextObjects[1].y
        )} (${formatPercentage(percentage)}%)`;
      },
    },
    yAxis: {
      min: 0,
      minRange: 0.1,
      max: yMax,
      allowDecimals: false,
      lineColor: '#C4C4C4',
      gridLineColor: '#C4C4C4',
      title: {
        text: null,
      },
      labels: {
        formatter: function () {
          return formatNumber(this.value);
        },
      },
      plotLines: signaalwaarde
        ? [
            {
              value: signaalwaarde,
              dashStyle: 'Dash',
              width: 1,
              color: '#4f5458',
              zIndex: SIGNAALWAARDE_Z_INDEX,
              label: {
                text: text.common.barScale.signaalwaarde,
                align: 'right',
                y: -8,
                x: 0,
                style: {
                  color: '#4f5458',
                },
              },
            },
            /**
             * In order to show the value of the signaalwaarde, we plot a second
             * transparent line, and only use its label positioned at the y-axis.
             */
            {
              value: signaalwaarde,
              color: 'transparent',
              zIndex: SIGNAALWAARDE_Z_INDEX,
              label: {
                text: `${signaalwaarde}`,
                align: 'left',
                y: -8,
                x: 0,
                style: {
                  color: '#4f5458',
                },
              },
            },
          ]
        : undefined,
    },
    title: {
      text: undefined,
    },
    series: values.map((list, index) => ({
      type: 'line',
      data: list.map((value) => ({ y: value.value, originalData: value })),
      name: linesConfig[index].legendLabel,
      showInLegend: true,
      color: linesConfig[index].color,
      // hex to rgb converted, added opacity
      marker: {
        enabled: false,
      },
    })),
    legend: {
      itemWidth: 300,
      reversed: true,
      itemHoverStyle: {
        color: '#666',
      },
      itemStyle: {
        color: '#666',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 'normal',
        textOverflow: 'ellipsis',
      },
    },
    plotOptions: {
      line: {
        marker: {
          enabled: false,
          symbol: 'circle',
          radius: 2,
          states: {
            hover: {
              enabled: true,
            },
          },
        },
      },
    },
  };

  return options;
}

export function MultipleLineChart({
  values,
  linesConfig,
  signaalwaarde,
  timeframe = '5weeks',
}: MultipleLineChartProps) {
  assert(
    values.length === linesConfig.length,
    'Values length must equal linesConfig length'
  );

  const chartOptions = useMemo(() => {
    const filteredValueLists = values.map((lineValues) => {
      return getFilteredValues<Value>(
        lineValues,
        timeframe,
        (value: Value) => value.date * 1000
      );
    });
    return getChartOptions(filteredValueLists, linesConfig, signaalwaarde);
  }, [values, linesConfig, timeframe, signaalwaarde]);

  return <HighchartsWrapper options={chartOptions} />;
}

/**
 * From all the defined values, extract the highest number so we know how to
 * scale the y-axis
 */
function calculateYMax(values: Value[], signaalwaarde = -Infinity) {
  const maxValue = values
    .map((x) => x.value)
    .filter(isDefined)
    .reduce((acc, value) => (value > acc ? value : acc), -Infinity);

  // Value cannot be 0, hence the 1
  return Math.max(maxValue, signaalwaarde + 10, 1);
}
