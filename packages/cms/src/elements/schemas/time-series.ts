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
    {
      title: 'Warning',
      name: 'warning',
      type: 'string',
      description:
        'De hier ingevulde tekst kan naast de waardes van deze metriek worden getoond als waarschuwing voor bijv. tijdelijke inaccuraatheid van de data. Laat leeg om de waarschuwing te verbergen.',
    },
  ],
  preview: commonPreview,
};
