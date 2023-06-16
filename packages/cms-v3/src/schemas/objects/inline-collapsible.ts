import { defineField, defineType } from 'sanity';

export const inlineCollapsible = defineType({
  title: 'Inklapbare titel en inhoud',
  name: 'inlineCollapsible',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Titel',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      type: 'inlineBlock',
      title: 'Inhoud',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
});
