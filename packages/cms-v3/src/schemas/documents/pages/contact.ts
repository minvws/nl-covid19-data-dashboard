import { localeStringValidation, localeValidation } from '../../../studio/validation/locale-validation';
import { defineField, defineType } from 'sanity';

export const contact = defineType({
  name: 'contact',
  type: 'document',
  title: 'Contact',
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
