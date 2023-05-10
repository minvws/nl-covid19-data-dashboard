import { defineType, defineField } from 'sanity';
import { localeStringValidation, localeValidation } from '../../../studio/i18n';

export const overDitDashboard = defineType({
  name: 'overDitDashboard',
  type: 'document',
  title: 'Over dit dashboard',
  // TODO: Should these fields have validation?
  fields: [
    defineField({
      name: 'title',
      type: 'localeString',
      title: 'Titel',
      validation: localeStringValidation((rule) => rule.required()),
    }),
    defineField({
      name: 'description',
      type: 'localeBlock',
      title: 'Beschrijving',
      validation: localeValidation((rule) => rule.required()),
    }),
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'description.nl',
    },
  },
});
