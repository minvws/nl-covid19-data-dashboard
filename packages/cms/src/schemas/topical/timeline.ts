
import { Rule } from '~/sanity';

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
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'Lagenda label',
      description: 'Het label bij de lagenda',
      name: 'legendLabel',
      type: 'localeString',
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'Tijdsindicator',
      description: 'Het label bij de huidige dag',
      name: 'todayLabel',
      type: 'localeString',
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'Tooltip label',
      name: 'tooltipCurrentEstimationLabel',
      type: 'localeString',
      validation: (rule: Rule) => rule.required(),
    },
  ],
};