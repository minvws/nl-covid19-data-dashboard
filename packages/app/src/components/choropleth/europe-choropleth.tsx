import css from '@styled-system/css';
import { Feature, MultiPolygon } from 'geojson';
import { useCallback } from 'react';
import { colors } from '~/style/theme';
import { InlineText } from '../typography';
import { Choropleth } from './choropleth';
import { HoverPathLink, Path } from './path';
import { europeGeo, EuropeGeoJSON, EuropeGeoProperties } from './topology';

const focusEuropeCodes = ['ISL', 'NOR', 'AZE', 'ESP'];
const focusEurope: EuropeGeoJSON = {
  ...europeGeo,
  features: europeGeo.features.filter((x) =>
    focusEuropeCodes.includes(x.properties.ISO_A3)
  ),
};

/**
 * @TODO clean up; debug code
 */
function pickRandomColor() {
  const colorValues = Object.values(colors.data.multiseries);
  const randomColorIndex = Math.floor(Math.random() * colorValues.length);
  return colorValues[randomColorIndex];
}

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
export function EuropeChoropleth() {
  const renderFeature = useCallback(
    (feature: Feature<MultiPolygon, EuropeGeoProperties>, path: string) => {
      return (
        <Path
          key={path}
          pathData={path}
          fill={pickRandomColor()}
          stroke={colors.silver}
          strokeWidth={0.5}
        />
      );
    },
    []
  );

  const renderHover = useCallback(
    (feature: Feature<MultiPolygon, EuropeGeoProperties>, path: string) => {
      let { ISO_A3 } = feature.properties;
      ISO_A3 ??= 'N/A';

      return (
        <HoverPathLink
          isTabInteractive={false}
          key={ISO_A3}
          title={ISO_A3}
          id={ISO_A3}
          pathData={path}
          onFocus={() => undefined}
          onBlur={() => undefined}
        />
      );
    },
    []
  );

  return (
    <div
      css={css({
        bg: 'transparent',
        position: 'relative',
        height: '100%',
        border: '1px solid hotpink',
      })}
    >
      <Choropleth
        initialWidth={862}
        minHeight={514}
        description={'dataDescription'}
        featureCollection={europeGeo}
        hovers={europeGeo}
        boundingBox={focusEurope}
        renderFeature={renderFeature}
        getTooltipContent={(id: string) => <InlineText p={2}>{id}</InlineText>}
        renderHover={renderHover}
      />
    </div>
  );
}
