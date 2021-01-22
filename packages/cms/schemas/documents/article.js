import { ARTICLE_FIELDS } from './fields/ARTICLE_FIELDS';

export default {
  title: 'Artikel',
  name: 'article',
  type: 'document',
  fieldsets: [
    {
      title: 'Metadata',
      name: 'metadata',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
  fields: [].concat(ARTICLE_FIELDS),
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'publicationDate',
      media: 'cover',
    },
  },
};
