import { HIGHLIGHTED_ARTICLES } from '../../fields/highlighted-articles';

export const pageArticles = {
  title: 'Page Articles',
  name: 'articlePageArticle',
  type: 'document',
  fields: [
    {
      name: 'page',
      title: 'Page',
      description: 'Which pages should display these articles?',
      type: 'reference',
      to: [{ type: 'articlePage' }],
    },
    HIGHLIGHTED_ARTICLES,
  ],
};
