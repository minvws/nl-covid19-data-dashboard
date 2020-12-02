import css from '@styled-system/css';
import { Feature, MultiPolygon } from 'geojson';
import { ReactNode, useCallback } from 'react';
import { Choropleth } from './choropleth';
import {
  useChartDimensions,
  useChoroplethColorScale,
  useMunicipalityBoundingbox,
  useMunicipalityData,
  useRegionMunicipalities,
} from './hooks';
import { getDataThresholds } from './legenda/utils';
import { municipalThresholds } from './municipal-thresholds';
import { Path } from './path';
import { MunicipalityProperties, TMunicipalityMetricName } from './shared';
import { countryGeo, municipalGeo, regionGeo } from './topology';

type MunicipalityChoroplethProps<T> = {
  metricName: TMunicipalityMetricName;
  metricProperty: string;
  selected?: string;
  highlightSelection?: boolean;
  onSelect?: (context: MunicipalityProperties) => void;
  tooltipContent?: (context: MunicipalityProperties & T) => ReactNode;
};

/**
 * This component renders a map of the Netherlands with the outlines of all the municipalities which
 * receive a fill color based on the specified Municipality metric data.
 *
 * The metricName specifies which exact metric is visualized. The color scale is calculated using
 * the specified metric and the given gradient.
 *
 * When a selected municipal code is specified, the map will zoom in on the safety region to which
 * the associated municipality belongs and all surrounding features will be rendered in a faded manner.
 *
 * @param props
 */
export function MunicipalityChoropleth<T>(
  props: MunicipalityChoroplethProps<T>
) {
  const {
    selected,
    metricName,
    metricProperty,
    onSelect,
    tooltipContent,
    highlightSelection = true,
  } = props;

  const [ref, dimensions] = useChartDimensions<HTMLDivElement>(1.2);

  const [boundingbox] = useMunicipalityBoundingbox(regionGeo, selected);

  const { getChoroplethValue, hasData } = useMunicipalityData(
    municipalGeo,
    metricName,
    metricProperty
  );

  const safetyRegionMunicipalCodes = useRegionMunicipalities(selected);

  const thresholdValues = getDataThresholds(
    municipalThresholds,
    metricName,
    metricProperty
  );

  const getFillColor = useChoroplethColorScale(
    getChoroplethValue,
    thresholdValues
  );

  const featureCallback = useCallback(
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
          id={gemcode}
          d={path}
          fill={hasData && fill ? fill : '#fff'}
          stroke={
            selected
              ? /**
                 * If `selected` eq true, the map is zoomed in on a VR. Render
                 * white strokes when we're rendering a municipality inside this
                 * VR. Outside municipalities will have gray strokes.
                 */
                isInSameRegion
                ? '#fff'
                : '#c4c4c4'
              : '#fff'
          }
          strokeWidth={0.5}
        />
      );
    },
    [getFillColor, hasData, safetyRegionMunicipalCodes, selected]
  );

  const hoverCallback = useCallback(
    (feature: Feature<MultiPolygon, MunicipalityProperties>, path: string) => {
      const { gemcode } = feature.properties;
      const isSelected = gemcode === selected && highlightSelection;
      const isInSameRegion =
        safetyRegionMunicipalCodes?.includes(gemcode) ?? true;

      if (hasData && selected && !isInSameRegion) {
        return null;
      }

      return (
        <Path
          hoverable
          id={gemcode}
          key={gemcode}
          d={path}
          stroke={isSelected ? '#000' : undefined}
          strokeWidth={isSelected ? 3 : undefined}
        />
      );
    },
    [selected, highlightSelection, safetyRegionMunicipalCodes, hasData]
  );

  const onClick = (id: string) => {
    if (onSelect) {
      const data = getChoroplethValue(id);
      onSelect(data);
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
      <Choropleth
        featureCollection={municipalGeo}
        hovers={hasData ? municipalGeo : undefined}
        boundingBox={boundingbox || countryGeo}
        dimensions={dimensions}
        featureCallback={featureCallback}
        hoverCallback={hoverCallback}
        onPathClick={onClick}
        getTooltipContent={getTooltipContent}
      />
    </div>
  );
}
