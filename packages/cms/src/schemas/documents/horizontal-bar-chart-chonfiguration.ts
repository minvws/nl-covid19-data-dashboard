import { Rule } from '~/sanity';

export const horizontalBarChartConfiguration = {
  title: 'Horizontale Bar Grafiek configuratie',
  name: 'horizontalBarChartConfiguration',
  type: 'document',
  fieldsets: [
    {
      title: 'Configuratie',
      name: 'configuration',
      options: {
        collapsible: true,
        collapsed: false,
      },
    },
    {
      title: 'Data opties',
      name: 'options',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
  fields: [
    {
      title: 'Titel',
      name: 'title',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
      fieldset: 'configuration',
    },
  ],
};
