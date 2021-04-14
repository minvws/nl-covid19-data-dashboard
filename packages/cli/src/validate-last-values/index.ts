/**
 * This script checks if all last_value values correspond to the actual last
 * value in the values array for that same metric.
 */
import {
  SewerPerInstallationData,
  sortTimeSeriesInDataInPlace,
  TimeSeriesMetric,
} from '@corona-dashboard/common';
import chalk from 'chalk';
import { isEmpty, pick } from 'lodash';
import meow from 'meow';
import path from 'path';
import { isDefined } from 'ts-is-present';
import { defaultJsonDirectory } from '../config';
import { getFilesWithTimeSeries } from '../schema-information';
import {
  getTimeSeriesMetricNames,
  readObjectFromJsonFile,
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

type Failure = { fileName: string; metricName: string };

async function main() {
  const directory = defaultJsonDirectory;
  const isVerbose = cli.flags.verbose;

  console.log('Fail early?', cli.flags.failEarly);

  const files = getFilesWithTimeSeries(directory);

  const allFailures: Failure[] = [];

  for (const file of files) {
    const data = readObjectFromJsonFile(path.join(directory, file));

    sortTimeSeriesInDataInPlace(data);

    const metricNames = getTimeSeriesMetricNames(data);

    if (isVerbose) {
      console.log('Checking', metricNames);
    }

    {
      const timeSeriesData = pick(data, metricNames) as Record<
        string,
        TimeSeriesMetric
      >;

      const results = metricNames.map((metricName) => {
        const metricData = timeSeriesData[metricName];
        const success = validateLastValue(metricData);
        return { success, metricName };
      });

      const failedMetrics = results
        .filter((x) => x.success === false)
        .map((x) => x.metricName);

      allFailures.push(
        ...failedMetrics.map((x) => ({ metricName: x, fileName: file }))
      );
    }

    /**
     * The sewer_per_installation schema differs in structure from all
     * other time series data so we validate it separately.
     */
    if (isDefined(data.sewer_per_installation)) {
      const perInstallationData = data.sewer_per_installation as SewerPerInstallationData;

      const results = perInstallationData.values.map((metricData) => {
        const installationName = metricData.rwzi_awzi_name;

        const success = validateLastValue(metricData);
        return {
          success,
          metricName: `sewer_per_installation.${installationName}`,
        };
      });

      const failedMetrics = results
        .filter((x) => x.success === false)
        .map((x) => x.metricName);

      allFailures.push(
        ...failedMetrics.map((x) => ({ metricName: x, fileName: file }))
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
