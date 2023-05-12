import { assert, vrData } from '@corona-dashboard/common';
import { geoMercator } from 'd3-geo';
import fs from 'fs';
import hash from 'hash-sum';
import Konva from 'konva';
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils';
import path from 'path';
import sanitize from 'sanitize-filename';
import { isDefined } from 'ts-is-present';
import { DataConfig, DataOptions } from '~/components/choropleth';
import { createDataConfig } from '~/components/choropleth/logic/create-data-config';
import { getProjectedCoordinates } from '~/components/choropleth/logic/use-projected-coordinates';
import { dataUrltoBlob } from '~/utils/api/data-url-to-blob';
import { resolvePublicFolder } from '~/utils/api/resolve-public-folder';
import { gmGeo, nlGeo, vrGeo } from './topology';
import { MapType, CHOROPLETH_ASPECT_RATIO, ChoroplethDataItem, FitExtent } from '~/components/choropleth/logic/types';
import { getChoroplethFeatures } from '~/components/choropleth/logic/use-choropleth-features';
import { getFillColor } from '~/components/choropleth/logic/use-fill-color';
import { getFeatureProps } from '~/components/choropleth/logic/use-feature-props';
/**
 * The combination node-canvas and sharp leads to runtime crashes under Windows, this
 * ENV variable disables compression. By conditionally importing the sharp lib we
 * avoid a runtime crash.
 */
const sharp = process.env.DISABLE_COMPRESSION !== '1' ? require('sharp') : undefined;

const publicPath = resolvePublicFolder(path.resolve(__dirname));
const publicJsonPath = path.resolve(publicPath, 'json');
const publicImgPath = path.resolve(publicPath, 'images', 'choropleth');

if (!fs.existsSync(publicImgPath)) {
  fs.mkdirSync(publicImgPath, { recursive: true });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { param } = req.query;
  const [map, metric, property, heightStr, selectedCode] = param as [MapType, string, string, number, string | undefined];

  const height = Number(heightStr);

  if (height < 50 || height > 900) {
    res.status(400);
    res.end();
    return;
  }

  const suffix = isDefined(selectedCode) ? `_${selectedCode}` : '';
  const filename = sanitize(`${metric}_${property}_${map}_${height}${suffix}.png`);

  const fullImageFilePath = path.join(publicImgPath, filename);
  if (fs.existsSync(fullImageFilePath)) {
    const blob = fs.readFileSync(fullImageFilePath);
    const eTag = hash(blob);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Vary', 'Accept-Encoding');
    res.setHeader('ETag', eTag);
    res.status(200);
    res.end(blob);
    return;
  }

  try {
    const [blob, eTag] = await generateChoroplethImage(metric, property, map, height, filename, selectedCode);

    res.setHeader('ETag', eTag);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Vary', 'Accept-Encoding');

    res.status(200);
    res.end(blob);
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
}

function createGeoJson(map: MapType) {
  assert(map === 'vr' || map === 'gm', `[${createGeoJson.name}] Unknown maptype: ${map}`);

  const featureGeo = map === 'vr' ? vrGeo : gmGeo;

  return [featureGeo, nlGeo] as const;
}

const validMapTypes: MapType[] = ['gm', 'vr'];
function loadChoroplethData(map: MapType, metric: string) {
  if (!validMapTypes.includes(map)) {
    throw new Error(`Invalid map type: ${map}`);
  }

  const filename = sanitize(`${map.toUpperCase()}_COLLECTION.json`);
  const content = JSON.parse(fs.readFileSync(path.join(publicJsonPath, filename), { encoding: 'utf-8' }));

  if (metric !== 'gemeente' && metric !== 'veiligheidsregio') {
    return content[metric] as ChoroplethDataItem[];
  }

  if (metric === 'veiligheidsregio') {
    return vrData.map((x) => ({
      vrcode: x.code,
      admissions_on_date_of_reporting: null,
    })) as unknown as ChoroplethDataItem[];
  }

  const data = content['tested_overall'];
  return data.map((x: any) => ({
    gmcode: x.gemcode,
    admissions_on_date_of_reporting: null,
  })) as ChoroplethDataItem[];
}

async function generateChoroplethImage(metric: string, property: string, map: MapType, height: number, filename: string, selectedCode?: string) {
  const dataConfig: DataConfig<any> = createDataConfig<any>({
    metricName: metric as any,
    metricProperty: property,
  });

  const dataOptions: DataOptions = {};

  const aspectRatio = CHOROPLETH_ASPECT_RATIO.nl;
  const mapProjection = geoMercator;

  const width = height * (1 / aspectRatio);

  const geoJson = createGeoJson(map);
  const data = loadChoroplethData(map, metric);

  const features = getChoroplethFeatures(map, data, geoJson, selectedCode);

  const fitExtent: FitExtent = [
    [
      [0, 0],
      [width, height],
    ],
    features.boundingBox,
  ];

  const [projectedGeoInfo] = getProjectedCoordinates(features.hover, mapProjection, fitExtent);

  const fColor = getFillColor(data, map, dataConfig);
  const fillColor = (code: string, index: number) => {
    if (code === 'VR19') {
      const vr19s = projectedGeoInfo.filter((x) => x.code === 'VR19');
      const idx = vr19s.indexOf(projectedGeoInfo[index]);
      if (idx === 5 || idx === 0) {
        return featureProps.area.fill(code);
      }
      return 'white';
    }
    return featureProps.area.fill(code);
  };

  const featureProps = getFeatureProps(map, fColor, dataConfig, dataOptions);

  const stage = new Konva.Stage({
    container: property,
    width,
    height,
  });

  const layer = new Konva.Layer();
  layer.add(
    new Konva.Rect({
      x: 0,
      y: 0,
      fill: 'white',
      width,
      height,
    })
  );

  projectedGeoInfo.forEach((x, i) => {
    const line = new Konva.Line({
      perfectDrawEnabled: true,
      closed: true,
      x: 0,
      y: 0,
      strokeWidth: featureProps.area.strokeWidth(x.code),
      points: x.coordinates.flat(),
      fill: fillColor(x.code, i),
      stroke: featureProps.area.stroke(x.code),
    });
    layer.add(line);
  });
  stage.add(layer);

  const dataUrl = stage.toDataURL();
  const blob = dataUrltoBlob(dataUrl);
  const compressedBlob = await compressImage(blob);
  const eTag = hash(dataUrl);

  fs.writeFileSync(path.join(publicImgPath, filename), compressedBlob);

  return [blob, eTag] as const;
}

async function compressImage(blob: Buffer) {
  if (isDefined(sharp)) {
    return await sharp(blob).png({ quality: 30 }).toBuffer();
  }
  return Promise.resolve(blob);
}
