import Highcharts, { SeriesOptionsType } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import useSWR from 'swr';
import { FeatureCollection, MultiPolygon } from 'geojson';
import { useMemo, useRef, useEffect } from 'react';
import { MunicipalityMapping } from 'pages/regio';

import styles from './municipality.module.scss';

if (typeof Highcharts === 'object') {
  require('highcharts/modules/map')(Highcharts);
}

export interface MunicipalityProperties {
  gemnaam: string;
  gemcode: string;
}

type SelectRegion = (newSelected: string) => void;

interface IProps {
  selected?: MunicipalityMapping;
  onSelect?: SelectRegion;
}

function MunicipalityMap(props: IProps): any {
  const { selected, onSelect } = props;

  const { data: municipalityLines } = useSWR<
    FeatureCollection<MultiPolygon, MunicipalityProperties>
  >('/static-json/municipalities-outline.geojson');

  const mapOptions = useMemo<Highcharts.Options | undefined>(() => {
    if (!municipalityLines) {
      return undefined;
    }

    const data = municipalityLines?.features.map((feature) => {
      return {
        Municipality_name: feature.properties.gemnaam,
        Municipality_code: feature.properties.gemcode,
        value: 0,
      };
    });

    const series: SeriesOptionsType[] = [
      {
        type: 'map',
        allAreas: true,
        mapData: municipalityLines,
        borderColor: '#01689b',
        borderWidth: 0.35,
        allowPointSelect: true,
        // @ts-ignore
        data,
        // @ts-ignore
        joinBy: ['gemcode', 'Municipality_code'],
        cursor: 'pointer',
        point: {
          events: {
            click: function () {
              // @ts-ignore

              onSelect(this.gemcode);
            },
          },
        },
      },
    ];

    return {
      credits: {
        enabled: false,
      },
      chart: {
        alignTicks: true,
        animation: false,
        backgroundColor: 'transparent',
        borderColor: '#01689b',
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
        min: 0,
        max: 100,
        minColor: '#fff',
        maxColor: '#fff',
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
          const { Municipality_name } = point;

          if (!Municipality_name) {
            return false;
          }

          return `${Municipality_name}`;
        },
      },
      plotOptions: {
        panning: false,
        map: {
          states: {
            hover: {
              color: 'rgba(1, 104, 155, 0.5)',
            },
            select: {
              color: '#01689b',
            },
          },
          borderWidth: 0.5,
          borderColor: '#012090',
        },
        mapline: {
          borderColor: '#01689b',
          borderWidth: 0.5,
        },
      },
      series,
    };
  }, [municipalityLines, onSelect]);

  const ref = useRef<any>();

  useEffect(() => {
    const chart: Highcharts.Chart | undefined = ref?.current?.chart;
    if (selected && chart) {
      const point = chart.series[0].points.find(
        (p: any) => p.gemcode === selected.gemcode
      );

      point?.select(true, false);
    } else {
      chart?.getSelectedPoints().forEach((point) => {
        point.select(false, false);
      });
    }
  }, [ref, selected, mapOptions]);

  return mapOptions ? (
    <div className={styles.container}>
      <div className={styles['chart-wrapper']}>
        <HighchartsReact
          {...({ ref } as any)}
          highcharts={Highcharts}
          containerProps={{ style: { width: '631px', height: '100%' } }}
          constructorType={'mapChart'}
          options={mapOptions}
        />
      </div>
    </div>
  ) : null;
}

export default MunicipalityMap;
