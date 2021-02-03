import { imageResizeTargets } from '@corona-dashboard/common/src/config';
import download from 'download';
import fs from 'fs';
import { chunk } from 'lodash';
import fetch from 'node-fetch';
import sanityConfig from '../sanity.json';

const TARGET_DIR = './export/foo';
const SANITY_PROJECT_ID = sanityConfig.api.projectId;
const SANITY_DATASET = 'production';

(async function run() {
  const { images, files } = await getAssets({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
  });

  const fileUrls = files.map((file) => ({
    url: file.url,
    filename: `${file.assetId}.${file.extension}`,
    directory: `files`,
  }));

  const imageUrls = images.flatMap((image) =>
    image.extension === 'svg'
      ? {
          url: image.url,
          filename: `${image.assetId}.${image.extension}`,
          directory: `images`,
        }
      : imageResizeTargets.map((size) => ({
          url: `${image.url}?w=${size}`,
          filename: `${image.assetId}-${size}.${image.extension}`,
          directory: `images`,
        }))
  );

  // skip existing files
  const newUrls = [...fileUrls, ...imageUrls].filter(
    (x) => !fs.existsSync(`${TARGET_DIR}/${x.directory}/${x.filename}`)
  );

  let count = 0;

  for (const urls of chunk(newUrls, 20)) {
    const promisedDownloads = urls.map(async ({ url, filename, directory }) => {
      await download(url, `${TARGET_DIR}/${directory}`, { filename });
      console.log(`[${++count}/${newUrls.length}]: ✅ ${url}`);
    });

    await Promise.all(promisedDownloads);
  }
})().catch((err) => console.log(err));

interface Asset {
  _createdAt: string;
  _id: string;
  _rev: string;
  _updatedAt: string;
  assetId: string;
  extension: string;
  mimeType: string;
  originalFilename: string;
  path: string;
  sha1hash: string;
  size: number;
  uploadId: string;
  url: string;
}

interface SanityFileAsset extends Asset {
  _type: 'sanity.fileAsset';
}

interface SanityImageAsset extends Asset {
  _type: 'sanity.imageAsset';
}

async function getAssets({
  projectId,
  dataset,
}: {
  projectId: string;
  dataset: 'development' | 'production';
}) {
  const url = `https://${projectId}.api.sanity.io/v1/data/export/${dataset}`;

  const request = await fetch(url);
  const response = await request.text();

  // ndjson is new-line delimited json, therefore we'll split on \n characters
  const lines = response.split(/\n/g).filter((x) => x.length > 0);

  const assets = lines
    .map((x) => JSON.parse(x))
    .filter((x) => ['sanity.fileAsset', 'sanity.imageAsset'].includes(x._type));

  const files = assets.filter(
    (x) => x._type === 'sanity.fileAsset'
  ) as SanityFileAsset[];

  const images = assets.filter(
    (x) => x._type === 'sanity.imageAsset'
  ) as SanityImageAsset[];

  return { files, images };
}
