import React from 'react';
import { Icon } from '../../components/icons/icon';
import {
  RestrictionIcon,
  restrictionIcons,
} from '../../components/icons/icons';

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
      inputComponent: Icon,
    },
  ],
  preview: {
    select: {
      title: 'text.nl',
      icon: 'icon',
    },
    prepare({ title, icon }: { icon: RestrictionIcon; title: string }) {
      return {
        title: title,
        media: (
          <img
            src={restrictionIcons[icon] || undefined}
            alt="Selection icon for restriction"
          />
        ),
      };
    },
  },
};
