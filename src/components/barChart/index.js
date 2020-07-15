import { useMemo } from 'react';
import HighCharts from 'highcharts';
import HighChartsReact from 'highcharts-react-official';

export default BarChart;

function BarChart(props) {
  const { data, keys } = props;

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
      tooltip: { enabled: false },
      credits: { enabled: false },
      xAxis: {
        categories: keys,
      },
      yAxis: {
        gridLineColor: '#c4c4c4',
        title: {
          text: 'Totaal aantal positief geteste mensen',
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
    [data, keys]
  );

  return <HighChartsReact highcharts={HighCharts} options={options} />;
}
