import React from 'react';
import { HighchartsWrapper } from '~/components/highcharts-wrapper';
import { colors } from '~/style/theme';
import { assert } from '~/utils/assert';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { getFilteredValues } from '~/utils/timeframe';

interface LineConfig<T> {
  id: T;
  isSelected: boolean;
  onClick: (id: T) => void;
}

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

interface MultipleLineChartProps<T> {
  values: Value[][];
  linesConfig: LineConfig<T>[];
}

const COLOR_FOCUS = colors.data.primary;
const COLOR_BLUR = '#E7E7E7';

export function BehaviorLineChart<T>({
  values,
  linesConfig,
}: MultipleLineChartProps<T>) {
  assert(
    values.length === linesConfig.length,
    'Values length must equal linesConfig length'
  );

  const filteredValueLists = values.map((lineValues) =>
    getFilteredValues(lineValues, 'all', (x) => x.date * 1000)
  );

  const options = getChartOptions<T>(filteredValueLists, linesConfig);

  return <HighchartsWrapper options={options} />;
}

function getChartOptions<T>(values: Value[][], linesConfig: LineConfig<T>[]) {
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
    series: values.map((list, index) => {
      const { id, isSelected, onClick } = linesConfig[index];

      return {
        type: 'line',
        showInLegend: false,

        data: list.map((value) => ({ y: value.value, originalData: value })),

        states: {
          inactive: {
            opacity: 1,
          },
        },

        color: isSelected ? COLOR_FOCUS : COLOR_BLUR,
        lineWidth: isSelected ? 3 : 2,
        zIndex: isSelected ? 2 : 1,
        events: {
          click: function () {
            onClick(id);
          },
        },

        marker: {
          enabled: false,
          symbol: 'circle',
          radius: 2,
          color: COLOR_FOCUS,
          fillColor: COLOR_FOCUS,
          cursor: 'pointer',
          states: {
            hover: {
              enabled: true,
            },
          },
        },

        cursor: 'pointer',
      };
    }),
  };

  return options;
}
