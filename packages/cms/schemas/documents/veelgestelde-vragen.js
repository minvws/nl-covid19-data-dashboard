export default {
  name: 'veelgesteldeVragen',
  type: 'document',
  title: 'Veelgestelde vragen',
  __experimental_actions: ['update', /* 'create', 'delete', */ 'publish'],
  fields: [
    {
      name: 'title',
      type: 'localeString',
      title: 'Titel',
      validation: (Rule) =>
        Rule.fields({
          nl: (fieldRule) => fieldRule.reset().required(),
          en: (fieldRule) => fieldRule.reset().required(),
        }),
    },
    {
      name: 'description',
      type: 'localeBlock',
      title: 'Beschrijving',
      validation: (Rule) =>
        Rule.fields({
          nl: (fieldRule) => fieldRule.reset(),
          en: (fieldRule) => fieldRule.reset(),
        }),
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
