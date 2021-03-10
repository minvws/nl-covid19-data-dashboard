import { imageResizeTargets } from '@corona-dashboard/common';
import download from 'download';
import fs from 'fs-extra';
import { chunk } from 'lodash';
import fetch from 'node-fetch';
import { getConfig } from './logic';

const TARGET_DIR = '../app/public/cms';
const CACHE_DIR =
  process.env.SANITY_ASSETS_CACHE_DIR || './.sanity-asset-cache';

(async function run() {
  const { dataset, projectId } = await getConfig();

  console.log('Sync assets with config', { dataset, projectId });

  const sanityAssets = await getSanityAssets({
    dataset,
    projectId,
  });

  const assets: LocalAsset[] = [
    ...sanityAssets.files.map((file) => ({
      url: file.url,
      filename: `${file.assetId}.${file.extension}`,
      directory: `files`,
    })),

    ...sanityAssets.images.flatMap((image) =>
      image.extension === 'svg'
        ? {
            url: image.url,
            filename: `${image.assetId}.${image.extension}`,
            directory: `images`,
          }
        : imageResizeTargets.flatMap((size) => [
            {
              url: `${image.url}?w=${size}`,
              filename: `${image.assetId}-${size}.${image.extension}`,
              directory: `images`,
            },
            {
              url: `${image.url}?w=${size}&fm=webp`,
              filename: `${image.assetId}-${size}.webp`,
              directory: `images`,
            },
          ])
    ),
  ];

  await cacheAssets(assets, CACHE_DIR);
  await copyCachedAssets(assets, CACHE_DIR, TARGET_DIR);

  console.log('🎉 Done.\n');
})().catch((err) => {
  console.log('Error occured:', err);
  process.exit(1);
});

async function cacheAssets(assets: LocalAsset[], cacheDirectory: string) {
  console.log(`Ensuring ${assets.length} assets are part of local cache...`);

  let count = 0;

  for (const urls of chunk(assets, 20)) {
    const promisedDownloads = urls.map(async ({ url, filename }) => {
      const fileExists = await fs.pathExists(`${cacheDirectory}/${filename}`);

      if (!fileExists) {
        console.log(`downloading ${url}`);
        await download(url, cacheDirectory, { filename });
        count++;
      }
    });

    await Promise.all(promisedDownloads);
  }

  console.log(
    `\n✅ Successfully downloaded ${count} assets from the Sanity CDN\n`
  );
}

async function copyCachedAssets(
  assets: LocalAsset[],
  cacheDir: string,
  targetDir: string
) {
  console.log(
    `Copying ${assets.length} assets from cache to target directory...\n`
  );

  await fs.emptyDir(TARGET_DIR);
  await Promise.all(
    assets.map((x) =>
      fs.copy(
        `${cacheDir}/${x.filename}`,
        `${targetDir}/${x.directory}/${x.filename}`
      )
    )
  );
}

async function getSanityAssets({
  projectId,
  dataset,
}: {
  projectId: string;
  dataset: string;
}) {
  const url = `https://${projectId}.api.sanity.io/v1/data/export/${dataset}`;

  const request = await fetch(url);
  const response = await request.text();

  /**
   * Sanity returns ndjson (new-line delimited json) which is a streaming
   * format in which each line is its own document. Therefore we'll split the
   * body on `\n` characters to get an array of records.
   */
  const sanityExport = response
    .split(/\n/g)
    .filter((x) => x.length > 0)
    .map((x) => JSON.parse(x));

  const files = sanityExport.filter(
    (x) => x._type === 'sanity.fileAsset'
  ) as SanityFileAsset[];

  const images = sanityExport.filter(
    (x) => x._type === 'sanity.imageAsset'
  ) as SanityImageAsset[];

  return { files, images };
}

interface LocalAsset {
  url: string;
  filename: string;
  directory: string;
}

interface SanityAsset {
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

interface SanityFileAsset extends SanityAsset {
  _type: 'sanity.fileAsset';
}

interface SanityImageAsset extends SanityAsset {
  _type: 'sanity.imageAsset';
}
