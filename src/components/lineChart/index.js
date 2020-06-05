import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import months from 'data/months.js';
import formatNumber from 'utils/formatNumber';

const LineChart = ({ data }) => {
  const formatDate = (value) => {
    let dateObj = new Date(parseInt(value * 1000));
    dateObj.toLocaleString();
    return `${dateObj.getDate()} ${months[dateObj.getMonth()]}`;
  };

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
      categories: Object.keys(data),
      labels: {
        align: 'right',
        rotation: '0',
        formatter: function () {
          if (this.isFirst || this.isLast) {
            let valueDate = new Date(parseInt(this.value * 1000));
            valueDate.toLocaleString();
            return `${valueDate.getDate()} ${months[valueDate.getMonth()]}`;
          }
        },
      },
    },
    tooltip: {
      backgroundColor: '#FFF',
      borderColor: '#01689B',
      borderRadius: 0,
      formatter: function () {
        return `${formatDate(this.x)}: ${formatNumber(this.y)}`;
      },
    },
    credits: false,
    yAxis: {
      lineColor: '#C4C4C4',
      gridLineColor: '#C4C4C4',
      title: {
        text: null,
      },
      accessibility: {
        rangeDescription: 'Range: 2010 to 2017',
      },
    },
    title: {
      text: null,
    },
    series: [
      {
        data: Object.values(data),
        name: '',
        showInLegend: false,
        lineColor: '#3391CC',
        marker: {
          enabled: false,
        },
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default LineChart;
