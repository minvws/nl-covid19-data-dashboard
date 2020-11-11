import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { assert } from '~/utils/assert';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { getFilteredValues, TimeframeOption } from '~/utils/timeframe';

type LineConfig = Omit<Highcharts.SeriesLineOptions, 'type'>;

export interface Value {
  date: number;
  value: number;
  label: string;
  week: Week;
}

interface Week {
  start: number;
  end: number;
}

interface MultipleLineChartProps {
  values: Value[][];
  linesConfig: LineConfig[];
}

export function BehaviorLineChart({
  values,
  linesConfig,
}: MultipleLineChartProps) {
  const timeframe: TimeframeOption = 'all';

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
    return getChartOptions(filteredValueLists, linesConfig);
  }, [values, linesConfig, timeframe]);

  return (
    <section>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </section>
  );
}

function getChartOptions(values: Value[][], linesConfig: LineConfig[]) {
  const yMax = values.reduce((max, list) => {
    const listMax = calculateYMax(list);
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
      categories,
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
      crosshair: {
        color: '#3391CC',
        width: 1,
      },
    },
    tooltip: {
      backgroundColor: '#FFF',
      borderColor: '#01689B',
      borderRadius: 0,
      shared: false,
      useHTML: true,
      formatter: function (): string {
        const {
          originalData: { value, week, label },
        } = (this.point as unknown) as {
          originalData: Value;
        };

        const [dateFrom, dateTo] = [
          formatDateFromSeconds(week.start, 'axis'),
          formatDateFromSeconds(week.end, 'axis'),
        ];

        return `
          <div style='margin-bottom: 0.5em'>
            ${dateFrom} - ${dateTo}: <strong>${value}%</strong>
          </div>
          <div>
            ${label}
          </div>
        `;
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
          return `${this.value}%`;
        },
      },
    },
    title: {
      text: undefined,
    },
    series: values.map((list, index) => ({
      ...(linesConfig[index] || {}),
      type: 'line',
      data: list.map((value) => ({ y: value.value, originalData: value })),
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
