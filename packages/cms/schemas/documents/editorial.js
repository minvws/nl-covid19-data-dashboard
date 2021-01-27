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
  orderings: [
    {
      title: 'publication date order',
      name: 'publicationDateOrder',
      by: [{ field: 'publicationDate' }],
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'publicationDate',
      media: 'cover',
    },
  },
};
