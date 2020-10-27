import classNames from 'classnames';
import { SafetyRegionProperties, TRegionMetricName } from './shared';
import { Regions } from '~/types/data';
import { CSSProperties, ReactNode, useCallback } from 'react';
import { useChartDimensions } from './hooks/useChartDimensions';
import { Choropleth } from './Choropleth';
import { countryGeo, regionGeo } from './topology';
import { Feature, MultiPolygon } from 'geojson';
import styles from './choropleth.module.scss';
import { useSafetyRegionBoundingbox } from './hooks/useSafetyRegionBoundingbox';
import { useChoroplethColorScale } from './hooks/useChoroplethColorScale';
import { useSafetyRegionData } from './hooks/useSafetyRegionData';
import { getSelectedThreshold } from './legenda/hooks/useSafetyRegionLegendaData';

export type TProps<
  T extends TRegionMetricName,
  ItemType extends Regions[T][number],
  ReturnType extends ItemType & { value: number },
  TContext extends ReturnType | SafetyRegionProperties
> = {
  metricName?: T;
  metricValueName?: string;
  selected?: string;
  highlightSelection?: boolean;
  style?: CSSProperties;
  onSelect?: (context: TContext) => void;
  tooltipContent?: (context: TContext) => ReactNode;
};

/**
 * This component renders a map of the Netherlands with the outlines of all the safety regions which
 * receive a fill color based on the specified Region metric data.
 *
 * The metricName specifies which exact metric is visualized. The color scale is calculated using
 * the specified metric and the given gradient.
 * An optional metricValueName can be provided as well, when the metric key isn't the same name
 * as the actual value name. Most of the time they are the same:
 * e.g. hospital_admissions.hospital_admissions
 *
 * When a selected region code is specified, the map will zoom in on the safety region.
 *
 * As an overlay the country outlines are shown.
 *
 * @param props
 */
export function SafetyRegionChoropleth<
  T extends TRegionMetricName,
  ItemType extends Regions[T][number],
  ReturnType extends ItemType & { value: number },
  TContext extends ReturnType | SafetyRegionProperties
>(props: TProps<T, ItemType, ReturnType, TContext>) {
  const {
    selected,
    highlightSelection = true,
    style,
    metricName,
    metricValueName,
    onSelect,
    tooltipContent,
  } = props;

  const [ref, dimensions] = useChartDimensions(1.2);

  const boundingBox = useSafetyRegionBoundingbox(regionGeo, selected);

  const [getData, hasData] = useSafetyRegionData(
    metricName,
    regionGeo,
    metricValueName
  );

  const selectedThreshold = getSelectedThreshold(metricName, metricValueName);

  const getFillColor = useChoroplethColorScale(
    getData,
    selectedThreshold?.thresholds
  );

  const featureCallback = useCallback(
    (
      feature: Feature<MultiPolygon, SafetyRegionProperties>,
      path: string,
      _index: number
    ) => {
      const { vrcode } = feature.properties;

      const className = classNames(!hasData ? styles.noData : undefined);

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
    [getFillColor, hasData]
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

  const hoverCallback = useCallback(
    (feature: Feature<MultiPolygon, SafetyRegionProperties>, path: string) => {
      const { vrcode } = feature.properties;
      const isSelected = vrcode === selected && highlightSelection;
      const className = classNames(
        isSelected ? styles.selectedPath : styles.hoverLayer
      );

      return (
        <path
          className={className}
          data-id={vrcode}
          shapeRendering="optimizeQuality"
          key={`safetyregion-map-hover-${vrcode}`}
          d={path}
        />
      );
    },
    [selected, highlightSelection]
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

  const className = classNames(
    styles.choroplethContainer,
    selectedThreshold?.svgClass ? styles[selectedThreshold.svgClass] : undefined
  );

  return (
    <div
      ref={(elm) => {
        ref.current = elm;
      }}
      className={className}
      style={style}
    >
      <Choropleth
        featureCollection={regionGeo}
        overlays={countryGeo}
        hovers={hasData ? regionGeo : undefined}
        boundingBox={boundingBox || countryGeo}
        dimensions={dimensions}
        featureCallback={featureCallback}
        overlayCallback={overlayCallback}
        hoverCallback={hoverCallback}
        onPathClick={onClick}
        getTooltipContent={getTooltipContent}
      />
    </div>
  );
}
