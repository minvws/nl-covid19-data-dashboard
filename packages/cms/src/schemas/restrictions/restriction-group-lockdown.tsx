import { Icon as TIcon } from '@corona-dashboard/icons';
import React from 'react';
import {
  RestrictionIconInput,
  RestrictionIconKey,
  restrictionIcons,
} from '../../components/restriction-icon';

export const restrictionGroupLockdown = {
  title: 'Lockdown groep',
  name: 'restrictionGroupLockdown',
  type: 'object',
  fields: [
    {
      title: 'Maatregel groep',
      description: 'Waar gaat deze maatregel groep over?',
      name: 'title',
      type: 'localeString',
    },
    {
      title: 'Icoon',
      description: 'Welk icoon moet er naast de maatregelen groep staan?',
      name: 'icon',
      type: 'string',
      inputComponent: RestrictionIconInput,
    },
    {
      name: 'restrictions',
      type: 'array',
      of: [{ type: 'restriction' }],
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
      icon: 'icon',
    },
    prepare(selection: { icon: RestrictionIconKey; title: string }) {
      const { title, icon } = selection;

      const TheIcon = restrictionIcons[icon] as TIcon;

      return {
        title: title,

        // `media` takes a function, string or React element
        // Remember to import React from 'react' if you are rendering React components like below
        media: icon ? <TheIcon /> : null,
      };
    },
  },
};
