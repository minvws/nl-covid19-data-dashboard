import { HIGHLIGHTED_ARTICLES } from '../../fields/highlighted-articles';

export const positiveTestsPage = {
  title: 'Positieve testen',
  name: 'positiveTestsPage',
  type: 'document',
  fields: [
    HIGHLIGHTED_ARTICLES,
    {
      ...HIGHLIGHTED_ARTICLES,
      title: 'Uitgelichte GGD artikelen',
      name: 'ggdArticles',
    },
  ],
};
