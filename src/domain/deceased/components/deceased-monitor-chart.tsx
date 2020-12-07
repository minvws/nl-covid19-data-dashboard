import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {
  NationalDeceasedCbsValue,
  RegionalDeceasedCbsValue,
} from '~/types/data';
import { formatDateFromMilliseconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';

if (typeof Highcharts === 'object') {
  require('highcharts/highcharts-more')(Highcharts);
}

type CbsValue = NationalDeceasedCbsValue | RegionalDeceasedCbsValue;

type SeriesConfig = Record<
  'registered' | 'expected' | 'margin',
  {
    label: string;
    color: string;
  }
>;

interface DeceasedMonitorProps {
  values: CbsValue[];
  config: SeriesConfig;
}

export default function DeceasedMonitorChart(props: DeceasedMonitorProps) {
  const { config, values } = props;
  const chartOptions = useHighchartOptions(values, config);

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
}

function useHighchartOptions(values: CbsValue[], config: SeriesConfig) {
  const allYValues = values.flatMap((x) => [
    x.registered,
    x.expected,
    x.expected_min,
    x.expected_max,
  ]);

  const yMin = Math.min(...allYValues);
  const yMax = Math.max(...allYValues);

  return {
    chart: {
      alignTicks: true,
      animation: false,
      backgroundColor: 'transparent',
      borderColor: '#000',
      borderRadius: 0,
      borderWidth: 0,
      className: 'undefined',
      colorCount: 10,
      displayErrors: true,
      height: 300,
    },
    legend: { enabled: false },
    credits: {
      enabled: false,
    },
    title: {
      text: undefined,
    },
    xAxis: {
      lineColor: '#C4C4C4',
      gridLineColor: '#ca005d',
      type: 'datetime',
      categories: values.map((x) => (x.week_start_unix * 1000).toString()),
      title: {
        text: null,
      },
      crosshair: {
        color: '#A3A3A3',
        dashStyle: 'Dash',
        width: 1,
      },
      labels: {
        align: 'right',
        x: 10,
        /**
         * The number 0 doesn't work properly, probably because highcharts does
         * some buggy `if(labels.rotation) {}` which yields false for the number 0.
         */
        rotation: ('0' as unknown) as number,
        formatter: function () {
          return this.isFirst || this.isLast
            ? formatDateFromMilliseconds(this.value, 'axis')
            : '';
        },
      },
    },
    yAxis: {
      min: yMin,
      max: yMax,
      lineColor: '#C4C4C4',
      gridLineColor: '#C4C4C4',

      tickAmount: 3,
      title: {
        text: null,
      },
      labels: {
        formatter: function (): string {
          return formatNumber(this.value);
        },
      },
    },

    tooltip: {
      useHTML: true,
      shared: true,

      backgroundColor: '#FFF',
      borderColor: '#01689B',
      borderRadius: 0,
      xDateFormat: '%d %b %y',
      formatter() {
        const value = values.find((x) => x.week_start_unix === this.x / 1000);

        if (!value) return;

        const dateText = [
          value.week_start_unix * 1000,
          value.week_end_unix * 1000,
        ]
          .map((x) => formatDateFromMilliseconds(x, 'medium'))
          .join(' - ');

        const expectedText = formatNumber(value.expected);
        const registeredText = formatNumber(value.registered);
        const marginText = [value.expected_min, value.expected_max]
          .map(formatNumber)
          .join(' - ');

        return `
            <div style="margin-bottom: 8px;">${dateText}</div>

            <div style="margin-bottom: 4px;">${config.registered.label}: <strong>${registeredText}</strong></div>

            <div style="margin-bottom: 4px;">${config.expected.label}: <strong>${expectedText}</strong></div>

            <div style="margin-bottom: 4px;">${config.margin.label}: <strong>${marginText}</strong></div>

          `;
      },
    },

    series: [
      {
        type: 'arearange',
        data: values.map((x) => [
          new Date(x.week_start_unix * 1000),
          x.expected_min,
          x.expected_max,
        ]),
        name: config.margin.label,
        color: config.margin.color,
        opacity: 1,
        fillOpacity: 1,
        marker: {
          enabled: false,
        },
      },
      {
        type: 'line',
        data: values.map((x) => [
          new Date(x.week_start_unix * 1000),
          x.expected,
        ]),
        name: config.expected.label,
        color: config.expected.color,
        lineWidth: 2,
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
      {
        type: 'line',
        data: values.map((x) => [
          new Date(x.week_start_unix * 1000),
          x.registered,
        ]),
        name: config.registered.label,
        color: config.registered.color,
        lineWidth: 2,
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
    ],
  } as Highcharts.Options;
}
