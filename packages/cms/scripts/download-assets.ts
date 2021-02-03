import { imageResizeTargets } from '@corona-dashboard/common/src/config';
import download from 'download';
import fs from 'fs';
import { chunk } from 'lodash';
import fetch from 'node-fetch';
import prompts from 'prompts';
import sanityConfig from '../sanity.json';

const TARGET_DIR = '../app/public/cms';
const SANITY_PROJECT_ID = sanityConfig.api.projectId;

(async function run() {
  let dataset =
    process.env.SANITY_DATASET ||
    (
      await prompts([
        {
          type: 'select',
          name: 'dataset',
          message: 'Select dataset to export',
          choices: [
            { title: 'development', value: 'development' },
            { title: 'production', value: 'production' },
          ],
          initial: 0,
        },
      ])
    ).dataset;

  if (dataset !== 'development' && dataset !== 'production') {
    throw new Error(`Unknown dataset ${dataset}`);
  }

  const sanityAssets = await getSanityAssets({
    projectId: SANITY_PROJECT_ID,
    dataset,
  });

  const localAssets: LocalAsset[] = [
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
        : imageResizeTargets.map((size) => ({
            url: `${image.url}?w=${size}`,
            filename: `${image.assetId}-${size}.${image.extension}`,
            directory: `images`,
          }))
    ),
  ];

  const missingAssets = localAssets.filter(
    (x) => !fs.existsSync(`${TARGET_DIR}/${x.directory}/${x.filename}`)
  );

  await downloadAssets(missingAssets);

  const isNotPartOfAssets = (filename: string) =>
    !localAssets.find((x) => x.filename === filename);

  const obsoleteFiles = [
    ...getFilteredAssetFilePaths(`${TARGET_DIR}/files`, isNotPartOfAssets),
    ...getFilteredAssetFilePaths(`${TARGET_DIR}/images`, isNotPartOfAssets),
  ];

  await deleteFiles(obsoleteFiles);

  console.log(
    `\n🥳 Successfully downloaded ${missingAssets.length} assets and removed ${obsoleteFiles.length} obsolete files!!1\n`
  );
})().catch((err) => console.log(err));

interface LocalAsset {
  url: string;
  filename: string;
  directory: string;
}

async function downloadAssets(assets: LocalAsset[]) {
  let count = 0;

  for (const urls of chunk(assets, 20)) {
    const promisedDownloads = urls.map(async ({ url, filename, directory }) => {
      await download(url, `${TARGET_DIR}/${directory}`, { filename });
      console.log(`[${++count}/${assets.length}]: ✅ ${url}`);
    });

    await Promise.all(promisedDownloads);
  }
}

async function deleteFiles(files: string[]) {
  files.forEach((file, i, list) => {
    fs.unlinkSync(file);
    console.log(`[${i + 1}/${list.length}]: 🗑  ${file}`);
  });
}

function getFilteredAssetFilePaths(
  directory: string,
  comparator: (filename: string) => boolean
) {
  return fs
    .readdirSync(directory)
    .map((filename) =>
      comparator(filename) ? `${directory}/${filename}` : undefined
    )
    .filter((x) => x !== undefined) as string[];
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
