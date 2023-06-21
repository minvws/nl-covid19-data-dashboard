import { defineField, defineType } from 'sanity';
import { localeStringValidation, localeValidation } from '../../../studio/validation/locale-validation';

export const accessibility = defineType({
  name: 'toegankelijkheid',
  type: 'document',
  title: 'Toegankelijkheid',
  fields: [
    defineField({
      name: 'title',
      type: 'localeString',
      title: 'Titel',
      validation: localeStringValidation((rule) => rule.required()),
    }),
    defineField({
      name: 'description',
      type: 'localeRichContentBlock',
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
