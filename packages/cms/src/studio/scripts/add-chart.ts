import { DataScopeKey } from '@corona-dashboard/common';
import { snakeCase } from 'change-case';
import prompts from 'prompts';
import { isDefined } from 'ts-is-present';
import { client } from '../client';
import { onState } from '../utils/abort-process';
import { getSchemaMetricProperties } from '../utils/get-schema-metric-properties';
import { getSchemaMetrics } from '../utils/get-schema-metrics';

type Element = {
  scope: DataScopeKey;
  metricName: string;
  metricProperty: string | undefined;
  _type: 'timeSeries';
  _id: string;
};

const developmentClient = client.withConfig({ dataset: 'development' });
const productionClient = client.withConfig({ dataset: 'production' });

const promptForElement = async (): Promise<Element | undefined> => {
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

  const isNew = await isNewElement(element);

  if (!isNew) {
    const startOverResponse = await prompts([
      {
        type: 'confirm',
        name: 'isConfirmed',
        message: `The element ${elementToId(element)} already exists, do you want to start over?\nChoosing no will exit this prompt.`,
        initial: false,
      },
    ]);
    if (startOverResponse.isConfirmed) {
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
      message: `Is this correct?\n${elementToId(element)}\nWhen choosing 'yes' this element will be saved to both development and production.`,
      initial: false,
    },
  ]);

  if (isCorrectResponse.isConfirmed) {
    return element;
  }
};

const isNewElement = async (element: Element) => {
  const { _type, _id } = element;
  const query = `//groq
    *[_type == '${_type}' && _id == '${_id}'][0]
  `;

  const developmentDocument = await developmentClient.fetch(query);
  const productionDocument = await productionClient.fetch(query);

  return developmentDocument === null && productionDocument === null;
};

const elementToId = (element: Element) =>
  `${element.scope}__${element.metricName}__${snakeCase(element._type)}${isDefined(element.metricProperty) ? `__${element.metricProperty}` : ''}`;

const saveElement = async (element: Element) => Promise.all([developmentClient.create(element), productionClient.create(element)]);

(async () => {
  const element = await promptForElement();

  if (isDefined(element)) {
    await saveElement(element);
  }

  console.log('Have a swell day, friend. Goodluck and godspeed in all your endevours!');
})();
