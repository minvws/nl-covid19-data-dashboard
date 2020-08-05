import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import formatNumber from 'utils/formatNumber';
import formatDate from 'utils/formatDate';

interface Value {
  date: number;
  value: number | undefined | null;
}

type LineChartProps = {
  values: Value[];
  signaalwaarde?: number;
};

const LineChart: React.FC<LineChartProps> = ({ values, signaalwaarde }) => {
  const options = {
    chart: {
      alignTicks: true,
      animation: true,
      backgroundColor: 'transparent',
      borderColor: '#000',
      borderRadius: 0,
      borderWidth: 0,
      className: 'undefined',
      colorCount: 10,
      defaultSeriesType: 'line',
      displayErrors: true,
      margin: [null],
      height: 175,
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
      categories: values.map((value) => value.date),
      labels: {
        align: 'right',
        rotation: '0',
        formatter: function (): void | string {
          // @ts-ignore
          if (this.isFirst || this.isLast) {
            // @ts-ignore
            return formatDate(this.value * 1000);
          }
        },
      },
    },
    tooltip: {
      backgroundColor: '#FFF',
      borderColor: '#01689B',
      borderRadius: 0,
      formatter: function (): string {
        // @ts-ignore
        return `${formatDate(this.x * 1000)}: ${formatNumber(this.y)}`;
      },
    },
    credits: false,
    yAxis: {
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
      plotLines: [],
    },
    title: {
      text: null,
    },
    series: [
      {
        data: values.map((value) => value.value),
        name: '',
        showInLegend: false,
        lineColor: '#3391CC',
        marker: {
          enabled: false,
        },
      },
    ],
  };

  if (signaalwaarde) {
    options.yAxis.plotLines.push({
      // @ts-ignore
      value: signaalwaarde,
      // @ts-ignore
      dashStyle: 'dash',
      // @ts-ignore
      width: 1,
      // @ts-ignore
      color: '#4f5458',
    });
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default LineChart;
