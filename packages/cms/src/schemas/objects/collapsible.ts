export default {
  title: 'Inklapbare titel en inhoud',
  name: 'collapsible',
  type: 'object',
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
