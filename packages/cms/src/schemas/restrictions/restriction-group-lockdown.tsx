import React from 'react';
import { Icon } from '../../components/icons/icon';
import {
  restrictionIcons,
  RestrictionIcon,
} from '../../components/icons/icons';

export default {
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
      inputComponent: Icon,
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
    prepare(selection: { icon: RestrictionIcon; title: string }) {
      const { title, icon } = selection;
      return {
        title: title,

        // `media` takes a function, string or React element
        // Remember to import React from 'react' if you are rendering React components like below
        media: icon ? (
          <img
            width="36"
            height="36"
            src={restrictionIcons[icon] || undefined}
            alt="Icoon"
          />
        ) : null,
      };
    },
  },
};
