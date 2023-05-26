import { BsFileEarmarkText } from 'react-icons/bs';
import { defineType } from 'sanity';
import { ARTICLE_FIELDS } from '../fields/article-fields';

export const article = defineType({
  title: 'Artikel',
  name: 'article',
  type: 'document',
  icon: BsFileEarmarkText,
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
      by: [{ field: 'publicationDate', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
      date: 'publicationDate',
      media: 'cover',
    },
    prepare({ title, date, media }) {
      return {
        title,
        subtitle: new Date(date).toLocaleString(),
        media,
      };
    },
  },
});
