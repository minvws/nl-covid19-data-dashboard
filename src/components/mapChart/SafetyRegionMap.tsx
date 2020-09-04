import Highcharts, { SeriesOptionsType } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import useSWR from 'swr';
import { FeatureCollection, MultiPolygon } from 'geojson';
import { useMemo, useRef, useEffect } from 'react';
import useExtent from 'utils/useExtent';
import useRegionData, { TRegionMetricName } from 'utils/useRegionData';
import regioData from 'data';
import filterFeatures from './filterFeatures';

if (typeof Highcharts === 'object') {
  require('highcharts/modules/map')(Highcharts);
}

export interface SafetyRegionProperties {
  vrcode: string;
}

export type SafetyRegionGeoJSON = FeatureCollection<
  MultiPolygon,
  SafetyRegionProperties
>;

interface IProps {
  selected?: { id: string };
  metric: TRegionMetricName;
  gradient?: [minColor: string, maxColor: string];
}

export default SafetyRegionMap;

/**
 * This map shows a map of the Netherlands with features that represent all the safety regions.
 * The geojson data is joined with the region data on the vrcode key. The region data is used
 * to fill the chloropleth colors and generate the tooltips.
 *
 * @param props
 *
 * @component
 */
function SafetyRegionMap(props: IProps) {
  const { selected, metric, gradient = ['#0000ff', '#ff0000'] } = props;

  const regionCode = selected?.id;

  const { data: countryLines } = useSWR<any[]>(
    '/static-json/netherlands-outline.geojson'
  );

  let { data: municipalityLines } = useSWR<SafetyRegionGeoJSON>(
    '/static-json/safetyregions-outline.geojson'
  );

  if (regionCode && municipalityLines) {
    municipalityLines = filterFeatures<SafetyRegionProperties>(
      municipalityLines,
      'vrcode',
      regionCode
    );
  }

  const regionData = useRegionData(metric, regionCode);
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
      },
    ];

    // When there's no selected region code we render the outlines of the country:
    if (!regionCode) {
      result.push({
        type: 'mapline',
        data: countryLines,
      });
    }

    return result;
  }, [countryLines, regionCode, regionData, municipalityLines]);

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
      series: series,
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
