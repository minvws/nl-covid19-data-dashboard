import { MutationEvent } from '@sanity/client';
import throttle from 'lodash/throttle';
import { unflatten } from 'flat';
import fs from 'fs';
import { client } from '../client';
import prettier from 'prettier';
import path from 'path';
import meow from 'meow';
import { LokalizeText } from './../../../app/src/types/cms';

const cli = meow(
  `
    Usage
      $ lokalize:export

    Options
      --drafts, -d Include drafts
      --watch, -w Listen to realtime updates

    Examples
      $ lokalize:export -e
`,
  {
    flags: {
      watch: {
        type: 'boolean',
        alias: 'w',
      },
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

/**
 * By default drafts are loaded (due to the sanity token). When the drafts cli
 * flag is not set to true we'll filter all drafts.
 */
const draftsQueryPart = cli.flags.drafts
  ? ''
  : '&& !(_id in path("drafts.**"))';

const query = `*[_type == 'lokalizeText' ${draftsQueryPart}] | order(lokalize_path asc)`;

async function main() {
  const documents: LokalizeText[] = await client.fetch(query);
  let flattenTexts = createFlattenTexts(documents);

  await writeFlattenTexts(flattenTexts).then(() =>
    console.log('Successfully wrote locale files')
  );

  if (cli.flags.watch) {
    console.log('watching for changes...');
    const throttledWrite = throttle(writeFlattenTexts, 1000);
    client.listen(query).subscribe((update: MutationEvent<LokalizeText>) => {
      if (!update.result) return;

      console.log(`Received update for path ${update.result.lokalize_path}`);

      const { key, localeText } = parseLocaleTextDocument(update.result);

      flattenTexts.nl[key] = localeText.nl;
      flattenTexts.en[key] = localeText.en;

      throttledWrite(flattenTexts);
    });
  }
}

main().catch((err: Error) => exit(err));

function exit(...args: unknown[]) {
  console.error(...args);
  process.exit(1);
}

async function writeFlattenTexts({
  nl,
  en,
}: {
  nl: Record<string, string>;
  en: Record<string, string>;
}) {
  return Promise.all([
    new Promise<void>((resolve, reject) =>
      fs.writeFile(
        /**
         * @TODO rename these files ones we make the switch
         */
        path.join(localeDirectory, 'nl_export.json'),
        prettyUnflatten(nl),
        { encoding: 'utf8' },
        (err) => (err ? reject(err) : resolve())
      )
    ),
    new Promise<void>((resolve, reject) =>
      fs.writeFile(
        /**
         * @TODO rename these files ones we make the switch
         */
        path.join(localeDirectory, 'en_export.json'),
        prettyUnflatten(en),
        { encoding: 'utf8' },
        (err) => (err ? reject(err) : resolve())
      )
    ),
  ]);
}

function prettyUnflatten(data: Record<string, string>) {
  return prettier.format(JSON.stringify(unflatten(data, { object: true })), {
    parser: 'json',
  });
}

function createFlattenTexts(documents: LokalizeText[]) {
  const nl: Record<string, string> = {};
  const en: Record<string, string> = {};

  const drafts = documents.filter((x) => x._id.startsWith('drafts.'));
  const published = documents.filter((x) => !x._id.startsWith('drafts.'));

  for (const document of published) {
    const { key, localeText } = parseLocaleTextDocument(document);
    nl[key] = localeText.nl;
    en[key] = localeText.en;
  }

  for (const document of drafts) {
    const { key, localeText } = parseLocaleTextDocument(document);
    nl[key] = localeText.nl;
    en[key] = localeText.en;
  }

  return { nl, en };
}

function parseLocaleTextDocument(document: LokalizeText) {
  /**
   * paths inside the `__root` subject should be placed under the path
   * in the root of the exported json
   */
  const key =
    document.subject === '__root'
      ? document.path
      : `${document.subject}.${document.path}`;

  const nl = document.displayEmpty ? '' : document.text.nl?.trim() || '';
  const en = document.displayEmpty
    ? ''
    : /**
       * Here make an automatic fallback to Dutch texts if English is missing.
       */
      document.text.en?.trim() || nl;

  if (!document.text.en?.trim()) {
    console.log(
      'Missing english translation for path:',
      document.lokalize_path
    );
  }

  return { key, localeText: { nl, en } };
}
