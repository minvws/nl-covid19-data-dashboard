import {
  EuropeGeoJSON,
  EuropeGeoProperties,
  KeysOfType,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { geoConicConformal } from 'd3-geo';
import { Feature, MultiPolygon } from 'geojson';
import { ReactNode, useCallback, useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import {
  AccessibilityDefinition,
  addAccessibilityFeatures,
} from '~/utils/use-accessibility-annotations';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { Box } from '../base';
import { Choropleth, CHOROPLETH_ASPECT_RATIO } from './choropleth';
import { useInChoroplethColorScale, useTabInteractiveButton } from './hooks';
import { HoverPathLink, Path } from './path';
import { ChoroplethTooltipPlacement } from './tooltips/tooltip-container';
import { europeGeo } from './topology';

/**
 * List of countries to define the boundingbox. These are countries on the outer edges
 * of the group of countries that are shown.
 */
const boundingBoxCodes = ['ISL', 'NOR', 'ESP', 'GRC', 'CYP'];

const boundingBoxEurope: EuropeGeoJSON = {
  ...europeGeo,
  features: europeGeo.features.filter((x) =>
    boundingBoxCodes.includes(x.properties.ISO_A3)
  ),
};

type CountryDataItem = { country_code: string };

type EuropeChoroplethProps<T extends CountryDataItem> = {
  data: T[];
  /**
   * A number property on the data item that will determine the color of the country in the map
   */
  metricProperty: KeysOfType<T, number, true>;
  tooltipContent?: (context: T) => ReactNode;
  tooltipPlacement?: ChoroplethTooltipPlacement;
  /**
   * Optional link that will be added to each choropleth feature for which an associated data item exists
   */
  getLink?: (code: string) => string;
  accessibility: AccessibilityDefinition;
};

export function EuropeChoropleth<T extends CountryDataItem>(
  props: EuropeChoroplethProps<T>
) {
  const { data, metricProperty, tooltipContent, accessibility } = props;
  const { siteText } = useIntl();

  const codes = data.map((x) => x.country_code);
  const countriesGeoWithData: EuropeGeoJSON = useMemo(() => {
    return {
      ...europeGeo,
      features: europeGeo.features.filter((x) =>
        codes.includes(x.properties.ISO_A3)
      ),
    };
  }, [codes]);

  const getCountryDataByCode = useCallback(
    (countryCode: string) => {
      return data.find((x) => x.country_code === countryCode);
    },
    [data]
  );

  const getFillColor = useInChoroplethColorScale(metricProperty as string);

  const { isTabInteractive, tabInteractiveButton, anchorEventHandlers } =
    useTabInteractiveButton(
      replaceVariablesInText(siteText.choropleth.a11y.tab_navigatie_button, {
        subject: siteText.choropleth.a11y.landen,
      })
    );

  const { ref, width } = useResizeObserver<HTMLDivElement>();

  const { mapHeight, padding } = useHeightAndPadding(width);

  const choroplethAccessibility = addAccessibilityFeatures(accessibility, [
    'keyboard_choropleth',
  ]);

  const renderFeature = useCallback(
    (
      feature: Feature<MultiPolygon, EuropeGeoProperties>,
      path: string,
      index: number
    ) => {
      const { ISO_A3 } = feature.properties;
      const key = `${ISO_A3}_${index}`;
      const item = getCountryDataByCode(ISO_A3);

      return isDefined(item) ? (
        <Path
          key={key}
          pathData={path}
          fill={getFillColor(item[metricProperty])}
          stroke={'white'}
          strokeWidth={0.5}
        />
      ) : (
        <Path
          key={key}
          pathData={path}
          stroke={colors.silver}
          strokeWidth={0.5}
        />
      );
    },
    [getCountryDataByCode, metricProperty, getFillColor]
  );

  const renderHover = useCallback(
    (
      feature: Feature<MultiPolygon, EuropeGeoProperties>,
      path: string,
      index: number
    ) => {
      const { ISO_A3 } = feature.properties;

      const item = getCountryDataByCode(ISO_A3);

      return isDefined(item) ? (
        <HoverPathLink
          isSelected={true}
          isTabInteractive={isTabInteractive}
          key={`${ISO_A3}_${index}`}
          title={ISO_A3}
          id={ISO_A3}
          pathData={path}
          {...anchorEventHandlers}
        />
      ) : null;
    },
    [getCountryDataByCode, isTabInteractive, anchorEventHandlers]
  );

  const getTooltipContent = useCallback(
    (joinId: string) => {
      if (tooltipContent) {
        const data = getCountryDataByCode(joinId);
        return data ? tooltipContent(data) : null;
      }
      return null;
    },
    [tooltipContent, getCountryDataByCode]
  );

  return (
    <Box position="relative" height="100%">
      {tabInteractiveButton}
      <div
        ref={ref}
        css={css({
          bg: 'transparent',
          position: 'relative',
          height: '100%',
          border: '1px solid',
          borderColor: 'silver',
        })}
      >
        <Choropleth
          aspectRatio={CHOROPLETH_ASPECT_RATIO.in}
          projection={geoConicConformal}
          accessibility={choroplethAccessibility}
          initialWidth={1.1 * mapHeight}
          minHeight={mapHeight}
          featureCollection={europeGeo}
          hovers={countriesGeoWithData}
          boundingBox={boundingBoxEurope}
          boudingBoxPadding={padding}
          renderFeature={renderFeature}
          renderHover={renderHover}
          getTooltipContent={getTooltipContent}
          showTooltipOnFocus={isTabInteractive}
        />
      </div>
    </Box>
  );
}

function useHeightAndPadding(containerWidth: number | undefined) {
  return useMemo(() => {
    if (!isDefined(containerWidth) || containerWidth >= 600) {
      return { mapHeight: 650, padding: { top: 20, bottom: 20 } };
    }
    if (containerWidth >= 400) {
      return { mapHeight: 400, padding: { top: 15, bottom: 15 } };
    }
    if (containerWidth >= 300) {
      return { mapHeight: 300, padding: { top: 5, bottom: 5 } };
    }
    return { mapHeight: 250, padding: { left: 20, top: 0, bottom: 0 } };
  }, [containerWidth]);
}
