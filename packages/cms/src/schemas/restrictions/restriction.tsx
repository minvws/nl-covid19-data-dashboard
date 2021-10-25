import { Icon as TIcon } from '@corona-dashboard/icons';
import React from 'react';
import {
  RestrictionIconInput,
  RestrictionIconKey,
  restrictionIcons,
} from '../../components/restriction-icon';

export const restriction = {
  type: 'object',
  title: 'Maatregel',
  name: 'restriction',
  fields: [
    {
      title: 'Maatregel',
      description: 'Beschrijf de maatregel voor deze categorie',
      name: 'text',
      type: 'localeString',
    },
    {
      title: 'Icoon',
      description: 'Welk icoon moet er naast de maatregel staan?',
      name: 'icon',
      type: 'string',
      inputComponent: RestrictionIconInput,
    },
  ],
  preview: {
    select: {
      title: 'text.nl',
      icon: 'icon',
    },
    prepare({ title, icon }: { icon: RestrictionIconKey; title: string }) {
      const TheIcon = restrictionIcons[icon] as TIcon;

      return {
        title: title,
        media: icon ? <TheIcon /> : null,
      };
    },
  },
};
