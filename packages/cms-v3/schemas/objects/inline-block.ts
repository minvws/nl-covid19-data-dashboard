import { defineField, defineType } from 'sanity';
import { richContentFields } from '../fields/rich-content-fields';

export const inlineBlock = defineType({
  name: 'inlineBlock',
  type: 'object',
  title: 'Locale Block Content',
  fields: [
    defineField({
      title: 'Tekst en andere inhoud',
      name: 'inlineBlockContent',
      type: 'array',
      of: richContentFields,
    }),
  ],
});
