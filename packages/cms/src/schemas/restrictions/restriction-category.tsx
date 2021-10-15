import { Icon as TIcon } from '@corona-dashboard/icons';
import React from 'react';
import {
  RestrictionIconInput,
  RestrictionIconKey,
  restrictionIcons,
} from '../../components/restriction-icon';

export const restrictionCategory = {
  title: 'Restrictie Categorie',
  name: 'restrictionCategory',
  type: 'object',
  fields: [
    {
      title: 'Titel van groep',
      description: 'Hoe noem je deze groep maatregelen?',
      name: 'title',
      type: 'localeString',
    },
    {
      title: 'Icoon',
      description: 'Welk icoon moet er naast de maatregelen categorie staan?',
      name: 'icon',
      type: 'string',
      inputComponent: RestrictionIconInput,
    },
    {
      title: 'Maatregelen',
      description: 'Per groep bestaat er een lijst maatregelen',
      name: 'restrictions',
      type: 'array',
      of: [{ type: 'restrictionGroup' }],
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
        title,

        // `media` takes a function, string or React element
        // Remember to import React from 'react' if you are rendering React components like below
        media: icon ? <TheIcon /> : null,
      };
    },
  },
};
