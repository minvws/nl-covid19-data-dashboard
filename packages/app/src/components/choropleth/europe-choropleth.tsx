import { KeysOfType } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Feature, MultiPolygon } from 'geojson';
import { ReactNode, useCallback } from 'react';
import { isDefined } from 'ts-is-present';
import { colors } from '~/style/theme';
import { Choropleth } from './choropleth';
import { useIntlChoroplethColorScale } from './hooks';
import { HoverPathLink, Path } from './path';
import { ChoroplethTooltipPlacement } from './tooltips/tooltip-container';
import { europeGeo, EuropeGeoJSON, EuropeGeoProperties } from './topology';

/**
 * Clean up the following lists of country codes and creation of `actuallyEurope`.
 * Thing is that `europeGeo` includes more than only europe (northern part of
 * Africa, western part of Asia) in order to display outlines of neighboring
 * countries. This can all be cleaned up and is currently hacked together for
 * demo/mvp purposes.
 */
const nonEurope = [
  'MAR',
  'DZA',
  'TUN',
  'LBY',
  'EGY',
  'SAU',
  'IRN',
  'IRQ',
  'JOR',
  'ISR',
  'PSE',
  'LBN',
  'RUS',
  'GEO',
  'AZE',
  'ARM',
  'TUR',
  'SYR',
  '-99',
];

/**
 * List of countries to define the boundingbox
 */
const focusEuropeCodes = ['ISL', 'NOR', 'AZE', 'ESP', 'GRC'];

const actuallyEurope: EuropeGeoJSON = {
  ...europeGeo,
  features: europeGeo.features.filter(
    (x) => !nonEurope.includes(x.properties.ISO_A3)
  ),
};
const focusEurope: EuropeGeoJSON = {
  ...europeGeo,
  features: europeGeo.features.filter((x) =>
    focusEuropeCodes.includes(x.properties.ISO_A3)
  ),
};

type EuropeChoroplethProps<T extends Record<string, unknown>> = {
  data: T[];
  metricProperty: KeysOfType<T, number, true>;
  joinProperty: KeysOfType<T, string, true>;
  tooltipContent?: (context: T) => ReactNode;
  tooltipPlacement?: ChoroplethTooltipPlacement;
  getLink: (code: string) => string;
};

export function EuropeChoropleth<T extends Record<string, unknown>>(
  props: EuropeChoroplethProps<T>
) {
  const { data, joinProperty, metricProperty, tooltipContent } = props;

  const getJoinedItem = useCallback(
    (joinId: string) => {
      return data.find((x) => x[joinProperty] === joinId);
    },
    [data, joinProperty]
  );

  const getFillColor = useIntlChoroplethColorScale(metricProperty);

  const renderFeature = useCallback(
    (
      feature: Feature<MultiPolygon, EuropeGeoProperties>,
      path: string,
      index: number
    ) => {
      const { ISO_A3 } = feature.properties;
      const item = getJoinedItem(ISO_A3);

      return !isDefined(item) ? (
        <Path
          key={`${ISO_A3}_${index}`}
          pathData={path}
          stroke={colors.silver}
          strokeWidth={0.5}
        />
      ) : (
        <Path
          key={`${ISO_A3}_${index}`}
          pathData={path}
          fill={getFillColor(item[metricProperty])}
          stroke={'white'}
          strokeWidth={0.5}
        />
      );
    },
    [getJoinedItem, metricProperty, getFillColor]
  );

  const renderHover = useCallback(
    (
      feature: Feature<MultiPolygon, EuropeGeoProperties>,
      path: string,
      index: number
    ) => {
      const { ISO_A3 } = feature.properties;

      const item = getJoinedItem(ISO_A3);

      return isDefined(item) ? (
        <HoverPathLink
          isTabInteractive={false}
          key={`${ISO_A3}_${index}`}
          title={ISO_A3}
          id={ISO_A3}
          pathData={path}
          onFocus={() => undefined}
          onBlur={() => undefined}
        />
      ) : null;
    },
    [getJoinedItem]
  );

  const getTooltipContent = useCallback(
    (joinId: string) => {
      if (tooltipContent) {
        const data = getJoinedItem(joinId);
        return data ? tooltipContent(data) : null;
      }
      return null;
    },
    [tooltipContent, getJoinedItem]
  );

  return (
    <div
      css={css({
        bg: 'transparent',
        position: 'relative',
        height: '100%',
        border: '1px solid silver',
      })}
    >
      <Choropleth
        initialWidth={862}
        minHeight={514}
        description={'dataDescription'}
        featureCollection={europeGeo}
        hovers={actuallyEurope}
        boundingBox={focusEurope}
        renderFeature={renderFeature}
        renderHover={renderHover}
        getTooltipContent={getTooltipContent}
      />
    </div>
  );
}
