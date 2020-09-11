import { useState, useCallback, useRef } from 'react';

import { Mercator } from '@vx/geo';
import * as topojson from 'topojson-client';

import municipalTopology from './municipalities.topo.json';
import countryTopology from './netherlands.topo.json';
import regionTopology from './safetyregions.topo.json';

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
import municipalCodeToRegionCodeLookup from 'data/municipalCodeToRegionCodeLookup';

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

const countryGeo = topojson.feature(
  countryTopology,
  countryTopology.objects.netherlands
) as FeatureCollection<MultiPolygon>;

export default function MunicipalityChloropleth(props: TProps) {
  const { dimensions, metric, gradient, onSelect, selected } = props;

  const municipalGeo = topojson.feature(
    municipalTopology,
    municipalTopology.objects.municipalities
  ) as MunicipalGeoJOSN;

  const regionGeo = topojson.feature(
    regionTopology,
    regionTopology.objects.safetyregions
  ) as FeatureCollection<MultiPolygon>;

  const {
    width = 0,
    height = 0,
    marginLeft,
    marginTop,
    boundedWidth,
    boundedHeight,
  } = dimensions;

  let boundingbox = useMunicipalityFeatures(municipalGeo, selected) as any;
  municipalGeo.features = sortFeatures(municipalGeo, 'gemcode', selected);

  const vrcode = selected
    ? municipalCodeToRegionCodeLookup[selected]
    : undefined;
  if (vrcode) {
    const feature = regionGeo.features.find(
      (feat) => feat.properties?.vrcode === vrcode
    );
    if (feature) {
      regionGeo.features = [feature];
      boundingbox = regionGeo;
    }
  }

  const [selection] = useState<string | undefined>(selected);

  const municipalityData = useMunicipalityData(metric, municipalGeo);
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
        : municipalGeo.features.find(
            (feat) => feat.properties.gemcode === gmCode
          )?.properties;
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

  const features = municipalGeo.features
    .concat(regionGeo.features as any)
    .concat(countryGeo.features as any);

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
            fitSize={[[boundedWidth, boundedHeight], boundingbox]}
          >
            {(mercator) => (
              <g>
                {mercator.features.map(({ feature, path }, i) => {
                  if (!path) return null;
                  const { gemcode } = feature.properties;
                  if (gemcode) {
                    return (
                      <path
                        shapeRendering="optimizeQuality"
                        id={gemcode}
                        key={`municipality-map-feature-${i}`}
                        d={path}
                        fill={getFillColor(gemcode)}
                        stroke={gemcode === selection ? 'black' : 'grey'}
                        strokeWidth={gemcode === selection ? 3 : 0.5}
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
