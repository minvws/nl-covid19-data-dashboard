import { useMemo } from 'react';
import HighCharts from 'highcharts';
import HighChartsReact from 'highcharts-react-official';

interface IProps {
  data: Array<number | null | { y: number; color: string }>;
  keys: string[];
  axisTitle: string;
}

const BarChart: React.FC<IProps> = (props) => {
  const { data, keys, axisTitle } = props;

  const total = data.reduce((mem: number, part): number => {
    if (typeof part !== 'number') {
      return mem;
    }
    return mem + ((part as number) || 0);
  }, 0);

  const options = useMemo(
    () => ({
      chart: {
        type: 'bar',
        backgroundColor: 'transparent',
        borderColor: '#000',
        borderRadius: 0,
        borderWidth: 0,
        className: 'undefined',
        colorCount: 10,
        displayErrors: true,
        margin: [null],
        height: '80%',
      },
      title: { text: null },
      tooltip: {
        enabled: true,
        formatter: function (): string | false {
          if (!total) {
            return false;
          }
          // @ts-ignore
          return `${((this.y * 100) / total).toFixed(0)}%`;
        },
      },
      credits: { enabled: false },
      xAxis: {
        categories: keys,
      },
      yAxis: {
        gridLineColor: '#c4c4c4',
        title: {
          text: axisTitle,
        },
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          groupPadding: 0,
          color: '#3391CC',
        },
      },
      series: [
        {
          data,
        },
      ],
    }),
    [data, keys, total]
  );

  return <HighChartsReact highcharts={HighCharts} options={options} />;
};

export default BarChart;
