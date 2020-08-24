import Highcharts, { TooltipFormatterContextObject } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import useSWR from 'swr';
import { FeatureCollection, MultiPolygon } from 'geojson';
import { useMemo, useRef, useEffect } from 'react';
import useMunicipalityData, {
  TMunicipalityMetricName,
} from 'utils/useMunicipalityData';
import { MunicipalityData } from 'types/data';
import useExtent from 'utils/useExtent';

if (typeof Highcharts === 'object') {
  require('highcharts/modules/map')(Highcharts);
}

interface MunicipalityProperties {
  gemnaam: string;
  gemcode: string;
}

type TMunicipalityTooltipFormatterContextObject = TooltipFormatterContextObject & {
  point: TMunicipalityPoint;
};

type TMunicipalityPoint = Highcharts.Point &
  MunicipalityProperties &
  MunicipalityData;

interface IProps {
  selected?: { id: string };
  setSelection?: (item: { id: string }) => void;
  metric: TMunicipalityMetricName;
  gradient?: [minColor: string, maxColor: string];
}

function MunicipalityMap(props: IProps) {
  const {
    selected,
    setSelection,
    metric,
    gradient = ['#0000ff', '#ff0000'],
  } = props;
  const { data: countryLines } = useSWR<any[]>(
    '/static-json/netherlands-outline.geojson'
  );

  const { data: municipalityLines } = useSWR<
    FeatureCollection<MultiPolygon, MunicipalityProperties>
  >('/static-json/municipalities-outline.geojson');

  const municipalityData = useMunicipalityData(metric);
  const [min, max] = useExtent(
    municipalityData,
    (item: MunicipalityData): number => item[metric]
  );

  const mapOptions = useMemo<Highcharts.Options>(
    () => ({
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
        margin: [],
        panning: { enabled: false },
        height: '100%',
      },
      title: {
        text: '',
      },
      colorAxis: {
        min,
        max,
        minColor: gradient[0],
        maxColor: gradient[1],
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        backgroundColor: '#FFF',
        borderColor: '#01689B',
        borderRadius: 0,
        // @ts-ignore
        formatter: function (
          this: TMunicipalityTooltipFormatterContextObject
        ): false | string {
          const { point } = this;
          const { Province, Municipality_name } = point;

          if (!Municipality_name) {
            return false;
          }

          const metricValue = point[metric];

          return `${Municipality_name} (${Province})<br/>
                  ${metricValue}`;
        },
      },
      plotOptions: {
        panning: false,
        map: {
          states: {
            hover: {
              color: '#99C3D7',
            },
            select: {
              color: '#ffffff',
            },
          },
          borderWidth: 1,
          borderColor: '#012090',
        },
        mapline: {
          borderColor: 'black',
          borderWidth: 2,
        },
      },
      series: [
        {
          type: 'map',
          mapData: municipalityLines,
          allowPointSelect: setSelection !== undefined,
          point: {
            events: {
              // @ts-ignore
              click: function (this: TMunicipalityPoint) {
                if (setSelection) {
                  this.select(this.selected, false);
                  setSelection({ id: this.Municipality_code });
                }
              },
            },
          },
          data: municipalityData,
          // @ts-ignore
          joinBy: ['gemcode', 'Municipality_code'],
        },
        {
          type: 'mapline',
          data: countryLines,
        },
      ],
    }),
    [
      countryLines,
      municipalityLines,
      municipalityData,
      setSelection,
      min,
      max,
      metric,
    ]
  );

  const ref = useRef<any>();

  useEffect(() => {
    const chart: Highcharts.Chart | undefined = ref?.current?.chart;
    if (selected && chart) {
      const point = chart.series[0].points.find(
        (p: any) => p.gemcode === selected.id
      );

      point?.select(true, false);
    }
  }, [ref, selected]);

  return (
    <HighchartsReact
      {...({ ref } as any)}
      highcharts={Highcharts}
      containerProps={{ style: { height: '100%' } }}
      constructorType={'mapChart'}
      options={mapOptions}
    />
  );
}

export default MunicipalityMap;
