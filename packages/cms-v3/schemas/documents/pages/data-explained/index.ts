import { defineArrayMember, defineField, defineType } from 'sanity';

export const dataExplained = defineType({
  name: 'cijferVerantwoording',
  type: 'document',
  title: 'Cijferverantwoording',
  fields: [
    defineField({
      name: 'title',
      type: 'localeString',
      title: 'Titel',
    }),
    defineField({
      name: 'collapsibleList',
      type: 'array',
      title: 'Verantwoordingen',
      description: 'Je kan verantwoordingen toevoegen, de volgorde veranderen, de teksten bijwerken of verwijderen',
      of: [defineArrayMember({ type: 'reference', to: { type: 'cijferVerantwoordingItem' } })],
    }),
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'description.nl',
    },
  },
});
