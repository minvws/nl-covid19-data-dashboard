import React, { useMemo, useState } from 'react';
import Highcharts, { SeriesAreaOptions } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import {
  TimeframeOption,
  ChartTimeControls,
} from '~/components/chartTimeControls';
import { getFilteredValues } from '~/components/chartTimeControls/chartTimeControlUtils';

import styles from './lineChart.module.scss';
import { formatNumber } from '~/utils/formatNumber';
import { formatDate } from '~/utils/formatDate';
import { getItemFromArray } from '~/utils/getItemFromArray';

interface Value {
  date: number;
  value?: number;
  week: Week;
}

type Week = {
  start: number;
  end: number;
};

type LineChartProps = {
  values: Value[];
  title: string;
  description?: string;
  timeframeOptions?: TimeframeOption[];
};

function getOptions(values: Value[]): Highcharts.Options {
  const hasMultipleValues = values.length > 1;

  const series: SeriesAreaOptions[] = [
    {
      type: 'area',
      data: values.map((x) => [x.date, x.value]),
      name: '',
      showInLegend: false,
      color: '#3391CC',
      fillColor: 'rgba(51, 145, 204, 0.2)',
      allowPointSelect: false,
      marker: {
        symbol: 'circle',
        enabled: !hasMultipleValues,
      },
      events: {
        legendItemClick: () => false,
      },
      states: {
        inactive: {
          opacity: 1,
        },
      },
    },
  ];

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
      categories: values.map((value) => value?.date.toString()),
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
      formatter: function () {
        const { start, end } = getItemFromArray(
          values.map((x) => x.week),
          this.point.index
        );

        return `<strong>${formatDate(start, 'short')} - ${formatDate(
          end,
          'short'
        )}:</strong> ${formatNumber(this.y)}`;
      },
    },
    yAxis: {
      min: 0,
      minRange: 0.1,
      allowDecimals: false,
      lineColor: '#C4C4C4',
      gridLineColor: '#C4C4C4',
      title: {
        text: null,
      },
      labels: {
        formatter: function (): string {
          // @ts-ignore
          return formatNumber(this.value);
        },
      },
    },
    title: {
      text: undefined,
    },
    series,
  };

  return options;
}

export function LineChart({
  values,
  title,
  description,
  timeframeOptions,
}: LineChartProps) {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('5weeks');

  const chartOptions = useMemo(() => {
    const filteredValues = getFilteredValues<Value>(
      values,
      timeframe,
      (value: Value) => value.date * 1000
    );
    return getOptions(filteredValues);
  }, [values, timeframe]);

  return (
    <section className={styles.root}>
      <header className={styles.header}>
        <div className={styles.titleAndDescription}>
          {title && <h3>{title}</h3>}
          {description && <p>{description}</p>}
        </div>
        <div>
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
