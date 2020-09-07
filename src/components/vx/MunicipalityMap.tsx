import { useState } from 'react';

import { Mercator } from '@vx/geo';
import * as topojson from 'topojson-client';

import topology from './municipalities.topo.json';
import { FeatureCollection, Feature, MultiPolygon } from 'geojson';
import useNewMunicipalityData, {
  TMunicipalityMetricName,
} from 'utils/useNewMunicipalityData';
import useMapColorScale from 'utils/useMapColorScale';
import useMapTooltip from './useMapTooltip';

export type MunicipalGeoJOSN = FeatureCollection<
  MultiPolygon,
  MunicipalityProperties
>;

export interface MunicipalityProperties {
  gemnaam: string;
  gemcode: string;
}

export type GeoMercatorProps = {
  width: number;
  height: number;
  selected?: string;
  municipalCodes?: string[];
  metric: TMunicipalityMetricName;
  gradient: [minColor: string, maxColor: string];
  onSelect?: (context: any) => void;
};

const world = topojson.feature(
  topology,
  topology.objects.municipalities
) as MunicipalGeoJOSN;

export default function MunicipalityMap(props: GeoMercatorProps) {
  const { width, height, metric, gradient, onSelect, selected } = props;

  const [selection, setSelection] = useState<string | undefined>(selected);

  const municipalityData = useNewMunicipalityData(metric);
  const color = useMapColorScale(
    municipalityData,
    (item: typeof municipalityData[number]) => item.value,
    gradient
  );

  const getFillColor = (gmCode: string) => {
    return color(getData(gmCode)?.value ?? 0);
  };

  const getData = (gmCode: string) => {
    return municipalityData[gmCode];
  };

  const [
    showTooltip,
    hideTooltip,
    containerRef,
    TooltipInPortal,
    info,
  ] = useMapTooltip<typeof municipalityData[number]>();

  return width < 10 ? null : (
    <>
      <svg ref={containerRef} width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={'white'}
          rx={14}
        />
        <Mercator<Feature<MultiPolygon, MunicipalityProperties>>
          data={world.features}
          fitSize={[[width, height], world]}
        >
          {(mercator) => (
            <g>
              {mercator.features.map(({ feature, path }, i) => (
                <path
                  onMouseOver={(event) =>
                    showTooltip(event, getData(feature.properties.gemcode))
                  }
                  onMouseOut={hideTooltip as any}
                  key={`municipality-map-feature-${i}`}
                  d={path || ''}
                  fill={getFillColor(feature.properties.gemcode)}
                  stroke={'black'}
                  strokeWidth={
                    feature.properties.gemcode === selection ? 2 : 0.5
                  }
                  onClick={() => {
                    if (onSelect) {
                      setSelection(feature.properties.gemcode);
                      onSelect(feature);
                    }
                  }}
                />
              ))}
            </g>
          )}
        </Mercator>
      </svg>

      {info?.tooltipOpen && (
        <TooltipInPortal
          // set this to random so it correctly updates with parent bounds
          key={Math.random()}
          left={info.tooltipLeft}
          top={info.tooltipTop}
        >
          <strong>{info.tooltipData.value}</strong>
        </TooltipInPortal>
      )}
    </>
  );
}
