import { defineArrayMember, defineField, defineType } from 'sanity';

export const themeCollection = defineType({
  type: 'document',
  title: 'Thema collectie',
  name: 'themeCollection',
  fields: [
    defineField({
      title: "Thema's",
      description: "De thema's onderverdeeld in tegels en links",
      name: 'themes',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: { type: 'theme' } })],
      validation: (rule) => rule.required(),
    }),
  ],
});
