import { REQUIRED } from '../../validation';

export const measureTileCollection = {
  type: 'object',
  title: 'Thema tegel collectie',
  name: 'measureTileCollection',
  fields: [
    {
      title: 'Tegels',
      name: 'tiles',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'measureTile' } }],
      validation: REQUIRED,
    },
  ],
};
