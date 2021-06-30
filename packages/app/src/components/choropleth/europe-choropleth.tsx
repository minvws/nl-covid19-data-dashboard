import { KeysOfType } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Feature, MultiPolygon } from 'geojson';
import { ReactNode, useCallback, useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { Box } from '../base';
import { Choropleth } from './choropleth';
import { useIntlChoroplethColorScale, useTabInteractiveButton } from './hooks';
import { HoverPathLink, Path } from './path';
import { ChoroplethTooltipPlacement } from './tooltips/tooltip-container';
import { europeGeo, EuropeGeoJSON, EuropeGeoProperties } from './topology';

/**
 * List of countries to define the boundingbox
 */
const boundingBoxCodes = ['ISL', 'NOR', 'AZE', 'ESP', 'GRC'];

const boundingBoxEurope: EuropeGeoJSON = {
  ...europeGeo,
  features: europeGeo.features.filter((x) =>
    boundingBoxCodes.includes(x.properties.ISO_A3)
  ),
};

type EuropeChoroplethProps<T> = {
  data: T[];
  metricProperty: KeysOfType<T, number, true>;
  joinProperty: KeysOfType<T, string, true>;
  tooltipContent?: (context: T) => ReactNode;
  tooltipPlacement?: ChoroplethTooltipPlacement;
  getLink?: (code: string) => string;
};

export function EuropeChoropleth<T>(props: EuropeChoroplethProps<T>) {
  const { data, joinProperty, metricProperty, tooltipContent } = props;
  const { siteText } = useIntl();

  const codes = data.map<string>((x) => x[joinProperty]);
  const countriesWithData: EuropeGeoJSON = useMemo(() => {
    return {
      ...europeGeo,
      features: europeGeo.features.filter((x) =>
        codes.includes(x.properties.ISO_A3)
      ),
    };
  }, [codes]);

  const getJoinedDataItem = useCallback(
    (joinId: string) => {
      return data.find((x) => x[joinProperty] === joinId);
    },
    [data, joinProperty]
  );

  const getFillColor = useIntlChoroplethColorScale(metricProperty as string);

  const { isTabInteractive, tabInteractiveButton, anchorEventHandlers } =
    useTabInteractiveButton(
      replaceVariablesInText(siteText.choropleth.a11y.tab_navigatie_button, {
        subject: 'landen',
      })
    );

  const { ref, width } = useResizeObserver<HTMLDivElement>();

  const { mapHeight, padding } = useHeightAndPadding(width);

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
    [getJoinedDataItem, isTabInteractive, anchorEventHandlers]
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
    <Box position="relative">
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
          accessibility={{ key: 'behavior_choropleths' }}
          initialWidth={1.1 * mapHeight}
          minHeight={mapHeight}
          featureCollection={europeGeo}
          hovers={countriesWithData}
          boundingBox={boundingBoxEurope}
          boudingBoxPadding={{ top: padding, bottom: padding }}
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
      return { mapHeight: 500, padding: 20 };
    }
    if (containerWidth >= 400) {
      return { mapHeight: 400, padding: 15 };
    }
    if (containerWidth >= 300) {
      return { mapHeight: 300, padding: 5 };
    }
    return { mapHeight: 250, padding: 0 };
  }, [containerWidth]);
}
