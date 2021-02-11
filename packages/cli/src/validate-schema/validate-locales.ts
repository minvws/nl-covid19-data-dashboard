import chalk from 'chalk';

import jsonDiff from 'json-diff';

import nl from '@corona-dashboard/app/src/locale/nl.json';
import en from '@corona-dashboard/app/src/locale/en.json';

function objectsHaveSameKeys(
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>
) {
  // @ts-ignore
  const diff = jsonDiff.diff(obj1, obj2, { keysOnly: true });

  // jsonDiff returns undefined if there are no differences
  if (diff) {
    // which means if diff is truthy, we found differences and should throw an error
    return false;
  }

  return true;
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
