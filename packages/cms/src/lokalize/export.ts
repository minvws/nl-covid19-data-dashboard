import { unflatten } from 'flat';
import fs from 'fs';
import meow from 'meow';
import path from 'path';
import prettier from 'prettier';
import { client } from '../client';
import { LokalizeText } from '@corona-dashboard/app/src/types/cms';
import { createFlattenTexts } from '@corona-dashboard/common';

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

async function main() {
  /**
   * The client will load drafts by default because it is authenticated with a
   * token. If the `drafts` flag is not set to true, we will manually
   * exclude draft-documents on query-level.
   */
  const draftsQueryPart = cli.flags.drafts
    ? ''
    : '&& !(_id in path("drafts.**"))';

  const documents: LokalizeText[] = await client.fetch(
    `*[_type == 'lokalizeText' ${draftsQueryPart}] | order(lokalize_path asc)`
  );

  let flattenTexts = createFlattenTexts(documents, { warn: true });

  await writePrettyJson(
    unflatten(flattenTexts.nl, { object: true }),
    path.join(localeDirectory, 'nl_export.json')
  );

  await writePrettyJson(
    unflatten(flattenTexts.en, { object: true }),
    path.join(localeDirectory, 'en_export.json')
  );

  console.log('Successfully wrote locale files');
}

main().catch((err: Error) => exit(err));

async function writePrettyJson(data: Record<string, unknown>, path: string) {
  const json = prettier.format(JSON.stringify(data), { parser: 'json' });
  return new Promise<void>((resolve, reject) =>
    fs.writeFile(path, json, { encoding: 'utf8' }, (err) =>
      err ? reject(err) : resolve()
    )
  );
}

function exit(...args: unknown[]) {
  console.error(...args);
  process.exit(1);
}
