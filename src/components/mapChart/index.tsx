import Highcharts, {
  TooltipFormatterContextObject,
  SeriesOptionsType,
} from 'highcharts';
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

export interface MunicipalityProperties {
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
  metric: TMunicipalityMetricName;
  gradient?: [minColor: string, maxColor: string];
}

function MunicipalityMap(props: IProps) {
  const { selected, metric, gradient = ['#0000ff', '#ff0000'] } = props;

  const municipalCode = selected?.id;

  const { data: countryLines } = useSWR<any[]>(
    '/static-json/netherlands-outline.geojson'
  );

  const { data: municipalityLines } = useSWR<
    FeatureCollection<MultiPolygon, MunicipalityProperties>
  >('/static-json/municipalities-outline.geojson');

  const municipalityData = useMunicipalityData(metric, municipalCode);
  const [min, max] = useExtent(
    municipalityData,
    (item: MunicipalityData): number => item[metric]
  );

  const series = useMemo<SeriesOptionsType[]>(() => {
    const result: SeriesOptionsType[] = [
      {
        type: 'map',
        allAreas: false,
        mapData: municipalityLines,
        allowPointSelect: false,
        data: municipalityData,
        // @ts-ignore
        joinBy: ['gemcode', 'Municipality_code'],
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
  }, [countryLines, municipalCode, municipalityData, municipalityLines]);

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
      series: series,
    }),
    [min, max, metric, gradient, series]
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
