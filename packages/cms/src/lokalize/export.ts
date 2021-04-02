import { unflatten } from 'flat';
import fs from 'fs';
import { client } from '../client';
import prettier from 'prettier';

client
  .fetch(`*[_type == 'lokalizeSubject'] | order(key asc)`)
  .then((result: any[]) => {
    const nl: Record<string, string> = {};
    const en: Record<string, string> = {};

    for (const document of result) {
      for (const obj of document.texts) {
        nl[`${document.key}.${obj.path}`] = obj.text.nl;
        /**
         * Here we could make an automatic fallback to Dutch texts if English is missing.
         */
        en[`${document.key}.${obj.path}`] = obj.text.en || obj.text.nl;
      }
    }

    fs.writeFileSync(
      'nl_export.json',
      prettier.format(JSON.stringify(unflatten(nl)), { parser: 'json' }),
      {
        encoding: 'utf8',
      }
    );
    fs.writeFileSync(
      'en_export.json',
      prettier.format(JSON.stringify(unflatten(en)), { parser: 'json' }),
      {
        encoding: 'utf8',
      }
    );
  });
