import { unflatten } from 'flat';
import fs from 'fs';
import { client } from '../client';
import prettier from 'prettier';
import path from 'path';

const localeDirectory = path.resolve(
  __dirname,
  '..', // src
  '..', // cms
  '..', // packages
  'app/src/locale'
);

client
  .fetch(`*[_type == 'lokalizeText'] | order(subject asc)`)
  .then((result: any[]) => {
    const nl: Record<string, string> = {};
    const en: Record<string, string> = {};

    /**
     * Both drafts as published documents are part of the query-result because
     * the client is authenticated with a sanity token.
     */
    const drafts = result.filter((x) => x._id.startsWith('drafts.'));
    const published = result.filter((x) => !x._id.startsWith('drafts.'));

    for (const document of published) {
      const key = `${document.subject}.${document.path}`;
      nl[key] = document.text.nl.trim();
      en[key] = document.text.en?.trim();

      if (!en[key]) {
        /**
         * Here we could make an automatic fallback to Dutch texts if English is missing.
         */
        console.log(
          'Missing english translation for path:',
          document.lokalize_path
        );
        en[key] = nl[key];
      }
    }

    /**
     * non-production builds will display draft translations
     */
    if (process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production') {
      for (const document of drafts) {
        const key = `${document.subject}.${document.path}`;
        nl[key] = document.text.nl.trim();
        en[key] = document.text.en?.trim();

        if (!en[key]) {
          /**
           * Here we could make an automatic fallback to Dutch texts if English is missing.
           */
          console.log(
            'Missing english DRAFT translation for path:',
            document.lokalize_path
          );
          en[key] = nl[key];
        }
      }
    }

    fs.writeFileSync(
      /**
       * @TODO rename these files ones we make the switch
       */
      path.join(localeDirectory, 'nl_export.json'),
      prettier.format(JSON.stringify(unflatten(nl)), { parser: 'json' }),
      {
        encoding: 'utf8',
      }
    );
    fs.writeFileSync(
      path.join(localeDirectory, 'en_export.json'),
      prettier.format(JSON.stringify(unflatten(en)), { parser: 'json' }),
      {
        encoding: 'utf8',
      }
    );
  })
  .catch((err) => {
    console.log(`Export failed: ${err.message}`);
    process.exit(1);
  });
