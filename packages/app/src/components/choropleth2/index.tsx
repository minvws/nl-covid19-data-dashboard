import { KeysOfType, TimestampedValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import Projection from '@visx/geo/lib/projections/Projection';
import { ProjectionPreset } from '@visx/geo/lib/types';
import { GeoProjection } from 'd3-geo';
import { Feature, MultiPolygon, Polygon } from 'geojson';
import { ReactNode } from 'react';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { useUniqueId } from '~/utils/use-unique-id';
import { Path, PathProps } from './components/path';
import { BasicGeoProperties, useChoroplethFeatures } from './logic';
import { ChoroplethTooltipPlacement } from './tooltips';

/**
 * Sets the projection’s scale and translate to fit the specified GeoJSON object in the center of the given extent.
 * The extent is specified as an array [[x₀, y₀], [x₁, y₁]], where x₀ is the left side of the bounding box,
 * y₀ is the top, x₁ is the right and y₁ is the bottom.
 *
 * (Description taken from ProjectionProps.fitExtent in @visx/Projection.d.ts)
 */
type FitExtent = [[[number, number], [number, number]], any];

export enum CHOROPLETH_ASPECT_RATIO {
  nl = 1 / 1.2,
  in = 1 / 0.775,
}

export type MapType = 'gm' | 'vr' | 'in';

export type CodeType = 'gmcode' | 'vrcode' | 'country_code';

type DataOptions = {
  getLink: (code: string) => string;
  highlightSelection?: boolean;
  selectedCode?: string;
};

type DataConfig<T extends TimestampedValue> = {
  metricProperty: KeysOfType<T, number, true>;
  noDataFillColor: string;
};

type ChoroplethProps<T extends TimestampedValue> = {
  data: T[];
  dataConfig: DataConfig<T>;
  dataOptions: DataOptions;
  map: MapType;
  tooltipContent: (context: T) => ReactNode;
  tooltipPlacement?: ChoroplethTooltipPlacement;
  minHeight?: number;
};

export function Choropleth<T extends TimestampedValue>(
  props: ChoroplethProps<T>
) {
  const {
    data,
    dataConfig,
    dataOptions,
    map,
    minHeight = 500,
    tooltipContent,
    tooltipPlacement,
  } = props;

  const aspectRatio =
    map === 'in' ? CHOROPLETH_ASPECT_RATIO.in : CHOROPLETH_ASPECT_RATIO.nl;
  const mapProjection = map === 'in' ? 'mercator' : 'mercator';

  const clipPathId = useUniqueId();
  const [
    containerRef,
    { width = minHeight * (1 / aspectRatio), height = minHeight },
  ] = useResizeObserver<HTMLDivElement>();
  const choroplethFeatures = useChoroplethFeatures(map);

  const fitExtent: FitExtent = [
    [
      [0, 0],
      [width, height],
    ],
    null,
  ];

  return (
    <div
      ref={containerRef}
      style={{
        minHeight,
        maxHeight: '75vh',
        maxWidth: '100%',
      }}
    >
      <svg
        role="img"
        width={width}
        viewBox={`0 0 ${width} ${height}`}
        css={css({ display: 'block', bg: 'transparent', width: '100%' })}
      >
        <clipPath id={clipPathId}>
          <rect x={0} y={0} height={height} width={width} />
        </clipPath>
        <rect x={0} y={0} width={width} height={height} fill={'none'} rx={14} />
        <g transform={`translate(0,0)`} clipPath={`url(#${clipPathId})`}>
          <MercatorGroup
            projection={mapProjection}
            data={choroplethFeatures.area.features}
            fillMethod={getAreaFill}
            fitExtent={fitExtent}
            PathComponent={Path}
          />
        </g>
      </svg>
    </div>
  );
}

interface MercatorGroupProps {
  projection?: ProjectionPreset | (() => GeoProjection);
  data: Feature<MultiPolygon | Polygon, BasicGeoProperties>[];
  fitExtent: FitExtent;
  fillMethod: (code: string) => string;
  strokeMethod: (code: string) => string;
  strokeWidthMethod: (code: string) => number;
  PathComponent: React.FunctionComponent<PathProps>;
}

function MercatorGroup(props: MercatorGroupProps) {
  const {
    projection = 'mercator',
    data,
    fitExtent,
    fillMethod,
    strokeMethod,
    strokeWidthMethod,
    PathComponent,
  } = props;

  return (
    <Projection projection={projection} data={data} fitExtent={fitExtent}>
      {({ features }) => (
        <g>
          {features.map(
            ({ feature, path, index }) =>
              path && (
                <PathComponent
                  key={index}
                  pathData={path}
                  fill={fillMethod(feature.properties.code)}
                  stroke={strokeMethod(feature.properties.code)}
                  strokeWidth={strokeWidthMethod(feature.properties.code)}
                />
              )
          )}
        </g>
      )}
    </Projection>
  );
}
