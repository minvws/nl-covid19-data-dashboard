import Projection from '@visx/geo/lib/projections/Projection';
import { ProjectionPreset } from '@visx/geo/lib/types';
import { GeoProjection } from 'd3-geo';
import { Feature, MultiPolygon, Polygon } from 'geojson';
import { CodedGeoProperties, FitExtent } from '~/components/choropleth/logic';
import { featureHasPath, truncatePathCoordinates } from '../logic/utils';
import { Path } from './path';

export type MercatorGroupProps = {
  projection?: ProjectionPreset | (() => GeoProjection);
  data: Feature<MultiPolygon | Polygon, CodedGeoProperties>[];
  fitExtent: FitExtent;
  fillMethod: (code: string) => string;
  strokeMethod: (code: string) => string;
  strokeWidthMethod: (code: string) => number;
};

export function MercatorGroup(props: MercatorGroupProps) {
  const {
    projection = 'mercator',
    data,
    fitExtent,
    fillMethod,
    strokeMethod,
    strokeWidthMethod,
  } = props;

  return (
    <Projection projection={projection} data={data} fitExtent={fitExtent}>
      {({ features }) => (
        <g>
          {features
            .filter(featureHasPath)
            .map(truncatePathCoordinates)
            .map(({ feature, path, index }) => {
              return (
                <Path
                  key={`${feature.properties.code}_${index}`}
                  pathData={path}
                  fill={fillMethod(feature.properties.code)}
                  stroke={strokeMethod(feature.properties.code)}
                  strokeWidth={strokeWidthMethod(feature.properties.code)}
                />
              );
            })}
        </g>
      )}
    </Projection>
  );
}
