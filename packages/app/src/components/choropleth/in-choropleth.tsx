import {
  InGeoJSON,
  InGeoProperties,
  KeysOfType,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { geoConicConformal } from 'd3-geo';
import { Feature, MultiPolygon, Polygon } from 'geojson';
import { ReactNode, useCallback, useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components/base';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import {
  AccessibilityDefinition,
  addAccessibilityFeatures,
} from '~/utils/use-accessibility-annotations';
import { useResizeObserver } from '~/utils/use-resize-observer';
import {
  Choropleth,
  CHOROPLETH_ASPECT_RATIO,
  HoverPathLink,
  Path,
} from './components';
import {
  inGeo,
  useInChoroplethColorScale,
  useTabInteractiveButton,
} from './logic';
import { ChoroplethTooltipPlacement } from './tooltips/tooltip';

/**
 * List of countries to define the boundingbox. These are countries on the outer edges
 * of the group of countries that are shown.
 */
const boundingBoxCodes = ['ISL', 'NOR', 'ESP', 'GRC', 'CYP'];

const boundingBoxEurope: InGeoJSON = {
  ...inGeo,
  features: inGeo.features.filter((x) =>
    boundingBoxCodes.includes(x.properties.ISO_A3)
  ),
};

type CountryDataItem = { country_code: string };

type InChoroplethProps<T extends CountryDataItem> = {
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

export function InChoropleth<T extends CountryDataItem>(
  props: InChoroplethProps<T>
) {
  const { data, metricProperty, tooltipContent, accessibility } = props;
  const { siteText } = useIntl();

  const codes = data.map((x) => x.country_code);
  const countriesGeoWithData: InGeoJSON = useMemo(() => {
    return {
      ...inGeo,
      features: inGeo.features.filter((x) =>
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

  const [ref, { width }] = useResizeObserver<HTMLDivElement>();

  const { mapHeight, padding } = useHeightAndPadding(width);

  const choroplethAccessibility = addAccessibilityFeatures(accessibility, [
    'keyboard_choropleth',
  ]);

  const renderFeature = useCallback(
    (
      feature: Feature<MultiPolygon | Polygon, InGeoProperties>,
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
      feature: Feature<MultiPolygon | Polygon, InGeoProperties>,
      path: string,
      index: number
    ) => {
      const { ISO_A3 } = feature.properties;

      const item = getCountryDataByCode(ISO_A3);

      return isDefined(item) ? (
        <HoverPathLink
          isTabInteractive={isTabInteractive}
          key={`${ISO_A3}_${index}`}
          title={ISO_A3}
          id={ISO_A3}
          stroke={colors.body}
          strokeWidth={2}
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
          featureCollection={inGeo}
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
