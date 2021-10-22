import { HIGHLIGHTED_ARTICLES } from '../../fields/highlighted-articles';
import { PAGE_LINKS } from '../../fields/page-links';

export const vaccinationsPage = {
  title: 'Vaccinaties pagina',
  name: 'vaccinationsPage',
  type: 'document',
  fields: [
    {
      title: 'Pagina informatie',
      name: 'pageDescription',
      type: 'localeBlock',
    },
    PAGE_LINKS,
    HIGHLIGHTED_ARTICLES,
  ],
};
