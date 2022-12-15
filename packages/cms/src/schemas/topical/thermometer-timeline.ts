import { REQUIRED } from '../../validation';

export const thermometerTimeline = {
  name: 'thermometerTimeline',
  type: 'document',
  title: 'Thermometer tijdslijn',
  fields: [
    {
      title: 'Titel',
      name: 'title',
      type: 'localeString',
      validation: REQUIRED,
    },
    {
      title: 'Legenda label',
      description: 'Het label bij de legenda',
      name: 'legendLabel',
      type: 'localeString',
      validation: REQUIRED,
    },
    {
      title: 'Tijdsindicator',
      description: 'Het label bij de huidige dag',
      name: 'todayLabel',
      type: 'localeString',
      validation: REQUIRED,
    },
    {
      title: 'Tooltip label',
      name: 'tooltipCurrentEstimationLabel',
      type: 'localeText',
      validation: REQUIRED,
    },
    {
      title: 'Tijdlijn gebeurtenissen',
      name: 'thermometerTimelineEvents',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'thermometerTimelineEvent' } }],
    },
  ],
};
