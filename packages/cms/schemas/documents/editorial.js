import { ARTICLE_FIELDS } from './fields/article-fields';

export default {
  title: 'Weekbericht',
  name: 'editorial',
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
