import { MunicipalGeoJSON, VrGeoJSON } from '@corona-dashboard/common';
import * as turf from '@turf/turf';
import fs from 'fs';
import path from 'path';
import prettier from 'prettier';
import * as topojson from 'topojson-client';
import { isDefined } from 'ts-is-present';

const topology = JSON.parse(
  fs.readFileSync(
    path.join(
      __dirname,
      '../../../app/src/components/choropleth/geography-simplified.topo.json'
    ),
    { encoding: 'utf-8' }
  )
);

const gmGeo = topojson.feature(
  topology,
  topology.objects.municipalities
) as unknown as MunicipalGeoJSON;

const vrGeo = topojson.feature(
  topology,
  topology.objects.vr_collection
) as unknown as VrGeoJSON;

const vrCodes = vrGeo.features.map((x) => x.properties.vrcode).sort();

(function run() {
  const lookup = vrCodes.reduce((acc, vrCode) => {
    const region = vrGeo.features.find((x) => x.properties.vrcode === vrCode);
    if (!isDefined(region)) {
      return acc;
    }

    let bbox = turf.bbox(region.geometry);
    bbox[0] = bbox[0] - 0.15;
    bbox[1] = bbox[1] - 0.15;
    bbox[2] = bbox[2] + 0.15;
    bbox[3] = bbox[3] + 0.15;
    const bboxPoly = turf.bboxPolygon(bbox);

    const result = gmGeo.features
      .filter((x) => {
        if (x.geometry.type === 'Polygon') {
          return turf.booleanContains(bboxPoly, x.geometry);
        } else {
          const polys = x.geometry.coordinates.map((coordinates) => ({
            type: 'Polygon',
            coordinates,
          }));
          return polys.some((x) => turf.booleanContains(bboxPoly, x));
        }
      })
      .map((x) => x.properties.gemcode);

    acc[vrCode] = result;

    return acc;
  }, {} as Record<string, string[]>);

  const code = [
    'export const regionBoundingBoxMunicipalities: Record<string, string[]> = {',
  ];
  code.push(
    ...Object.entries<string[]>(lookup).map(([vrcode, gmcodes]) => {
      return `${vrcode}: [${gmcodes.map((x) => `'${x}'`).join(',')}],`;
    })
  );
  code.push('};');

  const typescript = prettier.format(code.join(''), {
    parser: 'typescript',
  });

  const tsFilePath = path.join(
    __dirname,
    '../../../app/src/components/choropleth/region-bounding-box-municipalities.ts'
  );

  fs.writeFileSync(tsFilePath, typescript, { encoding: 'utf-8' });

  console.log(`Output saved to: ${tsFilePath}`);
})();
