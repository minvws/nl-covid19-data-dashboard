import React from 'react';

import { Icon } from '../../components/icons/icon';
import { restrictionIcons } from '../../components/icons/icons';

export default {
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
      inputComponent: Icon,
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
    prepare(selection) {
      const { title, icon } = selection;
      return {
        title: title,

        // `media` takes a function, string or React element
        // Remember to import React from 'react' if you are rendering React components like below
        media: icon ? (
          <img
            width="36"
            height="36"
            src={restrictionIcons[icon]}
            alt="Icoon"
          />
        ) : null,
      };
    },
  },
};
