import React from 'react';
import { Icon } from '../../components/icons/icon';
import {
  RestrictionIcon,
  restrictionIcons,
} from '../../components/icons/icons';

import { Icon as TIcon } from '@corona-dashboard/icons';

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
      const TheIcon = restrictionIcons[icon] as TIcon;

      return {
        title: title,
        media: icon ? <TheIcon /> : null,
      };
    },
  },
};
