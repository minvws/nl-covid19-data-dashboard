import classNames from 'classnames';
import {
  ChloroplethThresholds,
  SafetyRegionProperties,
  TRegionMetricName,
} from './shared';
import { Regions } from '~/types/data';
import { CSSProperties, ReactNode, useCallback } from 'react';
import { useChartDimensions } from './hooks/useChartDimensions';
import { Chloropleth } from './Chloropleth';
import { countryGeo, regionGeo } from './topology';
import { Feature, MultiPolygon } from 'geojson';
import styles from './chloropleth.module.scss';
import { useSafetyRegionBoundingbox } from './hooks/useSafetyRegionBoundingbox';
import { useChloroplethColorScale } from './hooks/useChloroplethColorScale';
import { useSafetyRegionData } from './hooks/useSafetyRegionData';

type RegionalThresholds = ChloroplethThresholds<TRegionMetricName>;

const positiveTestedThresholds: RegionalThresholds = {
  dataKey: 'positive_tested_people',
  thresholds: [
    {
      color: '#C0E8FC',
      threshold: 0,
    },
    {
      color: '#8BD1FF',
      threshold: 4,
    },
    {
      color: '#61B6ED',
      threshold: 7,
    },
    {
      color: '#3597D4',
      threshold: 10,
    },
    {
      color: '#046899',
      threshold: 20,
    },
    {
      color: '#034566',
      threshold: 30,
    },
  ],
};

const hospitalAdmissionsThresholds: RegionalThresholds = {
  dataKey: 'hospital_admissions',
  thresholds: [
    {
      color: '#c0e8fc',
      threshold: 0,
    },
    {
      color: '#87cbf8',
      threshold: 10,
    },
    {
      color: '#5dafe4',
      threshold: 16,
    },
    {
      color: '#3391cc',
      threshold: 24,
    },
    {
      color: '#0579b3',
      threshold: 31,
    },
  ],
};

const escalationThresholds: RegionalThresholds = {
  dataKey: 'escalation_levels',
  svgClass: 'escalationMap',
  thresholds: [
    {
      color: '#F291BC',
      threshold: 1,
    },
    {
      color: '#D95790',
      threshold: 2,
    },
    {
      color: '#A11050',
      threshold: 3,
    },
  ],
};

export const thresholds: Record<TRegionMetricName, RegionalThresholds> = {
  positive_tested_people: positiveTestedThresholds,
  hospital_admissions: hospitalAdmissionsThresholds,
  escalation_levels: escalationThresholds,
};

export type TProps<
  T extends TRegionMetricName,
  ItemType extends Regions[T][number],
  ReturnType extends ItemType & { value: number },
  TContext extends ReturnType | SafetyRegionProperties
> = {
  metricName?: T;
  metricProperty?: string;
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
 * An optional metricProperty name can be provided as well, when the metric key isn't the same name
 * as the actual value property.
 *
 * When a selected region code is specified, the map will zoom in on the safety region.
 *
 * As an overlay the country outlines are shown.
 *
 * @param props
 */
export function SafetyRegionChloropleth<
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
    metricProperty,
    onSelect,
    tooltipContent,
  } = props;

  const [ref, dimensions] = useChartDimensions();

  const boundingbox = useSafetyRegionBoundingbox(regionGeo, selected);

  const [getData, hasData] = useSafetyRegionData(
    metricName,
    regionGeo,
    metricProperty
  );

  const selectedThreshold = metricName ? thresholds[metricName] : undefined;
  const getFillColor = useChloroplethColorScale(
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
    styles.chloroplethContainer,
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
      <Chloropleth
        featureCollection={regionGeo}
        overlays={countryGeo}
        hovers={hasData ? regionGeo : undefined}
        boundingBox={boundingbox || countryGeo}
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
