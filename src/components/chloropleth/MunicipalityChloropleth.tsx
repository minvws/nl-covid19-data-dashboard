import * as topojson from 'topojson-client';
import municipalTopology from './municipalities.topo.json';
import countryTopology from './netherlands.topo.json';
import regionTopology from './safetyregions.topo.json';

import {
  MunicipalGeoJOSN,
  RegionGeoJOSN,
  TMunicipalityMetricName,
} from './shared';

import Chloropleth from './Chloropleth';
import { Feature, FeatureCollection, MultiPolygon } from 'geojson';
import useChartDimensions from './hooks/useChartDimensions';

import styles from './chloropleth.module.scss';
import { CSSProperties, ReactNode, useCallback } from 'react';
import { Municipalities } from 'types/data';
import useMunicipalityData from './hooks/useMunicipalityData';
import useChloroplethColor from './hooks/useChloroplethColor';
import useBoundingbox from './hooks/useBoundingbox';
import { MunicipalityProperties } from './shared';
import useRegionMunicipalities from './hooks/useRegionMunicipalities';

export type TProps<
  T extends TMunicipalityMetricName,
  ItemType extends Municipalities[T][number],
  ReturnType extends ItemType & { value: number },
  TContext extends ReturnType | MunicipalityProperties
> = {
  metricName?: T;
  selected?: string;
  style?: CSSProperties;
  onSelect?: (context: TContext) => void;
  tooltipContent?: (context: TContext) => ReactNode;
  gradient?: string[];
};

export default function MunicipalityChloropleth<
  T extends TMunicipalityMetricName,
  ItemType extends Municipalities[T][number],
  ReturnType extends ItemType & { value: number },
  TContext extends ReturnType | MunicipalityProperties
>(props: TProps<T, ItemType, ReturnType, TContext>) {
  const {
    selected,
    style,
    metricName,
    onSelect,
    tooltipContent,
    gradient,
  } = props;

  const [ref, dimensions] = useChartDimensions();

  const boundingbox = useBoundingbox(regionGeo, selected);

  const [getData, hasData, domain] = useMunicipalityData(
    metricName,
    municipalGeo
  );

  const regionMunicipalities = useRegionMunicipalities(selected);

  const getFillColor = useChloroplethColor(getData, domain, gradient);

  const featureCallback = useCallback(
    (
      feature: Feature<MultiPolygon, MunicipalityProperties>,
      path: string,
      index: number
    ) => {
      const { gemcode } = feature.properties;
      const isSelected = gemcode === selected;
      let className = isSelected ? styles.selectedPath : '';

      if (!hasData) {
        className += ` ${styles.noData}`;
      }

      if (regionMunicipalities) {
        if (regionMunicipalities.indexOf(gemcode) < 0) {
          className += ` ${styles.faded}`;
        }
      }

      const fillColor = getFillColor(gemcode);

      return (
        <path
          className={className}
          shapeRendering="optimizeQuality"
          id={gemcode}
          key={`municipality-map-feature-${index}`}
          d={path}
          fill={fillColor}
        />
      );
    },
    [getFillColor, selected, hasData, regionMunicipalities]
  );

  const overlayCallback = (
    _feature: Feature<MultiPolygon>,
    path: string,
    index: number
  ) => {
    return (
      <path
        className={styles.overlay}
        shapeRendering="optimizeQuality"
        key={`municipality-map-overlay-${index}`}
        d={path}
        fill={'none'}
      />
    );
  };

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
    <div
      ref={(elm) => {
        ref.current = elm;
      }}
      className={styles.chloroplethContainer}
      style={style}
    >
      <Chloropleth
        featureCollection={municipalGeo}
        overlays={overlays}
        boundingbox={boundingbox || countryGeo}
        dimensions={dimensions}
        featureCallback={featureCallback}
        overlayCallback={overlayCallback}
        onPathClick={onClick}
        getTooltipContent={getTooltipContent}
      />
    </div>
  );
}

const countryGeo = topojson.feature(
  countryTopology,
  countryTopology.objects.netherlands
) as FeatureCollection<MultiPolygon>;

const regionGeo = topojson.feature(
  regionTopology,
  regionTopology.objects.safetyregions
) as RegionGeoJOSN;

const municipalGeo = topojson.feature(
  municipalTopology,
  municipalTopology.objects.municipalities
) as MunicipalGeoJOSN;

const overlays = {
  ...countryGeo,
  features: countryGeo.features.concat(regionGeo.features),
};
