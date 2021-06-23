import { HIGHLIGHTED_ARTICLES } from '../../fields/highlighted-articles';

export const deceasedPage = {
  title: 'Sterfte pagina',
  name: 'deceasedPage',
  type: 'document',
  fields: [
    HIGHLIGHTED_ARTICLES,
    {
      ...HIGHLIGHTED_ARTICLES,
      title: 'Sterftemonitor artikelen',
      name: 'monitor_articles',
    },
  ],
};
