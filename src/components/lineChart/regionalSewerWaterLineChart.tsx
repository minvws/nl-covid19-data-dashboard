import React, { useMemo } from 'react';
import Highcharts, { SeriesLineOptions } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { formatNumber } from '~/utils/formatNumber';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { getItemFromArray } from '~/utils/getItemFromArray';

type TranslationStrings = Record<string, string>;

interface Value {
  date: number;
  value?: number;
  week_start_unix: number;
  week_end_unix: number;
}

type Week = {
  start: number;
  end: number;
};

type RegionalSewerWaterLineChartProps = {
  averageValues: Value[];
  text: TranslationStrings;
};

function getOptions(
  averageValues: Value[],
  text: TranslationStrings
): Highcharts.Options {
  const hasMultipleValues = averageValues.length > 1;
  const weekSet: Week[] = averageValues.map((value) => ({
    start: value.week_start_unix,
    end: value.week_end_unix,
  }));

  const series: SeriesLineOptions[] = [
    {
      type: 'line',
      data: averageValues.map((x) => [x.date, x.value]),
      name: text.average_label_text,
      showInLegend: true,
      color: '#3391CC',
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
      height: 225,
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
      categories: averageValues.map((value) => value?.date.toString()),
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
    },
    tooltip: {
      backgroundColor: '#FFF',
      borderColor: '#01689B',
      borderRadius: 0,
      formatter: function (): false | string {
        if (this.series.name !== text.average_label_text) {
          return false;
        }
        const { start, end } = getItemFromArray(weekSet, this.point.index);
        return `<strong>${formatDateFromSeconds(
          start,
          'short'
        )} - ${formatDateFromSeconds(end, 'short')}:</strong> ${formatNumber(
          this.y
        )}`;
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

export function RegionalSewerWaterLineChart({
  averageValues,
  text,
}: RegionalSewerWaterLineChartProps) {
  const chartOptions = useMemo(() => {
    return getOptions(averageValues, text);
  }, [averageValues, text]);

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
}
