export default {
  title: 'Actueel pagina',
  name: 'topicalPage',
  type: 'document',
  fields: [
    {
      name: 'article_or_custom',
      title: 'Laat uitgelicht artikel zien.',
      type: 'boolean'
    },
    {
      title: 'Uitgelicht artikel',
      name: 'highlightedArticle',
      type: 'reference',
      to: [{ type: 'article' }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'title',
      type: 'localeString',
      title: 'Titel'
    },
    {
      name: 'summary',
      type: 'localeText',
      title: 'Descriptie',
    },
    {
      name: 'href',
      type: 'localeString',
      title: 'Link',
    }
  ],
};
