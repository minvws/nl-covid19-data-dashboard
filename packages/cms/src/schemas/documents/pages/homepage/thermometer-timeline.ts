import { defineArrayMember, defineField, defineType } from 'sanity';
import { localeStringValidation } from '../../../../studio/validation/locale-validation';

export const thermometerTimeline = defineType({
  name: 'thermometerTimeline',
  type: 'document',
  title: 'Thermometer tijdslijn',
  fields: [
    defineField({
      title: 'Titel',
      name: 'title',
      type: 'localeString',
      validation: localeStringValidation((rule) => rule.required()),
    }),
    defineField({
      title: 'Legenda label',
      description: 'Het label bij de legenda',
      name: 'legendLabel',
      type: 'localeString',
      validation: localeStringValidation((rule) => rule.required()),
    }),
    defineField({
      title: 'Tijdsindicator',
      description: 'Het label bij de huidige dag',
      name: 'todayLabel',
      type: 'localeString',
      validation: localeStringValidation((rule) => rule.required()),
    }),
    defineField({
      title: 'Tooltip label',
      description: 'Extra beschrijving voor in de laatste gebeurtenis in de tijdlijn',
      name: 'tooltipCurrentEstimationLabel',
      type: 'localeText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Tijdlijn gebeurtenissen',
      name: 'thermometerTimelineEvents',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: { type: 'thermometerTimelineEvent' } })],
    }),
  ],
});
