import { ARTICLE_FIELDS } from '../fields/article-fields';

export const article = {
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
  fields: [...ARTICLE_FIELDS],
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
      date: 'publicationDate',
      media: 'cover',
    },
    prepare({ title, date }: { title: string; date: string }) {
      return {
        title,
        subtitle: new Date(date).toLocaleString(),
      };
    },
  },
};
