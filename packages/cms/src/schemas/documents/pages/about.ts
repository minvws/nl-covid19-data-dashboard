import { defineField, defineType } from 'sanity';
import { localeStringValidation, localeValidation } from '../../../studio/validation/locale-validation';

export const about = defineType({
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
      name: 'intro',
      type: 'localeBlock',
      title: 'Introductie (linkerkolom)',
      validation: localeValidation((rule) => rule.required()),
    }),
    defineField({
      name: 'timelineImage',
      type: 'localeImage',
      title: 'Afbeelding tijdslijn',
      validation: localeValidation((rule) => rule.required()),
    }),
    defineField({
      name: 'description',
      type: 'localeBlock',
      title: 'Beschrijving (rechterkolom)',
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
