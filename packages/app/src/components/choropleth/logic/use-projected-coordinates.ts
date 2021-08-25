import cleanCoords from '@turf/clean-coords';
import flatten from '@turf/flatten';
import { multiPoint, round } from '@turf/helpers';
import { GeoProjection } from 'd3-geo';
import { Polygon, Position } from 'geojson';
import { useMemo } from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import { CodedGeoJSON } from './topology';
import { FitExtent } from './types';

export type GeoInfo = {
  code: string;
  geometry: Polygon;
};

export function useProjectedCoordinates(
  geoJson: CodedGeoJSON | undefined,
  geoProjection: () => GeoProjection,
  fitExtent: FitExtent
) {
  return useMemo(
    () => getProjectedCoordinates(geoJson, geoProjection, fitExtent),
    [geoJson, fitExtent, geoProjection]
  );
}

export function getProjectedCoordinates(
  geoJson: CodedGeoJSON | undefined,
  geoProjection: () => GeoProjection,
  fitExtent: FitExtent
) {
  if (!isDefined(geoJson)) {
    return [[] as GeoInfo[], [] as [number, number][][]] as const;
  }

  const polygons = geoJson.features
    .filter((x) => x.geometry.type === 'Polygon')
    .map<GeoInfo>((x) => ({
      code: x.properties.code,
      geometry: x.geometry as Polygon,
    }))
    .concat(
      geoJson.features
        .filter((x) => x.geometry.type === 'MultiPolygon')
        .map((x) => flatten(x))
        .map((x) => x.features)
        .flat()
        .map<GeoInfo>((x) => ({
          code: x.properties?.code,
          geometry: x.geometry,
        }))
    );

  const geoInfo = polygons.reduce((acc, geoInfo) => {
    if (!hasCoordinateTuples(geoInfo.geometry.coordinates)) {
      geoInfo.geometry.coordinates.forEach((x) => {
        acc.push({
          ...geoInfo,
          geometry: {
            ...geoInfo.geometry,
            coordinates: [x],
          },
        });
      });
    } else {
      acc.push(geoInfo);
    }
    return acc;
  }, [] as GeoInfo[]);

  const projection = geoProjection().fitExtent(fitExtent[0], fitExtent[1]);

  const projectedCoordinates = geoInfo
    .map((x) => x.geometry.coordinates.flat())
    .map<[number, number][]>(
      (c) => cleanCoords(multiPoint(c)).geometry.coordinates
    )
    .map<[number, number][]>((coords) =>
      coords
        .map((c: [number, number]) => projection(c))
        .filter(isPresent)
        .map((x: [number, number]) => [round(x[0], 0), round(x[1], 0)])
    );

  return [geoInfo, projectedCoordinates] as const;
}

function hasCoordinateTuples(array: Position[][] | Position[][][]) {
  if (Array.isArray(array) && typeof array[0] === 'number') {
    return true;
  }
  return false;
}
