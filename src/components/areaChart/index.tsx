import { useMemo, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import styles from './areaChart.module.scss';
import {
  ChartTimeControls,
  TimeframeOption,
} from '~/components/chartTimeControls';

import { formatNumber } from '~/utils/formatNumber';
import { formatDate } from '~/utils/formatDate';
import text from '~/locale/index';
import { getFilteredValues } from '~/components/chartTimeControls/chartTimeControlUtils';

if (typeof Highcharts === 'object') {
  require('highcharts/highcharts-more')(Highcharts);
}

type TRange = [Date, number | null, number | null];
type TLine = [Date, number | null];

const SIGNAALWAARDE_Z_INDEX = 10;

interface AreaChartProps {
  title: string;
  description?: string;
  rangeLegendLabel: string;
  lineLegendLabel: string;
  data: Array<{
    avg: number | null;
    date: number;
    min: number | null;
    max: number | null;
  }>;
  signaalwaarde?: number;
  timeframeOptions?: TimeframeOption[];
}

type IGetOptions = Omit<AreaChartProps, 'data' | 'title' | 'description'> & {
  rangeData: TRange[];
  lineData: TLine[];
};

function getChartOptions(props: IGetOptions): Highcharts.Options {
  const {
    rangeData,
    signaalwaarde,
    lineData,
    rangeLegendLabel,
    lineLegendLabel,
  } = props;

  /**
   * Adding an absolute value to the yMax like in LineChart doesn't seem to
   * work well for AreaChart given the values it is rendered with. So for
   * now we use a (relative) 20% increase.
   */
  const PADDING_INCREASE = 1.2;

  const yMax = calculateYMax(
    rangeData,
    (signaalwaarde || -Infinity) * PADDING_INCREASE
  );

  const options: Highcharts.Options = {
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
      height: 175,
    },
    legend: false as any,
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
      categories: rangeData.map((el) => el[0].getTime() as any),
      title: {
        text: null,
      },
      labels: {
        align: 'right',
        x: 10,
        rotation: '0' as any,
        formatter: function () {
          return this.isFirst || this.isLast
            ? formatDate(this.value, 'axis')
            : '';
        },
      },
    },
    yAxis: {
      min: 0,
      max: yMax,
      lineColor: '#C4C4C4',
      gridLineColor: '#C4C4C4',
      title: {
        text: null,
      },
      labels: {
        formatter: function (): string {
          return formatNumber(this.value);
        },
      },
      plotLines: signaalwaarde
        ? [
            {
              value: signaalwaarde,
              width: 1,
              color: '#4f5458',
              dashStyle: 'Dash',
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
             * transparent line, and only use its label positioned at the
             * y-axis.
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

    tooltip: {
      shared: true,
      valueSuffix: 'R',
      backgroundColor: '#FFF',
      borderColor: '#01689B',
      borderRadius: 0,
      xDateFormat: '%d %b %y',
      formatter() {
        const rangePoint = rangeData.find((el) => el[0].getTime() === this.x);

        if (!rangePoint) return;

        const [, minRangePoint, maxRangePoint] = rangePoint;
        const linePoint = lineData.find(
          (el: any) => el[0].getTime() === this.x
        );
        const x = this.x;
        return `
            ${formatDate(x, 'medium')}<br/>
            <strong>${rangeLegendLabel}</strong> ${formatNumber(
          minRangePoint
        )} - ${formatNumber(maxRangePoint)}<br/>
            <strong>${lineLegendLabel}</strong> ${
          linePoint ? formatNumber(linePoint[1] as number) : '–'
        }
          `;
      },
    },

    series: [
      {
        name: rangeLegendLabel,
        data: rangeData,
        type: 'arearange',
        color: '#C4C4C4',
        marker: {
          enabled: false,
        },
      },
      {
        name: lineLegendLabel,
        data: lineData.map((el) => el[1] as number),
        type: 'line',
        color: '#3391CC',
        lineWidth: 2,
        marker: {
          enabled: false,
        },
      },
    ],
  };

  return options;
}

export default function AreaChart(props: AreaChartProps) {
  const {
    rangeLegendLabel,
    lineLegendLabel,
    data,
    signaalwaarde,
    timeframeOptions,
    title,
    description,
  } = props;

  const rangeData: TRange[] = useMemo(() => {
    return data
      .sort((a, b) => a.date - b.date)
      .map((d) => [new Date(d.date), d.min, d.max]);
  }, [data]);

  const lineData: TLine[] = useMemo(() => {
    return data.map((value) => {
      return [new Date(value.date), value.avg];
    });
  }, [data]);

  const [timeframe, setTimeframe] = useState<TimeframeOption>('5weeks');

  const chartOptions = useMemo(() => {
    const getOptionsThunk = (rangeData: TRange[], lineData: TLine[]) =>
      getChartOptions({
        rangeData,
        lineData,
        signaalwaarde,
        rangeLegendLabel,
        lineLegendLabel,
      });

    const filteredRange = getFilteredValues<TRange>(
      rangeData,
      timeframe,
      (value: TRange) => value[0].getTime()
    );

    const filteredLine = getFilteredValues<TLine>(
      lineData,
      timeframe,
      (value: TLine) => value[0].getTime()
    );

    return getOptionsThunk(filteredRange, filteredLine);
  }, [
    lineData,
    rangeData,
    signaalwaarde,
    lineLegendLabel,
    rangeLegendLabel,
    timeframe,
  ]);

  return (
    <section className={styles.root}>
      <header className={styles.header}>
        <div className={styles.titleAndDescription}>
          {title && <h3>{title}</h3>}
          {description && <p>{description}</p>}
        </div>
        <div className={styles.timeControls}>
          <ChartTimeControls
            timeframe={timeframe}
            timeframeOptions={timeframeOptions}
            onChange={(value) => setTimeframe(value)}
          />
        </div>
      </header>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </section>
  );
}

/**
 * From all the defined range values, extract the highest number so we know how to
 * scale the y-axis
 */
function calculateYMax(values: TRange[], paddedSignaalwaarde: number) {
  const flatValues = values
    /**
     * Better data type definitions will avoid having to deal with this stuff in
     * the future.
     */
    .filter(([_date, a, b]) => a !== null && b !== null)
    .flatMap(([_date, a, b]) => [a, b] as [number, number]);

  return Math.max(paddedSignaalwaarde, ...flatValues);
}
