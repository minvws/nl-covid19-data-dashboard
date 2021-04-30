import { LokalizeText } from '@corona-dashboard/app/src/types/cms';
import { createFlatTexts } from '@corona-dashboard/common';
import { unflatten } from 'flat';
import fs from 'fs';
import meow from 'meow';
import path from 'path';
import prettier from 'prettier';
import { getClient } from '../client';

const cli = meow(
  `
    Usage
      $ lokalize:export

    Options
      --drafts, -d Include draft documents

    Examples
      $ lokalize:export -d
`,
  {
    flags: {
      drafts: {
        type: 'boolean',
        alias: 'd',
      },
    },
  }
);

const localeDirectory = path.resolve(
  __dirname,
  '..', // src
  '..', // cms
  '..', // packages
  'app/src/locale'
);

(async function run() {
  const client = getClient();
  /**
   * The client will load drafts by default because it is authenticated with a
   * token. If the `drafts` flag is not set to true, we will manually
   * exclude draft-documents on query-level.
   */
  const draftsQueryPart = cli.flags.drafts
    ? ''
    : '&& !(_id in path("drafts.**"))';

  const documents: LokalizeText[] = await client.fetch(
    `*[_type == 'lokalizeText' ${draftsQueryPart}] | order(key asc)`
  );

  let flatTexts = createFlatTexts(documents, { warn: true });

  await writePrettyJson(
    unflatten(flatTexts.nl, { object: true }),
    path.join(localeDirectory, 'nl_export.json')
  );

  await writePrettyJson(
    unflatten(flatTexts.en, { object: true }),
    path.join(localeDirectory, 'en_export.json')
  );

  console.log('Export completed');
})().catch((err) => {
  console.error(`Export failed: ${err.message}`);
  process.exit(1);
});

async function writePrettyJson(data: Record<string, unknown>, path: string) {
  const json = prettier.format(JSON.stringify(data), { parser: 'json' });
  return new Promise<void>((resolve, reject) =>
    fs.writeFile(path, json, { encoding: 'utf8' }, (err) =>
      err ? reject(err) : resolve()
    )
  );
}
