import { useState, useCallback, useRef } from 'react';

import { Mercator } from '@vx/geo';
import * as topojson from 'topojson-client';

import topology from './safetyregions.topo.json';
import countryTopology from './netherlands.topo.json';

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

const countryGeo = topojson.feature(
  countryTopology,
  countryTopology.objects.netherlands
) as FeatureCollection<MultiPolygon>;

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

  const regionData = useRegionData(metric, world);
  const hasData = Boolean(Object.keys(regionData).length);

  const color = useMapColorScale(
    regionData,
    (item: typeof regionData[number]) => item.value,
    gradient
  );

  const getFillColor = useCallback(
    (gmCode: string) => {
      const data = regionData[gmCode];
      return color(data?.value ?? 0);
    },
    [regionData, color]
  );

  const getData = useCallback(
    (vrCode: string) => {
      return hasData
        ? regionData[vrCode]
        : world.features.find((feat) => feat.properties.vrcode === vrCode)
            ?.properties;
    },
    [regionData, hasData]
  );

  const [showTooltip, hideTooltip, tooltipInfo] = useMapTooltip<
    typeof regionData[number] & SafetyRegionProperties
  >();

  const clipPathId = useRef(`_${Math.random().toString(36).substring(2, 15)}`);

  const svgClick = (event: any) => {
    if (!onSelect) {
      return;
    }

    const elm = event.target;

    if (elm.id) {
      onSelect(getData(elm.id));
    }
  };

  const svgMouseOver = (event: any) => {
    const elm = event.target;
    if (elm.id) {
      if (timout.current > -1) {
        clearTimeout(timout.current);
        timout.current = -1;
      }
      showTooltip(event, getData(elm.id));
    }
  };

  const timout = useRef<any>(-1);
  const mouseout = () => {
    if (timout.current < 0) {
      timout.current = setTimeout(() => {
        hideTooltip();
      }, 500);
    }
  };

  const features = world.features.concat(countryGeo.features as any);

  return width < 10 ? null : (
    <>
      <svg
        width={width}
        height={height}
        className={styles.svgMap}
        onMouseOver={svgMouseOver}
        onMouseOut={mouseout}
        onClick={svgClick}
      >
        <clipPath id={clipPathId.current}>
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
          clipPath={`url(#${clipPathId.current})`}
        >
          <Mercator
            data={features}
            fitSize={[[boundedWidth, boundedHeight], world]}
          >
            {(mercator) => (
              <g>
                {mercator.features.map(({ feature, path }, i) => {
                  if (!path) return null;

                  const { vrcode } = feature.properties;

                  if (vrcode) {
                    return (
                      <path
                        shapeRendering="optimizeQuality"
                        id={vrcode}
                        key={`safetyregion-map-feature-${i}`}
                        d={path || ''}
                        fill={getFillColor(vrcode)}
                        stroke={vrcode === selection ? 'black' : 'grey'}
                        strokeWidth={vrcode === selection ? 2 : 0.5}
                      />
                    );
                  } else {
                    return (
                      <path
                        className={styles.overlay}
                        shapeRendering="optimizeQuality"
                        key={`municipality-map-feature-${i}`}
                        d={path}
                      />
                    );
                  }
                })}
              </g>
            )}
          </Mercator>
        </g>
      </svg>

      <TooltipWithBounds
        // set this to random so it correctly updates with parent bounds
        key={Math.random()}
        left={tooltipInfo?.tooltipLeft}
        top={tooltipInfo?.tooltipTop}
        style={{
          display: tooltipInfo?.tooltipOpen ? 'block' : 'none',
        }}
        className={styles.toolTip}
      >
        <strong>{tooltipInfo?.tooltipData?.vrname}</strong>
        {tooltipInfo?.tooltipData?.value && (
          <>
            <br />
            {tooltipInfo.tooltipData.value}
          </>
        )}
      </TooltipWithBounds>
    </>
  );
}
