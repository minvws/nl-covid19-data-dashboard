import React, { useMemo, useState } from 'react';
import Highcharts, { SeriesLineOptions } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import ChartTimeControls from 'components/chartTimeControls';

import formatNumber from 'utils/formatNumber';
import formatDate from 'utils/formatDate';
import { Value } from 'types/data';

type MultiDateLineChartProps = {
  values: Value[];
  secondaryValues: Value[][];
  signaalwaarde?: number;
};

function getOptions(
  values: Value[],
  signaalwaarde?: number | undefined,
  secondaryValues?: Value[][] | undefined
): Highcharts.Options {
  const series: SeriesLineOptions[] = [
    {
      type: 'line',
      data: values.map((value) => [value.date, value.value]),
      name: 'average',
      showInLegend: false,
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

  if (secondaryValues) {
    secondaryValues.forEach((values) => {
      series.unshift({
        type: 'line',
        data: values.map((value) => [value.date, value.value]),
        name: 'secondary',
        showInLegend: false,
        color: '#666',
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
  }

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
      categories: values.map((value) => value?.date.toString()),
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
      accessibility: {
        rangeDescription: 'Range: 2010 to 2017',
      },
    },
    title: {
      text: undefined,
    },
    series,
  };

  if (signaalwaarde) {
    // @ts-ignore
    options.yAxis.plotLines = [
      {
        value: signaalwaarde,
        dashStyle: 'dash',
        width: 1,
        color: '#4f5458',
      },
    ];
  }
  return options;
}

// const filterSecondaryValues = (
//   secondaryValues: Value[][],
//   days: number
// ): Value[][] => {
//   const minimumDate = Math.floor(
//     new Date().getTime() / 1000 - days * 24 * 60 * 60
//   );
//   return secondaryValues.map((values: Value[]) => {
//     return values
//       .filter((value: Value) => {
//         return value.date >= minimumDate;
//       })
//       .map((value: Value): Value => ({ ...value }));
//   });
// };

const MultiDateLineChart: React.FC<MultiDateLineChartProps> = ({
  values,
  secondaryValues,
  signaalwaarde,
}) => {
  const [timeframe, setTimeframe] = useState('month');

  const chartOptions = useMemo(() => {
    const week = 7;
    const month = 30;
    const days = values.length;

    if (timeframe === 'all') {
      return getOptions(values, signaalwaarde);
    }
    if (timeframe === 'month') {
      // const filteredSecondaryValues = filterSecondaryValues(
      //   secondaryValues,
      //   month
      // );
      return getOptions(
        values.slice(days - month, days),
        signaalwaarde,
        secondaryValues
      );
    }
    if (timeframe === 'week') {
      // const filteredSecondaryValues = filterSecondaryValues(
      //   secondaryValues,
      //   week
      // );
      return getOptions(
        values.slice(days - week, days),
        signaalwaarde,
        secondaryValues
      );
    }
  }, [values, secondaryValues, timeframe, signaalwaarde]);

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

export default MultiDateLineChart;
