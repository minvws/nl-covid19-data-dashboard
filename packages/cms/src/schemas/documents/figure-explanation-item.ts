export const figureExplanationItem = {
  title: 'Inklapbare titel en inhoud voor cijferverantwoording',
  name: 'figureExplanationItem',
  type: 'document',
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
      name: 'content',
      type: 'localeBlock',
      title: 'Inhoud',
      validation: (Rule: any) =>
        Rule.fields({
          nl: (fieldRule: any) => fieldRule.reset().required(),
          en: (fieldRule: any) => fieldRule.reset().required(),
        }),
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'content.nl',
    },
  },
};
