import { HighchartsWrapper } from '~/components/highcharts-wrapper';
import {
  NationalDeceasedCbsValue,
  RegionalDeceasedCbsValue,
} from '@corona-dashboard/common';
import { createDate } from '~/utils/createDate';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { colors } from '~/style/theme';

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

  return <HighchartsWrapper options={chartOptions} />;
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
      lineColor: colors.silver,
      gridLineColor: '#ca005d',
      type: 'datetime',
      categories: values.map((x) => x.date_start_unix.toString()),
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
          const value = values.find(
            (x) => x.date_start_unix === Number(this.value)
          );

          if (!value) return '';

          return this.isFirst
            ? formatDateFromSeconds(value.date_start_unix, 'axis')
            : this.isLast
            ? formatDateFromSeconds(value.date_end_unix, 'axis')
            : '';
        },
      },
    },
    yAxis: {
      min: yMin,
      max: yMax,
      lineColor: colors.silver,
      gridLineColor: colors.silver,

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
        const value = values.find((x) => x.date_start_unix === Number(this.x));

        if (!value) return;

        const dateText = [value.date_start_unix, value.date_end_unix]
          .map((x) => formatDateFromSeconds(x, 'medium'))
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
          createDate(x.date_start_unix),
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
        data: values.map((x) => [createDate(x.date_start_unix), x.expected]),
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
        data: values.map((x) => [createDate(x.date_start_unix), x.registered]),
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
