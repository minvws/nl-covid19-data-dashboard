import { defineField, defineType } from 'sanity';
import { richTextEditorFields } from '../fields/rich-text-editor-fields';

export const inlineBlock = defineType({
  name: 'inlineBlock',
  type: 'object',
  title: 'Locale Block Content',
  fields: [
    defineField({
      title: 'Text en andere inhoud',
      name: 'inlineBlockContent',
      type: 'array',
      of: richTextEditorFields,
    }),
  ],
});
