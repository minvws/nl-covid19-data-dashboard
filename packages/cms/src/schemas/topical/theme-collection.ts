import { Rule } from '~/sanity';
import { REQUIRED } from '../../validation';

export const themeCollection = {
  type: 'document',
  title: 'Thema collectie',
  name: 'themeCollection',
  fields: [
    {
      title: "Thema's",
      name: 'themes',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'theme' } }],
      validation: REQUIRED,
    },
  ],
};
