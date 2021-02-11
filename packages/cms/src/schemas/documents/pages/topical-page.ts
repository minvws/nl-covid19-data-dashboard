export default {
  title: 'Actueel pagina',
  name: 'topicalPage',
  type: 'document',
  fields: [
    {
      title: 'Uitgelicht artikel',
      name: 'highlightedArticle',
      type: 'reference',
      to: [{ type: 'article' }],
      validation: (Rule: any) => Rule.required(),
    },
  ],
};
