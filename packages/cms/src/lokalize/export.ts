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
  .fetch(
    `*[_type == 'lokalizeText' && !(_id in path("drafts.**"))] | order(lokalize_path asc)`
  )
  .then((result: any[]) => {
    const nl: Record<string, string> = {};
    const en: Record<string, string> = {};

    for (const document of result) {
      /**
       * paths inside the `__root` subject should be placed under the path
       * in the root of the exported json
       */
      const key =
        document.subject === '__root'
          ? document.path
          : `${document.subject}.${document.path}`;

      nl[key] = document.display_empty ? '' : document.text.nl.trim();
      en[key] = document.display_empty ? '' : document.text.en?.trim();

      if (!document.text.en?.trim()) {
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

    fs.writeFileSync(
      /**
       * @TODO rename these files ones we make the switch
       */
      path.join(localeDirectory, 'nl_export.json'),
      prettier.format(JSON.stringify(unflatten(nl, { object: true })), {
        parser: 'json',
      }),
      {
        encoding: 'utf8',
      }
    );
    fs.writeFileSync(
      path.join(localeDirectory, 'en_export.json'),
      prettier.format(JSON.stringify(unflatten(en, { object: true })), {
        parser: 'json',
      }),
      {
        encoding: 'utf8',
      }
    );
  })
  .catch((err) => {
    console.log(`Export failed: ${err.message}`);
    process.exit(1);
  });
