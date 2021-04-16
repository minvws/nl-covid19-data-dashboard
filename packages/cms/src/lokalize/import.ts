import flatten from 'flat';
import fs from 'fs';
import { get, isEmpty } from 'lodash';
import path from 'path';
import { isDefined } from 'ts-is-present';
import { client } from '../client';

const localeDirectory = path.resolve(
  __dirname,
  '..', // src
  '..', // cms
  '..', // packages
  'app/src/locale'
);

const nl = JSON.parse(
  fs.readFileSync(path.join(localeDirectory, 'nl.json'), {
    encoding: 'utf8',
  })
) as Record<string, unknown>;

const en = JSON.parse(
  fs.readFileSync(path.join(localeDirectory, 'en.json'), {
    encoding: 'utf8',
  })
) as Record<string, unknown>;

let issueCounter = 0;

for (const [key, dataText] of Object.entries(nl)) {
  /**
   * Some root-level keys only contain a string instead of an object structure.
   * We can't handle those in our logic, so they are ignored. We should manually
   * move these keys to a different location. Luckily there are only a few of
   * them.
   */
  if (typeof dataText === 'string') {
    console.warn(`Ignoring string value for key ${key}`);
    issueCounter++;
    continue;
  }

  /**
   * The safe option prevents automatic conversion of arrays. Since they are not
   * supported by our logic we want to keep them as arrays so they can be
   * detected and ignored.
   */
  const flatText = flatten(dataText, { safe: true }) as Record<string, string>;

  const textDocuments = Object.entries(flatText)
    .map(([path, value]) => {
      /**
       * We do not import keys that currently have empty strings for NL locale,
       * because they should be obsolete.
       */
      if (!value) return;

      /**
       * Anything that is not a string here is expected to be an array. If these
       * keys are still used in the app, the data will have to be converted or
       * otherwise moved.
       */
      if (typeof value !== 'string') {
        console.warn(`Ignoring value type ${typeof value} for path ${path}`);
        issueCounter++;
        return;
      }

      return {
        _type: 'lokalizeText',
        _id: `jsonKey__${key}.${path}`,
        path: path,
        subject: key,
        /**
         * The lokalize path is also stored (a::b::c) to make it findable
         * with the Sanity search feature.
         */
        lokalize_path: `${`${key}.${path}`.split('.').join('::')}`,
        text: {
          _type: 'localeText',
          nl: value.trim(),
          /**
           * Fall back to NL text because the field is required
           */
          en: (get(en, `${key}.${path}`, value) as string).trim(),
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

  /**
   * Strings from JSON will be overwriting whatever is in Sanity, because
   * until we kill Lokalize those files are the source of truth. However,
   * newly created text entries in Sanity will remain untouched, so we could
   * already start to extend the Lokalize string set using Sanity if we want
   * to.
   */
  const transaction = textDocuments.reduce(
    (tx, document) => tx.createOrReplace(document),
    client.transaction()
  );

  transaction
    .commit()
    .then(() => console.log(`There were ${issueCounter} issues`))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
