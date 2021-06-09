export const footer = {
  name: 'footer',
  type: 'document',
  title: 'Footer',
  fields: [
    {
      title: 'Kolom 1',
      name: 'columnOne',
      type: 'footerLinkBlock',
    },
    {
      title: 'Kolom 2',
      name: 'columnTwo',
      type: 'footerLinkBlock',
    },
    {
      name: 'description',
      type: 'localeBlock',
      title: 'Beschrijving',
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'description.nl',
    },
  },
};
