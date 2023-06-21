import { defineField, defineType } from 'sanity';
import { localeStringValidation, localeValidation } from '../../../../studio/validation/locale-validation';

export const homepage = defineType({
  name: 'topicalPageConfig',
  type: 'document',
  title: 'Topical pagina',
  fields: [
    defineField({
      title: 'Titel',
      name: 'title',
      type: 'localeString',
      validation: localeStringValidation((rule) => rule.required()),
    }),
    defineField({
      title: 'Omschrijving',
      name: 'description',
      type: 'localeRichContentBlock',
      validation: localeValidation((rule) => rule.required()),
    }),
  ],
});
