import prompts from 'prompts';
import { isDefined } from 'ts-is-present';
import { getClient } from '../client';
import {
  loadSchemaMetricProperties,
  loadSchemaMetrics,
  Scope,
} from './logic/load-schema';

type Element = {
  scope: Scope;
  metricName: string;
  metricProperty: string | undefined;
  _type: ElementType;
};

type ElementType = 'choropleth' | 'timeSeries' | 'kpi';

const devClient = getClient('development');
const prodClient = getClient('production');

(async function run() {
  const element = await promptForElement();

  if (isDefined(element)) {
    await saveElement(element);
  }

  console.log('Have a nice day...');
})();

async function promptForElement(): Promise<Element | undefined> {
  const element: Element = {
    scope: 'nl',
    metricName: '',
    metricProperty: undefined,
    _type: 'choropleth',
  };

  const choices = [
    { title: 'Municipal', value: 'gm' },
    { title: 'Safety region', value: 'vr' },
    { title: 'National', value: 'nl' },
    { title: 'International', value: 'in' },
  ];

  const scopeResponse = (await prompts({
    type: 'select',
    name: 'scope',
    message: 'Select the scope for this element:',
    choices,
    onState,
  })) as { scope: Scope };

  element.scope = scopeResponse.scope;

  const metricNameResponse = (await prompts({
    type: 'select',
    name: 'metricName',
    message: 'Select the metric name for this element:',
    choices: loadSchemaMetrics(scopeResponse.scope).map((x) => ({
      title: x,
      value: x,
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
      choices: loadSchemaMetricProperties(
        scopeResponse.scope,
        metricNameResponse.metricName
      ).map((x) => ({
        title: x,
        value: x,
      })),
      onState,
    })) as { metricProperty: string };

    element.metricProperty = metricPropertyResponse.metricProperty;
  }

  const elemenTypeChoices = [
    { title: 'Time series', value: 'timeSeries' },
    { title: 'Choropleth', value: 'choropleth' },
    { title: 'KPI', value: 'kpi' },
  ];

  const typeResponse = (await prompts({
    type: 'select',
    name: '_type',
    message: 'Select the element type:',
    choices: elemenTypeChoices,
    onState,
  })) as { _type: ElementType };

  element._type = typeResponse._type;

  const isNew = await isNewElement(element);

  if (!isNew) {
    const startOverResponse = await prompts([
      {
        type: 'confirm',
        name: 'isConfirmed',
        message: `The element ${elementToString(
          element
        )} already exists, do you want to start over?\nChoosing no will exit this prompt.`,
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
      message: `Is this correct?\n${elementToString(
        element
      )}\nWhen choosing 'yes' this element will be saved to both development and production.`,
      initial: false,
    },
  ]);

  if (isCorrectResponse.isConfirmed) {
    return element;
  }
}

async function isNewElement(element: Element) {
  const { _type, scope, metricName, metricProperty } = element;
  const query = !isDefined(metricProperty)
    ? `*[_type == '${_type}' && scope == '${scope}' && metricName == '${metricName}'][0]`
    : `*[_type == '${_type}' && scope == '${scope}' && metricName == '${metricName}' && metricProperty == '${metricProperty}'][0]`;

  const devDocument = await devClient.fetch(query);
  const prodDocument = await prodClient.fetch(query);

  return devDocument === null && prodDocument === null;
}

function elementToString(element: Element) {
  if (!isDefined(element.metricProperty)) {
    return `${element.scope}.${element.metricName}.${element._type}`;
  }
  return `${element.scope}.${element.metricName}.${element.metricProperty}.${element._type}`;
}

async function saveElement(element: Element) {
  return Promise.all([devClient.create(element), prodClient.create(element)]);
}

function onState(state: { aborted: boolean }) {
  if (state.aborted) {
    process.nextTick(() => {
      process.exit(0);
    });
  }
}
