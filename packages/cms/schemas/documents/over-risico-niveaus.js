export default {
  name: 'overRisicoNiveaus',
  type: 'document',
  title: 'Over risico niveaus',
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
      name: 'collapsibleList',
      type: 'array',
      title: 'Uitklapbare informatie',
      description:
        'Je kan uitklapbare informatie toevoegen, de volgorde veranderen, de teksten bijwerken of verwijderen',
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
