import React, { useMemo } from 'react';
import Highcharts, { SeriesLineOptions } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

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
      allowPointSelect: false,
      marker: {
        symbol: 'circle',
        enabled: false,
      },
      events: {
        legendItemClick: function () {
          return false;
        },
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
      allowPointSelect: false,
      marker: {
        enabled: false,
      },
      events: {
        legendItemClick: () => false,
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

const RegionalSewerWaterLineChart: React.FC<RegionalSewerWaterLineChartProps> = ({
  averageValues,
  allValues,
  text,
}) => {
  const chartOptions = useMemo(() => {
    return getOptions(averageValues, allValues, text);
  }, [averageValues, allValues, text]);

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default RegionalSewerWaterLineChart;
