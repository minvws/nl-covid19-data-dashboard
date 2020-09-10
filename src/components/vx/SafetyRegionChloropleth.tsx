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
import { TCombinedChartDimensions } from './use-chart-dimensions';
import styles from './chloropleth.module.scss';

export type SafetyRegionGeoJSON = FeatureCollection<
  MultiPolygon,
  SafetyRegionProperties
>;

export interface SafetyRegionProperties {
  vrcode: string;
  vrname: string;
}

export type TProps = {
  dimensions: TCombinedChartDimensions;
} & ISafetyRegionMapProps;

const world = topojson.feature(
  topology,
  topology.objects.safetyregions
) as SafetyRegionGeoJSON;

export default function SafetyRegionChloropleth(props: TProps) {
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
    featureProperties: SafetyRegionProperties
  ) => {
    const data = regionData[gmCode];
    if (data) {
      return {
        ...data,
        ...featureProperties,
      };
    }
    return featureProperties;
  };

  const [showTooltip, hideTooltip, tooltipInfo] = useMapTooltip<
    typeof regionData[number] & SafetyRegionProperties
  >();

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
          fill={'white'}
          rx={14}
        />
        <g
          transform={`translate(${[marginLeft, marginTop].join(',')})`}
          clipPath={`url(#${clipPathId})`}
        >
          <Mercator
            data={world.features}
            fitSize={[[boundedWidth, boundedHeight], world]}
          >
            {(mercator) => (
              <g>
                {mercator.features.map(({ feature, path }, i) => {
                  if (!path) return null;

                  const { vrcode } = feature.properties;
                  const data = getData(vrcode, feature.properties);

                  return (
                    <path
                      shapeRendering="optimizeQuality"
                      onMouseOver={(event) => showTooltip(event, data)}
                      onMouseOut={hideTooltip}
                      key={`safetyregion-map-feature-${i}`}
                      d={path || ''}
                      fill={getFillColor(vrcode)}
                      stroke={vrcode === selection ? 'black' : 'blue'}
                      strokeWidth={vrcode === selection ? 2 : 0.5}
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
          <strong>{tooltipInfo.tooltipData.vrname}</strong>
          {tooltipInfo.tooltipData?.value && (
            <>
              :<br />
              {tooltipInfo.tooltipData.value}
            </>
          )}
        </TooltipWithBounds>
      )}
    </>
  );
}
