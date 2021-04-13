import {
  assert,
  FeatureDefinition,
  FeatureName,
  features,
  MetricScope,
} from '@corona-dashboard/common';
import chalk from 'chalk';
import { isEmpty, get, flatten } from 'lodash';
import meow from 'meow';
import path from 'path';
import { isDefined } from 'ts-is-present';
import { jsonDirectory } from '../config';
import { getSchemaInfo, SchemaInfo } from '../schema/get-schema-info';
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

type Failure = {
  feature: FeatureDefinition<FeatureName>;
  messages: string[];
};

async function main() {
  const directory = jsonDirectory;
  const isVerbose = cli.flags.verbose;

  console.log('Fail early?', cli.flags.failEarly);

  const schemaInfo = getSchemaInfo(directory);

  const allFailures: Failure[] = [];

  for (const feature of features) {
    if (isVerbose) {
      console.log(
        'Feature',
        feature.name,
        feature.isEnabled ? ': enabled' : ': disabled'
      );
    }

    const messages = await validateFeatureData(feature, schemaInfo);

    if (messages) {
      allFailures.push({ feature, messages });
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
      `There were ${allFailures.length} features that failed to validate their data.`
    );
    process.exit(1);
  } else {
    logSuccess('All features are validated!');
  }
}

main().then(
  () => process.exit(0),
  (err: Error) => {
    logError(err.message);
    process.exit(1);
  }
);

/**
 * Validate if the data is there or not there. Returns one validation error
 * message per scope.
 */
async function validateFeatureData(
  feature: FeatureDefinition<FeatureName>,
  schemaInfo: SchemaInfo
) {
  if (feature.metricName) {
    const promisedResults = feature.metricScopes.map((scope) =>
      validateMetricNameForScope(
        feature.metricName!,
        scope,
        feature.isEnabled,
        schemaInfo
      )
    );

    const results = await Promise.all(promisedResults);

    const messages = results.filter(isDefined);

    /**
     * If errors occurred on the metric name level then we can already return and
     * do not test the properties.
     */
    if (!isEmpty(messages)) {
      return messages;
    }
  }

  if (feature.metricProperties) {
    assert(
      feature.metricName,
      'If a feature defines metricProperties it should also have a metricName'
    );

    const promisedResults = feature.metricScopes.map((scope) =>
      validateMetricPropertiesForScope(
        feature.metricName!,
        feature.metricProperties!,
        scope,
        feature.isEnabled,
        schemaInfo
      )
    );

    const results = await Promise.all(promisedResults);
    const messages = results.filter(isDefined);

    /**
     * If errors occurred on the metric name level then we can already return and
     * do not test the properties.
     */
    if (!isEmpty(messages)) {
      return messages;
    }
  }
}

async function validateMetricNameForScope(
  metricName: string,
  scope: MetricScope,
  isEnabled: boolean,
  schemaInfo: SchemaInfo
) {
  const { files, basePath } = schemaInfo[scope];

  const promisedResults = files.map(async (file) => {
    const data = await readObjectFromJsonFile(path.join(basePath, file));

    if (isEnabled && !data[metricName]) {
      return `-- ${file} is missing data for ${metricName}`;
    }

    if (!isEnabled && data[metricName]) {
      return `++ ${file} contains data for ${metricName}`;
    }
  });

  const results = (await Promise.all(promisedResults)).filter(isDefined);

  const messages = results.filter(isDefined);

  return isEmpty(messages) ? undefined : messages.join('\n');
}

async function validateMetricPropertiesForScope(
  metricName: string,
  metricProperties: string[],
  scope: MetricScope,
  isEnabled: boolean,
  schemaInfo: SchemaInfo
) {
  const { files, basePath } = schemaInfo[scope];

  const promisedResults = files.map(async (file) => {
    const data = await readObjectFromJsonFile(path.join(basePath, file));

    const messages = [];

    for (const metricProperty of metricProperties) {
      /**
       * @TODO not sure what the best strategy here is. Not all metrics are
       * defined the same and some will not have this last_value. So I think we
       * should do two checks, one property check directly on the metric and one
       * in last_value
       */
      if (isEnabled && !get(data, [metricName, 'last_value', metricProperty])) {
        messages.push(
          `-- ${file} is missing data for ${metricName}.${metricProperty}`
        );
      }

      if (!isEnabled && get(data, [metricName, 'last_value', metricProperty])) {
        messages.push(
          `++ ${file} contains data for ${metricName}.${metricProperty}`
        );
      }
    }
    return messages;
  });

  const results = await Promise.all(promisedResults);

  const messages = results.flat().filter(isDefined);

  return isEmpty(messages) ? undefined : messages.join('\n');
}
