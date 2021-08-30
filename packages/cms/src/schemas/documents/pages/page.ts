export const page = {
  title: 'Page',
  name: 'page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Page slug',
      description: 'How can we identify this route by page slug?',
      type: 'slug',
    },
    {
      name: 'showArticles',
      title: 'Show related articles?',
      description: 'Enable this if you want to link to articles from this page',
      type: 'boolean',
    },

    // HIGHLIGHTED_ARTICLES,
    {
      title: 'Uitgelichte artikelen',
      name: 'articles',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'article' } }],
      // validation: (rule: Rule) => rule.required().unique().max(2),
      hidden: ({ document }) => {
        console.log(document);
        return !document?.showArticles;
      },
    },
  ],
};
