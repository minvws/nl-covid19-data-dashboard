import regioData from 'data';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import useSWR from 'swr';
import fetch from 'unfetch';

if (typeof Highcharts === 'object') {
  require('highcharts/modules/map')(Highcharts);
}

const fetcher = (url) => fetch(url).then((r) => r.json());

const MapChart = ({ selected, setSelection }) => {
  const { data } = useSWR('/json/veiligheidsregio.json', fetcher);

  if (!data) {
    return null;
  }

  const regioList = [
    ['1', 0],
    ['2', 0],
    ['3', 0],
    ['4', 0],
    ['5', 0],
    ['6', 0],
    ['7', 0],
    ['8', 0],
    ['9', 0],
    ['10', 0],
    ['11', 0],
    ['12', 0],
    ['13', 0],
    ['14', 0],
    ['15', 0],
    ['16', 0],
    ['17', 0],
    ['18', 0],
    ['19', 0],
    ['20', 0],
    ['21', 0],
    ['22', 0],
    ['23', 0],
    ['24', 0],
    ['25', 0],
  ];
  // Er is ongetwijfeld een veel beter manier om dit te doen :)
  if (selected) {
    regioList[selected.id] = { 'hc-key': selected.id, value: 1 };
  }

  const mapOptions = {
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
      panning: false,
      height: '100%',
    },
    title: {
      text: '',
    },
    colorAxis: {
      min: 0,
      stops: [
        [0, '#FFF'],
        [1, '#01689B'],
      ],
    },
    plotOptions: {
      panning: false,
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      backgroundColor: '#FFF',
      borderColor: '#01689B',
      borderRadius: 0,
      pointFormatter: function () {
        return this.properties['Vgrnr'];
      },
      formatter: function () {
        return this.point.properties.Veiligheid;
      },
    },
    series: [
      {
        // Make sure your data has hc-key properties defined! You need to do this manually (for now)
        mapData: data,
        point: {
          events: {
            click: function () {
              const item = regioData.find(
                (x) => x.id === this.properties.Vgrnr
              );

              setSelection(item);
            },
          },
        },
        states: {
          hover: {
            color: '#99C3D7',
          },
          select: {
            color: '#01689B',
          },
        },
        // This is your regional data. Map the ID of the region to the value you want to show
        data: regioList,
      },
    ],
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      containerProps={{ style: { height: '100%' } }}
      constructorType={'mapChart'}
      options={mapOptions}
    />
  );
};

export default MapChart;
