import { commonFields, commonPreview } from './shared';

export const timeSeries = {
  name: 'timeSeries',
  type: 'document',
  title: 'Time Series',
  fields: [
    ...commonFields,
    {
      title: 'Timeline Events',
      name: 'timelineEvents',
      type: 'array',
      of: [{ type: 'timelineEvent' }],
    },
  ],
  preview: commonPreview,
};
