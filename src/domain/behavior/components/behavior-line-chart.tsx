import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';
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

  const filteredValueLists = values.map((lineValues) => {
    return getFilteredValues<Value>(
      lineValues,
      timeframe,
      (value: Value) => value.date * 1000
    );
  });

  const chartOptions = getChartOptions(filteredValueLists, linesConfig);

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
}

function getChartOptions(values: Value[][], linesConfig: LineConfig[]) {
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
    credits: { enabled: false },
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
        const { originalData: value } = (this.point as unknown) as {
          originalData: Value;
        };

        const [dateFrom, dateTo] = [
          formatDateFromSeconds(value.week.start, 'axis'),
          formatDateFromSeconds(value.week.end, 'axis'),
        ];

        return `
          <div style='margin-bottom: 0.5em'>
            ${dateFrom} - ${dateTo}: <strong>${value.value}%</strong>
          </div>
          <div>
            ${value.label}
          </div>
        `;
      },
    },
    yAxis: {
      min: 0,
      max: 100,
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
    title: { text: undefined },
    series: values.map((list, index) => ({
      ...(linesConfig[index] || {}),

      type: 'line',
      cursor: 'pointer',
      showInLegend: false,

      data: list.map((value) => ({ y: value.value, originalData: value })),

      marker: { enabled: false },
      states: { inactive: { opacity: 1 } },
    })),

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
