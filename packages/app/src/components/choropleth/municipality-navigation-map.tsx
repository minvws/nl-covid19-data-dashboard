import { GmProperties } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Feature, MultiPolygon, Polygon } from 'geojson';
import { ReactNode } from 'react';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { Choropleth } from './choropleth';
import {
  useMunicipalityNavigationData,
  useTabInteractiveButton,
} from './hooks';
import { HoverPathLink, Path } from './path';
import { countryGeo, municipalGeo } from './topology';

type MunicipalityNavigationMapProps<T> = {
  onSelect?: (gmcode: string) => void;
  tooltipContent?: (context: GmProperties & { value: T }) => ReactNode;
};

/**
 * This component renders a map of the Netherlands with the outlines of all the
 * municipalities but contains no data. It can be used for navigating at GM
 * index page.
 */

export function MunicipalityNavigationMap<T>(
  props: MunicipalityNavigationMapProps<T>
) {
  const { tooltipContent } = props;

  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();

  const { getChoroplethValue } = useMunicipalityNavigationData(municipalGeo);

  const renderFeature = (
    feature: Feature<MultiPolygon | Polygon, GmProperties>,
    path: string,
    _index: number
  ) => {
    const { gemcode } = feature.properties;

    return (
      <Path
        key={gemcode}
        id={gemcode}
        pathData={path}
        fill={'#fff'}
        stroke={colors.blue}
        strokeWidth={0.5}
      />
    );
  };

  const { isTabInteractive, tabInteractiveButton, anchorEventHandlers } =
    useTabInteractiveButton(
      replaceVariablesInText(siteText.choropleth.a11y.tab_navigatie_button, {
        subject: siteText.choropleth.gm.plural,
      })
    );

  const renderHover = (
    feature: Feature<MultiPolygon | Polygon, GmProperties>,
    path: string
  ) => {
    const { gemcode, gemnaam } = feature.properties;

    return (
      <HoverPathLink
        key={gemcode}
        href={reverseRouter.gm.index(gemcode)}
        title={gemnaam}
        isTabInteractive={isTabInteractive}
        id={gemcode}
        pathData={path}
        stroke={colors.blue}
        fill={colors.blue}
        {...anchorEventHandlers}
      />
    );
  };

  const getTooltipContent = (id: string) => {
    if (tooltipContent) {
      const data = getChoroplethValue(id);
      return tooltipContent(data as any);
    }
    return null;
  };

  return (
    <div css={css({ bg: 'transparent', position: 'relative', width: '100%' })}>
      {tabInteractiveButton}
      <Choropleth
        accessibility={{
          key: 'municipality_navigation_map',
          features: ['keyboard_choropleth'],
        }}
        featureCollection={municipalGeo}
        hovers={municipalGeo}
        boundingBox={countryGeo}
        renderFeature={renderFeature}
        renderHover={renderHover}
        getTooltipContent={getTooltipContent}
        showTooltipOnFocus={isTabInteractive}
      />
    </div>
  );
}
