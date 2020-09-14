import classNames from 'classnames';
import { TMunicipalityMetricName } from './shared';

import Chloropleth from './Chloropleth';
import { Feature, MultiPolygon } from 'geojson';
import useChartDimensions from './hooks/useChartDimensions';

import styles from './chloropleth.module.scss';
import { CSSProperties, ReactNode, useCallback } from 'react';
import { Municipalities } from 'types/data.d';
import useMunicipalityData from './hooks/useMunicipalityData';
import useChloroplethColorScale from './hooks/useChloroplethColorScale';
import useMunicipalityBoundingbox from './hooks/useMunicipalityBoundingbox';
import { MunicipalityProperties } from './shared';
import useRegionMunicipalities from './hooks/useRegionMunicipalities';
import { countryGeo, municipalGeo, regionGeo } from './topology';

export type TProps<
  T extends TMunicipalityMetricName,
  ItemType extends Municipalities[T][number],
  ReturnType extends ItemType & { value: number },
  TContext extends ReturnType | MunicipalityProperties
> = {
  metricName?: T;
  selected?: string;
  style?: CSSProperties;
  onSelect?: (context: TContext) => void;
  tooltipContent?: (context: TContext) => ReactNode;
  gradient?: string[];
};

/**
 * This component renders a map of the Netherlands with the outlines of all the municipalities which
 * receive a fill color based on the specified Municipality metric data.
 *
 * The metricName specifies which exact metric is visualised. The color scale is calculated using
 * the specified metric and the given gradient.
 *
 * When a selected municipal code is specified, the map will zoom in on the safety region to which
 * the associated municipality belongs and all surrounding features will be rendered in a faded manner.
 *
 * As an overlay the safety region and country outlines are shown.
 *
 * @param props
 */
export default function MunicipalityChloropleth<
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
    gradient,
  } = props;

  const [ref, dimensions] = useChartDimensions();

  const boundingbox = useMunicipalityBoundingbox(regionGeo, selected);

  const [getData, hasData, domain] = useMunicipalityData(
    metricName,
    municipalGeo
  );

  const safetyRegionMunicipalCodes = useRegionMunicipalities(selected);

  const getFillColor = useChloroplethColorScale(getData, domain, gradient);

  const featureCallback = useCallback(
    (
      feature: Feature<MultiPolygon, MunicipalityProperties>,
      path: string,
      _index: number
    ) => {
      const { gemcode } = feature.properties;
      const isSelected = gemcode === selected;
      const isInSameRegion =
        (safetyRegionMunicipalCodes?.indexOf(gemcode) ?? 0) > -1;
      const className = classNames(
        isSelected ? styles.selectedPath : undefined,
        !hasData ? styles.noData : undefined,
        isInSameRegion ? undefined : styles.faded
      );

      const fillColor = getFillColor(gemcode);

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
    [getFillColor, selected, hasData, safetyRegionMunicipalCodes]
  );

  const overlayCallback = (
    _feature: Feature<MultiPolygon>,
    path: string,
    index: number
  ) => {
    return (
      <path
        className={styles.overlay}
        shapeRendering="optimizeQuality"
        key={`municipality-map-overlay-${index}`}
        d={path}
        fill={'none'}
      />
    );
  };

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
    <div
      ref={(elm) => {
        ref.current = elm;
      }}
      className={styles.chloroplethContainer}
      style={style}
    >
      <Chloropleth
        featureCollection={municipalGeo}
        overlays={overlays}
        boundingbox={boundingbox || countryGeo}
        dimensions={dimensions}
        featureCallback={featureCallback}
        overlayCallback={overlayCallback}
        onPathClick={onClick}
        getTooltipContent={getTooltipContent}
      />
    </div>
  );
}

MunicipalityChloropleth.defaultProps = {
  gradient: ['#C0E8FC', '#0579B3'],
};

const overlays = {
  ...countryGeo,
  features: countryGeo.features.concat(regionGeo.features),
};
