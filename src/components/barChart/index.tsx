import { useMemo } from 'react';
import HighCharts, { XrangePointOptionsObject } from 'highcharts';
import HighChartsReact from 'highcharts-react-official';

interface IProps {
  data: XrangePointOptionsObject[];
  keys: string[];
  axisTitle: string;
}

export default function BarChart(props: IProps) {
  const { data, keys, axisTitle } = props;

  const options = useMemo<HighCharts.Options>(() => {
    const max = data.reduce((acc, value) => Math.max(acc, value.y || 0), 1);
    return {
      chart: {
        type: 'bar',
        backgroundColor: 'transparent',
        borderColor: '#000',
        borderRadius: 0,
        borderWidth: 0,
        className: 'undefined',
        colorCount: 10,
        displayErrors: true,
        margin: [],
        height: data.length * 35 + 50,
      },
      title: { text: '' },
      tooltip: {
        enabled: true,
        formatter: function (): string | false {
          // @ts-ignore
          if (this.point.label) {
            // @ts-ignore
            return this.point.label;
          }
          return false;
        },
      },
      credits: { enabled: false },
      xAxis: {
        categories: keys,
      },
      yAxis: {
        min: 0,
        max,
        allowDecimals: false,
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
          minPointLength: 5,
          groupPadding: 0,
          color: '#3391CC',
        },
      },
      series: [
        {
          data,
          type: 'bar',
        },
      ],
    };
  }, [data, keys, axisTitle]);

  return <HighChartsReact highcharts={HighCharts} options={options} />;
}
