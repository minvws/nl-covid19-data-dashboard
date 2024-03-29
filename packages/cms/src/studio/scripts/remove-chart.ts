import { DataScopeKey } from '@corona-dashboard/common';
import { snakeCase } from 'change-case';
import prompts from 'prompts';
import { isDefined } from 'ts-is-present';
import { client } from '../client';
import { onState } from '../utils/abort-process';
import { getSchemaMetricProperties } from '../utils/get-schema-metric-properties';
import { getSchemaMetrics } from '../utils/get-schema-metrics';
import { initialiseEnvironmentVariables } from '../../lokalize/utils/initialise-environment-variables';

type Element = {
  scope: DataScopeKey;
  metricName: string;
  metricProperty: string | undefined;
  _type: 'timeSeries';
  _id: string;
};

const promptForElement = async (): Promise<string | undefined> => {
  const element: Element = {
    scope: 'nl',
    metricName: '',
    metricProperty: undefined,
    _type: 'timeSeries',
    _id: '',
  };

  const choices = [
    { title: 'National', value: 'nl' },
    { title: 'National (archived)', value: 'archived_nl' },
    { title: 'Municipal', value: 'gm' },
    { title: 'Municipal (archived)', value: 'archived_gm' },
  ];

  const scopeResponse = (await prompts({
    type: 'select',
    name: 'scope',
    message: 'Select the scope for this element:',
    choices,
    onState,
  })) as { scope: DataScopeKey };

  element.scope = scopeResponse.scope;

  const metricNameResponse = (await prompts({
    type: 'select',
    name: 'metricName',
    message: 'Select the metric name for this element:',
    choices: getSchemaMetrics(scopeResponse.scope)
      .sort()
      .map((metric) => ({
        title: metric,
        value: metric,
      })),
    onState,
  })) as { metricName: string };

  element.metricName = metricNameResponse.metricName;

  const metricPropertyConfirmationresponse = await prompts([
    {
      type: 'confirm',
      name: 'isConfirmed',
      message: 'Do you need to select a metric property?',
      initial: false,
    },
  ]);

  if (metricPropertyConfirmationresponse.isConfirmed) {
    const metricPropertyResponse = (await prompts({
      type: 'select',
      name: 'metricProperty',
      message: 'Select a metric property for this element:',
      choices: getSchemaMetricProperties(scopeResponse.scope, metricNameResponse.metricName)
        .sort()
        .map((metricProperty) => ({
          title: metricProperty,
          value: metricProperty,
        })),
      onState,
    })) as { metricProperty: string };

    element.metricProperty = metricPropertyResponse.metricProperty;
  }

  element._id = elementToId(element);

  const isAbsent = await isExistingElement(element);

  if (isAbsent) {
    const notExistsStartOverResponse = await prompts([
      {
        type: 'confirm',
        name: 'isConfirmed',
        message: `The element ${elementToId(element)} does not exist in the dataset, do you want to start over?\nChoosing no will exit this prompt.`,
        initial: false,
      },
    ]);
    if (notExistsStartOverResponse.isConfirmed) {
      process.stdout.write('\x1Bc');
      return promptForElement();
    } else {
      console.log('Aborting...');
      process.exit(0);
    }
  }

  const containsNoEvents = await hasNoEventCollections(element);

  if (!containsNoEvents) {
    const eventCollectionsPresentStartOverResponse = await prompts([
      {
        type: 'confirm',
        name: 'isConfirmed',
        message: `The element ${elementToId(
          element
        )} still has timeline event collection(s) attached to it and cannot be removed, do you want to start over?\nChoosing no will exit this prompt.`,
        initial: false,
      },
    ]);
    if (eventCollectionsPresentStartOverResponse.isConfirmed) {
      process.stdout.write('\x1Bc');
      return promptForElement();
    } else {
      console.log('Aborting...');
      process.exit(0);
    }
  }

  const isCorrectResponse = await prompts([
    {
      type: 'confirm',
      name: 'isConfirmed',
      message: `Is this correct?\n${elementToId(element)}\nWhen choosing 'yes' this element will be removed from both development and production.`,
      initial: false,
    },
  ]);

  if (isCorrectResponse.isConfirmed) {
    return `//groq
      *[_type == '${element._type}' && _id == '${element._id}'][0]
    `;
  }
};

const hasNoEventCollections = async (element: Element) => {
  const { _type, _id } = element;
  const query = `//groq
    *[_type == '${_type}' && _id == '${_id}' && defined(timelineEventCollections)][0]
  `;

  const developmentClient = client.withConfig({ dataset: 'development' });
  const productionClient = client.withConfig({ dataset: 'production' });

  const developmentDocument = await developmentClient.fetch(query);
  const productionDocument = await productionClient.fetch(query);

  return developmentDocument === null && productionDocument === null;
};

const isExistingElement = async (element: Element) => {
  const { _type, _id } = element;
  const query = `//groq
    *[_type == '${_type}' && _id == '${_id}'][0]
  `;

  const developmentClient = client.withConfig({ dataset: 'development' });
  const productionClient = client.withConfig({ dataset: 'production' });

  const developmentDocument = await developmentClient.fetch(query);
  const productionDocument = await productionClient.fetch(query);

  return developmentDocument === null && productionDocument === null;
};

const elementToId = (element: Element) =>
  `${element.scope}__${element.metricName}__${snakeCase(element._type)}${isDefined(element.metricProperty) ? `__${element.metricProperty}` : ''}`;

const removeElement = async (query: string, developmentClient: any, productionClient: any) => {
  return Promise.all([developmentClient.delete({ query: query }), productionClient.delete({ query: query })]);
};

(async () => {
  await initialiseEnvironmentVariables();

  const developmentClient = client.withConfig({ dataset: 'development', token: process.env.SANITY_API_TOKEN });
  const productionClient = client.withConfig({ dataset: 'production', token: process.env.SANITY_API_TOKEN });

  const query = await promptForElement();

  if (isDefined(query)) {
    await removeElement(query, developmentClient, productionClient);
  }

  console.log('Have a swell day, friend. Goodluck and godspeed in all your endevours!');
})();
