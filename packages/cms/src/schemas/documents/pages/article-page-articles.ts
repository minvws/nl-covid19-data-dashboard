import { HIGHLIGHTED_ARTICLES } from '../../fields/highlighted-articles';
import { GrArticle } from 'react-icons/gr';

export const pageArticles = {
  title: 'Page Articles',
  name: 'articlePageArticle',
  type: 'document',
  icon: GrArticle,

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
  preview: {
    select: {
      article0: 'articles.0.title.nl',
      article1: 'articles.1.title.nl',
      article2: 'articles.2.title.nl',
      article3: 'articles.3.title.nl',
    },
    prepare(selection: any) {
      const { article0, article1, article2 } = selection;

      const articles = [article0, article1, article2].filter(Boolean);
      const title = articles.length > 0 ? `${articles.join(', ')}` : '';
      const subtitle =
        articles.length > 0 ? `${articles.length} artikelen` : 'Geen artikelen';

      return {
        title,
        subtitle,
      };
    },
  },
};
