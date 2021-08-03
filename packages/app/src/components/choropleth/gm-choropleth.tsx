import {
  GmCollection,
  GmCollectionMetricName,
  GmGeoProperties,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Feature, MultiPolygon, Polygon } from 'geojson';
import { ReactNode, useCallback, useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components/base';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { DataProps } from '~/types/attributes';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import {
  AccessibilityDefinition,
  addAccessibilityFeatures,
} from '~/utils/use-accessibility-annotations';
import { Choropleth, HoverPathLink, Path } from './components';
import {
  getDataThresholds,
  gmGeo,
  gmThresholds,
  nlGeo,
  useChoroplethColorScale,
  useChoroplethDataDescription,
  useGmCodesByVr,
  useGmData,
  useTabInteractiveButton,
  useVrBoundingBoxByGmCode,
  vrBoundingBoxGmCodes,
  vrGeo,
} from './logic';
import { ChoroplethTooltipPlacement } from './tooltips/tooltip';

type GmChoroplethProps<T, K extends GmCollectionMetricName> = {
  data: Pick<GmCollection, K>;
  /**
   * The mandatory AccessibilityDefinition provides a reference to annotate the
   * graph with a label and description.
   */
  accessibility: AccessibilityDefinition;
  metricName: K;
  metricProperty: string;
  selectedCode?: string;
  highlightSelection?: boolean;
  tooltipContent?: (context: GmGeoProperties & T) => ReactNode;
  tooltipPlacement?: ChoroplethTooltipPlacement;
  getLink: (code: string) => string;
} & DataProps;

/**
 * This component renders a map of the Netherlands with the outlines of all the municipalities which
 * receive a fill color based on the specified Municipality metric data.
 *
 * The metricName plus the metricProperty together specify which value is
 * visualized. The color scale is calculated using the specified metric and the
 * given gradient.
 *
 * When a selected municipal code is specified, the map will zoom in on the safety region to which
 * the associated municipality belongs and all surrounding features will be rendered in a faded manner.
 *
 * @param props
 */
export function GmChoropleth<T, K extends GmCollectionMetricName>(
  props: GmChoroplethProps<T, K>
) {
  const {
    accessibility,
    data,
    selectedCode,
    metricName,
    metricProperty,
    tooltipContent,
    tooltipPlacement,
    highlightSelection = true,
    getLink,
  } = props;

  const { siteText } = useIntl();

  const [boundingbox, vrcode] = useVrBoundingBoxByGmCode(vrGeo, selectedCode);

  const { getChoroplethValue, hasData, values } = useGmData(
    gmGeo,
    metricName,
    metricProperty,
    data
  );

  const vrMunicipalCodes = useGmCodesByVr(selectedCode);

  const filteredMunicipalGeo = useBoundingBoxMunicipalities(vrcode);

  const thresholdValues = getDataThresholds(
    gmThresholds,
    metricName,
    metricProperty
  );

  const dataDescription = useChoroplethDataDescription(
    thresholdValues,
    values,
    metricName,
    metricProperty,
    'gm',
    vrMunicipalCodes
  );

  const getFillColor = useChoroplethColorScale(
    getChoroplethValue,
    thresholdValues
  );

  const renderFeature = useCallback(
    (
      feature: Feature<MultiPolygon | Polygon, GmGeoProperties>,
      path: string,
      _index: number
    ) => {
      const { gemcode } = feature.properties;
      const isInSameRegion = vrMunicipalCodes?.includes(gemcode) ?? true;
      const fill = isInSameRegion ? getFillColor(gemcode) : 'white';

      return (
        <Path
          key={gemcode}
          pathData={path}
          fill={hasData && fill ? fill : '#fff'}
          stroke={
            selectedCode
              ? /**
                 * If `selectedCode` eq true, the map is zoomed in on a VR. Render
                 * white strokes when we're rendering a municipality inside this
                 * VR. Outside municipalities will have gray strokes.
                 */
                isInSameRegion
                ? '#fff'
                : colors.silver
              : '#fff'
          }
          strokeWidth={0.5}
        />
      );
    },
    [getFillColor, hasData, vrMunicipalCodes, selectedCode]
  );

  const { isTabInteractive, tabInteractiveButton, anchorEventHandlers } =
    useTabInteractiveButton(
      replaceVariablesInText(siteText.choropleth.a11y.tab_navigatie_button, {
        subject: siteText.choropleth.gm.plural,
      })
    );

  const renderHover = useCallback(
    (
      feature: Feature<MultiPolygon | Polygon, GmGeoProperties>,
      path: string
    ) => {
      const { gemcode, gemnaam } = feature.properties;
      const isSelected = gemcode === selectedCode && highlightSelection;
      const isInSameRegion = vrMunicipalCodes?.includes(gemcode) ?? true;

      if (hasData && selectedCode && !isInSameRegion) {
        return null;
      }

      return (
        <HoverPathLink
          key={gemcode}
          href={getLink(gemcode)}
          title={gemnaam}
          isTabInteractive={isTabInteractive}
          id={gemcode}
          pathData={path}
          stroke={isSelected ? '#000' : undefined}
          strokeWidth={isSelected ? 3 : undefined}
          isSelected={isSelected}
          {...anchorEventHandlers}
        />
      );
    },
    [
      selectedCode,
      highlightSelection,
      vrMunicipalCodes,
      hasData,
      getLink,
      isTabInteractive,
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
    <Box position="relative" height="100%">
      {tabInteractiveButton}
      <div
        css={css({ bg: 'transparent', position: 'relative', height: '100%' })}
      >
        <Choropleth
          accessibility={choroplethAccessibility}
          description={dataDescription}
          featureCollection={filteredMunicipalGeo}
          outlines={nlGeo}
          hovers={hasData ? filteredMunicipalGeo : undefined}
          boundingBox={boundingbox || nlGeo}
          renderFeature={renderFeature}
          renderHover={renderHover}
          getTooltipContent={getTooltipContent}
          tooltipPlacement={tooltipPlacement}
          showTooltipOnFocus={isTabInteractive}
        />
      </div>
    </Box>
  );
}

/**
 * This hooks picks only the municipalities that are visible within the
 * bounding box of the choropleth map. Resulting in a lot less markup.
 */
function useBoundingBoxMunicipalities(vrcode: string | undefined) {
  return useMemo(() => {
    const viewBoxMunicipalCodes = isDefined(vrcode)
      ? vrBoundingBoxGmCodes[vrcode]
      : undefined;

    return isDefined(viewBoxMunicipalCodes)
      ? {
          ...gmGeo,
          features: gmGeo.features.filter((x) =>
            viewBoxMunicipalCodes.includes(x.properties.gemcode)
          ),
        }
      : gmGeo;
  }, [vrcode]);
}
