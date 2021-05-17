import { flatten } from 'flat';
import fs from 'fs';
import { get, isEmpty } from 'lodash';
import path from 'path';
import { isDefined } from 'ts-is-present';
import { getClient } from '../client';

/**
 * The import script is meant to be ran on an empty dataset. It will create a
 * LokalizeText document for every key, and the ids for these documents are
 * auto-generated. This means that running the script twice will just result in
 * duplicate documents.
 *
 * You can run the lokalize/delete-all script to start fresh.
 */
(async function run() {
  const client = getClient();

  const localeDirectory = path.resolve(
    __dirname,
    '..', // src
    '..', // cms
    '..', // packages
    'app/src/locale'
  );

  const nl = JSON.parse(
    fs.readFileSync(path.join(localeDirectory, 'nl_export.json'), {
      encoding: 'utf8',
    })
  ) as Record<string, unknown>;

  const en = JSON.parse(
    fs.readFileSync(path.join(localeDirectory, 'en_export.json'), {
      encoding: 'utf8',
    })
  ) as Record<string, unknown>;

  const transaction = client.transaction();
  let issueCounter = 0;

  for (let [subject, dataText] of Object.entries(nl)) {
    /**
     * Some root-level keys only contain string | string[] instead of an object
     * structure. We can't handle those in our logic, so they are moved to a
     * `__root` subject.
     */
    if (typeof dataText === 'string' || Array.isArray(dataText)) {
      const type = typeof dataText === 'string' ? 'string' : 'array';
      console.warn(
        `Transform root ${type} for key "${subject}" to object value "{ __root: { ${subject} } }"`
      );

      dataText = { [subject]: dataText };
      subject = '__root';
    }

    const flatText = flatten(dataText) as Record<string, string>;

    const textDocuments = Object.entries(flatText)
      .map(([path, value]) => {
        /**
         * Anything that is not a string here is expected to be an array. If
         * these keys are still used in the app, the data will have to be
         * converted or otherwise moved.
         */
        if (typeof value !== 'string') {
          console.warn(`Ignoring value type ${typeof value} for path ${path}`);
          issueCounter++;
          return;
        }

        return {
          _type: 'lokalizeText',
          key: `${subject}.${path}`,
          subject,
          path: path,
          should_display_empty: !value,
          /**
           * We only flag newly added for the items that have been added later
           * via the CLI. The imported texts are all translated anyway and
           * require no extra attention.
           */
          is_newly_added: false,
          publish_count: 0,

          text: {
            _type: 'localeText',
            nl: value.trim(),
            /**
             * Fall back to NL text because the field is required
             */
            en: (get(en, `${subject}.${path}`, value) as string).trim(),
          },
        };
      })
      /**
       * Filter out the entries that got skipped
       */
      .filter(isDefined);

    if (isEmpty(textDocuments)) {
      /**
       * If no text entries survived for this key, we do not store anything
       */
      continue;
    }

    textDocuments.forEach((document) => transaction.create(document));
  }

  await transaction.commit();

  console.log(`Import completed. There were ${issueCounter} issues`);
})().catch((err) => {
  console.error(`Import failed: ${err.message}`);
  process.exit(1);
});
