import Highcharts, { SeriesOptionsType } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import useSWR from 'swr';
import { FeatureCollection, MultiPolygon } from 'geojson';
import { useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';

import useExtent from 'utils/useExtent';
import useRegionData, { TRegionMetricName } from 'utils/useRegionData';
import regioData from 'data';

if (typeof Highcharts === 'object') {
  require('highcharts/modules/map')(Highcharts);
}

export interface MunicipalityProperties {
  gemnaam: string;
  gemcode: string;
}

interface IProps {
  selected?: { id: string };
  metric: TRegionMetricName;
  gradient?: [minColor: string, maxColor: string];
}

export default SafetyRegionMap;

function SafetyRegionMap(props: IProps) {
  const { selected, metric, gradient = ['#0000ff', '#ff0000'] } = props;

  const municipalCode = selected?.id;
  const router = useRouter();

  const { data: countryLines } = useSWR<any[]>(
    '/static-json/netherlands-outline.geojson'
  );

  const { data: municipalityLines } = useSWR<
    FeatureCollection<MultiPolygon, MunicipalityProperties>
  >('/static-json/safetyregions-outline.geojson');

  const regionData = useRegionData(metric);
  const [min, max] = useExtent(regionData, (item: any): number => item.value);

  const series = useMemo<SeriesOptionsType[]>(() => {
    const result: SeriesOptionsType[] = [
      {
        type: 'map',
        allAreas: false,
        mapData: municipalityLines,
        allowPointSelect: false,
        data: regionData,
        // @ts-ignore
        joinBy: ['vrcode', 'vrcode'],
        point: {
          events: {
            click: function (this: any) {
              const code = this?.point?.properties.vrcode;
              router.push(`/veiligheidsregio/${code}/positief-geteste-mensen`);
            },
          },
        },
      },
    ];

    // When there's no selected municipal code we render the outlines of the country:
    if (!municipalCode) {
      result.push({
        type: 'mapline',
        data: countryLines,
      });
    }

    return result;
  }, [countryLines, municipalCode, regionData, municipalityLines, router]);

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
        formatter: function (this: any): false | string {
          const { point } = this;

          const regionInfo = regioData.find(
            (rd) => rd.code === point.properties.vrcode
          );

          if (regionInfo) {
            const metricValue = point[metric];
            return `<strong>${regionInfo.name}</strong><br/>${metricValue}`;
          }
          return false;
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
      series,
    }),
    [min, max, metric, gradient, series]
  );

  const ref = useRef<any>();

  useEffect(() => {
    const chart: Highcharts.Chart | undefined = ref?.current?.chart;
    if (selected && chart) {
      const point = chart.series[0].points.find(
        (p: any) => p.vrcode === selected.id
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
