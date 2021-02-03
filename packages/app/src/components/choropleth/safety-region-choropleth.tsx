import {
  Regions,
  RegionsMetricName,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Feature, MultiPolygon } from 'geojson';
import { ReactNode, useCallback, Fragment } from 'react';
import { AspectRatio } from '~/components-styled/aspect-ratio';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { colors } from '~/style/theme';
import { Choropleth } from './choropleth';
import {
  useChartDimensions,
  useChoroplethColorScale,
  useSafetyRegionBoundingbox,
  useSafetyRegionData,
} from './hooks';
import { useChoroplethDataDescription } from './hooks/use-choropleth-data-description';
import { getDataThresholds } from './legenda/utils';
import { HoverPath, Path } from './path';
import { countryGeo, regionGeo } from './topology';

type SafetyRegionChoroplethProps<T, K extends RegionsMetricName> = {
  data: Pick<Regions, K>;
  metricName: K;
  metricProperty: string;
  selectedCode?: string;
  highlightSelection?: boolean;
  onSelect?: (context: SafetyRegionProperties) => void;
  tooltipContent?: (context: SafetyRegionProperties & T) => ReactNode;
  highlightCode?: string;
};

/**
 * This component renders a map of the Netherlands with the outlines of all the
 * safety regions which receive a fill color based on the specified Region
 * metric data.
 *
 * The metricName plus the metricProperty together specify which value is
 * visualized. The color scale is calculated using the specified metric and the
 * given gradient.
 *
 * When a selected region code is specified, the map will zoom in on the safety
 * region.
 *
 * @param props
 */
export function SafetyRegionChoropleth<T, K extends RegionsMetricName>(
  props: SafetyRegionChoroplethProps<T, K>
) {
  const {
    data,
    selectedCode,
    metricName,
    metricProperty,
    onSelect,
    tooltipContent,
    highlightCode,
    highlightSelection,
  } = props;

  const ratio = 1.2;
  const [ref, dimensions] = useChartDimensions<HTMLDivElement>(ratio);

  const boundingBox = useSafetyRegionBoundingbox(regionGeo, selectedCode);

  const isEscalationLevelTheme = metricName === 'escalation_levels';

  const { getChoroplethValue, hasData, values } = useSafetyRegionData(
    regionGeo,
    metricName,
    metricProperty,
    data
  );

  const selectedThreshold = getDataThresholds(
    regionThresholds,
    metricName,
    metricProperty
  );

  const dataDescription = useChoroplethDataDescription(
    selectedThreshold,
    values,
    metricName,
    metricProperty,
    'vr'
  );

  const getFillColor = useChoroplethColorScale(
    getChoroplethValue,
    selectedThreshold
  );

  const renderFeature = useCallback(
    (feature: Feature<MultiPolygon, SafetyRegionProperties>, path: string) => {
      const { vrcode } = feature.properties;
      const fill = (hasData && getFillColor(vrcode)) || 'white';
      /**
       * @TODO this should actually be some kind of function returning
       * the "brightness" of a given color.
       */
      const isWhiteFill = ['#fff', '#ffffff', 'white'].includes(fill);

      return (
        <Path
          key={vrcode}
          pathData={path}
          fill={fill}
          stroke={isWhiteFill ? colors.silver : '#fff'}
          strokeWidth={1}
        />
      );
    },
    [getFillColor, hasData]
  );

  const renderHighlight = useCallback(
    (feature: Feature<MultiPolygon, SafetyRegionProperties>, path: string) => {
      const { vrcode } = feature.properties;

      if (highlightCode !== vrcode) return;

      return (
        <Fragment key={vrcode}>
          <Path pathData={path} stroke="#fff" strokeWidth={8} />
          <Path pathData={path} stroke="#000" strokeWidth={2} />
        </Fragment>
      );
    },
    [highlightCode]
  );

  const hasSelectHander = !!onSelect;

  const renderHover = useCallback(
    (feature: Feature<MultiPolygon, SafetyRegionProperties>, path: string) => {
      const { vrcode } = feature.properties;

      const isSelected = vrcode === selectedCode && highlightSelection;

      return (
        <HoverPath
          isClickable={hasSelectHander}
          id={vrcode}
          key={vrcode}
          pathData={path}
          stroke={isEscalationLevelTheme || isSelected ? '#fff' : undefined}
          strokeWidth={isEscalationLevelTheme || isSelected ? 3 : undefined}
          isSelected={isSelected}
        />
      );
    },
    [hasSelectHander, isEscalationLevelTheme, selectedCode, highlightSelection]
  );

  const onClick = (id: string) => {
    if (onSelect) {
      const data = getChoroplethValue(id);
      onSelect(data);
    }
  };

  const getTooltipContent = (id: string) => {
    if (tooltipContent) {
      const data = getChoroplethValue(id);
      return tooltipContent(data as any);
    }
    return null;
  };

  return (
    <div ref={ref} css={css({ position: 'relative', bg: 'transparent' })}>
      <AspectRatio ratio={1 / ratio}>
        <Choropleth
          description={dataDescription}
          featureCollection={regionGeo}
          hovers={hasData ? regionGeo : undefined}
          boundingBox={boundingBox || countryGeo}
          dimensions={dimensions}
          renderFeature={renderFeature}
          renderHover={renderHover}
          onPathClick={onClick}
          getTooltipContent={getTooltipContent}
          renderHighlight={renderHighlight}
        />
      </AspectRatio>
    </div>
  );
}
