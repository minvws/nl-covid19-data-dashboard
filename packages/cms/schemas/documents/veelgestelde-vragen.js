export default {
  name: 'veelgesteldeVragen',
  type: 'document',
  title: 'Veelgestelde vragen',
  fields: [
    {
      name: 'title',
      type: 'localeString',
      title: 'Titel',
    },
    {
      name: 'description',
      type: 'localeBlock',
      title: 'Beschrijving',
    },
    {
      name: 'questions',
      type: 'array',
      title: 'Vragen',
      description:
        'Je kan veel gestelde vragen toevoegen, de volgorde veranderen, de tekst bijwerken of verwijderen',
      of: [{ type: 'collapsible' }],
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'description.nl',
    },
  },
};
