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

    for (const document of result) {
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
