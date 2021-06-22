import { assert, Feature, MetricScope } from '@corona-dashboard/common';
import { get, isEmpty } from 'lodash';
import meow from 'meow';
import path from 'path';
import { isDefined } from 'ts-is-present';
import { defaultJsonDirectory, featureFlagsConfigFile } from '../config';
import { getSchemaInfo, SchemaInfo } from '../schema/schema-info';
import { logError, logSuccess, readObjectFromJsonFile } from '../utils';

const cli = meow(
  `
    Usage
      $ validate-features

    Options
      --verbose, -v Enable verbose output
      --fail-early, -e Exit on first failure

    Examples
      $ validate-features -e
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
  feature: Feature;
  messages: string[];
};

async function main() {
  const directory = defaultJsonDirectory;
  const isVerbose = cli.flags.verbose;

  console.log('Fail early?', cli.flags.failEarly);

  const schemaInfo = getSchemaInfo(directory);

  const allFailures: Failure[] = [];

  /**
   * The features configuration is imported dynamically here. We could include
   * it in the common bundle and import from there, but it feels a little
   * annoying having to place an app configuration in the common bundle and
   * build it before it becomes effective.
   */
  const { features } = (await import(featureFlagsConfigFile)) as {
    features: Feature[];
  };

  for (const feature of features) {
    if (isVerbose) {
      console.log(
        `Feature ${feature.name}: ${feature.isEnabled ? 'enabled' : 'disabled'}`
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
    allFailures.forEach((failure) =>
      logError(
        `Failed to validate ${
          failure.feature.isEnabled ? 'enabled' : 'disabled'
        } feature ${failure.feature.name}:\n${failure.messages}`
      )
    );
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
async function validateFeatureData(feature: Feature, schemaInfo: SchemaInfo) {
  /**
   * First we check if there are metric properties involved, because in that
   * case we only check the properties and do not enforce existence/absence of
   * the full metric.
   */
  const {
    metricScopes = ['nl'],
    metricName,
    metricProperties,
    name,
    isEnabled,
  } = feature;

  if (metricProperties) {
    assert(
      metricName,
      'If a feature defines metricProperties it should also have a metricName'
    );

    const promisedResults = metricScopes.map((scope) =>
      validateMetricPropertiesForScope(
        metricName,
        metricProperties,
        scope,
        isEnabled,
        schemaInfo
      )
    );

    const results = await Promise.all(promisedResults);
    const messages = results.filter(isDefined);

    /**
     * If errors occurred on the metric name level then we can already return
     * and do not test the properties.
     */
    if (!isEmpty(messages)) {
      return messages;
    }
  } else if (metricName) {
    assert(
      metricScopes,
      `Missing metricScopes configuration for feature ${name}`
    );
    const promisedResults = metricScopes.map((scope) =>
      validateMetricNameForScope(metricName, scope, isEnabled, schemaInfo)
    );

    const results = await Promise.all(promisedResults);

    const messages = results.filter(isDefined);

    /**
     * If errors occurred on the metric name level then we can already return
     * and do not test the properties.
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
