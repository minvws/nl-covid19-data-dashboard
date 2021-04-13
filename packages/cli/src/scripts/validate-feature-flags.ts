import { features } from '@corona-dashboard/common';
import chalk from 'chalk';
import { isEmpty } from 'lodash';
import meow from 'meow';
import path from 'path';
import { jsonDirectory } from '../config';
import { getSchemaInfo } from '../schema/get-schema-info';
import { readObjectFromJsonFile } from '../utils';

const logSuccess = (...args: unknown[]) =>
  console.log(chalk.greenBright(...args));
const logError = (...args: unknown[]) => console.error(chalk.red(...args));

const cli = meow(
  `
    Usage
      $ validate-feature-flags

    Options
      --verbose, -v Enable verbose output
      --fail-early, -e Exit on first failure

    Examples
      $ validate-feature-flags -e
`,
  {
    flags: {
      failEarly: {
        type: 'boolean',
        alias: 'e',
      },
      verbose: {
        type: 'boolean',
        alias: 'v',
      },
    },
  }
);

type Failure = { fileName: string; metricName: string };

async function main() {
  const directory = jsonDirectory;
  const isVerbose = cli.flags.verbose;

  console.log('Fail early?', cli.flags.failEarly);

  const schemaInfo = getSchemaInfo(directory);

  const allFailures: Failure[] = [];

  for (const feature of features) {
    const data = await readObjectFromJsonFile(path.join(directory, file));

    if (isVerbose) {
      console.log(
        'Feature',
        feature.name,
        feature.isEnabled ? ': enabled' : ': disabled'
      );
    }

    if (cli.flags.failEarly && !isEmpty(allFailures)) {
      console.log(
        'Found failures with --fail-early enabled, so skipping the rest...'
      );
      break;
    }
  }

  if (!isEmpty(allFailures)) {
    console.error(allFailures);
    logError(
      `There were ${allFailures.length} instances that failed to validate their last_value data.`
    );
    process.exit(1);
  } else {
    logSuccess('All last_value data was validated!');
  }
}

main().then(
  () => process.exit(0),
  (err: Error) => {
    logError(err.message);
    process.exit(1);
  }
);
