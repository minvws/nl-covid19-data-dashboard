import {
  VrCollection,
  VrCollectionMetricName,
  VrProperties,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Feature, MultiPolygon, Polygon } from 'geojson';
import { Fragment, ReactNode, useCallback } from 'react';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import {
  AccessibilityDefinition,
  addAccessibilityFeatures,
} from '~/utils/use-accessibility-annotations';
import { Choropleth } from './choropleth';
import {
  useChoroplethColorScale,
  useTabInteractiveButton,
  useVrBoundingbox,
  useVrData,
} from './hooks';
import { useChoroplethDataDescription } from './hooks/use-choropleth-data-description';
import { getDataThresholds } from './legenda/utils';
import { HoverPathLink, Path } from './path';
import { ChoroplethTooltipPlacement } from './tooltips/tooltip-container';
import { countryGeo, regionGeo } from './topology';

export type VrChoroplethProps<T, K extends VrCollectionMetricName> = {
  data: Pick<VrCollection, K>;
  metricName: K;
  metricProperty: string;
  /**
   * The mandatory AccessibilityDefinition provides a reference to annotate the
   * graph with a label and description.
   */
  accessibility: AccessibilityDefinition;
  selectedCode?: string;
  highlightSelection?: boolean;
  tooltipContent?: (context: VrProperties & T) => ReactNode;
  tooltipPlacement?: ChoroplethTooltipPlacement;
  highlightCode?: string;
  getLink?: (code: string) => string;
  minHeight?: number;
  noDataFillColor?: string;
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
export function VrChoropleth<T, K extends VrCollectionMetricName>(
  props: VrChoroplethProps<T, K>
) {
  const {
    accessibility,
    data,
    selectedCode,
    metricName,
    metricProperty,
    tooltipContent,
    tooltipPlacement,
    highlightCode,
    highlightSelection,
    getLink,
    minHeight,
    noDataFillColor,
  } = props;

  const { siteText } = useIntl();

  const boundingBox = useVrBoundingbox(regionGeo, selectedCode);

  const isEscalationLevelTheme = metricName === 'escalation_levels';

  const { getChoroplethValue, hasData, values } = useVrData(
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
    selectedThreshold,
    noDataFillColor
  );

  const renderFeature = useCallback(
    (feature: Feature<MultiPolygon | Polygon, VrProperties>, path: string) => {
      const { vrcode } = feature.properties;
      const fill =
        ((hasData && getFillColor(vrcode)) || noDataFillColor) ?? 'white';
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
          strokeWidth={0.5}
        />
      );
    },
    [getFillColor, hasData, noDataFillColor]
  );

  const renderHighlight = useCallback(
    (feature: Feature<MultiPolygon | Polygon, VrProperties>, path: string) => {
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

  const { isTabInteractive, tabInteractiveButton, anchorEventHandlers } =
    useTabInteractiveButton(
      replaceVariablesInText(siteText.choropleth.a11y.tab_navigatie_button, {
        subject: siteText.choropleth.vr.plural,
      })
    );

  const renderHover = useCallback(
    (feature: Feature<MultiPolygon | Polygon, VrProperties>, path: string) => {
      const { vrcode, vrname } = feature.properties;

      const isSelected = vrcode === selectedCode && highlightSelection;

      return (
        <HoverPathLink
          href={getLink ? getLink(vrcode) : undefined}
          title={vrname}
          isTabInteractive={isTabInteractive}
          id={vrcode}
          pathData={path}
          stroke={isEscalationLevelTheme || isSelected ? '#fff' : undefined}
          strokeWidth={isEscalationLevelTheme || isSelected ? 3 : undefined}
          isSelected={isSelected}
          key={vrcode}
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

  const choroplethAccessibility = addAccessibilityFeatures(accessibility, [
    'keyboard_choropleth',
  ]);

  return (
    <div css={css({ bg: 'transparent', position: 'relative', height: '100%' })}>
      {tabInteractiveButton}
      <Choropleth
        accessibility={choroplethAccessibility}
        minHeight={minHeight}
        description={dataDescription}
        featureCollection={regionGeo}
        outlines={countryGeo}
        hovers={hasData ? regionGeo : undefined}
        boundingBox={boundingBox || countryGeo}
        renderFeature={renderFeature}
        renderHover={renderHover}
        getTooltipContent={getTooltipContent}
        tooltipPlacement={tooltipPlacement}
        renderHighlight={renderHighlight}
        showTooltipOnFocus={isTabInteractive}
      />
    </div>
  );
}
