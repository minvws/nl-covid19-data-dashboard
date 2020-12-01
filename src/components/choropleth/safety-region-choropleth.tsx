import css from '@styled-system/css';
import { Feature, MultiPolygon } from 'geojson';
import { ReactNode, useCallback } from 'react';
import { Regions } from '~/types/data';
import { Choropleth } from './choropleth';
import {
  useChartDimensions,
  useChoroplethColorScale,
  useSafetyRegionBoundingbox,
  useSafetyRegionData,
} from './hooks';
import { getSelectedThreshold } from './legenda/utils';
import { Path } from './path';
import { SafetyRegionProperties, TRegionMetricName } from './shared';
import { countryGeo, regionGeo } from './topology';

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
    metricName,
    metricValueName,
    onSelect,
    tooltipContent,
  } = props;

  const [ref, dimensions] = useChartDimensions<HTMLDivElement>(1.2);

  const boundingBox = useSafetyRegionBoundingbox(regionGeo, selected);

  const [getData, hasData] = useSafetyRegionData(
    metricName,
    regionGeo,
    metricValueName
  );

  const selectedThreshold = getSelectedThreshold(metricName, metricValueName);

  const DEFAULT_FILL = 'white';
  const getFillColor = useChoroplethColorScale(
    getData,
    selectedThreshold,
    DEFAULT_FILL
  );

  const featureCallback = useCallback(
    (feature: Feature<MultiPolygon, SafetyRegionProperties>, path: string) => {
      const { vrcode } = feature.properties;
      const fill =
        hasData && getFillColor(vrcode) ? getFillColor(vrcode) : DEFAULT_FILL;
      return (
        <Path
          key={vrcode}
          id={vrcode}
          d={path}
          fill={fill}
          stroke={fill === DEFAULT_FILL ? '#c4c4c4' : '#fff'}
          strokeWidth={1}
        />
      );
    },
    [getFillColor, hasData]
  );

  const hoverCallback = useCallback(
    (feature: Feature<MultiPolygon, SafetyRegionProperties>, path: string) => {
      const { vrcode } = feature.properties;
      const isSelected = vrcode === selected && highlightSelection;

      return (
        <Path
          hoverable
          id={vrcode}
          key={vrcode}
          d={path}
          stroke={isSelected ? '#000' : undefined}
          strokeWidth={isSelected ? 3 : undefined}
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

  return (
    <div ref={ref} css={css({ position: 'relative', bg: 'transparent' })}>
      <Choropleth
        featureCollection={regionGeo}
        hovers={hasData ? regionGeo : undefined}
        boundingBox={boundingBox || countryGeo}
        dimensions={dimensions}
        featureCallback={featureCallback}
        hoverCallback={hoverCallback}
        onPathClick={onClick}
        getTooltipContent={getTooltipContent}
      />
    </div>
  );
}
