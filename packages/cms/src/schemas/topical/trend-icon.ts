import { REQUIRED } from '../../validation';

export const trendIcon = {
  name: 'trendIcon',
  type: 'document',
  title: 'Trend icon',
  __experimental_actions: ['create', 'update', 'publish'],
  fields: [
    {
      title: 'Kleur',
      description: 'De themas onderverdeeld in tegels',
      name: 'color',
      type: 'string',
      options: {
        list: [{value: 'RED', title: 'Rood'}, {value: 'GREEN', title: 'Groen'}],
        layout: 'dropdown',
      },
      validation: REQUIRED,
    },
    {
      title: 'Richting',
      description: 'De themas onderverdeeld in tegels',
      name: 'direction',
      type: 'string',
      options: {
        list: [{value: 'UP', title: 'Omhoog'}, {value: 'UP', title: 'Omlaag'}],
        layout: 'dropdown',
      },
      validation: REQUIRED,
    },
  ],
};