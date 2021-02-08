export default {
  title: 'Actueel pagina',
  name: 'topicalPage',
  type: 'document',
  fields: [
    {
      name: 'isArticle',
      title: 'Laat uitgelicht artikel zien.',
      type: 'boolean',
      initialValue: {
        featured: true
      }
    },
    {
      title: 'Uitgelicht artikel',
      name: 'highlightedArticle',
      type: 'reference',
      to: [{ type: 'article' }]
    },
    {
      title: 'Teaser blok',
      name: 'customContent',
      type: 'document',
      fields: [
        {
          name: 'title',
          type: 'localeString',
          title: 'Titel'
        },
        {
          name: 'summary',
          description: 'Samenvatting',
          type: 'localeText',
          title: 'Samenvatting',
        },
        {
          name: 'label',
          type: 'localeString',
          title: 'Tekst in de link'
        },
        {
          name: 'href',
          type: 'string',
          title: 'Link naar pagina'
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
          ]
        }
      ]
    }
  ],
};
