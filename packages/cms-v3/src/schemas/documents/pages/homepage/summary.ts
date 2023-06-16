import { localeStringValidation } from '../../../../studio/validation/locale-validation';
import { defineType, defineField, defineArrayMember } from 'sanity';

export const summary = defineType({
  type: 'object',
  title: 'Weeksamenvatting',
  name: 'weeklySummary',
  fields: [
    defineField({
      title: 'Titel',
      name: 'title',
      type: 'localeString',
      validation: localeStringValidation((rule) => rule.required()),
    }),
    defineField({
      title: 'Onderdelen',
      name: 'items',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: { type: 'weeklySummaryItem' } })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
});
