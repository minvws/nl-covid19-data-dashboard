import * as topojson from 'topojson-client';
import municipalTopology from './municipalities.topo.json';
import countryTopology from './netherlands.topo.json';
import regionTopology from './safetyregions.topo.json';

import { MunicipalGeoJOSN, TMunicipalityMetricName } from './shared';

import Chloropleth from './Chloropleth';
import { Feature, FeatureCollection, MultiPolygon } from 'geojson';
import useChartDimensions from 'components/vx/use-chart-dimensions';

import styles from './chloropleth.module.scss';
import { CSSProperties, ReactNode, useCallback } from 'react';
import { Municipalities } from 'types/data';

export type TProps = {
  selected?: string;
  style?: CSSProperties;
  metricName?: TMunicipalityMetricName;
  onSelect?: (context: TContext) => void;
  tooltipContent?: (context: TContext) => ReactNode;
};

export interface MunicipalityProperties {
  gemnaam: string;
  gemcode: string;
}

export type TContext =
  | MunicipalityProperties
  | (Municipalities & MunicipalityProperties);

const countryGeo = topojson.feature(
  countryTopology,
  countryTopology.objects.netherlands
) as FeatureCollection<MultiPolygon>;

const regionGeo = topojson.feature(
  regionTopology,
  regionTopology.objects.safetyregions
) as FeatureCollection<MultiPolygon>;

const municipalGeo = topojson.feature(
  municipalTopology,
  municipalTopology.objects.municipalities
) as MunicipalGeoJOSN;

const overlays = {
  ...countryGeo,
  features: countryGeo.features.concat(regionGeo.features),
};

export default function MunicipalityChloropleth(props: TProps) {
  const { selected, style, onSelect, tooltipContent } = props;
  const [ref, dimensions] = useChartDimensions();

  const boundingbox = countryGeo;

  const getFillColor = useCallback((_id: string): string => {
    return 'white';
  }, []);

  const featureCallback = useCallback(
    (
      feature: Feature<MultiPolygon, MunicipalityProperties>,
      path: string,
      index: number
    ) => {
      const { gemcode } = feature.properties;
      const isSelected = gemcode === selected;
      const className = isSelected ? styles.selectedPath : undefined;

      return (
        <path
          className={className}
          shapeRendering="optimizeQuality"
          id={gemcode}
          key={`municipality-map-feature-${index}`}
          d={path}
          fill={getFillColor(gemcode)}
        />
      );
    },
    [getFillColor, selected]
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

  const getData = (_id: string): TContext => {
    return {} as any;
  };

  const onClick = (_id: string) => {
    if (onSelect) {
      onSelect(getData(_id));
    }
  };

  const getTooltipContent = (id: string) => {
    if (tooltipContent) {
      return tooltipContent(getData(id));
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
        boundingbox={boundingbox}
        dimensions={dimensions}
        featureCallback={featureCallback}
        overlayCallback={overlayCallback}
        onPathClick={onClick}
        getTooltipContent={getTooltipContent}
      />
    </div>
  );
}
