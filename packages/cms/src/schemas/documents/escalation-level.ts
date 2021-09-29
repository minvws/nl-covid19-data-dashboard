import { Radio } from '@sanity/ui';
import { Rule } from '~/sanity';

export const riskLevelNational = {
  title: 'Inschaling risiconiveau nationaal',
  name: 'riskLevelNational',
  type: 'document',
  fields: [
    {
      title: 'Risiconiveau kiezen',
      name: 'riskLevel',
      type: 'number',
      of: [{ type: 'number' }],
      options: {
        layout: 'radio',
        list: [
          { title: 'Waakzaam', value: 1 },
          { title: 'Zorgelijk', value: 2 },
          { title: 'Ernstig', value: 3 },
        ],
      },
    },
    {
      title: 'Inschaling vanaf',
      name: 'date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: (rule: Rule) => rule.required(),
    },
  ],
};
