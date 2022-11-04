import { Rule } from '~/sanity';

export const themeTileCollection = {
  type: 'object',
  title: 'Thema tegel collectie',
  name: 'themeTileCollection',
  fields: [
    {
      title: 'Tegels',
      name: 'tiles',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'themeTile' } }],
      validation: (rule: Rule) => rule.required(),
    },
  ],
};
