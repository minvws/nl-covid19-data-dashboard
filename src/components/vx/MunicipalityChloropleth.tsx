import { useState } from 'react';

import { Mercator } from '@vx/geo';
import * as topojson from 'topojson-client';

import topology from './municipalities.topo.json';
import { FeatureCollection, MultiPolygon } from 'geojson';
import useNewMunicipalityData from 'utils/useMunicipalityData';
import useMapColorScale from 'utils/useMapColorScale';
import useMapTooltip from './useMapTooltip';
import { IMunicipalityMapProps } from './MunicipalityMap';
import useMunicipalityFeatures from './useMunicipalityFeatures';
import sortFeatures from './sortFeatures';
import { TooltipWithBounds } from '@vx/tooltip';

import styles from './chloropleth.module.scss';
import { TCombinedChartDimensions } from './use-chart-dimensions';

export type MunicipalGeoJOSN = FeatureCollection<
  MultiPolygon,
  MunicipalityProperties
>;

export interface MunicipalityProperties {
  gemnaam: string;
  gemcode: string;
}

export type TProps = {
  dimensions: TCombinedChartDimensions;
} & IMunicipalityMapProps;

const world = topojson.feature(
  topology,
  topology.objects.municipalities
) as MunicipalGeoJOSN;

export default function MunicipalityChloropleth(props: TProps) {
  const { dimensions, metric, gradient, onSelect, selected } = props;

  const {
    width = 0,
    height = 0,
    marginLeft,
    marginTop,
    boundedWidth,
    boundedHeight,
  } = dimensions;

  const [selection] = useState<string | undefined>(selected);

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
    const value = data?.value ?? 0;
    return color(value);
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
    return featureProperties;
  };

  const [showTooltip, hideTooltip, tooltipInfo] = useMapTooltip<
    typeof municipalityData[number] & MunicipalityProperties
  >();

  const handleMouseOver = (event: any, data: any) => {
    showTooltip(event, data);
  };

  const clipPathId = `_${Math.random().toString(36).substring(2, 15)}`;

  return width < 10 ? null : (
    <>
      <svg width={width} height={height} className={styles.svgMap}>
        <clipPath id={clipPathId}>
          <rect
            x={dimensions.marginLeft}
            y={0}
            height={dimensions.boundedHeight}
            width={
              (dimensions.boundedWidth ?? 0) -
              (dimensions.marginLeft ?? 0) -
              (dimensions.marginRight ?? 0)
            }
          />
        </clipPath>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={'transparent'}
          rx={14}
        />
        <g
          transform={`translate(${[marginLeft, marginTop].join(',')})`}
          clipPath={`url(#${clipPathId})`}
        >
          <Mercator
            data={world.features}
            fitSize={[[boundedWidth, boundedHeight], boundingbox]}
          >
            {(mercator) => (
              <g>
                {mercator.features.map(({ feature, path }, i) => {
                  if (!path) return null;

                  const { gemcode } = feature.properties;
                  const data = getData(gemcode, feature.properties);

                  return (
                    <path
                      shapeRendering="optimizeQuality"
                      onMouseOver={(event) => handleMouseOver(event, data)}
                      onMouseOut={hideTooltip}
                      key={`municipality-map-feature-${i}`}
                      d={path}
                      fill={getFillColor(gemcode)}
                      stroke={gemcode === selection ? 'black' : '#01689B'}
                      strokeWidth={0.75}
                      onClick={() => {
                        if (onSelect) {
                          onSelect(data);
                        }
                      }}
                    />
                  );
                })}
              </g>
            )}
          </Mercator>
        </g>
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
            transform: 'none',
          }}
          className={styles.toolTip}
        >
          <strong>{tooltipInfo.tooltipData?.gemnaam}</strong>
          {tooltipInfo.tooltipData?.value && (
            <>
              :<br />
              {tooltipInfo.tooltipData?.value}
            </>
          )}
        </TooltipWithBounds>
      )}
    </>
  );
}
