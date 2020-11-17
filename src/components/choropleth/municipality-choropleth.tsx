import css from '@styled-system/css';
import { Feature, GeoJsonProperties, MultiPolygon } from 'geojson';
import { ReactNode, useCallback } from 'react';
import { Choropleth } from './choropleth';
import {
  useChartDimensions,
  useChoroplethColorScale,
  useMunicipalityBoundingbox,
  useMunicipalityData,
  useRegionMunicipalities,
} from './hooks';
import { municipalThresholds } from './municipal-thresholds';
import { Path } from './path';
import {
  MunicipalityProperties,
  SafetyRegionProperties,
  TMunicipalityMetricName,
} from './shared';
import { countryGeo, municipalGeo, regionGeo } from './topology';

export type TProps = {
  metricName?: TMunicipalityMetricName;
  selected?: string;
  highlightSelection?: boolean;
  onSelect?: (context: MunicipalityProperties) => void;
  tooltipContent?: (context: MunicipalityProperties) => ReactNode;
  isSelectorMap?: boolean;
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
 * As an overlay the safety region and country outlines are shown.
 *
 * @param props
 */
export function MunicipalityChoropleth(props: TProps) {
  const {
    selected,
    metricName,
    onSelect,
    tooltipContent,
    highlightSelection = true,
    isSelectorMap,
  } = props;

  const [ref, dimensions] = useChartDimensions<HTMLDivElement>(1.2);

  const [boundingbox, selectedVrCode] = useMunicipalityBoundingbox(
    regionGeo,
    selected
  );

  const [getData, hasData] = useMunicipalityData(metricName, municipalGeo);

  const safetyRegionMunicipalCodes = useRegionMunicipalities(selected);

  const thresholdValues = metricName
    ? municipalThresholds[metricName]
    : undefined;

  const getFillColor = useChoroplethColorScale(
    getData,
    thresholdValues?.thresholds
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
          stroke={isSelectorMap ? '#01689b' : selected ? '#fff' : '#c4c4c4'}
          strokeWidth={0.5}
        />
      );
    },
    [getFillColor, hasData, safetyRegionMunicipalCodes, selected, isSelectorMap]
  );

  const overlayCallback = useCallback(
    (
      feature: Feature<
        MultiPolygon,
        SafetyRegionProperties | GeoJsonProperties
      >,
      path: string,
      _index: number
    ) => {
      const { vrcode } = feature.properties as SafetyRegionProperties;
      return (
        <Path
          key={vrcode}
          d={path}
          fill="none"
          stroke={
            hasData && vrcode !== selectedVrCode ? '#c4c4c4' : 'transparent'
          }
          strokeWidth={0.5}
        />
      );
    },
    [selectedVrCode, hasData]
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
          stroke={isSelectorMap ? '#01689b' : isSelected ? '#000' : undefined}
          strokeWidth={isSelected ? 3 : undefined}
          fill={isSelectorMap ? '#01689b' : undefined}
        />
      );
    },
    [
      selected,
      highlightSelection,
      safetyRegionMunicipalCodes,
      hasData,
      isSelectorMap,
    ]
  );

  const onClick = (id: string) => {
    if (onSelect) {
      const data = getData(id);
      onSelect(data as any);
    }
  };

  const getTooltipContent = (id: string) => {
    if (tooltipContent) {
      const data = getData(id);
      return tooltipContent(data as any);
    }
    return null;
  };

  return (
    <div ref={ref} css={css({ bg: 'transparent', position: 'relative' })}>
      <Choropleth
        featureCollection={municipalGeo}
        overlays={overlays}
        hovers={hasData || isSelectorMap ? municipalGeo : undefined}
        boundingBox={boundingbox || countryGeo}
        dimensions={dimensions}
        featureCallback={featureCallback}
        overlayCallback={overlayCallback}
        hoverCallback={hoverCallback}
        onPathClick={onClick}
        getTooltipContent={getTooltipContent}
      />
    </div>
  );
}

const overlays = {
  ...countryGeo,
  features: countryGeo.features.concat(regionGeo.features),
};
