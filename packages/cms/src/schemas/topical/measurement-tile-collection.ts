
import { Rule } from '~/sanity';

export const measurementTileCollection = {
  type: 'object',
  title: 'Thema tegel collectie',
  name: 'measurementTileCollection',
  fields: [
    {
      title: 'Tegels',
      name: 'tiles',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'measurementTile' } }],
      validation: (rule: Rule) => rule.required(),
    },
  ],
};
