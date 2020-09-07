import { useState } from 'react';

import { scaleQuantize } from '@vx/scale';
import { Mercator } from '@vx/geo';
import * as topojson from 'topojson-client';

import topology from './municipalities.topo.json';

export type GeoMercatorProps = {
  width: number;
  height: number;
  events?: boolean;
};

interface FeatureShape {
  type: 'Feature';
  id: string;
  geometry: { coordinates: [number, number][][]; type: 'Polygon' };
  properties: { name: string; gemcode: string; gemnaam: string };
}

// @ts-ignore
const world = topojson.feature(topology, topology.objects.municipalities) as {
  type: 'FeatureCollection';
  features: FeatureShape[];
};

const color = scaleQuantize({
  domain: [
    Math.min(...world.features.map((f) => f.geometry.coordinates.length)),
    Math.max(...world.features.map((f) => f.geometry.coordinates.length)),
  ],
  range: ['#9DDEFE', '#0290D6'],
});

export default function Choropleth({
  width,
  height,
  events = false,
}: GeoMercatorProps) {
  const [selected, setSelection] = useState(undefined);

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect x={0} y={0} width={width} height={height} fill={'white'} rx={14} />
      <Mercator<FeatureShape>
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
                strokeWidth={feature.properties.gemcode === selected ? 3 : 0.5}
                onClick={() => {
                  if (events) {
                    console.log(feature);
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
