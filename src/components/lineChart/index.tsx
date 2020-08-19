import React, { useMemo, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import ChartTimeControls, {
  TimeframeOption,
} from 'components/chartTimeControls';

import formatNumber from 'utils/formatNumber';
import formatDate from 'utils/formatDate';
import { getFilteredValues } from 'components/chartTimeControls/chartTimeControlUtils';

interface Value {
  date: number;
  value: number | undefined | null;
}

type LineChartProps = {
  values: Value[];
  signaalwaarde?: number;
  timeframeOptions?: TimeframeOption[];
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
      formatter: function (): string {
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

const LineChart: React.FC<LineChartProps> = ({
  values,
  signaalwaarde,
  timeframeOptions,
}) => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('5weeks');

  const chartOptions = useMemo(() => {
    const filteredValues = getFilteredValues<Value>(
      values,
      timeframe,
      (value: Value) => value.date * 1000
    );
    return getOptions(filteredValues, signaalwaarde);
  }, [values, timeframe, signaalwaarde]);

  if (!timeframeOptions) {
    timeframeOptions = ['all', '5weeks', 'week'];
  }

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      <ChartTimeControls
        timeframe={timeframe}
        timeframeOptions={timeframeOptions}
        onChange={(evt) => setTimeframe(evt.target.value as TimeframeOption)}
      />
    </>
  );
};

export default LineChart;
