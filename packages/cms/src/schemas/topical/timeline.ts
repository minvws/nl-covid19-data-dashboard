export const thermometerTimeline = {
  name: 'thermometerTimeline',
  type: 'document',
  title: 'Thermometer tijdslijn',
  __experimental_actions: ['create', 'update', 'publish'],
  fields: [
    {
      title: 'Titel',
      name: 'title',
      type: 'localeString',
    },
    {
      title: 'Lagenda label',
      description: 'Het label bij de lagenda',
      name: 'legendLabel',
      type: 'localeString',
    },
    {
      title: 'Tijdsindicator',
      description: 'Het label bij de huidige dag',
      name: 'todayLabel',
      type: 'localeString',
    },
    {
      title: 'Tooltip label',
      name: 'tooltipCurrentEstimationLabel',
      type: 'localeString',
    },
  ],
};