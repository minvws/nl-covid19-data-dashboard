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

type TMunicipalityPoint = MunicipalityProperties & MunicipalityData;

interface IProps {
  selected?: { id: string };
  setSelection: (item: { id: string }) => void;
  metric: TMunicipalityMetricName;
}

const MunicipalityMap: React.FC<IProps> = ({
  selected,
  setSelection,
  metric,
}) => {
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
        minColor: '#0000ff',
        maxColor: '#ff0000',
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        backgroundColor: '#FFF',
        borderColor: '#01689B',
        borderRadius: 0,
        formatter: function (
          this: TooltipFormatterContextObject
        ): false | string {
          const { point }: { point: MunicipalityData } = this as any;
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
        },
      },
      series: [
        {
          type: 'map',
          mapData: municipalityLines,
          allowPointSelect: true,
          point: {
            events: {
              click: function (this: any) {
                this.select(this.selected, false);
                setSelection({ id: this.Municipality_code });
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
};

export default MunicipalityMap;
