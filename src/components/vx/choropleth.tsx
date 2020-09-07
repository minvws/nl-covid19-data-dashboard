import { useState } from 'react';

import { scaleQuantize } from '@vx/scale';
import { Mercator } from '@vx/geo';
import * as topojson from 'topojson-client';

import topology from './municipalities.topo.json';
import { FeatureCollection, Feature, MultiPolygon } from 'geojson';

export type MunicipalGeoJOSN = FeatureCollection<
  MultiPolygon,
  MunicipalityProperties
>;

export interface MunicipalityProperties {
  gemnaam: string;
  gemcode: string;
}

export type GeoMercatorProps = {
  width: number;
  height: number;
  events?: boolean;
};

const world = topojson.feature(
  topology,
  topology.objects.municipalities
) as MunicipalGeoJOSN;

const color = scaleQuantize({
  domain: [
    Math.min(...world.features.map((f) => f.geometry.coordinates.length)),
    Math.max(...world.features.map((f) => f.geometry.coordinates.length)),
  ],
  range: ['#9DDEFE', '#0290D6'],
});

export default function Choropleth(props: GeoMercatorProps) {
  const { width, height, events = false } = props;

  const [selected, setSelection] = useState<string | undefined>(undefined);

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect x={0} y={0} width={width} height={height} fill={'white'} rx={14} />
      <Mercator<Feature<MultiPolygon, MunicipalityProperties>>
        data={world.features}
        fitSize={[[width, height], world]}
      >
        {(mercator) => (
          <g>
            {mercator.features.map(({ feature, path }, i) => (
              <path
                key={`map-feature-${i}`}
                d={path || ''}
                fill={color(0)}
                stroke={'black'}
                strokeWidth={feature.properties.gemcode === selected ? 2 : 0.5}
                onClick={() => {
                  if (events) {
                    setSelection(feature.properties.gemcode);
                  }
                }}
              />
            ))}
          </g>
        )}
      </Mercator>
    </svg>
  );
}
