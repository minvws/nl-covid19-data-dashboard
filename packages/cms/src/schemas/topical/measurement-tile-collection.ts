
import { Rule } from '~/sanity';

export const measurementTileCollection = {
  type: 'object',
  title: 'Thema tegel collectie',
  name: 'measurementTileCollection',
  fields: [
    {
      title: 'Tegels',
      description: 'De tegels',
      name: 'tiles',
      type: 'array',
      of: [{ type: 'measurementTile' }],
      validation: (rule: Rule) => rule.required(),
    },
  ],
};
