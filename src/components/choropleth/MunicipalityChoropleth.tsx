import classNames from 'classnames';
import { SafetyRegionProperties, TMunicipalityMetricName } from './shared';

import { Choropleth } from './Choropleth';
import { Feature, GeoJsonProperties, MultiPolygon } from 'geojson';
import { useChartDimensions } from './hooks/useChartDimensions';

import styles from './choropleth.module.scss';
import { CSSProperties, ReactNode, useCallback } from 'react';
import { Municipalities } from '~/types/data';
import { useMunicipalityData } from './hooks/useMunicipalityData';
import { useChoroplethColorScale } from './hooks/useChoroplethColorScale';
import { useMunicipalityBoundingbox } from './hooks/useMunicipalityBoundingbox';
import { MunicipalityProperties } from './shared';
import { useRegionMunicipalities } from './hooks/useRegionMunicipalities';
import { countryGeo, municipalGeo, regionGeo } from './topology';
import { municipalThresholds } from './municipalThresholds';

export type TProps<
  T extends TMunicipalityMetricName,
  ItemType extends Municipalities[T][number],
  ReturnType extends ItemType & { value: number },
  TContext extends ReturnType | MunicipalityProperties
> = {
  metricName?: T;
  selected?: string;
  highlightSelection?: boolean;
  style?: CSSProperties;
  onSelect?: (context: TContext) => void;
  tooltipContent?: (context: TContext) => ReactNode;
  isSelectorMap?: boolean;
};

/**
 * This component renders a map of the Netherlands with the outlines of all the municipalities which
 * receive a fill color based on the specified Municipality metric data.
 *
 * The metricName specifies which exact metric is visualized. The color scale is calculated using
 * the specified metric and the given gradient.
 *
 * When a selected municipal code is specified, the map will zoom in on the safety region to which
 * the associated municipality belongs and all surrounding features will be rendered in a faded manner.
 *
 * As an overlay the safety region and country outlines are shown.
 *
 * @param props
 */
export function MunicipalityChoropleth<
  T extends TMunicipalityMetricName,
  ItemType extends Municipalities[T][number],
  ReturnType extends ItemType & { value: number },
  TContext extends ReturnType | MunicipalityProperties
>(props: TProps<T, ItemType, ReturnType, TContext>) {
  const {
    selected,
    style,
    metricName,
    onSelect,
    tooltipContent,
    highlightSelection = true,
    isSelectorMap,
  } = props;

  const [ref, dimensions] = useChartDimensions<HTMLDivElement>(1.2);

  const [boundingbox, selectedVrCode] = useMunicipalityBoundingbox(
    regionGeo,
    selected
  );

  const [getData, hasData] = useMunicipalityData(metricName, municipalGeo);

  const safetyRegionMunicipalCodes = useRegionMunicipalities(selected);

  const thresholdValues = metricName
    ? municipalThresholds[metricName]
    : undefined;
  const getFillColor = useChoroplethColorScale(
    getData,
    thresholdValues?.thresholds
  );

  const featureCallback = useCallback(
    (
      feature: Feature<MultiPolygon, MunicipalityProperties>,
      path: string,
      _index: number
    ) => {
      const { gemcode } = feature.properties;
      const isInSameRegion =
        (safetyRegionMunicipalCodes?.indexOf(gemcode) ?? 0) > -1;
      const className = classNames(
        !hasData ? styles.noData : undefined,
        isInSameRegion ? undefined : styles.faded
      );

      const fillColor = isInSameRegion ? getFillColor(gemcode) : 'white';

      return (
        <path
          className={className}
          shapeRendering="optimizeQuality"
          data-id={gemcode}
          key={`municipality-map-feature-${gemcode}`}
          d={path}
          fill={fillColor}
        />
      );
    },
    [getFillColor, hasData, safetyRegionMunicipalCodes]
  );

  const overlayCallback = useCallback(
    (
      feature: Feature<
        MultiPolygon,
        SafetyRegionProperties | GeoJsonProperties
      >,
      path: string,
      _index: number
    ) => {
      const { vrcode } = feature.properties as SafetyRegionProperties;
      const className = classNames(
        hasData && vrcode !== selectedVrCode ? styles.faded : styles.overlay
      );

      return (
        <path
          className={className}
          shapeRendering="optimizeQuality"
          key={`municipality-map-overlay-${vrcode}`}
          d={path}
          fill={'none'}
        />
      );
    },
    [selectedVrCode, hasData]
  );

  const hoverCallback = useCallback(
    (feature: Feature<MultiPolygon, MunicipalityProperties>, path: string) => {
      const { gemcode } = feature.properties;
      const isInSameRegion =
        (safetyRegionMunicipalCodes?.indexOf(gemcode) ?? 0) > -1;
      const isSelected = gemcode === selected && highlightSelection;
      const className = classNames(
        isSelected ? styles.selectedPath : styles.hoverLayer
      );

      if (hasData && selected && !isInSameRegion) {
        return null;
      }

      return (
        <path
          className={className}
          data-id={gemcode}
          shapeRendering="optimizeQuality"
          key={`municipality-map-hover-${gemcode}`}
          d={path}
        />
      );
    },
    [hasData, selected, highlightSelection, safetyRegionMunicipalCodes]
  );

  const onClick = (id: string) => {
    if (onSelect) {
      const data = getData(id);
      onSelect(data as any);
    }
  };

  const getTooltipContent = (id: string) => {
    if (tooltipContent) {
      const data = getData(id);
      return tooltipContent(data as any);
    }
    return null;
  };

  return (
    <div ref={ref} className={styles.choroplethContainer} style={style}>
      <Choropleth
        featureCollection={municipalGeo}
        overlays={overlays}
        hovers={hasData ? municipalGeo : undefined}
        boundingBox={boundingbox || countryGeo}
        dimensions={dimensions}
        featureCallback={featureCallback}
        overlayCallback={overlayCallback}
        hoverCallback={hoverCallback}
        onPathClick={onClick}
        getTooltipContent={getTooltipContent}
        isSelectorMap={isSelectorMap}
      />
    </div>
  );
}

const overlays = {
  ...countryGeo,
  features: countryGeo.features.concat(regionGeo.features),
};
