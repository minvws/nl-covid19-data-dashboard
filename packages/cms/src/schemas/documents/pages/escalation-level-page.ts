import { Radio } from '@sanity/ui';
import { Rule } from '~/sanity';

export const escalationLevelPage = {
  title: 'Inschaling risiconiveau',
  name: 'escalationLevelPage',
  type: 'document',
  fields: [
    {
      title: 'Risiconiveau kiezen',
      name: 'riskLevel',
      type: 'array',
      of: [{ type: 'number' }],
      validation: (rule: Rule) => rule.required().length(1),
      options: {
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

// 'riskLevel': *[_type == 'escalationLevelPage']{
//   riskLevel,
// }[0]
