export const titleDescriptionBlock = {
  title: 'Titel en toelichting blok',
  name: 'titleDescriptionBlock',
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
      name: 'description',
      type: 'localeBlock',
      title: 'Toelichting',
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
