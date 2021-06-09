export const footerLinkBlock = {
  title: 'Titel en toelichting blok',
  name: 'footerLinkBlock',
  type: 'object',
  fields: [
    {
      name: 'Titel',
      type: 'localeString',
      title: 'Titel',
    },
    {
      name: 'links_column_one',
      type: 'array',
      title: 'Links',
      description: 'Links',
      of: [{ type: 'link' }],
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'content.nl',
    },
  },
};
