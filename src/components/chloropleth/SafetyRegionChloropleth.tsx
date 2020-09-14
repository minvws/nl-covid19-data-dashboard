import classNames from 'classnames';
import { SafetyRegionProperties, TRegionMetricName } from './shared';
import { Regions } from 'types/data';
import { CSSProperties, ReactNode, useCallback } from 'react';
import useChartDimensions from './hooks/useChartDimensions';
import Chloropleth from './Chloropleth';
import { countryGeo, regionGeo } from './topology';
import { Feature, MultiPolygon } from 'geojson';
import styles from './chloropleth.module.scss';
import useSafetyRegionBoundingbox from './hooks/useSafetyRegionBoundingbox';
import useChloroplethColorScale from './hooks/useChloroplethColorScale';
import useSafetyRegionData from './hooks/useSafetyRegionData';

export type TProps<
  T extends TRegionMetricName,
  ItemType extends Regions[T][number],
  ReturnType extends ItemType & { value: number },
  TContext extends ReturnType | SafetyRegionProperties
> = {
  metricName?: T;
  metricProperty?: string;
  selected?: string;
  style?: CSSProperties;
  onSelect?: (context: TContext) => void;
  tooltipContent?: (context: TContext) => ReactNode;
  gradient?: string[];
};

/**
 * This component renders a map of the Netherlands with the outlines of all the safety regions which
 * receive a fill color based on the specified Region metric data.
 *
 * The metricName specifies which exact metric is visualised. The color scale is calculated using
 * the specified metric and the given gradient.
 * An optional metricProperty name can be provided as well, when the metric key isn't the same name
 * as the actual value property.
 *
 * When a selected region code is specified, the map will zoom in on the safety region.
 *
 * As an overlay the country outlines are shown.
 *
 * @param props
 */
export default function SafetyRegionChloropleth<
  T extends TRegionMetricName,
  ItemType extends Regions[T][number],
  ReturnType extends ItemType & { value: number },
  TContext extends ReturnType | SafetyRegionProperties
>(props: TProps<T, ItemType, ReturnType, TContext>) {
  const {
    selected,
    style,
    metricName,
    metricProperty,
    onSelect,
    tooltipContent,
    gradient,
  } = props;

  const [ref, dimensions] = useChartDimensions();

  const boundingbox = useSafetyRegionBoundingbox(regionGeo, selected);

  const [getData, hasData, domain] = useSafetyRegionData(
    metricName,
    regionGeo,
    metricProperty
  );

  const getFillColor = useChloroplethColorScale(getData, domain, gradient);

  const featureCallback = useCallback(
    (
      feature: Feature<MultiPolygon, SafetyRegionProperties>,
      path: string,
      _index: number
    ) => {
      const { vrcode } = feature.properties;

      const isSelected = vrcode === selected;
      const className = classNames(
        isSelected ? styles.selectedPath : '',
        !hasData ? styles.noData : undefined
      );

      return (
        <path
          className={className}
          shapeRendering="optimizeQuality"
          data-id={vrcode}
          key={`safetyregion-map-feature-${vrcode}`}
          d={path || ''}
          fill={getFillColor(vrcode)}
        />
      );
    },
    [getFillColor, hasData, selected]
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
        key={`safetyregion-map-overlay-${index}`}
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
        featureCollection={regionGeo}
        overlays={countryGeo}
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

SafetyRegionChloropleth.defaultProps = {
  gradient: ['#C0E8FC', '#0579B3'],
};
