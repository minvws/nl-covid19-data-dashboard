import { REQUIRED } from '../../validation';

export const themeLink = {
  type: 'document',
  title: 'Thema link',
  name: 'themeLink',
  fields: [
    {
      title: 'Call to action',
      name: 'cta',
      type: 'link',
      validation: REQUIRED,
    },
  ],
  preview: {
    select: {
      title: 'cta.title.nl',
    },
  },
};
