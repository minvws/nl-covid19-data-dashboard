import { useCallback, useRef } from 'react';

import { Mercator } from '@vx/geo';
import * as topojson from 'topojson-client';

import regionTopology from './safetyregions.topo.json';
import countryTopology from './netherlands.topo.json';
import municipalTopology from './municipalities.topo.json';

import { FeatureCollection, MultiPolygon } from 'geojson';
import useMapColorScale from 'utils/useMapColorScale';
import useMapTooltip from './useMapTooltip';
import useRegionData from 'utils/useRegionData';
import { ISafetyRegionMapProps } from './SafetyRegionMap';
import { TooltipWithBounds } from '@vx/tooltip';
import sortFeatures from './sortFeatures';
import { TCombinedChartDimensions } from './use-chart-dimensions';
import styles from './chloropleth.module.scss';
import { MunicipalGeoJOSN, SafetyRegionGeoJSON } from './chloropleth';

export interface SafetyRegionProperties {
  vrcode: string;
  vrname: string;
}

export type TProps = {
  dimensions: TCombinedChartDimensions;
} & ISafetyRegionMapProps<any>;

const countryGeo = topojson.feature(
  countryTopology,
  countryTopology.objects.netherlands
) as FeatureCollection<MultiPolygon>;

export default function SafetyRegionChloropleth(props: TProps) {
  const {
    dimensions,
    metric,
    metricProperty,
    gradient,
    onSelect,
    selected,
    tooltipContent,
  } = props;

  const regionGeo = topojson.feature(
    regionTopology,
    regionTopology.objects.safetyregions
  ) as SafetyRegionGeoJSON;

  const municipalGeo = topojson.feature(
    municipalTopology,
    municipalTopology.objects.municipalities
  ) as MunicipalGeoJOSN;

  const {
    width = 0,
    height = 0,
    marginLeft,
    marginTop,
    boundedWidth,
    boundedHeight,
  } = dimensions;

  regionGeo.features = sortFeatures(regionGeo, 'vrcode', selected);

  const boundingbox = { ...regionGeo };
  boundingbox.features = selected
    ? boundingbox.features.filter((feat) => feat.properties.vrcode === selected)
    : boundingbox.features;

  const regionData = useRegionData(metric, regionGeo, metricProperty as any);

  const hasData = Boolean(Object.keys(regionData ?? {}).length);

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
      const result = hasData
        ? regionData[vrCode]
        : regionGeo.features.find((feat) => feat.properties.vrcode === vrCode)
            ?.properties;
      return result;
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
      const data = getData(elm.id);
      showTooltip(event, data);
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

  const features = regionGeo.features
    .concat(selected ? (municipalGeo.features as any) : [])
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
        <rect x={0} y={0} width={width} height={height} fill={'none'} rx={14} />
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

                  const { vrcode } = feature.properties as any;

                  if (vrcode) {
                    const isSelected = vrcode === selected;
                    let className = isSelected ? styles.selectedPath : '';
                    if (!hasData) {
                      className += ` ${styles.noData}`;
                    }
                    return (
                      <path
                        className={className}
                        shapeRendering="optimizeQuality"
                        id={vrcode}
                        key={`safetyregion-map-feature-${i}`}
                        d={path || ''}
                        fill={getFillColor(vrcode)}
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
        {tooltipContent(tooltipInfo?.tooltipData)}
      </TooltipWithBounds>
    </>
  );
}
