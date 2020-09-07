import Highcharts, {
  SeriesOptionsType,
  TooltipFormatterContextObject,
} from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import useSWR from 'swr';
import { FeatureCollection, MultiPolygon } from 'geojson';
import { useMemo, useRef, useEffect } from 'react';
import useMunicipalityData, {
  TMunicipalityMetricName,
} from 'utils/useMunicipalityData';
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

export type TMunicipalityPoint = Highcharts.Point & MunicipalityProperties;

interface IProps {
  selected?: string;
  municipalCodes?: string[];
  metric?: TMunicipalityMetricName;
  gradient?: [minColor: string, maxColor: string];
  onSelect?: (context: TMunicipalityPoint) => void;
}

export type MunicipalGeoJOSN = FeatureCollection<
  MultiPolygon,
  MunicipalityProperties
>;

export default MunicipalityMap;

/**
 * This map shows a map of the Netherlands with features that represent all the municipalities.
 * The geojson data is joined with the municipal data on the gemcode => gmcode keys. The municipal data is used
 * to fill the chloropleth colors and generate the tooltips.
 * When the selected prop is set only the municipalities with the corresponding codes are shown.
 *
 * @param props
 *
 * @component
 */
function MunicipalityMap(props: IProps) {
  const {
    onSelect,
    selected,
    municipalCodes,
    metric,
    gradient = ['#0000ff', '#ff0000'],
  } = props;

  const { data: countryLines } = useSWR<any[]>(
    '/static-json/netherlands-outline.geojson'
  );

  const { data: municipalityLines } = useSWR<MunicipalGeoJOSN>(
    '/static-json/municipalities-outline.geojson'
  );

  let municipalityData = useMunicipalityData(metric, municipalCodes);
  const [min, max] = useExtent(
    municipalityData,
    (item: any): number => item.value
  );
  if (!municipalityData.length) {
    municipalityData = municipalityLines?.features.map((feat) => ({
      gmcode: feat.properties.gemcode,
    })) as any;
  }

  const series = useMemo<SeriesOptionsType[]>(() => {
    const result: SeriesOptionsType[] = [
      {
        type: 'map',
        allAreas: false,
        mapData: municipalityLines,
        allowPointSelect: true,
        data: municipalityData,
        // @ts-ignore
        joinBy: ['gemcode', 'gmcode'],
        point: {
          events: {
            click: function (this: any) {
              if (onSelect) {
                onSelect(this as TMunicipalityPoint);
              }
            },
          },
        },
      },
    ];

    // When there's no selected municipal code we render the outlines of the country:
    if (!municipalCodes?.length) {
      result.push({
        type: 'mapline',
        data: countryLines,
      });
    }

    return result;
  }, [countryLines, municipalityData, municipalityLines, municipalCodes]);

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

          if (point.properties?.gemnaam && metric) {
            const metricValue = point[metric];
            return `<strong>${point.properties.gemnaam}</strong><br/>${metricValue}`;
          } else if (point.properties?.gemnaam) {
            return `<strong>${point.properties.gemnaam}</strong>`;
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
      series: series,
    }),
    [min, max, metric, gradient, series]
  );

  const ref = useRef<any>();

  useEffect(() => {
    const chart: Highcharts.Chart | undefined = ref?.current?.chart;
    if (selected && chart) {
      const point = chart.series[0].points.find(
        (p: any) => p.gemcode === selected
      );

      point?.select(true, false);
    }
  }, [ref, selected]);

  return (
    <HighchartsReact
      immutable={true}
      allowChartUpdate={true}
      {...({ ref } as any)}
      highcharts={Highcharts}
      containerProps={{ style: { height: '100%' } }}
      constructorType={'mapChart'}
      options={mapOptions}
    />
  );
}
