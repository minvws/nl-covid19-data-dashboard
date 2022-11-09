import { REQUIRED } from '../../validation';

export const trendIcon = {
  name: 'trendIcon',
  type: 'document',
  title: 'Trend icon',
  fields: [
    {
      title: 'Kleur',
      name: 'color',
      type: 'string',
      options: {
        list: [
          { value: 'RED', title: 'Rood' },
          { value: 'GREEN', title: 'Groen' },
        ],
        layout: 'dropdown',
      },
      validation: REQUIRED,
    },
    {
      title: 'Richting',
      name: 'direction',
      type: 'string',
      options: {
        list: [
          { value: 'UP', title: 'Omhoog' },
          { value: 'DOWN', title: 'Omlaag' },
        ],
        layout: 'dropdown',
      },
      validation: REQUIRED,
    },
  ],
};
