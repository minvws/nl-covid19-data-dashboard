import { REQUIRED } from '../../validation';

export const adviceLink = {
  name: 'adviceLink',
  title: "'Adviezen' sectie link",
  type: 'document',
  fields: [
    {
      title: 'Link Label',
      description: 'Het label voor de link.',
      name: 'label',
      type: 'localeString',
      validation: REQUIRED,
    },
    {
      title: 'Link URL',
      description: 'De bestemming van de link.',
      name: 'url',
      type: 'string',
      validation: REQUIRED,
    },
  ],
  preview: {
    select: {
      title: 'label.nl',
      subtitle: 'url',
    },
  },
};
