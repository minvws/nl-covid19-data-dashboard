import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, { useContext, useMemo, useState } from 'react';
import LocaleContext, { ILocale } from '~/locale/localeContext';
import { isFilled } from 'ts-is-present';
import { ChartTimeControls } from '~/components-styled/chart-time-controls';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import { Utils, formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { getFilteredValues, TimeframeOption } from '~/utils/timeframe';
import styles from './lineChart.module.scss';

export type Value = {
  date: number;
  value: number | null;
};

const SIGNAALWAARDE_Z_INDEX = 5;

export interface LineChartProps<T> {
  title: string;
  description?: string;
  values: T[];
  signaalwaarde?: number;
  timeframeOptions?: TimeframeOption[];
  formatTooltip?: (value: T) => string;
  formatYAxis?: (y: number) => string;
  showFill?: boolean;
  valueAnnotation?: string;
}

function getChartOptions<T extends Value>(
  utils: Utils,
  values: T[],
  signaalwaardeLabel: string,
  signaalwaarde?: number,
  formatTooltip?: (value: T) => string,
  formatYAxis?: (y: number) => string,
  showFill?: boolean
) {
  const yMax = calculateYMax(values, signaalwaarde);

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
      height: 250,
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
      categories: values.map((value) => value.date.toString()),
      labels: {
        align: 'right',
        /**
         * Types say `rotation` needs to be a number,
         * but that doesn’t work.
         */
        rotation: '0' as any,
        formatter: function () {
          return this.isFirst || this.isLast
            ? formatDateFromSeconds(utils, this.value, 'axis')
            : '';
        },
      },
    },
    tooltip: {
      backgroundColor: '#FFF',
      borderColor: '#01689B',
      borderRadius: 0,
      formatter: function (): string {
        if (formatTooltip) {
          return formatTooltip(values[this.point.index]);
        }
        return `${formatDateFromSeconds(utils, this.x)}: ${formatNumber(
          this.y
        )}`;
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
          if (formatYAxis) {
            return formatYAxis(this.value);
          }
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
                text: signaalwaardeLabel,
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
    series: [
      {
        type: 'area',
        data: values.map((value) => value.value as number),
        name: '',
        showInLegend: false,
        color: '#3391CC',
        /**
         * HEX to rgb converted, added opacity.
         * Since this chart has type 'area', a fillColor of `undefined` will return
         * a colored fill equal to che line color, when showFill is false, it returns a
         * transparent fill
         */

        fillColor: showFill ? 'rgba(51, 145, 204, 0.2)' : 'transparent',
        marker: {
          enabled: false,
        },
      },
    ],
    plotOptions: {
      area: {
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

export default function LineChart<T extends Value>({
  title,
  description,
  values,
  signaalwaarde,
  timeframeOptions,
  formatTooltip,
  formatYAxis,
  valueAnnotation,
  showFill = true,
}: LineChartProps<T>) {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('5weeks');
  const { siteText }: ILocale = useContext(LocaleContext);
  const signaalwaardeLabel = siteText.common.barScale.signaalwaarde;

  const chartOptions = useMemo(() => {
    const filteredValues = getFilteredValues<T>(
      values,
      timeframe,
      (value: T) => value.date * 1000
    );
    return getChartOptions<T>(
      siteText.utils,
      filteredValues,
      signaalwaardeLabel,
      signaalwaarde,
      formatTooltip,
      formatYAxis,
      showFill
    );
  }, [
    siteText.utils,
    values,
    timeframe,
    signaalwaarde,
    signaalwaardeLabel,
    formatTooltip,
    formatYAxis,
    showFill,
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
            onChange={setTimeframe}
            timeControls={siteText.charts.time_controls}
          />
        </div>
      </header>
      {valueAnnotation && (
        <ValueAnnotation mb={2}>{valueAnnotation}</ValueAnnotation>
      )}
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </section>
  );
}

/**
 * From all the defined values, extract the highest number so we know how to
 * scale the y-axis
 */
function calculateYMax(values: Value[], signaalwaarde = -Infinity) {
  const maxValue = values
    .map((x) => x.value)
    .filter(isFilled)
    .reduce((acc, value) => (value > acc ? value : acc), -Infinity);

  /**
   * Value cannot be 0, hence the 1
   * If the value is below signaalwaarde, make sure the signaalwaarde floats in the middle
   */
  return Math.max(maxValue, signaalwaarde * 2, 1);
}
