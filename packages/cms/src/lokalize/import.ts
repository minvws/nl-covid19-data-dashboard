import flatten from 'flat';
import fs from 'fs';
import { get, isEmpty } from 'lodash';
import Queue from 'p-queue';
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

/**
 * Place some rate limits on the requests, until Sanity adds it to the client
 * See https://github.com/sanity-io/sanity/issues/1177
 */
const queue = new Queue({
  concurrency: 4,
  interval: 1000 / 25,
});

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

  const texts = Object.entries(flatText)
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
        _key: path, // _key is required for arrays in Sanity
        path,
        text: {
          _type: 'localeText',
          nl: value,
          /**
           * Fall back to NL text because the field is required
           */
          en: get(en, `${key}.${path}`, value),
        },
      };
    })
    /**
     * Filter out the entries that got skipped
     */
    .filter(isDefined);

  if (isEmpty(texts)) {
    /**
     * If no text entries survived for this key, we do not store anything
     */
    continue;
  }

  const document = {
    _type: 'lokalizeSubject',
    /**
     * We use the key in the document id so that we can overwrite documents with
     * updates from Lokalize. This is only required as long as we use Lokalize
     * as our source for texts. Once we kill it, we can store these document
     * with an opaque id which allows us to freely change the key name, to
     * refactor the names we use in our code.
     *
     * The jsonKey__ prefix makes sure we don't clash with other documents in
     * sanity that have a non-opaque document id.
     */
    _id: `jsonKey__${key}`,
    key,
    texts,
  };

  queue.add(() =>
    client
      /**
       * Strings from JSON will be overwriting whatever is in Sanity, because
       * until we kill Lokalize those files are the source of truth. However,
       * newly created text entries in Sanity will remain untouched, so we could
       * already start to extend the Lokalize string set using Sanity if we want
       * to.
       */
      .createOrReplace(document)
      .catch((err) => {
        console.error(
          `Failed to create document for key ${key}: ${err.message}`
        );
      })
  );
}

queue.on('idle', () => console.log(`There were ${issueCounter} issues`));
