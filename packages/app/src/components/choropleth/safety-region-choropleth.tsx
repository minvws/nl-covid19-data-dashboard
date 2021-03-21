import {
  Regions,
  RegionsMetricName,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Feature, MultiPolygon } from 'geojson';
import { Fragment, ReactNode, useCallback } from 'react';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { Choropleth } from './choropleth';
import {
  useChoroplethColorScale,
  useSafetyRegionBoundingbox,
  useSafetyRegionData,
  useTabInteractiveButton,
} from './hooks';
import { useChoroplethDataDescription } from './hooks/use-choropleth-data-description';
import { getDataThresholds } from './legenda/utils';
import { HoverPathLink, Path } from './path';
import { countryGeo, regionGeo } from './topology';

type SafetyRegionChoroplethProps<T, K extends RegionsMetricName> = {
  data: Pick<Regions, K>;
  metricName: K;
  metricProperty: string;
  selectedCode?: string;
  highlightSelection?: boolean;
  tooltipContent?: (context: SafetyRegionProperties & T) => ReactNode;
  highlightCode?: string;
  getLink: (code: string) => string;
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
 */
export function SafetyRegionChoropleth<T, K extends RegionsMetricName>(
  props: SafetyRegionChoroplethProps<T, K>
) {
  const {
    data,
    selectedCode,
    metricName,
    metricProperty,
    tooltipContent,
    highlightCode,
    highlightSelection,
    getLink,
  } = props;

  const { siteText } = useIntl();

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

  const {
    isTabInteractive,
    tabInteractiveButton,
    anchorEventHandlers,
  } = useTabInteractiveButton(
    replaceVariablesInText(siteText.choropleth.a11y.tab_navigatie_button, {
      subject: siteText.choropleth.vr.plural,
    })
  );

  const renderHover = useCallback(
    (feature: Feature<MultiPolygon, SafetyRegionProperties>, path: string) => {
      const { vrcode, vrname } = feature.properties;

      const isSelected = vrcode === selectedCode && highlightSelection;

      return (
        <HoverPathLink
          href={getLink(vrcode)}
          title={vrname}
          isTabInteractive={isTabInteractive}
          id={vrcode}
          pathData={path}
          stroke={isEscalationLevelTheme || isSelected ? '#fff' : undefined}
          strokeWidth={isEscalationLevelTheme || isSelected ? 3 : undefined}
          isSelected={isSelected}
          {...anchorEventHandlers}
        />
      );
    },
    [
      selectedCode,
      highlightSelection,
      getLink,
      isTabInteractive,
      isEscalationLevelTheme,
      anchorEventHandlers,
    ]
  );

  const getTooltipContent = (id: string) => {
    if (tooltipContent) {
      const data = getChoroplethValue(id);
      return tooltipContent(data as any);
    }
    return null;
  };

  return (
    <div css={css({ position: 'relative', bg: 'transparent' })}>
      {tabInteractiveButton}
      <Choropleth
        description={dataDescription}
        featureCollection={regionGeo}
        hovers={hasData ? regionGeo : undefined}
        boundingBox={boundingBox || countryGeo}
        renderFeature={renderFeature}
        renderHover={renderHover}
        getTooltipContent={getTooltipContent}
        renderHighlight={renderHighlight}
        showTooltipOnFocus={isTabInteractive}
      />
    </div>
  );
}
