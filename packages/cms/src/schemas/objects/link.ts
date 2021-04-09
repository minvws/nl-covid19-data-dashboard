export default {
  title: 'Titel en toelichting blok',
  name: 'link',
  type: 'object',
  fields: [
    {
      name: 'text',
      type: 'localeString',
      title: 'Label',
      validation: (Rule: any) =>
        Rule.fields({
          nl: (fieldRule: any) => fieldRule.reset().required(),
          en: (fieldRule: any) => fieldRule.reset().required(),
        }),
    },
    {
      name: 'href',
      type: 'string',
      title: 'URL',
      validation: (Rule: any) => Rule.required(),
    }
  ],
  preview: {
    select: {
      title: 'label.nl',
      subtitle: 'href',
    },
  },
};