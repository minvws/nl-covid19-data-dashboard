import { KeysOfType } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Feature, MultiPolygon } from 'geojson';
import { ReactNode, useCallback } from 'react';
import { isDefined } from 'ts-is-present';
import { InternationalListType } from '~/domain/internationaal/types';
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

type EuropeChoroplethProps<T extends InternationalListType> = {
  data: T[];
  metricProperty: KeysOfType<T, number, true>;
  joinProperty: KeysOfType<T, string, true>;
  tooltipContent?: (context: T) => ReactNode;
  tooltipPlacement?: ChoroplethTooltipPlacement;
  getLink?: (code: string) => string;
};

export function EuropeChoropleth<T extends InternationalListType>(
  props: EuropeChoroplethProps<T>
) {
  const { data, joinProperty, metricProperty, tooltipContent } = props;

  const getJoinedDataItem = useCallback(
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
      const key = `${ISO_A3}_${index}`;
      const item = getJoinedDataItem(ISO_A3);

      return !isDefined(item) ? (
        <Path
          key={key}
          pathData={path}
          stroke={colors.silver}
          strokeWidth={0.5}
        />
      ) : (
        <Path
          key={key}
          pathData={path}
          fill={getFillColor(item[metricProperty])}
          stroke={'white'}
          strokeWidth={0.5}
        />
      );
    },
    [getJoinedDataItem, metricProperty, getFillColor]
  );

  const renderHover = useCallback(
    (
      feature: Feature<MultiPolygon, EuropeGeoProperties>,
      path: string,
      index: number
    ) => {
      const { ISO_A3 } = feature.properties;

      const item = getJoinedDataItem(ISO_A3);

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
    [getJoinedDataItem]
  );

  const getTooltipContent = useCallback(
    (joinId: string) => {
      if (tooltipContent) {
        const data = getJoinedDataItem(joinId);
        return data ? tooltipContent(data) : null;
      }
      return null;
    },
    [tooltipContent, getJoinedDataItem]
  );

  return (
    <div
      css={css({
        bg: 'transparent',
        position: 'relative',
        height: '100%',
        border: '1px solid',
        borderColor: 'silver',
      })}
    >
      <Choropleth
        accessibility={{ key: 'behavior_choropleths' }}
        minHeight={600}
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
