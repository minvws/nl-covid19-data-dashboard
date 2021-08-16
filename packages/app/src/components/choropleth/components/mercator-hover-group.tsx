import Projection from '@visx/geo/lib/projections/Projection';
import { ProjectionPreset } from '@visx/geo/lib/types';
import { GeoProjection } from 'd3-geo';
import { Feature, MultiPolygon, Polygon } from 'geojson';
import { FocusEvent } from 'react';
import { CodedGeoProperties, FitExtent } from '../logic';
import { featureHasPath, truncatePathCoordinates } from '../logic/utils';
import { HoverPathLink } from './path';

type MercatorHoverGroupProps = {
  projection?: ProjectionPreset | (() => GeoProjection);
  data: Feature<MultiPolygon | Polygon, CodedGeoProperties>[];
  fitExtent: FitExtent;
  fillMethod: (code: string, isActivated?: boolean) => string;
  strokeMethod: (code: string, isActivated?: boolean) => string;
  strokeWidthMethod: (code: string, isActivated?: boolean) => number;
  getHref?: (code: string) => string;
  getTitle: (code: string) => string;
  onFocus: (evt: FocusEvent<HTMLAnchorElement>) => void;
  onBlur: (evt: FocusEvent<HTMLAnchorElement>) => void;
  isTabInteractive: boolean;
};

export function MercatorHoverGroup(props: MercatorHoverGroupProps) {
  const {
    projection = 'mercator',
    data,
    fitExtent,
    fillMethod,
    strokeMethod,
    strokeWidthMethod,
    onFocus,
    onBlur,
    isTabInteractive,
    getHref,
    getTitle,
  } = props;

  return (
    <Projection projection={projection} data={data} fitExtent={fitExtent}>
      {({ features }) => (
        <g>
          {features
            .filter(featureHasPath)
            .map(truncatePathCoordinates)
            .map(({ feature, path, index }) => {
              const { code } = feature.properties;
              return (
                <HoverPathLink
                  id={code}
                  key={`${code}_${index}`}
                  pathData={path}
                  fill={fillMethod}
                  stroke={strokeMethod}
                  strokeWidth={strokeWidthMethod}
                  isTabInteractive={isTabInteractive}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  title={getTitle(code)}
                  href={getHref ? getHref(code) : undefined}
                />
              );
            })}
        </g>
      )}
    </Projection>
  );
}
