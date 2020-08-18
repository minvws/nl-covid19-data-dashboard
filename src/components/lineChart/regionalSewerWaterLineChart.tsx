import React, { useMemo, useState } from 'react';
import Highcharts, { SeriesLineOptions } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import ChartTimeControls from 'components/chartTimeControls';

import formatNumber from 'utils/formatNumber';
import formatDate from 'utils/formatDate';

interface Value {
  date: number;
  value: number | undefined | null;
}

type TranslationStrings = Record<string, string>;

type RegionalSewerWaterLineChartProps = {
  averageValues: Value[];
  allValues: Value[][];
  text: TranslationStrings;
};

function getOptions(
  averageValues: Value[],
  allValues: Value[][],
  text: TranslationStrings
): Highcharts.Options {
  const series: SeriesLineOptions[] = [
    {
      type: 'line',
      data: averageValues.map((value) => [value.date, value.value]),
      name: text.average_label_text,
      showInLegend: true,
      color: '#3391CC',
      marker: {
        enabled: false,
      },
      states: {
        inactive: {
          opacity: 1,
        },
      },
    },
  ];

  allValues.forEach((values, index) => {
    series.unshift({
      type: 'line',
      data: values.map((value) => [value.date, value.value]),
      name: text.secondary_label_text,
      showInLegend: index === 0,
      color: '#D2D2D2',
      marker: {
        enabled: false,
      },
      states: {
        hover: {
          enabled: false,
        },
        inactive: {
          opacity: 1,
        },
      },
    });
  });

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
        formatter: function (): string {
          if (this.isFirst || this.isLast) {
            return formatDate(this.value * 1000, 'axis');
          }
          return '';
        },
      },
    },
    tooltip: {
      backgroundColor: '#FFF',
      borderColor: '#01689B',
      borderRadius: 0,
      formatter: function (): false | string {
        if (this.series.name !== 'average') {
          return false;
        }
        return `${formatDate(this.x * 1000)}: ${formatNumber(this.y)}`;
      },
    },
    yAxis: {
      min: 0,
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

const filterSecondaryValues = (
  secondaryValues: Value[][],
  days: number
): Value[][] => {
  return secondaryValues.map((values: Value[]) => filterValues(values, days));
};

const filterValues = (values: Value[], days: number): Value[] => {
  const minimumDate = Math.floor(
    new Date().getTime() / 1000 - days * 24 * 60 * 60
  );
  return values
    .filter((value: Value) => value.date >= minimumDate)
    .map((value: Value): Value => ({ ...value }));
};

const RegionalSewerWaterLineChart: React.FC<RegionalSewerWaterLineChartProps> = ({
  averageValues,
  allValues,
  text,
}) => {
  const [timeframe, setTimeframe] = useState('month');

  const chartOptions = useMemo(() => {
    const week = 7;
    const month = 30;

    if (timeframe === 'all') {
      return getOptions(averageValues, allValues, text);
    }
    if (timeframe === 'month') {
      return getOptions(
        filterValues(averageValues, month),
        filterSecondaryValues(allValues, month),
        text
      );
    }
    if (timeframe === 'week') {
      return getOptions(
        filterValues(averageValues, week),
        filterSecondaryValues(allValues, week),
        text
      );
    }
  }, [averageValues, allValues, text, timeframe]);

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      <ChartTimeControls
        timeframe={timeframe}
        onChange={(evt) => setTimeframe(evt.target.value)}
      />
    </>
  );
};

export default RegionalSewerWaterLineChart;
