import cleanCoords from '@turf/clean-coords';
import flatten from '@turf/flatten';
import { multiPoint, round } from '@turf/helpers';
import type { GeoProjection } from 'd3-geo';
import type { Polygon, Position } from 'geojson';
import { useMemo } from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import type { CodedGeoJSON } from './topology';
import type { FitExtent } from './types';

type GeoPolygons = {
  code: string;
  geometry: Polygon;
};

export type ProjectedGeoInfo = {
  code: string;
  coordinates: [number, number][];
};

/**
 * This hook transforms the given CodedGeoJSON to a list and lookup of feature codes
 * and their corresponding cartesian coordinates tuples which can
 * be used to draw onto a canvas.
 */
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
    return [
      [] as ProjectedGeoInfo[],
      {} as Record<string, [number, number][][]>,
    ] as const;
  }

  /**
   * The GeoJson consists of combination of Polygon and MultiPolygon geometries,
   * so here we first normalize this to a list of just Polygons.
   */
  const polygons = geoJson.features
    .filter((x) => x.geometry?.type === 'Polygon')
    .map<GeoPolygons>((x) => ({
      code: x.properties.code,
      geometry: x.geometry as Polygon,
    }))
    .concat(
      geoJson.features
        .filter((x) => x.geometry?.type === 'MultiPolygon')
        .map((x) => flatten(x))
        .map((x) => x.features)
        .flat()
        .map<GeoPolygons>((x) => ({
          code: x.properties?.code,
          geometry: x.geometry,
        }))
    );

  /**
   * turf.flatten() doesn't properly flatten deeply nested Multipolygons,
   * so here we check if the coordinates consist of number tuples, if not,
   * we can assume it's a deeper nested polygon and extract the tuples.
   */
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
  }, [] as GeoPolygons[]);

  /**
   * Create the method that will translate the lat and lon coordinates to cartesian
   * coordinates within our container.
   */
  const projection = geoProjection().fitExtent(fitExtent[0], fitExtent[1]);

  /**
   * First we clean the given geojson coordinates by removing any unnecessary ones,
   * then we perform the projection and round the coordinates to whole numbers.
   */
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

  const projections = geoInfo.map<ProjectedGeoInfo>((x, i) => ({
    code: x.code,
    coordinates: projectedCoordinates[i],
  }));

  return [
    projections,
    projections.reduce((aggr, item) => {
      if (!isDefined(aggr[item.code])) {
        aggr[item.code] = [];
      }
      aggr[item.code].push(item.coordinates);
      return aggr;
    }, {} as Record<string, [number, number][][]>),
  ] as const;
}

function hasCoordinateTuples(array: Position[][] | Position[][][]) {
  if (Array.isArray(array) && typeof array[0] === 'number') {
    return true;
  }
  return false;
}
