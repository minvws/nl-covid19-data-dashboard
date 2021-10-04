import { Rule } from '~/sanity';
import { ChartConfigurationInput } from '../../custom-inputs/chart-configuration-input';

export const Chart = {
  title: 'Dashboard Grafiek',
  name: 'chart',
  type: 'object',
  fields: [
    {
      name: 'config',
      type: 'string',
      title: 'Configuratie',
      inputComponent: ChartConfigurationInput,
      validation: (rule: Rule) => rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'config',
    },
  },
};
