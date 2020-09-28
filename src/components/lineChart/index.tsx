import React, { useMemo, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import styles from './lineChart.module.scss';
import text from '~/locale/index';

import {
  ChartTimeControls,
  TimeframeOption,
} from '~/components/chartTimeControls';

import { formatNumber } from '~/utils/formatNumber';
import { formatDate } from '~/utils/formatDate';
import { getFilteredValues } from '~/components/chartTimeControls/chartTimeControlUtils';
import { isDefined } from 'ts-is-present';

type Value = {
  date: number;
  value?: number;
};

interface LineChartProps {
  title?: string;
  description?: string;
  values: Value[];
  signaalwaarde?: number;
  timeframeOptions?: TimeframeOption[];
}

function getChartOptions(values: Value[], signaalwaarde?: number) {
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
      height: 175,
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      lineColor: '#C4C4C4',
      gridLineColor: '#ca005d',
      type: 'datetime',
      accessibility: {
        rangeDescription: 'Verloop van tijd',
      },
      title: {
        text: null,
      },
      categories: values.map((value) => value.date.toString()),
      labels: {
        align: 'right',
        // types say `rotation` needs to be a number,
        // but that doesn’t work.
        rotation: '0' as any,
        formatter: function () {
          return this.isFirst || this.isLast
            ? formatDate(this.value, 'axis')
            : '';
        },
      },
    },
    tooltip: {
      backgroundColor: '#FFF',
      borderColor: '#01689B',
      borderRadius: 0,
      formatter: function (): string {
        return `${formatDate(this.x)}: ${formatNumber(this.y)}`;
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
      accessibility: {
        rangeDescription: 'Range: 2010 to 2017',
      },
      plotLines: signaalwaarde
        ? [
            {
              value: signaalwaarde,
              dashStyle: 'Dash',
              width: 1,
              color: '#4f5458',
              zIndex: 1,
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
        // hex to rgb converted, added opacity
        fillColor: 'rgba(51, 145, 204, 0.2)',
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

export default function LineChart({
  title,
  description,
  values,
  signaalwaarde,
  timeframeOptions,
}: LineChartProps) {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('5weeks');

  const chartOptions = useMemo(() => {
    const filteredValues = getFilteredValues<Value>(
      values,
      timeframe,
      (value: Value) => value.date * 1000
    );
    return getChartOptions(filteredValues, signaalwaarde);
  }, [values, timeframe, signaalwaarde]);

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
          />
        </div>
      </header>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </section>
  );
}

function calculateYMax(values: Value[], signaalwaarde = -Infinity) {
  /**
   * From all the defined values, extract the highest number so we know how to
   * scale the y-axis
   */
  const maxValue = values
    .map((x) => x.value)
    .filter(isDefined)
    .reduce((acc, value) => (value > acc ? value : acc), -Infinity);

  return Math.max(maxValue, signaalwaarde + 10);
}
