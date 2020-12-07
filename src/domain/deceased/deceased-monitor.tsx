import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { NationalDeceasedCbsValue } from '~/types/data';
import { createDate } from '~/utils/createDate';
import { formatDateFromMilliseconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';

if (typeof Highcharts === 'object') {
  require('highcharts/highcharts-more')(Highcharts);
}

type SeriesConfig = Record<
  'registered' | 'expected' | 'margin',
  {
    label: string;
    color: string;
  }
>;

interface DeceasedMonitorProps {
  values: NationalDeceasedCbsValue[];
  config: SeriesConfig;
}

export default function DeceasedMonitor(props: DeceasedMonitorProps) {
  const { config, values } = props;
  const chartOptions = useHighchartOptions(values, config);

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
}

function useHighchartOptions(
  values: NationalDeceasedCbsValue[],
  config: SeriesConfig
) {
  const marginValues = values.map(
    (x) =>
      [
        createDate(x.date_of_report_unix),
        x.expected_min,
        x.expected_max,
      ] as const
  );

  const expectedValues = values.map(
    (x) => [createDate(x.date_of_report_unix), x.expected] as const
  );

  const registeredValues = values.map(
    (x) => [createDate(x.date_of_report_unix), x.registered] as const
  );

  const allYValues = [
    ...marginValues.flatMap(([_, a, b]) => [a, b]),
    ...expectedValues.map(([_, a]) => a),
    ...registeredValues.map(([_, a]) => a),
  ];

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
      categories: expectedValues.map((el) => el[0].getTime() as any),
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
      shared: true,

      backgroundColor: '#FFF',
      borderColor: '#01689B',
      borderRadius: 0,
      xDateFormat: '%d %b %y',
      formatter() {
        const marginPoint = marginValues.find(
          (el) => el[0].getTime() === this.x
        );

        if (!marginPoint) return;

        const [, minPoint, maxPoint] = marginPoint;
        const expectedPoint = expectedValues.find(
          (el) => el[0].getTime() === this.x
        );
        const registeredPoint = registeredValues.find(
          (el) => el[0].getTime() === this.x
        );

        const dateText = formatDateFromMilliseconds(this.x, 'medium');
        const marginText = [minPoint, maxPoint].map(formatNumber).join(' - ');
        const expectedText = expectedPoint
          ? formatNumber(expectedPoint[1])
          : '–';
        const registeredText = registeredPoint
          ? formatNumber(registeredPoint[1])
          : '–';

        return `
            ${dateText}<br/>
            <strong>${config.registered.label}</strong> ${registeredText}<br/>
            <strong>${config.expected.label}</strong> ${expectedText}<br/>
            <strong>${config.margin.label}</strong> ${marginText}<br/>
          `;
      },
    },

    series: [
      {
        type: 'arearange',
        data: marginValues,
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
        data: expectedValues.map((el) => el[1]),
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
        data: registeredValues.map((el) => el[1]),
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
