export default {
  type: 'object',
  name: 'decoratedLink',
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
      title: 'Categorie',
      name: 'category',
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
    {
      title: 'Afbeelding',
      name: 'cover',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          title: 'Alternatieve tekst (toegankelijkheid)',
          name: 'alt',
          type: 'localeString',
        },
      ],
      validation: (Rule: any) => Rule.required(),
    },
  ],
};
