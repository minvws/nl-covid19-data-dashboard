import React, { useMemo, useState } from 'react';
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

function getOptions(
  values: Value[],
  signaalwaarde?: number | undefined
): Highcharts.Options {
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
        formatter: function (): string {
          if (this.isFirst || this.isLast) {
            return formatDate(this.value * 1000);
          }
          return '';
        },
      },
    },
    tooltip: {
      backgroundColor: '#FFF',
      borderColor: '#01689B',
      borderRadius: 0,
      formatter: function (): string {
        return `${formatDate(this.x * 1000)}: ${formatNumber(this.y)}`;
      },
    },
    yAxis: {
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
    series: [
      {
        type: 'line',
        data: values.map((value) => value.value as number),
        name: '',
        showInLegend: false,
        color: '#3391CC',
        marker: {
          enabled: false,
        },
      },
    ],
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

const LineChart: React.FC<LineChartProps> = ({ values, signaalwaarde }) => {
  const [timeframe, setTimeframe] = useState<'all' | 'month' | 'week'>('month');

  const id = useMemo(() => {
    return Math.random().toString(36).substr(2);
  }, []);

  const chartOptions = useMemo(() => {
    const week = 8;
    const month = 31;
    const days = values.length;

    if (timeframe === 'all') {
      return getOptions(values, signaalwaarde);
    }
    if (timeframe === 'month') {
      return getOptions(values.slice(days - month, days), signaalwaarde);
    }
    if (timeframe === 'week') {
      return getOptions(values.slice(days - week, days), signaalwaarde);
    }
  }, [values, timeframe, signaalwaarde]);

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      <div
        className="chart-button-group"
        onChange={(evt: any) => setTimeframe(evt.target.value)}
      >
        <input
          id={`all-${id}`}
          type="radio"
          name={`timeframe-${id}`}
          value="all"
          checked={timeframe === 'all'}
        />
        <label htmlFor={`all-${id}`}>Toon alles</label>

        <input
          id={`month-${id}`}
          type="radio"
          name={`timeframe-${id}`}
          value="month"
          checked={timeframe === 'month'}
        />
        <label htmlFor={`month-${id}`}>Laatste maand</label>

        <input
          id={`week-${id}`}
          type="radio"
          name={`timeframe-${id}`}
          value="week"
          checked={timeframe === 'week'}
        />
        <label htmlFor={`week-${id}`}>Laatste week</label>
      </div>
    </>
  );
};

export default LineChart;
