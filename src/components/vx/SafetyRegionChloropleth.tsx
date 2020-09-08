import { useState } from 'react';

import { Mercator } from '@vx/geo';
import * as topojson from 'topojson-client';

import topology from './safetyregions.topo.json';
import { FeatureCollection, MultiPolygon } from 'geojson';
import useMapColorScale from 'utils/useMapColorScale';
import useMapTooltip from './useMapTooltip';
import useRegionData from 'utils/useRegionData';
import { ISafetyRegionMapProps } from './SafetyRegionMap';
import { TooltipWithBounds } from '@vx/tooltip';
import sortFeatures from './sortFeatures';

export type SafetyRegionGeoJSON = FeatureCollection<
  MultiPolygon,
  SafetyRegionProperties
>;

export interface SafetyRegionProperties {
  vrcode: string;
}

export type TProps = {
  width: number;
  height: number;
} & ISafetyRegionMapProps;

const world = topojson.feature(
  topology,
  topology.objects.safetyregions
) as SafetyRegionGeoJSON;

export default function SafetyRegionChloropleth(props: TProps) {
  const { width, height, metric, gradient, onSelect, selected } = props;

  const [selection, setSelection] = useState<string | undefined>(selected);

  world.features = sortFeatures(world, 'vrcode', selected);

  const regionData = useRegionData(metric);
  const color = useMapColorScale(
    regionData,
    (item: typeof regionData[number]) => item.value,
    gradient
  );

  const getFillColor = (gmCode: string) => {
    const data = regionData[gmCode];
    return color(data?.value ?? 0);
  };

  const getData = (
    gmCode: string,
    featureProperties?: SafetyRegionProperties
  ) => {
    const data = regionData[gmCode];
    if (data) {
      return {
        ...data,
        ...featureProperties,
      };
    }
    return {};
  };

  const [showTooltip, hideTooltip, tooltipInfo] = useMapTooltip<
    typeof regionData[number] & SafetyRegionProperties
  >();

  return width < 10 ? null : (
    <>
      <svg
        width={width}
        height={height}
        style={{ display: 'block', width: '100%' }}
      >
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={'white'}
          rx={14}
        />
        <Mercator data={world.features} fitSize={[[width, height], world]}>
          {(mercator) => (
            <g>
              {mercator.features.map(({ feature, path }, i) => {
                const { vrcode } = feature.properties;
                const data = getData(vrcode, feature.properties);
                return (
                  <path
                    onMouseOver={(event) => showTooltip(event, data)}
                    onMouseOut={hideTooltip}
                    key={`safetyregion-map-feature-${i}`}
                    d={path || ''}
                    fill={getFillColor(vrcode)}
                    stroke={'black'}
                    strokeWidth={vrcode === selection ? 2 : 0.5}
                    onClick={() => {
                      if (onSelect) {
                        setSelection(vrcode);
                        onSelect(data);
                      }
                    }}
                  />
                );
              })}
            </g>
          )}
        </Mercator>
      </svg>

      {tooltipInfo?.tooltipOpen && tooltipInfo.tooltipData && (
        <TooltipWithBounds
          // set this to random so it correctly updates with parent bounds
          key={Math.random()}
          left={tooltipInfo.tooltipLeft}
          top={tooltipInfo.tooltipTop}
          style={{
            left: `${tooltipInfo?.tooltipLeft}px`,
            top: `${tooltipInfo?.tooltipTop}px`,
            position: 'absolute',
            border: '1px black solid',
            backgroundColor: 'white',
            transform: undefined,
            padding: '.5em',
            zIndex: 1000,
          }}
        >
          <strong>{tooltipInfo.tooltipData.regionName}</strong>:<br />
          {tooltipInfo.tooltipData.value}
        </TooltipWithBounds>
      )}
    </>
  );
}
