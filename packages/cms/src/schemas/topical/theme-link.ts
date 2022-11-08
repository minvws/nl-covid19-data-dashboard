import { REQUIRED } from '../../validation';

export const themeLink = {
  type: 'document',
  title: 'Thema link',
  name: 'themeLink',
  fields: [
    {
      title: 'Label voor mobiel',
      name: 'labelMobile',
      type: 'localeString',
      validation: REQUIRED,
    }, // ToDo add to frontend query
    {
      title: 'Label voor desktop',
      name: 'labelDesptop',
      type: 'localeString',
      validation: REQUIRED,
    }, // ToDo add to frontend query
    {
      title: 'Call to action',
      name: 'cta',
      type: 'link',
      validation: REQUIRED,
    },
  ],
  preview: {
    select: {
      title: 'cta',
    },
  },
};
