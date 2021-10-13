import { Icon as TIcon } from '@corona-dashboard/icons';
import React from 'react';
// @ts-expect-error
import Tabs from 'sanity-plugin-tabs';
import {
  RestrictionIconInput,
  RestrictionIconKey,
  restrictionIcons,
} from '../../components/restriction-icon';

export const restrictionGroup = {
  title: 'Maatregel groep',
  name: 'restrictionGroup',
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
      type: 'object',
      inputComponent: Tabs,

      fieldsets: [
        { name: 'waakzaam', title: 'Waakzaam', options: { sortOrder: 10 } },
        { name: 'zorgelijk', title: 'Zorgelijk', options: { sortOrder: 20 } },
        { name: 'ernstig', title: 'Ernstig', options: { sortOrder: 30 } },
        {
          name: 'zeerErnstig',
          title: 'Zeer Ernstig',
          options: { sortOrder: 40 },
        },
      ],
      fields: [
        {
          title: 'Maatregelen',
          name: 'waakzaam',
          type: 'array',
          fieldset: 'waakzaam',
          of: [{ type: 'restriction' }],
        },
        {
          title: 'Maatregelen',
          name: 'zorgelijk',
          type: 'array',
          fieldset: 'zorgelijk',
          of: [{ type: 'restriction' }],
        },
        {
          title: 'Maatregelen',
          name: 'ernstig',
          type: 'array',
          fieldset: 'ernstig',
          of: [{ type: 'restriction' }],
        },
        {
          title: 'Maatregelen',
          name: 'zeerErnstig',
          type: 'array',
          fieldset: 'zeerErnstig',
          of: [{ type: 'restriction' }],
        },
      ],
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
