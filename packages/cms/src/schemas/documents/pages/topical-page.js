export default {
  title: 'Actueel pagina',
  name: 'topicalPage',
  type: 'document',
  fields: [
    {
      title: 'Titel',
      name: 'title',
      type: 'localeString',
      validation: (Rule) =>
        Rule.fields({
          nl: (fieldRule) => fieldRule.reset().required(),
          en: (fieldRule) => fieldRule.reset().required(),
        }),
    },
    {
      title: 'Samenvatting',
      description:
        'Dit is een korte samenvatting van het teaser blok die getoond wordt op de actueel pagina.',
      name: 'summary',
      type: 'localeText',
      validation: (Rule) =>
        Rule.fields({
          nl: (fieldRule) => fieldRule.reset().required().max(120),
          en: (fieldRule) => fieldRule.reset().required().max(120),
        }),
    },
    {
      name: 'label',
      type: 'localeString',
      title: 'Tekst in de link',
      validation: (Rule) =>
        Rule.fields({
          nl: (fieldRule) => fieldRule.reset().required(),
          en: (fieldRule) => fieldRule.reset().required(),
        }),
    },
    {
      name: 'href',
      type: 'string',
      title: 'Link naar pagina',
      validation: (Rule) => Rule.required(),
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
      validation: (Rule) => Rule.required(),
    },
  ],
};
