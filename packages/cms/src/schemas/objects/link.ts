export const link = {
  type: 'object',
  title: 'Een link voorzien van een label',
  name: 'link',
  preview: {
    select: {
      title: 'title.nl',
    },
  },
  fields: [
    {
      title: 'Titel',
      name: 'title',
      type: 'localeString',
      validation: (Rule: any) =>
        Rule.fields({
          nl: (fieldRule: any) => fieldRule.reset().required(),
          en: (fieldRule: any) => fieldRule.reset().required(),
        }),
    },
    {
      name: 'href',
      type: 'string',
      title: 'Link naar pagina',
      validation: (Rule: any) => Rule.required(),
    },
  ],
};
