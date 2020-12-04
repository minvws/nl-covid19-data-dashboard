import css from '@styled-system/css';
import { Feature, MultiPolygon } from 'geojson';
import { ReactNode } from 'react';
import { AspectRatio } from '~/components-styled/aspect-ratio';
import { Choropleth } from './choropleth';
import { useChartDimensions, useMunicipalityNavigationData } from './hooks';
import { Path } from './path';
import { MunicipalityProperties } from './shared';
import { countryGeo, municipalGeo } from './topology';

type MunicipalityNavigationMapProps<T> = {
  onSelect?: (context: MunicipalityProperties) => void;
  tooltipContent?: (
    context: MunicipalityProperties & { value: T }
  ) => ReactNode;
};

/**
 * This component renders a map of the Netherlands with the outlines of all the
 * municipalities but contains no data. It can be used for navigating at GM
 * index page.
 */
export function MunicipalityNavigationMap<T>(
  props: MunicipalityNavigationMapProps<T>
) {
  const { onSelect, tooltipContent } = props;

  const ratio = 1.2;
  const [ref, dimensions] = useChartDimensions<HTMLDivElement>(ratio);

  const { getChoroplethValue } = useMunicipalityNavigationData(municipalGeo);

  const featureCallback = (
    feature: Feature<MultiPolygon, MunicipalityProperties>,
    path: string,
    _index: number
  ) => {
    const { gemcode } = feature.properties;

    return (
      <Path
        key={gemcode}
        id={gemcode}
        d={path}
        fill={'#fff'}
        stroke={'#01689b'}
        strokeWidth={0.5}
      />
    );
  };

  const hoverCallback = (
    feature: Feature<MultiPolygon, MunicipalityProperties>,
    path: string
  ) => {
    const { gemcode } = feature.properties;

    return (
      <Path
        hoverable
        id={gemcode}
        key={gemcode}
        d={path}
        stroke={'#01689b'}
        fill={'#01689b'}
      />
    );
  };

  const onClick = (id: string) => {
    if (onSelect) {
      const data = getChoroplethValue(id);
      onSelect(data as any);
    }
  };

  const getTooltipContent = (id: string) => {
    if (tooltipContent) {
      const data = getChoroplethValue(id);
      return tooltipContent(data as any);
    }
    return null;
  };

  return (
    <div ref={ref} css={css({ bg: 'transparent', position: 'relative' })}>
      <AspectRatio ratio={1 / ratio}>
        <Choropleth
          featureCollection={municipalGeo}
          hovers={municipalGeo}
          boundingBox={countryGeo}
          dimensions={dimensions}
          featureCallback={featureCallback}
          hoverCallback={hoverCallback}
          onPathClick={onClick}
          getTooltipContent={getTooltipContent}
        />
      </AspectRatio>
    </div>
  );
}
