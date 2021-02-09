/**
 * This script checks if all last_value values correspond to the actual last value in
 * the values array for that same metric.
 */
import {
  sortTimeSeriesInDataInPlace,
  TimeSeriesMetric,
  TimestampedValue,
} from '@corona-dashboard/common';
import chalk from 'chalk';
import { isEmpty, pick } from 'lodash';
import meow from 'meow';
import path from 'path';
import { isDefined } from 'ts-is-present';
import { jsonDirectory } from '../config';
import { getFilesWithTimeSeries } from '../schema-information';
import {
  getTimeSeriesMetricProperties,
  readJsonFile,
  validateLastValue,
} from './logic';

const logSuccess = (...args: unknown[]) =>
  console.log(chalk.greenBright(...args));
const logError = (...args: unknown[]) => console.error(chalk.red(...args));

const cli = meow(
  `
    Usage
      $ validate-last-values

    Options
      --verbose, -v Enable verbose output
      --fail-early, -e Exit on first failure

    Examples
      $ validate-last-values -e
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

type Failure = { fileName: string; metricProperty: string };

async function main() {
  const directory = jsonDirectory;
  const isVerbose = cli.flags.verbose;

  console.log('Fail early?', cli.flags.failEarly);

  const files = getFilesWithTimeSeries(directory);

  const allFailures: Failure[] = [];

  for (const file of files) {
    const data = readJsonFile(path.join(directory, file));

    sortTimeSeriesInDataInPlace(data);

    const metricProperties = getTimeSeriesMetricProperties(data);

    if (isVerbose) {
      console.log('Checking', metricProperties);
    }

    const timeSeriesData = pick(data, metricProperties) as Record<
      string,
      TimeSeriesMetric<TimestampedValue>
    >;

    const promisedOperations = metricProperties.map((property) =>
      validateLastValue(timeSeriesData, property)
    );

    const results = await Promise.all(promisedOperations);

    const failedMetrics = results
      .filter((x) => x.success === false)
      .map((x) => x.metricProperty);

    if (!isEmpty(failedMetrics)) {
      allFailures.push(
        ...failedMetrics.map((x) => ({ metricProperty: x, fileName: file }))
      );

      if (cli.flags.failEarly) {
        console.log(
          'Found failures with --fail-early enabled, so skipping the rest...'
        );
        break;
      }
    }

    /**
     * @TODO check sewer_per_installation data
     */

    if (isDefined(data.sewer_per_installation)) {
      console.log(`@TODO check sewer_per_installation for ${file}`);
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
