import { REQUIRED } from '../../validation';

export const adviceLink = {
  name: 'adviceLink',
  title: "'Adviezen' sectie link",
  type: 'document',
  fields: [
    {
      title: 'Link Label',
      description: 'Het label voor de link.',
      name: 'linkLabel',
      type: 'localeString',
      validation: REQUIRED,
    },
    {
      title: 'Link URL',
      description: 'De bestemming van de link. Gebruik altijd relatieve URLs.',
      name: 'linkUrl',
      type: 'string',
      validation: REQUIRED,
    },
  ],
  preview: {
    select: {
      title: 'linkLabel.nl',
      subtitle: 'linkUrl',
    },
  },
};
