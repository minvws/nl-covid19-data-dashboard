import { REQUIRED } from '../../validation';

export const weeklySummaryCollection = {
  type: 'object',
  title: 'Thema tegel collectie',
  name: 'weeklySummaryCollection',
  fields: [
    {
      title: 'Tegels',
      name: 'tiles',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'weeklySummaryItem' } }],
      validation: REQUIRED,
    },
  ],
};
