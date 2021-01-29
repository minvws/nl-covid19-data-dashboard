import chalk from 'chalk';
import meow from 'meow';

import jsonDiff from 'json-diff';

import nl from '../../../app/src/locale/nl.json';
import en from '../../../app/src/locale/en.json';

function objectsHaveSameKeys(
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>
) {
  const objects = [obj1, obj2];
  const allKeys: string[] = objects.reduce(
    (keys: string[], object) => keys.concat(Object.keys(object)),
    []
  );

  const union = new Set(allKeys);
  return objects.every((object) => union.size === Object.keys(object).length);
}

if (objectsHaveSameKeys(nl, en)) {
  console.log(chalk.green.bold(`Locale files have the same keys`));
  console.info(
    chalk.bold.green('\n  Locale validation finished without errors!  \n')
  );
  process.exit(0);
} else {
  console.group();
  console.error(chalk.bgRed.bold(`  Locale files have different keys  \n`));
  console.log(
    jsonDiff.diffString(
      nl,
      en,
      {},
      // @ts-ignore
      {
        keysOnly: true,
      }
    )
  );
  console.groupEnd();
  console.error(
    chalk.bgRed.bold(`\n  Ensure your locale files have the same structure  \n`)
  );
  process.exit(1);
}
