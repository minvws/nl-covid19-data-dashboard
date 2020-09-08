import { useState } from 'react';

import { Mercator } from '@vx/geo';
import * as topojson from 'topojson-client';

import topology from './municipalities.topo.json';
import { FeatureCollection, MultiPolygon } from 'geojson';
import useNewMunicipalityData from 'utils/useMunicipalityData';
import useMapColorScale from 'utils/useMapColorScale';
import useMapTooltip from './useMapTooltip';
import { IResponsiveMunicipalityMapProps } from './MunicipalityMap';
import useMunicipalityFeatures from './useMunicipalityFeatures';
import sortFeatures from './sortFeatures';
import { TooltipWithBounds } from '@vx/tooltip';

export type MunicipalGeoJOSN = FeatureCollection<
  MultiPolygon,
  MunicipalityProperties
>;

export interface MunicipalityProperties {
  gemnaam: string;
  gemcode: string;
}

export type TProps = {
  width: number;
  height: number;
} & IResponsiveMunicipalityMapProps;

const world = topojson.feature(
  topology,
  topology.objects.municipalities
) as MunicipalGeoJOSN;

export default function MunicipalityChloropleth(props: TProps) {
  const { width, height, metric, gradient, onSelect, selected } = props;

  const [selection, setSelection] = useState<string | undefined>(selected);

  const municipalityData = useNewMunicipalityData(metric);
  const color = useMapColorScale(
    municipalityData,
    (item: typeof municipalityData[number]) => item.value,
    gradient
  );

  const boundingbox = useMunicipalityFeatures(world, selected);
  world.features = sortFeatures(world, 'gemcode', selected);

  const getFillColor = (gmCode: string) => {
    const data = municipalityData[gmCode];
    return color(data?.value ?? 0);
  };

  const getData = (
    gmCode: string,
    featureProperties?: MunicipalityProperties
  ) => {
    const data = municipalityData[gmCode];
    if (data) {
      return {
        ...data,
        ...featureProperties,
      };
    }
    return {};
  };

  const [showTooltip, hideTooltip, tooltipInfo] = useMapTooltip<
    typeof municipalityData[number] & MunicipalityProperties
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
        <Mercator
          data={world.features}
          fitSize={[[width, height], boundingbox]}
        >
          {(mercator) => (
            <g>
              {mercator.features.map(({ feature, path }, i) => {
                const { gemcode } = feature.properties;
                const data = getData(gemcode, feature.properties);
                return (
                  <path
                    onMouseOver={(event) => showTooltip(event, data)}
                    onMouseOut={hideTooltip}
                    key={`municipality-map-feature-${i}`}
                    d={path || ''}
                    fill={getFillColor(gemcode)}
                    stroke={gemcode === selection ? 'white' : 'black'}
                    strokeWidth={gemcode === selection ? 2 : 0.5}
                    onClick={() => {
                      if (onSelect) {
                        setSelection(gemcode);
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
          <strong>{tooltipInfo.tooltipData?.gemnaam}</strong>:<br />
          {tooltipInfo.tooltipData?.value}
        </TooltipWithBounds>
      )}
    </>
  );
}
