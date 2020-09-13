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
    onSelect,
    tooltipContent,
    gradient,
  } = props;

  const [ref, dimensions] = useChartDimensions();

  const boundingbox = useSafetyRegionBoundingbox(regionGeo, selected);

  const [getData, hasData, domain] = useSafetyRegionData(metricName, regionGeo);

  const getFillColor = useChloroplethColorScale(getData, domain, gradient);

  const featureCallback = useCallback(
    (
      feature: Feature<MultiPolygon, SafetyRegionProperties>,
      path: string,
      index: number
    ) => {
      const { vrcode } = feature.properties;

      const isSelected = vrcode === selected;
      let className = isSelected ? styles.selectedPath : '';
      if (!hasData) {
        className += ` ${styles.noData}`;
      }
      return (
        <path
          className={className}
          shapeRendering="optimizeQuality"
          data-id={vrcode}
          key={`safetyregion-map-feature-${index}`}
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
