import { commonFields, commonPreview } from './shared';

export const timeSeries = {
  name: 'timeSeries',
  type: 'document',
  title: 'Time Series',
  fields: [
    ...commonFields,
    {
      title: 'Timeline Event Collections',
      name: 'timelineEventCollections',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'timelineEventCollection' }] }],
    },
  ],
  preview: commonPreview,
};
