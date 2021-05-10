export const veelgesteldeVragen = {
  name: 'veelgesteldeVragen',
  type: 'document',
  title: 'Veelgestelde vragen pagina',
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
      of: [{ type: 'reference', to: { type: 'faqQuestion' } }],
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'description.nl',
    },
  },
};
