import { useState, useCallback, useRef } from 'react';

import { Mercator } from '@vx/geo';
import * as topojson from 'topojson-client';

import topology from './municipalities.topo.json';
import { FeatureCollection, MultiPolygon } from 'geojson';
import useMunicipalityData from 'utils/useMunicipalityData';
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

  const boundingbox = useMunicipalityFeatures(world, selected);
  world.features = sortFeatures(world, 'gemcode', selected);

  const [selection] = useState<string | undefined>(selected);

  const municipalityData = useMunicipalityData(metric, world);
  const hasData = Boolean(Object.keys(municipalityData).length);

  const color = useMapColorScale(
    municipalityData,
    (item: typeof municipalityData[number]) => item.value,
    gradient
  );

  const getFillColor = useCallback(
    (gmCode: string) => {
      const data = municipalityData[gmCode];
      const value = data?.value ?? 0;
      return color(value);
    },
    [municipalityData, color]
  );

  const getData = useCallback(
    (gmCode: string) => {
      return hasData
        ? municipalityData[gmCode]
        : world.features.find((feat) => feat.properties.gemcode === gmCode)
            ?.properties;
    },
    [municipalityData, hasData]
  );

  const [showTooltip, hideTooltip, tooltipInfo] = useMapTooltip<
    typeof municipalityData[number] & MunicipalityProperties
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
            data={world.features}
            fitSize={[[boundedWidth, boundedHeight], boundingbox]}
          >
            {(mercator) => (
              <g>
                {mercator.features.map(({ feature, path }, i) => {
                  if (!path) return null;
                  const { gemcode } = feature.properties;
                  return (
                    <path
                      shapeRendering="optimizeQuality"
                      id={gemcode}
                      key={`municipality-map-feature-${i}`}
                      d={path}
                      fill={getFillColor(gemcode)}
                      stroke={gemcode === selection ? 'black' : 'blue'}
                      strokeWidth={gemcode === selection ? 3 : 0.5}
                    />
                  );
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
        <strong>{tooltipInfo?.tooltipData?.gemnaam}</strong>
        {tooltipInfo?.tooltipData?.value && (
          <>
            <br />
            {tooltipInfo?.tooltipData?.value}
          </>
        )}
      </TooltipWithBounds>
    </>
  );
}
