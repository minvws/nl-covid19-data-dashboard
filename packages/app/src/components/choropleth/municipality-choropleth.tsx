import {
  Municipalities,
  MunicipalitiesMetricName,
  MunicipalityProperties,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Feature, MultiPolygon } from 'geojson';
import { ReactNode, useCallback } from 'react';
import { Box } from '~/components/base';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { DataProps } from '~/types/attributes';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { Choropleth } from './choropleth';
import {
  useChoroplethColorScale,
  useMunicipalityBoundingbox,
  useMunicipalityData,
  useRegionMunicipalities,
  useTabInteractiveButton,
} from './hooks';
import { useChoroplethDataDescription } from './hooks/use-choropleth-data-description';
import { getDataThresholds } from './legenda/utils';
import { municipalThresholds } from './municipal-thresholds';
import { HoverPathLink, Path } from './path';
import { ChoroplethTooltipPlacement } from './tooltips/tooltip-container';
import { countryGeo, municipalGeo, regionGeo } from './topology';

type MunicipalityChoroplethProps<T, K extends MunicipalitiesMetricName> = {
  data: Pick<Municipalities, K>;
  metricName: K;
  metricProperty: string;
  selectedCode?: string;
  highlightSelection?: boolean;
  tooltipContent?: (context: MunicipalityProperties & T) => ReactNode;
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
export function MunicipalityChoropleth<T, K extends MunicipalitiesMetricName>(
  props: MunicipalityChoroplethProps<T, K>
) {
  const {
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

  const [boundingbox] = useMunicipalityBoundingbox(regionGeo, selectedCode);

  const { getChoroplethValue, hasData, values } = useMunicipalityData(
    municipalGeo,
    metricName,
    metricProperty,
    data
  );

  const safetyRegionMunicipalCodes = useRegionMunicipalities(selectedCode);

  const thresholdValues = getDataThresholds(
    municipalThresholds,
    metricName,
    metricProperty
  );

  const dataDescription = useChoroplethDataDescription(
    thresholdValues,
    values,
    metricName,
    metricProperty,
    'gm',
    safetyRegionMunicipalCodes
  );

  const getFillColor = useChoroplethColorScale(
    getChoroplethValue,
    thresholdValues
  );

  const renderFeature = useCallback(
    (
      feature: Feature<MultiPolygon, MunicipalityProperties>,
      path: string,
      _index: number
    ) => {
      const { gemcode } = feature.properties;
      const isInSameRegion =
        safetyRegionMunicipalCodes?.includes(gemcode) ?? true;
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
    [getFillColor, hasData, safetyRegionMunicipalCodes, selectedCode]
  );

  const { isTabInteractive, tabInteractiveButton, anchorEventHandlers } =
    useTabInteractiveButton(
      replaceVariablesInText(siteText.choropleth.a11y.tab_navigatie_button, {
        subject: siteText.choropleth.gm.plural,
      })
    );

  const renderHover = useCallback(
    (feature: Feature<MultiPolygon, MunicipalityProperties>, path: string) => {
      const { gemcode, gemnaam } = feature.properties;
      const isSelected = gemcode === selectedCode && highlightSelection;
      const isInSameRegion =
        safetyRegionMunicipalCodes?.includes(gemcode) ?? true;

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
      safetyRegionMunicipalCodes,
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

  return (
    <Box position="relative">
      {tabInteractiveButton}
      <div
        css={css({ bg: 'transparent', position: 'relative', height: '100%' })}
      >
        <Choropleth
          description={dataDescription}
          featureCollection={municipalGeo}
          hovers={hasData ? municipalGeo : undefined}
          boundingBox={boundingbox || countryGeo}
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
