export const cijferVerantwoording = {
  name: 'cijferVerantwoording',
  type: 'document',
  title: 'Cijferverantwoording',
  fields: [
    {
      name: 'title',
      type: 'localeString',
      title: 'Titel',
    },
    {
      name: 'collapsibleList',
      type: 'array',
      title: 'Verantwoordingen',
      description: 'Je kan verantwoordingen toevoegen, de volgorde veranderen, de teksten bijwerken of verwijderen',
      of: [{ type: 'reference', to: { type: 'cijferVerantwoordingItem' } }],
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'description.nl',
    },
  },
};
