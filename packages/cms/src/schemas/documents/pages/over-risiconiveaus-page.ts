export const overRisiconiveaus = {
  name: 'overRisicoNiveaus',
  type: 'document',
  title: 'Over risico niveaus',
  fields: [
    {
      name: 'title',
      type: 'localeString',
      title: 'Titel',
      validation: (Rule: any) =>
        Rule.fields({
          nl: (fieldRule: any) => fieldRule.reset().required(),
          en: (fieldRule: any) => fieldRule.reset().required(),
        }),
    },
    {
      name: 'description',
      type: 'localeBlock',
      title: 'Beschrijving',
      validation: (Rule: any) =>
        Rule.fields({
          nl: (fieldRule: any) => fieldRule.reset().required(),
          en: (fieldRule: any) => fieldRule.reset().required(),
        }),
    },
    {
      name: 'scoreBoardTitle',
      type: 'localeString',
      title: 'Scoreboard titel',
      validation: (Rule: any) =>
        Rule.fields({
          nl: (fieldRule: any) => fieldRule.reset().required(),
          en: (fieldRule: any) => fieldRule.reset().required(),
        }),
    },
    {
      name: 'scoreBoardDescription',
      type: 'localeText',
      title: 'Scoreboard beschrijving',
      validation: (Rule: any) =>
        Rule.fields({
          nl: (fieldRule: any) => fieldRule.reset().required(),
          en: (fieldRule: any) => fieldRule.reset().required(),
        }),
    },
    {
      name: 'riskLevelExplanations',
      type: 'localeRichContentBlock',
      title: 'Verdere uitleg',
      validation: (Rule: any) =>
        Rule.fields({
          nl: (fieldRule: any) => fieldRule.reset().required(),
          en: (fieldRule: any) => fieldRule.reset().required(),
        }),
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
