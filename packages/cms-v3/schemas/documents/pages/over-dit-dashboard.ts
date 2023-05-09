import { defineType, defineField } from 'sanity';
import { localeStringValidation } from '../../../studio/i18n';

// TODO: Should these fiels have validation?

export const overDitDashboard = defineType({
  name: 'overDitDashboard',
  type: 'document',
  title: 'Over dit dashboard',
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
    }),
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'description.nl',
    },
  },
});
